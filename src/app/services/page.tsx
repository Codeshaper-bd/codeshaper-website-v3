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
import FaqAccordion from "@/components/system/FaqAccordion";
import CaseStudyCard from "@/components/case-studies/CaseStudyCard";
import { INDUSTRIES } from "@/lib/navigation";
import { SERVICE_GROUPS, groupDescriptor, groupSections, servicePath } from "@/data/services";
import { pageMetadata } from "@/lib/pageMetadata";
import { CASE_STUDIES } from "@/lib/caseStudies";
import { WHAT_YOU_GET, MODEL_OVERVIEWS } from "@/lib/engagementContent";
import { TRUST_STATS, TRUST_QUOTE, STARTER_PATHS, PILLAR_OUTCOMES, SERVICES_FAQS } from "@/lib/servicesContent";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "AI Engineering & Software Development Services | CodeShaper",
  // REVIEW
  description:
    "AI agents, software development, AI integration, UI/UX design, websites and commerce: production-ready systems that integrate with the tools you already use.",
  path: "/services",
});

const BREADCRUMB_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Services", item: `${SITE_URL}/services` },
  ],
};

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: SERVICES_FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="mb-5 font-urbanist text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-faint">{children}</p>;
}

const PROOF_STRIP = ["Start in ~1 week", "Weekly demos + shared board", "Clear ownership", "Documentation + handover"];

const PRIMARY_INDUSTRY_SLUGS = ["saas", "ecommerce", "real-estate", "logistics", "travel", "professional-services", "fintech", "rmg"];
const PRIMARY_INDUSTRIES = INDUSTRIES.filter((i) => PRIMARY_INDUSTRY_SLUGS.includes(i.href.split("/").pop()!));

