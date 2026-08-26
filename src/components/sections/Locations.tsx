"use client";

import { useEffect, useState, type ComponentType, type SVGProps } from "react";
import { MapPin } from "lucide-react";
import Reveal from "@/components/system/Reveal";
import { SectionEyebrow, SectionTitle, SectionDescription } from "@/components/system/SectionHeading";
import { usePrefersReducedMotion } from "@/lib/motion";
import { StatueOfLibertyIcon, ClockTowerIcon, MosqueIcon, PagodaIcon, OperaHouseIcon, FernIcon } from "./LandmarkIcons";

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
 */
type LocationDetail = {
  country: string;
  region: string;
  regionNote: string;
  role: string;
  short: string;
  bestFor: string[];
  x: number;
  y: number;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

/** West → east, matching real longitude order — pins and tabs share this order. */
const LOCATIONS: LocationDetail[] = [
  {
    country: "USA",
    region: "Americas",
    regionNote: "Client proximity",
    role: "Client collaboration hub",
    short: "Supports discovery, planning, and working overlap for North American clients.",
    bestFor: ["MVP sprints", "Roadmap planning", "Ongoing product iteration"],
    x: 6,
    y: 38,
    icon: StatueOfLibertyIcon,
  },
  {
    country: "UK",
    region: "UK & Europe",
    regionNote: "Client proximity",
    role: "Client collaboration hub",
    short: "Supports European clients with timezone overlap and project coordination.",
    bestFor: ["Product discovery", "Sprint planning", "Delivery oversight"],
    x: 24,
    y: 29.8,
    icon: ClockTowerIcon,
  },
  {
    country: "Bangladesh",
    region: "Asia-Pacific",
    regionNote: "Delivery & product execution",
    role: "Delivery hub",
    short: "Product design, engineering, and automation delivery across web, mobile, SaaS, and commerce.",
    bestFor: ["End-to-end builds", "Dedicated product teams", "Ongoing iteration"],
    x: 42,
    y: 24.7,
    icon: MosqueIcon,
  },
  {
    country: "Japan",
    region: "Asia-Pacific",
    regionNote: "Delivery & product execution",
    role: "Collaboration hub",
    short: "Supports client collaboration and product planning for teams operating in Japan/APAC.",
    bestFor: ["Product planning", "Stakeholder coordination", "Delivery alignment"],
    x: 60,
    y: 24.7,
    icon: PagodaIcon,
  },
  {
    country: "Australia",
    region: "Oceania",
    regionNote: "Timezone overlap",
    role: "Collaboration hub",
    short: "Supports timezone overlap for Australia-based teams and distributed product orgs.",
    bestFor: ["Dedicated team collaboration", "Ongoing roadmap delivery"],
    x: 78,
    y: 29.8,
    icon: OperaHouseIcon,
  },
  {
    country: "New Zealand",
    region: "Oceania",
    regionNote: "Timezone overlap",
    role: "Collaboration hub",
    short: "Supports NZ-based clients with planning, communication, and delivery coordination.",
    bestFor: ["Product support", "Iteration cycles", "Cross-timezone teams"],
    x: 96,
    y: 38,
    icon: FernIcon,
  },
];

const ROUTE_PATH = `M${LOCATIONS.map((p) => `${p.x},${p.y}`).join(" L")}`;

function accentFor(role: string) {
  return role === "Delivery hub" ? "#7c6cff" : "#e8b04e";
}

function RouteMap({ active, onPick }: { active: number; onPick: (i: number) => void }) {
  const reduced = usePrefersReducedMotion();

  return (
    <div className="relative h-[170px] w-full sm:h-[210px] lg:h-[250px]">
      <svg viewBox="0 0 100 60" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <filter id="loc-map-glow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="1" />
          </filter>
          <linearGradient id="loc-route-gradient" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100" y2="0">
            {LOCATIONS.map((p, i) => (
              <stop key={p.country} offset={`${p.x}%`} stopColor={accentFor(p.role)} />
            ))}
          </linearGradient>
        </defs>
        <path d={ROUTE_PATH} fill="none" stroke="url(#loc-route-gradient)" strokeOpacity="0.3" strokeWidth="0.6" />
        {!reduced && (
          <circle r="1.1" fill="#ffffff" filter="url(#loc-map-glow)" opacity="0.85">
            <animateMotion dur="7s" repeatCount="indefinite" path={ROUTE_PATH} />
          </circle>
        )}
      </svg>

      {LOCATIONS.map((p, i) => {
        const isActive = i === active;
        const accent = accentFor(p.role);
        const Icon = p.icon;
        return (
          <button
            key={p.country}
            type="button"
            onClick={() => onPick(i)}
            onMouseEnter={() => onPick(i)}
            aria-label={p.country}
            className="group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            {isActive ? (
              <span
                aria-hidden
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
            ) : (
              <span
                aria-hidden
                className="relative flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:border-white/25 group-hover:bg-white/[0.08]"
                style={{ width: 22, height: 22, color: "rgba(255,255,255,0.4)" }}
              >
                <Icon width={12} height={12} strokeWidth={1.6} />
              </span>
            )}
            <span
              className="absolute top-full mt-2 hidden whitespace-nowrap font-urbanist text-[10.5px] font-semibold uppercase tracking-[0.14em] transition-colors duration-300 sm:block"
              style={{ color: isActive ? accent : "rgba(255,255,255,0.4)" }}
            >
              {p.country}
            </span>
          </button>
        );
      })}
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
    <section
      id="locations"
      className="relative overflow-hidden bg-canvas py-16 lg:py-32"
      aria-labelledby="locations-heading"
    >
      {/* ── Earth-from-space composition (CSS/SVG, static) ── */}
      <div aria-hidden className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 0%, #101024 0%, #0A0A0F 55%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-40 max-lg:hidden"
          style={{
            backgroundImage:
              "radial-gradient(1px 1px at 12% 22%, rgba(255,255,255,0.6) 50%, transparent 51%), radial-gradient(1px 1px at 34% 8%, rgba(255,255,255,0.4) 50%, transparent 51%), radial-gradient(1.5px 1.5px at 58% 30%, rgba(255,255,255,0.5) 50%, transparent 51%), radial-gradient(1px 1px at 76% 14%, rgba(255,255,255,0.35) 50%, transparent 51%), radial-gradient(1px 1px at 90% 40%, rgba(255,255,255,0.45) 50%, transparent 51%), radial-gradient(1.5px 1.5px at 22% 45%, rgba(255,255,255,0.3) 50%, transparent 51%), radial-gradient(1px 1px at 47% 18%, rgba(255,255,255,0.5) 50%, transparent 51%), radial-gradient(1px 1px at 65% 50%, rgba(255,255,255,0.3) 50%, transparent 51%)",
          }}
        />
        <div
          className="horizon-pulse absolute left-1/2 top-full h-[130vw] w-[220vw] -translate-x-1/2 -translate-y-[16%] rounded-[50%] lg:-translate-y-[22%]"
          style={{
            background:
              "radial-gradient(closest-side, #27272a 0%, #18181b 78%, #0A0A0F 100%)",
            boxShadow:
              "0 -2px 40px rgba(255,255,255,0.14), 0 -12px 90px rgba(255,255,255,0.1), 0 -30px 180px rgba(255,255,255,0.06), 0 -60px 280px rgba(255,255,255,0.03)",
          }}
        />
        <div
          className="absolute left-1/2 top-full h-[130vw] w-[220vw] -translate-x-1/2 -translate-y-[16%] rounded-[50%] lg:-translate-y-[22%]"
          style={{
            border: "1.5px solid transparent",
            borderTopColor: "rgba(255,255,255,0.5)",
            filter: "blur(1px)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <SectionEyebrow>Locations</SectionEyebrow>
          <SectionTitle id="locations-heading">Where we work from.</SectionTitle>
          <SectionDescription className="mt-4 max-w-xl">
            One delivery hub, five collaboration hubs — timezone overlap wherever the client is.
          </SectionDescription>
        </Reveal>

        <Reveal delay={80}>
          <div className="glass mt-10 rounded-[32px] p-6 shadow-[0_40px_100px_rgba(0,0,0,0.5)] sm:p-8 lg:p-10">
            <RouteMap active={active} onPick={pick} />

            <div
              className="mt-8 grid grid-cols-3 gap-2 border-t border-white/10 pt-8 sm:flex sm:flex-wrap sm:gap-2"
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
                      borderColor: isActive ? `${a}80` : "rgba(255,255,255,0.12)",
                      backgroundColor: isActive ? `${a}1f` : "transparent",
                      color: isActive ? a : "rgba(255,255,255,0.55)",
                      boxShadow: isActive ? `0 6px 20px ${a}33` : "none",
                    }}
                  >
                    <Icon width={15} height={15} strokeWidth={1.6} />
                    {loc.country}
                  </button>
                );
              })}
            </div>

            <div key={active} className="lens-fade-in relative mt-7 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div
                aria-hidden
                className="pointer-events-none absolute -left-4 -top-10 h-40 w-40 rounded-full opacity-60 blur-3xl"
                style={{ background: `radial-gradient(circle, ${accent}30, transparent 70%)` }}
              />

              <div className="relative flex gap-5">
                <div
                  className="icon-pop-in relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border transition-transform duration-300 hover:scale-105 sm:h-[72px] sm:w-[72px]"
                  style={{ borderColor: `${accent}40`, backgroundColor: `${accent}14` }}
                >
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{ background: `radial-gradient(circle at 30% 20%, ${accent}55, transparent 70%)` }}
                  />
                  <CurrentIcon className="relative sm:hidden" width={26} height={26} strokeWidth={1.4} style={{ color: accent }} />
                  <CurrentIcon className="relative hidden sm:block" width={34} height={34} strokeWidth={1.3} style={{ color: accent }} />
                </div>

                <div>
                  <p className="font-urbanist text-[10.5px] font-semibold uppercase tracking-[0.16em] text-white/40">
                    {current.region}
                    <span className="ml-1.5 font-normal text-white/25">— {current.regionNote}</span>
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: accent }} aria-hidden />
                    <p className="font-urbanist text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white/45">{current.role}</p>
                  </div>
                  <h3 className="mt-1.5 font-urbanist text-[26px] font-bold leading-tight tracking-tight text-white">{current.country}</h3>
                  <p className="mt-3 max-w-md font-urbanist text-[13.5px] leading-relaxed text-white/60">{current.short}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {current.bestFor.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.07] px-2.5 py-1 font-urbanist text-[10.5px] text-white/70 transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.1]"
                      >
                        <span className="h-1 w-1 shrink-0 rounded-full" style={{ backgroundColor: accent }} aria-hidden />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative flex shrink-0 items-start gap-2 font-urbanist text-[11.5px] leading-relaxed text-white/35 sm:text-right">
                <MapPin size={13} strokeWidth={1.75} className="mt-0.5 shrink-0 opacity-60 sm:order-2" />
                <span className="sm:order-1">
                  Street address — TBD
                  <br />
                  {current.country}
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
