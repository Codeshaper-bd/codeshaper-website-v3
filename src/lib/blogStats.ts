/**
 * In-memory view/reaction counters for blog posts. Deliberately NOT
 * fabricated numbers (this project's own no-fabrication rule applies
 * here too — see EDITOR_PICKS_SLUGS' removal in an earlier pass) and
 * deliberately NOT written to a file either: this project's own
 * `.vercel` deploy target most likely runs on a read-only serverless
 * filesystem, where `fs.writeFileSync` would either silently do
 * nothing or throw at runtime. An in-memory Map is the version of
 * "real, not fake" that can't crash production — it genuinely counts
 * real requests, it just resets on every cold start/redeploy and
 * won't stay in sync across parallel instances. Swap for a real store
 * (Vercel KV, Redis, Postgres) before relying on these for anything
 * that needs to survive a deploy.
 */
export type PostStats = { views: number; reactions: Record<string, number> };

const store = new Map<string, PostStats>();

function getOrInit(slug: string): PostStats {
  let s = store.get(slug);
  if (!s) {
    s = { views: 0, reactions: {} };
    store.set(slug, s);
  }
  return s;
}

export function getStats(slug: string): PostStats {
  const s = getOrInit(slug);
  return { views: s.views, reactions: { ...s.reactions } };
}

export function incrementView(slug: string): PostStats {
  const s = getOrInit(slug);
  s.views += 1;
  return { views: s.views, reactions: { ...s.reactions } };
}

/**
 * ids/labels only — no emoji here. Raw emoji characters render
 * inconsistently across platforms/fonts (reported as showing broken/
 * missing-glyph boxes); ViewsReactions.tsx maps each id to a proper
 * lucide-react icon instead, same icon system as the rest of the site.
 */
export const REACTIONS = [
  { id: "helpful", label: "Helpful" },
  { id: "insightful", label: "Insightful" },
  { id: "love", label: "Love it" },
] as const;

export function addReaction(slug: string, reaction: string): PostStats {
  const s = getOrInit(slug);
  s.reactions[reaction] = (s.reactions[reaction] ?? 0) + 1;
  return { views: s.views, reactions: { ...s.reactions } };
}
