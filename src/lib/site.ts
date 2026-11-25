import site from "@/content/site.json";

/**
 * Single source of truth for the production URL, used by metadataBase,
 * Open Graph/Twitter tags, JSON-LD, and the sitemap/robots routes.
 *
 * Order: NEXT_PUBLIC_SITE_URL from the deployment, then the website
 * address set in CMS › Settings › General (synced into site.json as
 * `url`), then `codeshaper.example.com`. The `.example` space is reserved
 * by IANA for placeholders, so a missing setting is never mistaken for a
 * real domain.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? (site as { url?: string }).url ?? "https://codeshaper.example.com").replace(/\/$/, "");

export const SITE_NAME = "CodeShaper";
