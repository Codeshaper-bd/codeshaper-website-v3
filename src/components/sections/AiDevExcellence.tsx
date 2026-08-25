"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, ClipboardList, Code2, ShieldCheck, Rocket, type LucideIcon } from "lucide-react";
import Reveal from "@/components/system/Reveal";

/**
 * AI-Driven Development — after Tech Stack, before AiSpotlight. Modeled
 * structurally on the two references (a phase-by-phase flow, and an
 * icon+title+description row layout), but deliberately not on their
 * content: brainstation-23.com's version leads with specific numbers
 * ("70% Faster Development", "99.9% Defect-Free Releases") that are
 * another company's own unverified marketing claims — copying them as
 * if they were Codeshaper's real, measured numbers would be exactly the
 * kind of fabricated stat this project has avoided everywhere else.
 *
 * Instead this maps AI assistance onto the delivery process that
 * already exists for real in DeliverySystem.tsx (Kickoff → Plan → Build
 * → Demo → Release) rather than inventing a separate framework — same
 * phase names (Plan/Build/Release) plus Test, which DeliverySystem
 * already lists as a real standard ("QA gates") without its own step.
 * Descriptions are honest capability statements, not numbers.
 *
 * Kept as a plain light section (no floating-card frame) since it sits
 * between two sections that already use that treatment (Testimonials,
 * Tech Stack) — a third in a row would start feeling repetitive.
 *
 * The "cool" element is a slow pulsing ring behind each phase's icon
 * (`.ai-pulse` in globals.css, using the same color-mix(var(...)) glow
 * technique already used for the tech tile hover glow) — a quiet
 * "actively working" cue rather than a literal animated diagram, plus
 * the usual hover lift + accent-tinted shadow already used elsewhere.
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

export default function AiDevExcellence() {
  return (
    <section className="theme-light relative bg-light-surface py-16 lg:py-20" aria-labelledby="ai-dev-heading">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 inline-flex items-center gap-2.5 font-urbanist text-[11px] font-medium uppercase tracking-[0.28em] text-ink-dim">
                <span className="h-1.5 w-1.5 rounded-full bg-aurora-amber" />
                AI-Driven Development
              </p>
              <h2 id="ai-dev-heading" className="max-w-2xl font-urbanist text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
                The same delivery system — AI-assisted at every phase.
              </h2>
            </div>
            <p className="max-w-sm font-urbanist text-[15px] leading-relaxed text-ink-dim">
              Plan, build, test, release — each phase gets an AI-assisted lane, with people still reviewing the decisions that matter.
            </p>
          </div>
        </Reveal>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PHASES.map((p, i) => {
            const Icon = p.icon;
            return (
              <li key={p.phase}>
                <Reveal delay={i * 80} className="h-full">
                  <article
                    className="group flex h-full flex-col rounded-[28px] border border-hairline bg-[#fafafa] p-7 transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1.5 hover:border-aurora-violet/20 hover:shadow-[0_28px_60px_var(--card-glow)]"
                    style={{ "--card-glow": `${p.accent}26` } as CSSProperties}
                  >
                    <div className="relative flex h-14 w-14 items-center justify-center">
                      <span aria-hidden className="ai-pulse absolute inset-0 rounded-full" style={{ "--pulse-color": p.accent } as CSSProperties} />
                      <span className="mega-icon-tile relative flex h-14 w-14 items-center justify-center rounded-2xl" style={{ color: p.accent }}>
                        <Icon size={22} strokeWidth={1.75} />
                      </span>
                    </div>

                    <p className="mt-5 font-urbanist text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: p.accent }}>
                      {p.phase}
                    </p>
                    <h3 className="mt-1.5 font-urbanist text-lg font-bold leading-snug text-ink">{p.title}</h3>
                    <p className="mt-2.5 flex-1 font-urbanist text-[13.5px] leading-relaxed text-ink-dim">{p.description}</p>
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ul>

        <Reveal delay={200}>
          <div className="mt-10 flex flex-col items-start justify-between gap-5 border-t border-hairline pt-8 sm:flex-row sm:items-center">
            <p className="max-w-lg font-urbanist text-sm leading-relaxed text-ink-dim">
              This is the same process already used on every project — AI speeds up the repeatable parts so the team spends more time on the decisions that need judgment.
            </p>
            <Link
              href="/services/ai"
              className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-aurora-violet px-7 py-3.5 font-urbanist text-sm font-semibold text-white transition-[background-color,transform] duration-300 hover:scale-[1.02] hover:bg-aurora-violet-dark"
            >
              Explore AI &amp; Automation
              <ArrowRight size={15} strokeWidth={1.75} />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
