import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { INDUSTRIES } from "@/lib/navigation";
import { SERVICE_GROUPS, SERVICES, ENGAGEMENT_MODELS, servicePath } from "@/data/services";
import { BLOG_POSTS } from "@/lib/blog";
import { CASE_STUDIES } from "@/lib/caseStudies";

/**
 * Routes not listed here (Insights, Company/Leadership, Careers, Work,
 * etc.) are still scaffolded stubs (see `[...slug]/page.tsx` and
 * `robots.ts`'s STUB_PREFIXES) — listing a stub here would tell Google
 * to crawl and index a near-empty "coming soon" page, which is worse
 * for SEO than not listing it at all. Add each route here as it gets a
 * real page built — including the Company pages hidden from the menus
 * (Leadership, Life, Clients, Locations, Careers). Service group, service,
 * and engagement URLs are derived from src/data/services.ts, the same
 * data the menus and routes render, so this can't drift out of sync with
 * what actually exists.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/company/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/industries`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/engagement`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/case-studies`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];

  const blogRoutes: MetadataRoute.Sitemap = BLOG_POSTS.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const caseStudyRoutes: MetadataRoute.Sitemap = CASE_STUDIES.map((c) => ({
    url: `${SITE_URL}/case-studies/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const serviceGroupRoutes: MetadataRoute.Sitemap = SERVICE_GROUPS.map((group) => ({
    url: `${SITE_URL}${servicePath(group.slug)}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const serviceDetailRoutes: MetadataRoute.Sitemap = SERVICES.map((svc) => ({
    url: `${SITE_URL}${servicePath(svc.slug)}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const industryRoutes: MetadataRoute.Sitemap = INDUSTRIES.map((ind) => ({
    url: `${SITE_URL}${ind.href}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const engagementRoutes: MetadataRoute.Sitemap = ENGAGEMENT_MODELS.map((m) => ({
    url: `${SITE_URL}${m.href}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...serviceGroupRoutes, ...serviceDetailRoutes, ...industryRoutes, ...engagementRoutes, ...blogRoutes, ...caseStudyRoutes];
}
