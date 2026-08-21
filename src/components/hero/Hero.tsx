"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Magnetic from "@/components/system/Magnetic";
import HeroMesh from "./HeroMesh";
import { usePrefersReducedMotion, useMotionAllowed } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

/**
 * Hero — minimal, centered, GSAP-driven.
 *
 * Layer stack (back → front):
 *   1. #ffffff base (theme-light)
 *   2. animated gradient mesh — ambient depth, GSAP pointer-parallax
 *   3. radial glow "mark" — GSAP pointer-parallax + scroll rotate/scale/fade
 *   4. hex texture — GSAP pointer-parallax (subtlest layer)
 *   5. copy scrim (keeps headline legible over the mesh)
 *   6. copy: eyebrow, headline, subhead, CTAs
 *   7. proof bar
 *
 * Every animated property here is GSAP-owned: a single entrance timeline
 * (badge → headline → subhead → CTAs → proof bar), gsap.quickTo() driving
 * the three background layers' pointer-parallax, and the existing
 * ScrollTrigger scrub for the scroll pull-back. Reduced motion: everything
 * renders in its final state immediately, no timeline, no parallax loop,
 * no scroll scrub.
 */
const EYEBROW = "AI Automation · Digital Products · Scalable Platforms";
const TITLE = "From AI automation to scalable digital products, we build the future.";
const SUBTITLE =
  "We design and engineer AI solutions, digital products, and scalable platforms that transform the way businesses operate and grow.";

/* PLACEHOLDER numbers — flag for approval */
const STATS = [
  { value: "2021", label: "Founded" },
  { value: "20+", label: "Specialists" },
  { value: "300+", label: "Projects shipped" },
  { value: "~1 wk", label: "To kickoff" },
];

