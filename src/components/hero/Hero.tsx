import { heroInter } from "./heroFont";
import { PALETTES, paletteDelay } from "./heroPalette";
import HeroGlobe from "./HeroGlobe";
import HeroAsk from "./HeroAsk";
import HeroIntro from "./intro/HeroIntro";
import HeroGlyphs from "./intro/HeroGlyphs";
import { SERVED } from "./globe/servedCountries";

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
 * Scroll intro (desktop only, intro/HeroIntro.tsx): the card first shows the
 * scattered 3D pieces of the Codeshaper mark in a lavender mist with drifting
 * code glyphs; scrolling assembles the mark, then the mist lifts and this
 * hero (copy, light, globe) rises in. The finished state is exactly the
 * normal hero: no logo above the headline. The `intro:` variant styles apply
 * only while [data-hero][data-intro] is set (by the inline script below; not
 * on <html>, whose attributes React resets when it hydrates).
 *
 * Hero copy uses Inter (heroFont.ts); the header and the rest of the site
 * stay on Urbanist. `theme-light` scopes the site's light tokens here, which
 * also gives the global :focus-visible ring a dark, visible colour.
 *
 * Server component; the interactive parts are islands: HeroAsk (project
 * prompt that hands off to /contact), HeroGlobe and the intro.
 */
const EYEBROW = "AI Native Software Solution Partner";

/**
 * Intro footer figures. Years, brands and reviews: owner-supplied
 * (18 Nov 2026, "10+ years, 350+ brands, 150+ reviews"); CHECK before
 * launch. Countries follow the globe's list so the two never disagree.
 */
const INTRO_STATS = [
  { value: "10+", label: "years" },
  { value: "350+", label: "brands" },
  { value: `${SERVED.length}`, label: "countries" },
  { value: "150+", label: "reviews" },
];

/**
 * Decides before first paint whether the scroll intro runs, so the content
 * never flashes. A safety timer cancels it if the island has not taken over
 * within 6s (slow network or a failed chunk; 30s in dev, where chunks compile on demand). ?intro=off previews the
 * finished hero.
 */
const INTRO_SCRIPT = `(function(){try{
var m=window.matchMedia('(min-width:1024px) and (min-height:640px) and (hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)').matches;
if(!m||/[?&]intro=off/.test(location.search)||location.hash)return;
var c=document.createElement('canvas'),gl=c.getContext('webgl2')||c.getContext('webgl');if(!gl)return;
var l=gl.getExtension('WEBGL_lose_context');if(l)l.loseContext();
var r=document.currentScript&&document.currentScript.parentElement;if(!r)return;r.setAttribute('data-intro','');
setTimeout(function(){if(!r.hasAttribute('data-intro-live'))r.removeAttribute('data-intro');},${process.env.NODE_ENV === "production" ? 6000 : 30000});
}catch(e){}})();`;

/** The mist behind the hero (and its intro): pale lavender and sky. */
const MIST =
  "radial-gradient(ellipse 60% 55% at 38% 62%, rgba(214,206,255,0.55), rgba(214,206,255,0) 70%), radial-gradient(ellipse 50% 50% at 70% 40%, rgba(206,222,255,0.5), rgba(206,222,255,0) 70%), #f4f3f9";

/** Hero fog: three large blurred lavender clouds drifting slowly. */
const FOG_BLOBS = [
  { "--d": "18s", left: "4%", top: "38%", width: "46%", height: "52%", background: "rgb(196 186 236 / 0.45)" },
  { "--d": "23s", right: "2%", top: "30%", width: "44%", height: "56%", background: "rgb(186 200 240 / 0.42)" },
  { "--d": "27s", left: "28%", bottom: "-12%", width: "48%", height: "46%", background: "rgb(226 214 250 / 0.6)" },
];

/** Handshake captions in the intro (Human from the left, AI from the right). */
const HAND_LABELS = [
  { text: "Human", left: true },
  { text: "AI", left: false },
];

