"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Reveal from "@/components/system/Reveal";
import { usePrefersReducedMotion } from "@/lib/motion";

/**
 * Clients & trust — a full dark "interlude" section (matches the site's
 * other dark sections like AiSpotlight/Locations — bg-canvas with no
 * theme-light wrapper) rather than a light band or an inset card, giving it
 * real contrast against the light Hero/ServicePillars around it. The client
 * names run as two oversized, dimmed "ghost type" rows that brighten on
 * hover — real client list, no logo artwork on file yet — and are genuinely
 * draggable (pointer-driven, with momentum on release), not just decorative:
 * that's what data-cursor="drag" has always promised here, now backed by
 * actual interaction instead of a plain CSS marquee.
 */
const LOGOS_ROW_1 = [
  "Essentialist",
  "Fennec",
  "Q Hotel Dhaka",
  "Microsoft",
  "Elite Capital Group",
  "Webflow",
  "Fiverr",
  "UpWork",
];
const LOGOS_ROW_2 = [
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

const ASSURANCE = [
  { n: "01", title: "Weekly visibility", desc: "Progress, blockers, and decisions stay clear." },
  { n: "02", title: "Clean handover", desc: "Code, CMS, integrations, and access are organized." },
  { n: "03", title: "Flexible models", desc: "Project delivery, dedicated teams, and support." },
];

/**
 * Pointer-driven infinite row: autoplay via gsap.ticker, hands control to the
 * pointer on press, and releases into a gsap-eased momentum coast that hands
 * control back to autoplay when it settles. Position is tracked as an
 * unbounded accumulator and only wrapped into range at render time, so a
 * drag/throw can travel any distance without ever running past the
 * duplicated content and exposing a gap.
 */
function DraggableRow({ names, reverse = false, speed = 34 }: { names: string[]; reverse?: boolean; speed?: number }) {
  const reduced = usePrefersReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapEl = wrapRef.current;
    const track = trackRef.current;
    if (!wrapEl || !track) return;

    let totalWidth = track.scrollWidth / 2;
    const wrapX = () => gsap.utils.wrap(-totalWidth, 0);
    let pos = 0;
    let autoplay = !reduced;
    let dragging = false;
    let lastClientX = 0;
    let lastT = 0;
    let velocity = 0;
    let resumeTimer: number | undefined;
    let momentumTween: gsap.core.Tween | undefined;

    const render = () => gsap.set(track, { x: wrapX()(pos) });
    gsap.set(track, { x: 0 });

    const recomputeWidth = () => {
      totalWidth = track.scrollWidth / 2;
    };
    recomputeWidth();
    document.fonts?.ready?.then(recomputeWidth).catch(() => {});
    window.addEventListener("resize", recomputeWidth);

    const clearResume = () => {
      if (resumeTimer) window.clearTimeout(resumeTimer);
      resumeTimer = undefined;
    };

    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      autoplay = false;
      clearResume();
      momentumTween?.kill();
      lastClientX = e.clientX;
      lastT = performance.now();
      velocity = 0;
      track.setPointerCapture(e.pointerId);
      wrapEl.style.cursor = "grabbing";
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const now = performance.now();
      const dx = e.clientX - lastClientX;
      const dt = Math.max(now - lastT, 1);
      velocity = (dx / dt) * 1000; // px/sec
      pos += dx;
      render();
      lastClientX = e.clientX;
      lastT = now;
    };

    const settle = () => {
      dragging = false;
      wrapEl.style.cursor = "grab";
      if (reduced) {
        autoplay = false;
        return;
      }
      if (Math.abs(velocity) > 30) {
        const proxy = { v: velocity };
        momentumTween = gsap.to(proxy, {
          v: 0,
          duration: 1.1,
          ease: "power2.out",
          onUpdate() {
            pos += (proxy.v * gsap.ticker.deltaRatio(60)) / 60;
            render();
          },
          onComplete() {
            resumeTimer = window.setTimeout(() => {
              autoplay = true;
            }, 250);
          },
        });
      } else {
        resumeTimer = window.setTimeout(() => {
          autoplay = true;
        }, 250);
      }
    };

    const onPointerUp = () => {
      if (dragging) settle();
    };

    wrapEl.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    const dir = reverse ? 1 : -1;
    const tick = (_time: number, deltaTime: number) => {
      if (!autoplay || dragging) return;
      pos += (dir * speed * deltaTime) / 1000;
      render();
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("resize", recomputeWidth);
      wrapEl.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      clearResume();
      momentumTween?.kill();
    };
  }, [reverse, speed, reduced]);

  const row = [...names, ...names];

  return (
    <div
      ref={wrapRef}
      className="relative w-full cursor-grab touch-pan-y select-none overflow-hidden py-2"
      data-cursor="drag"
      style={{
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
        maskImage: "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
      }}
    >
      <div ref={trackRef} className="flex w-max items-center gap-x-10 will-change-transform">
        {row.map((name, i) => (
          <span key={`${name}-${i}`} className="flex items-center gap-x-10">
            <span className="whitespace-nowrap font-urbanist text-[clamp(2.1rem,6vw,4.25rem)] font-black leading-none tracking-tight text-ink/[0.16] transition-colors duration-300 hover:text-ink">
              {name}
            </span>
            <span className="text-2xl text-ink/[0.12]" aria-hidden>
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function TrustStrip() {
  const allNames = [...LOGOS_ROW_1, ...LOGOS_ROW_2];

  return (
    <section aria-label="Clients and partners" className="relative overflow-hidden bg-canvas py-20 font-urbanist lg:py-32">
      {/* ambient breathing glow, matching AiSpotlight's dark-section backdrop convention */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="aurora-fallback-a absolute left-[-10%] top-[10%] h-[55%] w-[50%] rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(closest-side, rgba(255,255,255,0.12), transparent)" }}
        />
        <div
          className="aurora-fallback-b absolute right-[-8%] bottom-[5%] h-[50%] w-[45%] rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(closest-side, rgba(255,255,255,0.08), transparent)" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 font-urbanist text-sm font-medium uppercase tracking-[0.25em] text-aurora-amber">
                Selected Clients
              </p>
              <h2 className="max-w-xl font-urbanist text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl lg:text-6xl">
                Built to earn trust at every handover.
              </h2>
            </div>
            <p className="max-w-sm font-urbanist text-base leading-relaxed text-ink-dim">
              Founders, SaaS teams, and service businesses that need clear scope, senior delivery, and clean ownership
              at launch.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <ul className="mt-8 flex flex-wrap gap-3">
            {PROOF.map((p) => (
              <li
                key={p}
                className="rounded-full border border-hairline bg-canvas-raised px-4 py-2 font-urbanist text-[13px] text-ink-dim"
              >
                {p}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <Reveal delay={160}>
        <div className="relative z-10 mt-16 space-y-2 border-y border-hairline py-4 lg:mt-20 lg:py-6">
          <DraggableRow names={LOGOS_ROW_1} />
          <DraggableRow names={LOGOS_ROW_2} reverse />
        </div>
      </Reveal>
      <span className="sr-only">Trusted by {allNames.join(", ")}</span>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mt-16 grid gap-10 sm:grid-cols-3 lg:mt-20">
          {ASSURANCE.map((a, i) => (
            <Reveal key={a.n} delay={i * 80}>
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-hairline bg-canvas-raised font-urbanist text-[13px] font-bold text-ink">
                  {a.n}
                </span>
                <div>
                  <p className="font-urbanist text-base font-semibold text-ink">{a.title}</p>
                  <p className="mt-1 font-urbanist text-sm leading-relaxed text-ink-dim">{a.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
