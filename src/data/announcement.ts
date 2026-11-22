import { BLOG_POSTS } from "@/lib/blog";
import saved from "@/content/announcement.json";

/**
 * The announcement chip above the hero headline:  [NEW]  Read: <title>  →
 *
 * Edited in the CMS (Settings, Announcement): the newest blog post, the
 * owner's own text, or nothing.
 */
export type AnnouncementKind = "new" | "update" | "fix" | "news";

export type Announcement = {
  kind: AnnouncementKind;
  /** Short, one line; it is truncated on small screens. */
  text: string;
  href: string;
};

const CMS = saved as { mode: string } & Partial<Announcement>;

export function getAnnouncement(): Announcement | null {
  if (CMS.mode === "off") return null;
  if (CMS.mode === "manual" && CMS.text && CMS.href) return { kind: CMS.kind && CMS.kind in KIND_STYLE ? CMS.kind : "new", text: CMS.text, href: CMS.href };
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
