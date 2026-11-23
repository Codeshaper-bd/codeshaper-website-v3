#!/usr/bin/env node
/**
 * Screenshots for design work: any page (or one section) at desktop, tablet
 * and phone width, so an AI assistant or a reviewer can look at the real
 * result before calling a change done (ai/rules/design.md, rule 10).
 *
 *   node scripts/ai/screenshot.mjs --url /                       # top of the homepage, 3 widths
 *   node scripts/ai/screenshot.mjs --url "/?intro=off" --selector "#products-heading"
 *   node scripts/ai/screenshot.mjs --url /products --full        # whole page
 *   node scripts/ai/screenshot.mjs --url / --widths 1440,390 --out tmp/shots
 *
 * Options
 *   --url       path or full URL (default "/"); paths go to --base
 *   --base      site origin (default http://localhost:3000, the owner's dev server)
 *   --selector  CSS selector; the screenshot starts at the section that contains it
 *   --full      capture the whole page instead of one screen
 *   --widths    comma list (default 1440,768,390)
 *   --out       output folder (default .ai-shots, git-ignored)
 *
 * Needs `playwright-core` (no browser download; it drives the Chrome already
 * installed). One-time: pnpm add -D playwright-core. Set CHROME_PATH if Chrome is
 * not in the default place.
 */
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => {
    if (a.startsWith("--")) acc.push([a.slice(2), all[i + 1] && !all[i + 1].startsWith("--") ? all[i + 1] : true]);
    return acc;
  }, []),
);

if (args.help) {
  console.log("Usage: node scripts/ai/screenshot.mjs --url <path> [--selector <css>] [--full] [--widths 1440,768,390] [--base http://localhost:3000] [--out .ai-shots]");
  process.exit(0);
}

let chromium;
try {
  ({ chromium } = await import("playwright-core"));
} catch {
  console.error("playwright-core is not installed. Run once:  pnpm add -D playwright-core");
  process.exit(1);
}

const CHROME = process.env.CHROME_PATH ?? {
  win32: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  darwin: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  linux: "/usr/bin/google-chrome",
}[process.platform];

const base = String(args.base ?? "http://localhost:3000").replace(/\/$/, "");
const url = String(args.url ?? "/");
const target = url.startsWith("http") ? url : base + (url.startsWith("/") ? url : `/${url}`);
const widths = String(args.widths ?? "1440,768,390").split(",").map(Number).filter(Boolean);
const out = resolve(String(args.out ?? ".ai-shots"));
const heights = { 1440: 900, 768: 1024, 390: 844 };
mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ executablePath: CHROME });
const slug = (url + (args.selector ? `-${args.selector}` : "")).replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "home";
const saved = [];
try {
  for (const w of widths) {
    const page = await browser.newPage({ viewport: { width: w, height: heights[w] ?? Math.round(w * 0.65) } });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    await page.goto(target, { waitUntil: "networkidle", timeout: 120_000 });
    // scroll through once so lazy sections, images and reveal animations load
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < height; y += 600) {
      await page.evaluate((v) => window.scrollTo(0, v), y);
      await page.waitForTimeout(80);
    }
    let top = 0;
    if (args.selector) {
      top = await page.evaluate((sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const box = (el.closest("section") ?? el).getBoundingClientRect();
        return Math.max(0, Math.round(box.top + window.scrollY - 24));
      }, String(args.selector));
      if (top === null) throw new Error(`No element matches ${args.selector}`);
    }
    await page.evaluate((v) => window.scrollTo(0, v), top);
    await page.waitForTimeout(1200);
    const file = `${out}/${slug}-${w}.png`;
    await page.screenshot({ path: file, fullPage: Boolean(args.full) });
    saved.push(file);
    if (errors.length) console.warn(`[${w}px] page errors:\n  ${errors.slice(0, 5).join("\n  ")}`);
    await page.close();
  }
} finally {
  await browser.close();
}
console.log(saved.join("\n"));
