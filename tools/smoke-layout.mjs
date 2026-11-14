/**
 * 结构冒烟：先重新抓页面生成审计报告，再断言横向长卷模型真的落在页面上。
 * 覆盖：对外六站横排、三档、上下枝干、刻本字体、旧八站地址归一、旧路由已下线。
 * 报告必须是本次运行生成的；读旧报告直接失败。
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REPORT = path.join(ROOT, "preview", "layout-audit.json");
const STATION_DIR = path.join(ROOT, "src", "data", "flow", "stations");
const stationCount = fs.readdirSync(STATION_DIR).filter((name) => name.endsWith(".json")).length;

const startedAt = Date.now();

// 逐路由渲染：每条路由都要有内容、控制台无报错（含最后一页跨模块跳转）。
const renderBase = process.env.AUDIT_BASE ?? "http://localhost:4310";
const render = spawnSync(
  process.execPath,
  [path.join(ROOT, "tools", "render-check.mjs"), `--base=${renderBase}`],
  { stdio: "inherit" }
);
if (render.status !== 0) {
  console.error("smoke 失败：逐路由渲染有白屏或报错。");
  process.exit(1);
}

const crawl = spawnSync(
  process.execPath,
  [path.join(ROOT, "tools", "audit-layout.mjs"), "--tag", "smoke"],
  { stdio: "inherit" }
);
if (crawl.status !== 0) {
  console.error("smoke 失败：重新抓页面时审计脚本未通过。");
  process.exit(1);
}

if (!fs.existsSync(REPORT)) {
  console.error("smoke 失败：审计没有生成 preview/layout-audit.json。");
  process.exit(1);
}

const report = JSON.parse(fs.readFileSync(REPORT, "utf8"));
const runs = Array.isArray(report.runs) ? report.runs : [];
const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};

const generatedAt = Date.parse(report.generatedAt);
check(
  Number.isFinite(generatedAt) && generatedAt >= startedAt - 120_000,
  `审计报告过期（${report.generatedAt ?? "无时间戳"}），必须由本次 smoke 重新生成`
);
check(runs.length === 22, `审计应有 22 次运行（全部桌面 1440），实际 ${runs.length}`);

const byName = new Map();
runs.forEach((run) => {
  const list = byName.get(run.page) ?? [];
  list.push(run);
  byName.set(run.page, list);
});

// 通用检查
runs.forEach((run) => {
  const at = `${run.page} @ ${run.width}`;
  check(run.width === 1440, `${at}: 本轮只跑桌面 1440`);
  check(run.consoleErrors.length === 0, `${at}: 控制台有错误 ${run.consoleErrors.join(" | ")}`);
  check(run.overflowCount === 0, `${at}: 有元素横向溢出（${run.overflowCount}）`);
  check(run.hasHorizontalScroll === false, `${at}: 文档出现横向滚动`);
  check(run.boardLeftovers === 0, `${at}: 残留旧版面元素`);
  check(run.h1.length > 0, `${at}: 缺少 h1`);
  check(run.mainTextLength > (run.page === "legacy-map" ? 20 : 500), `${at}: 正文过短（${run.mainTextLength}）`);
  if (/^\/station\/[^/]+$/.test(run.route)) {
    check(run.spineSteps === 6, `${at}: 主轴应为六站，实际 ${run.spineSteps}`);
    check(run.tiers === 3, `${at}: 三档应齐全，实际 ${run.tiers}`);
    check(run.axisWidth > 1500, `${at}: 主轴没有横向展开（${run.axisWidth}）`);
    check(run.fontSong === true, `${at}: 宋体未加载`);
    check(run.fontKai === true, `${at}: 楷体未加载`);
    check(run.termTrigger === 1, `${at}: 站内术语抽屉入口缺失（${run.termTrigger}）`);
    check(run.pendingItems === 0, `${at}: 不应再有待核对条目（${run.pendingItems}）`);
    check(run.moduleLinks >= 1, `${at}: 站页没有知识入口`);
    check(run.knowledgeTotal >= 1, `${at}: 站页没有标出知识总数`);
  }
});

// 首页：横向长卷
const homeRuns = byName.get("home") ?? [];
homeRuns.forEach((run) => {
  const at = "home";
  check(run.route === "/", `${at}: 首页必须在根路径`);
  check(run.flowSteps === 6, `${at}: 对外应为六站，实际 ${run.flowSteps}`);
  check(run.flowReady === stationCount, `${at}: 已铺站应为 ${stationCount}，实际 ${run.flowReady}`);
  check(run.flowKnowledge === stationCount, `${at}: 已铺站应显示知识数，实际 ${run.flowKnowledge}`);
  check(run.stationLinks >= 6, `${at}: 进站链接不足（${run.stationLinks}）`);
  check(run.layerKey === 1, `${at}: 缺少两层模型说明`);
  check(run.homeTrackWidth > 2600, `${at}: 首页没有横向长卷（${run.homeTrackWidth}）`);
  check(run.woodcuts >= 6, `${at}: 木刻插图不足（${run.woodcuts}）`);
  check(run.fontSong === true && run.fontKai === true, `${at}: 刻本字体未加载`);
  check(run.scrollHeight < 1400, `${at}: 首页不应退化为竖排长页（${run.scrollHeight}）`);
});

// 路有检查
const redirectRun = (byName.get("flow-redirect") ?? [])[0];
check(Boolean(redirectRun), "缺少 /flow 重定向检查");
if (redirectRun) {
  check(redirectRun.flowSteps === 6 && redirectRun.homeTrackWidth > 2600, "/flow 未重定向到横向首页");
}

const legacyRun = (byName.get("legacy-map") ?? [])[0];
check(Boolean(legacyRun), "缺少旧路由 /map 的检查");
if (legacyRun) {
  check(legacyRun.h1.includes("这一页不在培养皿里"), "/map 旧路由没有下线");
  check(legacyRun.flowSteps === 0, "/map 旧路由仍在渲染骨架内容");
}

// 切站（01+02 合并）：知识入口固定，展开不再改变画布高度
const qieTop = (byName.get("qie-top") ?? [])[0];
const qieFull = (byName.get("qie-full") ?? [])[0];
check(Boolean(qieTop && qieFull), "缺少切站的封面/展开对照");
if (qieTop && qieFull) {
  check(qieTop.spineCurrent.includes("切出目的基因"), `qie-top: 当前位置应标「切出目的基因」，实际 ${qieTop.spineCurrent}`);
  check(qieTop.knowledgeTotal === 46, `qie-top: 知识总数应为 46，实际 ${qieTop.knowledgeTotal}`);
  check(qieTop.moduleLinks === 3, `qie-top: 顶层知识入口应为 3，实际 ${qieTop.moduleLinks}`);
  check(qieTop.openModules === 0, `qie-top: 知识应保持折叠，实际 ${qieTop.openModules}`);
  check(qieTop.mustSteps === 8, `qie-top: 必需应为 8 个动作，实际 ${qieTop.mustSteps}`);
  check(qieTop.mustGate === 1, "qie-top: 缺少门槛");
  check(qieTop.edgeItems >= 18, `qie-top: 边缘不足，实际 ${qieTop.edgeItems}`);
  check(qieFull.openModules === 0, `qie-full: 不应再有展开态，实际 ${qieFull.openModules}`);
  check(
    Math.abs(qieFull.stageHeight - qieTop.stageHeight) <= 2,
    `qie-full: 展开不应再改变画布高度（${qieTop.stageHeight} → ${qieFull.stageHeight}）`
  );
  check(qieFull.branchTop > 100, `qie-full: 上枝入口缺失（${qieFull.branchTop}）`);
  check(qieFull.branchBottom > 200, `qie-full: 下枝没有内容（${qieFull.branchBottom}）`);
  check(qieFull.woodcuts >= 1, "qie-full: 缺少木刻插图");
}

// 增站（05+08 合并）：内容合并不丢块
const zengTop = (byName.get("zeng-top") ?? [])[0];
if (zengTop) {
  check(zengTop.spineCurrent.includes("复制扩增"), `zeng-top: 当前位置错误（${zengTop.spineCurrent}）`);
  check(zengTop.knowledgeTotal === 21, `zeng-top: 知识总数应为 21，实际 ${zengTop.knowledgeTotal}`);
  check(zengTop.mustSteps === 8, `zeng-top: 必需应为 8 个动作，实际 ${zengTop.mustSteps}`);
  check(zengTop.edgeItems >= 16, `zeng-top: 边缘不足（${zengTop.edgeItems}）`);
}

// 知识目录 / 单模块正文：层级不塌平、正文纵排、面包屑可回退
const qieK = (byName.get("qie-k") ?? [])[0];
check(Boolean(qieK), "缺少知识目录页检查");
if (qieK) {
  check(qieK.h1.includes("知识"), `qie-k: 标题不对（${qieK.h1}）`);
  check(qieK.kTreeNodes === 46, `qie-k: 应列出 46 个知识节点，实际 ${qieK.kTreeNodes}`);
  check(qieK.kTreeDepth >= 1, `qie-k: 父子层级被塌平（最深 ${qieK.kTreeDepth}）`);
  check(qieK.crumbLinks >= 2, `qie-k: 面包屑不可回退（${qieK.crumbLinks}）`);
}

const qieModule = (byName.get("qie-module") ?? [])[0];
check(Boolean(qieModule), "缺少单模块正文页检查");
if (qieModule) {
  check(qieModule.h1.includes("限制性"), `qie-module: 标题不对（${qieModule.h1}）`);
  check(
    qieModule.kBlocks >= 4 || qieModule.kItems >= 4,
    `qie-module: 正文段不足（${qieModule.kBlocks} 段 / ${qieModule.kItems} 页）`
  );
  check(qieModule.crumbLinks >= 3, `qie-module: 面包屑层级不足（${qieModule.crumbLinks}）`);
  check(qieModule.termTrigger === 1, "qie-module: 缺少站内术语入口");
}

// 旧八站地址：落到六站，不是 404
const legacyTarget = (byName.get("legacy-target") ?? [])[0];
check(Boolean(legacyTarget), "缺少旧地址 /station/target 检查");
if (legacyTarget) {
  check(legacyTarget.h1.includes("切出目的基因"), `legacy-target: 未落到「切」（${legacyTarget.h1}）`);
  check(legacyTarget.spineSteps === 6, `legacy-target: 仍是八站主轴（${legacyTarget.spineSteps}）`);
}

const legacyLigateK = (byName.get("legacy-ligate-k") ?? [])[0];
check(Boolean(legacyLigateK), "缺少旧地址 /station/ligate/k 检查");
if (legacyLigateK) {
  check(legacyLigateK.h1.includes("知识"), `legacy-ligate-k: 未落到知识目录（${legacyLigateK.h1}）`);
}

const legacyApply = (byName.get("legacy-apply") ?? [])[0];
check(Boolean(legacyApply), "缺少旧地址 /station/apply 检查");
if (legacyApply) {
  check(legacyApply.h1.includes("复制扩增"), `legacy-apply: 未落到「增」（${legacyApply.h1}）`);
}

if (failures.length) {
  console.error(`\n✗ smoke 失败 ${failures.length} 条：`);
  failures.forEach((message) => console.error(`  - ${message}`));
  process.exit(1);
}

const cutOpen = (byName.get("cut-full") ?? [])[0];
console.log(
  `\n✓ smoke 通过：${runs.length} 次运行（桌面 1440）；首页横向长卷 ${homeRuns[0]?.homeTrackWidth ?? 0}px，` +
    `主轴六站横排 ${qieFull?.axisWidth ?? 0}px；知识目录 ${qieK?.kTreeNodes ?? 0} 则、最深 ${qieK?.kTreeDepth ?? 0} 层，` +
    `单模块正文 ${qieModule?.kBlocks ?? 0} 段 / ${qieModule?.kItems ?? 0} 页；旧八站地址均落到六站。`
);
