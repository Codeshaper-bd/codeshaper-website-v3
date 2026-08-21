"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/motion";

/**
 * Live prompt → delivery pipeline strip.
 *
 * A real client-style request types itself, then the four delivery stages light
 * up in sequence — the same "signal travelling a network" idea as the mesh
 * behind it, but stated in plain language. It loops through several prompts, so
 * the hero shows what an AI-first studio actually does rather than asserting it.
 *
 * PLACEHOLDER copy — the prompts and stage names need sign-off.
 */
const PROMPTS = [
  "Automate our invoice approvals",
  "Ship a customer portal in 8 weeks",
  "Add an AI agent to our support desk",
  "Replatform checkout without downtime",
];

const STAGES = ["Understand", "Plan", "Build", "Ship"];

export default function PromptPipeline() {
  const reduced = usePrefersReducedMotion();
  const [promptIdx, setPromptIdx] = useState(0);
  const [typed, setTyped] = useState(reduced ? PROMPTS[0].length : 0);
  const [stage, setStage] = useState(reduced ? STAGES.length : -1);
  const raf = useRef(0);

  useEffect(() => {
    if (reduced) {
      // usePrefersReducedMotion is SSR-safe and starts false, then flips
      // true post-mount — by then the useState initializers above have
      // already committed to their empty/stuck starting values, so this
      // syncs them to their final "everything already happened" state.
      setTyped(PROMPTS[promptIdx].length);
      setStage(STAGES.length);
      return;
    }
    let cancelled = false;
    const CYCLE = 7600;

    const run = () => {
      const start = performance.now();
      const step = (now: number) => {
        if (cancelled) return;
        const e = now - start;
        const text = PROMPTS[promptIdx];

        // type over the first 1.5s, hold, then clear at the end
        if (e < 1500) setTyped(Math.floor((e / 1500) * text.length));
        else if (e < CYCLE - 700) setTyped(text.length);
        else setTyped(Math.max(0, Math.floor(text.length * (1 - (e - (CYCLE - 700)) / 700))));

        // stages advance after the prompt lands
        if (e < 1700) setStage(-1);
        else setStage(Math.min(STAGES.length, Math.floor((e - 1700) / 1150)));

        if (e < CYCLE) raf.current = requestAnimationFrame(step);
        else {
          setPromptIdx((i) => (i + 1) % PROMPTS.length);
        }
      };
      raf.current = requestAnimationFrame(step);
    };
    run();
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf.current);
    };
  }, [promptIdx, reduced]);

  const text = PROMPTS[promptIdx];

  return (
    <div className="mx-auto w-full max-w-xl">
      {/* prompt line */}
      <div className="glass flex items-center gap-3 rounded-full px-5 py-3">
        <span className="font-mono text-[12px] text-aurora-violet">›</span>
        <span className="min-w-0 flex-1 truncate text-left font-mono text-[13px] text-ink">
          {text.slice(0, typed)}
          {!reduced && (
            <span className="ml-px inline-block h-[13px] w-[6px] translate-y-[2px] bg-aurora-violet align-middle" />
          )}
        </span>
        <span className="hidden shrink-0 items-center gap-1.5 font-urbanist text-[11px] text-ink-faint sm:flex">
          {stage >= STAGES.length ? (
            <>
              <Check size={12} strokeWidth={2.2} className="text-aurora-amber" />
              scoped
            </>
          ) : (
            <>
              <Loader2
                size={12}
                strokeWidth={2.2}
                className={reduced ? "" : "animate-spin"}
              />
              working
            </>
          )}
        </span>
      </div>

      {/* stages */}
      <ol className="mt-4 flex items-center justify-center gap-2 sm:gap-3">
        {STAGES.map((s, i) => {
          const on = stage > i;
          const active = stage === i;
          return (
            <li key={s} className="flex items-center gap-2 sm:gap-3">
              <span
                className={`rounded-full border px-3 py-1.5 font-urbanist text-[11.5px] transition-all duration-300 ${
                  on
                    ? "border-aurora-indigo/60 bg-aurora-indigo/12 text-ink"
                    : active
                      ? "border-aurora-violet/60 bg-aurora-violet/10 text-ink"
                      : "border-hairline text-ink-faint"
                }`}
              >
                {s}
              </span>
              {i < STAGES.length - 1 && (
                <span className="relative block h-px w-4 bg-hairline sm:w-7" aria-hidden>
                  <span
                    className="absolute inset-y-0 left-0 bg-aurora-indigo transition-all duration-500"
                    style={{ width: on ? "100%" : "0%" }}
                  />
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
