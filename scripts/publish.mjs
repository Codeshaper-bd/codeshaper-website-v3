/**
 * "Update website" in the CMS ends here (started by /api/cms/publish).
 *
 * Development: only syncs the content; the dev server reloads by itself.
 * Production:  syncs, builds into a spare folder, swaps it in, restarts.
 *              If anything fails, the running site is not touched.
 */
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { copyFile, cp, mkdir, open, readdir, rename, rm, stat, unlink, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv, sync } from "./sync-content.mjs";

loadEnv();
// Windows: a lower-case drive letter (c:\…) makes webpack load some Next.js modules twice under two spellings,
// and the production build then crashes in the browser ("invariant expected layout router to be mounted").
// Always build from the upper-case spelling.
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..").replace(/^[a-z]:/, (d) => d.toUpperCase());
const id = Number(process.argv[2]);
const production = process.env.SITE_MODE === "production";
const base = process.env.CMS_URL.replace(/\/$/, "");
const CONTENT = path.join(ROOT, "src", "content");
const BACKUP = path.join(ROOT, ".content-backup", `${id}-${process.pid}`); // never shared with another run
const LOCK = path.join(ROOT, ".content-backup", "lock");

/** One update at a time. A lock older than 30 minutes belongs to a run that died. */
async function lock() {
  await mkdir(path.dirname(LOCK), { recursive: true });
  for (let i = 0; i < 2; i++) {
    try {
      const h = await open(LOCK, "wx");
      await h.write(String(process.pid));
      await h.close();
      return true;
    } catch {
      const s = await stat(LOCK).catch(() => null);
      if (s && Date.now() - s.mtimeMs < 30 * 60_000) return false;
      await unlink(LOCK).catch(() => {});
    }
  }
  return false;
}

async function report(status, message) {
  for (let i = 0; i < 5; i++) {
    try {
      const r = await fetch(`${base}/api/intake/publishes/${id}`, { method: "POST", headers: { Authorization: `Bearer ${process.env.CMS_INTAKE_TOKEN}`, "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ status, message }), signal: AbortSignal.timeout(10_000) });
      if (r.ok) return;
    } catch {
      /* try again */
    }
    await new Promise((r) => setTimeout(r, 2000 * (i + 1)));
  }
}
const run = (cmd, env = {}) =>
  new Promise((resolve, reject) => {
    const p = spawn(cmd, { cwd: ROOT, shell: true, env: { ...process.env, ...env } });
    let out = "";
    const keep = (d) => (out = (out + d).slice(-6000));
    p.stdout.on("data", keep);
    p.stderr.on("data", keep);
    p.on("close", (code) => (code === 0 ? resolve(out) : reject(new Error(out.slice(-2500) || `${cmd} stopped with ${code}`))));
  });

/**
 * IndexNow (indexnow.org): after a live update, hand the page list from the
 * live sitemap to Bing, Yandex and Seznam so new and changed pages are crawled
 * within minutes (Bing also feeds ChatGPT search and Copilot). Turned on in
 * CMS › Settings › AI and search engines. Never fails the update.
 */
async function indexNow() {
  try {
    const site = JSON.parse(await readFile(path.join(CONTENT, "site.json"), "utf8"));
    const key = site.crawlers?.indexnow;
    const origin = (process.env.NEXT_PUBLIC_SITE_URL || site.url || "").replace(/\/$/, "");
    if (!key || !/^https:\/\//.test(origin)) return;
    const xml = await (await fetch(`${origin}/sitemap.xml`, { signal: AbortSignal.timeout(30_000) })).text();
    const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim()).filter((u) => u.startsWith(origin)).slice(0, 10_000);
    if (!urlList.length) return;
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host: new URL(origin).host, key, keyLocation: `${origin}/indexnow-key.txt`, urlList }),
      signal: AbortSignal.timeout(30_000),
    });
    console.log(`[publish] IndexNow: ${urlList.length} pages, answer ${res.status}`);
  } catch (e) {
    console.warn("[publish] IndexNow skipped:", e.message ?? e);
  }
}

if (!(await lock())) {
  await report("failed", "Another update is still running. Try again in a few minutes.");
  process.exit(1);
}
try {
  await report("running");
  if (existsSync(CONTENT)) await cp(CONTENT, BACKUP, { recursive: true });
  const { warnings } = await sync();
  if (production) {
    const live = path.join(ROOT, process.env.NEXT_DIST_DIR || ".next");
    const next = path.join(ROOT, ".next-update");
    const old = path.join(ROOT, ".next-old");
    const tsconfig = await readFile(path.join(ROOT, "tsconfig.json"), "utf8");
    await rm(next, { recursive: true, force: true });
    try {
      await run("npx next build", { NEXT_DIST_DIR: ".next-update", NODE_ENV: "production" });
    } finally {
      await writeFile(path.join(ROOT, "tsconfig.json"), tsconfig); // next rewrites it for the folder name
    }
    if (!existsSync(path.join(next, "BUILD_ID"))) throw new Error("The build did not finish.");
    await rm(old, { recursive: true, force: true });
    await mkdir(path.dirname(live), { recursive: true });
    if (existsSync(live)) await rename(live, old);
    await rename(next, live);
    if (process.env.SITE_RESTART) await run(process.env.SITE_RESTART);
  }
  // the dev server remembers which addresses exist: ask twice so new pages show at once
  if (!production && process.argv[3]) {
    await new Promise((r) => setTimeout(r, 1500));
    for (let i = 0; i < 2; i++) for (const p of ["", "/blog", "/blog/category", "/blog/tag", "/services", "/case-studies", "/products", "/industries"]) await fetch(`${process.argv[3]}${p}/x-refresh`, { signal: AbortSignal.timeout(60_000) }).catch(() => {});
  }
  await report("live", warnings.join("\n") || undefined);
  if (production) await indexNow();
} catch (e) {
  // put the last good content back, file by file, so the next build is not broken
  if (existsSync(BACKUP)) for (const file of await readdir(BACKUP)) await copyFile(path.join(BACKUP, file), path.join(CONTENT, file)).catch(() => {});
  console.error("[publish]", e);
  await report("failed", String(e.message ?? e).slice(-3000));
  process.exitCode = 1;
} finally {
  await rm(BACKUP, { recursive: true, force: true }).catch(() => {});
  await unlink(LOCK).catch(() => {});
}
