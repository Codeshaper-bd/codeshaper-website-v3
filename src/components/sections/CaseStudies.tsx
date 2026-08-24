"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import Reveal from "@/components/system/Reveal";

/**
 * Success Stories — single draggable row of dark, premium cards, aligned
 * to the same max-w-7xl column as the section heading (both wrapped in an
 * identical `mx-auto max-w-7xl` + `px-6 lg:px-10`, so the first card's
 * left edge is pixel-exact with the heading's left edge). Dragging is
 * native scroll (`overflow-x: auto` + `scrollLeft`) driven by pointer
 * events for mouse/trackpad, with touch left to the browser's own
 * panning — no ScrollTrigger, no page-scroll hijacking, nothing to
 * reconcile with the "no pinning anywhere" rule.
 *
 * Images are temporary: Picsum placeholder photos (deterministic per
 * seed, so they're stable across renders and distinct per card) — swap
 * `image` for real project screenshots when available, per the user's
 * own "dummy image for now" request.
 *
 * Only Fennec, Essentialist, and Acculance are real, verified projects.
 * The other three are explicit placeholders (see PLACEHOLDER_STORIES),
 * added at the user's request to fill out the row before real work
 * replaces them. Stats are honest, categorical facts (platforms/stack/
 * modules) rather than invented outcome numbers.
 */
type Stat = { value: string; label: string };
type Story = {
  project: string;
  description: string;
  image: string;
  category: string;
  industry: string;
  stats: [Stat, Stat];
  accent: string;
  href: string;
};

const REAL_STORIES: Story[] = [
  {
    project: "Fennec",
    description: "A connected web and mobile platform for nightlife operations — venues, guests, events, memberships.",
    image: "https://picsum.photos/seed/fennec-nightlife/800/600",
    category: "Web App · Mobile App",
    industry: "Nightlife & Hospitality",
    stats: [
      { value: "Web + App", label: "Platforms shipped" },
      { value: "Ongoing", label: "Engagement" },
    ],
    accent: "#7c6cff",
    href: "/work/fennec",
  },
  {
    project: "Essentialist",
    description: "A premium membership website with GSAP motion, CMS structure, and a polished application flow.",
    image: "https://picsum.photos/seed/essentialist-travel/800/600",
    category: "WordPress · GSAP",
    industry: "Luxury Travel",
    stats: [
      { value: "WordPress", label: "Platform" },
      { value: "GSAP", label: "Motion system" },
    ],
    accent: "#d97fc4",
    href: "/work/essentialist",
  },
  {
    project: "Acculance",
    description: "A SaaS-ready POS, inventory, and accounting platform for growing businesses.",
    image: "https://picsum.photos/seed/acculance-pos/800/600",
    category: "SaaS · POS",
    industry: "Retail & Business Ops",
    stats: [
      { value: "3 Modules", label: "POS · Inventory · Accounting" },
      { value: "Laravel / Vue", label: "Stack" },
    ],
    accent: "#5b9bdb",
    href: "/work/acculance",
  },
];

/** Placeholder content — replace with real projects; see file-level note above. */
const PLACEHOLDER_STORIES: Story[] = [
  {
    project: "Northwind Commerce",
    description: "Placeholder — a multi-brand storefront and checkout unified under one account and cart.",
    image: "https://picsum.photos/seed/northwind-retail/800/600",
    category: "eCommerce · Storefront",
    industry: "Retail",
    stats: [
      { value: "Multi-brand", label: "Storefront" },
      { value: "Unified Cart", label: "Checkout flow" },
    ],
    accent: "#d99a4e",
    href: "/work",
  },
  {
    project: "Verdant Health",
    description: "Placeholder — a patient portal covering scheduling, records access, and billing in one experience.",
    image: "https://picsum.photos/seed/verdant-health/800/600",
    category: "Healthtech · Patient Portal",
    industry: "Healthcare",
    stats: [
      { value: "Patient Portal", label: "Core module" },
      { value: "Compliance-ready", label: "Data handling" },
    ],
    accent: "#3fae82",
    href: "/work",
  },
  {
    project: "Continuum Logistics",
    description: "Placeholder — real-time fleet visibility, route planning, and dispatch for daily operations.",
    image: "https://picsum.photos/seed/continuum-logistics/800/600",
    category: "Logistics · Fleet Ops",
    industry: "Transportation & Logistics",
    stats: [
      { value: "Fleet Ops", label: "Core module" },
      { value: "Real-time", label: "Tracking" },
    ],
    accent: "#d1487a",
    href: "/work",
  },
];

