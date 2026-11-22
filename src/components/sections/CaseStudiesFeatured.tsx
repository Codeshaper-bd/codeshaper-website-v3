"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import Flag from "@/components/system/Flag";
import Reveal from "@/components/system/Reveal";
import { SectionEyebrow, SectionTitle } from "@/components/system/SectionHeading";
import { CASE_STUDIES, getCaseStudyBySlug, type CaseStudy } from "@/lib/caseStudies";

/**
 * Case studies, homepage: stacked sticky cards (the studio-portfolio
 * pattern). Each project is one large card; on desktop it pins as you
 * scroll, the next card slides over it and the one underneath eases back
 * (scale + dim), like leafing through a portfolio.
 *
 *  · Media first (~60% of the card), then the story: index, client,
 *    outcome headline, proof (results, or what we built), one CTA.
 *  · Essentialist uses real screenshots of the live site; Fennec and
 *    Acculance have none yet, so their media is typographic. Add screens
 *    to /public/media/case-studies and set `screens` below to switch.
 *  · Only real projects from lib/caseStudies.ts. Below lg, and under
 *    reduced motion, the cards simply stack with no pinning or scaling.
 */
type Entry = {
  slug: string;
  headline?: string;
  screens?: { desktop: string; mobile?: string };
  wash: string;
  accent: string;
};

const DESIGNED: Entry[] = [
  {
    slug: "essentialist",
    headline: "A premium membership site, launched in 8–10 weeks.",
    screens: { desktop: "/media/case-studies/essentialist-home.jpg", mobile: "/media/case-studies/essentialist-mobile.jpg" },
    wash: "radial-gradient(85% 95% at 0% 100%, rgba(255,162,108,0.55) 0%, rgba(255,201,112,0.28) 35%, rgba(255,255,255,0) 70%), radial-gradient(60% 70% at 100% 0%, rgba(192,138,255,0.28) 0%, rgba(255,255,255,0) 70%)",
    accent: "#c2531c",
  },
  {
    slug: "fennec",
    wash: "radial-gradient(90% 100% at 100% 100%, #8676ff 0%, #c08aff 24%, #dcc6ff 44%, rgba(238,230,255,0.55) 62%, rgba(255,255,255,0) 82%)",
    accent: "#4b3fb8",
  },
  {
    slug: "acculance",
    wash: "radial-gradient(90% 100% at 100% 100%, #4f9be0 0%, #8cc1f2 24%, #bfddfb 44%, rgba(227,239,253,0.55) 62%, rgba(255,255,255,0) 82%)",
    accent: "#1d5f9e",
  },
];

const DEFAULT_WASH = "radial-gradient(90% 100% at 100% 100%, #8676ff 0%, #c08aff 24%, #dcc6ff 44%, rgba(238,230,255,0.55) 62%, rgba(255,255,255,0) 82%)";
/** The designed cards that are published, then any other case study marked Featured in the CMS. */
const ENTRIES: Entry[] = [
  ...DESIGNED.filter((e) => getCaseStudyBySlug(e.slug)),
  ...CASE_STUDIES.filter((c) => c.featured && !DESIGNED.some((e) => e.slug === c.slug)).map((c) => ({ slug: c.slug, wash: DEFAULT_WASH, accent: c.accent, screens: { desktop: c.image } })),
];

const STICKY_TOP = 96; // px from the viewport top on desktop
const PEEK = 18; // each later card pins a little lower, so the stack shows

/** Cards whose case study is published. */
function story(slug: string): CaseStudy {
  return getCaseStudyBySlug(slug)!;
}

