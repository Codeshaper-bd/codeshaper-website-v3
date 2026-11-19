import Reveal from "@/components/system/Reveal";
import { SectionEyebrow, SectionTitle } from "@/components/system/SectionHeading";
import { PALETTES, paletteDelay } from "@/components/hero/heroPalette";
import HeroGlobe from "@/components/hero/HeroGlobe";
import Grain from "@/components/system/Grain";

/**
 * Locations: the hero's globe and light again, closing the page.
 *
 * Deliberately the same as the hero, not a variation: the identical
 * colour-shifting light (`.hg-layer` palettes on the same clock), grain,
 * and the very same <HeroGlobe /> component (pearl globe, served
 * countries, Dhaka HQ pin, tooltips, drag to rotate), cropped by the card's
 * bottom edge, which is the horizon: on the homepage the light footer
 * below continues the glow, mirrored (see Footer `joined`).
 */
const PLACES = [
  { country: "Bangladesh", city: "Dhaka", hq: true },
  { country: "USA", city: "New York" },
  { country: "UK", city: "London" },
  { country: "Japan", city: "Tokyo" },
  { country: "Australia", city: "Sydney" },
  { country: "New Zealand", city: "Auckland" },
];

export default function Locations() {
  return (
    <div className="bg-light-surface px-3 pt-3 sm:px-4 sm:pt-4">
      <section
        id="locations"
        aria-labelledby="locations-heading"
        className="theme-light relative isolate flex flex-col overflow-hidden rounded-t-[32px] bg-white pt-16 lg:pt-24"
      >
        {/* the hero's flowing light, unchanged */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="hg-flow absolute -inset-x-[8%] -bottom-[4%] top-0">
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
          <div className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-[#ffffff] via-[#ffffff]/75 to-transparent" />
          <Grain />
        </div>

        <div className="mx-auto w-full max-w-7xl px-4 text-center sm:px-6 lg:px-10">
          <Reveal>
            <SectionEyebrow className="mx-auto">Locations</SectionEyebrow>
            <SectionTitle id="locations-heading" className="mx-auto max-w-[18ch] text-balance">
              Built in Dhaka. Working with the world.
            </SectionTitle>
          </Reveal>
          <Reveal delay={80}>
            <ul className="mx-auto mt-8 flex max-w-4xl flex-wrap justify-center gap-2" aria-label="Our locations">
              {PLACES.map((p) => (
                <li
                  key={p.country}
                  className="inline-flex items-center gap-2 rounded-full border border-[#0b0f19]/[0.08] bg-white/70 px-3.5 py-2 font-urbanist text-[13px] font-semibold text-ink backdrop-blur-sm"
                >
                  <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${p.hq ? "bg-[#7c5cff]" : "bg-ink/30"}`} />
                  {p.country}
                  <span className="font-medium text-ink-dim">· {p.hq ? "HQ" : p.city}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* the hero's globe, pinned to the bottom edge, cropped by the card */}
        <div className="mt-10 lg:mt-14">
          <HeroGlobe />
        </div>

      </section>
    </div>
  );
}
