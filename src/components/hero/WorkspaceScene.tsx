"use client";

import { useEffect, useState } from "react";
import { Sparkles, TrendingUp, Check, GitBranch } from "lucide-react";
import { usePrefersReducedMotion, seqStyle } from "@/lib/motion";

/**
 * Hero product-card scene — drawn entirely in code (no image/video dependency).
 *
 * Three product surfaces float around the hero's centered copy and animate
 * themselves, so the hero reads unmistakably as a software studio: a code
 * editor that types itself, an analytics card whose bars grow, and an AI
 * agent card where a human question is answered by an agent. Small satellite
 * chips (CI passing, branch) fill the negative space.
 *
 * Positioned directly within Hero.tsx's <section> (no bounded host box) —
 * each layer is `hidden lg:block` and carries a `data-depth` that Hero.tsx's
 * pointer-tilt effect reads to drive per-layer parallax. Entrance uses the
 * same seqStyle() fade/rise every other hero element uses, staggered per
 * card. Reduced motion: everything renders in its final state, no loops, no
 * parallax (Hero.tsx's parallax effect is itself gated off by
 * useMotionAllowed()).
 */

const CODE_LINES: { indent: number; tokens: [string, string][] }[] = [
  { indent: 0, tokens: [["const", "kw"], [" agent", "fn"], [" = ", "op"], ["createAgent", "fn"], ["({", "op"]] },
  { indent: 1, tokens: [["model", "prop"], [": ", "op"], ["'claude'", "str"], [",", "op"]] },
  { indent: 1, tokens: [["tools", "prop"], [": ", "op"], ["[", "op"], ["invoices", "str"], ["]", "op"], [",", "op"]] },
  { indent: 1, tokens: [["onEscalate", "prop"], [": ", "op"], ["human", "fn"], [",", "op"]] },
  { indent: 0, tokens: [["});", "op"]] },
  { indent: 0, tokens: [["await", "kw"], [" agent.", "fn"], ["run", "fn"], ["()", "op"]] },
];

const TOKEN_COLOR: Record<string, string> = {
  kw: "text-aurora-violet",
  fn: "text-ink",
  op: "text-ink-faint",
  prop: "text-aurora-violet",
  str: "text-aurora-amber-dark",
};

function CodeCard({ typed }: { typed: number }) {
  let budget = typed;
  return (
    <div className="glass w-[380px] max-w-[86vw] overflow-hidden rounded-xl">
      <div className="flex items-center gap-2 border-b border-hairline px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full border border-hairline bg-aurora-amber/70" />
        <span className="h-2.5 w-2.5 rounded-full border border-hairline bg-aurora-violet/70" />
        <span className="h-2.5 w-2.5 rounded-full border border-hairline bg-ink-faint/20" />
        <span className="ml-2 font-body text-[11px] text-ink-faint">agent.ts</span>
      </div>
      <pre className="px-4 py-3.5 font-mono text-[12.5px] leading-[1.7]">
        {CODE_LINES.map((line, i) => {
          const full = line.tokens.map((t) => t[0]).join("");
          const take = Math.max(0, Math.min(full.length, budget));
          budget -= full.length;
          if (take === 0) return <div key={i}>&nbsp;</div>;
          let used = 0;
          return (
            <div key={i} style={{ paddingLeft: line.indent * 14 }}>
              {line.tokens.map(([txt, kind], j) => {
                const start = used;
                used += txt.length;
                const slice = txt.slice(0, Math.max(0, Math.min(txt.length, take - start)));
                if (!slice) return null;
                return (
                  <span key={j} className={TOKEN_COLOR[kind]}>
                    {slice}
                  </span>
                );
              })}
              {take < full.length && (
                <span className="ml-px inline-block h-[13px] w-[6px] translate-y-[2px] bg-aurora-violet" />
              )}
            </div>
          );
        })}
      </pre>
    </div>
  );
}

