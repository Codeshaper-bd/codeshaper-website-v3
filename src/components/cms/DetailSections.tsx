import Link from "next/link";
import { ArrowUpRight, Check, X } from "lucide-react";
import Reveal from "@/components/system/Reveal";
import CaseStudyCard from "@/components/case-studies/CaseStudyCard";
import PostCard from "@/components/blog/PostCard";
import BlogFaqAccordion from "@/components/blog/BlogFaqAccordion";
import RichContent from "@/components/cms/RichContent";
import { JsonLd, ServicesSection } from "@/components/services/ServicePageParts";
import { Icon } from "@/lib/icons";
import { getCaseStudyBySlug } from "@/lib/caseStudies";
import { getPostBySlug } from "@/lib/blog";
import { videoEmbed, type Card, type Detail, type Step } from "@/lib/details";
import type { ReactNode } from "react";

/**
 * Everything a service, industry or engagement model can hold in the CMS.
 * A section appears only when it is filled in.
 */
function Cards({ items, columns = "sm:grid-cols-2 lg:grid-cols-3" }: { items: Card[]; columns?: string }) {
  return (
    <div className={`mt-10 grid gap-5 ${columns}`}>
      {items.map((c, i) => (
        <Reveal key={c.title} delay={(i % 3) * 70}>
          <div className="h-full rounded-2xl border border-hairline-light bg-light-raised p-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline-light text-aurora-violet">
              <Icon name={c.icon} size={17} />
            </span>
            <h3 className="mt-4 font-urbanist text-[15.5px] font-bold text-ink">{c.title}</h3>
            {c.description && <p className="mt-2 font-urbanist text-[13.5px] leading-relaxed text-ink-dim">{c.description}</p>}
          </div>
        </Reveal>
      ))}
    </div>
  );
}

