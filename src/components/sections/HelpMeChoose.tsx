"use client";

import Link from "next/link";

/**
 * Help me choose — LIGHT surface (section rhythm §3, position 7).
 * Five intent tiles; hex mark watermark fades in behind hovered tile.
 * Destinations stubbed to service pages for now.
 */
const TILES = [
  { label: "Launch an MVP", href: "/services/engineering/saas" },
  { label: "Scale a SaaS", href: "/services/engineering/saas" },
  { label: "Grow eCommerce", href: "/services/commerce" },
  { label: "Modernize a legacy system", href: "/services/engineering/modernization" },
  { label: "Reduce manual ops with AI", href: "/services/ai" },
];

const HexWatermark = () => (
  <svg
    viewBox="0 0 26 28"
    aria-hidden
    className="absolute right-3 top-1/2 h-24 w-24 -translate-y-1/2 opacity-0 transition-opacity duration-500 group-hover:opacity-[0.08]"
  >
    <path
      d="M13 1 L24.3 7.5 L24.3 20.5 L13 27 L1.7 20.5 L1.7 7.5 Z"
      fill="none"
      stroke="#12121A"
      strokeWidth="1.2"
    />
  </svg>
);

export default function HelpMeChoose() {
  return (
    <section
      className="border-t border-hairline-light bg-light-surface py-16 lg:py-32"
      aria-labelledby="choose-heading"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <p className="mb-3 font-urbanist text-sm font-medium uppercase tracking-[0.25em] text-light-dim">
          Not sure where to start?
        </p>
        <h2
          id="choose-heading"
          className="mb-12 font-urbanist text-3xl font-bold tracking-tight text-light-ink sm:text-4xl"
        >
          Tell us what you&apos;re trying to do.
        </h2>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {TILES.map((t) => (
            <li key={t.label}>
              <Link
                href={t.href}
                className="group card-light relative flex min-h-40 flex-col justify-between overflow-hidden rounded-xl p-8 transition-transform duration-300 hover:-translate-y-0.5"
              >
                <HexWatermark />
                <span className="font-urbanist text-lg font-bold leading-snug text-light-ink">
                  {t.label}
                </span>
                <span
                  className="mt-6 font-urbanist text-sm text-light-dim transition-transform duration-300 group-hover:translate-x-1 group-hover:text-light-ink"
                  aria-hidden
                >
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
