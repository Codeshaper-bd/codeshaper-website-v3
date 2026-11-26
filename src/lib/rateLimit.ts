/**
 * Limits for the public routes, each kind with its own allowance.
 *
 * Two limits each time. Per visitor, using the address our own nginx saw (it overwrites these headers;
 * a visitor can only forge them by reaching this server directly, which the firewall must prevent).
 * And an overall one that does not depend on any header, so forging addresses, or arriving with none,
 * still ends somewhere. Kept in memory: a restart clears it. nginx limit_req is the second layer
 * (codeshaper-cms/deploy), and the CMS keeps its own limits in its database.
 */
type Policy = { perVisitor: number; overall: number; windowMs: number };

const TEN_MINUTES = 10 * 60_000;

export const POLICIES = {
  contact: { perVisitor: 6, overall: 100, windowMs: TEN_MINUTES },
  newsletter: { perVisitor: 6, overall: 100, windowMs: TEN_MINUTES },
  blog: { perVisitor: 300, overall: 6000, windowMs: TEN_MINUTES },
  // counted only after the publish secret has been checked
  publish: { perVisitor: 20, overall: 20, windowMs: TEN_MINUTES },
  // the AI gateway (lib/ai/gateway): messages and reads, and the starting of sessions
  ai: { perVisitor: 120, overall: 1200, windowMs: TEN_MINUTES },
  aiSession: { perVisitor: 10, overall: 200, windowMs: TEN_MINUTES },
} satisfies Record<string, Policy>;

export type Bucket = keyof typeof POLICIES;

/** The address our proxy saw: it sets x-real-ip, and appends last to x-forwarded-for. */
function visitor(headers: Headers): string | null {
  return headers.get("x-real-ip")?.trim() || headers.get("x-forwarded-for")?.split(",").pop()?.trim() || null;
}

/** A full overall ceiling turns real visitors away too, so someone should know. Only the kind of form is named. */
const warn = (bucket: Bucket) => console.warn(`[limits] the overall ${bucket} limit is full: new visitors are being refused`);

/** A limiter: answers true when this request must be refused. */
export function createLimiter(now: () => number = Date.now, onFull: (bucket: Bucket) => void = warn) {
  const hits = new Map<string, number[]>();
  const reportedAt = new Map<Bucket, number>();
  const recent = (key: string, windowMs: number) => (hits.get(key) ?? []).filter((t) => now() - t < windowMs);

  return function tooMany(headers: Headers, bucket: Bucket): boolean {
    const { perVisitor, overall, windowMs } = POLICIES[bucket];
    if (hits.size > 5000) for (const [k, t] of hits) if (now() - (t.at(-1) ?? 0) >= TEN_MINUTES) hits.delete(k);

    const who = visitor(headers);
    const mine = who ? `${bucket}:${who.slice(0, 64)}` : null;
    const own = mine ? recent(mine, windowMs) : [];
    if (mine && own.length >= perVisitor) return true;

    // checked second, so someone already blocked uses up nothing of what everyone shares
    const all = recent(bucket, windowMs);
    if (all.length >= overall) {
      const last = reportedAt.get(bucket);
      if (last === undefined || now() - last >= windowMs) {
        reportedAt.set(bucket, now());
        onFull(bucket);
      }
      return true;
    }

    hits.set(bucket, [...all, now()]);
    if (mine) hits.set(mine, [...own, now()]);
    return false;
  };
}
