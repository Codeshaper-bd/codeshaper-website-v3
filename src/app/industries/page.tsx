import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import SiteShell from "@/components/system/SiteShell";
import Breadcrumbs from "@/components/system/Breadcrumbs";
import Reveal from "@/components/system/Reveal";
import { SectionEyebrow, SectionTitle, SectionDescription } from "@/components/system/SectionHeading";
import { Icon } from "@/lib/icons";
import { textSafeAccent } from "@/lib/color";
import ContactForm from "@/components/sections/ContactForm";
import CaseStudyCard from "@/components/case-studies/CaseStudyCard";
import FaqAccordion from "@/components/system/FaqAccordion";
import QuoteGrid from "@/components/system/QuoteGrid";
import { CASE_STUDIES } from "@/lib/caseStudies";
import {
  FEATURED_INDUSTRIES,
  USE_CASES,
  VERTICAL_EXPERTISE,
  INDUSTRY_SERVICE_MAP,
  HUB_TESTIMONIALS,
  HUB_FAQS,
  HUB_FAQ_JSON_LD,
  HUB_FAQ_STATS,
  HUB_FAQ_CTA,
} from "@/lib/industriesContent";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Industries",
  description:
    "Industry workflows built with product taste — SaaS, eCommerce, FinTech, real estate, logistics, travel, and more.",
  alternates: { canonical: "/industries" },
};

const BREADCRUMB_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Industries", item: `${SITE_URL}/industries` },
  ],
};

/** Inner-page section label — same recipe as case-studies/[slug]/page.tsx's own SectionLabel. */
function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="mb-5 font-urbanist text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-faint">{children}</p>;
}

