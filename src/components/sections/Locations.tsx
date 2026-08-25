"use client";

import Reveal from "@/components/system/Reveal";
import { usePrefersReducedMotion } from "@/lib/motion";

/**
 * Locations — replaces the earlier 5-anonymous-city placeholder grid with
 * the real regional footprint: Bangladesh is the delivery hub, with
 * collaboration hubs in Japan, the USA, the UK, Australia, and New
 * Zealand for timezone overlap. Grouped by region (Asia-Pacific, Americas,
 * UK & Europe, Oceania) exactly as given, rather than one flat grid, since
 * the region is part of the point (why each hub exists).
 *
 * Street-level addresses are PLACEHOLDERS ("Street address — TBD") — same
 * convention the previous version of this file used for its anonymous
 * "[City N]" placeholders — to be swapped for the real registered address
 * per office. The country/hub role/description/best-for content is real.
 *
 * The animated visual is a stylized flight-path arc (not a literal
 * geo-accurate flat map — this site has no mapping library, and hand-
 * approximating continent outlines would look worse than admitting the
 * abstraction) — pins ordered west→east matching real longitude, joined
 * by one continuous route with a traveling glow dot, same glow-dot motif
 * introduced in AI-Driven Development for visual consistency across the
 * site's two "network" diagrams. Sits on top of the existing starfield +
 * horizon backdrop, which is kept as-is.
 */
type Location = {
  country: string;
  role: string;
  short: string;
  bestFor: string[];
};

type RegionGroup = {
  region: string;
  note: string;
  locations: Location[];
};

const REGIONS: RegionGroup[] = [
  {
    region: "Asia-Pacific",
    note: "Delivery & product execution",
    locations: [
      {
        country: "Bangladesh",
        role: "Delivery hub",
        short: "Product design, engineering, and automation delivery across web, mobile, SaaS, and commerce.",
        bestFor: ["End-to-end builds", "Dedicated product teams", "Ongoing iteration"],
      },
      {
        country: "Japan",
        role: "Collaboration hub",
        short: "Supports client collaboration and product planning for teams operating in Japan/APAC.",
        bestFor: ["Product planning", "Stakeholder coordination", "Delivery alignment"],
      },
    ],
  },
  {
    region: "Americas",
    note: "Client proximity",
    locations: [
      {
        country: "USA",
        role: "Client collaboration hub",
        short: "Supports discovery, planning, and working overlap for North American clients.",
        bestFor: ["MVP sprints", "Roadmap planning", "Ongoing product iteration"],
      },
    ],
  },
  {
    region: "UK & Europe",
    note: "Client proximity",
    locations: [
      {
        country: "UK",
        role: "Client collaboration hub",
        short: "Supports European clients with timezone overlap and project coordination.",
        bestFor: ["Product discovery", "Sprint planning", "Delivery oversight"],
      },
    ],
  },
  {
    region: "Oceania",
    note: "Timezone overlap",
    locations: [
      {
        country: "Australia",
        role: "Collaboration hub",
        short: "Supports timezone overlap for Australia-based teams and distributed product orgs.",
        bestFor: ["Dedicated team collaboration", "Ongoing roadmap delivery"],
      },
      {
        country: "New Zealand",
        role: "Collaboration hub",
        short: "Supports NZ-based clients with planning, communication, and delivery coordination.",
        bestFor: ["Product support", "Iteration cycles", "Cross-timezone teams"],
      },
    ],
  },
];

/** West → east, matching real longitude order. */
const PINS = [
  { country: "USA", x: 6, y: 74 },
  { country: "UK", x: 24, y: 64.6 },
  { country: "Bangladesh", x: 42, y: 58.8 },
  { country: "Japan", x: 60, y: 58.8 },
  { country: "Australia", x: 78, y: 64.6 },
  { country: "New Zealand", x: 96, y: 74 },
];

const ROUTE_PATH = `M${PINS.map((p) => `${p.x},${p.y}`).join(" L")}`;

