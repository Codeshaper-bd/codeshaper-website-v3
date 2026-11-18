import { heroInter } from "./heroFont";
import { PALETTES, paletteDelay } from "./heroPalette";
import HeroGlobe from "./HeroGlobe";
import HeroAsk from "./HeroAsk";

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
 * Server component; the interactive parts are islands: HeroAsk (project
 * prompt that hands off to /contact) and HeroGlobe.
 */
const EYEBROW = "AI Native Software Solution Partner";
const SUBTITLE =
  "We design and engineer AI solutions, digital products, and scalable platforms that transform the way businesses operate and grow.";


/** Monochrome fractal noise, tiled (≈0.5KB inline, no request). */
const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

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

        <div className="mx-auto flex w-full max-w-[1040px] flex-col items-center px-5 xl:max-w-[1240px] pb-10 pt-[120px] text-center sm:px-8 sm:pt-[116px] lg:pb-8 lg:pt-[clamp(100px,14vh,130px)]">
          {/* Eyebrow: small bold pill, one line at every width */}
          <p className="inline-flex max-w-full items-center gap-2 rounded-full border border-[#0b0f19]/[0.08] bg-white/70 px-3 py-1.5 text-[10.5px] font-bold uppercase leading-none tracking-[0.12em] text-[#3f4657] backdrop-blur-sm sm:text-[11px]">
            <span aria-hidden className="h-[5px] w-[5px] shrink-0 rounded-full bg-[#7c5cff]/80" />
            <span className="hero-shimmer">{EYEBROW}</span>
          </p>

          {/* two lines from lg (explicit breaks); natural wrapping below */}
          <h1
            id="hero-heading"
            className="mt-6 text-balance text-[clamp(30px,8.2vw,36px)] font-[560] leading-[1.1] tracking-[-0.025em] text-[#0b0f19] sm:text-[42px] lg:text-[46px] xl:text-[52px] 2xl:text-[56px]"
          >
            <span className="lg:block lg:whitespace-nowrap">From AI automation to scalable </span>
            <span className="lg:block lg:whitespace-nowrap">
              digital products, <span className="text-[#363d4f]">we build the future.</span>
            </span>
          </h1>

          <p className="mt-5 max-w-[560px] text-[16px] leading-[1.65] tracking-[-0.005em] text-[#383f50] sm:mt-6 sm:text-[17px]">
            {SUBTITLE}
          </p>

          {/* project prompt (replaces the CTA buttons and the review capsule) */}
          <div className="mt-8 flex w-full justify-center sm:mt-9">
            <HeroAsk />
          </div>
        </div>

        {/* globe: pinned to the bottom edge, cropped by the card */}
        <div className="mt-auto">
          <HeroGlobe />
        </div>
      </section>
    </div>
  );
}
