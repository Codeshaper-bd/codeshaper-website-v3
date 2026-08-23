"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Reveal from "@/components/system/Reveal";
import { useMotionAllowed } from "@/lib/motion";

/**
 * Clients & trust — plain full-bleed section on bg-light-surface, the exact
 * same background token ServicePillars (the section right after this one)
 * uses. Earlier passes wrapped this in its own floating rounded card with an
 * independent frame color, which kept reading as a mismatched seam against
 * Hero's own frame above it — dropping the card/frame entirely and matching
 * the neighboring section's literal background token removes the seam by
 * construction instead of re-tuning colors again. theme-light is still
 * applied so the aurora- and ink- tokens used inside (badges, hover borders)
 * resolve to their light-appropriate values.
 *
 * Client list as a tight, uniform wall of small glassmorphic cards (2 rows
 * of 8 at desktop) that tilt toward the pointer and light up with a
 * cursor-follow glow, each revealed with an increasing stagger. Names render
 * in a single consistent case (uppercase) regardless of how each one is
 * naturally styled, and wrap onto 2 lines instead of truncating.
 */
const CLIENTS = [
  "Essentialist",
  "Fennec",
  "Q Hotel Dhaka",
  "Microsoft",
  "Elite Capital Group",
  "Webflow",
  "Fiverr",
  "UpWork",
  "Lexa Shield",
  "Quinta dos Vales",
  "DTech Corporation",
  "Astrica Trading",
  "MYTH LIFESTYLE",
  "GoPosly",
  "Framer",
  "Regray Stone",
];

const PROOF = ["Fast, transparent delivery", "Senior engineers only", "Clear scope before any estimate"];

function ClientCard({ name }: { name: string }) {
  const interactive = useMotionAllowed();
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow || !interactive) return;

    // Perspective lives on the plain-CSS wrapper (below), not via GSAP's
    // transformPerspective on this element. Plain gsap.to() with overwrite
    // rather than quickTo — quickTo's fast resetTo() path silently no-ops
    // rotationX/rotationY/scaleX/scaleY updates on the installed GSAP
    // version (logs "not eligible for reset" instead of ever rotating
    // anything); gsap.to(..., { overwrite: "auto" }) is the confirmed-working
    // fallback.
    gsap.set(card, { rotationX: 0, rotationY: 0, scaleX: 1, scaleY: 1 });

    const onMove = (e: PointerEvent) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      gsap.to(card, {
        rotationY: (px - 0.5) * 12,
        rotationX: -(py - 0.5) * 12,
        duration: 0.5,
        ease: "power3.out",
        overwrite: "auto",
      });
      glow.style.setProperty("--mx", `${px * 100}%`);
      glow.style.setProperty("--my", `${py * 100}%`);
    };
    const onEnter = () => {
      gsap.to(card, { scaleX: 1.04, scaleY: 1.04, duration: 0.4, ease: "power3.out", overwrite: "auto" });
    };
    const onLeave = () => {
      gsap.to(card, {
        rotationX: 0,
        rotationY: 0,
        scaleX: 1,
        scaleY: 1,
        duration: 0.5,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    card.addEventListener("pointermove", onMove);
    card.addEventListener("pointerenter", onEnter);
    card.addEventListener("pointerleave", onLeave);
    return () => {
      card.removeEventListener("pointermove", onMove);
      card.removeEventListener("pointerenter", onEnter);
      card.removeEventListener("pointerleave", onLeave);
    };
  }, [interactive]);

  return (
    <div className="h-full" style={{ perspective: "700px" }}>
      <div
        ref={cardRef}
        className="group relative flex h-full min-h-[92px] flex-col items-center justify-center gap-2.5 overflow-hidden rounded-2xl border border-hairline bg-canvas px-3 py-4 text-center shadow-[0_1px_2px_rgba(9,9,11,0.04)] transition-[border-color,box-shadow] duration-300 hover:border-aurora-violet/25 hover:shadow-[0_10px_24px_rgba(9,9,11,0.08)]"
      >
        <div
          ref={glowRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: "radial-gradient(140px circle at var(--mx, 50%) var(--my, 50%), rgba(24,24,27,0.05), transparent 70%)",
          }}
        />
        <span className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-aurora-violet/[0.08] font-urbanist text-[10px] font-bold text-aurora-violet">
          {name.charAt(0)}
        </span>
        <span className="relative line-clamp-2 font-urbanist text-[10.5px] font-bold uppercase leading-snug tracking-normal text-ink-dim">
          {name}
        </span>
      </div>
    </div>
  );
}

export default function TrustStrip() {
  return (
    <section
      aria-label="Clients and partners"
      className="theme-light relative overflow-hidden bg-light-surface py-16 font-urbanist lg:py-24"
    >
      {/* subtle texture, same asset Hero uses, so the section visibly shares Hero's material language */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 text-ink opacity-[0.025]"
        style={{ backgroundImage: "url(/media/hex-pattern-tile.svg)", backgroundSize: "112px 194px" }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2.5 inline-flex items-center gap-2.5 font-urbanist text-[11px] font-medium uppercase tracking-[0.28em] text-ink-dim">
                <span className="h-1.5 w-1.5 rounded-full bg-aurora-amber" />
                Selected Clients
              </p>
              <h2 className="font-urbanist text-[20px] font-bold leading-tight tracking-tight text-ink sm:text-[32px] lg:text-[40px]">
                The Choice Of Fast-Moving Teams
                <br />
                <span className="text-ink-dim">From Startups to Global Brands</span>
              </h2>
            </div>
            <ul className="flex flex-wrap gap-2.5">
              {PROOF.map((p) => (
                <li
                  key={p}
                  className="rounded-full border border-hairline bg-canvas px-3.5 py-1.5 font-urbanist text-[12px] font-medium text-ink-dim transition-colors duration-300 hover:border-aurora-violet/30 hover:text-ink"
                >
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <div
          className="mt-8 grid grid-flow-col grid-rows-2 gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] auto-cols-[40vw] sm:auto-cols-[190px] lg:auto-cols-fr lg:grid-flow-row lg:grid-cols-8 lg:overflow-visible [&::-webkit-scrollbar]:hidden"
          style={{ touchAction: "pan-x" }}
        >
          {CLIENTS.map((name, i) => (
            <Reveal key={name} delay={i * 45}>
              <ClientCard name={name} />
            </Reveal>
          ))}
        </div>
        <span className="sr-only">Trusted by {CLIENTS.join(", ")}</span>
      </div>
    </section>
  );
}