function RouteMap() {
  const reduced = usePrefersReducedMotion();

  return (
    <div className="relative h-[190px] w-full sm:h-[220px] lg:h-[260px]">
      <svg viewBox="0 0 100 80" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <filter id="loc-map-glow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="1" />
          </filter>
        </defs>
        <path d={ROUTE_PATH} fill="none" stroke="#ffffff" strokeOpacity="0.22" strokeWidth="0.5" />
        {!reduced && (
          <>
            <circle r="1.2" fill="#e8b04e" filter="url(#loc-map-glow)">
              <animateMotion dur="6s" repeatCount="indefinite" path={ROUTE_PATH} />
            </circle>
            <circle r="1" fill="#9db8ff" filter="url(#loc-map-glow)" opacity="0.8">
              <animateMotion dur="6s" begin="3s" repeatCount="indefinite" path={ROUTE_PATH} />
            </circle>
          </>
        )}
      </svg>

      {PINS.map((p) => (
        <div key={p.country} className="absolute" style={{ left: `${p.x}%`, top: `${p.y}%`, transform: "translate(-50%, -50%)" }}>
          <span
            aria-hidden
            className="dot-pulse block h-2.5 w-2.5 rounded-full border border-white/40 bg-white"
            style={{ boxShadow: "0 0 10px rgba(255,255,255,0.9)" }}
          />
          <span className="absolute left-1/2 top-full mt-2 hidden -translate-x-1/2 whitespace-nowrap font-urbanist text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white/55 sm:block">
            {p.country}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function Locations() {
  return (
    <section
      id="locations"
      className="relative overflow-hidden bg-canvas py-16 lg:py-32"
      aria-labelledby="locations-heading"
    >
      {/* ── Earth-from-space composition (CSS/SVG, static) ── */}
      <div aria-hidden className="absolute inset-0">
        {/* deep space base + faint starfield */}
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
        {/* planet horizon arc — bottom of section; glow pulses ~10s */}
        <div
          className="horizon-pulse absolute left-1/2 top-full h-[130vw] w-[220vw] -translate-x-1/2 -translate-y-[16%] rounded-[50%] lg:-translate-y-[22%]"
          style={{
            background:
              "radial-gradient(closest-side, #27272a 0%, #18181b 78%, #0A0A0F 100%)",
            boxShadow:
              "0 -2px 40px rgba(255,255,255,0.14), 0 -12px 90px rgba(255,255,255,0.1), 0 -30px 180px rgba(255,255,255,0.06), 0 -60px 280px rgba(255,255,255,0.03)",
          }}
        />
        {/* atmosphere glow line along the horizon */}
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
          <p className="mb-3 font-urbanist text-sm font-medium uppercase tracking-[0.25em] text-ink-faint">
            Locations
          </p>
          <h2
            id="locations-heading"
            className="font-urbanist text-3xl font-bold tracking-tight text-ink sm:text-4xl"
          >
            Where we work from.
          </h2>
          <p className="mt-4 max-w-xl font-urbanist text-lg leading-relaxed text-ink-dim">
            One delivery hub, five collaboration hubs — timezone overlap wherever the client is.
          </p>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-10">
            <RouteMap />
          </div>
        </Reveal>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {REGIONS.map((group, gi) => (
            <Reveal key={group.region} delay={gi * 90} className="h-full">
              <div className="flex h-full flex-col gap-4">
                <p className="font-urbanist text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40">
                  {group.region}
                  <span className="ml-1.5 font-normal text-white/25">— {group.note}</span>
                </p>
                {group.locations.map((loc) => (
                  <article
                    key={loc.country}
                    className="rounded-[20px] border border-white/[0.08] bg-white/[0.035] p-5 transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.06]"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: loc.role === "Delivery hub" ? "#7c6cff" : "#e8b04e" }}
                        aria-hidden
                      />
                      <p className="font-urbanist text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white/45">
                        {loc.role}
                      </p>
                    </div>
                    <h3 className="mt-2 font-urbanist text-lg font-bold tracking-tight text-white">{loc.country}</h3>
                    <p className="mt-2 font-urbanist text-[13px] leading-relaxed text-white/60">{loc.short}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {loc.bestFor.map((tag) => (
                        <span key={tag} className="rounded-full border border-white/15 bg-white/[0.07] px-2.5 py-1 font-urbanist text-[10.5px] text-white/70">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="mt-4 border-t border-white/[0.08] pt-3 font-urbanist text-[11.5px] leading-relaxed text-white/35">
                      Street address — TBD
                      <br />
                      {loc.country}
                    </p>
                  </article>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
