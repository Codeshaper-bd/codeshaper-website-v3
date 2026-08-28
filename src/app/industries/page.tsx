import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import SiteShell from "@/components/system/SiteShell";
import Breadcrumbs from "@/components/system/Breadcrumbs";
import Reveal from "@/components/system/Reveal";
import { SectionEyebrow, SectionTitle, SectionDescription } from "@/components/system/SectionHeading";
import { Icon } from "@/lib/icons";
import ContactForm from "@/components/sections/ContactForm";
import CaseStudyCard from "@/components/case-studies/CaseStudyCard";
import FaqAccordion from "@/components/system/FaqAccordion";
import QuoteGrid from "@/components/system/QuoteGrid";
import { CASE_STUDIES } from "@/lib/caseStudies";
import { INDUSTRIES, ENGAGEMENT_MODELS } from "@/lib/navigation";
import {
  FEATURED_INDUSTRIES,
  MORE_INDUSTRIES,
  USE_CASES,
  VERTICAL_EXPERTISE,
  INDUSTRY_SERVICE_MAP,
  HUB_TESTIMONIALS,
  HUB_FAQS,
  HUB_FAQ_JSON_LD,
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

const PROOF_STATS = [
  { value: String(INDUSTRIES.length), label: "Industries served" },
  { value: String(CASE_STUDIES.length), label: "Shipped case studies" },
  { value: String(ENGAGEMENT_MODELS.length), label: "Engagement models" },
  { value: "Weekly", label: "Demos & board visibility" },
];

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
                <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Industries" }]} />
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

                <Reveal delay={150}>
                  <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
                    {PROOF_STATS.map((s) => (
                      <div key={s.label} className="rounded-2xl border border-hairline-light bg-light-raised px-4 py-5 text-center">
                        <p className="font-urbanist text-2xl font-bold tracking-tight text-ink">{s.value}</p>
                        <p className="mt-1 font-urbanist text-[11.5px] leading-snug text-ink-faint">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </Reveal>
              </div>
            </section>
          </Reveal>
        </div>

        {/* 2. Featured industries */}
        <section className="bg-light-surface py-14 lg:py-20" aria-labelledby="featured-industries-heading">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <Reveal>
              <SectionLabel>Featured Industries</SectionLabel>
              <SectionTitle as="h2" id="featured-industries-heading" className="max-w-xl">
                Where we go deep, not just wide.
              </SectionTitle>
            </Reveal>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURED_INDUSTRIES.map((ind, i) => (
                <Reveal key={ind.href} delay={i * 60}>
                  <Link
                    href={ind.href}
                    className="group flex h-full flex-col rounded-2xl border border-hairline-light bg-light-raised p-6 transition-[transform,box-shadow,border-color] duration-300 ease-out-expo hover:-translate-y-1 hover:border-aurora-violet/40 hover:shadow-[0_20px_44px_rgba(11,15,25,0.08)]"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-hairline-light text-ink-dim transition-colors duration-300 group-hover:border-aurora-violet/50 group-hover:text-aurora-violet">
                      <Icon name={ind.icon} size={18} />
                    </span>
                    <h3 className="mt-5 font-urbanist text-lg font-bold tracking-tight text-ink">{ind.label}</h3>
                    <p className="mt-2 font-urbanist text-[13px] font-medium text-ink-faint">{ind.desc}</p>
                    <p className="mt-3 flex-1 font-urbanist text-[13.5px] leading-relaxed text-ink-dim">{ind.challenge}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 border-t border-hairline-light pt-4 font-urbanist text-[13px] font-semibold text-ink-mid transition-colors duration-300 group-hover:text-aurora-violet">
                      {ind.ctaLabel}
                      <ArrowRight size={13} strokeWidth={1.75} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>

            {/* 3. More industries */}
            <Reveal delay={100}>
              <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-hairline-light pt-8">
                <span className="font-urbanist text-[13px] font-medium text-ink-faint">Also serving:</span>
                {MORE_INDUSTRIES.map((ind) => (
                  <Link
                    key={ind.href}
                    href={ind.href}
                    className="inline-flex items-center gap-2 rounded-full border border-hairline-light px-4 py-2 font-urbanist text-[13px] font-medium text-ink-dim transition-colors duration-300 hover:border-aurora-violet/50 hover:text-ink"
                  >
                    <Icon name={ind.icon} size={13} />
                    {ind.label}
                  </Link>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* 4. What we build */}
        <section className="border-t border-hairline-light bg-light-surface py-14 lg:py-20" aria-labelledby="use-cases-heading">
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
                  <div className="flex h-full flex-col rounded-2xl border border-hairline-light bg-light-raised p-5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline-light text-ink-dim">
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

        {/* 5. Why vertical expertise matters */}
        <section className="border-t border-hairline-light bg-light-surface py-14 lg:py-20" aria-labelledby="expertise-heading">
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
                  <div className="rounded-2xl border border-hairline-light bg-light-raised p-6">
                    <span className="font-urbanist text-[13px] font-bold tabular-nums text-aurora-violet">{v.n}</span>
                    <h3 className="mt-3 font-urbanist text-[16px] font-bold text-ink">{v.title}</h3>
                    <p className="mt-2 font-urbanist text-[13.5px] leading-relaxed text-ink-dim">{v.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Industry -> service pillar mapping */}
        <section className="border-t border-hairline-light bg-light-surface py-14 lg:py-20" aria-labelledby="pillar-map-heading">
          <div className="mx-auto max-w-5xl px-6 lg:px-10">
            <Reveal>
              <SectionLabel>How It Maps</SectionLabel>
              <SectionTitle as="h2" id="pillar-map-heading" className="max-w-xl">
                Which services actually apply to your industry.
              </SectionTitle>
            </Reveal>
            <Reveal delay={80}>
              <div className="mt-10 overflow-hidden rounded-[24px] border border-hairline-light bg-light-raised">
                {INDUSTRY_SERVICE_MAP.map((row, i) => (
                  <div
                    key={row.industry}
                    className={`flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 ${i > 0 ? "border-t border-hairline-light" : ""}`}
                  >
                    <Link href={row.industryHref} className="font-urbanist text-[15px] font-bold text-ink transition-colors hover:text-aurora-violet">
                      {row.industry}
                    </Link>
                    <div className="flex flex-wrap gap-2">
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
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* 7. Proof / case studies */}
        <section className="border-t border-hairline-light bg-light-surface py-14 lg:py-20" aria-labelledby="proof-heading">
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

        {/* 8. Testimonials */}
        <QuoteGrid id="hub-testimonials-heading" title="Trusted across the industries we serve." items={HUB_TESTIMONIALS} />

        {/* 9. FAQ */}
        <FaqAccordion id="hub-faq-heading" title="Questions, answered" items={HUB_FAQS} />
      </div>

      {/* 10. Final CTA — dark canvas, matches /contact's own hero exactly (ContactForm's .card-dark styling is built for this root theme, not theme-light) */}
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
