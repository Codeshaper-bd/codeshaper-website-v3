/**
 * The one connection from this server's forms to the CMS: the spool (lib/spool), the worker that
 * empties it, and a report of how many enquiries are waiting, so staff can see it in the CMS.
 * Kept free of "server-only" because instrumentation.ts imports it when the server starts; it is
 * still never imported by anything that runs in a browser (lib/intake is the guarded door).
 */
import path from "node:path";
import { tokenFor } from "./credentials.mjs";
import { createSpool, httpSender, type SpoolStatus } from "./spool";

const EVERY_MS = 5 * 60_000;
const REMIND_MS = 60 * 60_000;

const cmsUrl = () => process.env.CMS_URL?.replace(/\/$/, "") ?? "";
const spoolDir = () => process.env.LEADS_SPOOL_DIR || path.join(process.cwd(), ".leads-spool");

function build() {
  let reported = "";
  let reportedAt = 0;
  const spool = createSpool({
    dir: spoolDir,
    send: httpSender((kind) => ({ url: cmsUrl(), token: tokenFor(kind) })),
    log: (...message) => console.error(...message),
    onChange: () => void report(),
  });

  /** Counts and a time only. Repeated hourly while something is waiting, so the CMS knows it is current. */
  async function report(): Promise<void> {
    const token = tokenFor("leads");
    if (!cmsUrl() || !token) return;
    try {
      const status: SpoolStatus = await spool.status();
      const text = JSON.stringify({ pending: status.pending, refused: status.refused, oldest_at: status.oldestAt });
      const waiting = status.pending + status.refused > 0;
      if (text === reported && !(waiting && Date.now() - reportedAt > REMIND_MS)) return;
      const res = await fetch(`${cmsUrl()}/api/intake/spool-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json", Authorization: `Bearer ${token}` },
        body: text,
        signal: AbortSignal.timeout(6000),
        cache: "no-store",
        redirect: "error",
      });
      if (res.ok) [reported, reportedAt] = [text, Date.now()];
    } catch {
      /* the CMS is not there: the next round tells it */
    }
  }

  async function round(): Promise<void> {
    try {
      await spool.flush();
      await report();
    } catch (e) {
      console.error("[intake] could not work through the waiting submissions", (e as NodeJS.ErrnoException).code ?? "unknown error");
    }
  }

  let timer: ReturnType<typeof setInterval> | undefined;
  /** Sends what a previous run left behind, then looks again every few minutes. */
  function start(): void {
    if (timer) return;
    if (process.env.NODE_ENV === "production" && !process.env.LEADS_SPOOL_DIR) {
      console.warn("[intake] LEADS_SPOOL_DIR is not set: waiting enquiries are inside the app folder and a new deploy may remove them");
    }
    timer = setInterval(() => void round(), EVERY_MS);
    timer.unref?.();
    setTimeout(() => void round(), 3000).unref?.();
  }

  return { submit: spool.submit, flush: spool.flush, start };
}

// the server start-up and the routes are bundled apart: share one, so only one flush runs at a time
const shared = globalThis as typeof globalThis & { __csDelivery?: ReturnType<typeof build> };

export function delivery() {
  return (shared.__csDelivery ??= build());
}
