"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Check, ChevronRight } from "lucide-react";
import Reveal from "@/components/system/Reveal";
import { SectionEyebrow, SectionTitle } from "@/components/system/SectionHeading";
import { ENGAGEMENT_MODEL_CARDS } from "@/lib/engagementModels";
import { AT_A_GLANCE, COMPARISON_TABLE, MODEL_OVERVIEWS } from "@/lib/engagementContent";
import { homeCopy, type CopyOf } from "@/lib/homeCopy";
import DotField from "@/components/sections/human-ai-flow/DotField";

/**
 * Engagement models as a straight comparison (Apple "compare models"
 * pattern): the five models side by side, the facts a buyer actually
 * weighs in rows, typography and hairlines, no decorative colour.
 *
 *  · Desktop: a real <table>; hovering a column tints it so it reads down.
 *  · Below lg: one card per model with the same rows, swiped sideways.
 *  · "Included in every model" closes it with what doesn't change.
 *  · All content comes from lib/engagementContent.ts (the /engagement
 *    comparison data) and lib/engagementModels.ts (icons), so the
 *    homepage can't drift from the hub page.
 */
const MODELS = ENGAGEMENT_MODEL_CARDS.flatMap((card) => {
  const overview = MODEL_OVERVIEWS.find((m) => m.href === card.href);
  const spec = COMPARISON_TABLE.find((r) => r.href === card.href);
  if (!overview || !spec) return []; // not filled in yet in the CMS
  return [{ ...card, overview, spec }];
});
type Model = (typeof MODELS)[number];

/** "Medium–High" → 4 of 5 */
const LEVEL: Record<string, number> = { Low: 1, "Low–Medium": 2, Medium: 3, "Medium–High": 4, High: 5 };

function Involvement({ value }: { value: string }) {
  const n = LEVEL[value] ?? 3;
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="flex gap-1" aria-hidden>
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} className={`h-1.5 w-1.5 rounded-full ${i <= n ? "bg-ink" : "bg-ink/15"}`} />
        ))}
      </span>
      <span>{value}</span>
    </span>
  );
}

const ROWS: { label: string; render: (m: Model) => ReactNode }[] = [
  { label: "Best for", render: (m) => m.spec.bestFor },
  { label: "Starts in", render: (m) => m.spec.speed },
  { label: "Team size", render: (m) => `${m.spec.teamSize} people` },
  { label: "Commitment", render: (m) => m.spec.commitment },
  { label: "Pricing", render: (m) => m.spec.pricing },
  { label: "Your involvement", render: (m) => <Involvement value={m.spec.involvement} /> },
  { label: "Scope", render: (m) => m.spec.certainty },
];

function ModelHead({ m }: { m: Model }) {
  const Icon = m.icon;
  return (
    <>
      <span className="grid h-10 w-10 place-items-center rounded-[11px] border border-[#0b0f19]/[0.07] bg-[#f6f6f4] text-ink">
        <Icon size={18} strokeWidth={1.7} aria-hidden />
      </span>
      <span className="mt-4 block font-urbanist text-[17px] font-semibold leading-snug tracking-[-0.01em] text-ink">{m.name}</span>
      <span className="mt-1.5 block font-urbanist text-[13.5px] font-normal leading-relaxed text-ink-dim">{m.overview.oneLiner}</span>
      <Link
        href={m.href}
        className="mt-3 inline-flex items-center gap-0.5 font-urbanist text-[13.5px] font-semibold text-ink underline-offset-4 hover:underline"
      >
        Learn more
        <ChevronRight size={14} strokeWidth={2} aria-hidden />
        <span className="sr-only"> about {m.name}</span>
      </Link>
    </>
  );
}

