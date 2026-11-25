import type { Metadata } from "next";
import data from "@/content/mainPages.json";
import { withSeo, type Seo } from "@/lib/details";
import { SITE_NAME } from "@/lib/site";
import { withShare } from "@/lib/share";

/** The website's own pages (Home, Services, About…): what the CMS says about them (Pages, Main pages). */
type MainPage = { seo?: Seo; hero?: Record<string, string>; sections?: unknown[] };
const PAGES = data as unknown as Record<string, MainPage>;
export const mainPage = (key: string): MainPage => PAGES[key] ?? {};

/** The page's own metadata, with the CMS's search settings on top. */
export function mainMeta(key: string, base: Metadata): Metadata {
  const seo = mainPage(key).seo;
  if (!seo) return withShare(base);
  const out = withSeo(base, seo);
  if (seo.title || seo.description || seo.image) {
    const t = out.title && typeof out.title === "object" && "absolute" in out.title ? out.title.absolute : typeof out.title === "string" ? `${out.title} | ${SITE_NAME}` : undefined;
    const share = { ...(t ? { title: t } : {}), ...(out.description ? { description: out.description } : {}), ...(seo.image ? { images: [seo.image] } : {}) };
    // a page's Open Graph replaces the layout's, so it must be complete
    const url = typeof base.alternates?.canonical === "string" ? base.alternates.canonical : undefined;
    out.openGraph = { type: "website", siteName: SITE_NAME, url, ...base.openGraph, ...share };
    out.twitter = { card: "summary_large_image", ...base.twitter, ...share };
  }
  return withShare(out);
}
