import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Disallows every route prefix that's still a scaffolded stub (see
 * `[...slug]/page.tsx` and `sitemap.ts`'s own note) — update this list
 * as each one gets a real page built, removing it from here once it
 * does. /contact and /legal come off this list in this same pass since
 * real pages exist for both now.
 */
const STUB_PREFIXES = ["/company", "/engagement", "/how-we-work", "/industries", "/services", "/work"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: STUB_PREFIXES,
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
