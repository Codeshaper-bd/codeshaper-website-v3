"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import { Rocket, Boxes, Users, UserPlus, Globe2, ArrowRight } from "lucide-react";
import Reveal from "@/components/system/Reveal";
import { SectionEyebrow, SectionTitle, SectionDescription } from "@/components/system/SectionHeading";

/**
 * Engagement models — compact, single-row (on desktop) lineup of standout
 * cards: an icon badge, a huge ghost numeral tinted in the card's own
 * accent, then title + a one-line fit.
 *
 * Moved from the dark root scope onto the site's standard `bg-light-surface`
 * (#f5f4f2) light section, matching every other section on the page —
 * the earlier dark version was a deliberate rhythm choice, but the site
 * now reads more consistently with this section on the same light
 * surface as its neighbors. Cards follow Services' own light-card recipe
 * exactly (`bg-[#fafafa]`, `border-hairline`, `hover:border-aurora-violet/20`,
 * `hover:shadow-[0_20px_50px_rgba(9,9,11,0.08)]`) and the icon badge reuses
 * the shared `.mega-icon-tile` class Services/Industries already use,
 * rather than a one-off treatment. The per-card accent tint (ghost
 * numeral + radial wash) is kept from the dark version — same idea,
 * recalibrated to much lower opacity since a saturated color reads far
 * more strongly against white than against near-black.
 *
 * The 2/5-column split on the last (5th) card mirrors DeliverySystem's
 * own `i === 4 ? "sm:col-span-2 lg:col-span-1" : ""` pattern for a
 * 5-item grid — reusing that exact convention rather than inventing a
 * new one.
 */
type Model = {
  name: string;
  fit: string;
  icon: LucideIcon;
  accent: string;
};

const MODELS: Model[] = [
  {
    name: "MVP Sprint",
    fit: "Fastest lane from idea to a shippable first product.",
    icon: Rocket,
    accent: "#7c6cff",
  },
  {
    name: "End-to-End Delivery",
    fit: "We own the full build against an agreed scope.",
    icon: Boxes,
    accent: "#5b9bdb",
  },
  {
    name: "Dedicated Product Team",
    fit: "A stable squad embedded on your roadmap.",
    icon: Users,
    accent: "#3fae82",
  },
  {
    name: "Team Augmentation",
    fit: "Specialists slot into your existing team.",
    icon: UserPlus,
    accent: "#d99a4e",
  },
  {
    name: "Global Delivery Model",
    fit: "Distributed build, single-point accountability.",
    icon: Globe2,
    accent: "#d1487a",
  },
];

function ModelCard({ model, index }: { model: Model; index: number }) {
  const Icon = model.icon;
  const n = String(index + 1).padStart(2, "0");
  return (
    <article
      className="group relative flex h-[320px] flex-col justify-between overflow-hidden rounded-[28px] border border-hairline bg-[#fafafa] p-7 transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1.5 hover:border-aurora-violet/20 hover:shadow-[0_28px_60px_var(--card-glow)] sm:p-8"
      style={{ "--card-glow": `${model.accent}26` } as CSSProperties}
    >
      {/* subtle per-card tint wash — same technique as the earlier dark version, much lower opacity for a light card */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05] transition-opacity duration-300 ease-out group-hover:opacity-[0.09]"
        style={{ background: `radial-gradient(circle at 85% 15%, ${model.accent}, transparent 60%)` }}
      />

      <div className="relative z-10 flex items-start justify-between">
        <span className="mega-icon-tile flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 ease-out group-hover:scale-110" style={{ color: model.accent }}>
          <Icon size={19} strokeWidth={1.75} />
        </span>
        <span
          aria-hidden
          className="select-none font-urbanist text-[76px] font-extrabold leading-none tracking-tight transition-transform duration-300 ease-out group-hover:scale-105"
          style={{ color: model.accent, opacity: 0.22 }}
        >
          {n}
        </span>
      </div>

      <div className="relative z-10">
        <h3 className="font-urbanist text-lg font-bold leading-snug text-ink sm:text-xl">{model.name}</h3>
        <p className="mt-2 font-urbanist text-[13.5px] leading-relaxed text-ink-dim">{model.fit}</p>
      </div>
    </article>
  );
}

export default function EngagementModels() {
  return (
    <section className="theme-light relative bg-light-surface py-16 lg:py-20" aria-labelledby="engagement-heading">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <SectionEyebrow>Engagement Models</SectionEyebrow>
              <SectionTitle id="engagement-heading">Flexible ways to work with us.</SectionTitle>
            </div>
            <SectionDescription className="max-w-sm">
              Choose the model that matches your scope certainty, timeline, and team structure.
            </SectionDescription>
          </div>
        </Reveal>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {MODELS.map((m, i) => (
            <li key={m.name} className={i === MODELS.length - 1 ? "sm:col-span-2 lg:col-span-1" : ""}>
              <Reveal delay={i * 80} className="h-full">
                <ModelCard model={m} index={i} />
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal delay={150}>
          <div className="mt-12">
            <Link
              href="/engagement"
              className="inline-flex items-center gap-2 rounded-full bg-aurora-violet px-7 py-3.5 font-urbanist text-sm font-semibold text-white transition-[background-color,transform] duration-300 hover:scale-[1.02] hover:bg-aurora-violet-dark"
            >
              Compare Engagement Models
              <ArrowRight size={15} strokeWidth={1.75} />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
