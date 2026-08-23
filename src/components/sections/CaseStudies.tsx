"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/system/Reveal";

/**
 * Success Stories — static 2-column grid (no scroll-jacking; the previous
 * horizontal scroll-scrubbed row was dropped in favor of a plain grid per
 * direct request). Each card is a "frame" (colored gradient) holding a
 * large rectangular image up top and a white content card that overlaps
 * it, floating card-in-card — matching the requested reference style.
 *
 * Only Fennec, Essentialist, and Acculance have real, verified project
 * detail (sourced from the v2 site's own case studies — see its own
 * "verify before launch" comments on anything more specific than this).
 * The other 3 slots are explicit placeholders, added at the user's
 * request to fill the 2x3 grid ahead of real content — swap PLACEHOLDER_STORIES
 * for real projects when available; nothing here claims a real client.
 */
type Stat = { value: string; label: string };
type Story = {
  project: string;
  headline: string;
  description: string;
  tags: string[];
  image: string;
  gradient: string;
  stats: [Stat, Stat];
  href: string;
};

const REAL_STORIES: Story[] = [
  {
    project: "Fennec",
    headline: "Built a connected web and mobile platform for nightlife operations.",
    description:
      "We delivered Fennec's product ecosystem across web, mobile, and business workflows — supporting venues, guests, events, memberships, and ongoing product growth.",
    tags: ["Nightlife SaaS", "Web App", "Mobile App"],
    image: "/media/case-fintech.jpg",
    gradient: "linear-gradient(145deg, #232350 0%, #35307c 55%, #4a3a8e 100%)",
    stats: [
      { value: "Web + App", label: "Platforms shipped" },
      { value: "Ongoing", label: "Engagement" },
    ],
    href: "/work/fennec",
  },
  {
    project: "Essentialist",
    headline: "Launched a premium membership website with motion, CMS, and application flow.",
    description:
      "A high-end WordPress experience for a luxury travel membership brand, including GSAP animation, CMS structure, and a polished membership journey.",
    tags: ["WordPress", "GSAP", "Membership Flow"],
    image: "/media/case-commerce.jpg",
    gradient: "linear-gradient(145deg, #3a2340 0%, #63395e 55%, #96604a 100%)",
    stats: [
      { value: "WordPress", label: "Platform" },
      { value: "GSAP", label: "Motion system" },
    ],
    href: "/work/essentialist",
  },
  {
    project: "Acculance",
    headline: "Built a SaaS-ready POS, inventory, and accounting platform.",
    description:
      "A business management product covering sales, inventory, POS, accounting, reporting, and operational workflows for growing businesses.",
    tags: ["SaaS", "POS", "Accounting"],
    image: "/media/case-logistics.jpg",
    gradient: "linear-gradient(145deg, #1c1c46 0%, #2b3a72 55%, #3d5290 100%)",
    stats: [
      { value: "3 Modules", label: "POS · Inventory · Accounting" },
      { value: "Laravel / Vue", label: "Stack" },
    ],
    href: "/work/acculance",
  },
];

/** Placeholder content — replace with real projects; see file-level note above. */
const PLACEHOLDER_STORIES: Story[] = [
  {
    project: "Northwind Commerce",
    headline: "Modernized a multi-brand storefront into one unified checkout.",
    description:
      "Placeholder case study — a consolidated storefront and checkout experience spanning multiple product brands under one account and cart.",
    tags: ["eCommerce", "Storefront", "Checkout"],
    image: "/media/case-healthcare.jpg",
    gradient: "linear-gradient(145deg, #4a2e1c 0%, #7a4a2b 55%, #a3703f 100%)",
    stats: [
      { value: "Multi-brand", label: "Storefront" },
      { value: "Unified Cart", label: "Checkout flow" },
    ],
    href: "/work",
  },
  {
    project: "Verdant Health",
    headline: "Designed a patient portal for scheduling, records, and billing.",
    description:
      "Placeholder case study — a patient-facing portal covering appointment scheduling, records access, and billing in one experience.",
    tags: ["Healthtech", "Patient Portal", "Billing"],
    image: "/media/case-fintech.jpg",
    gradient: "linear-gradient(145deg, #163a2e 0%, #205c46 55%, #2f8465 100%)",
    stats: [
      { value: "Patient Portal", label: "Core module" },
      { value: "Compliance-ready", label: "Data handling" },
    ],
    href: "/work",
  },
  {
    project: "Continuum Logistics",
    headline: "Shipped real-time fleet tracking for a growing logistics operator.",
    description:
      "Placeholder case study — live fleet visibility, route planning, and dispatch tools built for day-to-day logistics operations.",
    tags: ["Logistics", "Fleet Ops", "Dispatch"],
    image: "/media/case-logistics.jpg",
    gradient: "linear-gradient(145deg, #3a1c2e 0%, #642b46 55%, #8f3a5e 100%)",
    stats: [
      { value: "Fleet Ops", label: "Core module" },
      { value: "Real-time", label: "Tracking" },
    ],
    href: "/work",
  },
];

