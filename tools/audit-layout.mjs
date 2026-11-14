#!/usr/bin/env node
/**
 * 版面审计（桌面单线：1440 + 1280）
 * 检查：骨架入口、站页三档、主轴常驻、知识展开、横向溢出。
 * 产出：preview/layout-audit.json + .screenshots/*.png
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PREVIEW_DIR = path.join(ROOT, "preview");
const SHOT_DIR = path.join(ROOT, ".screenshots");

const args = process.argv.slice(2);
const baseArg = args.find((arg) => arg.startsWith("--base="));
const base = (baseArg ? baseArg.slice("--base=".length) : process.env.AUDIT_BASE ?? "http://localhost:4310").replace(/\/$/, "");
const tagArg = args.find((arg) => arg.startsWith("--tag="));
const tag = tagArg ? tagArg.slice("--tag=".length) : "run";

const views = [
  { name: "home", route: "/", fullPage: true, widths: [1440] },
  { name: "qie-top", route: "/station/qie", widths: [1440] },
  { name: "qie-must", route: "/station/qie", scrollTo: '[data-tier="must"]', widths: [1440] },
  { name: "qie-edge", route: "/station/qie", scrollTo: '[data-tier="edge"]', widths: [1440] },
  { name: "qie-full", route: "/station/qie", fullPage: true, widths: [1440] },
  { name: "qie-k", route: "/station/qie/k", fullPage: true, widths: [1440] },
  { name: "qie-module", route: "/station/qie/k/restriction-enzyme", fullPage: true, widths: [1440] },
  { name: "jie-top", route: "/station/jie", widths: [1440] },
  { name: "jie-full", route: "/station/jie", fullPage: true, widths: [1440] },
  { name: "zhuan-top", route: "/station/zhuan", widths: [1440] },
  { name: "zhuan-full", route: "/station/zhuan", fullPage: true, widths: [1440] },
  { name: "zeng-top", route: "/station/zeng", widths: [1440] },
  { name: "zeng-full", route: "/station/zeng", fullPage: true, widths: [1440] },
  { name: "jian-top", route: "/station/jian", widths: [1440] },
  { name: "jian-full", route: "/station/jian", fullPage: true, widths: [1440] },
  { name: "yang-top", route: "/station/yang", widths: [1440] },
  { name: "yang-full", route: "/station/yang", fullPage: true, widths: [1440] },
  // 旧八站地址：应落到六站，不应 404。
  { name: "legacy-target", route: "/station/target", widths: [1440] },
  { name: "legacy-ligate-k", route: "/station/ligate/k", fullPage: true, widths: [1440] },
  { name: "legacy-apply", route: "/station/apply", widths: [1440] },
  { name: "flow-redirect", route: "/flow", widths: [1440] },
  { name: "legacy-map", route: "/map", widths: [1440] },
];

function findBrowser() {
  const candidates = [
    process.env.AUDIT_BROWSER,
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  ].filter(Boolean);
  return candidates.find((candidate) => fs.existsSync(candidate));
}

async function auditPage(browser, view, width) {
  const context = await browser.newContext({
    viewport: { width, height: 960 },
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto(`${base}${view.route}`, { waitUntil: "networkidle", timeout: 30000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250);

  if (view.expandAll) {
    await page.evaluate(() => {
      document.querySelectorAll("details[data-module]").forEach((node) => {
        node.open = true;
      });
    });
    await page.waitForTimeout(250);
  }

  if (view.scrollTo) {
    await page.evaluate((selector) => {
      const target = document.querySelector(selector);
      if (!target) return;
      const top = target.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo(0, Math.max(0, top));
    }, view.scrollTo);
    await page.waitForTimeout(350);
  }

  const audit = await page.evaluate(() => {
    const viewportWidth = window.innerWidth;
    const doc = document.documentElement;
    const scrollWidth = Math.max(doc.scrollWidth, document.body.scrollWidth);

    const insideScroller = (element) => {
      let node = element.parentElement;
      while (node && node !== document.body) {
        const style = getComputedStyle(node);
        if (/(auto|scroll)/.test(style.overflowX)) return true;
        node = node.parentElement;
      }
      return false;
    };

    const overflowElements = [];
    document.querySelectorAll("body *").forEach((element) => {
      const rect = element.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      if (rect.right <= viewportWidth + 1 && rect.left >= -1) return;
      if (element.closest("svg")) return;
      const style = getComputedStyle(element);
      if (style.position === "fixed") return;
      if (/(auto|scroll|hidden)/.test(style.overflowX)) return;
      if (insideScroller(element)) return;
      overflowElements.push({
        tag: element.tagName.toLowerCase(),
        className: typeof element.className === "string" ? element.className.slice(0, 80) : "",
        left: Math.round(rect.left),
        right: Math.round(rect.right),
      });
    });

    const main = document.querySelector("main");
    return {
      viewportWidth,
      scrollWidth,
      hasHorizontalScroll: scrollWidth > viewportWidth + 1,
      overflowElements: overflowElements.slice(0, 12),
      overflowCount: overflowElements.length,
      title: document.title,
      h1: document.querySelector("h1")?.textContent?.trim() ?? "",
      mainTextLength: main?.innerText?.length ?? 0,
      flowSteps: document.querySelectorAll("[data-flow-step]").length,
      flowReady: document.querySelectorAll('[data-flow-ready="true"]').length,
      flowKnowledge: document.querySelectorAll("[data-flow-knowledge]").length,
      stationLinks: document.querySelectorAll('a[href^="/station/"]').length,
      layerKey: document.querySelectorAll("[data-layer-key]").length,
      spineSteps: document.querySelectorAll("[data-spine-step]").length,
      spineCurrent: document.querySelector("[data-spine-current]")?.textContent?.trim() ?? "",
      tiers: document.querySelectorAll("[data-tier]").length,
      mustSteps: document.querySelectorAll("[data-must-step]").length,
      mustGate: document.querySelectorAll("[data-must-gate]").length,
      modules: document.querySelectorAll("[data-module]").length,
      openModules: document.querySelectorAll("[data-module][open]").length,
      moduleLinks: document.querySelectorAll("[data-module-link]").length,
      knowledgeTotal: Number(
        document.querySelector("[data-knowledge-total]")?.getAttribute("data-knowledge-total") ?? 0
      ),
      kTreeNodes: document.querySelectorAll("[data-k-node]").length,
      kTreeDepth: Math.max(
        0,
        ...[...document.querySelectorAll("[data-k-depth]")].map((node) =>
          Number(node.getAttribute("data-k-depth"))
        )
      ),
      kBlocks: document.querySelectorAll("[data-k-block]").length,
      kItems: document.querySelectorAll(".k-item-index li").length,
      crumbLinks: document.querySelectorAll(".k-crumb a").length,
      hookChips: document.querySelectorAll("[data-hook]").length,
      edgeItems: document.querySelectorAll("[data-edge-item]").length,
      pendingItems: document.querySelectorAll('[data-edge-item][data-pending="true"]').length,
      bridgeCells: document.querySelectorAll("[data-bridge] .bridge-cell").length,
      navSteps: document.querySelectorAll(".station-step").length,
      position: document.querySelectorAll("[data-position]").length,
      boardLeftovers: document.querySelectorAll(
        "[data-act], .act-list, .board-body, [data-move], [data-story-figure]"
      ).length,
      scrollY: Math.round(window.scrollY),
      scrollHeight: Math.max(doc.scrollHeight, document.body.scrollHeight),
      stageWidth: document.querySelector(".stage")?.scrollWidth ?? 0,
      stageHeight: document.querySelector(".stage")?.scrollHeight ?? 0,
      homeTrackWidth: document.querySelector(".scroll-track")?.scrollWidth ?? 0,
      branchTop: document.querySelector('[data-tier="expand"]')?.scrollHeight ?? 0,
      branchBottom: document.querySelector('[data-tier="edge"]')?.scrollHeight ?? 0,
      axisWidth: document.querySelector(".axis")?.scrollWidth ?? 0,
      woodcuts: document.querySelectorAll(".woodcut").length,
      processMarks: document.querySelectorAll("[data-process]").length,
      processResumed: document.querySelectorAll('[data-process-resumed="true"]').length,
      termTrigger: document.querySelectorAll("[data-term-trigger]").length,
      fontSong: document.fonts.check('16px "GeZhiSong"'),
      fontKai: document.fonts.check('16px "GeZhiKai"'),
    };
  });

  fs.mkdirSync(SHOT_DIR, { recursive: true });
  const screenshotName = `${view.name}-${width}-${tag}.png`;
  await page.screenshot({
    path: path.join(SHOT_DIR, screenshotName),
    fullPage: view.fullPage === true,
  });
  await context.close();

  return {
    page: view.name,
    route: view.route,
    width,
    fullPage: view.fullPage === true,
    expandAll: view.expandAll === true,
    ...audit,
    consoleErrors,
    pageErrors,
    screenshot: path.relative(ROOT, path.join(SHOT_DIR, screenshotName)).replaceAll("\\", "/"),
  };
}

async function main() {
  const executablePath = findBrowser();
  if (!executablePath) {
    throw new Error("未找到本机 Edge/Chrome。可用 AUDIT_BROWSER 环境变量指定可执行文件路径。");
  }

  const browser = await chromium.launch({ executablePath, headless: true });
  const runs = [];
  try {
    for (const view of views) {
      for (const width of view.widths) {
        process.stdout.write(`· ${view.name} @ ${width}px ... `);
        const result = await auditPage(browser, view, width);
        runs.push(result);
        const flags = [];
        if (result.consoleErrors.length) flags.push(`控制台 ${result.consoleErrors.length}`);
        if (result.pageErrors.length) flags.push(`页面错误 ${result.pageErrors.length}`);
        if (result.overflowCount) flags.push(`溢出 ${result.overflowCount}`);
        if (result.hasHorizontalScroll) flags.push("横向滚动");
        console.log(flags.length ? flags.join(" / ") : "OK");
      }
    }
  } finally {
    await browser.close();
  }

  fs.mkdirSync(PREVIEW_DIR, { recursive: true });
  const report = {
    generatedAt: new Date().toISOString(),
    base,
    browser: executablePath,
    tag,
    runs,
  };
  const file = path.join(PREVIEW_DIR, "layout-audit.json");
  fs.writeFileSync(file, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`\n审计报告：${path.relative(ROOT, file)}`);
  console.log(`截图目录：${path.relative(ROOT, SHOT_DIR)}`);
}

main().catch((error) => {
  console.error(`\n审计失败：${error.message}`);
  console.error("请先启动预览服务：npm run preview -- --port 4310");
  process.exit(1);
});
