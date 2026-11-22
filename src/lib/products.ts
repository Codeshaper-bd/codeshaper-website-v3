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
