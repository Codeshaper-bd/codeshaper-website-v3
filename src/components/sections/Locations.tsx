"use client";

import { useEffect, useState, type ComponentType, type SVGProps } from "react";
import { MapPin } from "lucide-react";
import Reveal from "@/components/system/Reveal";
import { SectionEyebrow, SectionTitle, SectionDescription } from "@/components/system/SectionHeading";
import { usePrefersReducedMotion } from "@/lib/motion";
import { textSafeAccent } from "@/lib/color";
import { StatueOfLibertyIcon, ClockTowerIcon, MosqueIcon, PagodaIcon, OperaHouseIcon, FernIcon } from "./LandmarkIcons";
import worldMap from "@/lib/locations-world-map.json";

/**
 * Locations — round 2. Feedback: the previous 4-column region grid
 * (Asia-Pacific/Oceania with 2 stacked cards vs. Americas/UK&Europe with
 * 1) produced badly uneven column heights that read as broken, and the
 * route map floated loosely on the starfield with no real interactivity.
 *
 * Consolidated into one `.glass` panel — same interactive-tab pattern
 * that worked for AI-Driven Development: clicking/hovering a pin OR a
 * tab highlights the other (shared `active` state), and the detail
 * crossfades via `.lens-fade-in` instead of six cards being laid out
 * simultaneously. Only one location's content renders at a time, so the
 * uneven-height problem can't recur. Auto-cycles when idle; hovering the
 * tab row pauses it, a click pins the choice — identical interaction
 * model to AiDevExcellence, reused deliberately for consistency.
 *
 * Street-level addresses are still PLACEHOLDERS ("Street address — TBD")
 * — only the country-level footprint was given — swap for the real
 * registered address per office. Country / role / description / best-for
 * content is real.
 *
 * Round 3: per-country landmark line icons (LandmarkIcons.tsx), inspired
 * by musemind.agency's per-city illustrations — replace the plain dots
 * as the active pin badge, the tab icons, and a hero badge in the detail
 * panel. Deliberately generic silhouettes (not claims about one specific
 * named building) where a country has no single obvious landmark.
 *
 * Round 4, direct feedback: the dark "Earth from space" composition
 * (starfield + glowing horizon arc) didn't land, and the content needed
 * to sit inside a visible rounded card. Replaced the whole thing with
 * the sitewide floating-card pattern instead of a fourth dark attempt:
 * `bg-light-surface p-3 sm:p-4` outer frame + `theme-light rounded-[32px]
 * bg-canvas` section (same as Services/AboutStudio/CaseStudiesExpand),
 * with the route map/tabs/detail content in its own `rounded-[28px]
 * border-hairline bg-light-surface` inner card — the same "white outer
 * section, grey inner content card" relationship ServicesShowcase
 * already uses for its own tab+detail block. `.glass` had a
 * `.theme-light` override already sitting unused in globals.css for
 * exactly this conversion, but every other color in this file was a
 * hardcoded `white/opacity` value (not the semantic `ink` tokens that
 * would have flipped automatically), so the route map's pins/line, the
 * tab row, and the whole detail panel needed recoloring by hand —
 * same exercise as TechStack's own dark-to-light pass.
 *
 * Round 5, direct feedback: "use something like a world map" — the
 * abstract curved line + floating circles wasn't reading as one. Pins
 * now sit on an actual dotted world map (dotted-map, MIT-licensed, real
 * coastline data, computed fully offline — see scripts/generate-
 * locations-map.mjs) instead of hand-picked x/y percentages. That script
 * runs once, geocodes each hub to a real city (New York, London, Dhaka,
 * Tokyo, Sydney, Auckland) with dotted-map's own Mercator projection,
 * and writes the resulting dot grid + pin coordinates to
 * src/lib/locations-world-map.json — a plain ~50KB data file, not the
 * ~700KB country dataset the package itself carries, so nothing heavy
 * ships to the browser. Pins and the background dots now share the
 * exact same coordinate space, so they're guaranteed to line up.
 *
 * Round 6, direct feedback: the map sat directly on the grey content
 * card — dark dots on a grey background read as flat/low-contrast. Gave
 * the map its own white `bg-canvas` inset panel (with two soft accent
 * glows behind it) so it reads as a distinct "screen" instead of
 * blending into the card around it, and bumped dot opacity/size now
 * that they have real contrast to work with. Also re-ran the generator
 * with a `region` lat crop (-50 to 68) to drop the mostly-empty Arctic/
 * Antarctic margins the full world map carried — every real hub sits
 * well inside that band, so nothing relevant is lost, and the map reads
 * as a tighter, more intentional banner instead of a tall world sheet
 * with dead space top and bottom.
 *
 * Animation: the single traveling dot became two (a bright leader plus
 * a fainter trailing "comet" a bit further back on the same path, via
 * a second `animateMotion` with a negative `begin` offset), and the
 * active pin now has an expanding radar-ping ring behind its existing
 * `.dot-pulse` badge — a "broadcasting from this hub" cue, gated on
 * `!reduced` directly (not just the global reduced-motion stylesheet
 * override every other pulse here relies on) since it's rendered
 * conditionally rather than always-mounted-but-CSS-disabled.
 *
 * Round 7, direct feedback: the detail panel needed a real photo of the
 * active country instead of a plain background. Each location now has
 * one — a real, verified, freely-licensed landmark/cityscape photo
 * (Statue of Liberty, Big Ben, a Dhaka skyline, Tokyo Tower, Sydney
 * Opera House, Auckland's waterfront), sourced from Wikimedia Commons
 * and downloaded into public/media/locations/ rather than hotlinked —
 * every candidate was actually opened and looked at before use (not
 * just license-checked) after an earlier session found a keyword image
 * service returning a real identifiable press photo unannounced; a
 * few first-choice files also turned out too low-res or badly composed
 * once actually viewed and were swapped for better alternatives from
 * the same photographer pool. Attribution is credited inline in each
 * entry's `credit` field and rendered as a small caption in the
 * panel's corner, since most of these carry a CC-BY/CC-BY-SA license
 * that requires it (a couple are CC0/public domain and technically
 * don't need it, but crediting everyone the same way is simpler than
 * special-casing two entries and costs nothing).
 *
 * The panel's resting state is the same flat `bg-light-surface` +
 * ink-token text it had before this round, per direct follow-up
 * feedback — the photo, its dark gradient, and the credit caption all
 * sit at `opacity-0` and only fade in on `:hover` (via a `group` on the
 * panel), with every text/tag color carrying a matching `group-hover:`
 * white/glass variant on the same element rather than swapping between
 * two duplicated text blocks. Pure CSS, no hover state in React — the
 * per-location crossfade (`key={active}` + `.lens-fade-in`) is a
 * separate, independent behavior from this hover reveal.
 */
