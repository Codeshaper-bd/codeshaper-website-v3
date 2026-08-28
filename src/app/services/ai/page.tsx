import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, X } from "lucide-react";
import SiteShell from "@/components/system/SiteShell";
import Breadcrumbs from "@/components/system/Breadcrumbs";
import Reveal from "@/components/system/Reveal";
import { SectionEyebrow, SectionTitle, SectionDescription } from "@/components/system/SectionHeading";
import { Icon, SERVICE_ICONS } from "@/lib/icons";
import FaqAccordion from "@/components/system/FaqAccordion";
import QuoteGrid from "@/components/system/QuoteGrid";
import { SERVICE_COLUMNS } from "@/lib/navigation";
import {
  AI_SNAPSHOT,
  AI_USE_CASES,
  AI_GOOD_FIT,
  AI_NOT_IDEAL,
  AI_PROCESS,
  AI_GUARDRAILS,
  AI_STACK,
  AI_TESTIMONIALS,
  AI_FAQS,
} from "@/lib/servicesContent";
import { SITE_URL } from "@/lib/site";

const COL = SERVICE_COLUMNS.find((c) => c.id === "ai")!;

export const metadata: Metadata = {
  title: "AI & Automation Services",
  description:
    "AI strategy, custom AI agents, RAG workflows, and process automation — practical AI that creates operational leverage, not hype.",
  alternates: { canonical: "/services/ai" },
};

const BREADCRUMB_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Services", item: `${SITE_URL}/services` },
    { "@type": "ListItem", position: 3, name: "AI & Automation", item: `${SITE_URL}/services/ai` },
  ],
};

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: AI_FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="mb-5 font-urbanist text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-faint">{children}</p>;
}

