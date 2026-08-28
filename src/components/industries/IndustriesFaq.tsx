"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { SectionEyebrow, SectionTitle } from "@/components/system/SectionHeading";
import Reveal from "@/components/system/Reveal";
import type { Faq } from "@/lib/industriesContent";

/** Same accordion recipe as case-studies/CaseStudiesFaq.tsx, parameterized for reuse across the Industries hub + SaaS page. */
export default function IndustriesFaq({ id, title, items }: { id: string; title: string; items: Faq[] }) {
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
    <section className="relative overflow-hidden bg-light-surface py-14 lg:py-20" aria-labelledby={id}>
      <div className="relative mx-auto max-w-4xl px-6 lg:px-10">
        <Reveal>
          <SectionEyebrow className="mx-auto w-fit">FAQ</SectionEyebrow>
          <SectionTitle id={id} className="mx-auto max-w-xl text-center">
            {title}
          </SectionTitle>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-8 overflow-hidden rounded-[24px] border border-hairline-light bg-light-raised">
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
        </Reveal>
      </div>
    </section>
  );
}
