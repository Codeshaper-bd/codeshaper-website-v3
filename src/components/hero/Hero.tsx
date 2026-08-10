"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Magnetic from "@/components/system/Magnetic";
import HeroMesh from "./HeroMesh";
import WordMorph from "./WordMorph";
import MeshType from "./MeshType";
import PromptPipeline from "./PromptPipeline";
import { usePrefersReducedMotion, useMotionAllowed } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

/**
 * Hero — "the mark assembles".
 *
 * Layer stack (back → front):
 *   1. #0A0A0F base
 *   2. generated aurora video, full-bleed, screen-blended so it reads as light
 *   3. WebGL particle field (26k pts) that assembles into the Codeshaper
 *      hexagon, repels the pointer, and disperses as you scroll away
 *   4. SVG hex outline that draws itself on load and counter-rotates on scroll
 *   5. copy + CTAs + bottom proof bar
 *
 * Scroll behaviour is a GSAP ScrollTrigger *scrub* (no pin, no jacking): the
 * copy lifts and fades, the video scales back, and the mark disperses — so
 * leaving the hero feels like a camera pull-back rather than a cut.
 * Reduced motion: static poster, no canvas, no scrub, plain fades.
 */
const HEADLINE_WORDS = ["Build", "&", "scale", "digital", "products", "—", "predictably."];
const SCRAMBLE_WORD_INDEX = 2;
const GLYPHS = "!<>-_\\/[]{}—=+*^?#";

/* PLACEHOLDER numbers — flag for approval */
const STATS = [
  { value: "2021", label: "Founded" },
  { value: "20+", label: "Specialists" },
  { value: "300+", label: "Projects shipped" },
  { value: "~1 wk", label: "To kickoff" },
];

const ROTATING = ["digital products.", "AI automation.", "commerce platforms.", "SaaS products."];

function ScrambleWord({ word, start }: { word: string; start: boolean }) {
  const [display, setDisplay] = useState(word);
  const done = useRef(false);
  useEffect(() => {
    if (!start || done.current) return;
    done.current = true;
    const t0 = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / 600);
      const settled = Math.floor(p * word.length);
      setDisplay(
        word
          .split("")
          .map((ch, i) => (i < settled || ch === "." ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0]))
          .join("")
      );
      if (p < 1) raf = requestAnimationFrame(step);
      else setDisplay(word);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [start, word]);
  return (
    <span className="relative inline-block">
      <span className="invisible">{word}</span>
      <span className="absolute left-0 top-0 whitespace-pre">{display}</span>
    </span>
  );
}

