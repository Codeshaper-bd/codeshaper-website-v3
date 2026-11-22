import industries from "@/content/industries.json";
import header from "@/content/header.json";

/**
 * Finds the item whose href's last path segment exactly matches `slug`.
 * Shared by every [dynamic]/page.tsx route below instead of each one
 * hand-rolling its own `.find(x => x.href.endsWith('/' + slug))` — that
 * pattern would false-match a slug that's a suffix of another (e.g.
 * "mvp-sprint" vs a hypothetical "lite-mvp-sprint"); comparing the exact
 * last segment doesn't have that risk.
 */
export function findBySlug<T extends { href: string }>(list: T[], slug: string): T | undefined {
  return list.find((item) => item.href.split("/").pop() === slug);
}

/** The exact same last-segment extraction used by generateStaticParams for these routes. */
export function slugFromHref(href: string): string {
  return href.split("/").pop()!;
}

/*
 * Services, service groups, How We Engage, the Services mega menu's
 * featured card and quick-access chips all live in src/data/services.ts
 * (the single source of truth for the service structure).
 */

/** Industries mega menu — "Industries We Serve" center column. */
export type IndustryLink = {
  label: string;
  href: string;
  icon: string;
  desc: string;
  /** One real paragraph — used as the intro copy on this industry's own detail page */
  summary: string;
  /** Short outcome framing, shown as a supporting line on the detail page */
  outcome: string;
  /** 3 representative systems/workflows we build for this vertical */
  systems: string[];
};

// edited in the CMS (Industries)
export const INDUSTRIES: IndustryLink[] = industries.map(({ label, href, icon, desc, summary, outcome, systems }) => ({ label, href, icon, desc, summary, outcome, systems }));

/** Industries mega menu — right column "Popular verticals" chips. */
export const INDUSTRIES_POPULAR: { label: string; href: string }[] = [
  { label: "SaaS", href: "/industries/saas" },
  { label: "FinTech", href: "/industries/fintech" },
  { label: "eCommerce", href: "/industries/ecommerce" },
  { label: "Luxury", href: "/industries/luxury" },
  { label: "Travel", href: "/industries/travel" },
];

/** Industries mega menu — right column dark "Case Study" card. */
export const INDUSTRIES_FEATURED = {
  eyebrow: "Retail & Business Ops · Featured",
  body: "A SaaS-ready POS, inventory, and accounting platform built for growing businesses",
  href: "/case-studies/acculance",
  icon: "shopping-cart",
};

/** The header menu and its button, edited in the CMS (Settings, Header menu). */
export type MenuLink = { label: string; href: string; icon: string };
export type HeaderItem =
  | { type: "services" | "industries"; label: string }
  | { type: "link"; label: string; href: string }
  | { type: "group"; label: string; links: MenuLink[] };
export const HEADER_ITEMS = header.items as unknown as HeaderItem[];
export const HEADER_BUTTON: { label: string; href: string } = header.button;
