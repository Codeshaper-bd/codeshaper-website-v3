import "server-only";
import { delivery } from "./delivery";
import { createLimiter, type Bucket } from "./rateLimit";
import type { Result, Submission } from "./spool";

/**
 * Hands form submissions to the CMS (codeshaper-cms), which saves them and
 * emails the team.
 *
 * If the CMS cannot be reached, the submission is written to a private folder
 * on this server and sent again automatically, also after a restart
 * (lib/spool, lib/delivery). Set LEADS_SPOOL_DIR to a folder outside the
 * deploy directory in production.
 */
export type { Result, Submission };

export function submit(s: Submission): Promise<Result> {
  const d = delivery();
  d.start();
  return d.submit(s);
}

// ── light protection for the public forms ──────────────────────────────────
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const isEmail = (v: unknown): v is string => typeof v === "string" && v.length <= 255 && EMAIL.test(v.trim());

export const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

const limiter = createLimiter();

/** True when this request must be refused. Each kind has its own allowance (lib/rateLimit). */
export const tooMany = (request: Request, bucket: Bucket) => limiter(request.headers, bucket);
