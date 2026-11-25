import { SITE_URL, SITE_NAME } from "@/lib/site";
import { SERVICE_GROUPS, ENGAGEMENT_MODELS, groupDescriptor, servicePath } from "@/data/services";
import { INDUSTRIES } from "@/lib/navigation";
import { LLMS_EXTRA, LLMS_FACTS, LLMS_SUMMARY } from "@/lib/llms";

/**
 * /llms.txt (https://llmstxt.org): a short Markdown guide to the site for AI
 * agents and language models: an H1, a one-line summary, and the key links,
 * generated from the same data as the navigation so it never goes stale.
 * The summary, key facts and any extra Markdown come from CMS › Settings ›
 * AI and search engines. The long version is /llms-full.txt.
 * Static at build time.
 */
export const dynamic = "force-static";

export function GET() {
  const line = (title: string, path: string, note?: string) => `- [${title}](${SITE_URL}${path})${note ? `: ${note}` : ""}`;
  const body = [
    `# ${SITE_NAME}`,
    "",
    `> ${LLMS_SUMMARY}`,
    "",
    ...(LLMS_FACTS.length ? ["## Key facts", "", ...LLMS_FACTS.map((f) => `- ${f}`), ""] : []),
    "## Services",
    "",
    ...SERVICE_GROUPS.map((g) => line(g.name, servicePath(g.slug), groupDescriptor(g))),
    "",
    "## Industries",
    "",
    ...INDUSTRIES.map((i) => line(i.label, i.href, i.desc)),
    "",
    "## How we engage",
    "",
    ...ENGAGEMENT_MODELS.map((m) => line(m.label, m.href, m.desc)),
    "",
    "## Company",
    "",
    line("Case studies", "/case-studies", "client projects and outcomes"),
    line("Blog", "/blog", "articles on AI, software and product"),
    line("About", "/company/about"),
    line("Contact", "/contact", "start a project or book a call"),
    "",
    ...(LLMS_EXTRA ? [LLMS_EXTRA, ""] : []),
    "## Optional",
    "",
    line("Full guide for AI assistants", "/llms-full.txt", "every service, industry, case study and article in one file"),
    line("Sitemap", "/sitemap.xml"),
    "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
