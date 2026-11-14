#!/usr/bin/env node
/**
 * 搜索索引死链检查：索引每一条结果都要能落到六站路由上。
 * 用 vite 的 ssrLoadModule 直接读应用的 search-index，避免另抄一套映射。
 * 检查项：站是否存在、必须/边缘/知识/术语锚点是否真的渲染在那一站；
 *        旧八站地址必须能映射到六站，不能 404。
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const server = await createServer({
  root: ROOT,
  configFile: path.join(ROOT, "vite.config.ts"),
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "error",
});

const failures = [];

try {
  const { SEARCH_INDEX, SEARCH_COUNT } = await server.ssrLoadModule("/src/lib/search-index.ts");
  const flow = await server.ssrLoadModule("/src/data/flow/index.ts");
  const items = await server.ssrLoadModule("/src/data/flow/items.ts");
  const terms = await server.ssrLoadModule("/src/data/terms.ts");

  const moduleIds = new Map();
  const moduleBlocks = new Map();
  flow.STATIONS.forEach((station) => {
    const ids = new Set();
    const counts = new Map();
    const walk = (list) =>
      list.forEach((module) => {
        ids.add(module.id);
        counts.set(module.id, flow.blocksForModule(module).length);
        walk(module.children ?? []);
      });
    walk(flow.modulesFor(station.id));
    moduleIds.set(station.id, ids);
    moduleBlocks.set(station.id, counts);
  });

  const routes = new Set();
  const anchors = new Map();

  SEARCH_INDEX.forEach((entry) => {
    const [pathname, hash = ""] = entry.to.split("#");
    const parts = pathname.split("/").filter(Boolean);
    if (parts[0] !== "station" || !parts[1]) {
      failures.push(`${entry.key}: 地址不在六站路由下（${entry.to}）`);
      return;
    }
    const stationId = parts[1];
    const station = flow.getStation(stationId);
    if (!station) {
      failures.push(`${entry.key}: 站 ${stationId} 没有铺`);
      return;
    }
    routes.add(pathname);
    if (hash) anchors.set(hash, (anchors.get(hash) ?? 0) + 1);

    const checkTerm = (termId) => {
      if (!terms.termsOfProcess(stationId).some((term) => term.id === termId)) {
        failures.push(`${entry.key}: 术语 ${termId} 不属于 ${stationId} 的工序`);
      }
    };

    // /station/:id —— 封面：必需、边缘、门槛、旧知识锚点、术语
    if (parts.length === 2) {
      if (!hash || hash === "gate") return;
      if (hash.startsWith("must-")) {
        if (!station.must.steps.some((item) => `must-${item.no}` === hash)) {
          failures.push(`${entry.key}: 锚点 ${hash} 不在 ${stationId} 的必需档`);
        }
        return;
      }
      if (hash.startsWith("edge-")) {
        const index = Number(hash.slice("edge-".length));
        if (!Number.isInteger(index) || index < 0 || index >= station.edge.items.length) {
          failures.push(`${entry.key}: 锚点 ${hash} 超出 ${stationId} 的边缘条目`);
        }
        return;
      }
      if (hash.startsWith("m-")) {
        // 旧索引形态，站页会重定向到 /k/<moduleId>
        const moduleId = hash.slice(2);
        if (!moduleIds.get(stationId)?.has(moduleId)) {
          failures.push(`${entry.key}: 知识 ${moduleId} 没挂在 ${stationId}`);
        }
        return;
      }
      if (hash.startsWith("term-")) {
        checkTerm(hash.slice("term-".length));
        return;
      }
      failures.push(`${entry.key}: 未知锚点类型 ${hash}`);
      return;
    }

    // /station/:id/k —— 知识目录
    if (parts.length === 3 && parts[2] === "k") {
      if (!hash) return;
      if (hash.startsWith("term-")) {
        checkTerm(hash.slice("term-".length));
        return;
      }
      failures.push(`${entry.key}: 目录页不应带锚点 ${hash}`);
      return;
    }

    // /station/:id/k/:moduleId —— 单模块正文
    if (parts.length === 4 && parts[2] === "k") {
      const moduleId = parts[3];
      if (!moduleIds.get(stationId)?.has(moduleId)) {
        failures.push(`${entry.key}: 知识 ${moduleId} 没挂在 ${stationId}`);
        return;
      }
      if (!hash) return;
      if (hash.startsWith("b-")) {
        const index = Number(hash.slice("b-".length));
        const total = moduleBlocks.get(stationId)?.get(moduleId) ?? 0;
        if (!Number.isInteger(index) || index < 0 || index >= total) {
          failures.push(`${entry.key}: 正文锚点 ${hash} 超出 ${moduleId} 的 ${total} 段`);
        }
        return;
      }
      if (hash.startsWith("item-")) {
        const itemId = hash.slice("item-".length);
        const list = items.itemsForModule(moduleId) ?? [];
        if (!list.some((item) => item.id === itemId)) {
          failures.push(`${entry.key}: 条目锚点 ${hash} 不在 ${moduleId} 的条目里`);
        }
        return;
      }
      if (hash.startsWith("term-")) {
        checkTerm(hash.slice("term-".length));
        return;
      }
      failures.push(`${entry.key}: 未知锚点类型 ${hash}`);
      return;
    }

    failures.push(`${entry.key}: 无法识别的知识路由（${entry.to}）`);
  });

  if (SEARCH_INDEX.length !== SEARCH_COUNT) {
    failures.push(`索引计数不一致（${SEARCH_INDEX.length} ≠ ${SEARCH_COUNT}）`);
  }

  // 对外只认六站；数量不对，导航与面包屑就会多出站。
  if (flow.STATIONS.length !== 6) {
    failures.push(`站点应为 6 个，实际 ${flow.STATIONS.length}`);
  }

  // 旧八站地址：每个内部步骤都要能归一到一个已铺的六站，/k 与 /k/<module> 才不会 404。
  flow.FLOW_STEPS.forEach((step) => {
    const canonical = flow.canonicalStationId(step.id);
    if (!canonical) failures.push(`旧地址 /station/${step.id}: 无法落到六站`);
    else if (!flow.getStation(canonical)) {
      failures.push(`旧地址 /station/${step.id}: 落到的 ${canonical} 没有铺`);
    }
  });

  const groups = SEARCH_INDEX.reduce((map, entry) => {
    map[entry.group] = (map[entry.group] ?? 0) + 1;
    return map;
  }, {});

  if (failures.length) {
    console.error(`✗ 死链检查未通过，${failures.length} 条：`);
    failures.forEach((message) => console.error(`  - ${message}`));
    process.exitCode = 1;
  } else {
    console.log(
      `✓ 死链检查通过：${SEARCH_COUNT} 条索引（站 ${groups.station ?? 0} / 术语 ${groups.term ?? 0}）` +
        `全部落在 ${routes.size} 个六站路由、${anchors.size} 类锚点上；旧八站地址均能归一`
    );
  }
} finally {
  await server.close();
}
