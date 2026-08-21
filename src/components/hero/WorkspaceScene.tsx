"use client";

import { seqStyle } from "@/lib/motion";

/**
 * Hero tech-badge cluster — a dark rounded "blob" carrying three tilted
 * white tiles (Next.js, React, TypeScript), floating beside the hero copy
 * so the hero reads unmistakably as a software studio's stack.
 *
 * Positioned directly within Hero.tsx's <section> (no bounded host box) —
 * the whole cluster is one `.scene-layer` with a `data-depth` that Hero.tsx's
 * pointer-tilt effect reads to drive parallax, and one `seqStyle()` fade/rise
 * entrance shared with every other hero element. Idle bob/pulse motion is
 * plain CSS `animation` (globals.css), disabled under `prefers-reduced-motion`
 * by the shared media-query block there — no JS reduced-motion gate needed.
 */

function NextjsMark() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden>
      <circle cx="13" cy="13" r="13" fill="#000" />
      <path d="M9 8v10h1.8v-7.4L16.4 18H18V8h-1.8v7.4L10.7 8H9z" fill="#fff" />
    </svg>
  );
}

function ReactMark() {
  return (
    <svg width="32" height="32" viewBox="-11 -11 22 22" aria-hidden>
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
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
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
  bobClass,
  posClass,
  children,
}: {
  size: number;
  rotate: number;
  bobClass: string;
  posClass: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`absolute flex items-center justify-center rounded-2xl bg-white shadow-[0_10px_28px_rgba(11,15,25,0.16)] ${bobClass} ${posClass}`}
      style={{ width: size, height: size, rotate: `${rotate}deg` }}
    >
      {children}
    </div>
  );
}

export default function WorkspaceScene({ restIn }: { restIn: boolean }) {
  return (
    <div
      data-depth="0.5"
      aria-hidden
      className="scene-layer pointer-events-none absolute right-[2%] top-[11%] z-[5] hidden lg:block xl:right-[5%] xl:top-[9%]"
      style={seqStyle(restIn, 220)}
    >
      <div className="relative h-[210px] w-[240px]">
        {/* dark blob backdrop */}
        <div
          className="cluster-blob absolute left-[10px] top-[75px] h-[92px] w-[220px] rounded-full"
          style={{
            background: "linear-gradient(135deg, var(--color-aurora-violet-dark), var(--color-aurora-indigo))",
          }}
        />

        <BadgeTile size={56} rotate={-8} bobClass="tile-bob-a" posClass="left-[4px] top-[8px]">
          <NextjsMark />
        </BadgeTile>

        <BadgeTile size={68} rotate={9} bobClass="tile-bob-b" posClass="right-[-6px] top-[56px]">
          <ReactMark />
        </BadgeTile>

        <BadgeTile size={48} rotate={-5} bobClass="tile-bob-c" posClass="left-[46px] bottom-[6px]">
          <TypeScriptMark />
        </BadgeTile>
      </div>
    </div>
  );
}