export default function EngagementModels({ copy }: { copy?: CopyOf<"engagementModels"> }) {
  const c = homeCopy("engagementModels", copy);
  const [col, setCol] = useState(-1);
  const tint = (i: number) => (i === col ? "bg-[#f7f7f5]" : "");

  return (
    <section className="theme-light relative overflow-clip bg-light-surface py-16 lg:py-24" aria-labelledby="engagement-heading">
      {/* the shared dotted background (as Human + AI), fading out at the top and bottom */}
      <DotField className="[mask-image:linear-gradient(to_bottom,transparent,black_22%,black_78%,transparent)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <Reveal>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <SectionEyebrow>{c.eyebrow}</SectionEyebrow>
              <SectionTitle id="engagement-heading" className="max-w-[16ch] text-balance">
                {c.title}
              </SectionTitle>
            </div>
            <Link
              href="/engagement"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-[#0b0f19] px-5 py-2.5 font-urbanist text-[13px] font-semibold text-white transition-colors hover:bg-[#1f2433]"
            >
              {c.button}
              <ArrowRight size={14} strokeWidth={1.9} aria-hidden />
            </Link>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-10 overflow-hidden rounded-[28px] border border-[#0b0f19]/[0.07] bg-white shadow-[0_1px_2px_rgba(11,15,25,0.03)] lg:mt-14">
            {/* desktop: comparison table */}
            <table className="hidden w-full table-fixed border-collapse text-left lg:table" onMouseLeave={() => setCol(-1)}>
              <caption className="sr-only">Engagement models compared</caption>
              <colgroup>
                <col className="w-[15%]" />
                {MODELS.map((m) => (
                  <col key={m.href} />
                ))}
              </colgroup>
              <thead>
                <tr>
                  <td className="p-0" />
                  {MODELS.map((m, i) => (
                    <th
                      key={m.href}
                      scope="col"
                      onMouseEnter={() => setCol(i)}
                      className={`px-5 pb-7 pt-8 align-top font-normal transition-colors duration-200 ${tint(i)}`}
                    >
                      <ModelHead m={m} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => (
                  <tr key={row.label} className="border-t border-[#0b0f19]/[0.07]">
                    <th scope="row" className="py-4 pl-8 pr-4 align-top font-urbanist text-[13px] font-medium text-ink-dim">
                      {row.label}
                    </th>
                    {MODELS.map((m, i) => (
                      <td
                        key={m.href}
                        onMouseEnter={() => setCol(i)}
                        className={`px-5 py-4 align-top font-urbanist text-[14.5px] font-medium leading-snug text-ink transition-colors duration-200 ${tint(i)}`}
                      >
                        {row.render(m)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* below lg: one card per model, swiped sideways */}
            <ul
              aria-label="Engagement models"
              className="flex snap-x snap-mandatory divide-x divide-[#0b0f19]/[0.07] overflow-x-auto [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden"
            >
              {MODELS.map((m) => (
                <li key={m.href} className="relative w-[84%] shrink-0 snap-start p-6 sm:w-[46%] sm:p-8">
                  <ModelHead m={m} />
                  <dl className="mt-5 divide-y divide-[#0b0f19]/[0.06] border-t border-[#0b0f19]/[0.06]">
                    {ROWS.map((row) => (
                      <div key={row.label} className="flex items-baseline justify-between gap-4 py-3">
                        <dt className="shrink-0 font-urbanist text-[13px] text-ink-dim">{row.label}</dt>
                        <dd className="text-right font-urbanist text-[14px] font-medium text-ink">{row.render(m)}</dd>
                      </div>
                    ))}
                  </dl>
                </li>
              ))}
            </ul>

            {/* what never changes */}
            <div className="border-t border-[#0b0f19]/[0.07] bg-[#fafaf9] px-6 py-6 sm:px-8 lg:flex lg:items-center lg:gap-10">
              <p className="font-urbanist text-[13px] font-semibold text-ink lg:w-[15%] lg:shrink-0">Included in every model</p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:mt-0 lg:flex lg:flex-1 lg:justify-between">
                {AT_A_GLANCE.map((g) => (
                  <li key={g.label} className="flex items-center gap-2 font-urbanist text-[13.5px] text-ink">
                    <Check size={14} strokeWidth={2.4} className="shrink-0" aria-hidden />
                    {g.label === "Start time" ? `Start in ${g.value}` : g.value}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
