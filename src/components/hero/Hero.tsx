import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { SiEnvato } from "react-icons/si";
import type { IconType } from "react-icons";
import { heroInter } from "./heroFont";
import { PALETTES, paletteDelay } from "./heroPalette";
import HeroGlobe from "./HeroGlobe";

/**
 * Hero: centred copy above a flowing light that rises from the bottom
 * centre of the card and moves through five palettes, endlessly.
 *
 * Built for smoothness on any device: every palette is its own pre-painted
 * gradient layer, and only opacity/transform animate (compositor work, no
 * per-frame repaint). See globals.css "Hero: flowing light" for timing.
 *
 * Layout is content-driven, not full-screen: responsive top padding
 * (shrinks on short viewports) sets the gap under the navigation, and the
 * bottom padding reserves room for the light below the actions.
 *
 * Hero copy uses Inter (heroFont.ts); the header and the rest of the site
 * stay on Urbanist. `theme-light` scopes the site's light tokens here, which
 * also gives the global :focus-visible ring a dark, visible colour.
 *
 * No client JS, so this is a server component. Copy, CTA labels and
 * destinations are unchanged.
 */
const EYEBROW = "AI Automation · Digital Products · Scalable Platforms";
const SUBTITLE =
  "We design and engineer AI solutions, digital products, and scalable platforms that transform the way businesses operate and grow.";


/** Monochrome fractal noise, tiled (≈0.5KB inline, no request). */
const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

/**
 * Ratings shown under the actions. Figures as published on codeshaper.net
 * (Google: 5.0 from 45 reviews; Envato Elite Author: 4.9 from 149 reviews).
 * Update these by hand when the review counts change.
 */
const RATINGS: { source: string; icon: IconType; iconColor?: string; title: string; score: string; detail: string }[] = [
  { source: "google", icon: FcGoogle, title: "5.0", score: "5.0", detail: "45 Google reviews" },
  { source: "envato", icon: SiEnvato, iconColor: "#81b441", title: "Elite Author · 4.9", score: "4.9", detail: "149 Envato reviews" },
];

function Stars() {
  return (
    <span aria-hidden className="flex gap-[1px] text-[#f5a524]">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} size={12} fill="currentColor" strokeWidth={0} />
      ))}
    </span>
  );
}

/** Shared control styling: 48px height, equal padding, same type and arrow. */
const cta =
  "group inline-flex h-12 flex-1 basis-[150px] items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 text-[15px] font-semibold tracking-[-0.005em] transition-[background-color,border-color,box-shadow,transform] duration-200 active:scale-[0.98] sm:flex-none";

