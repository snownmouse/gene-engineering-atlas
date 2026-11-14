#!/usr/bin/env node
/**
 * 逐路由渲染检查：每条路由都必须渲染出内容，且控制台无报错。
 * 另外做一轮「跨模块点击」：从某页最后一页点进另一个模块，守住组件实例复用带来的状态残留。
 * 用法：node tools/render-check.mjs [--base=http://localhost:4310]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";
import { chromium } from "playwright-core";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const baseArg = args.find((arg) => arg.startsWith("--base="));
const base = (baseArg ? baseArg.slice("--base=".length) : process.env.AUDIT_BASE ?? "http://localhost:4310").replace(/\/$/, "");

function findBrowser() {
  const candidates = [
    process.env.AUDIT_BROWSER,
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  ].filter(Boolean);
  return candidates.find((candidate) => fs.existsSync(candidate));
}

const ERROR_UI = /Unexpected Application Error|Cannot read properties|Minified React error|页面出错/i;

const server = await createServer({
  root: ROOT,
  configFile: path.join(ROOT, "vite.config.ts"),
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "error",
});

let routes;
let itemized;
try {
  const { SEARCH_INDEX, SEARCH_COUNT } = await server.ssrLoadModule("/src/lib/search-index.ts");
  const flow = await server.ssrLoadModule("/src/data/flow/index.ts");
  const itemsMod = await server.ssrLoadModule("/src/data/flow/items.ts");

  const set = new Set(["/"]);
  SEARCH_INDEX.forEach((entry) => set.add(entry.to.split("#")[0]));
  itemized = [];
  flow.STATIONS.forEach((station) => {
    set.add(`/station/${station.id}`);
    set.add(`/station/${station.id}/k`);
    const walk = (list) =>
      list.forEach((module) => {
        const route = `/station/${station.id}/k/${module.id}`;
        set.add(route);
        const items = itemsMod.itemsForModule(module.id);
        if (items?.length) itemized.push({ stationId: station.id, route, last: items[items.length - 1].id });
        walk(module.children ?? []);
      });
    walk(flow.modulesFor(station.id));
  });
  routes = [...set].sort();
  console.log(`· 路由 ${routes.length} 条（检索索引 ${SEARCH_COUNT} 条结果）`);
} finally {
  await server.close();
}

const executablePath = findBrowser();
if (!executablePath) {
  console.error("✗ 未找到本机 Edge/Chrome。可用 AUDIT_BROWSER 指定路径。");
  process.exit(1);
}

const browser = await chromium.launch({ executablePath, headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
const failures = [];
let jumped = 0;

function watch() {
  const errors = [];
  const onConsole = (message) => {
    if (message.type() === "error") errors.push(`console: ${message.text().split("\n")[0]}`);
  };
  const onError = (error) => errors.push(`pageerror: ${error.message}`);
  page.on("console", onConsole);
  page.on("pageerror", onError);
  return { errors, stop: () => { page.off("console", onConsole); page.off("pageerror", onError); } };
}

try {
  for (const route of routes) {
    const watcher = watch();
    try {
      await page.goto(`${base}${route}`, { waitUntil: "load", timeout: 30000 });
      await page.waitForTimeout(120);
      const text = await page.locator("#root").innerText().catch(() => "");
      if (!text.trim()) watcher.errors.push("blank: #root 没有渲染内容");
      else if (ERROR_UI.test(text.slice(0, 400))) {
        watcher.errors.push(`error-ui: ${text.trim().slice(0, 120).replace(/\s+/g, " ")}`);
      }
    } catch (error) {
      watcher.errors.push(`goto: ${error.message}`);
    }
    watcher.stop();
    if (watcher.errors.length) {
      failures.push(`✗ ${route}\n    ${watcher.errors.join("\n    ")}`);
      console.log(`✗ ${route}`);
    }
  }

  // 跨模块点击：最后一页 → 另一个模块，验证换模块时页码与动画状态不残留。
  for (const entry of itemized) {
    const watcher = watch();
    try {
      await page.goto(`${base}${entry.route}#item-${entry.last}`, { waitUntil: "load", timeout: 30000 });
      await page.waitForTimeout(160);
      const href = await page.evaluate(() => {
        const link = [...document.querySelectorAll('a[href*="/k/"]')].find((node) => {
          const target = node.getAttribute("href") ?? "";
          return /^\/station\/[^/]+\/k\/[^/#?]+/.test(target) && target.split("#")[0] !== location.pathname;
        });
        return link?.getAttribute("href") ?? "";
      });
      if (!href) continue;
      jumped += 1;
      await page.evaluate((target) => {
        const link = [...document.querySelectorAll("a")].find((node) => node.getAttribute("href") === target);
        link?.click();
      }, href);
      await page.waitForTimeout(300);
      const text = await page.locator("#root").innerText().catch(() => "");
      if (!text.trim()) watcher.errors.push(`blank: 点进 ${href} 后没有内容`);
      else if (ERROR_UI.test(text.slice(0, 400))) {
        watcher.errors.push(`error-ui ${href}: ${text.trim().slice(0, 120).replace(/\s+/g, " ")}`);
      }
    } catch (error) {
      watcher.errors.push(`click: ${error.message}`);
    }
    watcher.stop();
    if (watcher.errors.length) {
      failures.push(`✗ ${entry.route} → 下一个模块\n    ${watcher.errors.join("\n    ")}`);
      console.log(`✗ ${entry.route} → 下一个模块`);
    }
  }
} finally {
  await browser.close();
}

if (failures.length) {
  console.error(`\n✗ 逐路由渲染检查未通过，${failures.length} 条：`);
  failures.forEach((message) => console.error(message));
  process.exit(1);
}

console.log(
  `\n✓ 逐路由渲染通过：${routes.length} 条路由全部有内容、控制台无报错；` +
    `${itemized.length} 个条目模块里 ${jumped} 次跨模块跳转无残留。`
);
