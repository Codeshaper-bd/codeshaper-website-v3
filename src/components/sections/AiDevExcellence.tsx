"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, ClipboardList, Code2, ShieldCheck, Rocket, Cpu, Bot, User, type LucideIcon } from "lucide-react";
import Reveal from "@/components/system/Reveal";
import CountUp from "@/components/system/CountUp";
import { usePrefersReducedMotion } from "@/lib/motion";

/**
 * AI-Driven Development — round 3. Feedback: the section had grown too
 * tall (visual + a full-width stat band + a full-width phase row, each
 * with its own vertical rhythm), and the animation ("dashed lines +
 * floating icons") read as basic rather than modern/interactive.
 *
 * Consolidated everything into ONE panel: a compact diagram next to an
 * interactive phase switcher (tabs crossfade the description via
 * .lens-fade-in, and highlight the matching path/node in the diagram —
 * same "hover to spotlight" idea as TechStack's board, applied here via
 * React state instead of :has() since the trigger and target are two
 * different subtrees). Idles into a slow auto-cycle so it reads as alive
 * without anyone touching it; hovering the tab row pauses it, clicking
 * pins a choice. Traveling glow dots (blurred SVG circles) replace the
 * dashed connector animation — solid lines read calmer/more premium than
 * a technical-diagram dash crawl.
 *
 * PLACEHOLDER_STATS are still dummy values per explicit request ("use
 * dummy number and later I will update them with my real numbers") —
 * kept separate from the honest 37/4 counts (TECH_STACK.length /
 * PHASES.length) in the caption below the panel.
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

const AI_NODE = { label: "AI", icon: Bot, accent: "#9db8ff", x: 26, y: 14 };
const HUMAN_NODE = { label: "Human", icon: User, accent: "#e8637e", x: 74, y: 14 };
const CORE_POS = { x: 50, y: 42 };
const PHASE_POS = [
  { x: 12, y: 78 },
  { x: 37.3, y: 78 },
  { x: 62.6, y: 78 },
  { x: 88, y: 78 },
];

function GlowLine({
  x1,
  y1,
  x2,
  y2,
  color,
  active,
  animate,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  active: boolean;
  animate: boolean;
}) {
  return (
    <>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={active ? 0.9 : 0.5}
        strokeOpacity={active ? 0.75 : 0.22}
        style={{ transition: "stroke-width 400ms ease, stroke-opacity 400ms ease" }}
      />
      {animate && (
        <circle r={active ? 1.4 : 0.9} fill={color} filter="url(#ai-dev-glow)" opacity={active ? 1 : 0.55}>
          <animateMotion dur={active ? "1.6s" : "2.6s"} repeatCount="indefinite" path={`M${x1},${y1} L${x2},${y2}`} />
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
  active,
}: {
  x: number;
  y: number;
  size: number;
  iconSize: number;
  accent: string;
  icon: LucideIcon;
  label?: string;
  active?: boolean;
}) {
  return (
    <div
      className="absolute"
      style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
    >
      <div
        className="relative flex items-center justify-center rounded-full border backdrop-blur-sm transition-[transform,background-color,border-color,box-shadow] duration-400"
        style={{
          width: size,
          height: size,
          color: accent,
          borderColor: active ? `${accent}66` : "rgba(255,255,255,0.14)",
          backgroundColor: active ? `${accent}22` : "rgba(255,255,255,0.06)",
          boxShadow: active ? `0 0 24px ${accent}55` : "none",
          transform: active ? "scale(1.12)" : "scale(1)",
        }}
      >
        <Icon size={iconSize} strokeWidth={1.75} />
      </div>
      {label && (
        <span
          className="absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap font-urbanist text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors duration-300"
          style={{ color: active ? accent : "rgba(255,255,255,0.45)" }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

function AiHumanDiagram({ activeIndex }: { activeIndex: number }) {
  const reduced = usePrefersReducedMotion();
  const animate = !reduced;

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[300px]">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <filter id="ai-dev-glow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="1.1" />
          </filter>
        </defs>
        <GlowLine x1={AI_NODE.x} y1={AI_NODE.y} x2={HUMAN_NODE.x} y2={HUMAN_NODE.y} color="#ffffff" active={false} animate={animate} />
        <GlowLine x1={AI_NODE.x} y1={AI_NODE.y} x2={CORE_POS.x} y2={CORE_POS.y} color={AI_NODE.accent} active={false} animate={animate} />
        <GlowLine x1={HUMAN_NODE.x} y1={HUMAN_NODE.y} x2={CORE_POS.x} y2={CORE_POS.y} color={HUMAN_NODE.accent} active={false} animate={animate} />
        {PHASE_POS.map((pos, i) => (
          <GlowLine
            key={i}
            x1={CORE_POS.x}
            y1={CORE_POS.y}
            x2={pos.x}
            y2={pos.y}
            color={PHASES[i].accent}
            active={i === activeIndex}
            animate={animate}
          />
        ))}
      </svg>

      <NodeBadge x={AI_NODE.x} y={AI_NODE.y} size={44} iconSize={17} accent={AI_NODE.accent} icon={AI_NODE.icon} label={AI_NODE.label} />
      <NodeBadge x={HUMAN_NODE.x} y={HUMAN_NODE.y} size={44} iconSize={17} accent={HUMAN_NODE.accent} icon={HUMAN_NODE.icon} label={HUMAN_NODE.label} />

      <div className="absolute" style={{ left: `${CORE_POS.x}%`, top: `${CORE_POS.y}%`, transform: "translate(-50%, -50%)" }}>
        <div className="relative">
          {animate && <div className="ai-core-ring absolute -inset-1.5 rounded-full p-px" />}
          <span aria-hidden className="ai-pulse-lg absolute inset-0 rounded-full" style={{ "--pulse-color": "#ffffff" } as CSSProperties} />
          <span className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/25 bg-ink text-white shadow-[0_0_30px_rgba(255,255,255,0.18)]">
            <Cpu size={22} strokeWidth={1.5} />
          </span>
        </div>
      </div>

      {PHASES.map((p, i) => {
        const pos = PHASE_POS[i];
        return (
          <NodeBadge
            key={p.phase}
            x={pos.x}
            y={pos.y}
            size={38}
            iconSize={15}
            accent={p.accent}
            icon={p.icon}
            label={p.phase}
            active={i === activeIndex}
          />
        );
      })}
    </div>
  );
}

export default function AiDevExcellence() {
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const [autoPaused, setAutoPaused] = useState(false);

  useEffect(() => {
    if (reduced || autoPaused) return;
    const id = setInterval(() => setActive((a) => (a + 1) % PHASES.length), 3800);
    return () => clearInterval(id);
  }, [reduced, autoPaused]);

  const activePhase = PHASES[active];
  const ActiveIcon = activePhase.icon;

  return (
    <section className="theme-light relative bg-light-surface py-14 lg:py-16" aria-labelledby="ai-dev-heading">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <p className="mb-3 inline-flex items-center gap-2.5 font-urbanist text-[11px] font-medium uppercase tracking-[0.28em] text-ink-dim">
            <span className="h-1.5 w-1.5 rounded-full bg-aurora-amber" />
            AI-Driven Development
          </p>
          <h2 id="ai-dev-heading" className="max-w-2xl font-urbanist text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
            AI and people, working the same pipeline.
          </h2>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-8 overflow-hidden rounded-[32px] bg-ink p-6 sm:p-8 lg:p-10">
            <div className="grid gap-10 lg:grid-cols-[300px_1fr] lg:items-center lg:gap-14">
              <AiHumanDiagram activeIndex={active} />

              <div>
                <div
                  className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap"
                  onMouseEnter={() => setAutoPaused(true)}
                  onMouseLeave={() => setAutoPaused(false)}
                >
                  {PHASES.map((p, i) => {
                    const Icon = p.icon;
                    const isActive = i === active;
                    return (
                      <button
                        key={p.phase}
                        type="button"
                        onMouseEnter={() => setActive(i)}
                        onFocus={() => setActive(i)}
                        onClick={() => {
                          setActive(i);
                          setAutoPaused(true);
                        }}
                        className="flex items-center justify-center gap-2 rounded-full border px-4 py-2 font-urbanist text-[13px] font-semibold transition-[background-color,border-color,color] duration-300 sm:justify-start"
                        style={{
                          borderColor: isActive ? `${p.accent}80` : "rgba(255,255,255,0.12)",
                          backgroundColor: isActive ? `${p.accent}1f` : "transparent",
                          color: isActive ? p.accent : "rgba(255,255,255,0.55)",
                        }}
                      >
                        <Icon size={15} strokeWidth={1.75} />
                        {p.phase}
                      </button>
                    );
                  })}
                </div>

                <div key={active} className="lens-fade-in mt-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: `${activePhase.accent}1f`, color: activePhase.accent }}>
                      <ActiveIcon size={18} strokeWidth={1.75} />
                    </span>
                    <h3 className="font-urbanist text-lg font-bold leading-snug text-white">{activePhase.title}</h3>
                  </div>
                  <p className="mt-3 max-w-md font-urbanist text-[14px] leading-relaxed text-white/55">{activePhase.description}</p>
                </div>

                <div className="mt-7 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/10 pt-6">
                  {PLACEHOLDER_STATS.map((s) => (
                    <div key={s.label}>
                      <p className="font-urbanist text-2xl font-bold tracking-tight text-white sm:text-[28px]">
                        <CountUp value={s.value} suffix={s.suffix} />
                      </p>
                      <p className="mt-1 font-urbanist text-[11.5px] leading-snug text-white/45">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={140}>
          <div className="mt-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
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
