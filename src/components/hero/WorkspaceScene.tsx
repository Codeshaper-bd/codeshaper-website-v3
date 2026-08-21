"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/lib/motion";

/**
 * Hero tech-badge cluster — a dark rounded "blob" carrying three tilted
 * white tiles (Next.js, React, TypeScript), hugging the headline's corner.
 * Self-contained: GSAP owns its own entrance (fade/rise) and idle motion
 * (blob breathes, tiles bob independently) — no props, no shared timeline,
 * so Hero.tsx doesn't need to know this component's internals.
 *
 * Reduced motion: renders in its final state immediately, no entrance
 * tween, no idle loop.
 */

function NextjsMark() {
  return (
    <svg width="46" height="46" viewBox="0 0 26 26" aria-hidden>
      <circle cx="13" cy="13" r="13" fill="#000" />
      <path d="M9 8v10h1.8v-7.4L16.4 18H18V8h-1.8v7.4L10.7 8H9z" fill="#fff" />
    </svg>
  );
}

function ReactMark() {
  return (
    <svg width="58" height="58" viewBox="-11 -11 22 22" aria-hidden>
      <circle r="2.4" fill="#087EA4" />
      <g stroke="#087EA4" strokeWidth="1.4" fill="none">
        <ellipse rx="10" ry="4.2" />
        <ellipse rx="10" ry="4.2" transform="rotate(60)" />
        <ellipse rx="10" ry="4.2" transform="rotate(120)" />
      </g>
    </svg>
  );
}

function TypeScriptMark() {
  return (
    <svg width="42" height="42" viewBox="0 0 24 24" aria-hidden>
      <rect width="24" height="24" rx="5" fill="#3178C6" />
      <text
        x="12"
        y="17"
        textAnchor="middle"
        fontSize="12"
        fontWeight="700"
        fill="#fff"
        fontFamily="Arial, sans-serif"
      >
        TS
      </text>
    </svg>
  );
}

function BadgeTile({
  size,
  rotate,
  posClass,
  tileRef,
  children,
}: {
  size: number;
  rotate: number;
  posClass: string;
  tileRef: React.Ref<HTMLDivElement>;
  children: React.ReactNode;
}) {
  return (
    <div
      ref={tileRef}
      className={`absolute flex items-center justify-center rounded-2xl bg-white shadow-[0_10px_28px_rgba(11,15,25,0.16)] ${posClass}`}
      style={{ width: size, height: size, rotate: `${rotate}deg` }}
    >
      {children}
    </div>
  );
}

export default function WorkspaceScene() {
  const reduced = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);
  const tileARef = useRef<HTMLDivElement>(null);
  const tileBRef = useRef<HTMLDivElement>(null);
  const tileCRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced || !rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(rootRef.current, {
        opacity: 0,
        y: 24,
        duration: 0.8,
        delay: 0.5,
        ease: "expo.out",
      });
      gsap.to(blobRef.current, {
        opacity: 0.85,
        duration: 2.6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      [tileARef, tileBRef, tileCRef].forEach((ref, i) => {
        gsap.to(ref.current, {
          y: -6,
          duration: 2.3 + i * 0.3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.35,
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <div
      ref={rootRef}
      data-parallax="cluster"
      aria-hidden
      className="pointer-events-none absolute right-[-40px] top-[449px] z-[5] hidden lg:block xl:right-[60px]"
    >
      <div className="relative h-[210px] w-[320px]">
        {/* dark blob backdrop */}
        <div
          ref={blobRef}
          className="absolute left-[30px] top-0 h-[100px] w-[260px] rounded-full"
          style={{
            background: "linear-gradient(135deg, var(--color-aurora-violet-dark), var(--color-aurora-indigo))",
          }}
        />

        <BadgeTile size={92} rotate={-8} posClass="left-0 top-[55px]" tileRef={tileARef}>
          <NextjsMark />
        </BadgeTile>

        <BadgeTile size={118} rotate={9} posClass="left-[190px] top-[45px]" tileRef={tileBRef}>
          <ReactMark />
        </BadgeTile>

        <BadgeTile size={84} rotate={-5} posClass="left-[95px] top-[85px]" tileRef={tileCRef}>
          <TypeScriptMark />
        </BadgeTile>
      </div>
    </div>
  );
}
