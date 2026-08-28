"use client";

import { useEffect, useState, type CSSProperties } from "react";
import {
  ClipboardList,
  Code2,
  ShieldCheck,
  Rocket,
  Cpu,
  Bot,
  User,
  FileSearch,
  MessageSquare,
  ListChecks,
  Braces,
  GitPullRequest,
  CheckCircle2,
  TestTube2,
  Bug,
  ClipboardCheck,
  GitBranch,
  RotateCcw,
  Clock,
  type LucideIcon,
} from "lucide-react";
import Reveal from "@/components/system/Reveal";
import CountUp from "@/components/system/CountUp";
import { SectionEyebrow, SectionTitle, SectionDescription } from "@/components/system/SectionHeading";
import { usePrefersReducedMotion } from "@/lib/motion";
import { textSafeAccent } from "@/lib/color";

/**
 * AI-Driven Development — round 5. Direct feedback on round 4:
 *  - Still didn't like the dark panel after round 4 swapped flat black
 *    for a dark violet gradient — round 5 drops the dark treatment
 *    entirely. This is the only homepage section other than Locations
 *    that wasn't the shared light floating-card look (bg-canvas, border-
 *    hairline, soft shadow) every other section uses, so it's brought in
 *    line with that instead of trying a third dark variant. The diagram/
 *    badges/text all get light-mode colors (dark strokes and ink/ink-dim
 *    text instead of white), and since the whole section already carries
 *    `theme-light`, `--color-ink` resolves to its normal near-black value
 *    on its own now — no more local override needed to keep the core
 *    badge and `.ai-core-ring` mask in sync with the background.
 *  - Stat row was three bare text columns with a top divider — no card,
 *    nothing to "stand out." Rebuilt as three accent-colored cards (each
 *    phase-family hue, bordered, radial wash, hover lift), same recipe
 *    AboutStudio's stat chips use.
 *  - Dropped the em dash from the subtitle and the Plan phase's
 *    description, and rewrote the subtitle to be a concrete claim rather
 *    than a fragment.
 *  - The AI↔Human connector's traveling dot now runs Human → AI (was
 *    AI → Human) — `GlowLine` takes a `reverseMotion` flag that replays
 *    the same curve backwards for the animated dot without changing the
 *    static line's shape.
 *
 * Round 6: round 5's light-card wrapper (rounded, bordered, shadowed —
 * the same recipe as Services/AboutStudio's panels) was itself rejected
 * per direct request. The diagram and phase switcher were moved onto the
 * section's own bg-light-surface with no wrapping card at all.
 *
 * Round 7: with no card AND no background distinction, that same block
 * read as bare/unfinished (nothing wrong per se, just no reason for the
 * eye to group the diagram + switcher as one composed thing) — user's
 * own call, from a set of options, was a flat tinted panel: a slightly
 * darker grey than the section background, explicitly still no border-
 * radius, no border, no box-shadow, just a plain color block to group
 * the content. Also renamed the eyebrow from "AI-Driven Development" to
 * "AI-Powered Delivery" — the old label implied AI is scoped to
 * engineering specifically, when the diagram (and SERVICE_COLUMNS) cover
 * design, commerce, and websites too, not just development.
 *
 * Round 8: the 3 stats were a single fixed set shown regardless of which
 * phase was active, which made them read as generic filler rather than
 * something the diagram's own interactivity was driving. Each phase now
 * carries its own 3 stats (still PLACEHOLDER dummy numbers, per the same
 * "real numbers land later" direction as before) with a matching icon,
 * and they crossfade alongside the phase title/description in the same
 * `key={active}` block instead of being a separate static row.
 *
 * Round 9: the outer tinted panel from round 7 was still square-cornered
 * (that round's "no radius" only applied while it was still competing
 * with the earlier white-card look) — now that it's an accepted flat
 * panel, it gets the same rounded-[32px] every other section's own
 * panel uses. Title also drops size="lg" for the default size, matching
 * TrustStrip/ServicesShowcase's own SectionTitle usage instead of being
 * one step larger than its neighbors; max-width adjusted to keep the
 * 2-line wrap at the smaller size.
 */
type PhaseStat = { value: number; suffix: string; label: string; icon: LucideIcon };

type Phase = {
  phase: string;
  title: string;
  description: string;
  icon: LucideIcon;
  accent: string;
  stats: [PhaseStat, PhaseStat, PhaseStat];
};

