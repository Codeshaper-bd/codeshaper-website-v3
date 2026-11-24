/**
 * Shared by the browser and the server: the reactions a reader can give
 * (ids/labels only; ViewsReactions maps each id to an icon) and the public
 * numbers shape.
 */
export const REACTIONS = [
  { id: "helpful", label: "Helpful" },
  { id: "insightful", label: "Insightful" },
  { id: "love", label: "Love it" },
] as const;

export type ReactionId = (typeof REACTIONS)[number]["id"];

/** What the website shows publicly for one post: how often it was read (opened) and its reactions. */
export type PublicStats = { reads: number; reactions: Record<ReactionId, number> };

export type BlogEvent =
  | { slug: string; event: "view" }
  | { slug: string; event: "read" }
  | { slug: string; event: "time"; seconds: number }
  | { slug: string; event: "react"; reaction: ReactionId };

/**
 * The public read count shows from this many reads (owner, 24 Nov 2026):
 * small early numbers read as weak proof. Below it nothing is shown (the
 * CMS still has every number).
 */
export const MIN_PUBLIC_READS = 50;

/** 950 → "950", 1234 → "1.2k", 12500 → "12.5k". */
export function compactCount(n: number): string {
  if (n < 1000) return String(n);
  if (n < 1_000_000) return `${(n / 1000).toFixed(n < 10_000 ? 1 : 0).replace(/\.0$/, "")}k`;
  return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
}
