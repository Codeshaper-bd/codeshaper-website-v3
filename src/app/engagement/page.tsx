import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SiteShell from "@/components/system/SiteShell";
import Breadcrumbs from "@/components/system/Breadcrumbs";
import Reveal from "@/components/system/Reveal";
import { SectionEyebrow, SectionTitle, SectionDescription } from "@/components/system/SectionHeading";
import { Icon } from "@/lib/icons";
import ContactForm from "@/components/sections/ContactForm";
import FaqAccordion from "@/components/system/FaqAccordion";
import QuoteGrid from "@/components/system/QuoteGrid";
import EngagementQuiz from "@/components/engagement/EngagementQuiz";
import {
  WHAT_YOU_GET,
  COMPARISON_TABLE,
  AT_A_GLANCE,
  MODEL_OVERVIEWS,
  DELIVERY_STEPS,
  DELIVERY_TOOLS,
  HUB_PROOF,
  HUB_TESTIMONIALS,
  HUB_FAQS,
} from "@/lib/engagementContent";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "How We Work — Engagement Models",
  description:
    "Flexible engagement models for predictable delivery — MVP Sprint, End-to-End Delivery, Dedicated Product Team, Team Augmentation, or Global Delivery.",
  alternates: { canonical: "/engagement" },
};

const BREADCRUMB_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Engagement Models", item: `${SITE_URL}/engagement` },
  ],
};

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: HUB_FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="mb-5 font-urbanist text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-faint">{children}</p>;
}

const PROOF_STRIP = [
  "Weekly delivery cadence — demos + checkpoints",
  "Global clients across multiple time zones",
  "Senior-led delivery with a single accountable point of contact",
];