const PHASES: Phase[] = [
  {
    phase: "Plan",
    title: "AI-assisted discovery",
    description: "Turns a rough brief into clear specs, flows, and a backlog the team reviews before anything gets built.",
    icon: ClipboardList,
    accent: "#8a7bff",
    stats: [
      { value: 3, suffix: "x", label: "Faster spec drafts", icon: FileSearch },
      { value: 70, suffix: "%", label: "Less back-and-forth", icon: MessageSquare },
      { value: 100, suffix: "%", label: "Backlog reviewed by the team", icon: ListChecks },
    ],
  },
  {
    phase: "Build",
    title: "AI-assisted engineering",
    description: "Code generation and review speed up implementation without skipping this team's own standards.",
    icon: Code2,
    accent: "#5b9bdb",
    stats: [
      { value: 40, suffix: "%", label: "Less boilerplate", icon: Braces },
      { value: 3, suffix: "x", label: "Faster code reviews", icon: GitPullRequest },
      { value: 99, suffix: "%", label: "Style guide consistency", icon: CheckCircle2 },
    ],
  },
  {
    phase: "Test",
    title: "AI-assisted QA",
    description: "Generated test cases and regression checks catch issues earlier, alongside the QA gates already in place.",
    icon: ShieldCheck,
    accent: "#3fae82",
    stats: [
      { value: 2, suffix: "x", label: "Test coverage", icon: TestTube2 },
      { value: 70, suffix: "%", label: "Faster regression runs", icon: Bug },
      { value: 99, suffix: "%", label: "Critical paths covered", icon: ClipboardCheck },
    ],
  },
  {
    phase: "Release",
    title: "AI-assisted delivery",
    description: "CI/CD pipelines get safer defaults and faster rollbacks, so shipping stays routine instead of risky.",
    icon: Rocket,
    accent: "#d99a4e",
    stats: [
      { value: 70, suffix: "%", label: "Faster delivery", icon: GitBranch },
      { value: 3, suffix: "x", label: "Faster rollbacks", icon: RotateCcw },
      { value: 99, suffix: "%", label: "On-time releases", icon: Clock },
    ],
  },
];

const TOOLS_COUNT = 37; // TECH_STACK.length in TechStack.tsx — keep in sync
const PHASE_COUNT = PHASES.length;

