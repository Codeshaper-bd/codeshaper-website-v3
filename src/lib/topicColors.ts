import blog from "@/content/blog.json";

/**
 * One colour per blog topic (owner, 24 Nov 2026), so a reader can tell
 * topics apart at a glance: the topic label on cards, the filter chips and
 * the article page. Deep tones only: each has at least 4.5:1 contrast on
 * white at small sizes (WCAG AA). Known topics are pinned; a new topic
 * from the CMS takes the next free colour in category order.
 */
const PALETTE = [
  "#4f46e5", // indigo
  "#b45309", // amber
  "#047857", // emerald
  "#be185d", // pink
  "#0369a1", // sky
  "#0f766e", // teal
  "#7c3aed", // violet
  "#c2410c", // orange
];

const PINNED: Record<string, string> = {
  "ai-agents-automation": "#4f46e5",
  "product-strategy": "#b45309",
  commerce: "#047857",
  "ux-ui": "#be185d",
  "web-engineering": "#0369a1",
  integrations: "#0f766e",
};

const BY_TITLE = new Map<string, string>();
{
  const used = new Set(Object.values(PINNED));
  const free = PALETTE.filter((c) => !used.has(c));
  let next = 0;
  for (const c of blog.categories) {
    BY_TITLE.set(c.title, PINNED[c.slug] ?? free[next++ % Math.max(1, free.length)] ?? PALETTE[0]);
  }
}

/** The topic's colour (indigo for anything unknown). */
export function topicColor(topic: string): string {
  return BY_TITLE.get(topic) ?? PALETTE[0];
}
