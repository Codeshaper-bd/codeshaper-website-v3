/**
 * Brings the published content from the CMS into src/content, with its
 * pictures in public/cms. Runs before every build.
 *
 *   node scripts/sync-content.mjs            keeps the last content if the CMS is down
 *   node scripts/sync-content.mjs --strict   fails instead (used by "Update website")
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { mkdir, readdir, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { checkSite, toSite } from "./cms/transform.mjs";
import { tokenFor } from "../src/lib/credentials.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "src", "content");
const IMG = path.join(ROOT, "public", "cms");

export function loadEnv() {
  for (const f of [".env.local", ".env.production", ".env"]) {
    const p = path.join(ROOT, f);
    if (!existsSync(p)) continue;
    for (const line of readFileSync(p, "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
}

async function get(url, options, tries = 3) {
  for (let i = 1; ; i++) {
    try {
      const r = await fetch(url, { ...options, signal: AbortSignal.timeout(30_000) });
      if (!r.ok) throw new Error(`${r.status} from ${new URL(url).pathname}`);
      return r;
    } catch (e) {
      if (i >= tries) throw e;
      await new Promise((r) => setTimeout(r, 800 * i));
    }
  }
}

/** Download the CMS pictures used in `json`, and point at the local copies. */
async function localImages(json, base) {
  const urls = [...new Set(json.match(/https?:\/\/[^"\\\s)]+?\/cms-media\/[^"\\\s)&]+/g) ?? [])];
  await mkdir(IMG, { recursive: true });
  const map = new Map();
  let i = 0;
  const worker = async () => {
    while (i < urls.length) {
      const u = urls[i++];
      const rel = new URL(u).pathname.split("/cms-media/")[1];
      const name = createHash("sha1").update(rel).digest("hex").slice(0, 12) + "-" + path.basename(rel).replace(/[^\w.-]/g, "").slice(-50);
      const file = path.join(IMG, name);
      if (!existsSync(file)) {
        const r = await get(`${base}/cms-media/${rel}`);
        // pictures, videos and documents from the media library; nothing a browser would run
        const type = r.headers.get("content-type") ?? "";
        if (!/^(image\/(jpeg|png|webp|avif|gif)|video\/(mp4|webm)|application\/(pdf|msword|vnd\.ms-|vnd\.openxmlformats-)|text\/(csv|plain))/.test(type)) throw new Error(`not a media file: ${rel}`);
        await writeFile(file + ".tmp", Buffer.from(await r.arrayBuffer()));
        await rename(file + ".tmp", file);
      }
      map.set(u, `/cms/${name}`);
    }
  };
  await Promise.all(Array.from({ length: 6 }, worker));
  return { json: json.replace(/https?:\/\/[^"\\\s)]+?\/cms-media\/[^"\\\s)&]+/g, (u) => map.get(u) ?? u), used: new Set([...map.values()].map((v) => path.basename(v))) };
}

export async function sync({ log = console.log } = {}) {
  const base = process.env.CMS_URL?.replace(/\/$/, "");
  const token = tokenFor("content");
  if (!base || !token) throw new Error("CMS_URL and CMS_TOKEN_CONTENT are not set");
  const raw = await (await get(`${base}/api/intake/content`, { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } })).json();
  const warnings = [];
  const site = toSite(raw, (m) => warnings.push(m));
  const problems = checkSite(site);
  if (problems.length) throw new Error(problems.join("\n"));
  const { json, used } = await localImages(JSON.stringify(site), base);
  const ready = JSON.parse(json);

  await mkdir(OUT, { recursive: true });
  const files = Object.entries(ready).map(([k, v]) => [path.join(OUT, `${k}.json`), JSON.stringify(v, null, 1) + "\n"]);
  let changed = 0;
  for (const [f, text] of files) {
    if (existsSync(f) && readFileSync(f, "utf8").replace(/\r\n/g, "\n") === text) continue;
    await writeFile(f + ".tmp", text);
    await rename(f + ".tmp", f);
    changed++;
  }
  for (const f of await readdir(IMG)) if (!used.has(f)) await unlink(path.join(IMG, f)).catch(() => {});
  for (const w of warnings) log(`[cms] ${w}`);
  log(`[cms] ${changed} of ${files.length} content files changed, ${used.size} pictures`);
  return { changed, warnings };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  loadEnv();
  try {
    await sync();
  } catch (e) {
    const keep = existsSync(path.join(OUT, "services.json"));
    if (process.argv.includes("--strict") || !keep) {
      console.error(`[cms] ${e.message}`);
      process.exit(1);
    }
    console.warn(`[cms] ${e.message}. Building with the last content.`);
  }
}
