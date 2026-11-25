import "server-only";
import details from "@/content/details.json";
import type { Review } from "@/data/reviews";
import { withShare } from "@/lib/share";

/** Long content for single pages. Kept out of the shared data so it never reaches the browser bundle. */
export type Card = { icon: string; title: string; description: string };
export type Step = { n: string; title: string; description: string };
export type Seo = { title?: string; description?: string; image?: string; canonical?: string; noindex?: boolean };
export type Cta = { title?: string; label?: string; href?: string };
export type Detail = {
  headline?: string; outcomes?: string[]; snapshot?: Card[]; stats?: { value: string; label: string }[]; problems?: string[]; deliverables?: Card[]; useCases?: Card[]; benefits?: Card[];
  goodFit?: string[]; notIdeal?: string[]; process?: Step[]; stack?: { category: string; tools: string[]; icon?: string }[]; guardrails?: string[]; facts?: { timeline?: string; team?: string; price?: string; support?: string };
  compare?: { title: string; best_for?: string; watch_out?: string }[]; mistakes?: string[]; resources?: { title: string; href: string }[]; compliance?: Card[]; integrations?: string[];
  solutions?: { title: string; href?: string; items?: string[]; icon?: string; accent?: string }[]; faqs?: { q: string; a: string }[]; gallery?: { src: string; alt?: string; caption?: string }[]; video?: { url: string; poster?: string };
  html?: string; cta?: Cta; seo?: Seo; caseStudies?: string[]; reviews?: Review[]; related?: string[]; posts?: string[]; technologies?: string[];
};
export type PostDetail = { html?: string; seo?: Seo; cta?: Cta; author?: { name: string; role?: string; bio?: string; photo?: string; linkedin?: string; website?: string }; sources?: { title: string; url: string }[]; related?: string[]; hideToc?: boolean; founderNote?: { by: "founder" | "cofounder"; quote: string } };
export type StoryDetail = { html?: string; seo?: Seo; cta?: Cta; faqs?: { q: string; a: string }[]; video?: { url: string }; beforeAfter?: { title: string; before: string; after: string }[] };

const d = details as unknown as { posts: Record<string, PostDetail>; services: Record<string, Detail>; industries: Record<string, Detail>; models: Record<string, Detail>; caseStudies: Record<string, StoryDetail> };
export const postDetail = (slug: string): PostDetail => d.posts[slug] ?? {};
export const serviceDetail = (slug: string): Detail => d.services[slug] ?? {};
export const industryDetail = (slug: string): Detail => d.industries[slug] ?? {};
export const modelDetail = (slug: string): Detail => d.models[slug] ?? {};
export const storyDetail = (slug: string): StoryDetail => d.caseStudies[slug] ?? {};

/** YouTube and Vimeo links → privacy-friendly players. */
export function videoEmbed(url: string): string | null {
  const y = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (y) return `https://www.youtube-nocookie.com/embed/${y[1]}`;
  const v = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return v ? `https://player.vimeo.com/video/${v[1]}` : null;
}

/**
 * Adds what the CMS says about search engines (the record's SEO tab) to a
 * page's metadata, and completes its share preview (lib/share.ts) so every
 * page shares with its own title, text, address and picture.
 */
export function withSeo<T extends import("next").Metadata>(base: T, seo: Seo = {}): import("next").Metadata {
  const branded = seo.title ? (/\| CodeShaper$/.test(seo.title) ? seo.title : `${seo.title} | CodeShaper`) : undefined;
  const title = branded ? { absolute: branded } : base.title;
  return withShare({
    ...base,
    title,
    description: seo.description ?? base.description,
    ...(seo.canonical ? { alternates: { canonical: seo.canonical } } : {}),
    ...(seo.noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: { ...base.openGraph, ...(branded ? { title: branded } : {}), ...(seo.description ? { description: seo.description } : {}), ...(seo.image ? { images: [seo.image] } : {}) },
    ...(seo.image || branded || seo.description
      ? { twitter: { ...base.twitter, ...(branded ? { title: branded } : {}), ...(seo.description ? { description: seo.description } : {}), ...(seo.image ? { images: [seo.image] } : {}) } }
      : {}),
  });
}
