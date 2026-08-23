"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/system/Reveal";

/**
 * Clients & trust — circular logo-badge row with one enlarged "featured"
 * badge in the middle, matching the composition of a reference the user
 * shared (colorful circle row + one oversized centerpiece + heading with
 * no secondary subheading line + description below the row + CTA). Kept
 * our own monochrome palette instead of the reference's rainbow of brand
 * colors, and kept the site's established eyebrow treatment for
 * cross-section consistency rather than swapping to the reference's plain
 * tag style.
 *
 * Badges are dummy wordmark placeholders (client name inside a circle) per
 * the user's instruction — real logo images can drop in later without
 * restructuring, since each badge is just an icon slot today. Animation:
 * staggered scroll-reveal per badge, a continuous gentle idle float
 * (badge-float, globals.css) staggered per badge so the row doesn't bob in
 * unison, and a hover scale-up.
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

const FEATURED_NAME = "Microsoft";

const PALETTE = ["bg-ink-dim", "bg-aurora-indigo", "bg-ink-faint", "bg-aurora-amber-dark", "bg-ink/70"];

function ClientBadge({ name, index, featured }: { name: string; index: number; featured: boolean }) {
  return (
    <Reveal delay={index * 40}>
      <div
        className={`badge-float flex shrink-0 items-center justify-center rounded-full text-center shadow-[0_10px_24px_rgba(9,9,11,0.1)] transition-transform duration-300 hover:scale-110 ${
          featured ? "h-32 w-32 sm:h-40 sm:w-40" : "h-20 w-20 sm:h-24 sm:w-24"
        } ${featured ? "bg-ink" : PALETTE[index % PALETTE.length]}`}
        style={{ animationDelay: `${(index % 6) * 0.35}s` }}
      >
        <span
          className={`px-2 font-urbanist font-bold uppercase leading-[1.15] text-white ${
            featured ? "text-[13px] sm:text-[15px]" : "text-[9px] sm:text-[10px]"
          }`}
        >
          {name}
        </span>
      </div>
    </Reveal>
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

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center lg:px-10">
        <Reveal>
          <p className="mb-3 inline-flex items-center gap-2.5 font-urbanist text-[11px] font-medium uppercase tracking-[0.28em] text-ink-dim">
            <span className="h-1.5 w-1.5 rounded-full bg-aurora-amber" />
            Selected Clients
          </p>
          <h2 className="font-urbanist text-[28px] font-bold leading-tight tracking-tight text-ink sm:text-4xl lg:text-[44px]">
            The Choice Of Fast-Moving Teams,
            <br />
            From Startups to Global Brands
          </h2>
        </Reveal>

        <div className="mt-16 flex flex-wrap items-center justify-center gap-5 sm:gap-6 lg:gap-7">
          {CLIENTS.map((name, i) => (
            <ClientBadge key={name} name={name} index={i} featured={name === FEATURED_NAME} />
          ))}
        </div>

        <Reveal delay={CLIENTS.length * 20}>
          <p className="mx-auto mt-16 max-w-lg font-urbanist text-[15px] leading-relaxed text-ink-dim">
            We're a digital product studio combining design, engineering, commerce, and AI automation under one
            roof — for teams building everything from first-time launches to established brands.
          </p>
          <div className="mt-7">
            <Link
              href="/company/clients"
              className="inline-flex items-center gap-2 rounded-full bg-aurora-violet px-7 py-3.5 font-urbanist text-sm font-semibold text-white transition-[background-color,transform] duration-300 hover:scale-[1.02] hover:bg-aurora-violet-dark"
            >
              View All Clients
              <ArrowRight size={15} strokeWidth={1.75} />
            </Link>
          </div>
        </Reveal>
      </div>
      <span className="sr-only">Trusted by {CLIENTS.join(", ")}</span>
    </section>
  );
}
