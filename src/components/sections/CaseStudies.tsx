"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import Reveal from "@/components/system/Reveal";

/**
 * Success Stories — single draggable row of dark, minimal cards (near-black
 * on the site's usual light-surface background), each with a small
 * hand-authored line-art glyph instead of the repeated abstract-blur photo
 * used in earlier passes. Dragging is native scroll (`overflow-x: auto` +
 * `scrollLeft`) driven by pointer events for mouse/trackpad, with touch
 * left to the browser's own panning — no ScrollTrigger, no page-scroll
 * hijacking, nothing to reconcile with the "no pinning anywhere" rule.
 *
 * Only Fennec, Essentialist, and Acculance are real, verified projects.
 * The other three are explicit placeholders (see PLACEHOLDER_STORIES)
 * added at the user's request to fill out the row before real work
 * replaces them.
 */
type Shape =
  | { kind: "hex"; cx: number; cy: number; r: number; rotate?: number; accent?: boolean }
  | { kind: "circle"; cx: number; cy: number; r: number; accent?: boolean; filled?: boolean }
  | { kind: "square"; cx: number; cy: number; size: number; rotate?: number; accent?: boolean }
  | { kind: "triangle"; cx: number; cy: number; size: number; rotate?: number; accent?: boolean };

type Story = {
  project: string;
  description: string;
  glyph: Shape[];
  accent: string;
  href: string;
};

const REAL_STORIES: Story[] = [
  {
    project: "Fennec",
    description: "A connected web and mobile platform for nightlife operations — venues, guests, events, memberships.",
    accent: "#7c6cff",
    glyph: [
      { kind: "hex", cx: 118, cy: 72, r: 46 },
      { kind: "square", cx: 95, cy: 108, size: 66, rotate: -8 },
      { kind: "square", cx: 148, cy: 122, size: 66, rotate: 7 },
      { kind: "circle", cx: 178, cy: 62, r: 8, accent: true, filled: true },
    ],
    href: "/work/fennec",
  },
  {
    project: "Essentialist",
    description: "A premium membership website with GSAP motion, CMS structure, and a polished application flow.",
    accent: "#d97fc4",
    glyph: [
      { kind: "hex", cx: 88, cy: 82, r: 40 },
      { kind: "hex", cx: 152, cy: 82, r: 40 },
      { kind: "hex", cx: 120, cy: 132, r: 40 },
      { kind: "circle", cx: 120, cy: 82, r: 7, accent: true, filled: true },
    ],
    href: "/work/essentialist",
  },
  {
    project: "Acculance",
    description: "A SaaS-ready POS, inventory, and accounting platform for growing businesses.",
    accent: "#5b9bdb",
    glyph: [
      { kind: "square", cx: 82, cy: 68, size: 34 },
      { kind: "square", cx: 122, cy: 68, size: 34 },
      { kind: "square", cx: 82, cy: 108, size: 34 },
      { kind: "square", cx: 122, cy: 108, size: 34 },
      { kind: "circle", cx: 172, cy: 88, r: 30 },
      { kind: "circle", cx: 172, cy: 88, r: 6, accent: true, filled: true },
    ],
    href: "/work/acculance",
  },
];

