/**
 * Turns the slugs in an answer into what the cards show, from the website's own published content.
 * The assistant names content; it never supplies titles, pictures, prices or links. A slug that is
 * not published here gives nothing.
 */
import studies from "@/content/caseStudies.json";
import engagement from "@/content/engagement.json";
import { getGroup, getService, servicePath } from "@/data/services";

export type CatalogItem = { slug: string; title: string; text: string; href: string; meta?: string; icon?: string; accent?: string; image?: string; imageAlt?: string };

export function serviceItem(slug: string): CatalogItem | null {
  const service = getService(slug);
  if (service) return { slug, title: service.menuLabel, text: service.summary, href: servicePath(slug), meta: getGroup(service.groupSlug)?.name, icon: service.icon };
  const group = getGroup(slug);
  return group ? { slug, title: group.name, text: group.focus, href: servicePath(slug), meta: "Service area", icon: group.icon } : null;
}

export function modelItem(slug: string): CatalogItem | null {
  const row = engagement.comparison.find((m) => m.href.split("/").pop() === slug);
  return row ? { slug, title: row.model, text: row.bestFor, href: row.href, meta: row.commitment } : null;
}

export function studyItem(slug: string): CatalogItem | null {
  const s = studies.find((c) => c.slug === slug);
  if (!s) return null;
  // only the site's own pictures: some stories still carry stock placeholders, which are not shown
  const own = s.image?.startsWith("/");
  return { slug, title: s.project, text: s.summary, href: `/case-studies/${slug}`, meta: s.industry, accent: s.accent, image: own ? s.image : undefined, imageAlt: s.imageAlt ?? "" };
}
