"use client";

import { MapPin } from "lucide-react";
import Reveal from "@/components/system/Reveal";

/**
 * Clients & trust — centered header + an organic "logo wall" mosaic,
 * matching the composition of a reference the user shared (centered
 * headline/copy over a scattered bento of solid logo cards with one
 * larger featured card) — same layout/rhythm, not their color: this stays
 * on bg-light-surface/theme-light like the rest of the site instead of a
 * blue background.
 *
 * The mosaic itself is a CSS multi-column layout (columns-*, break-inside-
 * avoid) rather than a fixed grid: real logo images will vary in aspect
 * ratio once the user swaps these dummy wordmark cards for real ones, and
 * a true masonry column flow absorbs that variation at any card count
 * without needing hand-placed grid coordinates per item (which is how the
 * reference's exact 9-card layout was very likely built, but wouldn't
 * hold up responsively at our 16 real clients). Two clients are marked
 * "featured" for a bigger card, echoing the reference's oversized first
 * logo.
 */
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

const FEATURED = new Set(["Microsoft", "Framer"]);

const REGIONS = ["USA", "Canada", "Europe"];

function ClientCard({ name, featured }: { name: string; featured: boolean }) {
  return (
    <div
      className={`group flex flex-col items-center justify-center gap-1 rounded-2xl bg-canvas-raised text-center transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-ink/[0.06] hover:shadow-[0_16px_32px_rgba(9,9,11,0.08)] ${
        featured ? "px-8 py-12" : "px-6 py-9"
      }`}
    >
      <span
        className={`font-urbanist font-black uppercase leading-tight tracking-tight text-ink/60 transition-colors duration-300 group-hover:text-ink ${
          featured ? "text-3xl sm:text-4xl" : "text-lg sm:text-xl"
        }`}
      >
        {name}
      </span>
    </div>
  );
}

export default function TrustStrip() {
  return (
    <section
      aria-label="Clients and partners"
      className="theme-light relative overflow-hidden bg-light-surface py-16 font-urbanist lg:py-24"
    >
      {/* subtle texture, same asset Hero uses, so the section visibly shares Hero's material language */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 text-ink opacity-[0.025]"
        style={{ backgroundImage: "url(/media/hex-pattern-tile.svg)", backgroundSize: "112px 194px" }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 inline-flex items-center gap-2.5 font-urbanist text-[11px] font-medium uppercase tracking-[0.28em] text-ink-dim">
              <span className="h-1.5 w-1.5 rounded-full bg-aurora-amber" />
              Selected Clients
            </p>
            <h2 className="font-urbanist text-[28px] font-bold leading-tight tracking-tight text-ink sm:text-4xl lg:text-[44px]">
              The Choice Of Fast-Moving Teams
              <br />
              <span className="text-ink-dim">From Startups to Global Brands</span>
            </h2>
            <p className="mx-auto mt-5 max-w-lg font-urbanist text-[15px] leading-relaxed text-ink-dim">
              We're a digital product studio combining design, engineering, commerce, and AI automation under one
              roof — for teams building everything from first-time launches to established brands.
            </p>

            <ul className="mt-6 flex flex-wrap justify-center gap-2.5">
              {REGIONS.map((r) => (
                <li
                  key={r}
                  className="flex items-center gap-1.5 rounded-full border border-hairline bg-canvas px-3.5 py-1.5 font-urbanist text-[12px] font-medium text-ink-dim"
                >
                  <MapPin size={12} strokeWidth={2} className="text-ink-faint" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <div className="mx-auto mt-14 max-w-5xl columns-2 gap-4 sm:columns-3 lg:columns-4">
          {CLIENTS.map((name, i) => (
            <Reveal key={name} delay={i * 35} className="mb-4 break-inside-avoid">
              <ClientCard name={name} featured={FEATURED.has(name)} />
            </Reveal>
          ))}
        </div>
        <span className="sr-only">Trusted by {CLIENTS.join(", ")}</span>
      </div>
    </section>
  );
}
