"use client";

import Link from "next/link";
import { useEffect, useRef, type CSSProperties, type RefObject } from "react";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { useMotionAllowed } from "@/lib/motion";
import { textSafeAccent } from "@/lib/color";
import type { ModelCardData } from "@/lib/engagementModels";

export type { ModelCardData };

/** Pointer-driven 3D tilt — desktop fine-pointer only (gated on useMotionAllowed). */
export function useCardTilt(cardRef: RefObject<HTMLElement | null>, degrees: number) {
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

/**
 * The engagement-model card recipe — extracted after this drifted twice
 * between the homepage (sections/EngagementModels.tsx) and the case
 * studies page (case-studies/DeliveryModelsStrip.tsx): different icon
 * set, card height, numeral size, and no cascading stagger on the copy.
 * Both now render this exact component, so there's nothing left to
 * drift — only the surrounding section copy/CTA differs per page. Data
 * itself lives in lib/engagementModels.ts (see that file's note on why).
 */
export function ModelCard({ model, index }: { model: ModelCardData; index: number }) {
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
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05] transition-opacity duration-300 ease-out group-hover:opacity-[0.09]"
        style={{ background: `radial-gradient(circle at 85% 15%, ${model.accent}, transparent 60%)` }}
      />

      <div className="relative z-10 flex items-start justify-between">
        <span
          className="mega-icon-tile flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 ease-out group-hover:scale-110"
          style={{ color: model.accent }}
        >
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
