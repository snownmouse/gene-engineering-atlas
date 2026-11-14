// 全站检索的统一索引：六站正文、知识块、术语。
// 只收站内已经写出来的文字，不额外生成内容；地址一律落到六站路由。
import {
  KNOWLEDGE,
  STATIONS,
  blocksForModule,
  countModules,
  modulesFor,
  processForStation,
  stationForStep,
} from "../data/flow";
import type { KnowledgeModule } from "../data/flow/types";
import { itemsForModule } from "../data/flow/items";
import { MIXED_VIEWS } from "../data/flow/mixed";
import { TERMS } from "../data/glossary";
import { termStation } from "../data/terms";
import type { Block } from "../data/types";

export type SearchGroup = "station" | "term";

export interface SearchEntry {
  key: string;
  group: SearchGroup;
  /** 结果行左端的单字标记 */
  char: string;
  title: string;
  meta: string;
  body: string;
  /** 跳转地址，带锚点 */
  to: string;
}

export interface SearchHit {
  entry: SearchEntry;
  snippet: string;
  tokens: string[];
}

export interface SearchGroupResult {
  group: SearchGroup;
  total: number;
  hits: SearchHit[];
}

export const GROUP_ORDER: SearchGroup[] = ["station", "term"];

export const GROUP_LABELS: Record<SearchGroup, string> = {
  station: "站",
  term: "术语",
};

/** 正文块压成一行可检索文字；图没有文字，跳过。 */
function blockText(block: Block): string {
  switch (block.type) {
    case "p":
    case "lead":
      return block.text;
    case "list":
      return block.items.join(" ");
    case "note":
      return [block.title, ...block.lines].join(" ");
    case "definition":
      return [block.term, block.en ?? "", block.text].join(" ");
    case "table":
      return [block.caption ?? "", ...block.head, ...block.rows.flat()].join(" ");
    case "confusion":
      return block.items.map((item) => `${item.left} 对 ${item.right}：${item.note}`).join(" ");
    case "terms":
      return block.items.map((item) => `${item.term} ${item.en ?? ""} ${item.def}`).join(" ");
    case "figure":
      return block.caption;
    default:
      return "";
  }
}

function blockTitle(block: Block, index: number): string {
  if (block.type === "note") return block.title;
  if (block.type === "definition") return block.term;
  if (block.type === "list" && block.ordered) return "操作步骤";
  if (block.type === "figure") {
    const name = block.caption.split(/[：:]/)[0].trim();
    return name ? `图谱 · ${name}` : `图谱 · 第 ${index + 1} 段`;
  }
  if (block.type === "table") return block.caption ?? `表格 · 第 ${index + 1} 段`;
  return `第 ${String(index + 1).padStart(2, "0")} 段`;
}

