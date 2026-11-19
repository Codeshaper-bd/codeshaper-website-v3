import { BLOG_POSTS } from "@/lib/blog";

/**
 * The announcement chip above the hero headline:  [NEW]  Read: <title>  →
 *
 * By default it points at the newest blog post, so publishing a post updates
 * it automatically. To announce something else (a product update, a fix, a
 * news item), set MANUAL below; set it back to null to return to the newest
 * post.
 */
export type AnnouncementKind = "new" | "update" | "fix" | "news";

export type Announcement = {
  kind: AnnouncementKind;
  /** Short, one line; it is truncated on small screens. */
  text: string;
  href: string;
};

/** e.g. { kind: "update", text: "Our AI agents now support voice", href: "/services/ai-agents-automation" } */
const MANUAL: Announcement | null = null;

export function getAnnouncement(): Announcement | null {
  if (MANUAL) return MANUAL;
  const latest = [...BLOG_POSTS].sort((a, b) => b.date.localeCompare(a.date))[0];
  if (!latest) return null;
  // the short form of the title (before a colon), so the chip stays compact
  const short = latest.title.split(":")[0].trim();
  return { kind: "new", text: `Read: ${short}`, href: `/blog/${latest.slug}` };
}

/** Tag colours: dark enough for small white text (WCAG AA). */
export const KIND_STYLE: Record<AnnouncementKind, { label: string; bg: string }> = {
  new: { label: "New", bg: "#4f46e5" },
  update: { label: "Update", bg: "#0369a1" },
  fix: { label: "Fix", bg: "#047857" },
  news: { label: "News", bg: "#b45309" },
};