export default function EngagementIndexPage() {
  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSON_LD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }} />

      <div className="theme-light">
        {/* 1. Hero */}
        <div className="bg-light-surface p-3 sm:p-4">
          <Reveal distance={0}>
            <section className="relative overflow-hidden rounded-[32px] bg-canvas px-6 pb-16 pt-32 lg:px-10 lg:pb-20 lg:pt-32" aria-labelledby="engagement-hero-heading">
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
                  <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Engagement Models" }]} />
                </div>
                <SectionEyebrow className="mx-auto w-fit">How We Work</SectionEyebrow>
                <SectionTitle as="h1" size="lg" id="engagement-hero-heading">
                  Flexible engagement models for predictable delivery.
                </SectionTitle>
                <SectionDescription className="mx-auto mt-5 max-w-2xl">
                  Choose the working model that fits your timeline, scope certainty, and team structure — without
                  compromising quality.
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
                    href="#help-me-choose"
                    className="inline-flex items-center gap-2 rounded-full border border-hairline-light px-7 py-3.5 font-urbanist text-sm font-semibold text-ink-dim transition-colors hover:border-ink-faint hover:text-ink"
                  >
                    Help me choose
                  </Link>
                </div>

                <Reveal delay={150}>
                  <ul className="mx-auto mt-12 flex max-w-2xl flex-col gap-3 text-left sm:flex-row sm:justify-center">
                    {PROOF_STRIP.map((p) => (
                      <li
                        key={p}
                        className="flex items-start gap-2.5 rounded-2xl border border-hairline-light bg-light-raised px-4 py-3 sm:flex-1"
                      >
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

        {/* 2. What you get */}
        <section className="bg-light-surface py-14 lg:py-20" aria-labelledby="what-you-get-heading">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <Reveal>
              <SectionLabel>Always On</SectionLabel>
              <SectionTitle as="h2" id="what-you-get-heading" className="max-w-xl">
                What you get with CodeShaper, in every model.
              </SectionTitle>
            </Reveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {WHAT_YOU_GET.map((w, i) => (
                <Reveal key={w.title} delay={i * 60}>
                  <div className="h-full rounded-2xl border border-hairline-light bg-light-raised p-6">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline-light text-ink-dim">
                      <Icon name={w.icon} size={17} />
                    </span>
                    <h3 className="mt-4 font-urbanist text-[15px] font-bold text-ink">{w.title}</h3>
                    <p className="mt-2 font-urbanist text-[13.5px] leading-relaxed text-ink-dim">{w.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Comparison table */}
        <section className="border-t border-hairline-light bg-light-surface py-14 lg:py-20" aria-labelledby="comparison-heading">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <Reveal>
              <SectionLabel>Quick Comparison</SectionLabel>
              <SectionTitle as="h2" id="comparison-heading" className="max-w-xl">
                Which model fits your goal?
              </SectionTitle>
            </Reveal>

            <Reveal delay={80}>
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {AT_A_GLANCE.map((a) => (
                  <div key={a.label} className="rounded-2xl border border-hairline-light bg-light-raised px-4 py-4 text-center">
                    <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-full border border-hairline-light text-ink-dim">
                      <Icon name={a.icon} size={14} />
                    </span>
                    <p className="mt-2 font-urbanist text-[11px] font-medium uppercase tracking-[0.1em] text-ink-faint">{a.label}</p>
                    <p className="mt-0.5 font-urbanist text-[13px] font-bold text-ink">{a.value}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="mt-8 overflow-x-auto rounded-[24px] border border-hairline-light bg-light-raised">
                <table className="w-full min-w-[860px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-hairline-light">
                      {["Model", "Best for", "Speed to start", "Involvement", "Scope certainty", "Pricing", "Team size", "Commitment"].map((h) => (
                        <th key={h} className="whitespace-nowrap px-4 py-4 font-urbanist text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-faint">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARISON_TABLE.map((row, i) => (
                      <tr key={row.model} className={i > 0 ? "border-t border-hairline-light" : ""}>
                        <td className="whitespace-nowrap px-4 py-4 font-urbanist text-[13.5px] font-bold text-ink">
                          <Link href={row.href} className="transition-colors hover:text-aurora-violet">
                            {row.model}
                          </Link>
                        </td>
                        <td className="px-4 py-4 font-urbanist text-[13px] text-ink-dim">{row.bestFor}</td>
                        <td className="whitespace-nowrap px-4 py-4 font-urbanist text-[13px] text-ink-dim">{row.speed}</td>
                        <td className="whitespace-nowrap px-4 py-4 font-urbanist text-[13px] text-ink-dim">{row.involvement}</td>
                        <td className="whitespace-nowrap px-4 py-4 font-urbanist text-[13px] text-ink-dim">{row.certainty}</td>
                        <td className="whitespace-nowrap px-4 py-4 font-urbanist text-[13px] text-ink-dim">{row.pricing}</td>
                        <td className="whitespace-nowrap px-4 py-4 font-urbanist text-[13px] text-ink-dim">{row.teamSize}</td>
                        <td className="whitespace-nowrap px-4 py-4 font-urbanist text-[13px] text-ink-dim">{row.commitment}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 font-urbanist text-[12px] text-ink-faint">*Start time depends on role availability and scope readiness.</p>
            </Reveal>
          </div>
        </section>

        {/* 4. Help me choose */}
        <EngagementQuiz id="quiz-heading" />

        {/* 5. The 5 models */}
        <section className="border-t border-hairline-light bg-light-surface py-14 lg:py-20" aria-labelledby="models-heading">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <Reveal>
              <SectionLabel>The 5 Models</SectionLabel>
              <SectionTitle as="h2" id="models-heading" className="max-w-xl">
                Every way we work with a client.
              </SectionTitle>
            </Reveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {MODEL_OVERVIEWS.map((m, i) => (
                <Reveal key={m.href} delay={i * 60}>
                  <Link
                    href={m.href}
                    className="group flex h-full flex-col rounded-2xl border border-hairline-light bg-light-raised p-6 transition-[transform,box-shadow,border-color] duration-300 ease-out-expo hover:-translate-y-1 hover:border-aurora-violet/40 hover:shadow-[0_20px_44px_rgba(11,15,25,0.08)]"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-hairline-light text-ink-dim transition-colors duration-300 group-hover:border-aurora-violet/50 group-hover:text-aurora-violet">
                      <Icon name={m.icon} size={18} />
                    </span>
                    <h3 className="mt-5 font-urbanist text-lg font-bold tracking-tight text-ink">{m.label}</h3>
                    <p className="mt-2 flex-1 font-urbanist text-[13.5px] leading-relaxed text-ink-dim">{m.oneLiner}</p>
                    <ul className="mt-4 space-y-1.5">
                      {m.bestFor.map((b) => (
                        <li key={b} className="flex items-start gap-2 font-urbanist text-[12.5px] text-ink-faint">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink-faint" />
                          {b}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5 flex items-center justify-between border-t border-hairline-light pt-4">
                      <span className="font-urbanist text-[12px] text-ink-faint">Start: {m.startTime}</span>
                      <span className="inline-flex items-center gap-1.5 font-urbanist text-[13px] font-semibold text-ink-mid transition-colors duration-300 group-hover:text-aurora-violet">
                        {m.ctaLabel}
                        <ArrowRight size={13} strokeWidth={1.75} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 6. How delivery works */}
        <section className="border-t border-hairline-light bg-light-surface py-14 lg:py-20" aria-labelledby="delivery-heading">
          <div className="mx-auto max-w-5xl px-6 lg:px-10">
            <Reveal>
              <SectionLabel>Our Operating System</SectionLabel>
              <SectionTitle as="h2" id="delivery-heading" className="max-w-xl">
                A delivery system built for clarity.
              </SectionTitle>
            </Reveal>
            <div className="mt-10 space-y-5">
              {DELIVERY_STEPS.map((step, i) => (
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
            <Reveal delay={100}>
              <div className="mt-8 flex flex-wrap items-center gap-2.5">
                <span className="font-urbanist text-[12.5px] text-ink-faint">Tools we commonly use:</span>
                {DELIVERY_TOOLS.map((t) => (
                  <span key={t} className="rounded-full border border-hairline-light bg-light-raised px-3 py-1.5 font-urbanist text-[12px] text-ink-dim">
                    {t}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* 7. Proof (model-linked) */}
        <section className="border-t border-hairline-light bg-light-surface py-14 lg:py-20" aria-labelledby="proof-heading">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <Reveal>
              <SectionLabel>Proof</SectionLabel>
              <SectionTitle as="h2" id="proof-heading" className="max-w-lg">
                Success stories, by model.
              </SectionTitle>
            </Reveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {HUB_PROOF.map((p, i) => (
                <Reveal key={p.title} delay={i * 80}>
                  <div className="flex h-full flex-col rounded-2xl border border-hairline-light bg-light-raised p-6">
                    <span className="font-urbanist text-[11px] font-semibold uppercase tracking-[0.15em] text-aurora-violet">{p.model}</span>
                    <h3 className="mt-3 font-urbanist text-[15.5px] font-bold text-ink">{p.title}</h3>
                    <p className="mt-2 flex-1 font-urbanist text-[13.5px] leading-relaxed text-ink-dim">{p.body}</p>
                    <p className="mt-3 font-urbanist text-[12.5px] font-medium text-ink">{p.outcome}</p>
                    <Link
                      href={p.href}
                      className="mt-4 inline-flex items-center gap-1.5 border-t border-hairline-light pt-4 font-urbanist text-[13px] font-semibold text-ink-mid transition-colors hover:text-aurora-violet"
                    >
                      View model
                      <ArrowRight size={13} strokeWidth={1.75} />
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 8. Testimonials */}
        <QuoteGrid id="hub-testimonials-heading" title="Trusted by teams who've shipped with every model." items={HUB_TESTIMONIALS} columns={4} />

        {/* 9. FAQ */}
        <FaqAccordion id="hub-faq-heading" title="Questions, answered" items={HUB_FAQS} />
      </div>

      {/* 10. Final CTA */}
      <section className="relative overflow-hidden bg-canvas py-16 lg:py-24" aria-labelledby="engagement-cta-heading">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "url(/media/hex-pattern-tile.svg)", backgroundSize: "112px 194px" }}
        />
        <div
          aria-hidden
          className="absolute left-1/4 top-1/3 h-[420px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(closest-side, rgba(255,255,255,0.16), rgba(255,255,255,0.06), transparent)" }}
        />

        <div className="relative z-10 mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-2 lg:gap-20 lg:px-10">
          <div>
            <Reveal>
              <p className="mb-3 font-urbanist text-xs font-medium uppercase tracking-[0.25em] text-ink-faint">Next step</p>
              <h2 id="engagement-cta-heading" className="font-urbanist text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
                Not sure which model fits? We&apos;ll recommend the best one.
              </h2>
              <p className="mt-10 font-urbanist text-xs font-medium uppercase tracking-[0.25em] text-ink-faint">What happens next</p>
            </Reveal>
            <ol className="mt-4 space-y-4">
              {[
                "We understand your goal, timeline, and constraints",
                "We recommend the right model and team setup",
                "You get a clear plan and next steps",
              ].map((text, i) => (
                <li key={text}>
                  <Reveal delay={200 + i * 180}>
                    <span className="flex items-start gap-4">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-aurora-violet/50 font-urbanist text-xs font-medium text-ink">
                        {i + 1}
                      </span>
                      <span className="font-urbanist text-sm leading-relaxed text-ink-dim">{text}</span>
                    </span>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>

          <Reveal delay={100}>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </SiteShell>
  );
}
