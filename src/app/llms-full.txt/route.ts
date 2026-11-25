import { SITE_URL, SITE_NAME } from "@/lib/site";
import { SITE } from "@/lib/siteSettings";
import { SERVICE_GROUPS, SERVICES, ENGAGEMENT_MODELS, servicePath } from "@/data/services";
import { INDUSTRIES } from "@/lib/navigation";
import { CASE_STUDIES } from "@/lib/caseStudies";
import { BLOG_POSTS } from "@/lib/blog";
import { LLMS_EXTRA, LLMS_FACTS, LLMS_SUMMARY, flat } from "@/lib/llms";

/**
 * /llms-full.txt: the whole website in one Markdown file for AI assistants
 * (owner, 25 Nov 2026: "number one in AI and Google results"). Every
 * service, industry, way of working, case study and article with its FAQ,
 * all from the same published content as the pages, so an assistant can
 * answer "who builds X" questions accurately and link to the right page.
 * Nothing here is written by hand except the CMS summary, facts and extra.
 */
export const dynamic = "force-static";

export function GET() {
  const url = (path: string) => `${SITE_URL}${path}`;
  const out: string[] = [`# ${SITE_NAME}`, "", `> ${flat(LLMS_SUMMARY)}`, ""];
  const push = (...l: string[]) => out.push(...l);

  if (LLMS_FACTS.length) push("## Key facts", "", ...LLMS_FACTS.map((f) => `- ${f}`), "");

  push("## Services", "");
  for (const g of SERVICE_GROUPS) {
    push(`### ${g.name}`, "", `URL: ${url(servicePath(g.slug))}`, "");
    if (g.focus) push(flat(g.focus), "");
    const inGroup = SERVICES.filter((s) => s.groupSlug === g.slug && !s.hidden);
    if (inGroup.length) push(...inGroup.map((s) => `- [${s.title}](${url(servicePath(s.slug))}): ${flat(s.summary)}`), "");
  }

  push("## Industries", "", ...INDUSTRIES.map((i) => `- [${i.label}](${url(i.href)})${i.desc ? `: ${flat(i.desc)}` : ""}`), "");

  push("## How we engage", "", ...ENGAGEMENT_MODELS.map((m) => `- [${m.title ?? m.label}](${url(m.href)}): ${flat(m.longDescription ?? m.desc)}`), "");

  if (CASE_STUDIES.length) {
    push("## Case studies", "");
    for (const c of CASE_STUDIES) {
      push(`### ${c.project}: ${flat(c.headline)}`, "", `URL: ${url(`/case-studies/${c.slug}`)}`, "", flat(c.summary), "");
      const meta = [c.industry && `Industry: ${c.industry}`, c.market && `Market: ${c.market}`, c.services?.length && `Services: ${c.services.join(", ")}`, c.tech?.length && `Technology: ${c.tech.join(", ")}`].filter(Boolean) as string[];
      if (meta.length) push(...meta.map((m) => `- ${m}`), "");
      if (c.stats?.length) push("Results:", "", ...c.stats.map((s) => `- ${s.value} ${s.label}`), "");
    }
  }

  if (BLOG_POSTS.length) {
    push("## Articles", "");
    for (const p of BLOG_POSTS) {
      push(`### ${p.title}`, "", `URL: ${url(`/blog/${p.slug}`)}`, "", flat(p.excerpt), "");
      if (p.summaryPoints?.length) push(...p.summaryPoints.map((s) => `- ${flat(s)}`), "");
      if (p.faqs?.length) push(...p.faqs.flatMap((f) => [`**Q: ${flat(f.q)}**`, "", flat(f.a), ""]));
    }
  }

  push("## Contact", "", `- Start a project or book a call: ${url("/contact")}`);
  if (SITE.contact.email) push(`- Email: ${SITE.contact.email}`);
  push("");
  if (LLMS_EXTRA) push(LLMS_EXTRA, "");

  return new Response(out.join("\n"), { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