function Lines({ items, no = false }: { items: string[]; no?: boolean }) {
  const Mark = no ? X : Check;
  return (
    <ul className="mt-8 grid gap-x-10 gap-y-4 sm:grid-cols-2">
      {items.map((t) => (
        <li key={t} className="flex gap-3 font-urbanist text-[15px] leading-relaxed text-ink-dim">
          <span className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${no ? "bg-ink/[0.06] text-ink-faint" : "bg-aurora-violet/10 text-aurora-violet"}`}>
            <Mark size={12} strokeWidth={2.5} aria-hidden />
          </span>
          {t}
        </li>
      ))}
    </ul>
  );
}

function Steps({ items }: { items: Step[] }) {
  return (
    <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((s, i) => (
        <Reveal key={s.title} delay={(i % 3) * 70}>
          <li className="h-full rounded-2xl border border-hairline-light bg-light-raised p-6">
            <span className="font-urbanist text-[13px] font-bold text-aurora-violet">{s.n.padStart(2, "0")}</span>
            <h3 className="mt-2 font-urbanist text-[15.5px] font-bold text-ink">{s.title}</h3>
            {s.description && <p className="mt-2 font-urbanist text-[13.5px] leading-relaxed text-ink-dim">{s.description}</p>}
          </li>
        </Reveal>
      ))}
    </ol>
  );
}

const faqLd = (faqs: { q: string; a: string }[]) => ({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) });

type Part = { key: string; label: string; title: string; body: ReactNode };

export function detailParts(d: Detail, name: string): Part[] {
  const stories = (d.caseStudies ?? []).flatMap((s) => getCaseStudyBySlug(s) ?? []);
  const posts = (d.posts ?? []).flatMap((s) => getPostBySlug(s) ?? []);
  const facts = Object.entries({ Timeline: d.facts?.timeline, Team: d.facts?.team, "Starting price": d.facts?.price, "After launch": d.facts?.support }).filter(([, v]) => v);
  const video = d.video ? videoEmbed(d.video.url) : null;
  const parts: (Part | false | undefined | null)[] = [
    d.snapshot && { key: "snapshot", label: "At a glance", title: `${name}, in short.`, body: <Cards items={d.snapshot} /> },
    d.stats && { key: "stats", label: "Results", title: "What it looks like in numbers.", body: <dl className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{d.stats.map((s) => <div key={s.label}><dt className="sr-only">{s.label}</dt><dd className="font-urbanist text-4xl font-bold tracking-tight text-ink">{s.value}</dd><dd className="mt-1 font-urbanist text-[14px] text-ink-dim">{s.label}</dd></div>)}</dl> },
    d.problems && { key: "problems", label: "The problem", title: "Where teams usually get stuck.", body: <Lines items={d.problems} /> },
    d.deliverables && { key: "deliver", label: "What We Deliver", title: `What you get with ${name}.`, body: <Cards items={d.deliverables} /> },
    d.solutions && { key: "solutions", label: "Solutions", title: "How we help.", body: <div className="mt-10 grid gap-5 sm:grid-cols-2">{d.solutions.map((s) => { const inner = <><span className="flex items-center justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline-light text-aurora-violet"><Icon name={s.icon ?? "sparkles"} size={17} /></span>{s.href && <ArrowUpRight size={15} className="text-ink-faint" />}</span><span className="mt-4 block font-urbanist text-[16px] font-bold text-ink">{s.title}</span><span className="mt-3 grid gap-2">{(s.items ?? []).map((t) => <span key={t} className="flex gap-2 font-urbanist text-[13.5px] text-ink-dim"><Check size={14} className="mt-0.5 shrink-0 text-aurora-violet" />{t}</span>)}</span></>; const cls = "block h-full rounded-2xl border border-hairline-light bg-light-raised p-6 transition-colors hover:border-aurora-violet/40"; return s.href ? <Link key={s.title} href={s.href} className={cls}>{inner}</Link> : <div key={s.title} className={cls}>{inner}</div>; })}</div> },
    d.useCases && { key: "use-cases", label: "Use cases", title: "Where it helps most.", body: <Cards items={d.useCases} /> },
    d.benefits && { key: "benefits", label: "Why CodeShaper", title: "What makes the difference.", body: <Cards items={d.benefits} /> },
    d.outcomes && { key: "outcomes", label: "Outcomes", title: "What improves for you.", body: <Lines items={d.outcomes} /> },
    (d.goodFit || d.notIdeal) && { key: "fit", label: "Is it right for you?", title: "When it fits, and when it does not.", body: <div className="grid gap-x-12 lg:grid-cols-2">{d.goodFit && <div><h3 className="mt-8 font-urbanist text-[16px] font-bold text-ink">A good fit when</h3><Lines items={d.goodFit} /></div>}{d.notIdeal && <div><h3 className="mt-8 font-urbanist text-[16px] font-bold text-ink">Not ideal when</h3><Lines items={d.notIdeal} no /></div>}</div> },
    d.process && { key: "process", label: "How It Works", title: "How the engagement runs, step by step.", body: <Steps items={d.process} /> },
    facts.length > 0 && { key: "facts", label: "Time, team and price", title: "What to expect.", body: <dl className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{facts.map(([k, v]) => <div key={k} className="rounded-2xl border border-hairline-light bg-light-raised p-5"><dt className="font-urbanist text-[13px] text-ink-faint">{k}</dt><dd className="mt-1 font-urbanist text-[16px] font-bold text-ink">{v}</dd></div>)}</dl> },
    d.stack && { key: "stack", label: "Tech Stack", title: "Tools and platforms we use.", body: <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{d.stack.map((s) => <div key={s.category} className="rounded-2xl border border-hairline-light bg-light-raised p-6"><h3 className="font-urbanist text-[15px] font-bold text-ink">{s.category}</h3><ul className="mt-3 flex flex-wrap gap-2">{s.tools.map((t) => <li key={t} className="rounded-full border border-hairline-light px-3 py-1 font-urbanist text-[12.5px] text-ink-dim">{t}</li>)}</ul></div>)}</div> },
    d.guardrails && { key: "guardrails", label: "Standards", title: "How we keep it safe and reliable.", body: <Lines items={d.guardrails} /> },
    d.compliance && { key: "compliance", label: "Compliance", title: "Rules we build for.", body: <Cards items={d.compliance} /> },
    d.integrations && { key: "integrations", label: "Integrations", title: "Systems we connect.", body: <ul className="mt-8 flex flex-wrap gap-2.5">{d.integrations.map((t) => <li key={t} className="rounded-full border border-hairline-light bg-light-raised px-4 py-2 font-urbanist text-[13.5px] text-ink-dim">{t}</li>)}</ul> },
    d.compare && { key: "compare", label: "Compare", title: "Your options, side by side.", body: <div className="mt-10 overflow-x-auto"><table className="w-full min-w-[36rem] border-collapse text-left font-urbanist text-[14px]"><thead><tr className="border-b border-hairline-light text-ink-faint"><th className="py-3 pr-6 font-medium">Option</th><th className="py-3 pr-6 font-medium">Best for</th><th className="py-3 font-medium">Watch out for</th></tr></thead><tbody>{d.compare.map((r) => <tr key={r.title} className="border-b border-hairline-light align-top"><th scope="row" className="py-4 pr-6 font-bold text-ink">{r.title}</th><td className="py-4 pr-6 text-ink-dim">{r.best_for}</td><td className="py-4 text-ink-dim">{r.watch_out}</td></tr>)}</tbody></table></div> },
    d.mistakes && { key: "mistakes", label: "Avoid", title: "Common mistakes.", body: <Lines items={d.mistakes} no /> },
    Boolean(d.html) && { key: "design", label: "", title: "", body: <RichContent html={d.html} /> },
    Boolean(d.gallery || video) && { key: "media", label: "See it", title: "A closer look.", body: <div className="mt-10 grid gap-5 sm:grid-cols-2">{video && <iframe src={video} title={name} loading="lazy" allowFullScreen className="aspect-video w-full rounded-2xl sm:col-span-2" />}{(d.gallery ?? []).map((g) => <figure key={g.src}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={g.src} alt={g.alt ?? ""} loading="lazy" className="w-full rounded-2xl" />{g.caption && <figcaption className="mt-2 font-urbanist text-[13px] text-ink-faint">{g.caption}</figcaption>}</figure>)}</div> },
    d.reviews && { key: "reviews", label: "Client reviews", title: "What clients said.", body: <div className="mt-10 grid gap-5 lg:grid-cols-2">{d.reviews.map((r) => <figure key={r.name} className="rounded-2xl border border-hairline-light bg-light-raised p-7"><blockquote className="font-urbanist text-[17px] leading-relaxed text-ink">{r.quote}</blockquote><figcaption className="mt-5 font-urbanist text-[14px] text-ink-dim"><b className="text-ink">{r.name}</b>{[r.role, r.company].filter(Boolean).length > 0 && `, ${[r.role, r.company].filter(Boolean).join(", ")}`}</figcaption></figure>)}</div> },
    stories.length > 0 && { key: "case-studies", label: "Related Case Studies", title: "Proof in real builds.", body: <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{stories.map((s) => <CaseStudyCard key={s.slug} story={s} />)}</div> },
    d.faqs && { key: "faq", label: "FAQ", title: `${name} questions, answered.`, body: <div className="mt-8"><JsonLd data={faqLd(d.faqs)} /><BlogFaqAccordion faqs={d.faqs} /></div> },
    posts.length > 0 && { key: "posts", label: "Read more", title: "From the blog.", body: <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{posts.map((x) => <PostCard key={x.slug} post={x} />)}</div> },
    d.resources && { key: "resources", label: "Resources", title: "Useful links.", body: <ul className="mt-8 grid gap-3">{d.resources.map((r) => <li key={r.href}><Link href={r.href} className="font-urbanist text-[15px] font-semibold text-aurora-violet hover:underline">{r.title}</Link></li>)}</ul> },
  ];
  return parts.filter((p): p is Part => Boolean(p));
}

export default function DetailSections({ detail, name, first = false, skip = [] }: { detail: Detail; name: string; first?: boolean; skip?: string[] }) {
  const parts = detailParts(detail, name).filter((p) => !skip.includes(p.key));
  if (!parts.length) return null;
  return (
    <div className="theme-light">
      {parts.map((p, i) =>
        p.title ? (
          <ServicesSection key={p.key} id={`detail-${p.key}`} first={first && i === 0} label={p.label} title={p.title}>{p.body}</ServicesSection>
        ) : (
          <section key={p.key} className="bg-light-surface py-14 lg:py-20"><div className="mx-auto max-w-4xl px-6 lg:px-10">{p.body}</div></section>
        ),
      )}
    </div>
  );
}