function MetricCard({ progress }: { progress: number }) {
  const bars = [38, 52, 44, 68, 60, 82, 74];
  return (
    <div className="glass w-[232px] rounded-xl p-4">
      <div className="flex items-center justify-between">
        <span className="font-body text-[11px] uppercase tracking-[0.18em] text-ink-faint">
          Activation
        </span>
        <TrendingUp size={14} strokeWidth={1.75} className="text-aurora-amber" />
      </div>
      <p className="mt-2 font-display text-[26px] font-bold leading-none text-ink">
        +{Math.round(18 * progress)}%
      </p>
      <div className="mt-4 flex h-14 items-end gap-1.5">
        {bars.map((h, i) => (
          <span
            key={i}
            className="flex-1 rounded-sm"
            style={{
              height: `${h * progress}%`,
              background:
                i === bars.length - 1
                  ? "linear-gradient(180deg, var(--color-aurora-amber), var(--color-aurora-violet))"
                  : "linear-gradient(180deg, var(--color-aurora-indigo), var(--color-aurora-violet-dark))",
              transition: "height 600ms cubic-bezier(0.16,1,0.3,1)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function AgentCard({ step }: { step: number }) {
  return (
    <div className="glass w-[300px] max-w-[84vw] rounded-xl p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-aurora-violet/20 text-aurora-violet">
          <Sparkles size={13} strokeWidth={1.75} />
        </span>
        <span className="font-body text-[11px] uppercase tracking-[0.18em] text-ink-faint">
          Agent
        </span>
      </div>
      <div
        className="ml-auto w-fit rounded-lg rounded-br-sm bg-aurora-violet/22 px-3 py-2 font-body text-[12.5px] text-ink transition-opacity duration-500"
        style={{ opacity: step >= 1 ? 1 : 0 }}
      >
        Route this invoice?
      </div>
      <div
        className="mt-2 w-fit rounded-lg rounded-bl-sm border border-hairline bg-canvas/60 px-3 py-2 font-body text-[12.5px] leading-relaxed text-ink-dim transition-opacity duration-500"
        style={{ opacity: step >= 2 ? 1 : 0 }}
      >
        {step >= 3 ? (
          "Matched PO #4471 — approved, sent to finance."
        ) : (
          <span className="flex gap-1 py-1">
            <span className="typing-dot h-1.5 w-1.5 rounded-full bg-ink-dim" />
            <span className="typing-dot h-1.5 w-1.5 rounded-full bg-ink-dim" />
            <span className="typing-dot h-1.5 w-1.5 rounded-full bg-ink-dim" />
          </span>
        )}
      </div>
    </div>
  );
}

export default function WorkspaceScene({ restIn }: { restIn: boolean }) {
  const reduced = usePrefersReducedMotion();
  const totalChars = CODE_LINES.reduce((n, l) => n + l.tokens.map((t) => t[0]).join("").length, 0);
  const [typed, setTyped] = useState(reduced ? totalChars : 0);
  const [progress, setProgress] = useState(reduced ? 1 : 0);
  const [step, setStep] = useState(reduced ? 3 : 0);

  useEffect(() => {
    if (reduced) {
      // usePrefersReducedMotion is SSR-safe and starts false, then flips
      // true post-mount — by then the useState initializers above have
      // already committed to their empty/zero starting values, so this
      // syncs them to their final "everything already happened" state.
      setTyped(totalChars);
      setProgress(1);
      setStep(3);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const timers: ReturnType<typeof setTimeout>[] = [];

    // typing loop (restarts so the scene always feels live)
    const tick = (now: number) => {
      const elapsed = (now - t0) / 1000;
      const cycle = elapsed % 9;
      setTyped(cycle < 6 ? Math.floor((cycle / 6) * totalChars) : totalChars);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    timers.push(setTimeout(() => setProgress(1), 900));
    timers.push(setTimeout(() => setStep(1), 1300));
    timers.push(setTimeout(() => setStep(2), 2100));
    timers.push(setTimeout(() => setStep(3), 3400));

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
    };
  }, [reduced, totalChars]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[5] hidden lg:block">
      {/* satellite chip: CI passing */}
      <div
        data-depth="0.2"
        className="scene-layer absolute left-[3%] top-[10%] xl:left-[6%] xl:top-[8%]"
        style={seqStyle(restIn, 200)}
      >
        <span className="glass flex items-center gap-2 rounded-full px-3 py-1.5 font-body text-[11.5px] text-ink-dim">
          <Check size={12} strokeWidth={2} className="text-aurora-indigo" />
          CI passing
        </span>
      </div>

      {/* satellite chip: release branch — sits in the open gap between the
          metric card and the agent card so it doesn't tuck behind either */}
      <div
        data-depth="0.28"
        className="scene-layer absolute top-[40%] right-[3%] xl:top-[40%] xl:right-[6%]"
        style={seqStyle(restIn, 360)}
      >
        <span className="glass flex items-center gap-2 rounded-full px-3 py-1.5 font-body text-[11.5px] text-ink-dim">
          <GitBranch size={12} strokeWidth={2} className="text-aurora-amber" />
          release/2.4
        </span>
      </div>

      {/* back: metric card */}
      <div
        data-depth="0.35"
        className="scene-layer absolute right-[1%] top-[11%] xl:right-[5%] xl:top-[9%]"
        style={seqStyle(restIn, 240)}
      >
        <div className="rotate-[3deg]">
          <MetricCard progress={progress} />
        </div>
      </div>

      {/* mid: code editor */}
      <div
        data-depth="0.6"
        className="scene-layer absolute left-[1%] top-[23%] xl:left-[4%] xl:top-[23%]"
        style={seqStyle(restIn, 160)}
      >
        <div className="-rotate-[2deg]">
          <CodeCard typed={typed} />
        </div>
      </div>

      {/* front: agent card */}
      <div
        data-depth="1"
        className="scene-layer absolute bottom-[13%] right-[1%] xl:bottom-[11%] xl:right-[4%]"
        style={seqStyle(restIn, 320)}
      >
        <div className="rotate-[1.5deg]">
          <AgentCard step={step} />
        </div>
      </div>
    </div>
  );
}