/** Monochrome fractal noise, tiled (≈0.5KB inline, no request). */
const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export default function Hero() {
  return (
    <div className="bg-white px-3 pb-3 sm:px-4 sm:pb-4" data-hero suppressHydrationWarning>
      <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
      <section
        aria-labelledby="hero-heading"
        className={`theme-light relative isolate flex flex-col overflow-hidden rounded-b-[28px] bg-[#ffffff] sm:rounded-b-[32px] lg:min-h-[calc(100svh-16px)] intro:h-[calc(100svh-16px)] ${heroInter.className}`}
      >
        {/* Background (decorative; never intercepts pointer events), the same
            for the intro and the hero (owner request): a pale lavender mist,
            the hero's flowing colour light as a faint tint inside it,
            drifting fog clouds and code glyphs on top, then film grain. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0" style={{ background: MIST }} />
          {/* flowing light: the five palettes, still changing colour; multiply-blended,
              so their white tops leave the mist untouched and only the colour shows */}
          <div className="absolute inset-0" data-hero-light>
          <div className="hg-flow absolute -inset-x-[8%] -bottom-[4%] top-0 opacity-[0.72] mix-blend-multiply">
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
          </div>
          {/* drifting lavender fog clouds (from the Codeshaper Astro build) and
              code glyphs */}
          <div className="absolute inset-0" data-hero-fog>
            {FOG_BLOBS.map((b, i) => (
              <div
                key={i}
                className="absolute rounded-full blur-[70px] motion-safe:animate-[fog-drift_var(--d)_ease-in-out_infinite_alternate]"
                style={b as React.CSSProperties}
              />
            ))}
            {/* the top melts into the page: white at the very top, fading into
                the mist, so the card meets the white page edges without a seam
                (glyphs stay above it) */}
            <div className="absolute inset-x-0 top-0 h-[46%] bg-gradient-to-b from-white via-white/80 to-transparent" />
            <HeroGlyphs />
          </div>
          {/* film grain: static SVG noise tile, overlay-blended so it only
              textures the coloured light and vanishes on the white top */}
          <div
            className="absolute inset-0 opacity-[0.4] mix-blend-overlay"
            style={{ backgroundImage: NOISE, backgroundSize: "180px 180px" }}
          />
        </div>

        {/* intro stage: the 3D mark fills the card while the intro runs */}
        <div className="absolute inset-0 z-[1] hidden [container-type:size] intro:block" data-hero-stage>
          {/* halftone handshake (driven by HeroIntro), same 1200 x 700 "meet" box as the mark */}
          <canvas aria-hidden className="pointer-events-none absolute inset-0 z-10 h-full w-full" data-hero-hands />
          {/* captions for the handshake */}
          {HAND_LABELS.map(({ text, left }) => (
            <span
              key={text}
              aria-hidden
              className={`pointer-events-none absolute top-[calc(50%+min(12.5cqw,21.4cqh))] z-10 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[#5b6170] opacity-0 ${
                left ? "left-[calc(50%-min(25cqw,42.8cqh))]" : "right-[calc(50%-min(25cqw,42.8cqh))] flex-row-reverse"
              }`}
              data-hand-label
            >
              <span className={`h-1.5 w-1.5 rounded-full ${left ? "bg-[#c58ad8]" : "bg-[#615fff]"}`} />
              {text}
            </span>
          ))}
          <HeroIntro />
        </div>

        {/* intro footer: figures counting up, the scroll cue, "Skip intro" */}
        <div
          className="absolute inset-x-[4%] bottom-6 z-[3] hidden grid-cols-[1fr_auto_1fr] items-center gap-6 border-t border-[#0b0f19]/[0.08] pt-4 intro:grid"
          data-hero-intro
        >
          <ul aria-hidden className="flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-[11px] uppercase tracking-[0.08em] text-[#5b6170]">
            {INTRO_STATS.map((s) => (
              <li key={s.label} className="flex items-baseline gap-1.5" data-intro-chip>
                <span
                  className="text-[13px] font-semibold tabular-nums tracking-normal text-[#0b0f19]"
                  data-intro-count={s.value.replace(/\D/g, "")}
                  data-intro-suffix={s.value.replace(/^\d+/, "")}
                >
                  {s.value}
                </span>
                {s.label}
              </li>
            ))}
          </ul>
          <span aria-hidden className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#5b6170]">
            Scroll to shape it
          </span>
          <a
            href="#hero-heading"
            className="justify-self-end font-mono text-[11px] uppercase tracking-[0.14em] text-[#383f50] underline-offset-4 hover:text-[#0b0f19] hover:underline"
            data-hero-skip
          >
            Skip intro
          </a>
        </div>

        <div
          className="relative z-[2] mx-auto flex w-full max-w-[1040px] flex-col items-center px-5 xl:max-w-[1240px] pb-10 pt-[120px] text-center sm:px-8 sm:pt-[116px] lg:pb-8 lg:pt-[clamp(150px,22vh,230px)]"
          data-hero-column
        >
          {/* Eyebrow: small bold pill, one line at every width */}
          <p
            data-reveal
            className="inline-flex max-w-full items-center gap-2 rounded-full border border-[#0b0f19]/[0.08] bg-white/70 px-3 py-1.5 text-[10.5px] font-bold uppercase leading-none tracking-[0.12em] text-[#3f4657] backdrop-blur-sm sm:text-[11px]"
          >
            <span aria-hidden className="h-[5px] w-[5px] shrink-0 rounded-full bg-[#7c5cff]/80" />
            <span className="hero-shimmer">{EYEBROW}</span>
          </p>

          {/* two lines from lg (explicit breaks); natural wrapping below */}
          <h1
            id="hero-heading"
            className="mt-6 text-balance text-[clamp(26px,6.9vw,30px)] font-[560] leading-[1.14] tracking-[-0.025em] text-[#0b0f19] sm:text-[34px] lg:text-[38px] xl:text-[41px] 2xl:text-[44px]"
          >
            <span className="inline-block lg:block lg:whitespace-nowrap" data-reveal>
              From AI automation to scalable software,
            </span>{" "}
            <span className="inline-block lg:block lg:whitespace-nowrap" data-reveal>
              <span className="text-[#363d4f]">we build what grows your business.</span>
            </span>
          </h1>

          {/* project prompt (replaces the CTA buttons and the review capsule) */}
          <div className="mt-9 flex w-full justify-center sm:mt-10" data-reveal>
            <HeroAsk />
          </div>
        </div>

        {/* globe: pinned to the bottom edge, cropped by the card */}
        <div className="relative z-[2] mt-auto" data-reveal-globe>
          <HeroGlobe />
        </div>
      </section>
    </div>
  );
}
