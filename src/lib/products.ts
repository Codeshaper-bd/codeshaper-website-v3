import "server-only";
import data from "@/content/products.json";
import type { Review } from "@/data/reviews";
import type { Card, Cta, Seo, Step } from "@/lib/details";

export type Product = {
  slug: string; title: string; stage: string; tagline: string; summary: string; html?: string; category?: string; image: string; imageAlt?: string; logo?: string; accent?: string; platforms?: string[]; featured?: boolean;
  features?: (Card & { image?: string })[]; benefits?: string[]; for?: string[]; useCases?: Card[]; process?: Step[]; stats?: { value: string; label: string }[]; screens?: { src: string; alt?: string; caption?: string }[]; video?: { url: string; poster?: string };
  pricing?: { mode?: string; from?: string; note?: string; plans?: { title: string; price: string; period?: string; highlight?: boolean; features?: string[]; button?: string; href?: string }[] };
  faqs?: { q: string; a: string }[]; integrations?: { title: string; logo?: string }[]; changelog?: { title: string; date?: string; text?: string }[]; requirements?: string[]; links?: Record<string, string>; technologies?: string[];
  reviews?: Review[]; caseStudies?: string[]; related?: string[]; cta?: Cta; seo?: Seo;
};
export const PRODUCTS = data as unknown as Product[];
export const getProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
export const STAGE: Record<string, string> = { live: "Live", beta: "Beta", soon: "Coming soon", retired: "Retired" };

/**
 * The product line-up, in order (owner, 25 Nov 2026), shared by the footer and the homepage index:
 * CMS › Settings › Footer › Products when it has any, else this list. Each links to the product's own site.
 */
import siteData from "@/content/site.json";
/** image: a real screenshot of the product's own site (public/media/products), taken 25 Nov 2026 */
export type ProductLink = { label: string; href: string; note?: string; image?: string };
const DEFAULT_LINEUP: ProductLink[] = [
  // notes are each site's own words
  { label: "Banizo", href: "https://banizo.com", image: "/media/products/banizo.png" },
  { label: "ViteERP", href: "http://viteerp.com", note: "Cloud ERP that automates your business processes.", image: "/media/products/viteerp.png" },
  { label: "ClientBees", href: "https://clientbees.com", note: "Client portal infrastructure for agencies.", image: "/media/products/clientbees.png" },
  { label: "Acculance", href: "https://acculance.codeshaper.net" },
  { label: "Dashcode", href: "https://dashcode.codeshaper.tech" },
  { label: "Dashtail", href: "https://dash-tail.vercel.app/en", note: "Tailwind, React and Next.js admin dashboard template.", image: "/media/products/dashtail.png" },
  { label: "CS Size Chart", href: "https://wordpress.org/plugins/cs-size-chart", note: "AI-driven size recommendations for WordPress stores.", image: "/media/products/cs-size-chart.png" },
];
const cmsLineup = (siteData as { footer?: { products?: ProductLink[] } }).footer?.products;
const builtIn = new Map(DEFAULT_LINEUP.map((d) => [d.label.toLowerCase(), d]));
export const PRODUCT_LINEUP: ProductLink[] = cmsLineup?.length
  ? cmsLineup.map((l) => { const d = builtIn.get(l.label.toLowerCase()); return { ...l, note: l.note ?? d?.note, image: l.image ?? d?.image }; })
  : DEFAULT_LINEUP;

/** Cards for the products page: the line-up in order; a product with a CMS page links there, the others to their own site. */
export type LineupCard = { title: string; href: string; external: boolean; image?: string; line?: string; badge: string };
export function lineupCards(): LineupCard[] {
  const bySlug = new Map(PRODUCTS.map((p) => [p.title.toLowerCase(), p]));
  return PRODUCT_LINEUP.map((l) => {
    const p = bySlug.get(l.label.toLowerCase());
    return p
      ? { title: p.title, href: `/products/${p.slug}`, external: false, image: l.image ?? p.image, line: p.tagline, badge: STAGE[p.stage] ?? p.stage }
      : { title: l.label, href: l.href, external: true, image: l.image, line: l.note, badge: l.href.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0] };
  });
}

/** A CMS product as a card (the "You may also like" row on a product page). */
export const productCard = (p: Product): LineupCard => ({ title: p.title, href: `/products/${p.slug}`, external: false, image: p.image, line: p.tagline, badge: STAGE[p.stage] ?? p.stage });
