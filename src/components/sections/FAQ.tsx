"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";
import Reveal from "@/components/system/Reveal";
import CountUp from "@/components/system/CountUp";
import { SectionEyebrow, SectionTitle, SectionDescription } from "@/components/system/SectionHeading";

/**
 * FAQ — round 2. Feedback: the plain divide-y list read as basic next to
 * references (Vivasoft, Musemind, Ontik, Qtec) that all pair the FAQ list
 * with a supporting left column (stat cards, a CTA card, or a photo) and
 * present each row as a numbered item with a proper circular toggle
 * rather than a bare chevron.
 *
 * Two-column split: left is eyebrow/heading/intro + two real stats (5
 * core practices, 6 global hubs — both structural counts already
 * established elsewhere: SERVICE_COLUMNS.length in navigation.ts,
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
 * real service-line facts (ServicePillars' "Redesign & Replatforming",
 * the 10-entry INDUSTRIES list), not invented claims.
 */
const FAQS: { q: string; a: string }[] = [
  {
    q: "What services does CodeShaper offer?",
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
    q: "Can you redesign or maintain an existing product?",
    a: "Yes — Redesign & Replatforming is one of our standing services, covering platform migrations, UI refreshes, and ongoing maintenance without a ground-up rebuild.",
  },
  {
    q: "What industries do you have experience in?",
    a: "SaaS, eCommerce & retail, and eight more — see Industries for the full list and how each workflow is adapted to what makes that business different.",
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

const STATS: { value: number; suffix: string; label: string }[] = [
  { value: 5, suffix: "", label: "Core practices" },
  { value: 6, suffix: "", label: "Global hubs" },
];

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

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
    <section className="theme-light relative overflow-hidden bg-light-surface py-16 lg:py-20" aria-labelledby="faq-heading">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage: "repeating-linear-gradient(90deg, rgba(11,15,25,0.05) 0, rgba(11,15,25,0.05) 1px, transparent 1px, transparent 120px)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[360px_1fr] lg:gap-16">
          <div>
            <Reveal>
              <SectionEyebrow>FAQ</SectionEyebrow>
              <SectionTitle id="faq-heading">What clients ask before we start.</SectionTitle>
              <SectionDescription className="mt-4 max-w-sm">
                The things clients ask before kicking off — services, process, AI, and where the team works from.
              </SectionDescription>
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
            <div className="overflow-hidden rounded-[28px] border border-hairline bg-[#fafafa] shadow-[0_20px_50px_rgba(9,9,11,0.06)]">
              {FAQS.map((item, i) => {
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
                        style={{ color: isOpen ? "var(--color-aurora-violet)" : "var(--color-ink-faint)" }}
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

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }} />
    </section>
  );
}
