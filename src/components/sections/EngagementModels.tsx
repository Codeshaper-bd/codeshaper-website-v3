"use client";

import Link from "next/link";
import Reveal from "@/components/system/Reveal";
import Spotlight from "@/components/system/Spotlight";

/**
 * 4.8 Engagement models — PASS 2: cards reveal staggered; hover gets border
 * glow (card-dark:hover) + lift + a faint contained spotlight (dimmer than
 * the services rows).
 */
const MODELS = [
  {
    name: "MVP Sprint",
    fit: "A fixed, fast lane from idea to first shippable product — best when speed to validation matters most.",
  },
  {
    name: "End-to-End Delivery",
    fit: "We own the full build against an agreed scope — best when you know what you need and want it handled.",
  },
  {
    name: "Dedicated Product Team",
    fit: "A stable cross-functional squad embedded on your roadmap — best for continuous product work.",
  },
  {
    name: "Team Augmentation",
    fit: "Specialists slot into your existing team and process — best when you need capacity, not management.",
  },
  {
    name: "Global Delivery Model",
    fit: "Distributed build with local-time overlap and single-point accountability — best for cost + coverage.",
  },
];

export default function EngagementModels() {
  return (
    <section className="bg-canvas py-16 lg:py-32" aria-labelledby="engagement-heading">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <p className="mb-3 font-urbanist text-sm font-medium uppercase tracking-[0.25em] text-ink-faint">
          Engagement models
        </p>
        <h2
          id="engagement-heading"
          className="font-urbanist text-3xl font-bold tracking-tight text-ink sm:text-4xl"
        >
          Flexible ways to work with us.
        </h2>
        <p className="mt-4 max-w-2xl font-urbanist text-lg leading-relaxed text-ink-dim">
          Choose the model that matches your scope certainty, timeline, and team
          structure.
        </p>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {MODELS.map((m, i) => (
            <li key={m.name}>
              <Reveal delay={i * 80} className="h-full">
                <Spotlight color="rgba(139, 95, 224, 0.05)" radius={300} className="h-full rounded-xl">
                  <article className="card-dark lift-sm h-full rounded-xl p-8">
                    <h3 className="font-urbanist text-xl font-bold tracking-tight text-ink">{m.name}</h3>
                    <p className="mt-3 font-urbanist text-sm leading-relaxed text-ink-dim">{m.fit}</p>
                  </article>
                </Spotlight>
              </Reveal>
            </li>
          ))}
        </ul>

        <div className="mt-12">
          <Link
            href="/how-we-work/engagement"
            className="inline-block rounded-full border border-hairline-strong px-7 py-3.5 font-urbanist text-sm font-medium text-ink transition-colors hover:border-ink/60"
          >
            Compare Engagement Models →
          </Link>
        </div>
      </div>
    </section>
  );
}
