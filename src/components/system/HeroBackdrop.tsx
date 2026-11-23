import { PALETTES, paletteDelay } from "@/components/hero/heroPalette";

/**
 * The homepage hero's background, for every page hero (owner, 23 Nov 2026:
 * "the same background and animation as the homepage"). A pale lavender
 * mist, the five-palette flowing light (the same 40s colour cycle), a soft
 * sheen, three drifting fog clouds, a white melt at the top so the card
 * meets the page without a seam, and film grain. The homepage's code-glyph
 * canvas is left out: it belongs to the intro and costs a canvas per page.
 *
 * Put it as the first child of a `relative isolate overflow-hidden` card.
 * CSS only (globals.css: hg-layer, hg-flow, hg-sheen, fog-drift), so it is a
 * server component and still under reduced motion.
 */
const MIST =
  "radial-gradient(ellipse 60% 55% at 38% 62%, rgba(214,206,255,0.55), rgba(214,206,255,0) 70%), radial-gradient(ellipse 50% 50% at 70% 40%, rgba(206,222,255,0.5), rgba(206,222,255,0) 70%), #f4f3f9";

const FOG_BLOBS = [
  { "--d": "18s", left: "4%", top: "38%", width: "46%", height: "52%", background: "rgb(196 186 236 / 0.45)" },
  { "--d": "23s", right: "2%", top: "30%", width: "44%", height: "56%", background: "rgb(186 200 240 / 0.42)" },
  { "--d": "27s", left: "28%", bottom: "-12%", width: "48%", height: "46%", background: "rgb(226 214 250 / 0.6)" },
];

const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export default function HeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute inset-0" style={{ background: MIST }} />
      {/* flowing light, multiply-blended so only the colour shows */}
      <div className="hg-flow absolute -inset-x-[8%] -bottom-[4%] top-0 opacity-[0.72] mix-blend-multiply">
        <div className="absolute inset-0">
          {PALETTES.map((p, i) => (
            <div key={i} className="hg-layer" style={{ background: p.gradient, animationDelay: paletteDelay(i) }} />
          ))}
        </div>
        <div
          className="hg-sheen absolute inset-x-0 bottom-0 h-[60%]"
          style={{ background: "radial-gradient(ellipse 34% 70% at 50% 100%, rgba(255,255,255,0.42), rgba(255,255,255,0) 70%)" }}
        />
      </div>
      {/* drifting fog clouds */}
      {FOG_BLOBS.map((b, i) => (
        <div
          key={i}
          className="fog-blob absolute rounded-full blur-[70px] motion-safe:animate-[fog-drift_var(--d)_ease-in-out_infinite_alternate]"
          style={b as React.CSSProperties}
        />
      ))}
      {/* the top melts into the white page edge */}
      <div className="absolute inset-x-0 top-0 h-[46%] bg-gradient-to-b from-white via-white/80 to-transparent" />
      {/* film grain */}
      <div className="absolute inset-0 opacity-[0.4] mix-blend-overlay" style={{ backgroundImage: NOISE, backgroundSize: "180px 180px" }} />
    </div>
  );
}
