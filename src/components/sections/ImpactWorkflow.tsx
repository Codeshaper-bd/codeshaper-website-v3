"use client";

import { useEffect, useRef, useState } from "react";
import { SERVED } from "@/components/hero/globe/servedCountries";
import { SectionEyebrow, SectionTitle } from "@/components/system/SectionHeading";
import PhotoCloud, { type CloudPhoto } from "./PhotoCloud";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Numbers + "AI and human workflow" (from the Codeshaper Astro build), after
 * Engagement Models:
 *  1. four figures between hairlines; they count up once when they scroll
 *     into view; the one under the pointer is full ink with a violet accent;
 *  2. the workflow: Request → AI processing → Human review → Action, four
 *     cards on a dashed line over a radial burst of fine lines. A highlight
 *     walks the four steps in a loop (CSS), connectors flow toward the next.
 * White rounded panel (like Client Reviews) between the light Engagement
 * Models and the dotted Tech Stack. Reduced motion: final numbers, no loops.
 *
 * Figures: owner-supplied (years, brands, reviews), CHECK before launch;
 * countries follow the globe's list.
 */
const STATS = [
  { value: "10+", label: "years building software" },
  { value: "350+", label: "brands served" },
  { value: `${SERVED.length}`, label: "countries with clients" },
  { value: "150+", label: "client reviews" },
];


const parse = (v: string) => {
  const m = /^(\d+)(.*)$/.exec(v);
  return m ? { n: Number(m[1]), suffix: m[2] } : { n: 0, suffix: v };
};

/** deterministic burst rays (same markup on server and client) */
/** deterministic burst rays (same markup on server and client) */
function rays() {
  let s = 13;
  const r = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
  return Array.from({ length: 220 }, () => {
    const a = (-170 + r() * 160) * (Math.PI / 180);
    const len = 150 + r() * 230;
    return { x: 600 + Math.cos(a) * len, y: 460 + Math.sin(a) * len, o: 0.3 + r() * 0.6, w: r() > 0.8 ? 1.3 : 0.8, dot: r() > 0.45 };
  });
}
const RAYS = rays();

/**
 * Photo cloud: real CodeShaper studio photos (owner-supplied, retouched:
 * frames trimmed, levels, a little saturation and sharpening;
 * public/media/studio). Throwable (PhotoCloud.tsx), with a light brand tint
 * that cycles with the glow. x/y/w: % of the band; r: aspect ratio.
 */
const S = (slug: string) => `/media/studio/${slug}.webp`;
const PHOTOS: CloudPhoto[] = [
  { src: S("team-hoodies"), alt: "The CodeShaper team in front of the studio wall", x: 35, y: 30, w: 30, r: "1100/696" },
  { src: S("new-year"), alt: "New Year at the CodeShaper studio", x: 11, y: 40, w: 21, r: "1100/825" },
  { src: S("airport"), alt: "The team setting off on the annual tour", x: 68, y: 38, w: 21, r: "1100/786" },
  { src: S("wall-duo"), alt: "Two team members at the CodeShaper wall", x: 23, y: 4, w: 15, r: "708/517" },
  { src: S("desk"), alt: "A developer at his desk", x: 63, y: 0, w: 11, r: "800/1001" },
  { src: S("desk-portrait"), alt: "A designer at her desk", x: 3, y: 10, w: 10, r: "1/1" },
];

/** The five themes, from the Stripe references; one leads every THEME_SLOT seconds (globals.css wf-theme, 30s loop). */
const THEME_SLOT = 6;
const THEMES = [
  { core: "#f6c27a", outer: "#a9cdfb", base: "#f2a65a", tip: "#3b5bdb", dot: "#3b4fe0" }, // blue lines, orange core
  { core: "#8b7dff", outer: "#e6d6ff", base: "#4c6bff", tip: "#a855f7", dot: "#9333ea" }, // violet
  { core: "#ff9fb4", outer: "#ffd08a", base: "#c084fc", tip: "#e11d74", dot: "#db2777" }, // pink on orange
  { core: "#5b9cf0", outer: "#c7defc", base: "#1d4ed8", tip: "#60a5fa", dot: "#2563eb" }, // blue
  { core: "#ffa47a", outer: "#d9b8ff", base: "#fb8a4c", tip: "#7c3aed", dot: "#6d28d9" }, // coral core, violet
];

