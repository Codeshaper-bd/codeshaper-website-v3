import { SITE_URL } from "@/lib/site";
import { SITE } from "@/lib/siteSettings";

/**
 * robots.txt, written by hand (not MetadataRoute.Robots) so the CMS can add
 * its own lines (CMS › Settings › AI and search engines).
 *
 * Stubs: routes that are still scaffolded stubs (see `[...slug]/page.tsx`
 * and `sitemap.ts`) are disallowed; remove each as it gets a real page.
 * /legal/privacy and /legal/terms are deliberately NOT here: they carry their
 * own `noindex`, and a disallow would stop crawlers from ever seeing it.
 *
 * AI bots (owner, 25 Nov 2026: "be number one in AI and Google results"):
 *  · answer engines (ChatGPT search, Claude, Perplexity…) quote and link to
 *    the site; they get their own group, allowed unless the CMS turns them off.
 *  · training crawlers (GPTBot, ClaudeBot, Google-Extended, Common Crawl…)
 *    teach future models about CodeShaper; allowed unless turned off.
 * Google-Extended only controls Gemini training; Google Search ranking is
 * unaffected either way. A bot that matches a named group ignores `*`, so
 * each group repeats the stub rules.
 */
export const dynamic = "force-static";

const STUBS = ["/company/leadership", "/company/life", "/company/clients", "/company/locations", "/company/careers", "/insights", "/preview/"];

const AI_SEARCH = ["OAI-SearchBot", "ChatGPT-User", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User", "DuckAssistBot", "MistralAI-User"];
const AI_TRAINING = ["GPTBot", "ClaudeBot", "Google-Extended", "Applebot-Extended", "CCBot", "meta-externalagent", "Amazonbot", "Bytespider"];

const group = (agents: string[], allowed: boolean) =>
  [...agents.map((a) => `User-agent: ${a}`), ...(allowed ? ["Allow: /", ...STUBS.map((s) => `Disallow: ${s}`)] : ["Disallow: /"])].join("\n");

export function GET() {
  const c = SITE.crawlers ?? {};
  const body = [
    group(["*"], true),
    `# AI answer engines: quote and link to the site in answers\n${group(AI_SEARCH, c.aiSearch !== false)}`,
    `# AI training crawlers\n${group(AI_TRAINING, c.aiTraining !== false)}`,
    ...(c.robotsExtra ? [`# From the CMS\n${c.robotsExtra}`] : []),
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    "",
  ].join("\n\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
