// 术语表按六站归档（TERMS 的 stations 字段不动）；工序 id 与六站 id 同值，
// 展示层直接按工序取用。八站里一个工序可含多步，术语也就跟着落在多站上。
import { PROCESSES, PROCESS_BY_ID, processForStep } from "./flow";
import { TERMS, type Term } from "./glossary";

const PROCESS_IDS = new Set(PROCESSES.map((process) => process.id));

export function termsOfProcess(processId: string): Term[] {
  if (!PROCESS_IDS.has(processId)) return [];
  return TERMS.filter((term) => term.stations.some((station) => station === processId));
}

/** 某一步所属工序的术语：同工序的几步共用一套词。 */
export function termsOfStep(stepId: string): Term[] {
  const process = processForStep(stepId);
  return process ? termsOfProcess(process.id) : [];
}

/** 术语在六站里的落点：第一条直接就是站 id。 */
export function termStation(term: Term): string | undefined {
  return term.stations.find((station) => PROCESS_IDS.has(station));
}

/** 术语所属工序的显示标签，按工序顺序。 */
export function termProcessLabels(term: Term): string[] {
  return PROCESSES.filter((process) =>
    term.stations.some((station) => station === process.id),
  ).map((process) => process.char);
}

export function searchTerms(query: string): Term[] {
  const tokens = query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
  if (!tokens.length) return TERMS;

  return TERMS.filter((term) => {
    const haystack = [
      term.zh,
      term.en,
      term.abbr ?? "",
      ...(term.aliases ?? []),
      term.def,
    ]
      .join(" ")
      .toLowerCase();
    return tokens.every((token) => haystack.includes(token));
  });
}

/** 抽屉按工序分组用：返回 [{process, terms}]，空组不返回。 */
export function termsByProcess() {
  return PROCESSES.map((process) => ({
    process,
    terms: termsOfProcess(process.id),
  })).filter((group) => group.terms.length > 0);
}

export function processTitle(processId: string): string {
  return PROCESS_BY_ID.get(processId)?.title ?? processId;
}