export default function Hero() {
  return (
    <div className="bg-white p-3 sm:p-4">
      <section
        aria-labelledby="hero-heading"
        className={`theme-light relative isolate flex flex-col overflow-hidden rounded-[28px] bg-[#ffffff] sm:rounded-[32px] lg:min-h-[calc(100svh-32px)] ${heroInter.className}`}
      >
        {/* flowing light (decorative; never intercepts pointer events) */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="hg-flow absolute -inset-x-[8%] -bottom-[4%] top-0">
            <div className="absolute inset-0">
              {PALETTES.map((p, i) => (
                <div
                  key={i}
                  className="hg-layer"
                  style={{ background: p.gradient, animationDelay: paletteDelay(i) }}
                />
              ))}
            </div>
            {/* a soft highlight wave travelling across the light */}
            <div
              className="hg-sheen absolute inset-x-0 bottom-0 h-[60%]"
              style={{
                background:
                  "radial-gradient(ellipse 34% 70% at 50% 100%, rgba(255,255,255,0.42), rgba(255,255,255,0) 70%)",
              }}
            />
          </div>
          {/* keeps the reading area calm: the light fades out well below the copy */}
          <div className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-[#ffffff] via-[#ffffff]/75 to-transparent" />
          {/* film grain: static SVG noise tile, overlay-blended so it only
              textures the coloured light and vanishes on the white top */}
          <div
            className="absolute inset-0 opacity-[0.4] mix-blend-overlay"
            style={{ backgroundImage: NOISE, backgroundSize: "180px 180px" }}
          />
        </div>

        <div className="mx-auto flex w-full max-w-[1040px] flex-col items-center px-5 xl:max-w-[1240px] pb-10 pt-[120px] text-center sm:px-8 sm:pt-[136px] lg:pb-8 lg:pt-[clamp(124px,17vh,160px)]">
          {/* Eyebrow: plain, balanced two-line label on phones; subtle pill from sm */}
          <p className="max-w-[300px] text-balance text-[11px] font-medium uppercase leading-[1.6] tracking-[0.1em] text-[#525a6c] sm:inline-flex sm:max-w-none sm:items-center sm:gap-2 sm:rounded-full sm:border sm:border-[#0b0f19]/[0.08] sm:bg-white/70 sm:px-3.5 sm:py-1.5 sm:text-[12px] sm:leading-none sm:tracking-[0.12em] sm:backdrop-blur-sm">
            <span aria-hidden className="hidden h-[5px] w-[5px] shrink-0 rounded-full bg-[#7c5cff]/80 sm:block" />
            <span className="hero-shimmer">{EYEBROW}</span>
          </p>

          {/* two lines from lg (explicit breaks); natural wrapping below */}
          <h1
            id="hero-heading"
            className="mt-6 text-balance text-[clamp(34px,9.6vw,42px)] font-[560] leading-[1.1] tracking-[-0.025em] text-[#0b0f19] sm:mt-7 sm:text-[48px] lg:text-[52px] xl:text-[58px] 2xl:text-[64px]"
          >
            <span className="lg:block lg:whitespace-nowrap">From AI automation to scalable </span>
            <span className="lg:block lg:whitespace-nowrap">
              digital products, <span className="text-[#363d4f]">we build the future.</span>
            </span>
          </h1>

          <p className="mt-6 max-w-[600px] text-[17px] leading-[1.65] tracking-[-0.005em] text-[#383f50] sm:mt-7 sm:text-[18px] lg:text-[19px]">
            {SUBTITLE}
          </p>

          <div className="mt-8 flex w-full max-w-[380px] flex-wrap items-center justify-center gap-3 sm:max-w-none">
            <Link
              href="/contact"
              className={`${cta} bg-[#0b0f19] text-white shadow-[0_1px_2px_rgba(11,15,25,0.18),0_4px_12px_-6px_rgba(11,15,25,0.35)] hover:bg-[#262b3a]`}
            >
              Book a Call
              <ArrowRight size={16} strokeWidth={2} aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/services"
              className={`${cta} border border-[#0b0f19]/[0.12] bg-white/85 text-[#0b0f19] backdrop-blur-sm hover:border-[#0b0f19]/25 hover:bg-white`}
            >
              Explore Services
              <ArrowRight size={16} strokeWidth={2} aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* ratings: a quiet capsule so it reads on every gradient state.
              Phones: a two-column card, each rating centred with its stars
              on their own line. From sm: one row with a hairline divider. */}
          <ul
            aria-label="Client ratings"
            className="mt-8 grid w-full max-w-[340px] grid-cols-2 divide-x divide-[#0b0f19]/10 rounded-2xl border border-[#0b0f19]/[0.07] bg-white/75 py-3 backdrop-blur-sm sm:mt-9 sm:flex sm:w-auto sm:max-w-none sm:divide-x-0 sm:rounded-full sm:px-5 sm:py-2.5"
          >
            {RATINGS.map((r, i) => (
              <li key={r.source} className="flex flex-col items-center gap-1 px-2 text-center sm:flex-row sm:gap-2.5 sm:px-0 sm:text-left">
                {i > 0 && <span aria-hidden className="mx-5 hidden h-7 w-px bg-[#0b0f19]/10 sm:block" />}
                <r.icon size={20} aria-hidden className="shrink-0" style={r.iconColor ? { color: r.iconColor } : undefined} />
                <span className="leading-tight">
                  <span className="flex flex-col items-center gap-1 text-[13px] font-semibold text-[#0b0f19] sm:flex-row sm:gap-1.5 sm:text-[14px]">
                    {r.title}
                    <Stars />
                    <span className="sr-only">Rated {r.score} out of 5</span>
                  </span>
                  <span className="mt-0.5 block text-[11.5px] text-[#4b5263] sm:mt-0 sm:text-[12.5px]">{r.detail}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* globe: pinned to the bottom edge, cropped by the card */}
        <div className="mt-auto">
          <HeroGlobe />
        </div>
      </section>
    </div>
  );
}
