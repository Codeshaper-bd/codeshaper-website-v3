/**
 * The pure rules of a conversation connected to the gateway: what an answer means, and when the
 * session will end. The CMS decides both; this only reads them. Only type imports.
 */
import type { AssistantResponse, ErrorCode, ResponseError } from "./contract";

/** Must match codeshaper-cms config/ai.php `sessions.notice_version`: it records which note was accepted. */
export const NOTICE_VERSION = "dev-2026-11-26";

export type Outcome =
  | { state: "done" }
  | { state: "cancelled"; retry: ResponseError["retry"] }
  | { state: "problem"; problem: ErrorCode; retry: ResponseError["retry"] };

export function outcomeOf(r: AssistantResponse): Outcome {
  if (!r.error) return { state: "done" };
  return r.error.code === "cancelled" ? { state: "cancelled", retry: r.error.retry } : { state: "problem", problem: r.error.code, retry: r.error.retry };
}

export type SessionTimes = { expires_at: string; idle_expires_at: string; turns_left: number; max_chars: number };
/** In this browser's own milliseconds: the longest life, the idle end, and how long an idle period is. */
export type Clock = { expiresAt: number; idleEndsAt: number; fullIdleMs: number };

export const WARN_MS = 2 * 60_000;
/** The CMS's idle limit (config/ai.php); a longer one it reports takes its place. */
const IDLE_MS = 30 * 60_000;

/**
 * The server's times are turned into this browser's, using the server's own idea of now, so a wrong
 * computer clock does not matter. A time that cannot be read ends the session here rather than
 * letting it seem endless.
 */
export function trackSession(info: SessionTimes, now: number, serverNow: number): Clock {
  const left = (iso: string) => {
    const ms = Date.parse(iso) - serverNow;
    return Number.isFinite(ms) ? ms : 0;
  };
  const idle = left(info.idle_expires_at);
  return { expiresAt: now + left(info.expires_at), idleEndsAt: now + idle, fullIdleMs: Math.max(IDLE_MS, idle) };
}

/** The server counted activity just now. */
export const touched = (c: Clock, now: number): Clock => ({ ...c, idleEndsAt: now + c.fullIdleMs });
/** The same object when it is over already: nothing watching it starts again. */
export const ended = (c: Clock, now: number): Clock => (c.idleEndsAt <= now ? c : { ...c, idleEndsAt: now });

export type ClockState = { state: "ok" | "idle_warning" | "lifetime_warning" | "expired"; msLeft: number };

export function sessionClock(c: Clock, now: number, warnMs = WARN_MS): ClockState {
  const end = Math.min(c.idleEndsAt, c.expiresAt);
  const msLeft = Math.max(0, end - now);
  if (msLeft === 0) return { state: "expired", msLeft };
  if (msLeft > warnMs) return { state: "ok", msLeft };
  // renewing helps only when it is the idle limit that is near
  return { state: c.expiresAt <= c.idleEndsAt ? "lifetime_warning" : "idle_warning", msLeft };
}
