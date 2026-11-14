#!/usr/bin/env node
/**
 * 窄屏实测：375（可加 1280/1440 对照）。
 * 只读检查：文档横向溢出、元素右缘裁切、表格在窄屏是否转成键值卡片。
 * 产出：notes/audit-shots/m<width>_*.png + 控制台 JSON。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SHOT_DIR = path.join(ROOT, "notes", "audit-shots");
const BASE = process.env.AUDIT_BASE ?? "http://localhost:4310";

const args = process.argv.slice(2);
const widthArg = args.find((item) => item.startsWith("--width="));
const width = Number(widthArg ? widthArg.split("=")[1] : 375);

const routes = [
  "/",
  "/station/qie",
  "/station/jie",
  "/station/zhuan",
  "/station/zeng",
  "/station/jian",
  "/station/yang",
  "/station/qie/k/origin",
  "/station/qie/k/polymerase-enzyme",
  "/station/qie/k/recognition-site",
  "/station/qie/k/dna-ends",
  "/station/jie/k/ligation",
  "/station/jie/k/vector",
  "/station/zhuan/k/dna-transfer-types",
  "/station/zeng/k/gmo-controversies",
  "/station/yang/k/yeast-systems",
  "/station/yang/k/yeast-promoter",
  "/station/yang/k/fusion-purification",
  "/station/jie/k/assembly",
  "/station/qie/k/prep-branch",
  "/station/zhuan/k/yeast-transformation",
  "/station/zeng/k/bacillus-host",
  "/station/zeng/k/agriculture",
  "/station/yang/k/ecoli-vector-lines",
  "/station/yang/k/insulin-case",
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

const executablePath = findBrowser();
if (!executablePath) throw new Error("未找到本机 Edge/Chrome。");

fs.mkdirSync(SHOT_DIR, { recursive: true });
const browser = await chromium.launch({ executablePath, headless: true });
const report = [];

for (const route of routes) {
  const context = await browser.newContext({
    viewport: { width, height: 812 },
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${BASE}${route}`, { waitUntil: "networkidle", timeout: 30000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(200);

  const measure = await page.evaluate(() => {
    const vw = window.innerWidth;
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

    const clipped = [];
    document.querySelectorAll("main *").forEach((element) => {
      const rect = element.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      if (rect.right <= vw + 1) return;
      if (element.closest("svg")) return;
      const style = getComputedStyle(element);
      if (style.position === "fixed") return;
      if (insideScroller(element)) return;
      clipped.push({
        tag: element.tagName.toLowerCase(),
        cls: typeof element.className === "string" ? element.className.slice(0, 60) : "",
        right: Math.round(rect.right),
      });
    });

    const tables = [...document.querySelectorAll("main table")].map((table) => ({
      cls: table.className,
      width: Math.round(table.getBoundingClientRect().width),
      display: getComputedStyle(table).display,
      cols: table.querySelectorAll("thead th").length,
      bodyWidth: Math.round(table.parentElement.getBoundingClientRect().width),
    }));

    const h1 = document.querySelector("main h1");
    const axis = document.querySelector(".axis");
    const must = document.querySelector(".must-grid");
    const stage = document.querySelector(".stage");

    return {
      vw,
      scrollWidth,
      hasHScroll: scrollWidth > vw + 1,
      clipped: clipped.slice(0, 8),
      clippedCount: clipped.length,
      tables,
      h1: h1
        ? {
            text: h1.textContent.trim().slice(0, 30),
            left: Math.round(h1.getBoundingClientRect().left),
            right: Math.round(h1.getBoundingClientRect().right),
          }
        : null,
      axisWidth: axis ? Math.round(axis.getBoundingClientRect().width) : 0,
      mustCols: must ? getComputedStyle(must).gridTemplateColumns : "",
      stageOverflowX: stage ? getComputedStyle(stage).overflowX : "",
      stageHeight: stage ? Math.round(stage.getBoundingClientRect().height) : 0,
      docHeight: Math.round(doc.scrollHeight),
    };
  });

  const name = route === "/" ? "home" : route.replace(/^\//, "").replaceAll("/", "_");
  const file = `m${width}_${name}.png`;
  await page.screenshot({ path: path.join(SHOT_DIR, file), fullPage: true });

  // 表格逐张取视口截图，便于直接看键值卡片有没有压字
  const tableShots = await page.evaluate(() =>
    [...document.querySelectorAll("main .k-table")].slice(0, 2).map((table, index) => {
      table.scrollIntoView({ block: "start" });
      return index;
    })
  );
  for (const index of tableShots) {
    const table = page.locator("main .k-table").nth(index);
    await table.scrollIntoViewIfNeeded();
    await page.waitForTimeout(120);
    await page.screenshot({
      path: path.join(SHOT_DIR, `m${width}_${name}_t${index + 1}.png`),
    });
  }

  report.push({ route, file: `notes/audit-shots/${file}`, errors, ...measure });
  await context.close();
}

await browser.close();
fs.writeFileSync(
  path.join(SHOT_DIR, `mobile-report-${width}.json`),
  JSON.stringify(report, null, 2),
  "utf8"
);

for (const item of report) {
  const tableNote = item.tables.length
    ? item.tables.map((table) => `${table.cols}列/${table.width}px/${table.display}`).join(" ")
    : "无表";
  console.log(
    `${item.route}  scroll=${item.scrollWidth}/${item.vw}  clipped=${item.clippedCount}  ` +
      `axis=${item.axisWidth}  must=[${item.mustCols}]  stage=${item.stageHeight}/${item.stageOverflowX}  h1=${item.h1 ? `${item.h1.left}–${item.h1.right}` : "无"}  ${tableNote}`
  );
}
