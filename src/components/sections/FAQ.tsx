"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";
import Reveal from "@/components/system/Reveal";
import CountUp from "@/components/system/CountUp";
import { SectionEyebrow, SectionTitle } from "@/components/system/SectionHeading";
import { SERVICE_GROUPS } from "@/data/services";
import { homeCopy, type CopyOf } from "@/lib/homeCopy";
import DotField from "@/components/sections/human-ai-flow/DotField";

/** "A, B, C, D, and E" — the five group names, in locked order. */
function listGroups(): string {
  const names = SERVICE_GROUPS.map((g) => g.name);
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}

/**
 * FAQ — round 2. Feedback: the plain divide-y list read as basic next to
 * references (Vivasoft, Musemind, Ontik, Qtec) that all pair the FAQ list
 * with a supporting left column (stat cards, a CTA card, or a photo) and
 * present each row as a numbered item with a proper circular toggle
 * rather than a bare chevron.
 *
 * Two-column split: left is eyebrow/heading/intro + two real stats (5
 * service groups, 6 global hubs — both structural counts already
 * established elsewhere: SERVICE_GROUPS.length in data/services.ts,
 * LOCATIONS.length in Locations.tsx) + a dark "still have questions"
 * card reusing the same /contact route as the Navbar's own "Book a
 * Call". Right is the accordion itself, now one bordered card with
 * numbered rows and a circular chevron button, instead of a bare list.
 *
 * SEO: answers stay in the DOM (not conditionally rendered) regardless
 * of open/closed state — the existing .faq-panel grid-rows trick only
 * hides them visually — and the same Q/A pairs are duplicated into a
 * FAQPage JSON-LD block so search engines can pick them up as rich
 * results. Added two more grounded questions (redesign/existing
 * products, industries) to widen topical coverage — both answers are
 * real service-line facts (the modernization/migration/maintenance
 * services in data/services.ts, the 10-entry INDUSTRIES list), not
 * invented claims.
 */
const STATS: { value: number; suffix: string; label: string }[] = [
  { value: SERVICE_GROUPS.length, suffix: "", label: "Service groups" },
  { value: 6, suffix: "", label: "Global hubs" },
];

const faqJsonLd = (FAQS: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});

export default function FAQ({ copy }: { copy?: CopyOf<"faq"> }) {
  const c = homeCopy("faq", copy);
  const faqs = c.items.map((f) => ({
    ...f,
    a: f.a.replace("{groups}", listGroups()),
  }));
  const [open, setOpen] = useState<Set<number>>(new Set([0]));

  const toggle = (i: number) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <section className="theme-light relative overflow-hidden bg-light-surface py-16 lg:py-24" aria-labelledby="faq-heading">
      {/* the shared dotted background (as Human + AI), fading out at the top and bottom */}
      <DotField className="[mask-image:linear-gradient(to_bottom,transparent,black_22%,black_78%,transparent)]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[360px_1fr] lg:gap-16">
          <div>
            <Reveal>
              <SectionEyebrow>{c.eyebrow}</SectionEyebrow>
              <SectionTitle id="faq-heading">{c.title}</SectionTitle>
            </Reveal>

            <Reveal delay={100}>
              <div className="mt-8 flex gap-8 border-y border-hairline py-6">
                {STATS.map((s) => (
                  <div key={s.label}>
                    <p className="font-urbanist text-3xl font-bold tracking-tight text-ink">
                      <CountUp value={s.value} suffix={s.suffix} />
                    </p>
                    <p className="mt-1 font-urbanist text-[12.5px] leading-snug text-ink-dim">{s.label}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={160}>
              <div className="mt-8 overflow-hidden rounded-[24px] bg-ink p-6 text-white">
                <p className="font-urbanist text-base font-bold leading-snug">{c.askTitle}</p>
                <p className="mt-1.5 font-urbanist text-[13px] leading-relaxed text-white/55">{c.askText}</p>
                <Link
                  href="/contact"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 font-urbanist text-[13px] font-semibold text-ink transition-transform duration-300 hover:scale-[1.03]"
                >
                  {c.askButton}
                  <ArrowRight size={14} strokeWidth={1.75} />
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal delay={80}>
            <div className="overflow-hidden rounded-[28px] border border-hairline bg-[#fafafa] shadow-[0_20px_50px_rgba(9,9,11,0.06)]">
              {faqs.map((item, i) => {
                const isOpen = open.has(i);
                return (
                  <div key={item.q} className={i > 0 ? "border-t border-hairline" : ""}>
                    <button
                      type="button"
                      onClick={() => toggle(i)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center gap-4 px-6 py-5 text-left transition-colors duration-200 hover:bg-black/[0.02] sm:px-8"
                    >
                      <span
                        className="shrink-0 font-urbanist text-[13px] font-semibold tabular-nums transition-colors duration-300"
                        style={{
                          color: isOpen ? "var(--color-aurora-violet)" : "var(--color-ink-faint)",
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1 font-urbanist text-[15px] font-semibold leading-snug text-ink sm:text-base">{item.q}</span>
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-[background-color,border-color,transform] duration-300"
                        style={{
                          borderColor: isOpen ? "var(--color-aurora-violet)" : "var(--color-hairline)",
                          backgroundColor: isOpen ? "var(--color-aurora-violet)" : "transparent",
                          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        }}
                      >
                        <ChevronDown size={15} strokeWidth={2} className={isOpen ? "text-white" : "text-ink-faint"} />
                      </span>
                    </button>
                    <div className="faq-panel" data-open={isOpen}>
                      <div>
                        <p className="max-w-2xl px-6 pb-6 pl-[46px] font-urbanist text-[14px] leading-relaxed text-ink-dim sm:px-8 sm:pl-[54px]">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd(faqs)).replace(/</g, "\\u003c"),
        }}
      />
    </section>
  );
}
