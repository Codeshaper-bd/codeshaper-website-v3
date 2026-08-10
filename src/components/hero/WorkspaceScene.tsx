"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, TrendingUp, Check, GitBranch } from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/motion";

/**
 * Hero workspace scene — drawn entirely in code (no image/video dependency).
 *
 * Three product surfaces float at different depths and animate themselves, so
 * the hero reads unmistakably as a software studio: a code editor that types
 * itself, an analytics card whose bars grow, and an AI agent card where a
 * human question is answered by an agent. Small satellite chips (CI passing,
 * branch) fill the negative space.
 *
 * Each layer carries a `data-depth` used by the parent for mouse parallax and
 * scroll separation. Reduced motion: everything renders in its final state,
 * nothing loops.
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
  kw: "text-[#8B5FE0]",
  fn: "text-[#F5F4F2]",
  op: "text-[#5B5B66]",
  prop: "text-[#5B5FEF]",
  str: "text-[#F2A65A]",
};

function CodeCard({ typed }: { typed: number }) {
  let budget = typed;
  return (
    <div className="glass w-[380px] max-w-[86vw] overflow-hidden rounded-xl">
      <div className="flex items-center gap-2 border-b border-hairline px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#F2A65A]/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#5B5FEF]/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
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
                  ? "linear-gradient(180deg,#F2A65A,#8B5FE0)"
                  : "linear-gradient(180deg,#5B5FEF,#3a3a72)",
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

export default function WorkspaceScene() {
  const reduced = usePrefersReducedMotion();
  const totalChars = CODE_LINES.reduce((n, l) => n + l.tokens.map((t) => t[0]).join("").length, 0);
  const [typed, setTyped] = useState(reduced ? totalChars : 0);
  const [progress, setProgress] = useState(reduced ? 1 : 0);
  const [step, setStep] = useState(reduced ? 3 : 0);
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
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
    <div ref={hostRef} className="relative mx-auto h-[420px] w-full max-w-[720px] lg:h-[460px]">
      {/* back: metric card */}
      <div
        data-depth="0.35"
        className="scene-layer absolute right-0 top-2 hidden lg:block"
        style={{ transform: "translateZ(0)" }}
      >
        <div className="rotate-[3deg]">
          <MetricCard progress={progress} />
        </div>
      </div>

      {/* satellite chips */}
      <div data-depth="0.2" className="scene-layer absolute left-2 top-0 hidden lg:block">
        <span className="glass flex items-center gap-2 rounded-full px-3 py-1.5 font-body text-[11.5px] text-ink-dim">
          <Check size={12} strokeWidth={2} className="text-[#5B5FEF]" />
          CI passing
        </span>
      </div>
      <div data-depth="0.28" className="scene-layer absolute bottom-6 right-10 hidden lg:block">
        <span className="glass flex items-center gap-2 rounded-full px-3 py-1.5 font-body text-[11.5px] text-ink-dim">
          <GitBranch size={12} strokeWidth={2} className="text-aurora-amber" />
          release/2.4
        </span>
      </div>

      {/* mid: code editor */}
      <div
        data-depth="0.6"
        className="scene-layer absolute left-0 top-16 lg:top-14"
        style={{ transform: "translateZ(0)" }}
      >
        <div className="-rotate-[2deg]">
          <CodeCard typed={typed} />
        </div>
      </div>

      {/* front: agent card */}
      <div data-depth="1" className="scene-layer absolute bottom-0 right-0 lg:bottom-4 lg:right-6">
        <div className="rotate-[1.5deg]">
          <AgentCard step={step} />
        </div>
      </div>
    </div>
  );
}
