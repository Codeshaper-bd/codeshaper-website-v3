"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, ClipboardList, Code2, ShieldCheck, Rocket, Cpu, Bot, User, type LucideIcon } from "lucide-react";
import Reveal from "@/components/system/Reveal";
import CountUp from "@/components/system/CountUp";
import { usePrefersReducedMotion } from "@/lib/motion";

/**
 * AI-Driven Development — round 2 redesign. Feedback asked for three
 * things: (1) make the concept explicit — "AI with human make the
 * process faster" — (2) more animation/impact, (3) big brainstation-style
 * stat numbers.
 *
 * (1) The visual is now a converging diagram: an "AI" node and a "Human"
 * node feed into one core, which fans out to the 4 delivery phases —
 * literally depicting AI + human collaboration driving the pipeline,
 * rather than an abstract "AI core" alone.
 *
 * (2) Added: floating bob on every node (staggered delay so they're not
 * synced), a traveling particle on every connector line on top of the
 * existing dashed flow animation, and count-up numbers on scroll.
 *
 * (3) PLACEHOLDER_STATS below are dummy numbers, per explicit request
 * ("use dummy number and later I will update them with my real
 * numbers" — 2026-08-25). Unlike the 37/4 counts (real, derived from
 * TECH_STACK.length and PHASES.length), these are NOT verified facts —
 * swap them for real figures before this ships.
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

/** PLACEHOLDER — dummy values, to be replaced with real measured numbers. */
const PLACEHOLDER_STATS: { value: number; suffix: string; label: string }[] = [
  { value: 70, suffix: "%", label: "Faster delivery" },
  { value: 3, suffix: "x", label: "Faster reviews" },
  { value: 99, suffix: "%", label: "On-time releases" },
];

const TOOLS_COUNT = 37; // TECH_STACK.length in TechStack.tsx — keep in sync
const PHASE_COUNT = PHASES.length;

const AI_NODE = { label: "AI", icon: Bot, accent: "#9db8ff", x: 22.5, y: 20 };
const HUMAN_NODE = { label: "Human", icon: User, accent: "#e8637e", x: 77.5, y: 20 };
const CORE_POS = { x: 50, y: 46 };
const PHASE_POS = [
  { x: 8.75, y: 72 },
  { x: 36.25, y: 72 },
  { x: 63.75, y: 72 },
  { x: 91.25, y: 72 },
];

function FlowLine({ x1, y1, x2, y2, color, animateParticle }: { x1: number; y1: number; x2: number; y2: number; color: string; animateParticle: boolean }) {
  return (
    <>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeOpacity="0.4" strokeWidth="0.6" strokeDasharray="2.4 2.4" className="ai-flow-line" />
      {animateParticle && (
        <circle r="1.1" fill={color}>
          <animateMotion dur="2.4s" repeatCount="indefinite" path={`M${x1},${y1} L${x2},${y2}`} />
        </circle>
      )}
    </>
  );
}

