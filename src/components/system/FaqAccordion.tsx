"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, ArrowRight } from "lucide-react";
import { SectionEyebrow, SectionTitle, SectionDescription } from "@/components/system/SectionHeading";
import Reveal from "@/components/system/Reveal";
import CountUp from "@/components/system/CountUp";

export type Faq = { q: string; a: string };
export type FaqStat = { value: number; suffix?: string; label: string };
export type FaqCta = { title: string; description: string; label: string; href: string };

function AccordionList({ items, open, toggle }: { items: Faq[]; open: Set<number>; toggle: (i: number) => void }) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-hairline-light bg-light-raised">
      {items.map((item, i) => {
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
  );
}

/**
 * Generic FAQ accordion — same recipe as case-studies/CaseStudiesFaq.tsx,
 * generalized (parameterized by id/title/items) for reuse across any
 * bespoke inner page. Kept decoupled from any one content file's types —
 * callers just pass {q, a} objects.
 *
 * Optional `stats` + `cta` switch this into the homepage FAQ.tsx's own
 * 2-column layout (stat counters + a dark "still have questions" card
 * on the left, the accordion on the right) instead of the plain
 * centered version — added because both the Industries hub and the
 * SaaS page asked for "FAQ with better design, with some statistics"
 * and "needs a CTA" specifically, not just the bare accordion.
 */
export default function FaqAccordion({
  id,
  title,
  items,
  description,
  stats,
  cta,
}: {
  id: string;
  title: string;
  items: Faq[];
  description?: string;
  stats?: FaqStat[];
  cta?: FaqCta;
}) {
  const [open, setOpen] = useState<Set<number>>(new Set([0]));

  const toggle = (i: number) => {
    setOpen((s) => {
      const next = new Set(s);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  if (stats || cta) {
    return (
      <section className="relative overflow-hidden bg-light-surface py-14 lg:py-20" aria-labelledby={id}>
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-[340px_1fr] lg:gap-14">
            <div>
              <Reveal>
                <SectionEyebrow>FAQ</SectionEyebrow>
                <SectionTitle id={id}>{title}</SectionTitle>
                {description && <SectionDescription className="mt-4 max-w-sm">{description}</SectionDescription>}
              </Reveal>

              {stats && stats.length > 0 && (
                <Reveal delay={100}>
                  <div className="mt-8 flex gap-8 border-y border-hairline-light py-6">
                    {stats.map((s) => (
                      <div key={s.label}>
                        <p className="font-urbanist text-3xl font-bold tracking-tight text-ink">
                          <CountUp value={s.value} suffix={s.suffix ?? ""} />
                        </p>
                        <p className="mt-1 font-urbanist text-[12.5px] leading-snug text-ink-dim">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </Reveal>
              )}

              {cta && (
                <Reveal delay={160}>
                  <div className="mt-8 overflow-hidden rounded-[24px] bg-ink p-6 text-white">
                    <p className="font-urbanist text-base font-bold leading-snug">{cta.title}</p>
                    <p className="mt-1.5 font-urbanist text-[13px] leading-relaxed text-white/55">{cta.description}</p>
                    <Link
                      href={cta.href}
                      className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 font-urbanist text-[13px] font-semibold text-ink transition-transform duration-300 hover:scale-[1.03]"
                    >
                      {cta.label}
                      <ArrowRight size={14} strokeWidth={1.75} />
                    </Link>
                  </div>
                </Reveal>
              )}
            </div>

            <Reveal delay={80}>
              <AccordionList items={items} open={open} toggle={toggle} />
            </Reveal>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-light-surface py-14 lg:py-20" aria-labelledby={id}>
      <div className="relative mx-auto max-w-4xl px-6 lg:px-10">
        <Reveal>
          <SectionEyebrow className="mx-auto w-fit">FAQ</SectionEyebrow>
          <SectionTitle id={id} className="mx-auto max-w-xl text-center">
            {title}
          </SectionTitle>
        </Reveal>

        <Reveal delay={80}>
          <AccordionList items={items} open={open} toggle={toggle} />
        </Reveal>
      </div>
    </section>
  );
}
