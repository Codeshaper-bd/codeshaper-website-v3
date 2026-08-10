"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Reveal from "@/components/system/Reveal";
import ChatDemo from "./ChatDemo";
import { useMouseParallax } from "@/components/system/useMouseParallax";
import { usePrefersReducedMotion } from "@/lib/motion";

/**
 * 4.4 AI spotlight — PASS 2: bullets stagger in, glass panel scales from
 * 0.97 + fades, ambient gradient breathing (~8s via existing aurora drift
 * classes), cursor-parallax on the background (this + hero only).
 * Chat is interactive-scripted (ChatDemo). Content unchanged from Pass 1.
 */
const BULLETS = [
  "Faster discovery — flows, backlog, specs",
  "Faster iteration — UI copy, variants",
  "Better QA — test generation, regression checklists",
  "Automation — document workflows: capture → review → approval",
  "Knowledge-base chat for internal teams and support",
];

export default function AiSpotlight() {
  const reduced = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const auroraRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelIn, setPanelIn] = useState(false);

  useMouseParallax(sectionRef, [{ ref: auroraRef, strength: 0.05 }]);

  useEffect(() => {
    if (reduced) {
      setPanelIn(true);
      return;
    }
    const el = panelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setPanelIn(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    const failsafe = setTimeout(() => setPanelIn(true), 1500);
    return () => {
      io.disconnect();
      clearTimeout(failsafe);
    };
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-canvas py-16 lg:py-32"
      aria-labelledby="ai-heading"
    >
      {/* Ambient breathing gradient backdrop (particle video in Pass 3) */}
      <div ref={auroraRef} aria-hidden className="absolute inset-0">
        <div
          className={`absolute left-[10%] top-[15%] h-[60%] w-[55%] rounded-full opacity-50 blur-3xl ${reduced ? "" : "aurora-fallback-a"}`}
          style={{
            background:
              "radial-gradient(closest-side, rgba(91,95,239,0.55), rgba(139,95,224,0.25), transparent)",
          }}
        />
        <div
          className={`absolute right-[5%] top-[30%] h-[55%] w-[45%] rounded-full opacity-60 blur-3xl ${reduced ? "" : "aurora-fallback-b"}`}
          style={{
            background:
              "radial-gradient(closest-side, rgba(242,166,90,0.35), rgba(242,166,90,0.12), transparent)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2 lg:px-10">
        <div>
          <Reveal>
            <p className="mb-3 font-body text-sm font-medium uppercase tracking-[0.25em] text-aurora-amber">
              AI &amp; Automation
            </p>
            <h2
              id="ai-heading"
              className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl"
            >
              AI-assisted where useful — human-led decisions.
            </h2>
            <p className="mt-6 max-w-lg font-body text-lg leading-relaxed text-ink-dim">
              We use AI to accelerate routine work and improve clarity — while
              keeping quality controlled.
            </p>
          </Reveal>
          <ul className="mt-8 space-y-3">
            {BULLETS.map((b, i) => (
              <li key={b}>
                <Reveal delay={120 + i * 80}>
                  <span className="flex gap-3 font-body text-sm leading-relaxed text-ink-dim">
                    <span className="text-aurora-violet" aria-hidden>
                      →
                    </span>
                    {b}
                  </span>
                </Reveal>
              </li>
            ))}
          </ul>
          <Reveal delay={550}>
            <div className="mt-10">
              <Link
                href="/services/ai"
                className="inline-block rounded-full border border-aurora-violet/70 px-7 py-3.5 font-display text-sm font-medium text-ink shadow-[0_0_20px_rgba(139,95,224,0.3)] transition-shadow hover:shadow-[0_0_36px_rgba(139,95,224,0.5)]"
              >
                Explore AI &amp; Automation →
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Glass panel: scale 0.97→1 + fade on entry */}
        <div
          ref={panelRef}
          className="glass rounded-2xl p-8"
          style={{
            opacity: panelIn ? 1 : 0,
            transform: panelIn ? "scale(1)" : "scale(0.97)",
            transition: "opacity 650ms cubic-bezier(0.16,1,0.3,1), transform 650ms cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <ChatDemo />
        </div>
      </div>
    </section>
  );
}