/** Placeholder content — replace with real projects; see file-level note above. */
const PLACEHOLDER_STORIES: Story[] = [
  {
    project: "Northwind Commerce",
    description: "Placeholder — a multi-brand storefront and checkout unified under one account and cart.",
    accent: "#d99a4e",
    glyph: [
      { kind: "hex", cx: 108, cy: 100, r: 50 },
      { kind: "triangle", cx: 168, cy: 76, size: 46 },
      { kind: "circle", cx: 62, cy: 58, r: 8, accent: true, filled: true },
    ],
    href: "/work",
  },
  {
    project: "Verdant Health",
    description: "Placeholder — a patient portal covering scheduling, records access, and billing in one experience.",
    accent: "#3fae82",
    glyph: [
      { kind: "hex", cx: 118, cy: 94, r: 48 },
      { kind: "circle", cx: 118, cy: 94, r: 28 },
      { kind: "square", cx: 176, cy: 56, size: 28, rotate: 12 },
      { kind: "circle", cx: 118, cy: 94, r: 6, accent: true, filled: true },
    ],
    href: "/work",
  },
  {
    project: "Continuum Logistics",
    description: "Placeholder — real-time fleet visibility, route planning, and dispatch for daily operations.",
    accent: "#d1487a",
    glyph: [
      { kind: "hex", cx: 96, cy: 100, r: 48 },
      { kind: "triangle", cx: 168, cy: 90, size: 44, rotate: 90 },
      { kind: "square", cx: 50, cy: 142, size: 20, rotate: 10 },
      { kind: "circle", cx: 190, cy: 90, r: 6, accent: true, filled: true },
    ],
    href: "/work",
  },
];

const STORIES: Story[] = [...REAL_STORIES, ...PLACEHOLDER_STORIES];

function hexPoints(cx: number, cy: number, r: number, rotateDeg = 0) {
  const pts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i + (Math.PI / 180) * rotateDeg;
    pts.push(`${(cx + r * Math.cos(angle)).toFixed(1)},${(cy + r * Math.sin(angle)).toFixed(1)}`);
  }
  return pts.join(" ");
}

function trianglePoints(cx: number, cy: number, size: number, rotateDeg = 0) {
  const h = size * 0.87;
  const base = [
    [cx, cy - h / 2],
    [cx - size / 2, cy + h / 2],
    [cx + size / 2, cy + h / 2],
  ];
  const rad = (Math.PI / 180) * rotateDeg;
  return base
    .map(([x, y]) => {
      const dx = x - cx;
      const dy = y - cy;
      const rx = cx + dx * Math.cos(rad) - dy * Math.sin(rad);
      const ry = cy + dx * Math.sin(rad) + dy * Math.cos(rad);
      return `${rx.toFixed(1)},${ry.toFixed(1)}`;
    })
    .join(" ");
}

function CardGlyph({ shapes, accent }: { shapes: Shape[]; accent: string }) {
  return (
    <svg viewBox="0 0 240 190" className="h-full w-full overflow-visible" aria-hidden>
      {shapes.map((s, i) => {
        const stroke = s.accent ? accent : "#ffffff";
        const strokeOpacity = s.accent ? 0.9 : 0.16;
        if (s.kind === "hex") {
          return <polygon key={i} points={hexPoints(s.cx, s.cy, s.r, s.rotate)} fill="none" stroke={stroke} strokeOpacity={strokeOpacity} strokeWidth={1.2} />;
        }
        if (s.kind === "circle") {
          return s.filled ? (
            <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill={stroke} fillOpacity={0.95} />
          ) : (
            <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="none" stroke={stroke} strokeOpacity={strokeOpacity} strokeWidth={1.2} />
          );
        }
        if (s.kind === "square") {
          return (
            <rect
              key={i}
              x={s.cx - s.size / 2}
              y={s.cy - s.size / 2}
              width={s.size}
              height={s.size}
              rx={s.size * 0.18}
              fill="none"
              stroke={stroke}
              strokeOpacity={strokeOpacity}
              strokeWidth={1.2}
              transform={s.rotate ? `rotate(${s.rotate} ${s.cx} ${s.cy})` : undefined}
            />
          );
        }
        return <polygon key={i} points={trianglePoints(s.cx, s.cy, s.size, s.rotate)} fill="none" stroke={stroke} strokeOpacity={strokeOpacity} strokeWidth={1.2} />;
      })}
    </svg>
  );
}

