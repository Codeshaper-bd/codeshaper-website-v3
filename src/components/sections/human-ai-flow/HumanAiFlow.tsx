"use client";

import { useEffect, useRef, useState, type CSSProperties, type MutableRefObject } from "react";
import Image from "next/image";
import { Check, ClipboardList, Code2, Pause, Play, Rocket, ShieldCheck, Sparkles, UserRound, type LucideIcon } from "lucide-react";
import Reveal from "@/components/system/Reveal";
import { SectionEyebrow, SectionTitle, SectionDescription } from "@/components/system/SectionHeading";
import { usePrefersReducedMotion } from "@/lib/motion";
import DotField, { type DotFieldHandle } from "./DotField";

/**
 * Human + AI: a node-flow diagram (node-editor style: card nodes, icon
 * tiles, port dots) on the section's own background.
 *
 *     [AI · drafts and checks]       [Human · decides and approves]
 *                 └──────── (CodeShaper) ────────┘
 *                                │
 *          [Plan] ─── [Build] ─── [Test] ─── [Release]
 *
 *  · Two inputs, two soft colours: AI violet, Human peach. Packets flow
 *    from both into the CodeShaper hub; the hub feeds the active phase,
 *    whose line takes that phase's colour. The right side shows what AI
 *    does and what humans do in that phase.
 *  · Phases cycle while on screen; hover pauses, a click selects and stops,
 *    a pause button is always available (WCAG 2.2.2). SVG animations are
 *    paused while the section is off screen. Reduced motion: no cycling,
 *    no packets, no spinning ring, static dots.
 *  · Background: canvas dot grid (DotField) across the whole section,
 *    masked to fade at top and bottom. Dots wave around the mouse, and a
 *    ripple spreads from a phase whenever it becomes active.
 *  · The diagram is a fixed W×H drawing scaled to its column; when scaled
 *    down a lot its buttons get too small, so a separate phase switcher
 *    takes over (the diagram's own buttons leave the tab order).
 */
type Phase = {
  name: string;
  icon: LucideIcon;
  /** solid accent, soft tint, readable text shade */
  color: { solid: string; tint: string; text: string };
  title: string;
  body: string;
  ai: string[];
  people: string[];
};

const PHASES: Phase[] = [
  {
    name: "Plan",
    icon: ClipboardList,
    color: { solid: "#7c6cff", tint: "#f1eeff", text: "#4b3fb8" },
    title: "Planning with a head start",
    body: "Your brief becomes a clear plan you can react to in days, not weeks.",
    ai: ["Drafts specs and user flows from your brief", "Spots gaps and open questions"],
    people: ["Run the discovery workshop with you", "Decide scope and priorities"],
  },
  {
    name: "Build",
    icon: Code2,
    color: { solid: "#4f9be0", tint: "#eaf3fd", text: "#1d5f9e" },
    title: "Building, reviewed by humans",
    body: "Engineers move faster on the routine parts and spend their time on what makes your product different.",
    ai: ["Writes boilerplate and first drafts of code", "Suggests fixes during review"],
    people: ["Design the architecture", "Review and approve every change"],
  },
  {
    name: "Test",
    icon: ShieldCheck,
    color: { solid: "#34b48a", tint: "#e8f7f0", text: "#17714f" },
    title: "Testing from every angle",
    body: "More scenarios are covered earlier, so problems are found before your customers find them.",
    ai: ["Generates test cases and edge cases", "Runs regression checks on every change"],
    people: ["Test real user journeys by hand", "Decide what is ready to ship"],
  },
  {
    name: "Release",
    icon: Rocket,
    color: { solid: "#f08a3e", tint: "#fff1e8", text: "#a4471a" },
    title: "Releases that stay calm",
    body: "Shipping becomes routine: small, safe releases with a human at the wheel.",
    ai: ["Prepares release notes and rollback plans", "Watches for errors after launch"],
    people: ["Approve each release", "Stay on call in production"],
  },
];