export default function Hero() {
  const reduced = usePrefersReducedMotion();
  const interactive = useMotionAllowed();
  const sectionRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const meshRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const hexRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const proofRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  // center the mark via GSAP (not CSS) so it composes with the scroll-scrub's
  // rotate/scale and the pointer-parallax below in one GSAP-owned transform.
  // Must run before any other effect creates a gsap.context() touching this
  // element — usePrefersReducedMotion() flips false→true shortly after mount
  // (SSR-safe initial value), which re-runs the scroll-scrub effect below and
  // reverts its context; that revert restores the *whole* transform cache to
  // its pre-context snapshot, so centering has to already be in that snapshot.
  useEffect(() => {
    if (markRef.current) gsap.set(markRef.current, { xPercent: -50, yPercent: -50 });
  }, []);

  // entrance choreography — one GSAP timeline, badge through proof bar
  useEffect(() => {
    if (!sectionRef.current) return;
    const targets = [
      badgeRef.current,
      headlineRef.current,
      subRef.current,
      ctaRef.current,
      proofRef.current,
    ];
    if (reduced) {
      gsap.set(targets, { opacity: 1, y: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "expo.out" }, delay: 0.15 })
        .from(badgeRef.current, { opacity: 0, y: 18, duration: 0.6 })
        .from(headlineRef.current, { opacity: 0, y: 26, duration: 0.8 }, "-=0.35")
        .from(subRef.current, { opacity: 0, y: 18, duration: 0.6 }, "-=0.5")
        .from(ctaRef.current, { opacity: 0, y: 16, duration: 0.55 }, "-=0.4")
        .from(proofRef.current, { opacity: 0, y: 12, duration: 0.5 }, "-=0.3");
    }, sectionRef);
    return () => ctx.revert();
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
      gsap.to(meshRef.current, {
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

  // pointer parallax across three background depth layers (desktop only)
  useEffect(() => {
    if (!interactive || !sectionRef.current) return;
    const section = sectionRef.current;

    const setMeshX = gsap.quickTo(meshRef.current, "x", { duration: 1.2, ease: "power3.out" });
    const setMeshY = gsap.quickTo(meshRef.current, "y", { duration: 1.2, ease: "power3.out" });
    const setMarkX = gsap.quickTo(markRef.current, "x", { duration: 0.9, ease: "power3.out" });
    const setMarkY = gsap.quickTo(markRef.current, "y", { duration: 0.9, ease: "power3.out" });
    const setHexX = gsap.quickTo(hexRef.current, "x", { duration: 1.4, ease: "power3.out" });
    const setHexY = gsap.quickTo(hexRef.current, "y", { duration: 1.4, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      const r = section.getBoundingClientRect();
      const mx = (e.clientX - r.left) / r.width - 0.5;
      const my = (e.clientY - r.top) / r.height - 0.5;
      setMeshX(mx * 14);
      setMeshY(my * 10);
      setMarkX(mx * 34);
      setMarkY(my * 24);
      setHexX(mx * 6);
      setHexY(my * 4);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [interactive]);

  return (
    <section
      ref={sectionRef}
      className="theme-light relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-canvas"
    >
      {/* 2 — animated gradient mesh: ambient depth, pointer-parallax layer 1 */}
      <div ref={meshRef} className="absolute inset-[-4%]">
        <HeroMesh />
      </div>

      {/* 3 — radial glow "mark": pointer-parallax layer 2 + scroll rotate/scale/fade */}
      <div
        ref={markRef}
        aria-hidden
        className="hero-mark pointer-events-none absolute left-1/2 top-1/2 h-[min(72vh,640px)] w-[min(72vh,640px)]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(9,9,11,0.08), rgba(9,9,11,0.03) 55%, transparent 72%)",
        }}
      />

      {/* copy scrim: keeps the headline readable over the mesh */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[62vh] w-[min(96vw,1040px)] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(52% 46% at 50% 48%, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.4) 60%, transparent 100%)",
        }}
      />

      {/* 4 — hex texture: pointer-parallax layer 3 (subtlest) */}
      <div
        ref={hexRef}
        aria-hidden
        className="absolute inset-0 text-ink opacity-[0.03]"
        style={{ backgroundImage: "url(/media/hex-pattern-tile.svg)", backgroundSize: "112px 194px" }}
      />

      {/* 6 — copy */}
      <div
        ref={copyRef}
        className="relative z-10 mx-auto w-full max-w-4xl px-6 pb-24 pt-24 text-center lg:px-10"
      >
        <p
          ref={badgeRef}
          className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-hairline bg-canvas/40 px-4 py-1.5 font-urbanist text-[11px] uppercase tracking-[0.28em] text-ink-dim backdrop-blur-sm"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-aurora-amber dot-pulse" />
          {EYEBROW}
        </p>

        <h1
          ref={headlineRef}
          className="font-urbanist text-[28px] font-bold leading-[1.15] tracking-tight text-ink sm:text-[36px] lg:text-[44px]"
        >
          {TITLE}
        </h1>

        <p
          ref={subRef}
          className="mx-auto mt-7 max-w-2xl font-urbanist text-base leading-relaxed text-ink-dim sm:text-lg"
        >
          {SUBTITLE}
        </p>

        <div ref={ctaRef} className="mt-9 flex flex-wrap items-center justify-center gap-5">
          <Magnetic>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-aurora-violet px-8 py-4 font-urbanist text-sm font-medium text-white transition-[background-color,transform] duration-300 hover:scale-[1.02] hover:bg-aurora-violet-dark"
            >
              Book a Call
              <ArrowRight size={15} strokeWidth={1.75} />
            </Link>
          </Magnetic>

          <Link
            href="/services"
            className="group inline-flex items-center gap-2 py-4 font-urbanist text-sm font-medium text-ink-dim transition-colors hover:text-ink"
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

      {/* 7 — proof bar — PLACEHOLDER numbers */}
      <div
        ref={proofRef}
        className="absolute inset-x-0 bottom-0 z-10 border-t border-hairline bg-white/70 backdrop-blur-md"
      >
        <dl className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-6 py-4 lg:justify-between lg:px-10">
          {STATS.map((s) => (
            <div key={s.label} className="flex items-baseline gap-2">
              <dd className="font-urbanist text-lg font-bold tracking-tight text-ink">{s.value}</dd>
              <dt className="font-urbanist text-[13px] text-ink-faint">{s.label}</dt>
            </div>
          ))}
          <p className="font-urbanist text-[13px] tracking-wide text-ink-faint">
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
          <span className="relative block h-12 w-px overflow-hidden bg-hairline">
            <span className="scroll-cue-dot absolute left-1/2 top-0 block h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-aurora-violet" />
          </span>
        </div>
      )}
    </section>
  );
}
