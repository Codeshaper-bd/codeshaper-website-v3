"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiFigma, SiSketch, SiFramer as SiFramerTool, SiReact, SiNextdotjs, SiNodedotjs, SiTypescript, SiWordpress, SiWebflow, SiGoogleanalytics, SiShopify, SiWoocommerce, SiStripe, SiPython, SiLangchain, SiHuggingface, SiZapier } from "react-icons/si";
import type { IconType } from "react-icons";
import { SERVICE_COLUMNS } from "@/lib/navigation";
import { Icon, SERVICE_ICONS } from "@/lib/icons";
import Reveal from "@/components/system/Reveal";
import Spotlight from "@/components/system/Spotlight";
import { SectionEyebrow, SectionTitle, SectionDescription } from "@/components/system/SectionHeading";
import { useMotionAllowed } from "@/lib/motion";
import gsap from "gsap";

/** Representative tools/tech per practice — shown as a small icon row on each card. */
const TOOL_ICONS: Record<string, IconType[]> = {
  design: [SiFigma, SiSketch, SiFramerTool],
  engineering: [SiReact, SiNextdotjs, SiNodedotjs, SiTypescript],
  websites: [SiWordpress, SiWebflow, SiGoogleanalytics],
  commerce: [SiShopify, SiWoocommerce, SiStripe],
  ai: [SiPython, SiLangchain, SiHuggingface, SiZapier],
};

function ToolStack({ id, dark = false }: { id: string; dark?: boolean }) {
  const tools = TOOL_ICONS[id];
  if (!tools) return null;
  return (
    <div className="relative z-10 mt-5 flex items-center gap-2">
      {tools.map((ToolIcon, i) => (
        <span
          key={i}
          className={`flex h-7 w-7 items-center justify-center rounded-full ${
            dark ? "border border-white/15 bg-white/[0.06] text-white/70" : "border border-hairline bg-canvas text-ink-dim"
          }`}
        >
          <ToolIcon aria-hidden size={13} />
        </span>
      ))}
    </div>
  );
}

/**
 * Services — card grid (inspired by aigocy's numbered service cards)
 * replacing the previous single-column numbered-row list. theme-light is
 * applied so the aurora-/ink- tokens used inside (icon tiles, hover accents)
 * resolve to their light-appropriate values — the previous version used
 * these tokens without theme-light, which silently resolved to the dark-mode
 * values (near-white) and made the number's hover color invisible on this
 * light background. bg-light-surface itself is untouched (a fixed token,
 * shared with TrustStrip's background and Hero's outer frame) so the
 * seamless match across all three sections is unaffected.
 *
 * "AI & Automation" is reordered to the front here (SERVICE_COLUMNS itself
 * stays in its original order since the mega menu's Core Services list
 * depends on it) and rendered as a wide, dark feature card — reusing the
 * mega menu's own featured-card gradient — spanning the other 2 columns of
 * row 1 so it visibly leads and stands out from the 4 uniform cards after
 * it, instead of just carrying a small badge.
 */
const AI_COLUMN = SERVICE_COLUMNS.find((c) => c.id === "ai")!;
const ORDERED_COLUMNS = [AI_COLUMN, ...SERVICE_COLUMNS.filter((c) => c.id !== "ai")];

function useCardTilt(cardRef: React.RefObject<HTMLDivElement | null>, degrees: number) {
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

function ServiceCard({ col, displayNumber }: { col: (typeof SERVICE_COLUMNS)[number]; displayNumber: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  useCardTilt(cardRef, 6);

  const visibleLinks = col.links.slice(0, 3);
  const moreCount = col.links.length - visibleLinks.length;

  return (
    <div className="h-full" style={{ perspective: "900px" }}>
      <Spotlight color="rgba(24, 24, 27, 0.05)" radius={360} className="h-full rounded-[28px] bg-[#fafafa]">
        <div
          ref={cardRef}
          className="relative flex h-full flex-col rounded-[28px] border border-hairline bg-[#fafafa] p-7 transition-[border-color,box-shadow] duration-300 hover:border-aurora-violet/20 hover:shadow-[0_20px_50px_rgba(9,9,11,0.08)] lg:p-8"
        >
          <div className="relative z-10 flex items-start justify-between">
            <span className="font-urbanist text-sm font-semibold text-ink-faint">{displayNumber}</span>
          </div>

          <span className="mega-icon-tile relative z-10 mt-5 flex h-12 w-12 items-center justify-center rounded-xl text-aurora-indigo">
            <Icon name={SERVICE_ICONS[col.id]} size={20} />
          </span>

          <Link href={col.href} className="group/title relative z-10 mt-5 inline-flex items-start gap-1.5">
            <h3 className="font-urbanist text-xl font-bold leading-snug tracking-tight text-ink transition-colors duration-200 group-hover/title:text-aurora-violet">
              {col.title}
            </h3>
            <ArrowRight
              size={16}
              strokeWidth={2}
              className="mt-1.5 shrink-0 text-ink-faint transition-transform duration-200 group-hover/title:translate-x-1 group-hover/title:text-aurora-violet"
            />
          </Link>

          <p className="relative z-10 mt-2.5 font-urbanist text-[14.5px] leading-relaxed text-ink-dim">{col.blurb}</p>

          <ToolStack id={col.id} />

          <ul className="relative z-10 mt-5 flex-1 space-y-0.5 border-t border-hairline pt-4">
            {visibleLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="group/row flex items-center gap-2 rounded-lg px-1.5 py-1.5 font-urbanist text-[13px] font-medium text-ink-dim transition-colors duration-200 hover:bg-canvas-raised hover:text-ink"
                >
                  <Icon name={l.icon} size={13} className="shrink-0 text-ink-faint" />
                  <span className="truncate">{l.label}</span>
                </Link>
              </li>
            ))}
            {moreCount > 0 && <li className="px-1.5 pt-1 font-urbanist text-[12px] text-ink-faint">+{moreCount} more</li>}
          </ul>
        </div>
      </Spotlight>
    </div>
  );
}

