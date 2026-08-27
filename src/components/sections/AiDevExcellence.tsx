"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { ClipboardList, Code2, ShieldCheck, Rocket, Cpu, Bot, User, type LucideIcon } from "lucide-react";
import Reveal from "@/components/system/Reveal";
import CountUp from "@/components/system/CountUp";
import { SectionEyebrow, SectionTitle, SectionDescription } from "@/components/system/SectionHeading";
import { usePrefersReducedMotion } from "@/lib/motion";

/**
 * AI-Driven Development — round 4. Direct feedback on round 3:
 *  - Title needs to wrap to 2 lines like the Services heading (size="lg"
 *    + a width constraint that forces the break, instead of the default
 *    md size that mostly sat on one line).
 *  - No CTA button for this section — removed entirely, along with the
 *    bottom caption row it lived in.
 *  - The "37 tools / 4 phases" line moves from that removed bottom row
 *    up into the header as a subtitle (Services/AboutStudio's own
 *    eyebrow+title+description arrangement), not floated at the bottom.
 *  - The flat `bg-ink` panel read as plain black — swapped for the same
 *    dark violet-tinted radial gradient Locations.tsx already uses
 *    (`radial-gradient(... #101024 0%, #0A0A0F ...)`) instead of
 *    inventing an unrelated color. `--color-ink` is overridden locally
 *    on the panel to this new tone (not just the background), because
 *    `.ai-core-ring::after` masks its conic-gradient ring by painting a
 *    solid `var(--color-ink)` disc over the center — scoping the
 *    variable keeps that mask, the core badge, and the panel background
 *    all sourced from one value instead of three separately-maintained
 *    colors that could drift apart.
 *  - The diagram itself ("looks bad") was rebuilt with curved
 *    (quadratic-bezier) connectors instead of rigid straight lines, in a
 *    mirrored fan (AI/Human/phase branches bend outward proportionally
 *    to their distance from center) plus a faint static orbit ring behind
 *    the whole thing for compositional grounding — it no longer floats
 *    in empty space.
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
    accent: "#8a7bff",
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

const AI_NODE = { label: "AI", icon: Bot, accent: "#9db8ff", x: 26, y: 16 };
const HUMAN_NODE = { label: "Human", icon: User, accent: "#e8637e", x: 74, y: 16 };
const CORE_POS = { x: 50, y: 44 };
const PHASE_POS = [
  { x: 12, y: 80 },
  { x: 37.3, y: 80 },
  { x: 62.6, y: 80 },
  { x: 88, y: 80 },
];
const ORBIT_R = 34;

/** Quadratic-bezier control point offset perpendicular to the segment,
 *  scaled by `bend` (signed — direction decides which way the arc bows). */
function curvedPath(x1: number, y1: number, x2: number, y2: number, bend: number) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const cx = mx + (-dy / len) * bend * len;
  const cy = my + (dx / len) * bend * len;
  return `M${x1},${y1} Q${cx},${cy} ${x2},${y2}`;
}

function GlowLine({
  x1,
  y1,
  x2,
  y2,
  bend,
  color,
  active,
  animate,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  bend: number;
  color: string;
  active: boolean;
  animate: boolean;
}) {
  const d = curvedPath(x1, y1, x2, y2, bend);
  return (
    <>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={active ? 0.9 : 0.5}
        strokeOpacity={active ? 0.75 : 0.22}
        strokeLinecap="round"
        style={{ transition: "stroke-width 300ms var(--ease-out-expo), stroke-opacity 300ms var(--ease-out-expo)" }}
      />
      {animate && (
        <circle r={active ? 1.4 : 0.9} fill={color} filter="url(#ai-dev-glow)" opacity={active ? 1 : 0.55}>
          <animateMotion dur={active ? "1.6s" : "2.6s"} repeatCount="indefinite" path={d} />
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
    <div className="absolute" style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}>
      <div
        className="relative flex items-center justify-center rounded-full border backdrop-blur-sm transition-[transform,background-color,border-color,box-shadow] duration-300"
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
    <div className="relative mx-auto aspect-square w-full max-w-[320px]">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <filter id="ai-dev-glow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="1.1" />
          </filter>
        </defs>
        <circle cx={CORE_POS.x} cy={CORE_POS.y} r={ORBIT_R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={0.35} strokeDasharray="0.6 2.2" />
        <GlowLine x1={AI_NODE.x} y1={AI_NODE.y} x2={HUMAN_NODE.x} y2={HUMAN_NODE.y} bend={-0.22} color="#ffffff" active={false} animate={animate} />
        <GlowLine x1={AI_NODE.x} y1={AI_NODE.y} x2={CORE_POS.x} y2={CORE_POS.y} bend={-0.14} color={AI_NODE.accent} active={false} animate={animate} />
        <GlowLine x1={HUMAN_NODE.x} y1={HUMAN_NODE.y} x2={CORE_POS.x} y2={CORE_POS.y} bend={0.14} color={HUMAN_NODE.accent} active={false} animate={animate} />
        {PHASE_POS.map((pos, i) => (
          <GlowLine
            key={i}
            x1={CORE_POS.x}
            y1={CORE_POS.y}
            x2={pos.x}
            y2={pos.y}
            bend={((pos.x - CORE_POS.x) / 38) * 0.16}
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
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <SectionEyebrow>AI-Driven Development</SectionEyebrow>
              <SectionTitle id="ai-dev-heading" size="lg" className="max-w-xl">
                AI and people, working the same pipeline.
              </SectionTitle>
            </div>
            <SectionDescription className="max-w-xs">
              {TOOLS_COUNT} tools across {PHASE_COUNT} AI-assisted phases — the same process used on every project.
            </SectionDescription>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div
            className="relative mt-10 overflow-hidden rounded-[32px] p-6 sm:p-8 lg:p-10"
            style={
              {
                "--color-ink": "#120f22",
                background: "radial-gradient(120% 100% at 22% 0%, #1c1638 0%, #120f22 55%)",
              } as CSSProperties
            }
          >
            <div aria-hidden className="pointer-events-none absolute inset-0 opacity-70">
              <div
                className="absolute -left-16 -top-16 h-64 w-64 rounded-full blur-3xl"
                style={{ background: "radial-gradient(closest-side, rgba(138,123,255,0.16), transparent)" }}
              />
              <div
                className="absolute -bottom-20 -right-10 h-72 w-72 rounded-full blur-3xl"
                style={{ background: "radial-gradient(closest-side, rgba(91,155,219,0.12), transparent)" }}
              />
            </div>

            <div className="relative grid gap-10 lg:grid-cols-[320px_1fr] lg:items-center lg:gap-14">
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
      </div>
    </section>
  );
}
