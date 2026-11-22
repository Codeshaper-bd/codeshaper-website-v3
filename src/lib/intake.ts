import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, readdir, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Hands form submissions to the CMS (codeshaper-cms), which saves them and
 * emails the team.
 *
 * If the CMS cannot be reached, the submission is written to a private folder
 * on this server and sent again automatically, so an enquiry is never lost.
 * Set LEADS_SPOOL_DIR to a folder outside the deploy directory in production.
 */
export type Submission = { kind: "leads" | "subscribers"; data: Record<string, string> };
export type Result = "ok" | "invalid" | "failed";

const DIR = () => process.env.LEADS_SPOOL_DIR || path.join(process.cwd(), ".leads-spool");
const RETRY_MS = 5 * 60_000;

async function post({ kind, data }: Submission): Promise<"ok" | "invalid" | "down"> {
  const base = process.env.CMS_URL;
  const token = process.env.CMS_INTAKE_TOKEN;
  if (!base || !token) return "down";
  try {
    const res = await fetch(`${base.replace(/\/$/, "")}/api/intake/${kind}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(6000),
      cache: "no-store",
    });
    if (res.ok) return "ok";
    return res.status === 422 ? "invalid" : "down";
  } catch {
    return "down";
  }
}

export async function submit(s: Submission): Promise<Result> {
  const sent = await post(s);
  if (sent === "ok") {
    void flush();
    return "ok";
  }
  if (sent === "invalid") return "invalid";
  try {
    const dir = DIR();
    await mkdir(dir, { recursive: true, mode: 0o700 });
    const file = path.join(dir, `${s.data.submission_id ?? randomUUID()}.json`);
    // write, then rename, so a half-written file is never read
    await writeFile(`${file}.tmp`, JSON.stringify(s), { mode: 0o600 });
    await rename(`${file}.tmp`, file);
    console.error(`[intake] CMS unreachable: ${s.kind} kept in ${dir}, will retry`);
    retryLater();
    return "ok";
  } catch (e) {
    console.error("[intake] could not keep the submission", e);
    return "failed";
  }
}

let flushing = false;
let timer: ReturnType<typeof setTimeout> | undefined;

function retryLater() {
  if (timer) return;
  timer = setTimeout(() => {
    timer = undefined;
    void flush();
  }, RETRY_MS);
  timer.unref?.();
}

/** Send everything that is waiting. Safe to call at any time. */
export async function flush() {
  if (flushing) return;
  flushing = true;
  try {
    const dir = DIR();
    const files = (await readdir(dir).catch(() => [])).filter((f) => f.endsWith(".json"));
    for (const f of files) {
      const file = path.join(dir, f);
      let s: Submission;
      try {
        s = JSON.parse(await readFile(file, "utf8")) as Submission;
      } catch {
        continue;
      }
      const sent = await post(s);
      if (sent === "down") {
        retryLater();
        return;
      }
      // refused by the CMS: set aside for a person to look at, never deleted
      if (sent === "invalid") await rename(file, `${file}.refused`);
      else await unlink(file);
    }
  } finally {
    flushing = false;
  }
}

// ── light protection for the public forms ──────────────────────────────────
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const isEmail = (v: unknown): v is string => typeof v === "string" && v.length <= 255 && EMAIL.test(v.trim());

export const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

const hits = new Map<string, number[]>();
const WINDOW = 10 * 60_000;

/** At most `max` submissions per visitor in ten minutes. */
export function tooMany(request: Request, bucket: string, max = 6) {
  // the last address is the one our own nginx saw; earlier ones can be faked
  const forwarded = request.headers.get("x-forwarded-for")?.split(",").pop()?.trim();
  const ip = request.headers.get("x-real-ip") ?? forwarded;
  if (!ip) return false;
  const now = Date.now();
  if (hits.size > 5000) for (const [k, t] of hits) if (now - t[t.length - 1] > WINDOW) hits.delete(k);
  const key = `${bucket}:${ip}`;
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW);
  if (recent.length >= max) return true;
  hits.set(key, [...recent, now]);
  return false;
}
