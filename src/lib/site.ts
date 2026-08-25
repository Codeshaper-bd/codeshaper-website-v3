/**
 * Single source of truth for the production URL, used by metadataBase,
 * Open Graph/Twitter tags, JSON-LD, and the sitemap/robots routes.
 *
 * No real domain is known for this project (verified: none exists
 * anywhere in the codebase). Rather than guess a plausible-looking real
 * domain — which could be wrong, or worse, could be someone else's real
 * domain — this falls back to `codeshaper.example.com`. The `.example`
 * space is reserved by IANA specifically for documentation/placeholder
 * use, so this is unambiguously a placeholder rather than a guess.
 *
 * Set NEXT_PUBLIC_SITE_URL in the real deployment environment to the
 * actual domain once one exists.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://codeshaper.example.com").replace(/\/$/, "");

export const SITE_NAME = "Codeshaper";
