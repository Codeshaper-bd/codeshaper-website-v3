import {
  Hexagon,
  Triangle,
  Circle,
  Square,
  Star,
  Zap,
  Shield,
  Layers,
  Box,
  Octagon,
  Pentagon,
  type LucideIcon,
} from "lucide-react";
import { FaMicrosoft } from "react-icons/fa";
import { SiWebflow, SiFiverr, SiUpwork, SiFramer } from "react-icons/si";
import type { IconType } from "react-icons";
import Reveal from "@/components/system/Reveal";
import { SectionEyebrow } from "@/components/system/SectionHeading";

/**
 * Clients & trust — back to the section's earlier composition (left-aligned
 * eyebrow/heading, region pills on the right, compact padding) after a
 * detour through centered/circular-badge layouts. Logos run as a single
 * continuous marquee line instead of a wrapping grid.
 *
 * Real brand icons (react-icons' simple-icons/font-awesome sets, already
 * monochrome via currentColor) are used for the 5 clients that are actual
 * public companies with a recognizable mark; the other 11 are private/
 * custom businesses with no public logo to source, so they get a neutral
 * geometric glyph as an explicit placeholder — swap in real logo images
 * for both groups once the user supplies them, per their note that these
 * are dummy logos for now.
 */
const KNOWN_LOGOS: Record<string, IconType> = {
  Microsoft: FaMicrosoft,
  Webflow: SiWebflow,
  Fiverr: SiFiverr,
  UpWork: SiUpwork,
  Framer: SiFramer,
};

const PLACEHOLDER_ICONS: LucideIcon[] = [Hexagon, Triangle, Circle, Square, Star, Zap, Shield, Layers, Box, Octagon, Pentagon];

const CLIENTS = [
  "Essentialist",
  "Fennec",
  "Q Hotel Dhaka",
  "Microsoft",
  "Elite Capital Group",
  "Webflow",
  "Fiverr",
  "UpWork",
  "Lexa Shield",
  "Quinta dos Vales",
  "DTech Corporation",
  "Astrica Trading",
  "MYTH LIFESTYLE",
  "GoPosly",
  "Framer",
  "Regray Stone",
];

const REGIONS = [
  { label: "USA", flag: "🇺🇸" },
  { label: "Canada", flag: "🇨🇦" },
  { label: "Europe", flag: "🇪🇺" },
  { label: "North America", flag: "🌎" },
  { label: "Asia", flag: "🌏" },
];

function buildLogoMap(): Record<string, IconType | LucideIcon> {
  const map: Record<string, IconType | LucideIcon> = {};
  let placeholderIndex = 0;
  for (const name of CLIENTS) {
    map[name] = KNOWN_LOGOS[name] ?? PLACEHOLDER_ICONS[placeholderIndex++ % PLACEHOLDER_ICONS.length];
  }
  return map;
}

const LOGO_MAP = buildLogoMap();

function LogoTile({ name }: { name: string }) {
  const LogoIcon = LOGO_MAP[name];
  const isReal = name in KNOWN_LOGOS;
  return (
    <div className="group flex shrink-0 items-center gap-3.5 rounded-2xl border border-hairline bg-canvas py-3 pl-3 pr-5 shadow-[0_1px_2px_rgba(9,9,11,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-aurora-violet/25 hover:shadow-[0_10px_24px_rgba(9,9,11,0.08)]">
      <span className="mega-icon-tile flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-aurora-indigo">
        <LogoIcon aria-hidden size={isReal ? 20 : 17} className={isReal ? "" : "opacity-70"} />
      </span>
      <span className="whitespace-nowrap font-urbanist text-[14px] font-semibold text-ink-dim transition-colors duration-300 group-hover:text-ink">
        {name}
      </span>
    </div>
  );
}

function LogoMarquee() {
  const row = [...CLIENTS, ...CLIENTS];
  return (
    <div
      className="relative overflow-hidden"
      style={{
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
        maskImage: "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
      }}
    >
      <div className="marquee-track flex w-max items-center gap-4">
        {row.map((name, i) => (
          <LogoTile key={`${name}-${i}`} name={name} />
        ))}
      </div>
    </div>
  );
}

export default function TrustStrip() {
  return (
    <section
      aria-label="Clients and partners"
      className="theme-light relative overflow-hidden bg-light-surface py-12 font-urbanist lg:py-16"
    >
      {/* subtle texture, same asset Hero uses, so the section visibly shares Hero's material language */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 text-ink opacity-[0.025]"
        style={{ backgroundImage: "url(/media/hex-pattern-tile.svg)", backgroundSize: "112px 194px" }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <SectionEyebrow>Selected Clients</SectionEyebrow>
              <h2 className="font-urbanist text-[24px] font-bold leading-tight tracking-tight text-ink sm:text-[32px] lg:text-[36px]">
                The Choice Of Fast-Moving Teams
                <br />
                <span className="text-ink-dim">From Startups to Global Brands</span>
              </h2>
            </div>
            <ul className="flex flex-wrap gap-2.5 lg:justify-end">
              {REGIONS.map((r) => (
                <li
                  key={r.label}
                  className="flex items-center gap-1.5 rounded-full border border-hairline bg-canvas px-3.5 py-1.5 font-urbanist text-[12px] font-medium text-ink-dim"
                >
                  <span aria-hidden className="text-[13px] leading-none">
                    {r.flag}
                  </span>
                  {r.label}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-8 lg:mt-10">
            <LogoMarquee />
          </div>
        </Reveal>
        <span className="sr-only">Trusted by {CLIENTS.join(", ")}</span>
      </div>
    </section>
  );
}
