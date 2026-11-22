import data from "@/content/site.json";

/** Contact, footer and search defaults, edited in the CMS (Settings, Website). */
type SiteSettings = {
  contact: { email?: string; phone?: string; whatsapp?: string; address?: string; hours?: string; social?: Record<string, string> };
  footer: { tagline?: string; button?: { label: string; href: string }; links?: { label: string; href: string }[]; places?: string[]; badges?: { title: string; subtitle?: string; href: string; color?: string }[]; copyright?: string };
  seo: { title?: string; description?: string; image?: string; google?: string; bing?: string };
};
export const SITE = data as unknown as SiteSettings;