function Media({ cs, e }: { cs: CaseStudy; e: Entry }) {
  const host = cs.liveUrl?.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return (
    <div className="relative h-full overflow-hidden rounded-[22px] bg-[#f6f4f1]">
      <div aria-hidden className="absolute inset-0 transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:scale-[1.05]" style={{ background: e.wash }} />

      {e.screens ? (
        <div className="absolute inset-x-[7%] top-[11%] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:-translate-y-1.5">
          <div className="overflow-hidden rounded-[12px] border border-[#0b0f19]/[0.08] bg-white shadow-[0_1px_2px_rgba(11,15,25,0.05),0_40px_70px_-34px_rgba(11,15,25,0.5)]">
            <div className="flex items-center gap-1.5 border-b border-[#0b0f19]/[0.06] bg-[#fafaf9] px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-[#0b0f19]/15" />
              <span className="h-2 w-2 rounded-full bg-[#0b0f19]/15" />
              <span className="h-2 w-2 rounded-full bg-[#0b0f19]/15" />
              {host && <span className="mx-auto rounded-md bg-[#0b0f19]/[0.04] px-3 py-0.5 font-urbanist text-[10.5px] text-ink-dim">{host}</span>}
            </div>
            <div className="relative aspect-[16/10]">
              <Image src={e.screens.desktop} alt={`${cs.project} website`} fill sizes="(min-width: 1024px) 720px, 92vw" className="object-cover object-top" />
            </div>
          </div>
          {e.screens.mobile && (
            <div className="absolute -bottom-[14%] right-[-3%] w-[22%] min-w-[90px] rounded-[24px] bg-[#0b0f19] p-[4px] shadow-[0_30px_50px_-22px_rgba(11,15,25,0.65)]">
              <div className="relative aspect-[390/760] overflow-hidden rounded-[20px] bg-white">
                <Image src={e.screens.mobile} alt={`${cs.project} on mobile`} fill sizes="170px" className="object-cover object-top" />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div aria-hidden className="relative flex h-full flex-col justify-between p-7 sm:p-10">
          <span className="w-fit rounded-full border border-white/70 bg-white/60 px-3 py-1 font-urbanist text-[12px] font-semibold text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-md">
            {cs.platforms}
          </span>
          <div>
            <p className="font-urbanist text-[56px] font-bold leading-[0.9] tracking-[-0.045em] text-ink sm:text-[88px] lg:text-[104px]">{cs.project}</p>
            <p className="mt-4 font-urbanist text-[14px] font-medium text-ink/70">{cs.industry}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CaseStudiesFeatured() {
  const listRef = useRef<HTMLOListElement>(null);

  // ease each pinned card back as the next one slides over it
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const desktop = window.matchMedia("(min-width: 1024px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const cards = [...list.querySelectorAll<HTMLElement>("[data-stack-card]")];
    let raf = 0;
    const update = () => {
      raf = 0;
      const on = desktop.matches && !reduced.matches;
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        let p = 0;
        if (on && next) {
          const h = card.offsetHeight;
          const nextTop = next.getBoundingClientRect().top;
          const pinnedAt = STICKY_TOP + (i + 1) * PEEK;
          p = Math.min(1, Math.max(0, 1 - (nextTop - pinnedAt) / h));
        }
        card.style.transform = p ? `scale(${1 - p * 0.05})` : "";
        card.style.filter = p ? `brightness(${1 - p * 0.08})` : "";
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section className="theme-light relative bg-light-surface py-16 lg:py-24" aria-labelledby="cases-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <Reveal>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <SectionEyebrow>Case Studies</SectionEyebrow>
              <SectionTitle id="cases-heading" className="max-w-[16ch] text-balance">
                Work that shipped, and what it changed.
              </SectionTitle>
            </div>
            <Link
              href="/case-studies"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-[#0b0f19]/10 bg-white px-4 py-2.5 font-urbanist text-[13px] font-semibold text-ink transition-colors hover:bg-[#f6f6f4]"
            >
              All case studies
              <ArrowRight size={14} strokeWidth={1.9} aria-hidden />
            </Link>
          </div>
        </Reveal>

        <ol ref={listRef} className="mt-10 space-y-5 lg:mt-14 lg:space-y-8">
          {ENTRIES.map((e, i) => {
            const cs = story(e.slug);
            const proof = cs.results?.operational?.length ? cs.results.operational.slice(0, 3) : (cs.deliverables ?? []).slice(0, 3);
            const proofLabel = cs.results?.operational?.length ? "Results" : "What we built";
            return (
              <li key={e.slug} className="lg:sticky" style={{ top: STICKY_TOP + i * PEEK }}>
                <article
                  data-stack-card
                  className="group/card relative origin-top overflow-hidden rounded-[32px] border border-[#0b0f19]/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(11,15,25,0.04),0_30px_60px_-40px_rgba(11,15,25,0.35)] will-change-transform"
                >
                  <div className="grid gap-3 lg:h-[560px] lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
                    {/* story */}
                    <div className="order-2 flex flex-col p-4 sm:p-6 lg:order-1 lg:p-8">
                      <div className="flex items-center justify-between font-urbanist text-[12px] text-ink-dim">
                        <span className="tabular-nums">
                          <span className="font-semibold text-ink">{String(i + 1).padStart(2, "0")}</span> / {String(ENTRIES.length).padStart(2, "0")}
                        </span>
                        <span className="flex flex-wrap justify-end gap-1.5">
                          <span className="rounded-full border border-[#0b0f19]/[0.08] bg-white px-2.5 py-1 text-ink">{cs.industry}</span>
                          {cs.market && (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0b0f19]/[0.08] bg-white py-1 pl-2 pr-2.5 text-ink">
                              <Flag market={cs.market} />
                              {cs.market}
                            </span>
                          )}
                        </span>
                      </div>

                      <p className="mt-8 font-urbanist text-[14px] text-ink-dim lg:mt-auto">
                        <span className="font-semibold text-ink">{cs.project}</span>
                        <span> · {cs.services.slice(0, 2).join(", ")}</span>
                      </p>
                      <h3 className="mt-2 font-urbanist text-[26px] font-bold leading-[1.1] tracking-[-0.025em] text-ink sm:text-[32px]">
                        {e.headline ?? cs.headline}
                      </h3>

                      <div className="mt-6 border-t border-[#0b0f19]/[0.07] pt-5">
                        <p className="font-urbanist text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-faint">{proofLabel}</p>
                        <ul className="mt-3 space-y-2">
                          {proof.map((r) => (
                            <li key={r} className="flex items-start gap-2.5 font-urbanist text-[14px] leading-snug text-ink">
                              <Check size={15} strokeWidth={2.4} className="mt-[2px] shrink-0" style={{ color: e.accent }} aria-hidden />
                              {r.replace(/^Delivered launch in ~8–10 weeks$/, "Launched in about 8–10 weeks")}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {cs.testimonial && (
                        <figure className="mt-5 flex items-center gap-3">
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#f1f0ee] font-urbanist text-[11.5px] font-semibold text-ink">
                            {cs.testimonial.name.split(" ").map((w) => w[0]).join("")}
                          </span>
                          <div className="min-w-0">
                            <blockquote className="font-urbanist text-[13.5px] leading-snug text-ink">
                              &ldquo;…very pleased with the service and responsiveness.&rdquo;
                            </blockquote>
                            <figcaption className="mt-0.5 font-urbanist text-[12px] text-ink-dim">
                              {cs.testimonial.name}, {cs.testimonial.role.split(",")[0]}
                            </figcaption>
                          </div>
                        </figure>
                      )}

                      <Link
                        href={`/case-studies/${cs.slug}`}
                        className="group/cta mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-[#0b0f19] py-2 pl-5 pr-2 font-urbanist text-[13.5px] font-semibold text-white transition-colors hover:bg-[#1f2433] lg:mt-8"
                      >
                        Read the case study
                        <span className="grid h-7 w-7 place-items-center rounded-full bg-white/15 transition-transform duration-300 group-hover/cta:rotate-45">
                          <ArrowUpRight size={14} strokeWidth={2} aria-hidden />
                        </span>
                        <span className="sr-only">: {cs.project}</span>
                      </Link>
                    </div>

                    {/* media */}
                    <div className="order-1 h-[260px] sm:h-[380px] lg:order-2 lg:h-full">
                      <Media cs={cs} e={e} />
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