const STORIES: Story[] = [...REAL_STORIES, ...PLACEHOLDER_STORIES];

function StoryCard({ story }: { story: Story }) {
  return (
    <article className="group relative overflow-hidden rounded-[32px] p-3 shadow-[0_20px_50px_rgba(9,9,11,0.1)] sm:p-3.5" style={{ background: story.gradient }}>
      <div className="relative overflow-hidden rounded-[22px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={story.image}
          alt=""
          loading="lazy"
          className="h-[220px] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] sm:h-[260px] lg:h-[280px]"
        />
        {/*
          The placeholder photography is the same abstract blur asset reused
          across cards — tinting it with the card's own gradient (blend
          mode, not opacity) makes each card read as its own color-graded
          shot instead of six copies of the same image.
        */}
        <div aria-hidden className="pointer-events-none absolute inset-0 mix-blend-overlay" style={{ background: story.gradient }} />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-black/10" />
      </div>

      <div className="relative z-10 -mt-9 rounded-[22px] bg-canvas p-6 shadow-[0_16px_36px_rgba(9,9,11,0.14)] sm:-mt-10 sm:p-7">
        <p className="font-urbanist text-[11px] font-bold uppercase tracking-[0.2em] text-aurora-violet">Case Study</p>
        <h3 className="mt-2.5 font-urbanist text-xl font-bold leading-snug tracking-tight text-ink lg:text-[22px]">{story.headline}</h3>
        <p className="mt-2.5 font-urbanist text-[13.5px] leading-relaxed text-ink-dim">{story.description}</p>

        <div className="mt-5 grid grid-cols-2 gap-4 border-y border-hairline py-4">
          {story.stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-urbanist text-[15px] font-bold leading-tight text-ink">{stat.value}</p>
              <p className="mt-1 font-urbanist text-[11.5px] leading-snug text-ink-dim">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {story.tags.map((t) => (
              <span key={t} className="rounded-full border border-hairline bg-canvas-raised px-2.5 py-1 font-urbanist text-[11px] text-ink-dim">
                {t}
              </span>
            ))}
          </div>
          <Link
            href={story.href}
            className="group/link inline-flex shrink-0 items-center gap-1.5 font-urbanist text-[13.5px] font-semibold text-ink transition-colors duration-200 hover:text-aurora-violet"
          >
            Read More
            <ArrowRight size={14} strokeWidth={2} className="transition-transform duration-200 group-hover/link:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function CaseStudies() {
  return (
    <section className="theme-light relative bg-light-surface py-16 lg:py-24" aria-labelledby="work-heading">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 inline-flex items-center gap-2.5 font-urbanist text-[11px] font-medium uppercase tracking-[0.28em] text-ink-dim">
                <span className="h-1.5 w-1.5 rounded-full bg-aurora-amber" />
                Success Stories
              </p>
              <h2 id="work-heading" className="font-urbanist text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl">
                Work that ships, every time.
              </h2>
            </div>
            <p className="max-w-sm font-urbanist text-[15px] leading-relaxed text-ink-dim">
              From unclear scope to launched product — with weekly progress, clean handover, and outcomes clients
              own.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:gap-10">
          {STORIES.map((story, i) => (
            <Reveal key={story.project} delay={(i % 2) * 80}>
              <StoryCard story={story} />
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-12 flex justify-center lg:mt-14">
            <Link
              href="/work"
              className="inline-flex items-center gap-2 rounded-full bg-aurora-violet px-7 py-3.5 font-urbanist text-sm font-semibold text-white transition-[background-color,transform] duration-300 hover:scale-[1.02] hover:bg-aurora-violet-dark"
            >
              View All Success Stories
              <ArrowRight size={15} strokeWidth={1.75} />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
