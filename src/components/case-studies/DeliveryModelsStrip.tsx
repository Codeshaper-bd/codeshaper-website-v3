"use client";

import Link from "next/link";
import { useEffect, useRef, type CSSProperties, type RefObject } from "react";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import Reveal from "@/components/system/Reveal";
import { Icon } from "@/lib/icons";
import { ENGAGEMENT_MODELS, type EngagementModel } from "@/lib/navigation";
import { SectionEyebrow, SectionTitle, SectionDescription } from "@/components/system/SectionHeading";
import { useMotionAllowed } from "@/lib/motion";

/**
 * "How we work" — round 2. Reuses the homepage EngagementModels card
 * recipe (per-model accent tint, ghost numeral, pointer-driven 3D tilt)
 * instead of the plain flat card grid this section started with, per
 * direct request to bring it up to the same premium bar. Accents are
 * the same 5 hex values EngagementModels.tsx already uses for these
 * exact 5 models, keyed by slug since ENGAGEMENT_MODELS itself doesn't
 * carry a color field.
 */
const ACCENTS: Record<string, string> = {
  "mvp-sprint": "#8a7bff",
  "end-to-end-delivery": "#5b9bdb",
  "dedicated-team": "#3fae82",
  "team-augmentation": "#d99a4e",
  "global-delivery": "#db5a89",
};

function useCardTilt(cardRef: RefObject<HTMLElement | null>, degrees: number) {
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

function ModelCard({ model, index }: { model: EngagementModel; index: number }) {
  const accent = ACCENTS[model.href.split("/").pop()!] ?? "#8a7bff";
  const n = String(index + 1).padStart(2, "0");
  const cardRef = useRef<HTMLElement>(null);
  useCardTilt(cardRef, 5);

  return (
    <article
      ref={cardRef}
      className="group relative flex h-[300px] flex-col justify-between overflow-hidden rounded-[24px] border border-hairline-light bg-light-raised p-6 transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1.5 hover:border-aurora-violet/30 hover:shadow-[0_28px_60px_var(--card-glow)]"
      style={{ "--card-glow": `${accent}26`, willChange: "transform" } as CSSProperties}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05] transition-opacity duration-300 ease-out group-hover:opacity-[0.09]"
        style={{ background: `radial-gradient(circle at 85% 15%, ${accent}, transparent 60%)` }}
      />

      <div className="relative z-10 flex items-start justify-between">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-hairline-light transition-transform duration-300 ease-out group-hover:scale-110"
          style={{ color: accent }}
        >
          <Icon name={model.icon} size={17} />
        </span>
        <span
          aria-hidden
          className="select-none font-urbanist text-[62px] font-extrabold leading-none tracking-tight transition-transform duration-300 ease-out group-hover:scale-105"
          style={{ color: accent, opacity: 0.22 }}
        >
          {n}
        </span>
      </div>

      <div className="relative z-10">
        <h3 className="font-urbanist text-[15.5px] font-bold leading-snug text-ink">{model.label}</h3>
        <p className="mt-1.5 font-urbanist text-[12.5px] leading-relaxed text-ink-dim">{model.desc}</p>
        <Link
          href={model.href}
          className="mt-4 inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-urbanist text-[12px] font-semibold transition-[background-color,transform] duration-300 hover:scale-[1.02]"
          style={{ borderColor: `${accent}55`, color: accent, backgroundColor: `${accent}12` }}
        >
          Learn more
          <ArrowRight size={12} strokeWidth={2} />
        </Link>
      </div>
    </article>
  );
}

export default function DeliveryModelsStrip() {
  return (
    <div className="bg-light-surface p-3 sm:p-4">
      <section className="theme-light relative overflow-hidden rounded-[32px] bg-canvas py-14 lg:py-20" aria-labelledby="models-heading">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <SectionEyebrow>How we work</SectionEyebrow>
                <SectionTitle id="models-heading">Delivered through proven working models</SectionTitle>
                <SectionDescription className="mt-3 max-w-md">
                  Every case study above is tied to one of these delivery systems — choose how you want to work.
                </SectionDescription>
              </div>
              <Link
                href="/engagement"
                className="inline-flex w-fit items-center gap-2 rounded-full bg-aurora-violet px-6 py-3 font-urbanist text-sm font-semibold text-white transition-[background-color,transform] duration-300 hover:scale-[1.02] hover:bg-aurora-violet-dark"
              >
                Explore How We Work
                <ArrowRight size={15} strokeWidth={1.75} />
              </Link>
            </div>
          </Reveal>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {ENGAGEMENT_MODELS.map((m, i) => (
              <li key={m.href} className={i === ENGAGEMENT_MODELS.length - 1 ? "sm:col-span-2 lg:col-span-1" : ""}>
                <Reveal delay={i * 70} className="h-full [perspective:900px]">
                  <ModelCard model={m} index={i} />
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
