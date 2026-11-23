import { heroInter } from "./heroFont";
import { PALETTES, paletteDelay } from "./heroPalette";
import HeroGlobe from "./HeroGlobe";
import HeroAsk from "./HeroAsk";
import HeroIntro from "./intro/HeroIntro";
import HeroGlyphs from "./intro/HeroGlyphs";
import { SERVED } from "./globe/servedCountries";
import Link from "next/link";
import { getAnnouncement, KIND_STYLE } from "@/data/announcement";
import { homeCopy, type CopyOf } from "@/lib/homeCopy";
import { SiFramer, SiUpwork, SiWebflow } from "react-icons/si";

/** Four of the clients in the logo strip below, as a small stack beside the proof line. */
/** Microsoft's four-colour mark (the icon sets only carry it in one colour). */
function MicrosoftMark({ size = 12 }: { size?: number }) {
  return (
    <svg viewBox="0 0 22 22" width={size} height={size}>
      <rect width="10" height="10" fill="#F25022" />
      <rect x="12" width="10" height="10" fill="#7FBA00" />
      <rect y="12" width="10" height="10" fill="#00A4EF" />
      <rect x="12" y="12" width="10" height="10" fill="#FFB900" />
    </svg>
  );
}

/** Each in its brand colour: the mark on its own colour, Microsoft on white. */
const PROOF_MARKS = [
  { icon: MicrosoftMark, name: "Microsoft", bg: "#ffffff", fg: "" },
  { icon: SiWebflow, name: "Webflow", bg: "#146EF5", fg: "#ffffff" },
  { icon: SiUpwork, name: "Upwork", bg: "#14A800", fg: "#ffffff" },
  { icon: SiFramer, name: "Framer", bg: "#0b0f19", fg: "#ffffff" },
];

/** "Trusted by 350+ brands in 33 countries", with the figures set in dark ink. */
function ProofText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\d[\d,.]*\+?)/).map((part, i) => (i % 2 ? <span key={i} className="font-semibold text-[#0b0f19]">{part}</span> : part))}
    </>
  );
}

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
const ANNOUNCEMENT = getAnnouncement();

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
 *
 * Scroll gate: the intro is the page's preloader, so until its 3D mark is
 * on screen ([data-intro-ready], set by HeroIntro) wheel, touch and scroll keys do not
 * move the page; otherwise a visitor could scroll past a half-loaded intro
 * into the content below. The gate opens for good once the mark is ready or
 * cancelled (data-intro removed), or after 15s whatever happens. Typing in
 * fields is never blocked.
 */
const INTRO_SCRIPT = `(function(){try{
var m=window.matchMedia('(min-width:1024px) and (min-height:640px) and (hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)').matches;
if(!m||/[?&]intro=off/.test(location.search)||location.hash)return;
var c=document.createElement('canvas'),gl=c.getContext('webgl2')||c.getContext('webgl');if(!gl)return;
var l=gl.getExtension('WEBGL_lose_context');if(l)l.loseContext();
var r=document.currentScript&&document.currentScript.parentElement;if(!r)return;r.setAttribute('data-intro','');
setTimeout(function(){if(!r.hasAttribute('data-intro-live')&&!r.hasAttribute('data-intro-armed'))r.removeAttribute('data-intro');},${process.env.NODE_ENV === "production" ? 6000 : 30000});
var open=false,K={32:1,33:1,34:1,35:1,36:1,38:1,40:1},T=['wheel','touchmove','keydown','scroll'];
var gate=function(e){if(open)return;
if(!r.hasAttribute('data-intro')||r.hasAttribute('data-intro-ready')){open=true;T.forEach(function(t){window.removeEventListener(t,gate,{capture:true});});return;}
if(e.type==='scroll'){if(window.scrollY>0)window.scrollTo(0,0);return;}
if(e.type==='keydown'&&!K[e.keyCode])return;
var t=e.target;if(e.type==='keydown'&&t&&(t.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)))return;
e.preventDefault();e.stopPropagation();};
T.forEach(function(t){window.addEventListener(t,gate,{capture:true,passive:false});});
setTimeout(function(){open=true;},${process.env.NODE_ENV === "production" ? 15000 : 45000});
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

/** The rating, as a link to its source when there is one. */
function RatingWrap({ href, children }: { href?: string; children: React.ReactNode }) {
  const cls = "inline-flex items-center gap-1.5";
  return (href ?? "").startsWith("https://") ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`${cls} transition-colors duration-200 hover:text-[#0b0f19]`}>
      {children}
    </a>
  ) : (
    <span className={cls}>{children}</span>
  );
}

