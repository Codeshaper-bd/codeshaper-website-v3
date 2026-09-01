import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Check, X } from "lucide-react";
import SiteShell from "@/components/system/SiteShell";
import Breadcrumbs from "@/components/system/Breadcrumbs";
import Reveal from "@/components/system/Reveal";
import { SectionEyebrow, SectionTitle, SectionDescription } from "@/components/system/SectionHeading";
import { Icon } from "@/lib/icons";
import FaqAccordion from "@/components/system/FaqAccordion";
import { findBySlug, ENGAGEMENT_MODELS } from "@/lib/navigation";
import {
  MVP_BENEFITS,
  MVP_AI_EDGE,
  MVP_GOOD_FIT,
  MVP_NOT_IDEAL,
  MVP_DELIVERABLES,
  MVP_TEAM,
  MVP_TEAM_SPECIALISTS,
  MVP_YOU_PROVIDE,
  MVP_TIMELINE,
  MVP_ENGINEERING_STANDARDS,
  MVP_COMMUNICATION_STANDARDS,
  MVP_PRICING,
  MVP_PRICING_DEPENDS_ON,
  MVP_FAQS,
  DELIVERY_TOOLS,
} from "@/lib/engagementContent";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "MVP Sprint",
  description:
    "Launch a market-ready MVP fast — with disciplined scope and weekly momentum, from scope to launch, with a clean handover for v2.",
  alternates: { canonical: "/engagement/mvp-sprint" },
};

const MODEL = findBySlug(ENGAGEMENT_MODELS, "mvp-sprint")!;

const BREADCRUMB_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Engagement Models", item: `${SITE_URL}/engagement` },
    { "@type": "ListItem", position: 3, name: "MVP Sprint", item: `${SITE_URL}/engagement/mvp-sprint` },
  ],
};

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: MVP_FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="mb-5 font-urbanist text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-faint">{children}</p>;
}

const MINI_TIMELINE = ["Week 1 — Kickoff", "Weekly Demos", "Launch"];