const STORIES: Story[] = [...REAL_STORIES, ...PLACEHOLDER_STORIES];

function StoryCard({ story }: { story: Story }) {
  return (
    <article
      className="group flex w-[340px] shrink-0 select-none flex-col overflow-hidden rounded-[28px] bg-[#141316] shadow-[0_20px_50px_rgba(9,9,11,0.16)] transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_28px_64px_var(--card-glow)] sm:w-[380px]"
      style={{ "--card-glow": `${story.accent}3d` } as CSSProperties}
    >
      <div className="relative h-[190px] shrink-0 overflow-hidden sm:h-[210px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={story.image}
          alt=""
          draggable={false}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
        />
        {/* merge the photo into the dark card body instead of a hard edge */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#141316] via-transparent to-black/10" />
        {/* diagonal shine sweep on hover */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
        />
        <span className="absolute left-4 top-4 rounded-full border border-white/25 bg-black/30 px-3 py-1 font-urbanist text-[10.5px] font-semibold uppercase tracking-[0.1em] text-white backdrop-blur-sm">
          {story.industry}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-7 sm:p-8">
        <p className="font-urbanist text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: story.accent }}>
          {story.category}
        </p>
        <h3 className="mt-2 font-urbanist text-xl font-bold text-white">{story.project}</h3>
        <p className="mt-2.5 font-urbanist text-[13.5px] leading-relaxed text-white/55">{story.description}</p>

        <div className="mt-5 grid grid-cols-2 gap-4 border-y border-white/10 py-4">
          {story.stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-urbanist text-[14.5px] font-bold leading-tight text-white">{stat.value}</p>
              <p className="mt-1 font-urbanist text-[11px] leading-snug text-white/45">{stat.label}</p>
            </div>
          ))}
        </div>

        <Link href={story.href} draggable={false} className="group/link mt-6 inline-flex w-fit items-center gap-3">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white transition-colors duration-200 group-hover/link:border-transparent group-hover/link:bg-[var(--hover-bg)] group-hover/link:text-[#141316]"
            style={{ "--hover-bg": story.accent } as CSSProperties}
          >
            <ArrowRight size={15} strokeWidth={2} className="transition-transform duration-200 group-hover/link:translate-x-0.5" />
          </span>
          <span className="font-urbanist text-[11.5px] font-semibold uppercase tracking-[0.18em] text-white/70 transition-colors duration-200 group-hover/link:text-white">
            Discover
          </span>
        </Link>
      </div>
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
    el.scrollBy({ left: dir * 400, behavior: "smooth" });
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
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-aurora-violet px-7 py-3.5 font-urbanist text-sm font-semibold text-white transition-[background-color,transform] duration-300 hover:scale-[1.02] hover:bg-aurora-violet-dark"
              >
                All Success Stories
                <ArrowRight size={15} strokeWidth={1.75} />
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
        <div className="mx-auto max-w-7xl">
          <div
            ref={trackRef}
            className="no-scrollbar mt-12 flex cursor-grab gap-6 overflow-x-auto px-6 lg:px-10"
            style={{
              WebkitMaskImage: "linear-gradient(to right, black 0, black calc(100% - 40px), transparent 100%)",
              maskImage: "linear-gradient(to right, black 0, black calc(100% - 40px), transparent 100%)",
            }}
          >
            {STORIES.map((story) => (
              <StoryCard key={story.project} story={story} />
            ))}
            <div className="w-6 shrink-0 lg:w-10" aria-hidden />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
