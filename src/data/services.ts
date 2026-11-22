/**
 * Single source of truth for CodeShaper's service structure.
 *
 * Every place on the site that lists or links to services — header mega
 * menu, mobile nav, homepage tabs, footer, FAQ, contact form, sitemap,
 * the /services hub, group pages, and service detail pages — reads from
 * this file. Do not hardcode service names, slugs, or routes anywhere
 * else.
 *
 * Routes:
 *   /services/<group-slug>    group page
 *   /services/<service-slug>  service detail page
 * Group and service slugs share the /services/ namespace, so they must
 * never collide (asserted at the bottom of this file).
 *
 * Copy marked `// REVIEW` is a first draft and needs a human check before
 * launch: every service `summary`, every `metaDescription`, and the
 * renamed engagement-model copy.
 */

import content from "@/content/services.json";

export const COMPANY_POSITIONING = "AI Engineering & Software Development Company";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type ServiceGroupSlug = string;

export type Service = {
  /** Short label for menus and chips */
  menuLabel: string;
  /** Full keyword-rich name, used as the page H1 */
  title: string;
  slug: string;
  groupSlug: ServiceGroupSlug;
  /** Only used inside Websites & Commerce */
  subgroup?: string;
  /** One sentence shown on cards and as the detail page intro */
  summary: string;
  /** "<title> | CodeShaper" */
  metaTitle: string;
  /** 140–160 characters, includes the main keyword */
  metaDescription: string;
  /** Lucide icon key (see lib/icons.tsx) */
  icon: string;
  /** Has a page, but is left out of menus */
  hidden?: boolean;
};

export type ServiceGroup = {
  slug: ServiceGroupSlug;
  /** Group name — used in menus, tabs, footer, and as the group page H1 */
  name: string;
  /** One-line focus statement shown under the group name */
  focus: string;
  /** Flagship group carries the "New" badge */
  flagship?: boolean;
  icon: string;
  /** Subgroup names in display order (Websites & Commerce only) */
  subgroups?: string[];
  /** Slugs whose menu labels make up the grey descriptor line in the mega menu (5–6) */
  descriptorSlugs: string[];
  metaTitle: string;
  metaDescription: string;
};

/* -------------------------------------------------------------------------- */
/* Groups (locked order)                                                      */
/* -------------------------------------------------------------------------- */

// edited in the CMS (Services); see scripts/sync-content.mjs
export const SERVICE_GROUPS: ServiceGroup[] = content.groups;

/* -------------------------------------------------------------------------- */
/* Services (locked names, order, and slugs)                                  */
/* -------------------------------------------------------------------------- */

export const SERVICES: Service[] = content.services;

/* -------------------------------------------------------------------------- */
/* How We Engage (engagement models — not services)                           */
/* -------------------------------------------------------------------------- */

export type EngagementModel = {
  /** Short label for menus, cards, and footer */
  label: string;
  /** Page H1 */
  title: string;
  href: string;
  icon: string;
  /** 3–5 word clarifier shown under the label in the mega menu */
  desc: string;
  /** Intro paragraph on the model's own page */
  longDescription: string;
  metaDescription: string;
};

export const ENGAGEMENT_MODELS: EngagementModel[] = content.models;

/* -------------------------------------------------------------------------- */
/* Mega menu extras                                                           */
/* -------------------------------------------------------------------------- */

export const SERVICES_FEATURED = {
  eyebrow: "AI Agents & Automation · NEW",
  title: "Production-Ready AI Automation",
  desc: "AI workflows integrated with your systems — with approvals, logs and testing built in.",
  href: "/services/ai-agents-automation",
  icon: "bot",
};

/** Quick Access chips — each resolves to its service page. */
const QUICK_ACCESS_SLUGS: { label: string; slug: string }[] = [
  { label: "AI Agents", slug: "ai-agent-development" },
  { label: "AI Integration", slug: "ai-integration" },
  { label: "RAG Systems", slug: "rag-development" },
  { label: "MVP Development", slug: "mvp-development" },
  { label: "Cloud & DevOps", slug: "cloud-devops" },
  { label: "Shopify Development", slug: "shopify-development" },
];

export const MEGA_MENU_FOOTER = {
  count: `${SERVICE_GROUPS.length} service groups`,
  tagline: "AI engineering & software development company",
};

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

export const servicePath = (slug: string) => `/services/${slug}`;

export function getGroup(slug: string): ServiceGroup | undefined {
  return SERVICE_GROUPS.find((g) => g.slug === slug);
}

export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

export function servicesInGroup(groupSlug: string): Service[] {
  return SERVICES.filter((s) => s.groupSlug === groupSlug);
}

/** Grey descriptor line in the mega menu / homepage tabs, e.g. "SaaS Development · MVP Development · …" */
export function groupDescriptor(group: ServiceGroup): string {
  return group.descriptorSlugs.flatMap((slug) => getService(slug)?.menuLabel ?? []).join(" · ");
}

/** A group's services split into its subgroups (or one unnamed section when it has none). */
export function groupSections(group: ServiceGroup): { name?: string; services: Service[] }[] {
  const services = servicesInGroup(group.slug);
  if (!group.subgroups) return [{ services }];
  const loose = services.filter((s) => !s.subgroup);
  return [...(loose.length ? [{ services: loose }] : []), ...group.subgroups.map((name) => ({ name, services: services.filter((s) => s.subgroup === name) }))];
}

/**
 * Three other services from the same group — same subgroup first (so a
 * Shopify page suggests other commerce services, not WordPress), then
 * the rest of the group in its listed order.
 */
export function relatedServices(service: Service, count = 3): Service[] {
  const siblings = servicesInGroup(service.groupSlug).filter((s) => s.slug !== service.slug);
  const sameSubgroup = siblings.filter((s) => s.subgroup === service.subgroup);
  const rest = siblings.filter((s) => s.subgroup !== service.subgroup);
  return [...sameSubgroup, ...rest].slice(0, count);
}

export const SERVICES_QUICK_ACCESS: { label: string; href: string }[] = QUICK_ACCESS_SLUGS.filter(({ slug }) => getService(slug)).map(({ label, slug }) => ({ label, href: servicePath(slug) }));

/** Engagement models by the last segment of their href. */
export function getEngagementModel(slug: string): EngagementModel | undefined {
  return ENGAGEMENT_MODELS.find((m) => m.href.split("/").pop() === slug);
}

/* -------------------------------------------------------------------------- */
/* Integrity checks — fail the build, not production, if the data drifts       */
/* -------------------------------------------------------------------------- */

{
  const allSlugs = [...SERVICE_GROUPS.map((g) => g.slug), ...SERVICES.map((s) => s.slug)];
  const dupes = allSlugs.filter((s, i) => allSlugs.indexOf(s) !== i);
  if (dupes.length) throw new Error(`Duplicate /services/ slugs: ${dupes.join(", ")}`);
  for (const g of SERVICE_GROUPS) {
    for (const slug of g.descriptorSlugs) {
      if (getService(slug)?.groupSlug !== g.slug) throw new Error(`Descriptor slug "${slug}" is not in group "${g.slug}"`);
    }
  }
  for (const s of SERVICES) if (!getGroup(s.groupSlug)) throw new Error(`Service "${s.slug}" has no group`);
}