export default function MvpSprintPage() {
  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSON_LD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }} />

      <div className="theme-light">
        {/* 1. Hero */}
        <div className="bg-light-surface p-3 sm:p-4">
          <Reveal distance={0}>
            <section className="relative overflow-hidden rounded-[32px] bg-canvas px-6 pb-16 pt-32 lg:px-10 lg:pb-20 lg:pt-32" aria-labelledby="mvp-hero-heading">
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
                <div className="flex justify-center">
                  <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Engagement Models", href: "/engagement" }, { label: "MVP Sprint" }]} />
                </div>
                <span className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-hairline-light text-ink-dim">
                  <Icon name={MODEL.icon} size={20} />
                </span>
                <SectionEyebrow className="mx-auto w-fit">Engagement Models · MVP Sprint</SectionEyebrow>
                <SectionTitle as="h1" size="lg" id="mvp-hero-heading">
                  Launch a market-ready MVP fast — with disciplined scope and weekly momentum.
                </SectionTitle>
                <SectionDescription className="mx-auto mt-5 max-w-2xl">
                  A time-boxed delivery model for founders and product teams who want speed, clarity, and confidence —
                  from scope to launch, with a clean handover for v2.
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
                    href="/case-studies"
                    className="inline-flex items-center gap-2 rounded-full border border-hairline-light px-7 py-3.5 font-urbanist text-sm font-semibold text-ink-dim transition-colors hover:border-ink-faint hover:text-ink"
                  >
                    See success stories
                  </Link>
                </div>

                <Reveal delay={150}>
                  <div className="mx-auto mt-10 flex max-w-md items-center justify-between">
                    {MINI_TIMELINE.map((label, i) => (
                      <div key={label} className="flex flex-1 items-center">
                        <div className="flex flex-col items-center gap-2">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-aurora-violet/50 font-urbanist text-[11px] font-semibold text-ink">
                            {i + 1}
                          </span>
                          <span className="whitespace-nowrap font-urbanist text-[11px] font-medium text-ink-faint">{label}</span>
                        </div>
                        {i < MINI_TIMELINE.length - 1 && <span className="mx-1 mb-5 h-px flex-1 bg-aurora-violet/30" aria-hidden />}
                      </div>
                    ))}
                  </div>
                </Reveal>

                <Reveal delay={200}>
                  <ul className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 text-left sm:flex-row sm:justify-center">
                    {["4–12 weeks typical (scope dependent)", "Weekly demos + shared visibility", "Senior-led delivery oversight"].map((p) => (
                      <li key={p} className="flex items-start gap-2.5 rounded-2xl border border-hairline-light bg-light-raised px-4 py-3 sm:flex-1">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-aurora-amber" />
                        <span className="font-urbanist text-[12.5px] leading-snug text-ink-dim">{p}</span>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </div>
            </section>
          </Reveal>
        </div>

        {/* 2. What is an MVP Sprint */}
        <section className="bg-light-surface py-14 lg:py-20" aria-labelledby="definition-heading">
          <div className="mx-auto max-w-5xl px-6 lg:px-10">
            <Reveal>
              <SectionLabel>What This Model Is</SectionLabel>
              <SectionTitle as="h2" id="definition-heading" className="max-w-xl">
                What is an MVP Sprint?
              </SectionTitle>
              <SectionDescription className="mt-4 max-w-2xl">
                A focused build designed to deliver the core product value in a short, predictable timeframe. We ship
                the smallest version real users can actually use — then improve based on real feedback, not opinions.
              </SectionDescription>
            </Reveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {MVP_BENEFITS.map((b, i) => (
                <Reveal key={b.title} delay={i * 80}>
                  <div className="h-full rounded-2xl border border-hairline-light bg-light-raised p-6">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline-light text-ink-dim">
                      <Icon name={b.icon} size={17} />
                    </span>
                    <h3 className="mt-4 font-urbanist text-[15px] font-bold text-ink">{b.title}</h3>
                    <p className="mt-2 font-urbanist text-[13.5px] leading-relaxed text-ink-dim">{b.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 3. AI edge */}
        <section className="border-t border-hairline-light bg-light-surface py-14 lg:py-20" aria-labelledby="ai-edge-heading">
          <div className="mx-auto max-w-4xl px-6 lg:px-10">
            <Reveal>
              <SectionLabel>The AI Edge</SectionLabel>
              <SectionTitle as="h2" id="ai-edge-heading" className="max-w-xl">
                AI-assisted where useful — human-led decisions.
              </SectionTitle>
              <SectionDescription className="mt-4 max-w-2xl">
                We use AI tools to accelerate routine work — documentation, QA support, drafts — with human oversight
                for quality and correctness on everything that ships.
              </SectionDescription>
            </Reveal>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {MVP_AI_EDGE.map((item, i) => (
                <Reveal key={item} delay={i * 50}>
                  <div className="flex items-start gap-2.5 rounded-xl border border-hairline-light bg-light-raised px-4 py-3.5">
                    <Check size={14} strokeWidth={2} className="mt-0.5 shrink-0 text-aurora-violet" />
                    <span className="font-urbanist text-[13px] leading-relaxed text-ink-dim">{item}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 4. When to choose */}
        <section className="border-t border-hairline-light bg-light-surface py-14 lg:py-20" aria-labelledby="fit-heading">
          <div className="mx-auto max-w-6xl px-6 lg:px-10">
            <Reveal>
              <SectionLabel>Is This The Right Fit?</SectionLabel>
              <SectionTitle as="h2" id="fit-heading" className="max-w-xl">
                When an MVP Sprint works best — and when it doesn't.
              </SectionTitle>
            </Reveal>
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <Reveal>
                <div className="h-full rounded-2xl border border-aurora-violet/25 bg-light-raised p-6 sm:p-7">
                  <p className="font-urbanist text-[13px] font-semibold uppercase tracking-[0.15em] text-aurora-violet">Best for</p>
                  <ul className="mt-5 space-y-3.5">
                    {MVP_GOOD_FIT.map((p) => (
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
                  <p className="font-urbanist text-[13px] font-semibold uppercase tracking-[0.15em] text-ink-faint">Not ideal if</p>
                  <ul className="mt-5 space-y-3.5">
                    {MVP_NOT_IDEAL.map((p) => (
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

        {/* 5. Deliverables + ownership */}
        <section className="border-t border-hairline-light bg-light-surface py-14 lg:py-20" aria-labelledby="deliverables-heading">
          <div className="mx-auto max-w-6xl px-6 lg:px-10">
            <Reveal>
              <SectionLabel>What You Get</SectionLabel>
              <SectionTitle as="h2" id="deliverables-heading" className="max-w-xl">
                Deliverables, from blueprint to release.
              </SectionTitle>
            </Reveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {MVP_DELIVERABLES.map((d, i) => (
                <Reveal key={d.title} delay={i * 70}>
                  <div className="h-full rounded-2xl border border-hairline-light bg-light-raised p-6">
                    <h3 className="font-urbanist text-[15.5px] font-bold text-ink">{d.title}</h3>
                    <ul className="mt-4 space-y-2">
                      {d.items.map((it) => (
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
            <Reveal delay={100}>
              <p className="mt-6 rounded-xl border border-hairline-light bg-light-raised px-5 py-4 font-urbanist text-[13px] leading-relaxed text-ink-dim">
                <span className="font-semibold text-ink">Ownership:</span> all deliverables are yours — source code, design
                files, documentation, and IP upon completion.
              </p>
            </Reveal>
          </div>
        </section>

        {/* 6. Team & roles */}
        <section className="border-t border-hairline-light bg-light-surface py-14 lg:py-20" aria-labelledby="team-heading">
          <div className="mx-auto max-w-6xl px-6 lg:px-10">
            <Reveal>
              <SectionLabel>Team &amp; Roles</SectionLabel>
              <SectionTitle as="h2" id="team-heading" className="max-w-xl">
                The squad, and what we need from you.
              </SectionTitle>
            </Reveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              <Reveal>
                <div className="h-full rounded-2xl border border-hairline-light bg-light-raised p-6">
                  <p className="font-urbanist text-[13px] font-semibold uppercase tracking-[0.15em] text-ink-faint">Typical squad</p>
                  <ul className="mt-4 space-y-2.5">
                    {MVP_TEAM.map((t) => (
                      <li key={t} className="flex items-start gap-2.5">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink-faint" />
                        <span className="font-urbanist text-[13px] leading-relaxed text-ink-dim">{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
              <Reveal delay={70}>
                <div className="h-full rounded-2xl border border-hairline-light bg-light-raised p-6">
                  <p className="font-urbanist text-[13px] font-semibold uppercase tracking-[0.15em] text-ink-faint">Optional specialists</p>
                  <ul className="mt-4 space-y-2.5">
                    {MVP_TEAM_SPECIALISTS.map((t) => (
                      <li key={t} className="flex items-start gap-2.5">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink-faint" />
                        <span className="font-urbanist text-[13px] leading-relaxed text-ink-dim">{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
              <Reveal delay={140}>
                <div className="h-full rounded-2xl border border-aurora-violet/25 bg-light-raised p-6">
                  <p className="font-urbanist text-[13px] font-semibold uppercase tracking-[0.15em] text-aurora-violet">What you provide</p>
                  <ul className="mt-4 space-y-2.5">
                    {MVP_YOU_PROVIDE.map((t) => (
                      <li key={t} className="flex items-start gap-2.5">
                        <Check size={13} strokeWidth={2} className="mt-0.5 shrink-0 text-aurora-violet" />
                        <span className="font-urbanist text-[13px] leading-relaxed text-ink">{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* 7. How it works */}
        <section className="border-t border-hairline-light bg-light-surface py-14 lg:py-20" aria-labelledby="timeline-heading">
          <div className="mx-auto max-w-5xl px-6 lg:px-10">
            <Reveal>
              <SectionLabel>How It Works</SectionLabel>
              <SectionTitle as="h2" id="timeline-heading" className="max-w-xl">
                A predictable sprint workflow.
              </SectionTitle>
            </Reveal>
            <div className="mt-10 space-y-5">
              {MVP_TIMELINE.map((step, i) => (
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
            <Reveal delay={100}>
              <div className="mt-8 flex flex-wrap gap-3">
                {[
                  { label: "Typical duration", value: "4–12 weeks" },
                  { label: "Cadence", value: "Weekly demos + async updates" },
                  { label: "Visibility", value: "Shared board + decision log + release notes" },
                ].map((s) => (
                  <span key={s.label} className="rounded-full border border-hairline-light bg-light-raised px-4 py-2 font-urbanist text-[12.5px] text-ink-dim">
                    <span className="font-semibold text-ink">{s.label}:</span> {s.value}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* 8. Standards & governance */}
        <section className="border-t border-hairline-light bg-light-surface py-14 lg:py-20" aria-labelledby="standards-heading">
          <div className="mx-auto max-w-6xl px-6 lg:px-10">
            <Reveal>
              <SectionLabel>Standards &amp; Governance</SectionLabel>
              <SectionTitle as="h2" id="standards-heading" className="max-w-xl">
                Nothing ships without these in place.
              </SectionTitle>
            </Reveal>
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <Reveal>
                <div className="h-full rounded-2xl border border-hairline-light bg-light-raised p-6 sm:p-7">
                  <p className="font-urbanist text-[13px] font-semibold uppercase tracking-[0.15em] text-ink-faint">Engineering standards</p>
                  <ul className="mt-5 space-y-3">
                    {MVP_ENGINEERING_STANDARDS.map((s) => (
                      <li key={s} className="flex items-start gap-2.5">
                        <Check size={14} strokeWidth={2} className="mt-0.5 shrink-0 text-aurora-violet" />
                        <span className="font-urbanist text-[13.5px] leading-relaxed text-ink-dim">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
              <Reveal delay={100}>
                <div className="h-full rounded-2xl border border-hairline-light bg-light-raised p-6 sm:p-7">
                  <p className="font-urbanist text-[13px] font-semibold uppercase tracking-[0.15em] text-ink-faint">Communication standards</p>
                  <ul className="mt-5 space-y-3">
                    {MVP_COMMUNICATION_STANDARDS.map((s) => (
                      <li key={s} className="flex items-start gap-2.5">
                        <Check size={14} strokeWidth={2} className="mt-0.5 shrink-0 text-aurora-violet" />
                        <span className="font-urbanist text-[13.5px] leading-relaxed text-ink-dim">{s}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {DELIVERY_TOOLS.map((t) => (
                      <span key={t} className="rounded-full border border-hairline-light bg-light-surface px-3 py-1.5 font-urbanist text-[12px] text-ink-dim">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* 9. Pricing & transparency */}
        <section className="border-t border-hairline-light bg-light-surface py-14 lg:py-20" aria-labelledby="pricing-heading">
          <div className="mx-auto max-w-6xl px-6 lg:px-10">
            <Reveal>
              <SectionLabel>Pricing &amp; Transparency</SectionLabel>
              <SectionTitle as="h2" id="pricing-heading" className="max-w-xl">
                No hidden surprises, no cheap signals.
              </SectionTitle>
            </Reveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {MVP_PRICING.map((p, i) => (
                <Reveal key={p.title} delay={i * 70}>
                  <div className="h-full rounded-2xl border border-hairline-light bg-light-raised p-6">
                    <h3 className="font-urbanist text-[14.5px] font-bold text-ink">{p.title}</h3>
                    <p className="mt-2 font-urbanist text-[13.5px] leading-relaxed text-ink-dim">{p.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={150}>
              <div className="mt-8 rounded-2xl border border-hairline-light bg-light-raised p-6 sm:p-7">
                <p className="font-urbanist text-[13px] font-semibold uppercase tracking-[0.15em] text-ink-faint">What pricing depends on</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {MVP_PRICING_DEPENDS_ON.map((d) => (
                    <span key={d} className="rounded-full border border-hairline-light bg-light-surface px-3.5 py-1.5 font-urbanist text-[12.5px] text-ink-dim">
                      {d}
                    </span>
                  ))}
                </div>
                <p className="mt-5 font-urbanist text-[13.5px] leading-relaxed text-ink">
                  After the first call, we share a scoped estimate with clear assumptions — no hidden surprises.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 10. Proof */}
        <section className="border-t border-hairline-light bg-light-surface py-14 lg:py-20" aria-labelledby="mvp-proof-heading">
          <div className="mx-auto max-w-4xl px-6 lg:px-10">
            <Reveal>
              <SectionLabel>Featured MVP Sprint</SectionLabel>
              <SectionTitle as="h2" id="mvp-proof-heading" className="max-w-xl">
                SaaS startup — shipped v1 in 8 weeks and validated with beta users.
              </SectionTitle>
            </Reveal>
            <Reveal delay={80}>
              <div className="mt-8 rounded-2xl border border-hairline-light bg-light-raised p-6 sm:p-8">
                <div className="grid gap-6 sm:grid-cols-3">
                  <div>
                    <p className="font-urbanist text-[12px] font-semibold uppercase tracking-[0.15em] text-ink-faint">Challenge</p>
                    <p className="mt-2 font-urbanist text-[13.5px] leading-relaxed text-ink-dim">Unclear MVP scope, with real timeline pressure.</p>
                  </div>
                  <div>
                    <p className="font-urbanist text-[12px] font-semibold uppercase tracking-[0.15em] text-ink-faint">Approach</p>
                    <p className="mt-2 font-urbanist text-[13.5px] leading-relaxed text-ink-dim">Scope discipline, weekly releases, and a clean handover.</p>
                  </div>
                  <div>
                    <p className="font-urbanist text-[12px] font-semibold uppercase tracking-[0.15em] text-aurora-violet">Outcome</p>
                    <p className="mt-2 font-urbanist text-[13.5px] leading-relaxed text-ink">v1 launched, with a roadmap ready for v2.</p>
                  </div>
                </div>
                <blockquote className="mt-6 border-t border-hairline-light pt-6 font-urbanist text-[15px] italic leading-relaxed text-ink">
                  &ldquo;Clear scope, weekly momentum, and a clean handover. We shipped faster without losing quality.&rdquo;
                </blockquote>
                <p className="mt-2 font-urbanist text-[12.5px] text-ink-faint">— Placeholder testimonial, pending a publishable client quote</p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 11. FAQ */}
        <FaqAccordion id="mvp-faq-heading" title="MVP Sprint questions, answered" items={MVP_FAQS} />

        {/* 12. Final CTA */}
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
                  Ready to launch your MVP with clarity and speed?
                </SectionTitle>
                <SectionDescription className="mx-auto mt-4 max-w-xl">
                  Book a call — we&apos;ll recommend the sprint plan, team setup, and timeline.
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
                    href="/contact"
                    className="inline-flex items-center gap-2 rounded-full border border-hairline-light px-7 py-3.5 font-urbanist text-sm font-semibold text-ink-dim transition-colors hover:border-ink-faint hover:text-ink"
                  >
                    Start Your MVP Sprint
                  </Link>
                </div>

                <Reveal delay={150}>
                  <ul className="mx-auto mt-10 flex max-w-2xl flex-col gap-3 text-left sm:flex-row sm:justify-center">
                    {["We align on goals, constraints, and core journeys", "We propose MVP scope + a delivery plan", "You get a tailored sprint plan and next steps"].map(
                      (text, i) => (
                        <li key={text} className="flex items-start gap-2.5 rounded-2xl border border-hairline-light bg-light-raised px-4 py-3 sm:flex-1">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-aurora-violet/50 font-urbanist text-[10px] font-semibold text-ink">
                            {i + 1}
                          </span>
                          <span className="font-urbanist text-[12.5px] leading-snug text-ink-dim">{text}</span>
                        </li>
                      )
                    )}
                  </ul>
                </Reveal>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </SiteShell>
  );
}
