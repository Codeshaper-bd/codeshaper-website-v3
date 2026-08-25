"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, ClipboardList, Code2, ShieldCheck, Rocket, Cpu, type LucideIcon } from "lucide-react";
import Reveal from "@/components/system/Reveal";

/**
 * AI-Driven Development — redesign after direct feedback that the first
 * pass (a plain 4-card grid) "looked common." Two changes address that:
 *
 * 1. A visual centerpiece instead of a stock photo. The brainstation-23
 *    reference uses a literal robot photo; we have no such photography,
 *    and a random Picsum placeholder (fine for a generic "team at work"
 *    filler elsewhere) would land on an arbitrary, unrelated image here
 *    since Picsum can't target "robot" — worse than no image. Built a
 *    hub-and-spoke SVG diagram instead: a pulsing "AI core" node with
 *    animated flow-lines out to each phase's own icon, in this site's
 *    own monochrome+accent language rather than a mismatched photo.
 *
 * 2. The 4 phases moved from bordered cards to a divided editorial list
 *    (border-hairline rows, no boxes) — paired with the visual + two
 *    honest stats, this reads as one composed layout instead of another
 *    card grid, which is what actually made the first pass feel generic.
 *
 * Stats are real, countable facts about this site, not outcome claims:
 * 37 matches TECH_STACK.length in TechStack.tsx (update together if
 * that list changes), and 4 is just PHASES.length below. No performance
 * percentages — see the original file-header note on why the reference's
 * own numbers ("70% Faster Development", etc.) were never carried over.
 */
type Phase = {
  phase: string;
  title: string;
  description: string;
  icon: LucideIcon;
  accent: string;
};

const PHASES: Phase[] = [
  {
    phase: "Plan",
    title: "AI-assisted discovery",
    description: "Turns a rough brief into clear specs, flows, and a backlog faster — reviewed by the team before anything gets built.",
    icon: ClipboardList,
    accent: "#7c6cff",
  },
  {
    phase: "Build",
    title: "AI-assisted engineering",
    description: "Code generation and review speed up implementation without skipping this team's own standards.",
    icon: Code2,
    accent: "#5b9bdb",
  },
  {
    phase: "Test",
    title: "AI-assisted QA",
    description: "Generated test cases and regression checks catch issues earlier, alongside the QA gates already in place.",
    icon: ShieldCheck,
    accent: "#3fae82",
  },
  {
    phase: "Release",
    title: "AI-assisted delivery",
    description: "CI/CD pipelines get safer defaults and faster rollbacks, so shipping stays routine instead of risky.",
    icon: Rocket,
    accent: "#d99a4e",
  },
];

/** Corner positions for the 4 satellite nodes, as percentages of the panel. */
const NODE_POSITIONS = [
  { x: 22, y: 22 },
  { x: 78, y: 22 },
  { x: 22, y: 78 },
  { x: 78, y: 78 },
];

function AiCoreVisual() {
  return (
    <div className="relative aspect-square w-full max-w-[360px] overflow-hidden rounded-[32px] bg-ink">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.1),transparent_60%)]" />

      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
        {NODE_POSITIONS.map((pos, i) => (
          <line
            key={i}
            x1="50"
            y1="50"
            x2={pos.x}
            y2={pos.y}
            stroke={PHASES[i].accent}
            strokeOpacity="0.4"
            strokeWidth="0.5"
            strokeDasharray="2.2 2.2"
            className="ai-flow-line"
          />
        ))}
      </svg>

      {PHASES.map((p, i) => {
        const Icon = p.icon;
        const pos = NODE_POSITIONS[i];
        return (
          <div key={p.phase} className="absolute" style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: "translate(-50%, -50%)" }}>
            <span
              aria-hidden
              className="ai-pulse absolute inset-0 rounded-full"
              style={{ "--pulse-color": p.accent } as CSSProperties}
            />
            <span
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.08] backdrop-blur-sm"
              style={{ color: p.accent }}
            >
              <Icon size={17} strokeWidth={1.75} />
            </span>
          </div>
        );
      })}

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <span aria-hidden className="ai-pulse-lg absolute inset-0 rounded-full" style={{ "--pulse-color": "#ffffff" } as CSSProperties} />
        <span className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white/25 bg-white/[0.12] text-white shadow-[0_0_40px_rgba(255,255,255,0.15)]">
          <Cpu size={30} strokeWidth={1.5} />
        </span>
      </div>
    </div>
  );
}

export default function AiDevExcellence() {
  return (
    <section className="theme-light relative bg-light-surface py-16 lg:py-20" aria-labelledby="ai-dev-heading">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <p className="mb-3 inline-flex items-center gap-2.5 font-urbanist text-[11px] font-medium uppercase tracking-[0.28em] text-ink-dim">
            <span className="h-1.5 w-1.5 rounded-full bg-aurora-amber" />
            AI-Driven Development
          </p>
          <h2 id="ai-dev-heading" className="max-w-2xl font-urbanist text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
            The same delivery system — AI-assisted at every phase.
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-12 lg:grid-cols-[360px_1fr] lg:gap-16">
          <Reveal delay={80}>
            <div className="flex flex-col items-start">
              <AiCoreVisual />

              <div className="mt-7 flex gap-8">
                <div>
                  <p className="font-urbanist text-3xl font-bold tracking-tight text-ink">37</p>
                  <p className="mt-1 font-urbanist text-[12.5px] leading-snug text-ink-dim">Tools in our stack</p>
                </div>
                <div>
                  <p className="font-urbanist text-3xl font-bold tracking-tight text-ink">4</p>
                  <p className="mt-1 font-urbanist text-[12.5px] leading-snug text-ink-dim">AI-assisted phases</p>
                </div>
              </div>

              <Link
                href="/services/ai"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-aurora-violet px-7 py-3.5 font-urbanist text-sm font-semibold text-white transition-[background-color,transform] duration-300 hover:scale-[1.02] hover:bg-aurora-violet-dark"
              >
                Explore AI &amp; Automation
                <ArrowRight size={15} strokeWidth={1.75} />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={160}>
            <div className="divide-y divide-hairline">
              {PHASES.map((p) => {
                const Icon = p.icon;
                return (
                  <div key={p.phase} className="group flex items-start gap-5 py-6 first:pt-0">
                    <span className="mega-icon-tile flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110" style={{ color: p.accent }}>
                      <Icon size={20} strokeWidth={1.75} />
                    </span>
                    <div>
                      <p className="font-urbanist text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: p.accent }}>
                        {p.phase}
                      </p>
                      <h3 className="mt-1.5 font-urbanist text-lg font-bold leading-snug text-ink">{p.title}</h3>
                      <p className="mt-1.5 max-w-xl font-urbanist text-[13.5px] leading-relaxed text-ink-dim">{p.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="mt-6 font-urbanist text-[13px] leading-relaxed text-ink-faint">
              This is the same process used on every project — AI speeds up the repeatable parts so the team spends more time on the decisions that need judgment.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
