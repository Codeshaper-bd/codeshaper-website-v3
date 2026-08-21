"use client";

import Link from "next/link";
import { SERVICE_COLUMNS } from "@/lib/navigation";
import Reveal from "@/components/system/Reveal";
import Spotlight from "@/components/system/Spotlight";

/**
 * 4.3 Services index — PASS 2: rows reveal with shared stagger; hover gets a
 * contained radial spotlight (violet ~6%, ~400px), arrow nudges 4px right,
 * number transitions to Indigo. Structure/content unchanged from Pass 1.
 */
export default function ServicePillars() {
  return (
    <section className="bg-light-surface py-16 lg:py-32" aria-labelledby="services-heading">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <p className="mb-3 font-urbanist text-sm font-medium uppercase tracking-[0.25em] text-light-dim">
            What we do
          </p>
          <h2
            id="services-heading"
            className="mb-14 max-w-2xl font-urbanist text-3xl font-bold tracking-tight text-light-ink sm:text-4xl"
          >
            Five practices, one delivery system.
          </h2>
        </Reveal>

        <ol className="border-t border-hairline-light">
          {SERVICE_COLUMNS.map((col, i) => (
            <li key={col.id} className="border-b border-hairline-light">
              <Reveal delay={i * 70}>
                <Spotlight color="rgba(9, 9, 11, 0.05)" radius={400}>
                  <Link
                    href={col.href}
                    className="group grid grid-cols-[3rem_1fr] items-baseline gap-4 py-8 sm:grid-cols-[5rem_1fr_auto] sm:py-10"
                  >
                    <span className="font-urbanist text-sm font-medium text-light-dim transition-colors duration-300 group-hover:text-aurora-indigo">
                      {col.number}
                    </span>
                    <span>
                      <span className="font-urbanist text-2xl font-bold tracking-tight text-light-ink sm:text-3xl">
                        {col.title}
                      </span>
                      <span className="mt-2 block max-w-xl font-urbanist text-base leading-relaxed text-light-ink/80">
                        {col.blurb}
                      </span>
                      <span className="mt-2 block max-w-xl font-urbanist text-sm leading-relaxed text-light-dim">
                        {col.links.map((l) => l.label).join(" · ")}
                      </span>
                    </span>
                    <span
                      className="hidden font-urbanist text-light-dim transition-transform duration-300 group-hover:translate-x-1 group-hover:text-light-ink sm:block"
                      aria-hidden
                    >
                      →
                    </span>
                  </Link>
                </Spotlight>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal delay={200}>
          <div className="mt-12">
            <Link
              href="/services"
              className="inline-block rounded-full border border-black/15 px-7 py-3.5 font-urbanist text-sm font-medium text-light-ink transition-colors hover:border-black/40"
            >
              Explore All Services →
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
