"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Layers, Globe2, Users, MapPin, Puzzle, Clock, Boxes, Sparkles, Move } from "lucide-react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import Reveal from "@/components/system/Reveal";
import { SectionEyebrow, SectionTitle, SectionDescription } from "@/components/system/SectionHeading";
import { usePrefersReducedMotion } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(Draggable, InertiaPlugin);
}

/**
 * About — "who we are" section right after Services.
 *
 * Round 3 added a Vivasoft-style "why teams choose us" grid, per-stat
 * accent colors, and made the two collage photos draggable via GSAP's
 * Draggable + InertiaPlugin (both free/bundled as of gsap@3.15). Drag is
 * bounded to a small radius and elastic-snaps back to its origin on
 * release; still gated on prefers-reduced-motion since the snap-back
 * itself is a motion effect, even though the drag is user-initiated.
 *
 * Round 4: the stat/feature cards read as flat single-tone chips, so
 * both now follow EngagementModels' ModelCard recipe instead — rounded
 * [24-28px], a per-card radial accent wash, a gradient+ring icon tile
 * instead of a flat-tint circle, and (on the feature cards) a large
 * ghost index numeral. The bottom photo strip was a fixed CSS grid
 * (hardcoded to exactly 5 slots, one hidden below sm:) which couldn't
 * take more photos and wasn't draggable — replaced with the same
 * pointer-driven `scrollLeft` drag-to-scroll track Testimonials.tsx/
 * CaseStudiesExpand.tsx already use (drag on mouse, native scroll on
 * touch, click-vs-drag disambiguated via a movement threshold), so any
 * number of photos can be added later without touching the layout.
 *
 * Every stat/feature is still an actual structural fact already
 * established elsewhere in the codebase (SERVICE_COLUMNS, INDUSTRIES,
 * TrustStrip's client list, Locations' 6-country footprint, and
 * EngagementModels' five models) — no founding year, headcount, award
 * count, or certification is invented, since none of that exists
 * anywhere in this codebase as verified fact.
 *
 * Photos are Picsum placeholders (seeded, stable across renders) — real
 * office/team photos replace these directly once supplied. Picsum
 * specifically, not a keyword-searchable service like LoremFlickr: a live
 * sample from LoremFlickr's pool turned out to be a real, CC-NC-ND-licensed
 * press photo of named identifiable people, which would both violate that
 * license on a commercial site and falsely imply real strangers are
 * CodeShaper staff. Picsum's photos are Unsplash-sourced and commercially
 * licensed, just not content-targetable — grayscale-by-default/color-on-
 * hover makes the mismatch (a sunset, a car dashboard) read as an
 * intentional editorial choice instead of the wrong photo.
 */
const STATS: { value: number; suffix: string; label: string; icon: typeof Layers; accent: string }[] = [
  { value: 5, suffix: "", label: "Core practices", icon: Layers, accent: "#8a7bff" },
  { value: 10, suffix: "", label: "Industries served", icon: Globe2, accent: "#5b9bdb" },
  { value: 16, suffix: "+", label: "Clients worldwide", icon: Users, accent: "#3fae82" },
  { value: 6, suffix: "", label: "Countries, one team", icon: MapPin, accent: "#d99a4e" },
];

const FEATURES: { title: string; desc: string; icon: typeof Layers; accent: string }[] = [
  {
    title: "One team, five disciplines",
    desc: "Design, engineering, commerce, websites, and AI automation under one roof — no vendor handoffs.",
    icon: Puzzle,
    accent: "#8a7bff",
  },
  {
    title: "Real timezone overlap",
    desc: "Delivery hub in Bangladesh, collaboration hubs across the US, UK, Japan, Australia, and New Zealand.",
    icon: Clock,
    accent: "#5b9bdb",
  },
  {
    title: "An engagement model that fits",
    desc: "From an MVP sprint to a fully dedicated team — pick the shape that matches your roadmap.",
    icon: Boxes,
    accent: "#3fae82",
  },
  {
    title: "AI-first, not bolted on",
    desc: "AI & automation is one of our five core practices, built into how we design and ship from day one.",
    icon: Sparkles,
    accent: "#d99a4e",
  },
];

