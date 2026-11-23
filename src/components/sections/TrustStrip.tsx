import { Globe2 } from "lucide-react";
import { SiWebflow, SiFiverr, SiUpwork, SiFramer } from "react-icons/si";
import type { IconType } from "react-icons";
import Image from "next/image";
import Reveal from "@/components/system/Reveal";
import { SERVED } from "@/components/hero/globe/servedCountries";
import { homeCopy, type CopyOf } from "@/lib/homeCopy";
import DotField from "@/components/sections/human-ai-flow/DotField";

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
/**
 * A client: a real logo where one is confirmed (brand icon, or an image the
 * owner supplied / the client publishes in public/media/clients), otherwise
 * the name alone. Never an invented mark. `wordmark`: the logo already
 * spells the name, so the name is not repeated.
 */
type Client = { name: string; industry: string; icon?: IconType | (() => React.ReactElement); color?: string; size?: number; nudge?: number; img?: string; w?: number; wordmark?: boolean; textmark?: string };

/** Microsoft's four-colour mark (the icon sets carry it in one colour only). */
function MicrosoftMark() {
  return (
    <svg viewBox="0 0 22 22" width="18" height="18" aria-hidden>
      <rect width="10" height="10" fill="#F25022" />
      <rect x="12" width="10" height="10" fill="#7FBA00" />
      <rect y="12" width="10" height="10" fill="#00A4EF" />
      <rect x="12" y="12" width="10" height="10" fill="#FFB900" />
    </svg>
  );
}

const ROWS: Client[][] = [
  [
    { name: "Desh Group", industry: "Conglomerate", img: "/media/clients/desh-mark.png", w: 20 },
    { name: "Microsoft", industry: "Technology", icon: MicrosoftMark },
    { name: "Quality Feeds Limited", industry: "Agro & food", img: "/media/clients/quality-feeds.png", w: 150, wordmark: true },
    { name: "Q Hotel Dhaka", industry: "Hospitality" },
    { name: "Elite Capital Group", industry: "FinTech" }, // CHECK
    { name: "Essentialist", industry: "Travel", img: "/media/clients/essentialist.png", w: 46 },
    { name: "Webflow", industry: "SaaS", icon: SiWebflow, color: "#146EF5" },
    { name: "Lexa Shield", industry: "Security" }, // CHECK
  ],
  [
    { name: "Shinest Group", industry: "Apparel", textmark: "#d32f1f" },
    { name: "Fiverr", industry: "Marketplace", icon: SiFiverr, color: "#1DBF73", size: 58, nudge: -10, wordmark: true },
    { name: "Quinta dos Vales", industry: "Hospitality", img: "/media/clients/quinta-dos-vales.png", w: 26 },
    { name: "Envato", industry: "Marketplace", img: "/media/clients/envato.svg", w: 96, wordmark: true },
    { name: "DTech Corporation", industry: "Technology" }, // CHECK
    { name: "MYTH LIFESTYLE", industry: "Fashion", img: "/media/clients/myth.png", w: 64, wordmark: true },
    { name: "Upwork", industry: "Marketplace", icon: SiUpwork, color: "#14A800" },
  ],
  [
    { name: "Framer", industry: "Design tools", icon: SiFramer, color: "#0b0f19" },
    { name: "Fennec", industry: "eCommerce", img: "/media/clients/fennec.png", w: 24 },
    { name: "Super Oil Refinery", industry: "Energy" },
    { name: "Astrica Trading", industry: "Trading" }, // CHECK
    { name: "GoPosly", industry: "SaaS" }, // CHECK
    { name: "Regray Stone", industry: "Real estate" }, // CHECK
  ],
];

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
  Conglomerate: "blue",
  "Agro & food": "amber",
  Apparel: "pink",
  Energy: "amber",
  "Real estate": "amber",
};

function Wordmark({ name, industry, icon: Icon, color, size = 20, nudge = 0, img, w, wordmark, textmark }: Client) {
  const hasLogo = Boolean(Icon || img);
  return (
    <li title={`${name} (${industry})`} className="group flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-2xl py-2 pl-2.5 pr-3 sm:gap-3 sm:py-2.5 sm:pl-3 sm:pr-3.5 transition-transform duration-300 hover:-translate-y-0.5">
      {img ? (
        <Image src={img} alt="" width={(w ?? 32) * 2} height={wordmark ? 64 : 56} style={{ width: w, height: wordmark ? 32 : 28 }} className="shrink-0 object-contain" />
      ) : Icon ? (
        <span className="grid h-7 shrink-0 place-items-center" style={{ color, minWidth: 28, transform: nudge ? `translateY(${nudge}px)` : undefined }}>
          <Icon aria-hidden size={size} />
        </span>
      ) : null}
      {textmark && (
        <span className="text-[15px] font-extrabold uppercase tracking-[0.02em]" style={{ color: textmark, fontFamily: "var(--font-hero), sans-serif" }}>
          {name}
        </span>
      )}
      {!wordmark && !textmark && (
        <span className={`text-[14px] font-semibold tracking-[-0.01em] sm:text-[17px] ${hasLogo ? "text-[#0b0f19]" : "text-[#4b5263]"}`}>{name}</span>
      )}
    </li>
  );
}

export default function TrustStrip({ copy }: { copy?: CopyOf<"trustStrip"> }) {
  const c = homeCopy("trustStrip", copy);
  const countries = SERVED.length;
  return (
    <section
      aria-labelledby="clients-heading"
      className="theme-light relative overflow-clip bg-gradient-to-b from-white to-light-surface py-16 font-urbanist lg:py-24"
    >
      {/* the shared dotted background (as Human + AI), fading out at the top and bottom */}
      <DotField className="[mask-image:linear-gradient(to_bottom,transparent,black_22%,black_78%,transparent)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <Reveal>
          <h2
            id="clients-heading"
            className="mx-auto max-w-[34ch] text-balance text-center text-[19px] font-semibold leading-snug tracking-[-0.01em] text-ink sm:text-[22px]"
          >
            {c.title} <span className="text-ink-dim">{c.titleDim}</span>
          </h2>
        </Reveal>

        <Reveal delay={100}>
          {/* every client at once, static (owner: no moving carousel); rows wrap and stay centred */}
          <ul aria-label="Clients" className="mx-auto mt-8 flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:gap-x-10 sm:gap-y-5 lg:mt-10">
            {ROWS.flat().map((c) => (
              <Wordmark key={c.name} {...c} />
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
