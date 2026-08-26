"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Faq } from "@/lib/blog";

/** Same numbered-row + circular-chevron + .faq-panel grid-rows pattern as the homepage FAQ section, scoped down to fit inside an article column. */
export default function BlogFaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<Set<number>>(new Set([0]));

  const toggle = (i: number) => {
    setOpen((s) => {
      const next = new Set(s);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  if (faqs.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-hairline-light bg-light-raised">
      {faqs.map((item, i) => {
        const isOpen = open.has(i);
        return (
          <div key={item.q} className={i > 0 ? "border-t border-hairline-light" : ""}>
            <button
              type="button"
              onClick={() => toggle(i)}
              aria-expanded={isOpen}
              className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors duration-200 hover:bg-black/[0.02] sm:px-6"
            >
              <span
                className="shrink-0 font-urbanist text-[12.5px] font-semibold tabular-nums transition-colors duration-300"
                style={{ color: isOpen ? "var(--color-aurora-violet)" : "var(--color-ink-faint)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex-1 font-urbanist text-[14.5px] font-semibold leading-snug text-ink">{item.q}</span>
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-[background-color,border-color,transform] duration-300"
                style={{
                  borderColor: isOpen ? "var(--color-aurora-violet)" : "var(--color-hairline)",
                  backgroundColor: isOpen ? "var(--color-aurora-violet)" : "transparent",
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                <ChevronDown size={14} strokeWidth={2} className={isOpen ? "text-white" : "text-ink-faint"} />
              </span>
            </button>
            <div className="faq-panel" data-open={isOpen}>
              <div>
                <p className="px-5 pb-5 pl-[42px] font-urbanist text-[13.5px] leading-relaxed text-ink-dim sm:px-6 sm:pl-[50px]">
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