const STRIP_PHOTOS = [
  "https://picsum.photos/seed/codeshaper-studio-1/500/500",
  "https://picsum.photos/seed/codeshaper-studio-2/500/500",
  "https://picsum.photos/seed/codeshaper-studio-3/500/500",
  "https://picsum.photos/seed/codeshaper-studio-4/500/500",
  "https://picsum.photos/seed/codeshaper-studio-5/500/500",
  "https://picsum.photos/seed/codeshaper-studio-6/500/500",
  "https://picsum.photos/seed/codeshaper-studio-7/500/500",
  "https://picsum.photos/seed/codeshaper-studio-8/500/500",
];

function CountUpStat({
  value,
  suffix,
  label,
  icon: Icon,
  accent,
  delay,
}: {
  value: number;
  suffix: string;
  label: string;
  icon: typeof Layers;
  accent: string;
  delay: number;
}) {
  const reduced = usePrefersReducedMotion();
  const numRef = useRef<HTMLSpanElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = numRef.current;
    const wrap = wrapRef.current;
    if (!el || !wrap) return;
    if (reduced) {
      el.textContent = String(value);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const counter = { n: 0 };
        gsap.to(counter, {
          n: value,
          duration: 1.4,
          delay: delay / 1000,
          ease: "power2.out",
          onUpdate() {
            el.textContent = String(Math.round(counter.n));
          },
        });
      },
      { threshold: 0.4 }
    );
    io.observe(wrap);
    return () => io.disconnect();
  }, [reduced, value, delay]);

  return (
    <div
      ref={wrapRef}
      className="group relative overflow-hidden rounded-[24px] border border-hairline bg-[#fafafa] p-5 transition-[border-color,box-shadow,transform] duration-300 ease-out hover:-translate-y-1 hover:border-aurora-violet/15 hover:shadow-[0_24px_50px_var(--stat-glow)]"
      style={{ "--stat-glow": `${accent}26` } as CSSProperties}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05] transition-opacity duration-300 ease-out group-hover:opacity-[0.09]"
        style={{ background: `radial-gradient(circle at 85% 10%, ${accent}, transparent 60%)` }}
      />
      <span
        className="relative z-10 flex h-11 w-11 items-center justify-center rounded-2xl transition-transform duration-300 ease-out group-hover:scale-110"
        style={{ background: `linear-gradient(135deg, ${accent}29, ${accent}0d)`, color: accent, boxShadow: `inset 0 0 0 1px ${accent}26` }}
      >
        <Icon size={19} strokeWidth={1.75} />
      </span>
      <p className="relative z-10 mt-5 font-urbanist text-3xl font-bold tracking-tight text-ink sm:text-[34px]">
        <span ref={numRef}>0</span>
        {suffix}
      </p>
      <p className="relative z-10 mt-1 font-urbanist text-[13px] leading-snug text-ink-dim">{label}</p>
    </div>
  );
}

function FeatureCard({ feature, index }: { feature: (typeof FEATURES)[number]; index: number }) {
  const Icon = feature.icon;
  const n = String(index + 1).padStart(2, "0");
  return (
    <div
      className="group relative overflow-hidden rounded-[28px] border border-hairline bg-[#fafafa] p-7 transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1.5 hover:border-aurora-violet/20 hover:shadow-[0_28px_60px_var(--feat-glow)] sm:p-8"
      style={{ "--feat-glow": `${feature.accent}22` } as CSSProperties}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] transition-opacity duration-300 ease-out group-hover:opacity-[0.1]"
        style={{ background: `radial-gradient(circle at 88% 12%, ${feature.accent}, transparent 60%)` }}
      />
      <div className="relative z-10 flex items-start justify-between">
        <span
          className="flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 ease-out group-hover:scale-110"
          style={{ background: `linear-gradient(135deg, ${feature.accent}29, ${feature.accent}0d)`, color: feature.accent, boxShadow: `inset 0 0 0 1px ${feature.accent}26` }}
        >
          <Icon size={20} strokeWidth={1.75} />
        </span>
        <span
          aria-hidden
          className="select-none font-urbanist text-[52px] font-extrabold leading-none tracking-tight transition-transform duration-300 ease-out group-hover:scale-105"
          style={{ color: feature.accent, opacity: 0.16 }}
        >
          {n}
        </span>
      </div>
      <h3 className="relative z-10 mt-5 font-urbanist text-lg font-bold leading-snug text-ink sm:text-xl">{feature.title}</h3>
      <p className="relative z-10 mt-2 font-urbanist text-[13.5px] leading-relaxed text-ink-dim">{feature.desc}</p>
    </div>
  );
}

