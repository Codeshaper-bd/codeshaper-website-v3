"use client";

// Same constraint as sections/EngagementModels.tsx: a Lucide icon
// component reference can't cross the Server->Client boundary as a
// prop, so this section stays client-side end to end.
import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/system/Reveal";
import { SectionEyebrow, SectionTitle, SectionDescription } from "@/components/system/SectionHeading";
import { ModelCard } from "@/components/system/EngagementModelCards";
import { ENGAGEMENT_MODEL_CARDS } from "@/lib/engagementModels";

/**
 * "How we work" — now renders the exact same ModelCard/data the
 * homepage's EngagementModels uses (components/system/EngagementModelCards.tsx),
 * including the cascading stagger offset, instead of a similar-but-drifted
 * local recipe (this had gotten a different icon set, smaller card
 * height/numeral, and no stagger — flagged directly as not matching the
 * homepage). Only the section-level copy/CTA stays local to this page.
 */
export default function DeliveryModelsStrip() {
  return (
    <div className="bg-light-surface p-3 sm:p-4">
      <section className="theme-light relative overflow-hidden rounded-[32px] bg-canvas py-14 lg:py-20" aria-labelledby="models-heading">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <SectionEyebrow>How we work</SectionEyebrow>
                <SectionTitle id="models-heading">Delivered through proven working models</SectionTitle>
                <SectionDescription className="mt-3 max-w-md">
                  Every case study above is tied to one of these delivery systems — choose how you want to work.
                </SectionDescription>
              </div>
              <Link
                href="/engagement"
                className="inline-flex w-fit items-center gap-2 rounded-full bg-aurora-violet px-6 py-3 font-urbanist text-sm font-semibold text-white transition-[background-color,transform] duration-300 hover:scale-[1.02] hover:bg-aurora-violet-dark"
              >
                Explore How We Work
                <ArrowRight size={15} strokeWidth={1.75} />
              </Link>
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
    </div>
  );
}