const AI_C = { solid: "#8676ff", line: "#b3a9ff", tint: "#f1eeff", text: "#4b3fb8" };
const PEOPLE_C = { solid: "#f08a6c", line: "#f6b9a3", tint: "#fff0ea", text: "#a4471a" };

const STEP_MS = 4500;
const HUB_GRADIENT = "conic-gradient(from 0deg, #8676ff, #c08aff, #ff8fbf, #f6b9a3, #ffc970, #8cc1f2, #8676ff)";

/* diagram geometry (px, inside a fixed W x H box) */
const W = 480;
const H = 350;
const HUB = { x: 240, y: 184, size: 72 };

/* iOS-style glass: translucent fill, background blur + saturation, a bright
   top edge and a soft drop shadow. Pair with <Sheen /> for the highlight. */
const GLASS =
  "border border-white/70 backdrop-blur-xl backdrop-saturate-150 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-1px_0_rgba(255,255,255,0.3),0_1px_2px_rgba(11,15,25,0.05),0_14px_30px_-16px_rgba(11,15,25,0.28)]";

/** diagonal specular highlight across a glass surface */
function Sheen() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 rounded-[inherit]"
      style={{ background: "linear-gradient(140deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.12) 38%, rgba(255,255,255,0) 60%)" }}
    />
  );
}
const SRC_Y = 40; // source node centre
const SRC_BOTTOM = 66;
const AI_X = 96;
const PEOPLE_X = 384;
const PX = [66, 182, 298, 414]; // phase centres
const PHASE_Y = 312;
const PHASE_TOP = 293;
const HUB_L = HUB.x - HUB.size / 2;
const HUB_R = HUB.x + HUB.size / 2;
const HUB_B = HUB.y + HUB.size / 2;
const AI_PATH = `M${AI_X},${SRC_BOTTOM} V${HUB.y - 16} Q${AI_X},${HUB.y} ${AI_X + 16},${HUB.y} H${HUB_L}`;
const PEOPLE_PATH = `M${PEOPLE_X},${SRC_BOTTOM} V${HUB.y - 16} Q${PEOPLE_X},${HUB.y} ${PEOPLE_X - 16},${HUB.y} H${HUB_R}`;
const BUS_Y = 254;
const phasePath = (px: number) => {
  const s = Math.sign(px - HUB.x);
  return `M${HUB.x},${HUB_B} V${BUS_Y - 16} Q${HUB.x},${BUS_Y} ${HUB.x + 16 * s},${BUS_Y} H${px - 16 * s} Q${px},${BUS_Y} ${px},${BUS_Y + 16} V${PHASE_TOP}`;
};

function Packet({ path, dur, delay = "0s", color, animate }: { path: string; dur: string; delay?: string; color: string; animate: boolean }) {
  if (!animate) return null;
  return (
    <circle r={3.2} fill="#fff" stroke={color} strokeWidth={2}>
      <animateMotion dur={dur} begin={delay} repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.45 0 0.55 1" path={path} />
    </circle>
  );
}

function Port({ x, y, color }: { x: number; y: number; color: string }) {
  return <circle cx={x} cy={y} r={3.5} fill="#fff" stroke={color} strokeWidth={1.6} />;
}

function SourceNode({ x, label, sub, Icon, c }: { x: number; label: string; sub: string; Icon: LucideIcon; c: typeof AI_C }) {
  return (
    <div
      aria-hidden
      className={`absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2.5 rounded-[14px] bg-white/50 py-2 pl-2 pr-3.5 ${GLASS}`}
      style={{ left: x, top: SRC_Y }}
    >
      <Sheen />
      <span className="relative grid h-8 w-8 shrink-0 place-items-center rounded-[9px]" style={{ background: c.tint, color: c.text }}>
        <Icon size={15} strokeWidth={2} />
      </span>
      <span className="relative leading-tight">
        <span className="block font-urbanist text-[13.5px] font-semibold text-ink">{label}</span>
        <span className="block whitespace-nowrap font-urbanist text-[11px] text-[#6b7180]">{sub}</span>
      </span>
    </div>
  );
}

