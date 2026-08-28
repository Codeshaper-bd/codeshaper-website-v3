"use client";

import Link from "next/link";
import { useEffect, useRef, type CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import { Rocket, Boxes, Users, UserPlus, Globe2, ArrowRight } from "lucide-react";
import gsap from "gsap";
import Reveal from "@/components/system/Reveal";
import { SectionEyebrow, SectionTitle, SectionDescription } from "@/components/system/SectionHeading";
import { useMotionAllowed } from "@/lib/motion";
import { textSafeAccent } from "@/lib/color";

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
 *
 * Round 2, direct feedback:
 *  - "Compare Engagement Models" moves from its own row below the grid
 *    up into the header, alongside the description — same
 *    eyebrow+title / description+CTA arrangement Services/Industries
 *    already use, instead of a separate CTA row at the bottom.
 *  - Cards get a clearly visible border (`border-hairline-strong`
 *    instead of the barely-there default `border-hairline`) rather than
 *    relying on hover to reveal any edge at all.
 *  - Added the same pointer-driven 3D tilt ServicePillars' own
 *    ServiceCard uses (`useCardTilt` — rotationX/Y via GSAP, gated on
 *    `useMotionAllowed` so it's desktop-fine-pointer only) for a more
 *    premium hover interaction than the flat lift+shadow alone.
 *
 * Round 3: the "uneven card heights" in the reference screenshot turned
 * out to be exactly what was wanted — a deliberate cascading offset, not
 * a bug to fix. Each card now sits progressively lower than the one
 * before it (`--stagger-y` custom property, applied via `lg:mt-[...]`
 * so it only affects the single-row desktop layout, not the stacked
 * mobile/tablet grid). Each card also gets its own "Learn more" link to
 * a real per-model page (hrefs pulled from ENGAGEMENT_MODELS in
 * navigation.ts, the same data MegaPanel/MobileMenu already use for
 * these exact 5 routes) instead of only the shared "Compare Models" CTA.
 */
type Model = {
  name: string;
  fit: string;
  icon: LucideIcon;
  accent: string;
  href: string;
};

const MODELS: Model[] = [
  {
    name: "MVP Sprint",
    fit: "Fastest lane from idea to a shippable first product.",
    icon: Rocket,
    accent: "#8a7bff",
    href: "/engagement/mvp-sprint",
  },
  {
    name: "End-to-End Delivery",
    fit: "We own the full build against an agreed scope.",
    icon: Boxes,
    accent: "#5b9bdb",
    href: "/engagement/end-to-end-delivery",
  },
  {
    name: "Dedicated Product Team",
    fit: "A stable squad embedded on your roadmap.",
    icon: Users,
    accent: "#3fae82",
    href: "/engagement/dedicated-team",
  },
  {
    name: "Team Augmentation",
    fit: "Specialists slot into your existing team.",
    icon: UserPlus,
    accent: "#d99a4e",
    href: "/engagement/team-augmentation",
  },
  {
    name: "Global Delivery Model",
    fit: "Distributed build, single-point accountability.",
    icon: Globe2,
    accent: "#db5a89",
    href: "/engagement/global-delivery",
  },
];

/** Same pointer-driven 3D tilt ServicePillars' ServiceCard uses. */
function useCardTilt(cardRef: React.RefObject<HTMLElement | null>, degrees: number) {
  const interactive = useMotionAllowed();
  useEffect(() => {
    const card = cardRef.current;
    if (!card || !interactive) return;
    gsap.set(card, { rotationX: 0, rotationY: 0, scaleX: 1, scaleY: 1 });

    const onMove = (e: PointerEvent) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      gsap.to(card, {
        rotationY: (px - 0.5) * degrees,
        rotationX: -(py - 0.5) * degrees,
        duration: 0.6,
        ease: "power3.out",
        overwrite: "auto",
      });
    };
    const onEnter = () => gsap.to(card, { scaleX: 1.015, scaleY: 1.015, duration: 0.4, ease: "power3.out", overwrite: "auto" });
    const onLeave = () =>
      gsap.to(card, { rotationX: 0, rotationY: 0, scaleX: 1, scaleY: 1, duration: 0.6, ease: "power3.out", overwrite: "auto" });

    card.addEventListener("pointermove", onMove);
    card.addEventListener("pointerenter", onEnter);
    card.addEventListener("pointerleave", onLeave);
    return () => {
      card.removeEventListener("pointermove", onMove);
      card.removeEventListener("pointerenter", onEnter);
      card.removeEventListener("pointerleave", onLeave);
    };
  }, [interactive, cardRef, degrees]);
}

function ModelCard({ model, index }: { model: Model; index: number }) {
  const Icon = model.icon;
  const n = String(index + 1).padStart(2, "0");
  const cardRef = useRef<HTMLElement>(null);
  useCardTilt(cardRef, 5);
  return (
    <article
      ref={cardRef}
      className="group relative flex h-[320px] flex-col justify-between overflow-hidden rounded-[28px] border border-hairline-strong bg-[#fafafa] p-7 transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1.5 hover:border-aurora-violet/30 hover:shadow-[0_28px_60px_var(--card-glow)] sm:p-8"
      style={{ "--card-glow": `${model.accent}26`, willChange: "transform" } as CSSProperties}
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
        <Link
          href={model.href}
          className="mt-4 inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-urbanist text-[12.5px] font-semibold transition-[background-color,transform] duration-300 hover:scale-[1.02]"
          style={{ borderColor: `${model.accent}55`, color: textSafeAccent(model.accent), backgroundColor: `${model.accent}12` }}
        >
          Learn more
          <span className="sr-only"> about {model.name}</span>
          <ArrowRight size={12} strokeWidth={2} />
        </Link>
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
              <SectionTitle id="engagement-heading" className="max-w-md">
                Flexible engagement models built around your roadmap.
              </SectionTitle>
            </div>
            <div className="flex items-center gap-4">
              <SectionDescription className="max-w-xs">
                Choose the model that matches your scope certainty, timeline, and team structure.
              </SectionDescription>
              <Link
                href="/engagement"
                className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-aurora-violet px-5 py-2.5 font-urbanist text-[13px] font-semibold text-white transition-[background-color,transform] duration-300 hover:scale-[1.02] hover:bg-aurora-violet-dark"
              >
                Compare Models
                <ArrowRight size={14} strokeWidth={1.75} />
              </Link>
            </div>
          </div>
        </Reveal>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5 lg:items-start">
          {MODELS.map((m, i) => (
            <li
              key={m.name}
              className={`lg:mt-[var(--stagger-y)] ${i === MODELS.length - 1 ? "sm:col-span-2 lg:col-span-1" : ""}`}
              style={{ "--stagger-y": `${i * 28}px` } as CSSProperties}
            >
              <Reveal delay={i * 80} className="h-full [perspective:900px]">
                <ModelCard model={m} index={i} />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
