import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, X } from "lucide-react";
import SiteShell from "@/components/system/SiteShell";
import Breadcrumbs from "@/components/system/Breadcrumbs";
import Reveal from "@/components/system/Reveal";
import { SectionEyebrow, SectionTitle, SectionDescription } from "@/components/system/SectionHeading";
import { Icon } from "@/lib/icons";
import FaqAccordion from "@/components/system/FaqAccordion";
import QuoteGrid from "@/components/system/QuoteGrid";
import { getCaseStudyBySlug } from "@/lib/caseStudies";
import {
  SAAS_SNAPSHOT,
  SAAS_PROBLEMS,
  SAAS_OUTCOMES,
  SAAS_SOLUTIONS,
  SAAS_USE_CASES,
  SAAS_PROCESS,
  SAAS_STACK,
  SAAS_TESTIMONIALS,
  SAAS_FAQS,
  SAAS_FAQ_JSON_LD,
} from "@/lib/industriesContent";
import { findBySlug, INDUSTRIES } from "@/lib/navigation";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "SaaS Development Services",
  description:
    "Multi-tenant architecture, billing, onboarding, and analytics for SaaS teams — from first MVP through your next growth stage.",
  alternates: { canonical: "/industries/saas" },
};

const IND = findBySlug(INDUSTRIES, "saas")!;
const PROOF = getCaseStudyBySlug("acculance")!;

const BREADCRUMB_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Industries", item: `${SITE_URL}/industries` },
    { "@type": "ListItem", position: 3, name: "SaaS", item: `${SITE_URL}/industries/saas` },
  ],
};

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="mb-5 font-urbanist text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-faint">{children}</p>;
}