function Diagram({
  active,
  onPick,
  animate,
  phaseRefs,
  svgRef,
  compact,
}: {
  active: number;
  onPick: (i: number) => void;
  animate: boolean;
  phaseRefs: MutableRefObject<(HTMLButtonElement | null)[]>;
  svgRef: MutableRefObject<SVGSVGElement | null>;
  compact: boolean;
}) {
  const ac = PHASES[active].color;
  return (
    <div className="relative" style={{ width: W, height: H }}>
      <svg ref={svgRef} width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 overflow-visible" aria-hidden>
        {/* inputs */}
        <path d={AI_PATH} fill="none" stroke={AI_C.line} strokeWidth={1.75} />
        <path d={PEOPLE_PATH} fill="none" stroke={PEOPLE_C.line} strokeWidth={1.75} />
        <Packet path={AI_PATH} dur="2.6s" color={AI_C.solid} animate={animate} />
        <Packet path={PEOPLE_PATH} dur="2.6s" delay="1.3s" color={PEOPLE_C.solid} animate={animate} />

        {/* outputs */}
        {PX.map((px, i) =>
          i === active ? null : (
            <path key={i} d={phasePath(px)} fill="none" stroke="#0b0f19" strokeOpacity={0.16} strokeWidth={1.5} strokeDasharray="3 5" strokeLinecap="round" />
          )
        )}
        <g key={active}>
          {/* soft glow under the active line */}
          <path d={phasePath(PX[active])} fill="none" stroke={ac.solid} strokeOpacity={0.18} strokeWidth={7} strokeLinecap="round" />
          <path
            d={phasePath(PX[active])}
            fill="none"
            stroke={ac.solid}
            strokeWidth={2}
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray="100 100"
            className={animate ? "hai-draw" : ""}
          />
          <Packet path={phasePath(PX[active])} dur="1.9s" delay="0.7s" color={ac.solid} animate={animate} />
        </g>

        {/* ports */}
        <Port x={AI_X} y={SRC_BOTTOM} color={AI_C.solid} />
        <Port x={PEOPLE_X} y={SRC_BOTTOM} color={PEOPLE_C.solid} />
        <Port x={HUB_L} y={HUB.y} color={AI_C.solid} />
        <Port x={HUB_R} y={HUB.y} color={PEOPLE_C.solid} />
        <Port x={HUB.x} y={HUB_B} color={ac.solid} />
        {PX.map((px, i) => (
          <Port key={i} x={px} y={PHASE_TOP} color={i === active ? PHASES[i].color.solid : "rgba(11,15,25,0.25)"} />
        ))}
      </svg>

      <SourceNode x={AI_X} label="AI" sub="Drafts and checks" Icon={Sparkles} c={AI_C} />
      <SourceNode x={PEOPLE_X} label="Human" sub="Decides and approves" Icon={UserRound} c={PEOPLE_C} />

      {/* hub: the CodeShaper mark on liquid glass. A gradient turns slowly
          behind it: blurred outside as a halo, crisp along the edge as a ring,
          and seen through the frosted tile as shifting pastel colour. */}
      <div aria-hidden className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: HUB.x, top: HUB.y }}>
        <span
          className={`absolute -inset-5 rounded-full opacity-60 blur-xl ${animate ? "hai-spin" : ""}`}
          style={{ background: HUB_GRADIENT, animationDuration: "11s", animationDirection: "reverse" }}
        />
        <span className="relative block overflow-hidden rounded-[22px] p-[2px] shadow-[0_18px_36px_-14px_rgba(91,79,214,0.55)]" style={{ width: HUB.size, height: HUB.size }}>
          <span className={`absolute -inset-[60%] ${animate ? "hai-spin" : ""}`} style={{ background: HUB_GRADIENT }} />
          <span className={`relative grid h-full w-full place-items-center rounded-[20px] bg-white/60 ${GLASS} border-white/50`}>
            <Sheen />
            <Image src="/brand/favicon.png" alt="" width={32} height={32} className="relative h-8 w-8 rounded-[8px] drop-shadow-[0_4px_8px_rgba(75,63,184,0.35)]" />
          </span>
        </span>
      </div>

      {/* phases */}
      {PHASES.map((p, i) => {
        const on = i === active;
        const Icon = p.icon;
        return [
          /* coloured glow behind the active node, picked up by its glass */
          on && (
            <span
              key={`${p.name}-glow`}
              aria-hidden
              className="lens-fade-in absolute h-9 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full blur-lg"
              style={{ left: PX[i], top: PHASE_Y + 4, background: `${p.color.solid}66` }}
            />
          ),
          <button
            key={p.name}
            ref={(el) => {
              phaseRefs.current[i] = el;
            }}
            type="button"
            aria-pressed={on}
            aria-controls="hai-detail"
            tabIndex={compact ? -1 : undefined}
            aria-hidden={compact || undefined}
            onClick={() => onPick(i)}
            className={`group absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-[13px] py-1.5 pl-1.5 pr-3 font-urbanist text-[13px] font-semibold transition-[background-color,border-color,color,transform] duration-300 hover:-translate-y-[calc(50%+1px)] ${GLASS}`}
            style={
              {
                left: PX[i],
                top: PHASE_Y,
                color: on ? p.color.text : "var(--color-ink-dim)",
                backgroundColor: on ? `${p.color.solid}1c` : "rgba(255,255,255,0.5)",
                borderColor: on ? `${p.color.solid}55` : undefined,
              } as CSSProperties
            }
          >
            <Sheen />
            <span
              className="relative grid h-6 w-6 place-items-center rounded-[7px] transition-colors duration-300"
              style={{
                background: on ? `linear-gradient(160deg, ${p.color.solid}cc, ${p.color.solid})` : p.color.tint,
                color: on ? "#fff" : p.color.text,
                boxShadow: on ? `inset 0 1px 0 rgba(255,255,255,0.45), 0 4px 10px -3px ${p.color.solid}` : undefined,
              }}
            >
              <Icon size={13} strokeWidth={2} />
            </span>
            <span className="relative">{p.name}</span>
          </button>,
        ];
      })}
    </div>
  );
}