function NodeBadge({
  x,
  y,
  size,
  iconSize,
  accent,
  icon: Icon,
  label,
  floatDelay,
  animate,
}: {
  x: number;
  y: number;
  size: number;
  iconSize: number;
  accent: string;
  icon: LucideIcon;
  label?: string;
  floatDelay: number;
  animate: boolean;
}) {
  return (
    <div className="absolute" style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}>
      <div className={animate ? "ai-node-float relative" : "relative"} style={{ animationDelay: `${floatDelay}s` }}>
        <span aria-hidden className="ai-pulse absolute inset-0 rounded-full" style={{ "--pulse-color": accent } as CSSProperties} />
        <span
          className="relative flex items-center justify-center rounded-full border border-white/15 bg-white/[0.08] backdrop-blur-sm"
          style={{ width: size, height: size, color: accent }}
        >
          <Icon size={iconSize} strokeWidth={1.75} />
        </span>
        {label && (
          <span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap font-urbanist text-[10.5px] font-semibold uppercase tracking-[0.16em] text-white/60">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}

function AiHumanVisual() {
  const reduced = usePrefersReducedMotion();
  const animate = !reduced;

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[32px] bg-ink">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(255,255,255,0.1),transparent_60%)]" />

      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
        <FlowLine x1={AI_NODE.x} y1={AI_NODE.y} x2={HUMAN_NODE.x} y2={HUMAN_NODE.y} color="#ffffff" animateParticle={animate} />
        <FlowLine x1={AI_NODE.x} y1={AI_NODE.y} x2={CORE_POS.x} y2={CORE_POS.y} color={AI_NODE.accent} animateParticle={animate} />
        <FlowLine x1={HUMAN_NODE.x} y1={HUMAN_NODE.y} x2={CORE_POS.x} y2={CORE_POS.y} color={HUMAN_NODE.accent} animateParticle={animate} />
        {PHASE_POS.map((pos, i) => (
          <FlowLine key={i} x1={CORE_POS.x} y1={CORE_POS.y} x2={pos.x} y2={pos.y} color={PHASES[i].accent} animateParticle={animate} />
        ))}
      </svg>

      <NodeBadge x={AI_NODE.x} y={AI_NODE.y} size={52} iconSize={20} accent={AI_NODE.accent} icon={AI_NODE.icon} label={AI_NODE.label} floatDelay={0} animate={animate} />
      <NodeBadge x={HUMAN_NODE.x} y={HUMAN_NODE.y} size={52} iconSize={20} accent={HUMAN_NODE.accent} icon={HUMAN_NODE.icon} label={HUMAN_NODE.label} floatDelay={0.6} animate={animate} />

      <div className="absolute" style={{ left: `${CORE_POS.x}%`, top: `${CORE_POS.y}%`, transform: "translate(-50%, -50%)" }}>
        <span aria-hidden className="ai-pulse-lg absolute inset-0 rounded-full" style={{ "--pulse-color": "#ffffff" } as CSSProperties} />
        <span className="relative flex h-16 w-16 items-center justify-center rounded-full border border-white/25 bg-white/[0.12] text-white shadow-[0_0_40px_rgba(255,255,255,0.15)]">
          <Cpu size={24} strokeWidth={1.5} />
        </span>
      </div>

      {PHASES.map((p, i) => {
        const pos = PHASE_POS[i];
        return (
          <NodeBadge
            key={p.phase}
            x={pos.x}
            y={pos.y}
            size={44}
            iconSize={17}
            accent={p.accent}
            icon={p.icon}
            label={p.phase}
            floatDelay={1.1 + i * 0.3}
            animate={animate}
          />
        );
      })}
    </div>
  );
}

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
                AI and people, working the same pipeline.
              </h2>
            </div>
            <p className="max-w-sm font-urbanist text-[15px] leading-relaxed text-ink-dim">
              AI speeds up every phase; people still make the calls that matter — that pairing is what makes the process faster without cutting corners.
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-10">
            <AiHumanVisual />
          </div>
        </Reveal>

        <Reveal delay={140}>
          <div className="mt-10 grid grid-cols-1 gap-8 border-y border-hairline py-8 sm:grid-cols-3">
            {PLACEHOLDER_STATS.map((s) => (
              <div key={s.label} className="text-center sm:border-l sm:border-hairline sm:first:border-l-0">
                <p className="font-urbanist text-4xl font-bold tracking-tight text-ink sm:text-5xl">
                  <CountUp value={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-1.5 font-urbanist text-[13px] leading-snug text-ink-dim">{s.label}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-hairline">
            {PHASES.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.phase} className="lg:px-6 lg:first:pl-0">
                  <span className="mega-icon-tile flex h-11 w-11 items-center justify-center rounded-2xl" style={{ color: p.accent }}>
                    <Icon size={18} strokeWidth={1.75} />
                  </span>
                  <p className="mt-4 font-urbanist text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: p.accent }}>
                    {p.phase}
                  </p>
                  <h3 className="mt-1.5 font-urbanist text-base font-bold leading-snug text-ink">{p.title}</h3>
                  <p className="mt-1.5 font-urbanist text-[13px] leading-relaxed text-ink-dim">{p.description}</p>
                </div>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={260}>
          <div className="mt-10 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
            <p className="font-urbanist text-[13px] text-ink-faint">
              {TOOLS_COUNT} tools across {PHASE_COUNT} AI-assisted phases — the same process used on every project.
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
