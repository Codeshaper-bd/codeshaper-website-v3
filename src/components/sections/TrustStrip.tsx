"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Reveal from "@/components/system/Reveal";
import { useMotionAllowed } from "@/lib/motion";

/**
 * Clients & trust — compact dark interlude (bg-canvas, matching
 * AiSpotlight/Locations' convention elsewhere on the site). Client list as a
 * tight, uniform wall of small glassmorphic cards (2 rows of 8 at desktop)
 * that tilt toward the pointer and light up with a cursor-follow glow — kept
 * deliberately small/flat rather than the earlier tall asymmetric bento, and
 * with no supporting content block underneath so the section stays short.
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
  "DTech Corporation Limited",
  "Astrica Trading",
  "MYTH LIFESTYLE",
  "GoPosly",
  "Framer",
  "Regray Stone",
];

const PROOF = ["Clear scope before estimates", "Weekly demos and decision notes", "Clean ownership transfer"];

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
    // rather than quickTo — quickTo's fast resetTo() path turned out to
    // silently no-op rotationX/rotationY/scaleX/scaleY updates on this GSAP
    // version (logging "not eligible for reset" instead of ever rotating
    // anything); gsap.to(..., { overwrite: "auto" }) is the standard
    // fallback and was confirmed working.
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
      gsap.to(card, { scaleX: 1.05, scaleY: 1.05, duration: 0.4, ease: "power3.out", overwrite: "auto" });
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
        className="group relative flex h-full flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-5 text-center backdrop-blur-xl transition-[border-color,background-color] duration-300 hover:border-white/20 hover:bg-white/[0.05]"
      >
        <div
          ref={glowRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: "radial-gradient(140px circle at var(--mx, 50%) var(--my, 50%), rgba(161,161,170,0.18), transparent 70%)",
          }}
        />
        <span className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 font-urbanist text-[10px] font-bold text-white">
          {name.charAt(0)}
        </span>
        <span className="relative line-clamp-1 font-urbanist text-[13px] font-semibold leading-snug text-white/85">
          {name}
        </span>
      </div>
    </div>
  );
}

export default function TrustStrip() {
  return (
    <section aria-label="Clients and partners" className="relative overflow-hidden bg-canvas py-16 font-urbanist lg:py-20">
      {/* ambient breathing glow, matching AiSpotlight's dark-section backdrop convention */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="aurora-fallback-a absolute left-[-10%] top-[10%] h-[60%] w-[45%] rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(closest-side, rgba(255,255,255,0.12), transparent)" }}
        />
        <div
          className="aurora-fallback-b absolute right-[-8%] bottom-[-10%] h-[60%] w-[45%] rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(closest-side, rgba(255,255,255,0.1), transparent)" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 font-urbanist text-sm font-medium uppercase tracking-[0.25em] text-aurora-amber">
                Selected Clients
              </p>
              <h2 className="max-w-lg font-urbanist text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
                Built to earn trust at every handover.
              </h2>
            </div>
            <ul className="flex flex-wrap gap-2.5">
              {PROOF.map((p) => (
                <li
                  key={p}
                  className="rounded-full border border-hairline bg-canvas-raised px-3.5 py-1.5 font-urbanist text-[12px] text-ink-dim"
                >
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-10 grid grid-cols-3 gap-2.5 sm:grid-cols-4 lg:grid-cols-8">
            {CLIENTS.map((name) => (
              <ClientCard key={name} name={name} />
            ))}
          </div>
        </Reveal>
        <span className="sr-only">Trusted by {CLIENTS.join(", ")}</span>
      </div>
    </section>
  );
}
