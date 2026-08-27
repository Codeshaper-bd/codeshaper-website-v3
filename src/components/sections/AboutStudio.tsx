"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Layers, Globe2, Users, MapPin } from "lucide-react";
import gsap from "gsap";
import Reveal from "@/components/system/Reveal";
import { SectionEyebrow, SectionTitle, SectionDescription } from "@/components/system/SectionHeading";
import { usePrefersReducedMotion, useMotionAllowed } from "@/lib/motion";

/**
 * About — "who we are" section right after Services.
 *
 * Round 2: the previous version was a flat bg-light-surface strip with no
 * inner card — every other major homepage section (Hero, ServicesShowcase,
 * CaseStudiesExpand, Testimonials, TechStack) uses the floating-card
 * treatment (bg-light-surface outer frame + rounded-[32px] bg-canvas card),
 * so this one read as visibly plainer/flatter than its neighbors purely by
 * being structurally inconsistent with them — fixed by adopting the same
 * wrapper, plus the same subtle hex-pattern texture Hero/ServicesShowcase
 * use, a violet glow accent, and mega-icon-tile stat icons instead of bare
 * colored ones, so it reads as part of the same design system rather than
 * a plainer one-off.
 *
 * Every stat is still an actual structural count already established
 * elsewhere in the codebase (SERVICE_COLUMNS, INDUSTRIES, TrustStrip's
 * client list, Locations' 6-country footprint) — no founding year,
 * headcount, award count, or certification is invented, since none of
 * that exists anywhere in this codebase as verified fact.
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
const STATS: { value: number; suffix: string; label: string; icon: typeof Layers }[] = [
  { value: 5, suffix: "", label: "Core practices", icon: Layers },
  { value: 10, suffix: "", label: "Industries served", icon: Globe2 },
  { value: 16, suffix: "+", label: "Clients worldwide", icon: Users },
  { value: 6, suffix: "", label: "Countries, one team", icon: MapPin },
];

const STRIP_PHOTOS = [
  "https://picsum.photos/seed/codeshaper-studio-1/500/500",
  "https://picsum.photos/seed/codeshaper-studio-2/500/500",
  "https://picsum.photos/seed/codeshaper-studio-3/500/500",
  "https://picsum.photos/seed/codeshaper-studio-4/500/500",
  "https://picsum.photos/seed/codeshaper-studio-5/500/500",
];

function CountUpStat({
  value,
  suffix,
  label,
  icon: Icon,
  delay,
}: {
  value: number;
  suffix: string;
  label: string;
  icon: typeof Layers;
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
      className="group relative overflow-hidden rounded-2xl border border-hairline bg-[#fafafa] p-5 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-aurora-violet/25 hover:shadow-[0_16px_36px_rgba(124,108,255,0.14)]"
    >
      <span className="mega-icon-tile flex h-10 w-10 items-center justify-center rounded-xl text-aurora-indigo transition-colors duration-300 group-hover:text-aurora-violet">
        <Icon size={18} strokeWidth={1.75} />
      </span>
      <p className="mt-4 font-urbanist text-3xl font-bold tracking-tight text-ink sm:text-[34px]">
        <span ref={numRef}>0</span>
        {suffix}
      </p>
      <p className="mt-1 font-urbanist text-[13px] leading-snug text-ink-dim">{label}</p>
    </div>
  );
}

function TiltFrame({ src, className, priority }: { src: string; className?: string; priority?: boolean }) {
  const interactive = useMotionAllowed();
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || !interactive) return;
    gsap.set(frame, { rotationX: 0, rotationY: 0 });

    const onMove = (e: PointerEvent) => {
      const r = frame.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      gsap.to(frame, { rotationY: (px - 0.5) * 5, rotationX: -(py - 0.5) * 5, duration: 0.7, ease: "power3.out", overwrite: "auto" });
    };
    const onLeave = () => gsap.to(frame, { rotationX: 0, rotationY: 0, duration: 0.7, ease: "power3.out", overwrite: "auto" });

    frame.addEventListener("pointermove", onMove);
    frame.addEventListener("pointerleave", onLeave);
    return () => {
      frame.removeEventListener("pointermove", onMove);
      frame.removeEventListener("pointerleave", onLeave);
    };
  }, [interactive]);

  return (
    <div className={className} style={{ perspective: "1200px" }}>
      <div
        ref={frameRef}
        className="relative h-full w-full overflow-hidden rounded-3xl border border-hairline shadow-[0_24px_70px_rgba(11,15,25,0.1),0_4px_14px_rgba(11,15,25,0.05)]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          loading={priority ? "eager" : "lazy"}
          className="h-full w-full object-cover grayscale transition-[filter] duration-700 ease-out-expo hover:grayscale-0"
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

export default function AboutStudio() {
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
                <TiltFrame src="https://picsum.photos/seed/codeshaper-office-main/900/1100" className="aspect-[4/5]" priority />
                <div className="absolute -bottom-8 -right-6 w-[52%] sm:-right-10">
                  <TiltFrame src="https://picsum.photos/seed/codeshaper-office-team/700/560" className="aspect-[4/3]" />
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
                  <CountUpStat key={s.label} value={s.value} suffix={s.suffix} label={s.label} icon={s.icon} delay={i * 120} />
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

          <Reveal delay={150}>
            <div className="mt-20 border-t border-hairline pt-10 lg:mt-24">
              <p className="mb-5 font-urbanist text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-faint">
                A few glimpses from the studio
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                {STRIP_PHOTOS.map((src, i) => (
                  <div
                    key={src}
                    className={`group aspect-square overflow-hidden rounded-2xl border border-hairline ${i === 4 ? "hidden sm:block" : ""}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover grayscale transition-[transform,filter] duration-500 ease-out-expo group-hover:scale-[1.08] group-hover:grayscale-0"
                    />
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
