import Link from "next/link";
import Reveal from "@/components/system/Reveal";

/**
 * 4.7 Industries — PASS 2: cards reveal in a 2-row cascade (60ms stagger
 * within rows), chips pop in last (scale 0.9→1, CSS .chip-pop), card hover
 * lifts + hairline transitions toward Indigo.
 */
const FEATURED = [
  { name: "SaaS", href: "/industries/saas" },
  { name: "eCommerce / Retail", href: "/industries/ecommerce" },
  { name: "Real Estate", href: "/industries/real-estate" },
  { name: "Logistics", href: "/industries/logistics" },
  { name: "Travel", href: "/industries/travel" },
  { name: "Professional Services", href: "/industries/professional-services" },
  { name: "FinTech", href: "/industries/fintech" },
  { name: "RMG", href: "/industries/rmg" },
];

const CHIPS = ["Luxury", "Nightlife", "Restaurant"];

export default function Industries() {
  return (
    <section className="border-t border-hairline-light bg-light-surface py-16 lg:py-32" aria-labelledby="industries-heading">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <p className="mb-3 font-urbanist text-sm font-medium uppercase tracking-[0.25em] text-light-dim">
          Where we operate
        </p>
        <h2
          id="industries-heading"
          className="font-urbanist text-3xl font-bold tracking-tight text-light-ink sm:text-4xl"
        >
          Industries we serve.
        </h2>
        <p className="mt-4 max-w-2xl font-urbanist text-lg leading-relaxed text-light-dim">
          We focus on industries where speed to market, product experience, and
          operational efficiency drive growth.
        </p>

        <ul className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {FEATURED.map((f, i) => (
            <li key={f.name}>
              {/* 2-row cascade: row 1 (first 4) then row 2, 60ms within rows */}
              <Reveal delay={(i < 4 ? 0 : 280) + (i % 4) * 60} className="h-full">
                <Link
                  href={f.href}
                  className="card-light lift-sm group flex min-h-28 flex-col justify-between rounded-xl p-8 transition-colors hover:border-aurora-indigo/50"
                >
                  <span className="font-urbanist text-lg font-bold leading-snug text-light-ink">
                    {f.name}
                  </span>
                  <span
                    className="mt-4 font-urbanist text-sm text-light-dim transition-colors group-hover:text-light-ink"
                    aria-hidden
                  >
                    →
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal delay={550}>
          <ul className="mt-8 flex flex-wrap gap-3">
            {CHIPS.map((c) => (
              <li
                key={c}
                className="chip-pop rounded-full border border-black/10 bg-white px-4 py-2 font-urbanist text-sm text-light-dim"
              >
                {c}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={650}>
          <div className="mt-12">
            <Link
              href="/industries"
              className="inline-block rounded-full border border-black/15 px-7 py-3.5 font-urbanist text-sm font-medium text-light-ink transition-colors hover:border-black/40"
            >
              Explore Industries →
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