export default function Hero({ copy }: { copy?: CopyOf<"hero"> }) {
  const c = homeCopy("hero", copy);
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
                className="fog-blob absolute rounded-full blur-[70px] motion-safe:animate-[fog-drift_var(--d)_ease-in-out_infinite_alternate]"
                style={b as React.CSSProperties}
              />
            ))}
            {/* the top melts into the page: white at the very top, fading into
                the mist, so the card meets the white page edges without a seam
                (glyphs stay above it) */}
            <div className="absolute inset-x-0 top-0 h-[46%] bg-gradient-to-b from-white via-white/80 to-transparent" />
            {/* the glyphs fill the card during the intro; on the finished hero
                they step back to the edges, so the copy and the prompt
                sit on a calm surface */}
            <div className="absolute inset-0 opacity-50 transition-opacity duration-700 [mask-image:radial-gradient(ellipse_62%_58%_at_50%_40%,transparent_55%,black_92%)] intro:opacity-100 intro:[mask-image:none]">
              <HeroGlyphs />
            </div>
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
          className="relative z-[2] mx-auto flex w-full max-w-[1040px] flex-col items-center px-5 xl:max-w-[1240px] pb-10 pt-[112px] text-center sm:px-8 sm:pt-[112px] lg:pb-8 lg:pt-[clamp(128px,17vh,200px)]"
          data-hero-column
        >
          {/* Announcement chip: [TAG] text → (data/announcement.ts; the newest
              blog post by default). Without one, the positioning eyebrow. */}
          {ANNOUNCEMENT ? (
            <Link
              href={ANNOUNCEMENT.href}
              data-reveal
              className="group inline-flex max-w-full items-center gap-2 rounded-full border border-[#0b0f19]/[0.08] bg-white/70 py-1 pl-1 pr-3 text-[12px] font-medium leading-none text-[#3f4657] shadow-[0_1px_2px_rgba(11,15,25,0.04)] backdrop-blur-sm transition-[border-color,background-color,box-shadow] duration-300 hover:border-[#615fff]/30 hover:bg-white hover:shadow-[0_4px_14px_-6px_rgba(97,95,255,0.35)]"
            >
              <span
                className="shrink-0 rounded-full px-2 py-[5px] text-[10px] font-bold uppercase leading-none tracking-[0.1em] text-white"
                style={{ backgroundColor: KIND_STYLE[ANNOUNCEMENT.kind].bg }}
              >
                {KIND_STYLE[ANNOUNCEMENT.kind].label}
              </span>
              <span className="min-w-0 truncate">{ANNOUNCEMENT.text}</span>
              <svg aria-hidden viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0 text-[#4f46e5] transition-transform duration-300 ease-out group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </Link>
          ) : (
            <p
              data-reveal
              className="inline-flex max-w-full items-center gap-2 rounded-full border border-[#0b0f19]/[0.08] bg-white/70 px-3 py-1.5 text-[10.5px] font-bold uppercase leading-none tracking-[0.12em] text-[#3f4657] backdrop-blur-sm sm:text-[11px]"
            >
              <span aria-hidden className="h-[5px] w-[5px] shrink-0 rounded-full bg-[#7c5cff]/80" />
              <span className="hero-shimmer">{c.eyebrow}</span>
            </p>
          )}

          {/* two lines from lg (explicit breaks); natural wrapping below */}
          <h1
            id="hero-heading"
            className="mt-6 text-balance text-[clamp(28px,7.6vw,34px)] font-[580] leading-[1.1] tracking-[-0.032em] text-[#0b0f19] sm:text-[40px] lg:text-[44px] xl:text-[48px]"
          >
            <span className="inline-block lg:block lg:whitespace-nowrap" data-reveal>
              {c.line1}
            </span>{" "}
            <span className="inline-block lg:block lg:whitespace-nowrap" data-reveal>
              <span className="text-[#757b8c]">{c.line2}</span>
            </span>
          </h1>

          {c.sub && (
            <p className="mt-5 max-w-[34rem] text-pretty text-[16px] leading-relaxed text-[#4b5263] sm:text-[18px]" data-reveal>
              {c.sub}
            </p>
          )}

          {/* project prompt: the one main action of the hero */}
          <div className="mt-8 flex w-full justify-center sm:mt-9" data-reveal>
            <HeroAsk />
          </div>

          {/* proof at the point of decision, and a quiet way out for people
              who would rather talk than type. The rating shows only once real
              figures are entered in the CMS (Pages › Home › Hero). */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-[13px] leading-none text-[#4b5263] sm:text-[13.5px]" data-reveal>
            <span className="flex w-full flex-col items-center gap-2.5 sm:inline-flex sm:w-auto sm:flex-row">
              <span aria-hidden className="flex -space-x-1.5">
                {PROOF_MARKS.map(({ icon: Icon, name, bg, fg }) => (
                  <span key={name} title={name} className="grid h-7 w-7 place-items-center rounded-full shadow-[0_1px_3px_rgba(11,15,25,0.14)] ring-2 ring-white" style={{ backgroundColor: bg, color: fg || undefined }}>
                    <Icon size={12} />
                  </span>
                ))}
              </span>
              <span>
                <ProofText text={c.proof.replace("{countries}", String(SERVED.length))} />
              </span>
            </span>
            {c.ratingScore && (
              <RatingWrap href={c.ratingHref}>
                <span aria-hidden className="tracking-[0.04em] text-[#f5a524]">★★★★★</span>
                <span className="font-semibold text-[#0b0f19]">{c.ratingScore}</span>
                {c.ratingText && <span>{c.ratingText}</span>}
              </RatingWrap>
            )}
            <span aria-hidden className="hidden h-4 w-px bg-[#0b0f19]/12 sm:block" />
            <Link href="/contact" className="group inline-flex items-center gap-1.5 text-[#4b5263] transition-colors duration-200 hover:text-[#0b0f19]">
              {c.callText}
              <span className="font-semibold text-[#0b0f19] underline decoration-[#0b0f19]/25 underline-offset-[5px] transition-[text-decoration-color] duration-200 group-hover:decoration-[#0b0f19]">{c.callLink}</span>
              <svg aria-hidden viewBox="0 0 16 16" className="h-3.5 w-3.5 text-[#0b0f19] transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </Link>
          </div>
        </div>

        {/* globe: pinned to the bottom edge, cropped by the card */}
        <div className="relative z-[2] mt-auto" data-reveal-globe>
          <HeroGlobe priority />
        </div>
      </section>
    </div>
  );
}
