import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Disallows every route that's still a scaffolded stub (see
 * `[...slug]/page.tsx` and `sitemap.ts`'s own note) — update this list
 * as each one gets a real page built, removing it from here once it
 * does. /contact, /services, /industries, /engagement, and
 * /company/about have all come off this list as real pages were built
 * for them. /company needs per-path entries (not a blanket prefix)
 * since /company/about is real but its siblings aren't yet.
 *
 * /legal/privacy and /legal/terms are real pages too, but deliberately
 * NOT disallowed here — they carry their own per-page `noindex` (see
 * their metadata) since both are explicit content drafts pending
 * counsel review. A robots.txt disallow would stop crawlers from ever
 * fetching the page at all, which means they'd never see that noindex
 * tag — Google's own guidance is to use noindex, not disallow, for
 * "crawlable but shouldn't be indexed yet."
 */
const STUB_PREFIXES = [
  "/company/leadership",
  "/company/life",
  "/company/clients",
  "/company/locations",
  "/company/careers",
  "/insights",
];

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
