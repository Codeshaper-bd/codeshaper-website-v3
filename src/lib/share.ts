import type { Metadata } from "next";
import { SITE_NAME } from "./site";
import { SITE } from "./siteSettings";
import { ogCardFor } from "./ogPages";

/**
 * The picture shown when a link is shared (Facebook, LinkedIn, WhatsApp, X):
 * CMS › Settings › Search and sharing › Share image, or the brand card in
 * public/brand/og-default.png. A page's own share image (its SEO tab) wins.
 */
export const DEFAULT_SHARE_IMAGE = SITE.seo.image ?? "/brand/og-default.png";

/**
 * Makes a page's share preview its own (owner, 25 Nov 2026). A page's
 * `openGraph` replaces the root layout's instead of merging, so a page that
 * set only a title used to share with the homepage's title, text and link.
 * This fills Open Graph and Twitter from the page's title, description and
 * canonical address, keeping anything the page already set.
 */
export function withShare(meta: Metadata): Metadata {
  const t = meta.title;
  const title =
    typeof t === "string" ? `${t} | ${SITE_NAME}` : t && typeof t === "object" && "absolute" in t && t.absolute ? t.absolute : t && typeof t === "object" && "default" in t ? t.default : undefined;
  const description = typeof meta.description === "string" ? meta.description : undefined;
  const canonical = meta.alternates?.canonical;
  const url = typeof canonical === "string" ? canonical : canonical instanceof URL ? canonical.toString() : undefined;
  const og = (meta.openGraph ?? {}) as NonNullable<Metadata["openGraph"]>;
  const tw = (meta.twitter ?? {}) as NonNullable<Metadata["twitter"]>;
  // the page's own picture, else its branded card (lib/ogPages.ts), else the site-wide one
  const images = og.images ?? [ogCardFor(url) ?? DEFAULT_SHARE_IMAGE];
  return {
    ...meta,
    openGraph: { type: "website", siteName: SITE_NAME, ...(url ? { url } : {}), ...(title ? { title } : {}), ...(description ? { description } : {}), ...og, images } as Metadata["openGraph"],
    twitter: {
      card: "summary_large_image",
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      ...(SITE.seo.xHandle ? { site: `@${SITE.seo.xHandle}` } : {}),
      ...tw,
      images: tw.images ?? images,
    } as Metadata["twitter"],
  };
}