export default function IndustriesIndexPage() {
  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSON_LD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HUB_FAQ_JSON_LD) }} />

      <div className="theme-light">
        {/* 1. Hero */}
        <div className="bg-light-surface p-3 sm:p-4">
          <Reveal distance={0}>
            <section className="relative overflow-hidden rounded-[32px] bg-canvas px-6 pb-16 pt-32 lg:px-10 lg:pb-20 lg:pt-32" aria-labelledby="industries-hero-heading">
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
                  <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Industries" }]} />
                </div>
                <SectionEyebrow className="mx-auto w-fit">Industries</SectionEyebrow>
                <SectionTitle as="h1" size="lg" id="industries-hero-heading">
                  Product work shaped by the industry you actually operate in.
                </SectionTitle>
                <SectionDescription className="mx-auto mt-5 max-w-2xl">
                  Every vertical has its own failure points — trial funnels, dispatch boards, listing pipelines, booking flows.
                  We bring the patterns that already work for each one, instead of starting every engagement from a blank page.
                </SectionDescription>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 font-urbanist text-sm font-semibold text-canvas transition-transform duration-300 hover:scale-[1.02]"
                  >
                    Talk about your industry
                    <ArrowRight size={15} strokeWidth={1.75} />
                  </Link>
                  <Link
                    href="/case-studies"
                    className="inline-flex items-center gap-2 rounded-full border border-hairline-light px-7 py-3.5 font-urbanist text-sm font-semibold text-ink-dim transition-colors hover:border-ink-faint hover:text-ink"
                  >
                    Browse case studies
                  </Link>
                </div>
              </div>
            </section>
          </Reveal>
        </div>

        {/* 2. Featured industries — all 10, each with its own accent */}
        <section className="bg-light-surface py-14 lg:py-20" aria-labelledby="featured-industries-heading">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <Reveal>
              <SectionLabel>Industries We Serve</SectionLabel>
              <SectionTitle as="h2" id="featured-industries-heading" className="max-w-xl">
                Where we go deep, not just wide.
              </SectionTitle>
            </Reveal>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURED_INDUSTRIES.map((ind, i) => (
                <Reveal key={ind.href} delay={i * 50}>
                  <Link
                    href={ind.href}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-hairline-light bg-light-raised p-6 transition-[transform,box-shadow] duration-300 ease-out-expo hover:-translate-y-1 hover:shadow-[0_20px_44px_var(--ind-glow)]"
                    style={{ "--ind-glow": `${ind.accent}22`, borderTop: `3px solid ${ind.accent}` } as CSSProperties}
                  >
                    <span
                      className="flex h-11 w-11 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: `${ind.accent}14`, color: ind.accent }}
                    >
                      <Icon name={ind.icon} size={18} />
                    </span>
                    <h3 className="mt-5 font-urbanist text-lg font-bold tracking-tight text-ink">{ind.label}</h3>
                    <p className="mt-2 font-urbanist text-[13px] font-medium text-ink-faint">{ind.desc}</p>
                    <p className="mt-3 flex-1 font-urbanist text-[13.5px] leading-relaxed text-ink-dim">{ind.challenge}</p>
                    <span
                      className="mt-5 inline-flex items-center gap-1.5 border-t border-hairline-light pt-4 font-urbanist text-[13px] font-semibold"
                      style={{ color: textSafeAccent(ind.accent) }}
                    >
                      {ind.ctaLabel}
                      <ArrowRight size={13} strokeWidth={1.75} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 3. What we build — floating white card */}
        <div className="bg-light-surface p-3 sm:p-4">
          <section className="theme-light relative overflow-hidden rounded-[32px] bg-canvas py-14 lg:py-20" aria-labelledby="use-cases-heading">
            <div className="mx-auto max-w-7xl px-6 lg:px-10">
              <Reveal>
                <SectionLabel>What We Build</SectionLabel>
                <SectionTitle as="h2" id="use-cases-heading" className="max-w-xl">
                  The same systems, wherever the industry changes.
                </SectionTitle>
              </Reveal>
              <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {USE_CASES.map((u, i) => (
                  <Reveal key={u.title} delay={i * 40}>
                    <div className="flex h-full flex-col rounded-2xl border border-hairline-light bg-light-raised p-5 transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-aurora-violet/30">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-aurora-violet/10 text-aurora-violet">
                        <Icon name={u.icon} size={16} />
                      </span>
                      <h3 className="mt-4 font-urbanist text-[14.5px] font-bold text-ink">{u.title}</h3>
                      <p className="mt-1.5 flex-1 font-urbanist text-[13px] leading-relaxed text-ink-dim">{u.description}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* 4. Why vertical expertise matters — ghost-numeral cards, visually distinct from the bordered-icon cards elsewhere on this page */}
        <section className="bg-light-surface py-14 lg:py-20" aria-labelledby="expertise-heading">
          <div className="mx-auto max-w-5xl px-6 lg:px-10">
            <Reveal>
              <SectionLabel>Why It Matters</SectionLabel>
              <SectionTitle as="h2" id="expertise-heading" className="max-w-xl">
                Vertical expertise changes what happens before you sign anything.
              </SectionTitle>
            </Reveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {VERTICAL_EXPERTISE.map((v, i) => (
                <Reveal key={v.n} delay={i * 70}>
                  <div className="group relative overflow-hidden rounded-2xl border border-hairline-light bg-light-raised p-6">
                    <span
                      aria-hidden
                      className="absolute -right-3 -top-6 select-none font-urbanist text-[100px] font-extrabold leading-none tracking-tight transition-transform duration-300 ease-out group-hover:scale-105"
                      style={{ color: v.accent, opacity: 0.1 }}
                    >
                      {v.n}
                    </span>
                    <div className="relative z-10">
                      <span className="h-1.5 w-6 rounded-full" style={{ backgroundColor: v.accent, display: "block" }} aria-hidden />
                      <h3 className="mt-4 font-urbanist text-[16px] font-bold text-ink">{v.title}</h3>
                      <p className="mt-2 font-urbanist text-[13.5px] leading-relaxed text-ink-dim">{v.description}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Industry -> service pillar mapping — floating white card */}
        <div className="bg-light-surface p-3 sm:p-4">
          <section className="theme-light relative overflow-hidden rounded-[32px] bg-canvas py-14 lg:py-20" aria-labelledby="pillar-map-heading">
            <div className="mx-auto max-w-5xl px-6 lg:px-10">
              <Reveal>
                <SectionLabel>How It Maps</SectionLabel>
                <SectionTitle as="h2" id="pillar-map-heading" className="max-w-xl">
                  Which services actually apply to your industry.
                </SectionTitle>
              </Reveal>
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {INDUSTRY_SERVICE_MAP.map((row, i) => (
                  <Reveal key={row.industry} delay={i * 60}>
                    <div
                      className="h-full rounded-2xl border border-hairline-light bg-light-raised p-5 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_var(--map-glow)]"
                      style={{ "--map-glow": `${row.accent}22` } as CSSProperties}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                          style={{ backgroundColor: `${row.accent}14`, color: row.accent }}
                        >
                          <Icon name={row.icon} size={17} />
                        </span>
                        <Link href={row.industryHref} className="font-urbanist text-[15px] font-bold text-ink transition-colors hover:text-aurora-violet">
                          {row.industry}
                        </Link>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {row.pillars.map((p) => (
                          <Link
                            key={p.href}
                            href={p.href}
                            className="inline-flex items-center gap-1 rounded-full border border-hairline-light px-3 py-1.5 font-urbanist text-[12px] font-medium text-ink-dim transition-colors hover:border-aurora-violet/50 hover:text-ink"
                          >
                            {p.title}
                            <ArrowUpRight size={11} strokeWidth={1.75} />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* 6. Proof / case studies */}
        <section className="bg-light-surface py-14 lg:py-20" aria-labelledby="proof-heading">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <Reveal>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <SectionLabel>Proof, Not Promises</SectionLabel>
                  <SectionTitle as="h2" id="proof-heading" className="max-w-lg">
                    Real projects, real outcomes.
                  </SectionTitle>
                </div>
                <Link
                  href="/case-studies"
                  className="inline-flex items-center gap-1.5 font-urbanist text-[13.5px] font-semibold text-ink-dim transition-colors hover:text-aurora-violet"
                >
                  See all case studies
                  <ArrowRight size={14} strokeWidth={1.75} />
                </Link>
              </div>
            </Reveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {CASE_STUDIES.map((story, i) => (
                <Reveal key={story.slug} delay={i * 70}>
                  <CaseStudyCard story={story} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Client voices — floating white card */}
        <QuoteGrid id="hub-testimonials-heading" title="Trusted across the industries we serve." items={HUB_TESTIMONIALS} card />

        {/* 8. FAQ — with stats + CTA */}
        <FaqAccordion
          id="hub-faq-heading"
          title="Questions, answered"
          description="What clients ask before starting a project with us."
          items={HUB_FAQS}
          stats={HUB_FAQ_STATS}
          cta={HUB_FAQ_CTA}
        />
      </div>

      {/* 9. Final CTA — dark canvas, matches /contact's own hero exactly (ContactForm's .card-dark styling is built for this root theme, not theme-light) */}
      <section className="relative overflow-hidden bg-canvas py-16 lg:py-24" aria-labelledby="industries-cta-heading">
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
              <h2 id="industries-cta-heading" className="font-urbanist text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
                Tell us your industry — we&apos;ll route it to the right team.
              </h2>
              <p className="mt-6 max-w-lg font-urbanist text-lg leading-relaxed text-ink-dim">
                Share your industry, project summary, and timeline. We&apos;ll come back with the right service and engagement model.
              </p>
            </Reveal>
          </div>

          <Reveal delay={100}>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </SiteShell>
  );
}
