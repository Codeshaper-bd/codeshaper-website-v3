"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";
import { SectionEyebrow, SectionTitle, SectionDescription } from "@/components/system/SectionHeading";
import Reveal from "@/components/system/Reveal";
import CountUp from "@/components/system/CountUp";
import { CASE_STUDIES_FAQS as FAQS } from "@/lib/caseStudiesFaq";
import { CASE_STUDIES } from "@/lib/caseStudies";
import { ENGAGEMENT_MODELS } from "@/lib/navigation";

/**
 * Round 2: brought up to the same bar as the homepage FAQ.tsx (and this
 * page's own hero / "How we work") — the floating-card shell
 * (`bg-light-surface` gutter + `rounded-[32px] bg-canvas`), a two-column
 * layout with real stat counters + a "still have questions" CTA panel
 * on the left, and the numbered accordion on the right, instead of a
 * plain centered list on a flat section.
 */
const STATS = [
  { value: CASE_STUDIES.length, label: "Shipped case studies" },
  { value: ENGAGEMENT_MODELS.length, label: "Engagement models" },
];

export default function CaseStudiesFaq() {
  const [open, setOpen] = useState<Set<number>>(new Set([0]));

  const toggle = (i: number) => {
    setOpen((s) => {
      const next = new Set(s);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <div className="bg-light-surface p-3 sm:p-4">
      <section className="theme-light relative overflow-hidden rounded-[32px] bg-canvas py-14 lg:py-20" aria-labelledby="cs-faq-heading">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-[340px_1fr] lg:gap-14">
            <div>
              <Reveal>
                <SectionEyebrow>FAQ</SectionEyebrow>
                <SectionTitle id="cs-faq-heading">Questions, answered</SectionTitle>
                <SectionDescription className="mt-4 max-w-sm">
                  What clients ask before starting a project with us — proof, process, and how we work together.
                </SectionDescription>
              </Reveal>

              <Reveal delay={100}>
                <div className="mt-8 flex gap-8 border-y border-hairline-light py-6">
                  {STATS.map((s) => (
                    <div key={s.label}>
                      <p className="font-urbanist text-3xl font-bold tracking-tight text-ink">
                        <CountUp value={s.value} />
                      </p>
                      <p className="mt-1 font-urbanist text-[12.5px] leading-snug text-ink-dim">{s.label}</p>
                    </div>
                  ))}
                </div>
              </Reveal>

              <Reveal delay={160}>
                <div className="mt-8 overflow-hidden rounded-[24px] bg-ink p-6 text-white">
                  <p className="font-urbanist text-base font-bold leading-snug">Still have questions?</p>
                  <p className="mt-1.5 font-urbanist text-[13px] leading-relaxed text-white/55">
                    Tell us about your project and we&apos;ll point you to the right fit.
                  </p>
                  <Link
                    href="/contact"
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 font-urbanist text-[13px] font-semibold text-ink transition-transform duration-300 hover:scale-[1.03]"
                  >
                    Book a Call
                    <ArrowRight size={14} strokeWidth={1.75} />
                  </Link>
                </div>
              </Reveal>
            </div>

            <Reveal delay={80}>
              <div className="overflow-hidden rounded-[24px] border border-hairline-light bg-light-raised">
                {FAQS.map((item, i) => {
                  const isOpen = open.has(i);
                  return (
                    <div key={item.q} className={i > 0 ? "border-t border-hairline-light" : ""}>
                      <button
                        type="button"
                        onClick={() => toggle(i)}
                        aria-expanded={isOpen}
                        className="flex w-full items-center gap-4 px-6 py-5 text-left transition-colors duration-200 hover:bg-black/[0.02] sm:px-8"
                      >
                        <span
                          className="shrink-0 font-urbanist text-[13px] font-semibold tabular-nums transition-colors duration-300"
                          style={{ color: isOpen ? "var(--color-aurora-violet)" : "var(--color-ink-faint)" }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="flex-1 font-urbanist text-[15px] font-semibold leading-snug text-ink">{item.q}</span>
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
                          <p className="px-6 pb-6 pl-[46px] font-urbanist text-[14px] leading-relaxed text-ink-dim sm:px-8 sm:pl-[54px]">
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
      </section>
    </div>
  );
}