function StoryCard({ story }: { story: Story }) {
  return (
    <article className="flex h-[400px] w-[320px] shrink-0 select-none flex-col justify-between rounded-[28px] bg-[#141316] p-8 sm:w-[360px]">
      <div>
        <h3 className="font-urbanist text-xl font-bold text-white">{story.project}</h3>
        <p className="mt-3 max-w-[30ch] font-urbanist text-[13.5px] leading-relaxed text-white/55">{story.description}</p>
      </div>

      <div className="-mx-2 h-[130px]">
        <CardGlyph shapes={story.glyph} accent={story.accent} />
      </div>

      <Link href={story.href} draggable={false} className="group/link inline-flex w-fit items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white transition-colors duration-200 group-hover/link:border-white group-hover/link:bg-white group-hover/link:text-[#141316]">
          <ArrowRight size={15} strokeWidth={2} />
        </span>
        <span className="font-urbanist text-[11.5px] font-semibold uppercase tracking-[0.18em] text-white/70 transition-colors duration-200 group-hover/link:text-white">
          Discover
        </span>
      </Link>
    </article>
  );
}

export default function CaseStudies() {
  const trackRef = useRef<HTMLDivElement>(null);
  const draggedRef = useRef(false);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    let dragging = false;
    let startX = 0;
    let startScroll = 0;

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      dragging = true;
      draggedRef.current = false;
      startX = e.clientX;
      startScroll = el.scrollLeft;
      el.setPointerCapture(e.pointerId);
      el.style.cursor = "grabbing";
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) draggedRef.current = true;
      el.scrollLeft = startScroll - dx;
    };
    const endDrag = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      el.style.cursor = "grab";
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    };
    const onClickCapture = (e: MouseEvent) => {
      if (draggedRef.current) {
        e.preventDefault();
        e.stopPropagation();
        draggedRef.current = false;
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
  }, []);

  const scrollByCard = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 380, behavior: "smooth" });
  };

  return (
    <section className="theme-light relative bg-light-surface py-16 lg:py-24" aria-labelledby="work-heading">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 inline-flex items-center gap-2.5 font-urbanist text-[11px] font-medium uppercase tracking-[0.28em] text-ink-dim">
                <span className="h-1.5 w-1.5 rounded-full bg-aurora-amber" />
                Success Stories
              </p>
              <h2 id="work-heading" className="font-urbanist text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl">
                Work that ships, every time.
              </h2>
              <Link
                href="/work"
                className="mt-6 inline-flex items-center rounded-full bg-ink px-5 py-2.5 font-urbanist text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-transform duration-200 hover:scale-[1.03]"
              >
                All Success Stories
              </Link>
            </div>

            <div className="flex items-center gap-3 self-start lg:self-end">
              <p className="max-w-[26ch] font-urbanist text-[14px] leading-relaxed text-ink-dim">
                Drag to browse — from unclear scope to launched product, every time.
              </p>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  aria-label="Scroll left"
                  onClick={() => scrollByCard(-1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline bg-canvas text-ink-dim transition-colors duration-200 hover:border-ink hover:text-ink"
                >
                  <ArrowLeft size={16} strokeWidth={1.75} />
                </button>
                <button
                  type="button"
                  aria-label="Scroll right"
                  onClick={() => scrollByCard(1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-white transition-transform duration-200 hover:scale-[1.05]"
                >
                  <ArrowRight size={16} strokeWidth={1.75} />
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      <Reveal>
        <div
          ref={trackRef}
          className="no-scrollbar mt-12 flex cursor-grab gap-6 overflow-x-auto px-6 lg:px-10"
          style={{
            WebkitMaskImage: "linear-gradient(to right, transparent 0, black 24px, black calc(100% - 24px), transparent 100%)",
            maskImage: "linear-gradient(to right, transparent 0, black 24px, black calc(100% - 24px), transparent 100%)",
          }}
        >
          {STORIES.map((story) => (
            <StoryCard key={story.project} story={story} />
          ))}
          <div className="w-px shrink-0" aria-hidden />
        </div>
      </Reveal>
    </section>
  );
}
