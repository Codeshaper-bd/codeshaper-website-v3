import type { Metadata } from "next";
import { SITE_NAME } from "./site";

/**
 * Metadata for a page whose title is already fully branded ("… | CodeShaper").
 * `title.absolute` bypasses the root layout's `%s | CodeShaper` template so
 * the brand isn't appended twice. Open Graph is set explicitly because a
 * child's `openGraph` replaces the root layout's rather than merging with it.
 */
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: SITE_NAME, url: path, title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}
