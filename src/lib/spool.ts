/**
 * Enquiries waiting for the CMS. When it cannot take one, it is written to a private folder on this
 * server and sent again: on a timer, when the website starts, and after the next success. Sending one
 * twice is safe: the CMS saves a submission id once, and a newsletter address once.
 *
 * No framework imports, so tests/spool.test.mjs can run it as it is.
 */
import { randomUUID } from "node:crypto";
import { mkdir, readFile, readdir, rename, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

export type Submission = { kind: "leads" | "subscribers"; data: Record<string, string> };
/**
 * ok: the CMS has it · invalid: it will never accept this one · down: nothing can be sent right now ·
 * error: this one failed, others may still go through.
 */
export type Sent = "ok" | "invalid" | "down" | "error";
export type Result = "ok" | "invalid" | "failed";
export type SpoolStatus = { pending: number; refused: number; oldestAt: string | null };

const UUID = /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;
/** After this many separate failures in one run, stop: the CMS itself is probably broken. */
const GIVE_UP_AFTER = 3;

/** Posts to the CMS. `target` is read at each send, so settings can change without a restart. */
export function httpSender(target: (kind: Submission["kind"]) => { url: string; token: string }, timeoutMs = 6000) {
  return async ({ kind, data }: Submission): Promise<Sent> => {
    const { url, token } = target(kind);
    if (!url || !token) return "down";
    try {
      const res = await fetch(`${url.replace(/\/$/, "")}/api/intake/${kind}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(timeoutMs),
        cache: "no-store",
        redirect: "error",
      });
      if (res.ok) return "ok";
      if ([400, 413, 422].includes(res.status)) return "invalid";
      if ([401, 403, 404, 429, 502, 503, 504].includes(res.status)) return "down";
      return "error";
    } catch {
      return "down";
    }
  };
}

type Options = { dir: () => string; send: (s: Submission) => Promise<Sent>; log: (...message: string[]) => void; onChange?: () => void };

export function createSpool({ dir, send, log, onChange }: Options) {
  let flushing = false;

  /** Another copy of the website may have dealt with the same file a moment ago. */
  const gone = (e: unknown) => {
    if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e;
  };
  const list = async () => await readdir(dir()).catch(() => [] as string[]);

  async function keep(s: Submission): Promise<void> {
    await mkdir(dir(), { recursive: true, mode: 0o700 });
    // the name comes from the id only when it really is one, so it can never point elsewhere
    const id = UUID.test(s.data.submission_id ?? "") ? s.data.submission_id.toLowerCase() : randomUUID();
    const file = path.join(dir(), `${id}.json`);
    const part = `${file}.${process.pid}.${randomUUID()}.tmp`;
    // write, then rename, so a half-written file is never read
    await writeFile(part, JSON.stringify(s), { mode: 0o600 });
    await rename(part, file);
  }

  async function submit(s: Submission): Promise<Result> {
    const sent = await send(s);
    if (sent === "ok") {
      void flush();
      return "ok";
    }
    if (sent === "invalid") return "invalid";
    try {
      await keep(s);
      log(`[intake] the CMS did not take it: ${s.kind} kept, will be sent again`);
      onChange?.();
      return "ok";
    } catch (e) {
      log("[intake] could not keep the submission", (e as NodeJS.ErrnoException).code ?? "unknown error");
      return "failed";
    }
  }

  /** Sends what is waiting. Safe to call at any time. */
  async function flush(): Promise<void> {
    if (flushing) return;
    flushing = true;
    let changed = false;
    try {
      let errors = 0;
      for (const name of (await list()).filter((f) => f.endsWith(".json")).sort()) {
        const file = path.join(dir(), name);
        let s: Submission;
        try {
          s = JSON.parse(await readFile(file, "utf8")) as Submission;
          if ((s.kind !== "leads" && s.kind !== "subscribers") || typeof s.data !== "object") throw new Error("shape");
        } catch (e) {
          if ((e as NodeJS.ErrnoException).code === "ENOENT") continue;
          await rename(file, `${file}.refused`).catch(gone);
          log("[intake] a waiting file could not be read and was set aside");
          changed = true;
          continue;
        }
        const sent = await send(s);
        if (sent === "down") return;
        if (sent === "error") {
          if (++errors >= GIVE_UP_AFTER) return;
          continue;
        }
        changed = true;
        // refused by the CMS: set aside for a person to look at, never deleted
        if (sent === "invalid") {
          await rename(file, `${file}.refused`).catch(gone);
          log(`[intake] the CMS refused a waiting ${s.kind} submission; it was set aside`);
        } else await unlink(file).catch(gone);
      }
    } finally {
      flushing = false;
      if (changed) onChange?.();
    }
  }

  /** Counts only: nothing from inside any file. */
  async function status(): Promise<SpoolStatus> {
    const names = await list();
    const waiting = names.filter((f) => f.endsWith(".json"));
    const times = await Promise.all(waiting.map((f) => stat(path.join(dir(), f)).then((s) => s.mtimeMs, () => null)));
    const known = times.filter((t): t is number => t !== null);
    return { pending: waiting.length, refused: names.filter((f) => f.endsWith(".refused")).length, oldestAt: known.length ? new Date(Math.min(...known)).toISOString() : null };
  }

  return { submit, flush, status };
}
