import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "preview", "manual");
const BASE = "http://localhost:5175";

const candidates = [
  process.env.AUDIT_BROWSER,
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
].filter(Boolean);
const executablePath = candidates.find((item) => fs.existsSync(item));

const browser = await chromium.launch({ executablePath, headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});
page.on("pageerror", (error) => errors.push(error.message));

await page.goto(`${BASE}/terms`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(250);

const base = await page.evaluate(() => ({
  cards: document.querySelectorAll(".term-card").length,
  groups: document.querySelectorAll(".terms-group").length,
  countLabel: document.querySelector(".terms-count")?.textContent?.trim(),
  totalLabel: document.querySelector(".px-meta")?.textContent?.trim(),
  first: document.querySelector(".term-card h3")?.textContent,
}));
await page.screenshot({ path: path.join(OUT, "terms-1440.png"), fullPage: true });

await page.click('.terms-tabs button:has-text("养")');
await page.waitForTimeout(160);
const yang = await page.evaluate(() => ({
  cards: document.querySelectorAll(".term-card").length,
  groups: document.querySelectorAll(".terms-group").length,
  first: document.querySelector(".term-card h3")?.textContent,
}));
await page.screenshot({ path: path.join(OUT, "terms-yang-1440.png"), fullPage: false });

await page.fill(".terms-search input", "限制酶");
await page.waitForTimeout(160);
const aliasSearch = await page.evaluate(() => ({
  cards: document.querySelectorAll(".term-card").length,
  names: [...document.querySelectorAll(".term-card h3")].map((el) => el.textContent),
}));

await page.fill(".terms-search input", "");
await page.click('.terms-tabs button:has-text("全部")');
await page.waitForTimeout(120);

await page.goto(`${BASE}/step/yang`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(250);
const yangStep = await page.evaluate(() => {
  const blocks = [...document.querySelectorAll(".pending-web")];
  return {
    webBlocks: blocks.length,
    heads: blocks.map((el) => el.querySelector(".pending-web-head")?.textContent?.trim()),
    srcLinks: [...document.querySelectorAll(".pending-web-src a")].map((a) => ({
      text: a.textContent?.trim(),
      href: a.getAttribute("href"),
    })),
    accessDates: [...document.querySelectorAll(".pending-web-src time")].map((el) => el.textContent),
    sideChips: document.querySelectorAll(".side-term-chips a").length,
    bodyHeight: document.body.scrollHeight,
  };
});
await page.screenshot({ path: path.join(OUT, "step-yang-web-1440.png"), fullPage: true });

await page.goto(`${BASE}/step/jie`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(250);
const jieStep = await page.evaluate(() => ({
  webBlocks: document.querySelectorAll(".pending-web").length,
  courseLabels: [...document.querySelectorAll(".pending-course-label")].map((el) => el.textContent),
  heads: [...document.querySelectorAll(".pending-web-head")].map((el) => el.textContent?.trim()),
}));

console.log(
  JSON.stringify({ base, yang, aliasSearch, yangStep, jieStep, errors }, null, 2),
);

await browser.close();
