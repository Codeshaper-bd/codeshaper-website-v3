import "server-only";
import { tokenFor } from "./credentials.mjs";
import { REACTIONS, type BlogEvent, type PublicStats, type ReactionId } from "./blogReactions";

/**
 * Blog numbers live in the CMS (post_metrics: views, reads, time,
 * reactions per post per day; the admin shows them). This server is the
 * only one that talks to it (same token as the forms, lib/intake).
 *
 * Public numbers (owner, 24 Nov 2026): the count on cards and articles is
 * the number of times the article was opened; the CMS also keeps "reads"
 * (scrolled through and stayed) and time, for the team.
 *
 * When the CMS cannot be reached (local work without it), events are kept
 * in memory so the page still behaves; they are not sent later.
 */
type Totals = Record<string, PublicStats>;
type CmsTotals = Record<string, { views: number; reads: number; reactions: Partial<Record<ReactionId, number>> }>;

const CACHE_MS = 60_000;
let cache: { at: number; data: Totals } | null = null;
let inflight: Promise<Totals> | null = null;
let cmsDownUntil = 0;
const local = new Map<string, PublicStats>();

const emptyReactions = () => Object.fromEntries(REACTIONS.map((r) => [r.id, 0])) as Record<ReactionId, number>;

function cms(): { base: string; token: string } | null {
  const base = process.env.CMS_URL;
  const token = tokenFor("blog");
  return base && token ? { base: base.replace(/\/$/, ""), token } : null;
}

async function fetchTotals(): Promise<Totals | null> {
  const c = cms();
  if (!c) return null;
  try {
    const res = await fetch(`${c.base}/api/intake/blog/totals`, {
      headers: { Accept: "application/json", Authorization: `Bearer ${c.token}` },
      signal: AbortSignal.timeout(4000),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const raw = (await res.json()) as CmsTotals;
    const out: Totals = {};
    for (const [slug, s] of Object.entries(raw)) out[slug] = { reads: s.views ?? 0, reactions: { ...emptyReactions(), ...s.reactions } };
    return out;
  } catch {
    return null;
  }
}

/** Every post's public numbers, cached for a minute. */
export async function getTotals(): Promise<Totals> {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.data;
  // CMS not there (asked again after a minute): the last numbers it gave (a slow moment
  // must not blank every count), else the in-memory numbers (local work without the CMS)
  if (Date.now() < cmsDownUntil) return cache?.data ?? Object.fromEntries(local);
  inflight ??= (async () => {
    const fromCms = await fetchTotals();
    if (!fromCms) {
      cmsDownUntil = Date.now() + CACHE_MS;
      return cache?.data ?? Object.fromEntries(local);
    }
    cache = { at: Date.now(), data: fromCms };
    return fromCms;
  })().finally(() => {
    inflight = null;
  });
  return inflight;
}

function bumpLocal(e: BlogEvent) {
  const s = local.get(e.slug) ?? { reads: 0, reactions: emptyReactions() };
  if (e.event === "view") s.reads += 1;
  if (e.event === "react") s.reactions[e.reaction] += 1;
  local.set(e.slug, s);
}

/** Sends one event to the CMS (memory only when the CMS is not there). */
export async function record(e: BlogEvent): Promise<void> {
  // keep the cached public numbers in step, so the reader sees their own click
  if (cache?.data[e.slug]) {
    if (e.event === "view") cache.data[e.slug].reads += 1;
    if (e.event === "react") cache.data[e.slug].reactions[e.reaction] += 1;
  }
  const c = cms();
  if (!c) return bumpLocal(e);
  try {
    const res = await fetch(`${c.base}/api/intake/blog/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json", Authorization: `Bearer ${c.token}` },
      body: JSON.stringify(e),
      signal: AbortSignal.timeout(4000),
      cache: "no-store",
    });
    if (!res.ok && res.status >= 500) bumpLocal(e);
  } catch {
    bumpLocal(e);
  }
}