type LocationDetail = {
  id: string;
  country: string;
  region: string;
  regionNote: string;
  role: string;
  short: string;
  bestFor: string[];
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  image: string;
  credit: string;
};

/** West → east, matching real longitude order — pins and tabs share this order. */
const LOCATIONS: LocationDetail[] = [
  {
    id: "usa",
    country: "USA",
    region: "Americas",
    regionNote: "Client proximity",
    role: "Client collaboration hub",
    short: "Supports discovery, planning, and working overlap for North American clients.",
    bestFor: ["MVP sprints", "Roadmap planning", "Ongoing product iteration"],
    icon: StatueOfLibertyIcon,
    image: "/media/locations/usa.jpg",
    credit: "TimothyBarkerJr, CC BY-SA 4.0, via Wikimedia Commons",
  },
  {
    id: "uk",
    country: "UK",
    region: "UK & Europe",
    regionNote: "Client proximity",
    role: "Client collaboration hub",
    short: "Supports European clients with timezone overlap and project coordination.",
    bestFor: ["Product discovery", "Sprint planning", "Delivery oversight"],
    icon: ClockTowerIcon,
    image: "/media/locations/uk.jpg",
    credit: "Julian Herzog, CC BY 4.0, via Wikimedia Commons",
  },
  {
    id: "bangladesh",
    country: "Bangladesh",
    region: "Asia-Pacific",
    regionNote: "Delivery & product execution",
    role: "Delivery hub",
    short: "Product design, engineering, and automation delivery across web, mobile, SaaS, and commerce.",
    bestFor: ["End-to-end builds", "Dedicated development teams", "Ongoing iteration"],
    icon: MosqueIcon,
    image: "/media/locations/bangladesh.jpg",
    credit: "Silver Blue, CC BY-SA 2.0, via Wikimedia Commons",
  },
  {
    id: "japan",
    country: "Japan",
    region: "Asia-Pacific",
    regionNote: "Delivery & product execution",
    role: "Collaboration hub",
    short: "Supports client collaboration and product planning for teams operating in Japan/APAC.",
    bestFor: ["Product planning", "Stakeholder coordination", "Delivery alignment"],
    icon: PagodaIcon,
    image: "/media/locations/japan.jpg",
    credit: "David Kernan, CC BY 4.0, via Wikimedia Commons",
  },
  {
    id: "australia",
    country: "Australia",
    region: "Oceania",
    regionNote: "Timezone overlap",
    role: "Collaboration hub",
    short: "Supports timezone overlap for Australia-based teams and distributed product orgs.",
    bestFor: ["Dedicated team collaboration", "Ongoing roadmap delivery"],
    icon: OperaHouseIcon,
    image: "/media/locations/australia.jpg",
    credit: "Bernard Gagnon, CC BY-SA 3.0, via Wikimedia Commons",
  },
  {
    id: "newzealand",
    country: "New Zealand",
    region: "Oceania",
    regionNote: "Timezone overlap",
    role: "Collaboration hub",
    short: "Supports NZ-based clients with planning, communication, and delivery coordination.",
    bestFor: ["Product support", "Iteration cycles", "Cross-timezone teams"],
    icon: FernIcon,
    image: "/media/locations/newzealand.jpg",
    credit: "Chiara Coetzee, CC0, via Wikimedia Commons",
  },
];

