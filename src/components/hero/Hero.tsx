"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Magnetic from "@/components/system/Magnetic";
import HeroRings from "./HeroRings";
import WorkspaceScene from "./WorkspaceScene";
import { usePrefersReducedMotion, useMotionAllowed } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

/**
 * Hero — full-bleed video, centered copy, GSAP-driven, inset rounded card.
 *
 * The whole section sits inset from the viewport edge (margin from the
 * dark page canvas around it) with rounded corners, clipped via
 * overflow-hidden — a floating card rather than an edge-to-edge banner.
 *
 * Layer stack (back → front):
 *   1. #ffffff base (theme-light)
 *   2. AI-themed background video (Pexels, royalty-free) — grayscale
 *      filtered to stay within the site's monochrome palette, GSAP
 *      pointer-parallax
 *   3. decorative concentric rings — GSAP breathing pulse
 *   4. tech-badge cluster — GSAP idle motion + pointer-parallax
 *   5. radial glow "mark" — GSAP pointer-parallax + scroll rotate/scale/fade
 *   6. hex texture — GSAP pointer-parallax (subtlest layer)
 *   7. copy scrim (keeps headline legible over the video)
 *   8. copy: eyebrow, headline, subhead, CTAs
 *
 * Every animated property here is GSAP-owned: a single entrance timeline
 * (badge → headline → subhead → CTAs), gsap.quickTo() driving
 * the background layers' pointer-parallax, and the existing ScrollTrigger
 * scrub for the scroll pull-back. Reduced motion: everything renders in
 * its final state immediately, no timeline, no parallax loop, no scroll
 * scrub, no video autoplay motion beyond its own native loop (muted,
 * paused via the same `reduced` check).
 */
const EYEBROW = "AI Automation · Digital Products · Scalable Platforms";
const TITLE = "From AI automation to scalable digital products, we build the future.";
const SUBTITLE =
  "We design and engineer AI solutions, digital products, and scalable platforms that transform the way businesses operate and grow.";

export default function Hero() {
  const reduced = usePrefersReducedMotion();
  const interactive = useMotionAllowed();
  const sectionRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const meshRef = useRef<HTMLDivElement>(null);
  const videoElRef = useRef<HTMLVideoElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const hexRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  // respect reduced motion: pause the background video's own loop, not just our GSAP tweens
  useEffect(() => {
    const video = videoElRef.current;
    if (!video) return;
    if (reduced) video.pause();
    else video.play().catch(() => {});
  }, [reduced]);

  // slow continuous "Ken Burns" zoom on the video itself — independent of the
  // wrapper's own scroll-scrub scale, so the two never contend for one property
  useEffect(() => {
    if (reduced || !videoElRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(videoElRef.current, {
        scale: 1.06,
        duration: 18,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });
    return () => ctx.revert();
  }, [reduced]);

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

  // entrance choreography — one GSAP timeline, badge through CTAs
  useEffect(() => {
    if (!sectionRef.current) return;
    const targets = [badgeRef.current, headlineRef.current, subRef.current, ctaRef.current];
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
        .from(ctaRef.current, { opacity: 0, y: 16, duration: 0.55 }, "-=0.4");
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

  // pointer parallax across background depth layers + the tech cluster (desktop only)
  useEffect(() => {
    if (!interactive || !sectionRef.current) return;
    const section = sectionRef.current;
    const cluster = section.querySelector<HTMLElement>('[data-parallax="cluster"]');

    const setMeshX = gsap.quickTo(meshRef.current, "x", { duration: 1.2, ease: "power3.out" });
    const setMeshY = gsap.quickTo(meshRef.current, "y", { duration: 1.2, ease: "power3.out" });
    const setMarkX = gsap.quickTo(markRef.current, "x", { duration: 0.9, ease: "power3.out" });
    const setMarkY = gsap.quickTo(markRef.current, "y", { duration: 0.9, ease: "power3.out" });
    const setHexX = gsap.quickTo(hexRef.current, "x", { duration: 1.4, ease: "power3.out" });
    const setHexY = gsap.quickTo(hexRef.current, "y", { duration: 1.4, ease: "power3.out" });
    const setClusterX = cluster
      ? gsap.quickTo(cluster, "x", { duration: 1.0, ease: "power3.out" })
      : null;
    const setClusterY = cluster
      ? gsap.quickTo(cluster, "y", { duration: 1.0, ease: "power3.out" })
      : null;

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
      setClusterX?.(mx * 18);
      setClusterY?.(my * 14);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [interactive]);

  return (
    <div className="bg-[#edecec] p-3 sm:p-4">
      <section
        ref={sectionRef}
        className="theme-light relative flex min-h-[calc(100svh-24px)] flex-col items-center justify-center overflow-hidden rounded-[32px] bg-canvas sm:min-h-[calc(100svh-32px)]"
      >
        {/* 2 — AI-themed background video: ambient depth, pointer-parallax layer 1.
            Pre-desaturated at encode time (not just a CSS filter) so it stays
            within the site's monochrome palette; the video element itself
            carries a slow continuous GSAP zoom (Ken Burns), independent of
            the wrapper's own scroll-scrub scale below. */}
        <div ref={meshRef} className="absolute inset-[-4%]">
          <video
            ref={videoElRef}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover opacity-[0.32] grayscale"
            aria-hidden
          >
            <source src="/media/hero-ai-neural.mp4" type="video/mp4" />
            <source src="/media/hero-ai-neural.webm" type="video/webm" />
          </video>
          {/* soft vignette: adds depth without breaking the monochrome palette */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 100% at 50% 38%, transparent 38%, rgba(9,9,11,0.1) 100%)",
            }}
          />
        </div>

        {/* decorative concentric rings — bottom-left, GSAP breathing pulse */}
        <HeroRings />

        {/* tech-badge cluster — hugs the headline's corner, GSAP idle motion */}
        <WorkspaceScene />

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

        {/* copy scrim: keeps the headline readable over the video */}
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
          className="relative z-10 mx-auto w-full max-w-4xl px-6 py-24 text-center lg:px-10"
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
              className="inline-flex items-center gap-2 rounded-full border border-hairline-strong bg-white px-8 py-4 font-urbanist text-sm font-medium text-ink transition-[border-color,transform] duration-300 hover:scale-[1.02] hover:border-ink/40"
            >
              Explore Services
              <ArrowRight size={15} strokeWidth={1.75} />
            </Link>
          </div>
        </div>

        {!reduced && (
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-10 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 transition-opacity duration-500 lg:flex"
            style={{ opacity: scrolled ? 0 : 1 }}
          >
            <span className="relative block h-12 w-px overflow-hidden bg-hairline">
              <span className="scroll-cue-dot absolute left-1/2 top-0 block h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-aurora-violet" />
            </span>
          </div>
        )}
      </section>
    </div>
  );
}