export default function HumanAiFlow() {
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const [stopped, setStopped] = useState(false);
  const [hover, setHover] = useState(false);
  const [inView, setInView] = useState(false);
  const [scale, setScale] = useState(1);
  const panelRef = useRef<HTMLDivElement>(null);
  const fitRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const dotsRef = useRef<DotFieldHandle>(null);
  const phaseRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const first = useRef(true);

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // SVG packets only run while visible
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    if (inView) svg.unpauseAnimations();
    else svg.pauseAnimations();
  }, [inView]);

  // scale the fixed-size diagram to its column
  useEffect(() => {
    const el = fitRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(Math.min(1.12, e.contentRect.width / W)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const running = !reduced && !stopped && !hover && inView;
  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % PHASES.length), STEP_MS);
    return () => clearTimeout(t);
  }, [running, active]);

  // ripple through the dots from the phase that just became active
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const b = phaseRefs.current[active]?.getBoundingClientRect();
    if (b) dotsRef.current?.pulse(b.left + b.width / 2, b.top + b.height / 2);
  }, [active]);

  const pick = (i: number) => {
    setActive(i);
    setStopped(true);
  };
  const compact = scale < 0.84;
  const phase = PHASES[active];

  return (
    <section aria-labelledby="human-ai-heading" className="theme-light relative overflow-hidden bg-light-surface py-16 lg:py-24">
      {/* dot grid across the whole section, fading out at the top and bottom */}
      <DotField ref={dotsRef} className="[mask-image:linear-gradient(to_bottom,transparent,black_22%,black_78%,transparent)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <Reveal>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <SectionEyebrow>Human + AI</SectionEyebrow>
              <SectionTitle id="human-ai-heading" className="max-w-[18ch] text-balance">
                Humans lead. AI does the heavy lifting.
              </SectionTitle>
            </div>
            <SectionDescription className="max-w-sm">
              Every phase runs on the same loop: AI drafts and checks, humans decide and approve. You get speed without losing judgment.
            </SectionDescription>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div
            ref={panelRef}
            className="relative mt-12 lg:mt-14"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            {/* soft two-tone glow behind the diagram */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(34% 50% at 16% 46%, rgba(134,118,255,0.10) 0%, transparent 70%), radial-gradient(30% 46% at 36% 40%, rgba(240,138,108,0.08) 0%, transparent 70%)",
              }}
            />

            <div className="relative grid grid-cols-[minmax(0,1fr)] items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14 lg:py-4">
              {/* diagram, scaled to fit */}
              <div ref={fitRef} className="w-full">
                <div className="mx-auto" style={{ width: W * scale, height: H * scale }}>
                  <div style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}>
                    <Diagram active={active} onPick={pick} animate={!reduced} phaseRefs={phaseRefs} svgRef={svgRef} compact={compact} />
                  </div>
                </div>
              </div>

              <div>
                {/* phase switcher for narrow screens (the diagram's buttons are too small there) */}
                {compact && (
                  <div className="mb-6 grid grid-cols-4 gap-1 rounded-[14px] border border-[#0b0f19]/[0.07] bg-white/80 p-1 backdrop-blur-sm">
                    {PHASES.map((p, i) => {
                      const on = i === active;
                      return (
                        <button
                          key={p.name}
                          type="button"
                          aria-pressed={on}
                          aria-controls="hai-detail"
                          onClick={() => pick(i)}
                          className="min-h-[40px] rounded-[10px] font-urbanist text-[13px] font-semibold transition-colors"
                          style={{ background: on ? p.color.tint : "transparent", color: on ? p.color.text : "var(--color-ink-dim)" }}
                        >
                          {p.name}
                        </button>
                      );
                    })}
                  </div>
                )}

                <div id="hai-detail" key={active} className="lens-fade-in">
                  <p
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-urbanist text-[11px] font-semibold uppercase tracking-[0.16em]"
                    style={{ background: phase.color.tint, color: phase.color.text }}
                  >
                    <phase.icon size={12} strokeWidth={2.2} aria-hidden />
                    {phase.name}
                  </p>
                  <h3 className="mt-3 font-urbanist text-[22px] font-bold leading-tight tracking-[-0.01em] text-ink sm:text-[26px]">{phase.title}</h3>
                  <p className="mt-2 max-w-[46ch] font-urbanist text-[15px] leading-relaxed text-ink-dim">{phase.body}</p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {[
                      { label: "AI does", Icon: Sparkles, items: phase.ai, c: AI_C },
                      { label: "Human does", Icon: UserRound, items: phase.people, c: PEOPLE_C },
                    ].map(({ label, Icon, items, c }) => (
                      <div
                        key={label}
                        className="rounded-[18px] border border-[#0b0f19]/[0.06] bg-white/90 p-4 shadow-[0_1px_2px_rgba(11,15,25,0.03),0_16px_32px_-24px_rgba(11,15,25,0.25)] backdrop-blur-[2px] sm:p-5"
                      >
                        <p className="flex items-center gap-2.5 font-urbanist text-[14px] font-semibold text-ink">
                          <span className="grid h-7 w-7 place-items-center rounded-[8px]" style={{ background: c.tint, color: c.text }}>
                            <Icon size={14} strokeWidth={2} aria-hidden />
                          </span>
                          {label}
                        </p>
                        <ul className="mt-3.5 space-y-2.5">
                          {items.map((it) => (
                            <li key={it} className="flex items-start gap-2 font-urbanist text-[13.5px] leading-snug text-ink-dim">
                              <Check size={14} strokeWidth={2.4} className="mt-[2px] shrink-0" style={{ color: c.solid }} aria-hidden />
                              {it}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {!reduced && (
              <button
                type="button"
                onClick={() => setStopped((s) => !s)}
                aria-label={stopped ? "Play phase animation" : "Pause phase animation"}
                className="absolute -top-11 right-0 z-10 grid h-8 w-8 place-items-center rounded-full border border-[#0b0f19]/10 bg-white/90 text-ink transition-colors hover:bg-white lg:top-0"
              >
                {stopped ? <Play size={13} /> : <Pause size={13} />}
              </button>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
