import { SITE_NAME } from "@/lib/site";
import { SITE } from "@/lib/siteSettings";
import { COMPANY_POSITIONING } from "@/data/services";
import { COUNTRIES_SERVED } from "@/lib/facts";

/**
 * What /llms.txt and /llms-full.txt say about the company before the lists.
 * Editable in CMS › Settings › AI and search engines; this is the fallback.
 */
export const LLMS_SUMMARY =
  SITE.crawlers?.llmsSummary ??
  `${SITE_NAME} (${COMPANY_POSITIONING}) builds AI agents and automation, custom software, SaaS products and MVPs, product design, and websites and commerce for clients in ${COUNTRIES_SERVED} countries from a delivery hub in Dhaka, Bangladesh.`;

export const LLMS_FACTS = SITE.crawlers?.llmsFacts ?? [];
export const LLMS_EXTRA = SITE.crawlers?.llmsExtra;

/** One Markdown line out of a text that may contain line breaks. */
export const flat = (s?: string) => (s ?? "").replace(/\s+/g, " ").trim();
