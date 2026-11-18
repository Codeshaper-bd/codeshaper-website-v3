import { Globe2 } from "lucide-react";
import { FaMicrosoft } from "react-icons/fa";
import { SiWebflow, SiFiverr, SiUpwork, SiFramer } from "react-icons/si";
import type { IconType } from "react-icons";
import Reveal from "@/components/system/Reveal";
import { SERVED } from "@/components/hero/globe/servedCountries";

/**
 * Clients strip, between the hero and Services: three rows of monochrome
 * wordmarks (reference: "Trusted by 350+ global brands" grids), each with a
 * small industry tag, so a visitor sees the spread of sectors at a glance.
 *
 *  · Background blends from the hero's white frame into the warm
 *    light-surface that frames Services, so there's no hard band between them.
 *  · Rows drift slowly, alternating direction and speed; hover pauses a row;
 *    static under reduced motion (globals.css). Edges fade out with a mask.
 *  · The five clients with a public mark show it (react-icons); the rest
 *    are name-only until real SVG logos are supplied.
 *  · Screen readers get one plain list (name + industry); the moving rows
 *    are decorative duplicates.
 *  · The country line reuses the globe's data (servedCountries.ts).
 *
 * `industry` marked // CHECK was inferred from the company name; confirm it.
 */
type Client = { name: string; industry: string; icon?: IconType };

const ROWS: Client[][] = [
  [
    { name: "Microsoft", industry: "Technology", icon: FaMicrosoft },
    { name: "Q Hotel Dhaka", industry: "Hospitality" },
    { name: "Elite Capital Group", industry: "FinTech" }, // CHECK
    { name: "Essentialist", industry: "Travel" }, // CHECK
    { name: "Webflow", industry: "SaaS", icon: SiWebflow },
    { name: "Lexa Shield", industry: "Security" }, // CHECK
  ],
  [
    { name: "Fiverr", industry: "Marketplace", icon: SiFiverr },
    { name: "Quinta dos Vales", industry: "Hospitality" }, // CHECK
    { name: "DTech Corporation", industry: "Technology" }, // CHECK
    { name: "MYTH LIFESTYLE", industry: "Fashion" }, // CHECK
    { name: "Upwork", industry: "Marketplace", icon: SiUpwork },
  ],
  [
    { name: "Framer", industry: "Design tools", icon: SiFramer },
    { name: "Fennec", industry: "eCommerce" }, // CHECK
    { name: "Astrica Trading", industry: "Trading" }, // CHECK
    { name: "GoPosly", industry: "SaaS" }, // CHECK
    { name: "Regray Stone", industry: "Real estate" }, // CHECK
  ],
];

/**
 * Industry tag tints: one soft pastel per family (from the hero palettes),
 * so the same kind of business always reads in the same colour. Background
 * is very light and text is the dark shade of the same hue (≥4.5:1 on its bg).
 */
const TINTS = {
  violet: "bg-[#f1eeff] text-[#4b3fb8] border-[#5b4fd6]/15", // technology, SaaS, design
  blue: "bg-[#eaf3fd] text-[#1d5f9e] border-[#1b78cc]/15", // finance, security
  peach: "bg-[#fff1e8] text-[#a4471a] border-[#f08a3e]/20", // hospitality, travel
  pink: "bg-[#fdeef5] text-[#a8326b] border-[#e96aa8]/20", // commerce, marketplace, fashion
  amber: "bg-[#fdf5e3] text-[#8a5a0b] border-[#f2a048]/20", // trading, real estate
} as const;

const INDUSTRY_TINT: Record<string, keyof typeof TINTS> = {
  Technology: "violet",
  SaaS: "violet",
  "Design tools": "violet",
  FinTech: "blue",
  Security: "blue",
  Hospitality: "peach",
  Travel: "peach",
  eCommerce: "pink",
  Marketplace: "pink",
  Fashion: "pink",
  Trading: "amber",
  "Real estate": "amber",
};

/** Per-row drift: duration (s) and direction. */
const MOTION = [
  { duration: 46, reverse: false },
  { duration: 54, reverse: true },
  { duration: 50, reverse: false },
];

function Wordmark({ name, industry, icon: Icon }: Client) {
  return (
    <li className="group flex shrink-0 items-center gap-2.5 whitespace-nowrap">
      <span className="flex items-center gap-2 text-[17px] font-semibold tracking-[-0.01em] text-[#868b98] transition-colors duration-300 group-hover:text-[#0b0f19] sm:text-[19px]">
        {Icon && <Icon aria-hidden size={18} />}
        {name}
      </span>
      <span
        className={`rounded-full border px-2 py-[3px] text-[10.5px] font-semibold leading-none ${TINTS[INDUSTRY_TINT[industry] ?? "violet"]}`}
      >
        {industry}
      </span>
    </li>
  );
}

function Row({ clients, duration, reverse }: { clients: Client[]; duration: number; reverse: boolean }) {
  // each half is the row twice, so one half is always wider than the viewport
  const half = [...clients, ...clients];
  return (
    <div className="overflow-hidden py-2.5 sm:py-3">
      <div
        className={`marquee-track flex w-max ${reverse ? "marquee-reverse" : ""}`}
        style={{ animationDuration: `${duration}s` }}
      >
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0 items-center gap-10 pr-10 sm:gap-14 sm:pr-14">
            {half.map((c, i) => (
              <Wordmark key={`${c.name}-${i}`} {...c} />
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

export default function TrustStrip() {
  const countries = SERVED.length;
  return (
    <section
      aria-labelledby="clients-heading"
      className="theme-light relative bg-gradient-to-b from-white to-light-surface py-16 font-urbanist lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <Reveal>
          <h2
            id="clients-heading"
            className="mx-auto max-w-[34ch] text-balance text-center text-[19px] font-semibold leading-snug tracking-[-0.01em] text-ink sm:text-[22px]"
          >
            The choice of fast-moving teams, <span className="text-ink-dim">from startups to global brands.</span>
          </h2>
        </Reveal>

        <Reveal delay={100}>
          <div
            aria-hidden
            className="mt-8 lg:mt-10"
            style={{
              WebkitMaskImage: "linear-gradient(to right, transparent, black 14%, black 86%, transparent)",
              maskImage: "linear-gradient(to right, transparent, black 14%, black 86%, transparent)",
            }}
          >
            {ROWS.map((clients, i) => (
              <Row key={i} clients={clients} {...MOTION[i]} />
            ))}
          </div>
          <ul className="sr-only">
            {ROWS.flat().map((c) => (
              <li key={c.name}>
                {c.name} ({c.industry})
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={160}>
          <p className="mx-auto mt-8 flex w-fit max-w-full items-center gap-2 rounded-full border border-[#0b0f19]/[0.07] bg-white/70 px-3.5 py-1.5 text-center text-[12.5px] font-medium text-ink-dim lg:mt-10">
            <Globe2 size={14} aria-hidden className="shrink-0 text-[#5b4fd6]" />
            <span>
              Clients in <span className="font-semibold text-ink">{countries} countries</span>
              <span className="hidden sm:inline"> across the Americas, Europe, the Middle East, Africa and Asia-Pacific</span>
            </span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