function buildIndex(): SearchEntry[] {
  const entries: SearchEntry[] = [];

  for (const station of STATIONS) {
    const process = processForStation(station.id);
    const char = station.char;
    const no = String(station.no).padStart(2, "0");
    const base = `${no} · ${station.char} · ${station.title}`;
    const meta = `${base} · ${process?.en ?? station.en}`;
    const to = `/station/${station.id}`;

    entries.push({
      key: `station-${station.id}`,
      group: "station",
      char,
      title: station.title,
      meta,
      body: [station.question, station.summary, station.position].join(" "),
      to,
    });

    entries.push({
      key: `station-${station.id}-knowledge`,
      group: "station",
      char: "目",
      title: `${station.title} · 知识目录`,
      meta: `${base} · 知识 ${countModules(modulesFor(station.id))} 则`,
      body: (() => {
        const lines: string[] = [];
        const walk = (list: KnowledgeModule[]) =>
          list.forEach((module) => {
            lines.push(`${module.title} ${module.en} ${module.summary}`);
            walk(module.children ?? []);
          });
        walk(modulesFor(station.id));
        return lines.join(" ");
      })(),
      to: `${to}/k`,
    });

    station.must.steps.forEach((item) => {
      entries.push({
        key: `station-${station.id}-must-${item.no}`,
        group: "station",
        char,
        title: `${item.title} · 必需 ${item.no}`,
        meta: `${base} · 必需`,
        body: [item.body, item.check].join(" "),
        to: `${to}#must-${item.no}`,
      });
    });

    entries.push({
      key: `station-${station.id}-gate`,
      group: "station",
      char,
      title: `${station.title} · 走通的标准`,
      meta: `${base} · 门槛`,
      body: station.must.gate,
      to: `${to}#gate`,
    });

    station.edge.items.forEach((item, index) => {
      entries.push({
        key: `station-${station.id}-edge-${index}`,
        group: "station",
        char: "翼",
        title: item.title,
        meta: `${base} · 边缘 ${item.label}`,
        body: [item.label, item.title, item.text, item.pendingNote ?? ""].join(" "),
        to: `${to}#edge-${index}`,
      });
    });
  }

  function walk(modules: KnowledgeModule[]) {
    modules.forEach((module) => {
      let host;
      for (const hook of module.hooks) {
        host = stationForStep(hook);
        if (host) break;
      }
      if (!host) return;
      const to = `/station/${host.id}/k/${module.id}`;
      const blocks = blocksForModule(module);
      const items = itemsForModule(module.id);
      const mixed = MIXED_VIEWS[module.id];
      const tail = mixed
        ? blocks
            .map((block, index) => ({ block, index }))
            .filter(({ block }) => mixed.keep(block))
        : [];
      const hostLabel = `第 ${String(host.no).padStart(2, "0")} 站 · ${host.char}`;

      entries.push({
        key: `module-${module.id}`,
        group: "station",
        char: "知",
        title: module.title,
        meta: `${hostLabel} · 知识`,
        body: [
          module.en,
          module.summary,
          ...(items ?? []).map((item) => `${item.title} ${item.line}`),
          ...tail.map(({ block }) => blockText(block)),
        ].join(" "),
        to,
      });

      if (items) {
        // 条目视图：概念条目落到 #item-x；混排页保留的操作段仍落到 #b-x。
        items.forEach((item, index) => {
          const tableText = item.table
            ? [item.table.caption ?? "", ...item.table.head, ...item.table.rows.flat()].join(" ")
            : "";
          entries.push({
            key: `module-${module.id}-item-${item.id}`,
            group: "station",
            char: "页",
            title: `${module.title} · ${item.title}`,
            meta: `${hostLabel} · 页 ${String(index + 1).padStart(2, "0")} / ${items.length} · ${item.kind}`,
            body: [
              item.title,
              item.en ?? "",
              item.line,
              ...(item.params ?? []),
              item.confuse ?? "",
              item.dispute ?? "",
              tableText,
            ].join(" "),
            to: `${to}#item-${item.id}`,
          });
        });

        tail.forEach(({ block, index }) => {
          const text = blockText(block);
          if (!text.trim()) return;
          entries.push({
            key: `module-${module.id}-tail-${index}`,
            group: "station",
            char: "段",
            title: `${module.title} · ${blockTitle(block, index)}`,
            meta: `${hostLabel} · 操作段`,
            body: text,
            to: `${to}#b-${index}`,
          });
        });

        // 自测仍留在条目页尾部，保留一个可达锚点。
        const examIndex = blocks.findIndex(
          (block) => block.type === "note" && block.tone === "exam",
        );
        if (examIndex >= 0) {
          const exam = blocks[examIndex];
          entries.push({
            key: `module-${module.id}-exam`,
            group: "station",
            char: "测",
            title: `${module.title} · ${blockTitle(exam, examIndex)}`,
            meta: `${hostLabel} · 自测`,
            body: blockText(exam),
            to: `${to}#b-${examIndex}`,
          });
        }
      } else {
        blocks.forEach((block, index) => {
          const text = blockText(block);
          if (!text.trim()) return;
          entries.push({
            key: `module-${module.id}-block-${index}`,
            group: "station",
            char: "知",
            title: `${module.title} · ${blockTitle(block, index)}`,
            meta: `${hostLabel} · 知识段`,
            body: text,
            to: `${to}#b-${index}`,
          });
        });
      }

      walk(module.children ?? []);
    });
  }

  walk(KNOWLEDGE);

  for (const term of TERMS) {
    const station = termStation(term);
    if (!station) continue;
    entries.push({
      key: `term-${term.id}`,
      group: "term",
      char: "典",
      title: term.zh,
      meta: `术语 · ${term.en}${term.abbr ? ` · ${term.abbr}` : ""}`,
      body: [term.zh, term.en, term.abbr ?? "", ...(term.aliases ?? []), term.def].join(" "),
      to: `/station/${station}#term-${term.id}`,
    });
  }

  return entries;
}

export const SEARCH_INDEX = buildIndex();

export const SEARCH_COUNT = SEARCH_INDEX.length;
export const TERM_COUNT = TERMS.length;

function makeSnippet(text: string, tokens: string[]) {
  const lower = text.toLowerCase();
  let at = -1;
  for (const token of tokens) {
    const index = lower.indexOf(token);
    if (index >= 0 && (at < 0 || index < at)) at = index;
  }
  if (at < 0) return text.slice(0, 96);
  const start = Math.max(0, at - 24);
  const end = Math.min(text.length, at + 76);
  return `${start > 0 ? "…" : ""}${text.slice(start, end)}${end < text.length ? "…" : ""}`;
}

export function searchIndex(query: string): SearchGroupResult[] {
  const tokens = query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
  if (!tokens.length) return [];

  const hits: SearchHit[] = [];
  for (const entry of SEARCH_INDEX) {
    const haystack = `${entry.title} ${entry.meta} ${entry.body}`.toLowerCase();
    if (!tokens.every((token) => haystack.includes(token))) continue;
    hits.push({ entry, snippet: makeSnippet(entry.body || entry.title, tokens), tokens });
  }

  return GROUP_ORDER.map((group) => ({
    group,
    total: hits.filter((hit) => hit.entry.group === group).length,
    hits: hits.filter((hit) => hit.entry.group === group),
  })).filter((item) => item.total > 0);
}
