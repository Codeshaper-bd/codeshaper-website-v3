import { SERVICE_GROUPS, SERVICES, ENGAGEMENT_MODELS, servicePath, getGroup } from "@/data/services";
import { INDUSTRIES } from "@/lib/navigation";

/**
 * Pages that get their own branded share card (owner, 25 Nov 2026: "a share image on every page"):
 * the address, a small label and the headline drawn on the card (/og/...). Pages with a picture of
 * their own (blog posts, case studies, products) and any page given a share image in the CMS use
 * that instead.
 */
export type OgCard = { eyebrow: string; title: string };

const MAIN: Record<string, OgCard> = {
  "/services": { eyebrow: "Services", title: "AI engineering & software development services" },
  "/industries": { eyebrow: "Industries", title: "AI and software built for your industry" },
  "/engagement": { eyebrow: "How we work", title: "MVP sprints, dedicated teams and staff augmentation" },
  "/case-studies": { eyebrow: "Case studies", title: "Real projects, measurable outcomes" },
  "/blog": { eyebrow: "Blog", title: "AI, software and product insights" },
  "/products": { eyebrow: "Products", title: "Software we build and run ourselves" },
  "/company/about": { eyebrow: "About", title: "An AI-native software engineering company" },
  "/contact": { eyebrow: "Contact", title: "Tell us your goal. Book a call." },
};

function build(): Map<string, OgCard> {
  const m = new Map<string, OgCard>(Object.entries(MAIN));
  for (const g of SERVICE_GROUPS) m.set(servicePath(g.slug), { eyebrow: "Services", title: g.name });
  for (const s of SERVICES) m.set(servicePath(s.slug), { eyebrow: getGroup(s.groupSlug)?.name ?? "Services", title: s.title });
  for (const i of INDUSTRIES) m.set(i.href, { eyebrow: "Industries", title: `Software & AI for ${i.label}` });
  for (const e of ENGAGEMENT_MODELS) m.set(e.href, { eyebrow: "Engagement models", title: e.title ?? e.label });
  return m;
}

export const OG_CARDS = build();

/** "/services/x" → "services/x" (the card's address under /og/) */
export const ogKey = (path: string) => path.replace(/^\/+|\/+$/g, "");
/** The card address for a page, or undefined when the page has none. */
export const ogCardFor = (path?: string) => (path && OG_CARDS.has(path) ? `/og/${ogKey(path)}` : undefined);