const AI_NODE = { label: "AI", icon: Bot, accent: "#6d8bff", x: 26, y: 16 };
const HUMAN_NODE = { label: "Human", icon: User, accent: "#e0466e", x: 74, y: 16 };
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
function controlPoint(x1: number, y1: number, x2: number, y2: number, bend: number) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  return { cx: mx + (-dy / len) * bend * len, cy: my + (dx / len) * bend * len };
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
  reverseMotion,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  bend: number;
  color: string;
  active: boolean;
  animate: boolean;
  reverseMotion?: boolean;
}) {
  const { cx, cy } = controlPoint(x1, y1, x2, y2, bend);
  const d = `M${x1},${y1} Q${cx},${cy} ${x2},${y2}`;
  const motionD = reverseMotion ? `M${x2},${y2} Q${cx},${cy} ${x1},${y1}` : d;
  return (
    <>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={active ? 0.9 : 0.5}
        strokeOpacity={active ? 0.85 : 0.35}
        strokeLinecap="round"
        style={{ transition: "stroke-width 300ms var(--ease-out-expo), stroke-opacity 300ms var(--ease-out-expo)" }}
      />
      {animate && (
        <circle r={active ? 1.4 : 0.9} fill={color} filter="url(#ai-dev-glow)" opacity={active ? 1 : 0.7}>
          <animateMotion dur={active ? "1.6s" : "2.6s"} repeatCount="indefinite" path={motionD} />
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
        className="relative flex items-center justify-center rounded-full border shadow-sm transition-[transform,background-color,border-color,box-shadow] duration-300"
        style={{
          width: size,
          height: size,
          color: accent,
          borderColor: active ? `${accent}70` : "rgba(11,15,25,0.10)",
          backgroundColor: active ? `${accent}1a` : "#fafafa",
          boxShadow: active ? `0 0 22px ${accent}40` : "0 1px 2px rgba(11,15,25,0.04)",
          transform: active ? "scale(1.12)" : "scale(1)",
        }}
      >
        <Icon size={iconSize} strokeWidth={1.75} />
      </div>
      {label && (
        <span
          className="absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap font-urbanist text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors duration-300"
          style={{ color: active ? accent : "rgba(11,15,25,0.42)" }}
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
        <circle cx={CORE_POS.x} cy={CORE_POS.y} r={ORBIT_R} fill="none" stroke="rgba(11,15,25,0.09)" strokeWidth={0.35} strokeDasharray="0.6 2.2" />
        <GlowLine x1={AI_NODE.x} y1={AI_NODE.y} x2={HUMAN_NODE.x} y2={HUMAN_NODE.y} bend={-0.22} color="#9797a6" active={false} animate={animate} reverseMotion />
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
          <span aria-hidden className="ai-pulse-lg absolute inset-0 rounded-full" style={{ "--pulse-color": "#7c6cff" } as CSSProperties} />
          <span className="relative flex h-14 w-14 items-center justify-center rounded-full border border-hairline bg-ink text-white shadow-[0_10px_28px_rgba(11,15,25,0.22)]">
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
              <SectionEyebrow>AI-Powered Delivery</SectionEyebrow>
              <SectionTitle id="ai-dev-heading" className="max-w-md">
                AI and people, working the same pipeline.
              </SectionTitle>
            </div>
            <SectionDescription className="max-w-xs">
              {TOOLS_COUNT} tools support {PHASE_COUNT} AI-assisted phases, the same process behind every project we ship.
            </SectionDescription>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="relative mt-10 overflow-hidden rounded-[32px] bg-[#eeeeec] p-6 sm:p-8 lg:p-10">
            <div aria-hidden className="pointer-events-none absolute inset-0 opacity-70">
              <div
                className="absolute -left-16 -top-16 h-64 w-64 rounded-full blur-3xl"
                style={{ background: "radial-gradient(closest-side, rgba(124,108,255,0.12), transparent)" }}
              />
              <div
                className="absolute -bottom-20 -right-10 h-72 w-72 rounded-full blur-3xl"
                style={{ background: "radial-gradient(closest-side, rgba(91,155,219,0.10), transparent)" }}
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
                          borderColor: isActive ? `${p.accent}80` : "var(--color-hairline)",
                          backgroundColor: isActive ? `${p.accent}1a` : "transparent",
                          color: isActive ? textSafeAccent(p.accent) : "var(--color-ink-dim)",
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
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: `${activePhase.accent}1a`, color: activePhase.accent }}>
                      <ActiveIcon size={18} strokeWidth={1.75} />
                    </span>
                    <h3 className="font-urbanist text-lg font-bold leading-snug text-ink">{activePhase.title}</h3>
                  </div>
                  <p className="mt-3 max-w-md font-urbanist text-[14px] leading-relaxed text-ink-dim">{activePhase.description}</p>

                  <div className="mt-7 grid grid-cols-3 gap-3">
                    {activePhase.stats.map((s) => {
                      const StatIcon = s.icon;
                      return (
                        <div
                          key={s.label}
                          className="group relative overflow-hidden rounded-2xl border border-hairline bg-[#fafafa] p-3.5 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_var(--stat-glow)] sm:p-4"
                          style={{ "--stat-glow": `${activePhase.accent}22` } as CSSProperties}
                        >
                          <div
                            aria-hidden
                            className="pointer-events-none absolute inset-0 opacity-[0.06] transition-opacity duration-300 group-hover:opacity-[0.1]"
                            style={{ background: `radial-gradient(circle at 85% 0%, ${activePhase.accent}, transparent 65%)` }}
                          />
                          <span
                            className="relative z-10 flex h-8 w-8 items-center justify-center rounded-lg"
                            style={{ backgroundColor: `${activePhase.accent}1a`, color: activePhase.accent }}
                          >
                            <StatIcon size={15} strokeWidth={1.75} />
                          </span>
                          <p className="relative z-10 mt-2.5 font-urbanist text-xl font-bold tracking-tight sm:text-2xl" style={{ color: activePhase.accent }}>
                            <CountUp value={s.value} suffix={s.suffix} />
                          </p>
                          <p className="relative z-10 mt-1 font-urbanist text-[11px] leading-snug text-ink-dim">{s.label}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