export default function Hero() {
  const reduced = usePrefersReducedMotion();
  const interactive = useMotionAllowed();
  const sectionRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const [headlineIn, setHeadlineIn] = useState(false);
  const [scrambleGo, setScrambleGo] = useState(false);
  const [restIn, setRestIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // headline choreography
  useEffect(() => {
    if (reduced) {
      setHeadlineIn(true);
      setRestIn(true);
      return;
    }
    const t1 = setTimeout(() => setHeadlineIn(true), 260);
    const dur = 260 + HEADLINE_WORDS.length * 45 + 520;
    const t2 = setTimeout(() => setScrambleGo(true), dur - 280);
    const t3 = setTimeout(() => setRestIn(true), dur + 260);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, [reduced]);

  // scroll-scrubbed camera pull-back (no pin)
  useEffect(() => {
    if (reduced || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      const st = {
        trigger: sectionRef.current!,
        start: "top top",
        end: "bottom top",
        scrub: 0.6,
      } as const;

      gsap.to(copyRef.current, {
        y: -90,
        opacity: 0,
        filter: "blur(6px)",
        ease: "none",
        scrollTrigger: st,
      });
      gsap.to(videoRef.current, {
        scale: 1.12,
        opacity: 0.25,
        ease: "none",
        scrollTrigger: st,
      });
      gsap.to(markRef.current, {
        rotate: -14,
        scale: 1.25,
        opacity: 0,
        ease: "none",
        scrollTrigger: st,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [reduced]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // pointer tilt on the mark (desktop only)
  useEffect(() => {
    if (!interactive || !sectionRef.current) return;
    const section = sectionRef.current;
    let raf = 0, mx = 0, my = 0, cx = 0, cy = 0;
    const onMove = (e: MouseEvent) => {
      const r = section.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width - 0.5;
      my = (e.clientY - r.top) / r.height - 0.5;
    };
    const tick = () => {
      cx += (mx - cx) * 0.06;
      cy += (my - cy) * 0.06;
      if (markRef.current) {
        markRef.current.style.setProperty("--tx", `${cx * 26}px`);
        markRef.current.style.setProperty("--ty", `${cy * 18}px`);
      }
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [interactive]);

  const seq = (on: boolean, delay = 0): React.CSSProperties => ({
    opacity: on ? 1 : 0,
    transform: on ? "translateY(0)" : "translateY(18px)",
    transition: `opacity 600ms ease ${delay}ms, transform 600ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
  });

  return (
    <section
      ref={sectionRef}
      className="theme-light relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-canvas"
    >
      {/* 2 — animated gradient mesh: ambient depth only, full opacity (no
             screen-blend trick — that only makes sense lightening a dark base) */}
      <div ref={videoRef} className="absolute inset-[-4%]">
        <HeroMesh />
      </div>


      {/* 4 — the particle field *is* the mark; this is just the pointer-tilt
          anchor GSAP scrubs (kept empty of geometry so nothing duplicates it) */}
      <div
        ref={markRef}
        aria-hidden
        className="hero-mark pointer-events-none absolute left-1/2 top-1/2 h-[min(72vh,640px)] w-[min(72vh,640px)]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(102,126,234,0.14), rgba(20,184,166,0.05) 55%, transparent 72%)",
        }}
      />

      {/* copy scrim: keeps the headline readable over the bright particle core */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[62vh] w-[min(96vw,1040px)] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(52% 46% at 50% 48%, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.4) 60%, transparent 100%)",
        }}
      />

      {/* hex texture */}
      <div
        aria-hidden
        className="absolute inset-0 text-ink opacity-[0.03]"
        style={{ backgroundImage: "url(/media/hex-pattern-tile.svg)", backgroundSize: "112px 194px" }}
      />

      {/* 5 — copy */}
      <div
        ref={copyRef}
        className="relative z-10 mx-auto w-full max-w-4xl px-6 pb-24 pt-24 text-center lg:px-10"
      >
        <p
          className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-hairline bg-canvas/40 px-4 py-1.5 font-body text-[11px] uppercase tracking-[0.28em] text-ink-dim backdrop-blur-sm"
          style={seq(headlineIn)}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-aurora-amber dot-pulse" />
          Product design · Engineering · AI automation
        </p>

        {/* ── Signature band: ~11k particles spell what the studio does —
               DESIGN → BUILD → AUTOMATE → SHIP — then resolve into the hexagon
               mark and start over. Decorative; the H1 below carries meaning. */}
        <div className="relative mx-auto mb-1 h-[22vh] max-h-[196px] min-h-[120px] w-full max-w-5xl">
          {/* particle dust behind the type — same palette, low presence */}
          <WordMorph className="absolute inset-0 h-full w-full opacity-30" />
          {/* the gradient mesh, playing inside the letterforms */}
          <MeshType className="absolute inset-0 h-full w-full" />
        </div>

        {/* PLACEHOLDER H1 — flag for approval */}
        <h1
          className="font-display text-[26px] font-bold leading-[1.1] tracking-tight text-ink sm:text-[32px] lg:text-[38px]"
          aria-label="Build & scale digital products — predictably."
        >
          {HEADLINE_WORDS.map((w, i) => (
            <span
              key={i}
              aria-hidden
              className="mr-[0.22em] inline-block overflow-hidden pb-1 -mb-1 align-bottom"
            >
              <span
                className="inline-block"
                style={
                  reduced
                    ? undefined
                    : {
                        transform: headlineIn ? "translateY(0)" : "translateY(115%)",
                        transition: `transform 620ms cubic-bezier(0.16,1,0.3,1) ${i * 45}ms`,
                      }
                }
              >
                {i === SCRAMBLE_WORD_INDEX && !reduced ? (
                  <ScrambleWord word={w} start={scrambleGo} />
                ) : (
                  w
                )}
              </span>
            </span>
          ))}
        </h1>

        <p
          className="mx-auto mt-7 max-w-2xl font-body text-base leading-relaxed text-ink-dim sm:text-lg"
          style={seq(restIn)}
        >
          We design, build, and automate digital products for teams across the
          USA, Canada, and Europe — with weekly visibility and a clean handover
          every time.
        </p>

        {/* live prompt → pipeline: what an AI-first studio actually does */}
        <div className="mt-6" style={seq(restIn, 80)}>
          <PromptPipeline />
        </div>

        <div
          className="mt-6 flex flex-wrap items-center justify-center gap-5"
          style={seq(restIn, 140)}
        >
          <Magnetic>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-aurora-indigo px-8 py-4 font-display text-sm font-medium text-white transition-[background-color,transform] duration-300 hover:scale-[1.02] hover:bg-aurora-violet"
            >
              Book a Call
              <ArrowRight size={15} strokeWidth={1.75} />
            </Link>
          </Magnetic>

          <Link
            href="/services"
            className="group inline-flex items-center gap-2 py-4 font-display text-sm font-medium text-ink-dim transition-colors hover:text-ink"
          >
            <span className="relative">
              Explore Services
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-ink transition-transform duration-200 group-hover:scale-x-100" />
            </span>
            <ArrowRight
              size={15}
              strokeWidth={1.75}
              className="-translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
            />
          </Link>
        </div>
      </div>

      {/* proof bar — PLACEHOLDER numbers */}
      <div
        className="absolute inset-x-0 bottom-0 z-10 border-t border-hairline bg-white/70 backdrop-blur-md"
        style={seq(restIn, 240)}
      >
        <dl className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-6 py-4 lg:justify-between lg:px-10">
          {STATS.map((s) => (
            <div key={s.label} className="flex items-baseline gap-2">
              <dd className="font-display text-lg font-bold tracking-tight text-ink">{s.value}</dd>
              <dt className="font-body text-[13px] text-ink-faint">{s.label}</dt>
            </div>
          ))}
          <p className="font-body text-[13px] tracking-wide text-ink-faint">
            USA&ensp;•&ensp;Canada&ensp;•&ensp;Europe
          </p>
        </dl>
      </div>

      {!reduced && (
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-24 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 transition-opacity duration-500 lg:flex"
          style={{ opacity: scrolled ? 0 : 1 }}
        >
          <span className="relative block h-12 w-px overflow-hidden bg-white/15">
            <span className="scroll-cue-dot absolute left-1/2 top-0 block h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-aurora-violet" />
          </span>
        </div>
      )}
    </section>
  );
}
