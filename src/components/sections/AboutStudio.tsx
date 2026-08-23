"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import Reveal from "@/components/system/Reveal";
import { usePrefersReducedMotion, useMotionAllowed } from "@/lib/motion";

/**
 * About — "who we are" section right after Services. Split layout: a
 * looping team/desk video on the left (TEMPORARY — a free Pexels clip,
 * desaturated to match the site's monochrome palette, standing in until a
 * real Codeshaper video is supplied) and copy + real, code-backed stats on
 * the right. Every stat here is an actual structural count already
 * established elsewhere on the site (SERVICE_COLUMNS, INDUSTRIES, the
 * TrustStrip client list, REGIONS) — no founding year, headcount, or
 * project count is invented, since none of that exists anywhere in this
 * codebase as verified fact.
 */
const STATS: { value: number; suffix: string; label: string }[] = [
  { value: 5, suffix: "", label: "Core practices" },
  { value: 10, suffix: "", label: "Industries served" },
  { value: 16, suffix: "+", label: "Clients worldwide" },
  { value: 3, suffix: "", label: "Regions covered" },
];

function CountUpStat({ value, suffix, label, delay }: { value: number; suffix: string; label: string; delay: number }) {
  const reduced = usePrefersReducedMotion();
  const numRef = useRef<HTMLSpanElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = numRef.current;
    const wrap = wrapRef.current;
    if (!el || !wrap) return;
    if (reduced) {
      el.textContent = String(value);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const counter = { n: 0 };
        gsap.to(counter, {
          n: value,
          duration: 1.4,
          delay: delay / 1000,
          ease: "power2.out",
          onUpdate() {
            el.textContent = String(Math.round(counter.n));
          },
        });
      },
      { threshold: 0.4 }
    );
    io.observe(wrap);
    return () => io.disconnect();
  }, [reduced, value, delay]);

  return (
    <div ref={wrapRef} className="py-4 sm:px-5 sm:py-4 sm:first:pl-0 sm:last:pr-0">
      <p className="font-urbanist text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        <span ref={numRef}>0</span>
        {suffix}
      </p>
      <p className="mt-1 font-urbanist text-[13px] text-ink-dim">{label}</p>
    </div>
  );
}

export default function AboutStudio() {
  const reduced = usePrefersReducedMotion();
  const interactive = useMotionAllowed();
  const videoElRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoElRef.current;
    if (!video) return;
    if (reduced) video.pause();
    else video.play().catch(() => {});
  }, [reduced]);

  useEffect(() => {
    if (reduced || !videoElRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(videoElRef.current, { scale: 1.08, duration: 16, repeat: -1, yoyo: true, ease: "sine.inOut" });
    });
    return () => ctx.revert();
  }, [reduced]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || !interactive) return;
    gsap.set(frame, { rotationX: 0, rotationY: 0 });

    const onMove = (e: PointerEvent) => {
      const r = frame.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      gsap.to(frame, { rotationY: (px - 0.5) * 5, rotationX: -(py - 0.5) * 5, duration: 0.7, ease: "power3.out", overwrite: "auto" });
    };
    const onLeave = () => gsap.to(frame, { rotationX: 0, rotationY: 0, duration: 0.7, ease: "power3.out", overwrite: "auto" });

    frame.addEventListener("pointermove", onMove);
    frame.addEventListener("pointerleave", onLeave);
    return () => {
      frame.removeEventListener("pointermove", onMove);
      frame.removeEventListener("pointerleave", onLeave);
    };
  }, [interactive]);

  return (
    <section className="theme-light relative overflow-hidden bg-light-surface py-16 lg:py-24" aria-labelledby="about-heading">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="h-full" style={{ perspective: "1200px" }}>
              <div
                ref={frameRef}
                className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-hairline shadow-[0_24px_70px_rgba(11,15,25,0.1),0_4px_14px_rgba(11,15,25,0.05)]"
              >
                <video
                  ref={videoElRef}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-full w-full object-cover grayscale"
                  aria-hidden
                >
                  <source src="/media/about-team.mp4" type="video/mp4" />
                  <source src="/media/about-team.webm" type="video/webm" />
                </video>
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{ background: "linear-gradient(180deg, rgba(9,9,11,0.04) 0%, transparent 30%, rgba(9,9,11,0.12) 100%)" }}
                />
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <p className="mb-3 inline-flex items-center gap-2.5 font-urbanist text-sm font-medium uppercase tracking-[0.25em] text-ink-dim">
              <span className="h-1.5 w-1.5 rounded-full bg-aurora-amber" />
              Who we are
            </p>
            <h2
              id="about-heading"
              className="font-urbanist text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl"
            >
              One team, every
              <br />
              <span className="text-ink-dim">discipline you need.</span>
            </h2>
            <p className="mt-5 max-w-md font-urbanist text-base leading-relaxed text-ink-dim">
              We're a digital product studio combining design, engineering, commerce, and AI automation under one
              roof — with weekly visibility and a clean handover at the end of every engagement.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-x-6 border-y border-hairline sm:flex sm:gap-x-0 sm:divide-x sm:divide-hairline">
              {STATS.map((s, i) => (
                <CountUpStat key={s.label} value={s.value} suffix={s.suffix} label={s.label} delay={i * 120} />
              ))}
            </div>

            <div className="mt-8">
              <Link
                href="/company/about"
                className="inline-flex items-center gap-2 rounded-full bg-aurora-violet px-7 py-3.5 font-urbanist text-sm font-semibold text-white transition-[background-color,transform] duration-300 hover:scale-[1.02] hover:bg-aurora-violet-dark"
              >
                About Codeshaper
                <ArrowRight size={15} strokeWidth={1.75} />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
