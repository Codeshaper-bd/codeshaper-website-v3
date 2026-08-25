"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Reveal from "@/components/system/Reveal";

/**
 * FAQ — light section between Locations (dark) and the final CTA (dark),
 * keeping the site's alternating light/dark rhythm. Editorial divide-y
 * list rather than bordered cards, matching AiDevExcellence's phase row
 * treatment rather than introducing a third card style on one page.
 *
 * Answers are grounded in real, already-established site content only
 * (SERVICE_COLUMNS' 5 pillars, EngagementModels' 5 models, the AI-assisted
 * phases in AiDevExcellence, the regions in Locations) — no invented
 * pricing, timelines, or headcount claims.
 */
const FAQS: { q: string; a: string }[] = [
  {
    q: "What services does Codeshaper offer?",
    a: "Five core practices: Experience & Product Design, Product Engineering, Websites & Growth, Commerce Experiences, and AI & Automation — see Services for the full breakdown of each.",
  },
  {
    q: "Which engagement model fits our project?",
    a: "It depends on where you're starting from: an MVP Sprint for a fast first build, End-to-End Delivery when we own the whole scope, a Dedicated Product Team or Team Augmentation to extend yours, or a Global Delivery Model for a distributed build with one accountable team. Tell us where you are and we'll recommend a fit.",
  },
  {
    q: "How do you use AI in the development process?",
    a: "AI is assisted, not autonomous — it speeds up discovery, engineering, QA, and release, but a person still reviews the decisions that matter at every phase.",
  },
  {
    q: "Where is your team based, and how do you handle time zones?",
    a: "Bangladesh is our delivery hub. Japan, the USA, the UK, Australia, and New Zealand give us collaboration hubs across time zones, so there's working overlap wherever you're based.",
  },
  {
    q: "Do you work with early-stage startups or only larger companies?",
    a: "Both. MVP Sprint and Dedicated Product Team engagements suit early-stage teams moving fast; End-to-End Delivery and the Global Delivery Model suit larger, more established organizations with more scope to cover.",
  },
  {
    q: "How do we get started?",
    a: "Book a call or send us a brief — we'll walk through scope, timeline, and the engagement model that fits before anything is signed.",
  },
];

export default function FAQ() {
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
    <section className="theme-light relative bg-light-surface py-16 lg:py-20" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-4xl px-6 lg:px-10">
        <Reveal>
          <p className="mb-3 inline-flex items-center gap-2.5 font-urbanist text-[11px] font-medium uppercase tracking-[0.28em] text-ink-dim">
            <span className="h-1.5 w-1.5 rounded-full bg-aurora-amber" />
            FAQ
          </p>
          <h2 id="faq-heading" className="max-w-2xl font-urbanist text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
            Questions, answered.
          </h2>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-10 divide-y divide-hairline border-y border-hairline">
            {FAQS.map((item, i) => {
              const isOpen = open.has(i);
              return (
                <div key={item.q}>
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left font-urbanist text-base font-semibold text-ink transition-colors duration-200 hover:text-aurora-violet sm:text-lg"
                  >
                    {item.q}
                    <ChevronDown
                      size={18}
                      strokeWidth={1.75}
                      className="shrink-0 text-ink-faint transition-transform duration-300"
                      style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                    />
                  </button>
                  <div className="faq-panel" data-open={isOpen}>
                    <div>
                      <p className="max-w-2xl pb-5 font-urbanist text-[14.5px] leading-relaxed text-ink-dim">{item.a}</p>
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