export default function ServicesIndexPage() {
  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSON_LD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }} />

      <div className="theme-light">
        {/* 1. Hero */}
        <div className="bg-light-surface p-3 sm:p-4">
          <Reveal distance={0}>
            <section className="relative overflow-hidden rounded-[32px] bg-canvas px-6 pb-16 pt-32 lg:px-10 lg:pb-20 lg:pt-32" aria-labelledby="services-hero-heading">
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
                  <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Services" }]} />
                </div>
                <SectionEyebrow className="mx-auto w-fit">Services</SectionEyebrow>
                <SectionTitle as="h1" size="lg" id="services-hero-heading">
                  AI engineering &amp; software development services, built for production.
                </SectionTitle>
                <SectionDescription className="mx-auto mt-5 max-w-2xl">
                  We build reliable, production-ready AI and software systems that integrate with the tools you
                  already use — with human approval, logging, testing, and monitoring built in, not bolted on.
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
                    Explore success stories
                  </Link>
                </div>

                <Reveal delay={150}>
                  <ul className="mx-auto mt-12 flex max-w-3xl flex-col gap-3 text-left sm:flex-row sm:justify-center">
                    {PROOF_STRIP.map((p) => (
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

        {/* 2. Trust strip */}
        <section className="bg-light-surface py-14 lg:py-16" aria-labelledby="trust-heading">
          <div className="mx-auto max-w-6xl px-6 lg:px-10">
            <h2 id="trust-heading" className="sr-only">
              CodeShaper by the numbers
            </h2>
            <Reveal>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {TRUST_STATS.map((s) => (
                  <div key={s.label} className="rounded-2xl border border-hairline-light bg-light-raised p-5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline-light text-ink-dim">
                      <Icon name={s.icon} size={16} />
                    </span>
                    <p className="mt-3 font-urbanist text-xl font-bold tracking-tight text-ink">{s.value}</p>
                    <p className="mt-1 font-urbanist text-[12px] leading-snug text-ink-faint">{s.label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={100}>
              <blockquote className="mt-8 text-center font-urbanist text-[17px] italic leading-relaxed text-ink">
                &ldquo;{TRUST_QUOTE.quote}&rdquo;
                <footer className="mt-2 font-urbanist text-[13px] not-italic text-ink-faint">— {TRUST_QUOTE.role}</footer>
              </blockquote>
            </Reveal>
          </div>
        </section>

        {/* 3. Service pillars */}
        <section className="border-t border-hairline-light bg-light-surface py-14 lg:py-20" aria-labelledby="pillars-heading">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <Reveal>
              <SectionLabel>Service Groups</SectionLabel>
              <SectionTitle as="h2" id="pillars-heading" className="max-w-xl">
                Five service groups, one delivery system.
              </SectionTitle>
              <SectionDescription className="mt-4 max-w-2xl">
                Pick a group based on your goal — automate a workflow, ship a new product, connect AI to your
                systems, improve the experience, or grow your website and store.
              </SectionDescription>
            </Reveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {SERVICE_GROUPS.map((group, i) => (
                <Reveal key={group.slug} delay={i * 60}>
                  <Link
                    href={`#pillar-${group.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-hairline-light bg-light-raised p-6 transition-[transform,box-shadow,border-color] duration-300 ease-out-expo hover:-translate-y-1 hover:border-aurora-violet/40 hover:shadow-[0_20px_44px_rgba(11,15,25,0.08)]"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-hairline-light text-ink-dim transition-colors duration-300 group-hover:border-aurora-violet/50 group-hover:text-aurora-violet">
                      <Icon name={group.icon} size={18} />
                    </span>
                    <h3 className="mt-5 font-urbanist text-lg font-bold tracking-tight text-ink">{group.name}</h3>
                    <p className="mt-2 flex-1 font-urbanist text-[13.5px] leading-relaxed text-ink-dim">{group.focus}</p>
                    <p className="mt-4 font-urbanist text-[12px] text-ink-faint">{groupDescriptor(group)}</p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Help me choose */}
        <section className="border-t border-hairline-light bg-light-surface py-14 lg:py-20" aria-labelledby="help-heading">
          <div className="mx-auto max-w-6xl px-6 lg:px-10">
            <Reveal>
              <SectionLabel>Help Me Choose</SectionLabel>
              <SectionTitle as="h2" id="help-heading" className="max-w-xl">
                Not sure what you need? Start with your goal.
              </SectionTitle>
            </Reveal>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {STARTER_PATHS.map((p, i) => (
                <Reveal key={p.goal} delay={i * 60}>
                  <div className="h-full rounded-2xl border border-hairline-light bg-light-raised p-5">
                    <p className="font-urbanist text-[14.5px] font-bold text-ink">{p.goal}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {p.steps.map((s, si) => (
                        <span key={s.label} className="flex items-center gap-2">
                          <Link
                            href={s.href}
                            className="rounded-full border border-hairline-light bg-light-surface px-3 py-1.5 font-urbanist text-[12px] font-medium text-ink-dim transition-colors hover:border-aurora-violet/50 hover:text-ink"
                          >
                            {s.label}
                          </Link>
                          {si < p.steps.length - 1 && <ArrowRight size={11} strokeWidth={1.75} className="shrink-0 text-ink-faint" />}
                        </span>
                      ))}
                    </div>
                  </div>
                </Reveal>
              ))}
              <Reveal delay={STARTER_PATHS.length * 60}>
                <Link
                  href="#services-cta"
                  className="flex h-full flex-col items-start justify-center rounded-2xl border border-aurora-violet/30 bg-canvas p-5 transition-colors hover:border-aurora-violet/60"
                >
                  <p className="font-urbanist text-[14.5px] font-bold text-ink">Not seeing your goal?</p>
                  <span className="mt-2 inline-flex items-center gap-1.5 font-urbanist text-[13px] font-semibold text-aurora-violet">
                    Help me choose
                    <ArrowRight size={13} strokeWidth={1.75} />
                  </span>
                </Link>
              </Reveal>
            </div>
          </div>
        </section>

        {/* 5-9. The 5 service groups, in depth — every service in each */}
        {SERVICE_GROUPS.map((group, gi) => (
          <section
            key={group.slug}
            id={`pillar-${group.slug}`}
            className="border-t border-hairline-light bg-light-surface py-14 lg:py-20"
            aria-labelledby={`pillar-${group.slug}-heading`}
          >
            <div className="mx-auto max-w-7xl px-6 lg:px-10">
              <Reveal>
                <SectionLabel>
                  {String(gi + 1).padStart(2, "0")} · {group.name}
                </SectionLabel>
                <SectionTitle as="h2" id={`pillar-${group.slug}-heading`} className="max-w-2xl">
                  {group.focus}
                </SectionTitle>
              </Reveal>

              <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
                <div className="space-y-8">
                  {groupSections(group).map((section) => (
                    <div key={section.name ?? group.slug}>
                      {section.name && <SectionLabel>{section.name}</SectionLabel>}
                      <div className="grid gap-4 sm:grid-cols-2">
                        {section.services.map((svc, i) => (
                          <Reveal key={svc.slug} delay={i * 60}>
                            <Link
                              href={servicePath(svc.slug)}
                              className="group flex h-full flex-col rounded-2xl border border-hairline-light bg-light-raised p-5 transition-colors duration-300 hover:border-aurora-violet/40"
                            >
                              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline-light text-ink-dim transition-colors duration-300 group-hover:border-aurora-violet/50 group-hover:text-aurora-violet">
                                <Icon name={svc.icon} size={16} />
                              </span>
                              <h3 className="mt-3 font-urbanist text-[14px] font-bold text-ink">{svc.menuLabel}</h3>
                              <p className="mt-1.5 flex-1 font-urbanist text-[12.5px] leading-relaxed text-ink-dim">{svc.summary}</p>
                            </Link>
                          </Reveal>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <Reveal delay={120}>
                  <div className="h-full rounded-2xl border border-hairline-light bg-light-raised p-6">
                    <p className="font-urbanist text-[13px] font-semibold uppercase tracking-[0.15em] text-ink-faint">Common outcomes</p>
                    <ul className="mt-4 space-y-2.5">
                      {PILLAR_OUTCOMES[group.slug].map((o) => (
                        <li key={o} className="flex items-start gap-2.5">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-aurora-violet" />
                          <span className="font-urbanist text-[13px] leading-relaxed text-ink-dim">{o}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={servicePath(group.slug)}
                      className="mt-6 inline-flex items-center gap-1.5 border-t border-hairline-light pt-5 font-urbanist text-[13px] font-semibold text-ink-mid transition-colors hover:text-aurora-violet"
                    >
                      Explore {group.name}
                      <ArrowRight size={13} strokeWidth={1.75} />
                    </Link>
                  </div>
                </Reveal>
              </div>
            </div>
          </section>
        ))}

        {/* 10. Always-on standards */}
        <section className="border-t border-hairline-light bg-light-surface py-14 lg:py-20" aria-labelledby="standards-heading">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <Reveal>
              <SectionLabel>Always On</SectionLabel>
              <SectionTitle as="h2" id="standards-heading" className="max-w-xl">
                What you get with CodeShaper, every time.
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

        {/* 11. Engagement models */}
        <section className="border-t border-hairline-light bg-light-surface py-14 lg:py-20" aria-labelledby="engagement-heading">
          <div className="mx-auto max-w-6xl px-6 lg:px-10">
            <Reveal>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <SectionLabel>How You Work With Us</SectionLabel>
                  <SectionTitle as="h2" id="engagement-heading" className="max-w-lg">
                    Flexible engagement models to match scope and speed.
                  </SectionTitle>
                </div>
                <Link
                  href="/engagement"
                  className="inline-flex items-center gap-1.5 font-urbanist text-[13.5px] font-semibold text-ink-dim transition-colors hover:text-aurora-violet"
                >
                  Compare engagement models
                  <ArrowRight size={14} strokeWidth={1.75} />
                </Link>
              </div>
            </Reveal>
            <div className="mt-10 overflow-hidden rounded-[24px] border border-hairline-light bg-light-raised">
              {MODEL_OVERVIEWS.map((m, i) => (
                <Link
                  key={m.href}
                  href={m.href}
                  className={`group flex items-center justify-between gap-4 px-6 py-5 transition-colors duration-200 hover:bg-black/[0.02] sm:px-8 ${i > 0 ? "border-t border-hairline-light" : ""}`}
                >
                  <span className="flex items-center gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-hairline-light text-ink-dim">
                      <Icon name={m.icon} size={16} />
                    </span>
                    <span>
                      <span className="block font-urbanist text-[14.5px] font-bold text-ink">{m.label}</span>
                      <span className="block font-urbanist text-[12.5px] text-ink-dim">{m.oneLiner}</span>
                    </span>
                  </span>
                  <ArrowUpRight size={16} strokeWidth={1.75} className="shrink-0 text-ink-faint transition-colors group-hover:text-aurora-violet" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 12. Industries */}
        <section className="border-t border-hairline-light bg-light-surface py-14 lg:py-20" aria-labelledby="industries-heading">
          <div className="mx-auto max-w-6xl px-6 lg:px-10">
            <Reveal>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <SectionLabel>Routing By Industry</SectionLabel>
                  <SectionTitle as="h2" id="industries-heading" className="max-w-lg">
                    Industries we support with product-grade delivery.
                  </SectionTitle>
                  <SectionDescription className="mt-3 max-w-xl">
                    We build for real operational constraints — speed-to-market, reliability, integrations, and
                    measurable outcomes.
                  </SectionDescription>
                </div>
                <Link
                  href="/industries"
                  className="inline-flex items-center gap-1.5 font-urbanist text-[13.5px] font-semibold text-ink-dim transition-colors hover:text-aurora-violet"
                >
                  Explore industries
                  <ArrowRight size={14} strokeWidth={1.75} />
                </Link>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <div className="mt-8 flex flex-wrap gap-2.5">
                {PRIMARY_INDUSTRIES.map((ind) => (
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

        {/* 13. Proof */}
        <section className="border-t border-hairline-light bg-light-surface py-14 lg:py-20" aria-labelledby="proof-heading">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <Reveal>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <SectionLabel>Proof</SectionLabel>
                  <SectionTitle as="h2" id="proof-heading" className="max-w-lg">
                    Proof in real builds.
                  </SectionTitle>
                  <SectionDescription className="mt-3 max-w-xl">
                    Results vary by product, but our process stays consistent — weekly visibility, reliable delivery,
                    and a clean handover.
                  </SectionDescription>
                </div>
                <Link
                  href="/case-studies"
                  className="inline-flex items-center gap-1.5 font-urbanist text-[13.5px] font-semibold text-ink-dim transition-colors hover:text-aurora-violet"
                >
                  View all success stories
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

        {/* 14. FAQ */}
        <FaqAccordion id="services-faq-heading" title="Service FAQs" items={SERVICES_FAQS} />
      </div>

      {/* 15. Final CTA */}
      <section id="services-cta" className="relative overflow-hidden bg-canvas py-16 lg:py-24" aria-labelledby="services-cta-heading">
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
              <h2 id="services-cta-heading" className="font-urbanist text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
                Tell us your goal — we&apos;ll recommend the best path.
              </h2>
              <p className="mt-6 max-w-lg font-urbanist text-lg leading-relaxed text-ink-dim">
                Share your product stage, timeline, and priorities. We&apos;ll suggest the right service and
                engagement model, and the next steps.
              </p>
              <p className="mt-6 font-urbanist text-[12.5px] text-ink-faint">NDA available on request.</p>
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