export default function SaasIndustryPage() {
  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSON_LD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SAAS_FAQ_JSON_LD) }} />

      <div className="theme-light">
        {/* 1. Hero */}
        <div className="bg-light-surface p-3 sm:p-4">
          <Reveal distance={0}>
            <section className="relative overflow-hidden rounded-[32px] bg-canvas px-6 pb-16 pt-32 lg:px-10 lg:pb-20 lg:pt-32" aria-labelledby="saas-hero-heading">
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
                <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Industries", href: "/industries" }, { label: "SaaS" }]} />
                <span className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-hairline-light text-ink-dim">
                  <Icon name={IND.icon} size={20} />
                </span>
                <SectionEyebrow className="mx-auto w-fit">Industries · SaaS</SectionEyebrow>
                <SectionTitle as="h1" size="lg" id="saas-hero-heading">
                  SaaS products built to survive their own growth.
                </SectionTitle>
                <SectionDescription className="mx-auto mt-5 max-w-2xl">
                  Multi-tenant architecture, billing that flexes with your pricing, and onboarding built around the moment a
                  trial user decides to stay. For teams validating a first version and teams scaling past their first
                  hundred customers.
                </SectionDescription>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 font-urbanist text-sm font-semibold text-canvas transition-transform duration-300 hover:scale-[1.02]"
                  >
                    Talk about your SaaS product
                    <ArrowRight size={15} strokeWidth={1.75} />
                  </Link>
                  <Link
                    href="/case-studies/acculance"
                    className="inline-flex items-center gap-2 rounded-full border border-hairline-light px-7 py-3.5 font-urbanist text-sm font-semibold text-ink-dim transition-colors hover:border-ink-faint hover:text-ink"
                  >
                    See a SaaS build
                  </Link>
                </div>

                <Reveal delay={150}>
                  <div className="mx-auto mt-12 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
                    {IND.systems.concat(IND.outcome).map((s) => (
                      <div key={s} className="rounded-2xl border border-hairline-light bg-light-raised px-3 py-4 text-center">
                        <p className="font-urbanist text-[12.5px] font-semibold leading-snug text-ink">{s}</p>
                      </div>
                    ))}
                  </div>
                </Reveal>
              </div>
            </section>
          </Reveal>
        </div>

        {/* 2. SaaS snapshot */}
        <section className="bg-light-surface py-14 lg:py-20" aria-labelledby="snapshot-heading">
          <div className="mx-auto max-w-6xl px-6 lg:px-10">
            <Reveal>
              <SectionLabel>SaaS Snapshot</SectionLabel>
              <SectionTitle as="h2" id="snapshot-heading" className="max-w-xl">
                Who this is for, and what actually matters.
              </SectionTitle>
            </Reveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {SAAS_SNAPSHOT.map((s, i) => (
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

        {/* 3 & 4. Common problems + what changes after */}
        <section className="border-t border-hairline-light bg-light-surface py-14 lg:py-20" aria-labelledby="problems-heading">
          <div className="mx-auto max-w-6xl px-6 lg:px-10">
            <Reveal>
              <SectionLabel>Before / After</SectionLabel>
              <SectionTitle as="h2" id="problems-heading" className="max-w-xl">
                What most SaaS teams are dealing with — and what changes.
              </SectionTitle>
            </Reveal>
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <Reveal>
                <div className="h-full rounded-2xl border border-hairline-light bg-light-raised p-6 sm:p-7">
                  <p className="font-urbanist text-[13px] font-semibold uppercase tracking-[0.15em] text-ink-faint">Common problems</p>
                  <ul className="mt-5 space-y-3.5">
                    {SAAS_PROBLEMS.map((p) => (
                      <li key={p} className="flex items-start gap-3">
                        <X size={15} strokeWidth={2} className="mt-0.5 shrink-0 text-ink-faint" />
                        <span className="font-urbanist text-[13.5px] leading-relaxed text-ink-dim">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
              <Reveal delay={100}>
                <div className="h-full rounded-2xl border border-aurora-violet/25 bg-light-raised p-6 sm:p-7">
                  <p className="font-urbanist text-[13px] font-semibold uppercase tracking-[0.15em] text-aurora-violet">What changes after</p>
                  <ul className="mt-5 space-y-3.5">
                    {SAAS_OUTCOMES.map((o) => (
                      <li key={o} className="flex items-start gap-3">
                        <Check size={15} strokeWidth={2} className="mt-0.5 shrink-0 text-aurora-violet" />
                        <span className="font-urbanist text-[13.5px] leading-relaxed text-ink">{o}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* 5. Solutions mapped to service pillars */}
        <section className="border-t border-hairline-light bg-light-surface py-14 lg:py-20" aria-labelledby="solutions-heading">
          <div className="mx-auto max-w-6xl px-6 lg:px-10">
            <Reveal>
              <SectionLabel>How We Solve It</SectionLabel>
              <SectionTitle as="h2" id="solutions-heading" className="max-w-xl">
                Mapped to the services that actually do the work.
              </SectionTitle>
            </Reveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {SAAS_SOLUTIONS.map((s, i) => (
                <Reveal key={s.title} delay={i * 70}>
                  <div className="h-full rounded-2xl border border-hairline-light bg-light-raised p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-urbanist text-[15.5px] font-bold text-ink">{s.title}</h3>
                      <Link
                        href={s.href}
                        className="inline-flex items-center gap-1 font-urbanist text-[12px] font-semibold text-ink-faint transition-colors hover:text-aurora-violet"
                      >
                        Explore
                        <ArrowUpRight size={12} strokeWidth={1.75} />
                      </Link>
                    </div>
                    <ul className="mt-4 space-y-2">
                      {s.items.map((it) => (
                        <li key={it} className="flex items-start gap-2.5">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink-faint" />
                          <span className="font-urbanist text-[13.5px] leading-relaxed text-ink-dim">{it}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Use cases */}
        <section className="border-t border-hairline-light bg-light-surface py-14 lg:py-20" aria-labelledby="use-cases-heading">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <Reveal>
              <SectionLabel>Use Cases</SectionLabel>
              <SectionTitle as="h2" id="use-cases-heading" className="max-w-xl">
                What we actually build for SaaS teams.
              </SectionTitle>
            </Reveal>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {SAAS_USE_CASES.map((u, i) => (
                <Reveal key={u.title} delay={i * 35}>
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

        {/* 7. Featured work / proof */}
        <section className="border-t border-hairline-light bg-light-surface py-14 lg:py-20" aria-labelledby="proof-heading">
          <div className="mx-auto max-w-6xl px-6 lg:px-10">
            <Reveal>
              <SectionLabel>Featured Work</SectionLabel>
              <SectionTitle as="h2" id="proof-heading" className="max-w-xl">
                {PROOF.headline}
              </SectionTitle>
              <SectionDescription className="mt-4 max-w-2xl">{PROOF.summary}</SectionDescription>
            </Reveal>

            <div className="mt-10 grid gap-8 lg:grid-cols-2">
              <Reveal>
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-light-raised">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={PROOF.image} alt="" className="h-full w-full object-cover" />
                </div>
              </Reveal>
              <Reveal delay={80}>
                <div className="flex h-full flex-col justify-between gap-6">
                  <div>
                    <p className="font-urbanist text-[13px] font-semibold uppercase tracking-[0.15em] text-ink-faint">What we delivered</p>
                    <ul className="mt-4 space-y-2.5">
                      {(PROOF.deliverables ?? []).map((d) => (
                        <li key={d} className="flex items-start gap-2.5">
                          <Check size={14} strokeWidth={2} className="mt-0.5 shrink-0 text-aurora-violet" />
                          <span className="font-urbanist text-[13.5px] leading-relaxed text-ink-dim">{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {PROOF.stats.map((s) => (
                      <span key={s.label} className="rounded-full border border-hairline-light bg-light-surface px-3.5 py-1.5 font-urbanist text-[12px] text-ink-dim">
                        <span className="font-semibold text-ink">{s.value}</span> · {s.label}
                      </span>
                    ))}
                  </div>
                  <Link
                    href="/case-studies/acculance"
                    className="inline-flex items-center gap-1.5 font-urbanist text-[13.5px] font-semibold text-ink-mid transition-colors hover:text-aurora-violet"
                  >
                    Read the full case study
                    <ArrowRight size={14} strokeWidth={1.75} />
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* 8. How we work */}
        <section className="border-t border-hairline-light bg-light-surface py-14 lg:py-20" aria-labelledby="process-heading">
          <div className="mx-auto max-w-5xl px-6 lg:px-10">
            <Reveal>
              <SectionLabel>How We Work</SectionLabel>
              <SectionTitle as="h2" id="process-heading" className="max-w-xl">
                Six steps, one accountable team.
              </SectionTitle>
            </Reveal>
            <div className="mt-10 space-y-5">
              {SAAS_PROCESS.map((step, i) => (
                <Reveal key={step.n} delay={i * 50}>
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

        {/* 9. Tools & stack */}
        <section className="border-t border-hairline-light bg-light-surface py-14 lg:py-20" aria-labelledby="stack-heading">
          <div className="mx-auto max-w-6xl px-6 lg:px-10">
            <Reveal>
              <SectionLabel>Tools &amp; Stack</SectionLabel>
              <SectionTitle as="h2" id="stack-heading" className="max-w-xl">
                A modern, maintainable toolset — not resume-driven architecture.
              </SectionTitle>
            </Reveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {SAAS_STACK.map((cat, i) => (
                <Reveal key={cat.category} delay={i * 60}>
                  <div className="h-full rounded-2xl border border-hairline-light bg-light-raised p-6">
                    <p className="font-urbanist text-[13px] font-semibold uppercase tracking-[0.15em] text-ink-faint">{cat.category}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {cat.tools.map((t) => (
                        <span key={t} className="rounded-full border border-hairline-light bg-light-surface px-3 py-1.5 font-urbanist text-[12.5px] text-ink-dim">
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

        {/* 10. Testimonials */}
        <QuoteGrid id="saas-testimonials-heading" title="What SaaS teams say after shipping with us." items={SAAS_TESTIMONIALS} />

        {/* 11. FAQ */}
        <FaqAccordion id="saas-faq-heading" title="SaaS questions, answered" items={SAAS_FAQS} />

        {/* 12. Final CTA */}
        <div className="bg-light-surface p-3 sm:p-4">
          <Reveal>
            <div className="relative overflow-hidden rounded-[32px] border border-hairline-light bg-canvas px-6 py-14 sm:px-12 lg:px-16 lg:py-20">
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
              <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
                <div>
                  <SectionEyebrow>Next step</SectionEyebrow>
                  <SectionTitle size="lg" className="max-w-md">
                    Ready to build the next version of your SaaS product?
                  </SectionTitle>
                  <SectionDescription className="mt-4 max-w-md">
                    Tell us where your product is today — MVP, growth stage, or mid-rebuild — and we&apos;ll recommend a starting
                    point.
                  </SectionDescription>
                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 font-urbanist text-sm font-semibold text-canvas transition-transform duration-300 hover:scale-[1.02]"
                    >
                      Book a Call
                      <ArrowRight size={15} strokeWidth={1.75} />
                    </Link>
                    <Link
                      href="/engagement/mvp-sprint"
                      className="inline-flex items-center gap-2 rounded-full border border-hairline-light px-7 py-3.5 font-urbanist text-sm font-semibold text-ink-dim transition-colors hover:border-ink-faint hover:text-ink"
                    >
                      Explore MVP Sprint
                    </Link>
                  </div>
                </div>
                <ol className="space-y-4">
                  {[
                    { n: "1", text: "Quick call — current stage, goals, honest fit check" },
                    { n: "2", text: "Scope + plan — architecture, engagement model, timeline" },
                    { n: "3", text: "Kickoff within about a week" },
                  ].map((s) => (
                    <li key={s.n} className="flex items-start gap-4 rounded-xl border border-hairline-light bg-light-raised px-5 py-4">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-aurora-violet/50 font-urbanist text-xs font-medium text-ink">
                        {s.n}
                      </span>
                      <span className="font-urbanist text-sm leading-relaxed text-ink-dim">{s.text}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </SiteShell>
  );
}
