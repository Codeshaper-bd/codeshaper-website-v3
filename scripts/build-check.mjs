/**
 * A production build that touches nothing: `pnpm build:check`.
 *
 * Copies the project's own files (no .env files, no previous build) into a temporary folder and builds
 * there with the content already in the repository: no CMS, no content sync. The dev server's .next,
 * tsconfig.json and src/content stay as they are. Then looks through everything a browser would be
 * sent for the names and (made-up) values of server secrets.
 */
import { execFileSync, spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, realpathSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CMS_SCOPES } from "../src/lib/credentials.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const keep = process.argv.includes("--keep");
const work = realpathSync(mkdtempSync(path.join(tmpdir(), "cs-build-")));

const files = execFileSync("git", ["ls-files", "-z", "--cached", "--others", "--exclude-standard"], { cwd: ROOT, encoding: "utf8", maxBuffer: 64e6 }).split("\0").filter(Boolean);
for (const f of files) {
  if (/(^|\/)\.env(\.|$)/.test(f) && !f.endsWith(".example")) continue;
  if (!existsSync(path.join(ROOT, f))) continue;
  mkdirSync(path.join(work, path.dirname(f)), { recursive: true });
  cpSync(path.join(ROOT, f), path.join(work, f));
}
symlinkSync(path.join(ROOT, "node_modules"), path.join(work, "node_modules"), "dir");

const names = [...Object.values(CMS_SCOPES), "CMS_TOKEN_AI_GATEWAY", "SITE_TOKEN_PUBLISH", "PREVIEW_SIGNING_KEY", "CMS_INTAKE_TOKEN"];
const canaries = Object.fromEntries(names.map((n) => [n, `canary-${n.toLowerCase()}-5f2c9a`]));
const env = { ...process.env, ...canaries, NEXT_TELEMETRY_DISABLED: "1", NODE_ENV: "production" };
delete env.CMS_URL;
delete env.NEXT_DIST_DIR;

const built = spawnSync(process.execPath, [path.join(ROOT, "node_modules", "next", "dist", "bin", "next"), "build"], { cwd: work, env, stdio: "inherit" });
let failed = built.status !== 0;

if (!failed) {
  const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));
  // what browsers receive: scripts and styles, and the prerendered pages with their data
  const sent = [...walk(path.join(work, ".next", "static")), ...walk(path.join(work, ".next", "server", "app")).filter((f) => /\.(html|rsc|body)$/.test(f))];
  const needles = [...Object.values(canaries), ...names];
  const leaks = sent.filter((f) => {
    const text = readFileSync(f, "utf8");
    return needles.some((n) => text.includes(n));
  });
  if (leaks.length) {
    console.error(`[build-check] a server secret or its name reaches the browser in:\n${leaks.join("\n")}`);
    failed = true;
  } else console.log(`[build-check] no server secret in ${sent.length} files a browser can receive`);
}

if (keep) console.log(`[build-check] kept: ${work}`);
else rmSync(work, { recursive: true, force: true });
process.exit(failed ? 1 : 0);