export default function AiAutomationPage() {
  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSON_LD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }} />

      <div className="theme-light">
        {/* 1. Hero */}
        <div className="bg-light-surface p-3 sm:p-4">
          <Reveal distance={0}>
            <section className="relative overflow-hidden rounded-[32px] bg-canvas px-6 pb-16 pt-32 lg:px-10 lg:pb-20 lg:pt-32" aria-labelledby="ai-hero-heading">
              <div
                aria-hidden
                className="absolute inset-0 opacity-[0.03]"
                style={{ backgroundImage: "url(/media/hex-pattern-tile.svg)", backgroundSize: "112px 194px" }}
              />
              <div
                aria-hidden
                className="absolute left-1/2 top-0 h-[420px] w-[640px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-30 blur-3xl"
                style={{ background: "radial-gradient(closest-side, rgba(124,108,255,0.16), transparent)" }}
              />
              <div className="relative mx-auto max-w-3xl text-center">
                <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: "AI & Automation" }]} />
                <span className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-hairline-light text-ink-dim">
                  <Icon name={SERVICE_ICONS.ai} size={20} />
                </span>
                <SectionEyebrow className="mx-auto w-fit">Services · AI &amp; Automation</SectionEyebrow>
                <SectionTitle as="h1" size="lg" id="ai-hero-heading">
                  AI automation, custom agents, RAG &amp; workflow automation.
                </SectionTitle>
                <SectionDescription className="mx-auto mt-5 max-w-2xl">
                  We use AI where it creates operational leverage — supporting teams with faster workflows, grounded
                  search, and automation across the tools they already run. Practical, not hype.
                </SectionDescription>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 font-urbanist text-sm font-semibold text-canvas transition-transform duration-300 hover:scale-[1.02]"
                  >
                    Talk about your workflow
                    <ArrowRight size={15} strokeWidth={1.75} />
                  </Link>
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 rounded-full border border-hairline-light px-7 py-3.5 font-urbanist text-sm font-semibold text-ink-dim transition-colors hover:border-ink-faint hover:text-ink"
                  >
                    See all services
                  </Link>
                </div>
              </div>
            </section>
          </Reveal>
        </div>

        {/* 2. Snapshot */}
        <section className="bg-light-surface py-14 lg:py-20" aria-labelledby="snapshot-heading">
          <div className="mx-auto max-w-6xl px-6 lg:px-10">
            <Reveal>
              <SectionLabel>Snapshot</SectionLabel>
              <SectionTitle as="h2" id="snapshot-heading" className="max-w-xl">
                Who this is for, and what actually matters.
              </SectionTitle>
            </Reveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {AI_SNAPSHOT.map((s, i) => (
                <Reveal key={s.title} delay={i * 80}>
                  <div className="h-full rounded-2xl border border-hairline-light bg-light-raised p-6">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline-light text-ink-dim">
                      <Icon name={s.icon} size={17} />
                    </span>
                    <h3 className="mt-4 font-urbanist text-[15px] font-bold text-ink">{s.title}</h3>
                    <p className="mt-2 font-urbanist text-[13.5px] leading-relaxed text-ink-dim">{s.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 3. What's included */}
        <section className="border-t border-hairline-light bg-light-surface py-14 lg:py-20" aria-labelledby="includes-heading">
          <div className="mx-auto max-w-6xl px-6 lg:px-10">
            <Reveal>
              <SectionLabel>What's Included</SectionLabel>
              <SectionTitle as="h2" id="includes-heading" className="max-w-xl">
                Four ways we work with AI &amp; automation.
              </SectionTitle>
            </Reveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {COL.links.map((link, i) => (
                <Reveal key={link.href} delay={i * 70}>
                  <Link
                    href={link.href}
                    className="group flex h-full flex-col rounded-2xl border border-hairline-light bg-light-raised p-6 transition-colors duration-300 hover:border-aurora-violet/40"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline-light text-ink-dim transition-colors duration-300 group-hover:border-aurora-violet/50 group-hover:text-aurora-violet">
                        <Icon name={link.icon} size={17} />
                      </span>
                      <ArrowUpRight size={15} strokeWidth={1.75} className="text-ink-faint transition-colors group-hover:text-aurora-violet" />
                    </div>
                    <h3 className="mt-4 font-urbanist text-[15.5px] font-bold text-ink">{link.label}</h3>
                    <p className="mt-2 flex-1 font-urbanist text-[13.5px] leading-relaxed text-ink-dim">{link.longDescription}</p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Use cases */}
        <section className="border-t border-hairline-light bg-light-surface py-14 lg:py-20" aria-labelledby="use-cases-heading">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <Reveal>
              <SectionLabel>Use Cases</SectionLabel>
              <SectionTitle as="h2" id="use-cases-heading" className="max-w-xl">
                Where AI creates real leverage.
              </SectionTitle>
            </Reveal>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {AI_USE_CASES.map((u, i) => (
                <Reveal key={u.title} delay={i * 40}>
                  <div className="flex h-full flex-col rounded-2xl border border-hairline-light bg-light-raised p-5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline-light text-ink-dim">
                      <Icon name={u.icon} size={16} />
                    </span>
                    <h3 className="mt-4 font-urbanist text-[14px] font-bold text-ink">{u.title}</h3>
                    <p className="mt-1.5 flex-1 font-urbanist text-[12.5px] leading-relaxed text-ink-dim">{u.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Good fit / not ideal */}
        <section className="border-t border-hairline-light bg-light-surface py-14 lg:py-20" aria-labelledby="fit-heading">
          <div className="mx-auto max-w-6xl px-6 lg:px-10">
            <Reveal>
              <SectionLabel>Is This The Right Fit?</SectionLabel>
              <SectionTitle as="h2" id="fit-heading" className="max-w-xl">
                Where AI helps — and where it doesn't, yet.
              </SectionTitle>
            </Reveal>
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <Reveal>
                <div className="h-full rounded-2xl border border-aurora-violet/25 bg-light-raised p-6 sm:p-7">
                  <p className="font-urbanist text-[13px] font-semibold uppercase tracking-[0.15em] text-aurora-violet">Good fit</p>
                  <ul className="mt-5 space-y-3.5">
                    {AI_GOOD_FIT.map((p) => (
                      <li key={p} className="flex items-start gap-3">
                        <Check size={15} strokeWidth={2} className="mt-0.5 shrink-0 text-aurora-violet" />
                        <span className="font-urbanist text-[13.5px] leading-relaxed text-ink">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
              <Reveal delay={100}>
                <div className="h-full rounded-2xl border border-hairline-light bg-light-raised p-6 sm:p-7">
                  <p className="font-urbanist text-[13px] font-semibold uppercase tracking-[0.15em] text-ink-faint">Not ideal, yet</p>
                  <ul className="mt-5 space-y-3.5">
                    {AI_NOT_IDEAL.map((p) => (
                      <li key={p} className="flex items-start gap-3">
                        <X size={15} strokeWidth={2} className="mt-0.5 shrink-0 text-ink-faint" />
                        <span className="font-urbanist text-[13.5px] leading-relaxed text-ink-dim">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* 6. How we work */}
        <section className="border-t border-hairline-light bg-light-surface py-14 lg:py-20" aria-labelledby="process-heading">
          <div className="mx-auto max-w-5xl px-6 lg:px-10">
            <Reveal>
              <SectionLabel>How We Work</SectionLabel>
              <SectionTitle as="h2" id="process-heading" className="max-w-xl">
                Five steps, always with a human check.
              </SectionTitle>
            </Reveal>
            <div className="mt-10 space-y-5">
              {AI_PROCESS.map((step, i) => (
                <Reveal key={step.n} delay={i * 60}>
                  <div className="flex items-start gap-5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink font-urbanist text-[13px] font-bold text-canvas">
                      {step.n}
                    </span>
                    <div className="border-b border-hairline-light pb-5">
                      <h3 className="font-urbanist text-[15px] font-bold text-ink">{step.title}</h3>
                      <p className="mt-1.5 font-urbanist text-[13.5px] leading-relaxed text-ink-dim">{step.description}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Guardrails */}
        <section className="border-t border-hairline-light bg-light-surface py-14 lg:py-20" aria-labelledby="guardrails-heading">
          <div className="mx-auto max-w-4xl px-6 lg:px-10">
            <Reveal>
              <SectionLabel>Guardrails</SectionLabel>
              <SectionTitle as="h2" id="guardrails-heading" className="max-w-xl">
                Standards that keep AI accountable.
              </SectionTitle>
            </Reveal>
            <div className="mt-8 grid gap-3">
              {AI_GUARDRAILS.map((g, i) => (
                <Reveal key={g} delay={i * 40}>
                  <div className="flex items-start gap-2.5 rounded-xl border border-hairline-light bg-light-raised px-4 py-3.5">
                    <Check size={14} strokeWidth={2} className="mt-0.5 shrink-0 text-aurora-violet" />
                    <span className="font-urbanist text-[13px] leading-relaxed text-ink-dim">{g}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 8. Tools & stack */}
        <section className="border-t border-hairline-light bg-light-surface py-14 lg:py-20" aria-labelledby="stack-heading">
          <div className="mx-auto max-w-6xl px-6 lg:px-10">
            <Reveal>
              <SectionLabel>Tools &amp; Stack</SectionLabel>
              <SectionTitle as="h2" id="stack-heading" className="max-w-xl">
                The infrastructure behind the automation.
              </SectionTitle>
            </Reveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {AI_STACK.map((cat, i) => (
                <Reveal key={cat.category} delay={i * 60}>
                  <div className="h-full rounded-2xl border border-hairline-light bg-light-raised p-6">
                    <p className="font-urbanist text-[13px] font-semibold uppercase tracking-[0.14em] text-ink-faint">{cat.category}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {cat.tools.map((t) => (
                        <span key={t} className="rounded-full border border-hairline-light bg-light-surface px-3 py-1.5 font-urbanist text-[12px] text-ink-dim">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 9. Testimonials */}
        <QuoteGrid id="ai-testimonials-heading" title="What teams say after automating with us." items={AI_TESTIMONIALS} />

        {/* 10. FAQ */}
        <FaqAccordion id="ai-faq-heading" title="AI & Automation questions, answered" items={AI_FAQS} />

        {/* 11. Final CTA */}
        <div className="bg-light-surface p-3 sm:p-4">
          <Reveal>
            <div className="relative overflow-hidden rounded-[32px] border border-hairline-light bg-canvas px-6 py-14 text-center sm:px-12 lg:px-16 lg:py-20">
              <div
                aria-hidden
                className="absolute inset-0 opacity-[0.03]"
                style={{ backgroundImage: "url(/media/hex-pattern-tile.svg)", backgroundSize: "112px 194px" }}
              />
              <div
                aria-hidden
                className="absolute left-1/2 top-0 h-[420px] w-[640px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-30 blur-3xl"
                style={{ background: "radial-gradient(closest-side, rgba(124,108,255,0.16), transparent)" }}
              />
              <div className="relative">
                <SectionEyebrow className="mx-auto w-fit">Next step</SectionEyebrow>
                <SectionTitle size="lg" className="mx-auto max-w-2xl">
                  Have a workflow worth automating?
                </SectionTitle>
                <SectionDescription className="mx-auto mt-4 max-w-xl">
                  Tell us what's manual today — we'll map where AI actually helps, and where it doesn't.
                </SectionDescription>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 font-urbanist text-sm font-semibold text-canvas transition-transform duration-300 hover:scale-[1.02]"
                  >
                    Book a Call
                    <ArrowRight size={15} strokeWidth={1.75} />
                  </Link>
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 rounded-full border border-hairline-light px-7 py-3.5 font-urbanist text-sm font-semibold text-ink-dim transition-colors hover:border-ink-faint hover:text-ink"
                  >
                    See all services
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </SiteShell>
  );
}