function DraggablePhoto({
  src,
  className,
  priority,
  radius,
}: {
  src: string;
  className?: string;
  priority?: boolean;
  radius: number;
}) {
  const reduced = usePrefersReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || reduced) return;

    const [inst] = Draggable.create(frame, {
      type: "x,y",
      bounds: { minX: -radius, maxX: radius, minY: -radius, maxY: radius },
      inertia: true,
      edgeResistance: 0.7,
      onDragEnd() {
        gsap.to(frame, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.55)", overwrite: "auto" });
      },
    });
    return () => {
      inst.kill();
    };
  }, [reduced, radius]);

  return (
    <div className={className} style={{ touchAction: reduced ? undefined : "none" }}>
      <div
        ref={frameRef}
        className={`relative h-full w-full overflow-hidden rounded-3xl border border-hairline shadow-[0_24px_70px_rgba(11,15,25,0.1),0_4px_14px_rgba(11,15,25,0.05)] ${
          reduced ? "" : "cursor-grab active:cursor-grabbing"
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          loading={priority ? "eager" : "lazy"}
          draggable={false}
          className="h-full w-full select-none object-cover grayscale transition-[filter] duration-700 ease-out-expo hover:grayscale-0"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(9,9,11,0.04) 0%, transparent 30%, rgba(9,9,11,0.12) 100%)" }}
        />
      </div>
    </div>
  );
}

/**
 * Same pointer-driven `scrollLeft` drag-to-scroll hook Testimonials.tsx
 * and CaseStudiesExpand.tsx already use: mouse-only (touch keeps native
 * scroll), a movement threshold disambiguates a genuine click from a
 * drag via a capturing click listener.
 */
function useDragScroll(trackRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    let dragging = false;
    let dragged = false;
    let startX = 0;
    let startScroll = 0;

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      dragging = true;
      dragged = false;
      startX = e.clientX;
      startScroll = el.scrollLeft;
      el.setPointerCapture(e.pointerId);
      el.style.cursor = "grabbing";
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) dragged = true;
      el.scrollLeft = startScroll - dx;
    };
    const endDrag = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      el.style.cursor = "grab";
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    };
    const onClickCapture = (e: MouseEvent) => {
      if (dragged) {
        e.preventDefault();
        e.stopPropagation();
        dragged = false;
      }
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", endDrag);
    el.addEventListener("pointercancel", endDrag);
    el.addEventListener("click", onClickCapture, true);
    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", endDrag);
      el.removeEventListener("pointercancel", endDrag);
      el.removeEventListener("click", onClickCapture, true);
    };
  }, [trackRef]);
}

export default function AboutStudio() {
  const reduced = usePrefersReducedMotion();
  const stripRef = useRef<HTMLDivElement>(null);
  useDragScroll(stripRef);

  const scrollStrip = (dir: 1 | -1) => {
    const el = stripRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <div className="bg-light-surface p-3 sm:p-4">
      <section
        className="theme-light relative overflow-hidden rounded-[32px] bg-canvas py-16 lg:py-24"
        aria-labelledby="about-heading"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "url(/media/hex-pattern-tile.svg)", backgroundSize: "112px 194px" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-32 top-0 h-[420px] w-[420px] rounded-full opacity-50 blur-3xl"
          style={{ background: "radial-gradient(closest-side, rgba(124,108,255,0.14), transparent)" }}
        />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1fr] lg:gap-16">
            <Reveal>
              <div className="relative mx-auto max-w-[420px] lg:max-w-none">
                <DraggablePhoto
                  src="https://picsum.photos/seed/codeshaper-office-main/900/1100"
                  className="aspect-[4/5]"
                  radius={28}
                  priority
                />
                <div className="absolute -bottom-8 -right-6 w-[52%] sm:-right-10">
                  <DraggablePhoto
                    src="https://picsum.photos/seed/codeshaper-office-team/700/560"
                    className="aspect-[4/3]"
                    radius={22}
                  />
                  {!reduced && (
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -bottom-3 -left-3 flex h-8 w-8 items-center justify-center rounded-full border border-hairline bg-canvas text-ink-dim shadow-[0_10px_24px_rgba(11,15,25,0.12)]"
                    >
                      <Move size={13} strokeWidth={1.75} />
                    </span>
                  )}
                </div>
                <div className="absolute -left-5 -top-5 flex items-center gap-2.5 rounded-full border border-hairline bg-canvas px-4 py-2.5 shadow-[0_16px_36px_rgba(11,15,25,0.1)] sm:-left-7 sm:-top-7">
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-aurora-violet opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-aurora-violet" />
                  </span>
                  <span className="font-urbanist text-[12.5px] font-semibold text-ink">Delivery hub · Bangladesh</span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <SectionEyebrow>Who we are</SectionEyebrow>
              <SectionTitle id="about-heading" size="lg" className="max-w-lg">
                A distributed team that works like one room.
              </SectionTitle>
              <SectionDescription className="mt-5 max-w-md">
                CodeShaper brings design, engineering, commerce, and AI automation together under one roof. Our
                delivery hub is in Bangladesh, with collaboration hubs across the US, UK, Japan, Australia, and New
                Zealand, so there's real timezone overlap wherever a client is based.
              </SectionDescription>

              <div className="mt-8 grid grid-cols-2 gap-3">
                {STATS.map((s, i) => (
                  <CountUpStat
                    key={s.label}
                    value={s.value}
                    suffix={s.suffix}
                    label={s.label}
                    icon={s.icon}
                    accent={s.accent}
                    delay={i * 120}
                  />
                ))}
              </div>

              <div className="mt-8">
                <Link
                  href="/company/about"
                  className="inline-flex items-center gap-2 rounded-full bg-aurora-violet px-7 py-3.5 font-urbanist text-sm font-semibold text-white transition-[background-color,transform] duration-300 hover:scale-[1.02] hover:bg-aurora-violet-dark"
                >
                  About CodeShaper
                  <ArrowRight size={15} strokeWidth={1.75} />
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal delay={120}>
            <div className="mt-20 lg:mt-24">
              <p className="mb-6 font-urbanist text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-faint">
                Why teams choose us
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {FEATURES.map((f, i) => (
                  <FeatureCard key={f.title} feature={f} index={i} />
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="mt-16 border-t border-hairline pt-10">
              <div className="flex items-end justify-between gap-4">
                <p className="font-urbanist text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-faint">
                  A few glimpses from the studio
                </p>
                <div className="hidden shrink-0 items-center gap-2 sm:flex">
                  <button
                    type="button"
                    aria-label="Scroll left"
                    onClick={() => scrollStrip(-1)}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline bg-canvas text-ink-dim transition-colors duration-200 hover:border-ink hover:text-ink"
                  >
                    <ArrowLeft size={14} strokeWidth={1.75} />
                  </button>
                  <button
                    type="button"
                    aria-label="Scroll right"
                    onClick={() => scrollStrip(1)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-white transition-transform duration-200 hover:scale-[1.05]"
                  >
                    <ArrowRight size={14} strokeWidth={1.75} />
                  </button>
                </div>
              </div>

              <div ref={stripRef} className="no-scrollbar mt-5 flex cursor-grab gap-3 overflow-x-auto py-1">
                {STRIP_PHOTOS.map((src) => (
                  <div
                    key={src}
                    className="group aspect-square w-[150px] shrink-0 overflow-hidden rounded-2xl border border-hairline sm:w-[190px]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt=""
                      loading="lazy"
                      draggable={false}
                      className="h-full w-full select-none object-cover grayscale transition-[transform,filter] duration-500 ease-out-expo group-hover:scale-[1.08] group-hover:grayscale-0"
                    />
                  </div>
                ))}
                <div className="w-2 shrink-0" aria-hidden />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