/**
 * Australia and New Zealand's real geographic positions land close
 * enough together at this map's scale that their pin buttons' touch
 * targets overlapped (flagged by Lighthouse: "insufficient space to
 * closest neighbor"). Nudging Australia's pin a few units up/left —
 * away from New Zealand, still well within the Australian mainland at
 * this projection's resolution — gives both pins real clickable
 * separation. Applied here (not just in the button's own render) so
 * the connecting route line and gradient stop move with it instead of
 * pointing at a spot the dot no longer sits on.
 */
const PIN_NUDGE: Record<string, { dx: number; dy: number }> = {
  australia: { dx: -5, dy: -3.5 },
};

const PIN_POS: Record<string, { x: number; y: number }> = Object.fromEntries(
  worldMap.pins.map((p) => {
    const nudge = PIN_NUDGE[p.id] ?? { dx: 0, dy: 0 };
    return [p.id, { x: p.x + nudge.dx, y: p.y + nudge.dy }];
  })
);

const ROUTE_PATH = `M${LOCATIONS.map((p) => `${PIN_POS[p.id].x},${PIN_POS[p.id].y}`).join(" L")}`;

function accentFor(role: string) {
  return role === "Delivery hub" ? "#8a7bff" : "#e8b04e";
}

function RouteMap({ active, onPick }: { active: number; onPick: (i: number) => void }) {
  const reduced = usePrefersReducedMotion();

  return (
    <div className="relative overflow-hidden rounded-[20px] border border-hairline bg-canvas p-4 sm:p-6">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgba(124,108,255,0.13), transparent)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-16 -right-10 h-64 w-64 rounded-full opacity-50 blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgba(232,176,78,0.12), transparent)" }}
      />

      <div className="relative mx-auto w-full max-w-2xl" style={{ aspectRatio: `${worldMap.width} / ${worldMap.height}` }}>
        <svg
          viewBox={`0 0 ${worldMap.width} ${worldMap.height}`}
          className="absolute inset-0 h-full w-full"
          aria-hidden
        >
          <defs>
            <filter id="loc-map-glow" x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur stdDeviation="1" />
            </filter>
            <linearGradient id="loc-route-gradient" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={worldMap.width} y2="0">
              {LOCATIONS.map((p) => (
                <stop key={p.id} offset={`${(PIN_POS[p.id].x / worldMap.width) * 100}%`} stopColor={accentFor(p.role)} />
              ))}
            </linearGradient>
          </defs>
          {worldMap.dots.map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={0.46} fill="rgba(11,15,25,0.18)" />
          ))}
          <path d={ROUTE_PATH} fill="none" stroke="url(#loc-route-gradient)" strokeOpacity="0.6" strokeWidth="0.5" />
          {!reduced && (
            <>
              <circle r="0.7" fill="#0b0f19" filter="url(#loc-map-glow)" opacity="0.35">
                <animateMotion dur="9s" begin="-1.1s" repeatCount="indefinite" path={ROUTE_PATH} />
              </circle>
              <circle r="1" fill="#0b0f19" filter="url(#loc-map-glow)" opacity="0.8">
                <animateMotion dur="9s" repeatCount="indefinite" path={ROUTE_PATH} />
              </circle>
            </>
          )}
        </svg>

        {LOCATIONS.map((p, i) => {
          const isActive = i === active;
          const accent = accentFor(p.role);
          const Icon = p.icon;
          const pos = PIN_POS[p.id];
          return (
            <button
              key={p.country}
              type="button"
              onClick={() => onPick(i)}
              onMouseEnter={() => onPick(i)}
              aria-label={p.country}
              // p-0.5: the visible dot is 22px at rest, under the 24px
              // touch-target minimum. Padding grows the actual hit area
              // without shifting the visual center — translate(-50%,-50%)
              // re-centers on the button's own (now larger) box, so the dot
              // still lands exactly on the pin. Kept modest (not larger) so
              // it doesn't reopen the Australia/NZ overlap the PIN_NUDGE
              // above just fixed.
              className="group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center p-0.5"
              style={{ left: `${(pos.x / worldMap.width) * 100}%`, top: `${(pos.y / worldMap.height) * 100}%` }}
            >
              {isActive ? (
                <span aria-hidden className="relative flex items-center justify-center" style={{ width: 34, height: 34 }}>
                  {!reduced && (
                    <span
                      className="radar-ping absolute inset-0 rounded-full"
                      style={{ backgroundColor: accent }}
                    />
                  )}
                  <span
                    className="dot-pulse relative flex items-center justify-center rounded-full border backdrop-blur-sm transition-transform duration-300 group-hover:scale-105"
                    style={{
                      width: 34,
                      height: 34,
                      color: accent,
                      borderColor: `${accent}55`,
                      backgroundColor: `${accent}22`,
                      boxShadow: `0 0 18px ${accent}88`,
                    }}
                  >
                    <Icon width={18} height={18} strokeWidth={1.6} />
                  </span>
                </span>
              ) : (
                <span
                  aria-hidden
                  className="relative flex items-center justify-center rounded-full border border-black/10 bg-black/[0.03] backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:border-black/20 group-hover:bg-black/[0.06]"
                  style={{ width: 22, height: 22, color: "rgba(11,15,25,0.4)" }}
                >
                  <Icon width={12} height={12} strokeWidth={1.6} />
                </span>
              )}
              {isActive && (
                <span
                  className="absolute top-full mt-2 hidden whitespace-nowrap font-urbanist text-[10.5px] font-semibold uppercase tracking-[0.14em] sm:block"
                  style={{ color: accent }}
                >
                  {p.country}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Locations() {
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const [autoPaused, setAutoPaused] = useState(false);

  useEffect(() => {
    if (reduced || autoPaused) return;
    const id = setInterval(() => setActive((a) => (a + 1) % LOCATIONS.length), 3600);
    return () => clearInterval(id);
  }, [reduced, autoPaused]);

  const pick = (i: number) => {
    setActive(i);
    setAutoPaused(true);
  };

  const current = LOCATIONS[active];
  const accent = accentFor(current.role);
  const CurrentIcon = current.icon;

  return (
    <div className="bg-light-surface p-3 sm:p-4">
      <section
        id="locations"
        className="theme-light relative overflow-hidden rounded-[32px] bg-canvas py-16 lg:py-24"
        aria-labelledby="locations-heading"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "url(/media/hex-pattern-tile.svg)", backgroundSize: "112px 194px" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 top-0 h-[420px] w-[420px] rounded-full opacity-50 blur-3xl"
          style={{ background: "radial-gradient(closest-side, rgba(124,108,255,0.14), transparent)" }}
        />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <SectionEyebrow>Locations</SectionEyebrow>
          <SectionTitle id="locations-heading" className="max-w-md">
            A global footprint built for real timezone overlap.
          </SectionTitle>
          <SectionDescription className="mt-4 max-w-xl">
            One delivery hub and five collaboration hubs, so there's working overlap wherever the client is.
          </SectionDescription>
        </Reveal>

        <Reveal delay={80}>
          <div className="relative mt-10 rounded-[28px] border border-hairline bg-light-surface p-6 sm:p-8 lg:p-10">
            <RouteMap active={active} onPick={pick} />

            <div
              className="mt-8 grid grid-cols-3 gap-2 border-t border-hairline pt-8 sm:flex sm:flex-wrap sm:gap-2"
              onMouseEnter={() => setAutoPaused(true)}
              onMouseLeave={() => setAutoPaused(false)}
            >
              {LOCATIONS.map((loc, i) => {
                const isActive = i === active;
                const a = accentFor(loc.role);
                const Icon = loc.icon;
                return (
                  <button
                    key={loc.country}
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => pick(i)}
                    className="flex items-center justify-center gap-2 rounded-full border px-3.5 py-2 font-urbanist text-[12.5px] font-semibold transition-[background-color,border-color,color,box-shadow,transform] duration-300 hover:-translate-y-0.5 sm:justify-start"
                    style={{
                      borderColor: isActive ? `${a}80` : "rgba(11,15,25,0.12)",
                      backgroundColor: isActive ? `${a}1f` : "transparent",
                      // Raw accent hex (violet/amber) fails 4.5:1 as literal text
                      // on this light background — textSafeAccent derives a
                      // darker, still-recognizable shade. Inactive gray bumped
                      // from 0.55 to 0.62 opacity for the same reason (0.55
                      // measured 4.13:1, just under the 4.5 requirement).
                      color: isActive ? textSafeAccent(a) : "rgba(11,15,25,0.62)",
                      boxShadow: isActive ? `0 6px 20px ${a}33` : "none",
                    }}
                  >
                    <Icon width={15} height={15} strokeWidth={1.6} />
                    {loc.country}
                  </button>
                );
              })}
            </div>

            <div
              key={active}
              className="group lens-fade-in relative mt-7 min-h-[300px] overflow-hidden rounded-[24px] border border-hairline bg-light-surface sm:min-h-[280px]"
            >
              {/* Photo + scrim only show on hover — bg-light-surface above is
                  the resting state ("solid color like before"). Both fade in
                  together via group-hover, and every text color below has a
                  matching group-hover: variant so it reads correctly against
                  either the flat resting background or the photo. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={current.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(100deg, rgba(9,9,11,0.92) 0%, rgba(9,9,11,0.78) 34%, rgba(9,9,11,0.38) 58%, rgba(9,9,11,0.2) 100%)",
                }}
              />

              <div className="relative flex h-full flex-col gap-6 p-6 pb-9 sm:flex-row sm:items-start sm:justify-between sm:p-8">
                <div className="relative flex gap-5">
                  <div
                    className="icon-pop-in relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border backdrop-blur-sm transition-transform duration-300 hover:scale-105 sm:h-[72px] sm:w-[72px]"
                    style={{ borderColor: `${accent}66`, backgroundColor: `${accent}26` }}
                  >
                    <div
                      aria-hidden
                      className="absolute inset-0"
                      style={{ background: `radial-gradient(circle at 30% 20%, ${accent}70, transparent 70%)` }}
                    />
                    <CurrentIcon className="relative sm:hidden" width={26} height={26} strokeWidth={1.4} style={{ color: accent }} />
                    <CurrentIcon className="relative hidden sm:block" width={34} height={34} strokeWidth={1.3} style={{ color: accent }} />
                  </div>

                  <div>
                    <p className="font-urbanist text-[10.5px] font-semibold uppercase tracking-[0.16em] text-ink-faint transition-colors duration-500 group-hover:text-white/55">
                      {current.region}
                      <span className="ml-1.5 font-normal text-ink-faint transition-colors duration-500 group-hover:text-white/40">
                        · {current.regionNote}
                      </span>
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: accent }} aria-hidden />
                      <p className="font-urbanist text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-dim transition-colors duration-500 group-hover:text-white/75">
                        {current.role}
                      </p>
                    </div>
                    <h3 className="mt-1.5 font-urbanist text-[26px] font-bold leading-tight tracking-tight text-ink transition-colors duration-500 group-hover:text-white">
                      {current.country}
                    </h3>
                    <p className="mt-3 max-w-md font-urbanist text-[13.5px] leading-relaxed text-ink-dim transition-colors duration-500 group-hover:text-white/70">
                      {current.short}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {current.bestFor.map((tag) => (
                        <span
                          key={tag}
                          className="flex items-center gap-1.5 rounded-full border border-hairline bg-[#fafafa] px-2.5 py-1 font-urbanist text-[10.5px] text-ink-dim transition-colors duration-500 group-hover:border-white/20 group-hover:bg-white/10 group-hover:text-white/85"
                        >
                          <span className="h-1 w-1 shrink-0 rounded-full" style={{ backgroundColor: accent }} aria-hidden />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="relative flex shrink-0 items-start gap-2 font-urbanist text-[11.5px] leading-relaxed text-ink-faint transition-colors duration-500 group-hover:text-white/55 sm:text-right">
                  <MapPin size={13} strokeWidth={1.75} className="mt-0.5 shrink-0 opacity-60 transition-opacity duration-500 group-hover:opacity-70 sm:order-2" />
                  <span className="sm:order-1">
                    Street address: TBD
                    <br />
                    {current.country}
                  </span>
                </div>
              </div>

              <p className="absolute inset-x-4 bottom-2 font-urbanist text-[9.5px] text-white/0 opacity-0 transition-opacity duration-500 group-hover:text-white/40 group-hover:opacity-100 sm:text-right">
                Photo: {current.credit}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
      </section>
    </div>
  );
}