export default function ImpactWorkflow() {
  const ref = useRef<HTMLDListElement>(null);
  const [active, setActive] = useState(0);
  const [t, setT] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    setT(0);
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const k = Math.min(1, (now - start) / 1300);
          setT(1 - Math.pow(1 - k, 3));
          if (k < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="bg-light-surface p-3 sm:p-4">
    <section aria-labelledby="impact-heading" className="theme-light relative isolate overflow-hidden rounded-[32px] bg-canvas pb-16 pt-16 lg:pb-24 lg:pt-24">
      {/* the light: a large soft glow from the bottom centre, rising behind the
          cards and the numbers (Stripe "backbone"); same five themes and clock
          as the burst lines */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {THEMES.map((th, k) => (
          <div
            key={k}
            className="wf-theme absolute inset-0"
            style={{
              animationDelay: `${k * THEME_SLOT - THEME_SLOT / 2}s`,
              background: `radial-gradient(ellipse 62% 92% at 50% 100%, ${th.core} 0%, ${th.core}cc 14%, ${th.outer} 38%, ${th.outer}66 60%, transparent 82%)`,
            }}
          />
        ))}
        {/* keeps the top heading on near-white */}
        <div className="absolute inset-x-0 top-0 h-[30%] bg-gradient-to-b from-white to-transparent" />
      </div>
      {/* Stripe-style guide lines: the container edges, full height */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-1/2 z-[1] hidden w-[min(calc(100%-32px),80rem)] -translate-x-1/2 border-x border-[#272b3d]/[0.08] md:block"
      />
      {/* 1 · numbers */}
      {/* Stripe-style banner: the team on the annual tour, a cinematic crop
          with a dark wash for the headline and a slow push-in */}
      <div className="mx-auto mb-16 max-w-7xl px-4 sm:px-6 lg:mb-24 lg:px-10">
        <Link
          href="/company/about"
          className="group relative block min-h-[300px] overflow-hidden rounded-[18px] bg-[#1d2130] shadow-[0_30px_60px_-30px_rgba(40,30,110,0.55)] sm:aspect-[1200/400] sm:min-h-0"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- decorative, lazy */}
          <img
            src="/media/studio/beach-tour.webp"
            alt="The CodeShaper team on the annual tour at Cox's Bazar"
            loading="lazy"
            decoding="async"
            className="banner-zoom absolute inset-0 h-full w-full object-cover object-[50%_68%]"
          />
          <div aria-hidden className="absolute inset-0 bg-[linear-gradient(100deg,rgba(14,12,38,0.88)_0%,rgba(14,12,38,0.55)_38%,rgba(14,12,38,0)_68%)]" />
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(70%_90%_at_85%_20%,rgba(168,85,247,0.35),transparent_60%),radial-gradient(60%_80%_at_70%_100%,rgba(249,115,22,0.3),transparent_60%)] mix-blend-soft-light" />
          <div className="relative flex h-full min-h-[300px] flex-col justify-between p-6 sm:min-h-0 sm:p-8 lg:p-10">
            <div>
              <p className="font-display max-w-[16ch] text-[30px] font-semibold leading-[1.08] tracking-[-0.02em] text-white sm:text-[38px] lg:text-[44px]">
                Good teams build great products.
              </p>
              <span className="mt-5 inline-flex h-10 items-center gap-1 rounded-[8px] bg-white px-4 text-[14px] font-semibold text-[#4f46e5] transition-transform duration-300 group-hover:translate-x-0.5">
                Meet the team
                <ArrowRight size={14} strokeWidth={2.2} aria-hidden />
              </span>
            </div>
            <p className="self-end text-[15px] font-semibold tracking-[-0.01em] text-white/90">
              codeShaper <span className="font-normal text-white/70">Annual Tour ’25</span>
            </p>
          </div>
        </Link>
      </div>

      <div className="mb-12 px-4 text-center lg:mb-16">
        <SectionEyebrow className="mx-auto">In numbers</SectionEyebrow>
        <SectionTitle id="impact-heading" className="mx-auto max-w-[22ch] text-balance">
          A decade of shipping software for teams around the world.
        </SectionTitle>
      </div>
      <div className="mx-auto max-w-7xl border-y border-[#272b3d]/10">
        <dl ref={ref} className="grid grid-cols-2 lg:grid-cols-4" onMouseLeave={() => setActive(0)}>
          {STATS.map((s, i) => {
            const { n, suffix } = parse(s.value);
            const on = i === active;
            return (
              <div key={s.label} onMouseEnter={() => setActive(i)} className="relative flex flex-col-reverse items-center gap-2 py-8 text-center lg:py-12">
                {["-top-px", "-bottom-px"].map((pos) => (
                  <span
                    key={pos}
                    aria-hidden
                    className={`absolute left-1/2 h-px w-16 -translate-x-1/2 bg-[#615fff] transition-opacity duration-300 ${pos} ${on ? "opacity-100" : "opacity-0"}`}
                  />
                ))}
                <dt className={`text-[14px] transition-colors duration-300 ${on ? "text-[#5d6274]" : "text-[#8b90a0]"}`}>{s.label}</dt>
                <dd className={`text-[clamp(36px,4.6vw,56px)] font-medium leading-none tracking-[-0.035em] tabular-nums transition-colors duration-300 ${on ? "text-[#272b3d]" : "text-[#272b3d]/45"}`}>
                  <span aria-hidden>
                    {Math.round(n * t)}
                    {suffix}
                  </span>
                  <span className="sr-only">{s.value}</span>
                </dd>
              </div>
            );
          })}
        </dl>
      </div>

      {/* 2 · workflow over a radial burst */}
      <div className="relative mt-16 lg:mt-24">

        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-10">
        </div>
        {PHOTOS.length > 0 ? (
          /* the team, floating: pick a photo up and throw it; the current
             theme tints each one, so they shift colour with the glow */
          <PhotoCloud
            photos={PHOTOS}
            className="mx-auto -mb-16 mt-10 aspect-[1200/460] w-full max-w-[1200px] lg:-mb-24"
            tint={() =>
              <div className="absolute inset-0 opacity-30">{THEMES.map((th, k) => (
                <div
                  key={k}
                  aria-hidden
                  className="wf-theme absolute inset-0 mix-blend-color"
                  style={{ animationDelay: `${k * THEME_SLOT - THEME_SLOT / 2}s`, background: `linear-gradient(120deg, ${th.tip}, ${th.base} 55%, ${th.core})` }}
                />
              ))}</div>
            }
          />
        ) : (
          <>
        {/* the burst: five colour themes (Stripe "backbone" references) crossfading
            in an endless loop; same rays, each theme its own glow and colours */}
        <svg aria-hidden className="absolute h-0 w-0">
          <defs>
            <linearGradient id="wf-rays-fade-g" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#fff" stopOpacity="0" />
              <stop offset="0.5" stopColor="#fff" stopOpacity="0.9" />
              <stop offset="0.75" stopColor="#fff" stopOpacity="1" />
            </linearGradient>
            <mask id="wf-rays-fade" maskContentUnits="userSpaceOnUse">
              <rect width="1200" height="680" fill="url(#wf-rays-fade-g)" />
            </mask>
          </defs>
        </svg>
        <div aria-hidden className="wf-burst pointer-events-none relative mx-auto -mb-16 mt-10 aspect-[1200/460] w-full max-w-[1200px] lg:-mb-24">
          {THEMES.map((th, k) => (
            <svg
              key={k}
              className="wf-theme absolute inset-0 h-full w-full"
              style={{ animationDelay: `${k * THEME_SLOT - THEME_SLOT / 2}s` }}
              viewBox="0 0 1200 460"
              preserveAspectRatio="xMidYMax meet"
            >
              <defs>
                <radialGradient id={`wf-glow-${k}`} cx="0.5" cy="1" r="0.46" gradientTransform="translate(0.5 1) scale(1 2.2) translate(-0.5 -1)">
                  <stop offset="0" stopColor={th.core} stopOpacity="0.95" />
                  <stop offset="0.32" stopColor={th.core} stopOpacity="0.55" />
                  <stop offset="0.6" stopColor={th.outer} stopOpacity="0.55" />
                  <stop offset="1" stopColor={th.outer} stopOpacity="0" />
                </radialGradient>
                <linearGradient id={`wf-ray-${k}`} gradientUnits="userSpaceOnUse" x1="600" y1="460" x2="600" y2="60">
                  <stop offset="0" stopColor={th.base} />
                  <stop offset="1" stopColor={th.tip} />
                </linearGradient>
              </defs>
              
              <g>
              {RAYS.map((p, i) => (
                <g key={i} opacity={p.o}>
                  <line x1="600" y1="460" x2={p.x} y2={p.y} stroke={`url(#wf-ray-${k})`} strokeWidth={p.w} />
                  {p.dot && <circle cx={p.x} cy={p.y} r="1.8" fill={th.dot} />}
                </g>
              ))}
              </g>
            </svg>
          ))}
        </div>
          </>
        )}
      </div>
    </section>
    </div>
  );
}
