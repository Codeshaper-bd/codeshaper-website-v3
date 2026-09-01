"use client";

// A Lucide icon component reference in ENGAGEMENT_MODEL_CARDS can't cross
// the Server->Client serialization boundary as a prop (confirmed: "Only
// plain objects can be passed to Client Components from Server
// Components" / "Functions cannot be passed directly..." at runtime) —
// this section render the icon itself, so it needs to stay client-side
// end to end, matching how this file originally worked before the
// ModelCard extraction.
import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/system/Reveal";
import { SectionEyebrow, SectionTitle, SectionDescription } from "@/components/system/SectionHeading";
import { ModelCard } from "@/components/system/EngagementModelCards";
import { ENGAGEMENT_MODEL_CARDS } from "@/lib/engagementModels";

/**
 * Engagement models — compact, single-row (on desktop) lineup of standout
 * cards: an icon badge, a huge ghost numeral tinted in the card's own
 * accent, then title + a one-line fit. The card itself (ModelCard) and
 * its data now live in components/system/EngagementModelCards.tsx,
 * shared with case-studies/DeliveryModelsStrip.tsx — this file only owns
 * the section-level composition (heading, CTA, cascading stagger).
 *
 * The 2/5-column split on the last (5th) card mirrors DeliverySystem's
 * own `i === 4 ? "sm:col-span-2 lg:col-span-1" : ""` pattern for a
 * 5-item grid — reusing that exact convention rather than inventing a
 * new one.
 *
 * Each card sits progressively lower than the one before it
 * (`--stagger-y` custom property, applied via `lg:mt-[...]` so it only
 * affects the single-row desktop layout, not the stacked mobile/tablet
 * grid) — a deliberate cascading offset.
 */
export default function EngagementModels() {
  return (
    <section className="theme-light relative bg-light-surface py-16 lg:py-20" aria-labelledby="engagement-heading">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <SectionEyebrow>Engagement Models</SectionEyebrow>
              <SectionTitle id="engagement-heading" className="max-w-md">
                Flexible engagement models built around your roadmap.
              </SectionTitle>
            </div>
            <div className="flex items-center gap-4">
              <SectionDescription className="max-w-xs">
                Choose the model that matches your scope certainty, timeline, and team structure.
              </SectionDescription>
              <Link
                href="/engagement"
                className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-aurora-violet px-5 py-2.5 font-urbanist text-[13px] font-semibold text-white transition-[background-color,transform] duration-300 hover:scale-[1.02] hover:bg-aurora-violet-dark"
              >
                Compare Models
                <ArrowRight size={14} strokeWidth={1.75} />
              </Link>
            </div>
          </div>
        </Reveal>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5 lg:items-start">
          {ENGAGEMENT_MODEL_CARDS.map((m, i) => (
            <li
              key={m.name}
              className={`lg:mt-[var(--stagger-y)] ${i === ENGAGEMENT_MODEL_CARDS.length - 1 ? "sm:col-span-2 lg:col-span-1" : ""}`}
              style={{ "--stagger-y": `${i * 28}px` } as CSSProperties}
            >
              <Reveal delay={i * 80} className="h-full [perspective:900px]">
                <ModelCard model={m} index={i} />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
