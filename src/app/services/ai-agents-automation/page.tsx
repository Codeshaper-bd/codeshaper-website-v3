import type { Metadata } from "next";
import { Check, X } from "lucide-react";
import SiteShell from "@/components/system/SiteShell";
import Reveal from "@/components/system/Reveal";
import { SectionTitle } from "@/components/system/SectionHeading";
import { Icon } from "@/lib/icons";
import FaqAccordion from "@/components/system/FaqAccordion";
import QuoteGrid from "@/components/system/QuoteGrid";
import {
  ServicesHero,
  ServiceCardGrid,
  BookCallCta,
  JsonLd,
  SectionLabel,
  breadcrumbJsonLd,
} from "@/components/services/ServicePageParts";
import { getGroup, servicesInGroup, servicePath } from "@/data/services";
import { pageMetadata } from "@/lib/pageMetadata";
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

/**
 * Flagship group page for AI Agents & Automation. Unlike the other four
 * groups (generic template at app/services/[slug]), this one keeps its
 * bespoke sections — snapshot, use cases, fit, process, guardrails,
 * stack, testimonials, FAQ — around the standard group hero, services
 * grid, and Book a Call CTA. /services/ai 301-redirects here
 * (next.config.ts).
 */
const GROUP = getGroup("ai-agents-automation")!;
const PATH = servicePath(GROUP.slug);

export const metadata: Metadata = pageMetadata({ title: GROUP.metaTitle, description: GROUP.metaDescription, path: PATH });

const CRUMBS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: GROUP.name, href: PATH },
];

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: AI_FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export default function AiAgentsAutomationPage() {
  return (
    <SiteShell>
      <JsonLd data={breadcrumbJsonLd(CRUMBS)} />
      <JsonLd data={FAQ_JSON_LD} />

      <div className="theme-light">
        {/* 1. Hero */}
        <ServicesHero
          id="ai-hero-heading"
          breadcrumbs={[CRUMBS[0], CRUMBS[1], { label: GROUP.name }]}
          icon={GROUP.icon}
          eyebrow="Services"
          title={GROUP.name}
          intro={GROUP.focus}
          primary={{ label: "Book a Call", href: "/contact" }}
          secondary={{ label: "See all services", href: "/services" }}
        />

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

        {/* 3. What's included — the group's services */}
        <section className="border-t border-hairline-light bg-light-surface py-14 lg:py-20" aria-labelledby="includes-heading">
          <div className="mx-auto max-w-6xl px-6 lg:px-10">
            <Reveal>
              <SectionLabel>What's Included</SectionLabel>
              <SectionTitle as="h2" id="includes-heading" className="max-w-xl">
                AI agent &amp; automation services, built for production.
              </SectionTitle>
            </Reveal>
            <ServiceCardGrid services={servicesInGroup(GROUP.slug)} />
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
        <FaqAccordion id="ai-faq-heading" title={`${GROUP.name} questions, answered`} items={AI_FAQS} />

        {/* 11. Final CTA */}
        <BookCallCta
          title="Have a workflow worth automating?"
          description="Tell us what's manual today — we'll map where AI actually helps, and where it doesn't."
        />
      </div>
    </SiteShell>
  );
}
