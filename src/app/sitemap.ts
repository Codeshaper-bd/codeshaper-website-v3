import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Only the homepage is a real, built page right now — every other route
 * (Services, Industries, Company, Insights, Contact, Legal, etc.) is a
 * scaffolded stub (see `[...slug]/page.tsx`). Listing stub routes in a
 * sitemap would tell Google to crawl and index dozens of near-empty
 * "coming soon" pages, which is worse for SEO than not listing them at
 * all. Add each route here as it gets a real page built.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