function FeaturedServiceCard({ col }: { col: (typeof SERVICE_COLUMNS)[number] }) {
  const cardRef = useRef<HTMLDivElement>(null);
  useCardTilt(cardRef, 4);

  return (
    <div className="h-full overflow-hidden rounded-[28px] bg-[#0b0f19]" style={{ perspective: "1100px" }}>
      <div
        ref={cardRef}
        className="mega-feature-card relative flex h-full flex-col overflow-hidden rounded-[28px] p-7 lg:flex-row lg:items-center lg:gap-10 lg:p-10"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 text-white opacity-[0.04]"
          style={{ backgroundImage: "url(/media/hex-pattern-tile.svg)", backgroundSize: "112px 194px" }}
        />

        <div className="relative z-10 flex-1">
          <div className="flex items-center gap-3">
            <span className="font-urbanist text-sm font-semibold text-white/40">01</span>
            <span className="rounded-full bg-white/10 px-2.5 py-0.5 font-urbanist text-[10px] font-bold uppercase tracking-wide text-white">
              Featured
            </span>
          </div>

          <span className="mt-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-white lg:mt-6">
            <Icon name={SERVICE_ICONS[col.id]} size={20} />
          </span>

          <Link href={col.href} className="group/title relative z-10 mt-5 inline-flex items-start gap-2 lg:mt-6">
            <h3 className="font-urbanist text-2xl font-bold leading-snug tracking-tight text-white sm:text-3xl">
              {col.title}
            </h3>
            <ArrowRight
              size={20}
              strokeWidth={2}
              className="mt-2 shrink-0 text-white/60 transition-transform duration-200 group-hover/title:translate-x-1 group-hover/title:text-white"
            />
          </Link>

          <p className="relative z-10 mt-3 max-w-md font-urbanist text-[15px] leading-relaxed text-white/70">{col.blurb}</p>

          <ToolStack id={col.id} dark />
        </div>

        <ul className="relative z-10 mt-7 flex-1 space-y-1 lg:mt-0 lg:max-w-sm">
          {col.links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="group/row flex items-center gap-2.5 rounded-xl px-3 py-2.5 font-urbanist text-[13.5px] font-medium text-white/75 transition-colors duration-200 hover:bg-white/[0.08] hover:text-white"
              >
                <Icon name={l.icon} size={14} className="shrink-0 text-white/50" />
                <span className="truncate">{l.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function ServicePillars() {
  return (
    <div className="bg-light-surface p-3 sm:p-4">
      <section
        className="theme-light relative overflow-hidden rounded-[32px] bg-canvas py-16 lg:py-24"
        aria-labelledby="services-heading"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
          <SectionEyebrow>What we do</SectionEyebrow>
          <SectionTitle id="services-heading" size="lg" className="max-w-2xl">
            Five practices, one delivery system.
          </SectionTitle>
          <SectionDescription className="mt-5 max-w-xl">
            Every project moves through the same disciplines — from first sketch to a shipped, supported product.
          </SectionDescription>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ORDERED_COLUMNS.map((col, i) => (
            <Reveal key={col.id} delay={i * 80} className={col.id === "ai" ? "sm:col-span-2 lg:col-span-2" : undefined}>
              {col.id === "ai" ? (
                <FeaturedServiceCard col={col} />
              ) : (
                <ServiceCard col={col} displayNumber={String(i + 1).padStart(2, "0")} />
              )}
            </Reveal>
          ))}
        </div>

        <Reveal delay={ORDERED_COLUMNS.length * 80}>
          <div className="mt-12">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-full bg-aurora-violet px-7 py-3.5 font-urbanist text-sm font-semibold text-white transition-[background-color,transform] duration-300 hover:scale-[1.02] hover:bg-aurora-violet-dark"
            >
              Explore All Services
              <ArrowRight size={15} strokeWidth={1.75} />
            </Link>
          </div>
        </Reveal>
        </div>
      </section>
    </div>
  );
}
