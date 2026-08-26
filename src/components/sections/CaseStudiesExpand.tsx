"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Reveal from "@/components/system/Reveal";
import { SectionEyebrow, SectionTitle, SectionDescription } from "@/components/system/SectionHeading";

/**
 * Success Stories — TRIAL variant, modeled on hyperline.co's accordion
 * card row: clicking a card expands it (smooth animated width change)
 * while the rest compress, and a bar below shows the active card's
 * detail. Wired in as an A/B alternative to the current CaseStudies —
 * see the comment in page.tsx. If this doesn't earn its place, delete
 * this file and the STORIES duplication goes with it; if it does,
 * CaseStudies.tsx is the one to retire.
 *
 * The reference's bottom bar shows a named person's personal quote
 * ("Stan Rymkiewicz, Head of Growth @ Default"). We don't have real
 * quotes from actual people at Fennec/Essentialist/Acculance, and
 * inventing one attributed to a real client would fabricate an
 * endorsement — a different (and worse) thing than the placeholder
 * company names already in use for the 3 filler stories. The bar here
 * shows the active story's existing, honest description instead of a
 * invented personal quote.
 *
 * Data is duplicated from CaseStudies.tsx rather than importing it,
 * since that file is meant to stay untouched while this is evaluated.
 *
 * Expand/collapse widths are viewport-tiered (desktop/tablet/mobile)
 * via a resize-driven state, not pure CSS, because the expanded width
 * is a deliberate ratio against the collapsed width at each tier, not
 * a simple relative unit. Reuses the same click-vs-drag distinction,
 * pointer-capture drag exclusion for nested links, and heading-aligned
 * padding-left technique already proven out in CaseStudies.
 */
type Stat = { value: string; label: string };
type Story = {
  project: string;
  description: string;
  image: string;
  categories: string[];
  industry: string;
  stats: [Stat, Stat];
  accent: string;
  href: string;
};

const STORIES: Story[] = [
  {
    project: "Fennec",
    description: "A connected web and mobile platform for nightlife operations — venues, guests, events, memberships.",
    image: "https://picsum.photos/seed/fennec-nightlife/900/700",
    categories: ["Web App", "Mobile App"],
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
    image: "https://picsum.photos/seed/essentialist-travel/900/700",
    categories: ["WordPress", "GSAP"],
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
    image: "https://picsum.photos/seed/acculance-pos/900/700",
    categories: ["SaaS", "POS"],
    industry: "Retail & Business Ops",
    stats: [
      { value: "3 Modules", label: "POS · Inventory · Accounting" },
      { value: "Laravel / Vue", label: "Stack" },
    ],
    accent: "#5b9bdb",
    href: "/work/acculance",
  },
  {
    project: "Northwind Commerce",
    description: "Placeholder — a multi-brand storefront and checkout unified under one account and cart.",
    image: "https://picsum.photos/seed/northwind-retail/900/700",
    categories: ["eCommerce", "Storefront"],
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
    image: "https://picsum.photos/seed/verdant-health/900/700",
    categories: ["Healthtech", "Patient Portal"],
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
    image: "https://picsum.photos/seed/continuum-logistics/900/700",
    categories: ["Logistics", "Fleet Ops"],
    industry: "Transportation & Logistics",
    stats: [
      { value: "Fleet Ops", label: "Core module" },
      { value: "Real-time", label: "Tracking" },
    ],
    accent: "#d1487a",
    href: "/work",
  },
];

const SIZE_TIERS = [
  { max: 640, expanded: 260, collapsed: 92 },
  { max: 1024, expanded: 440, collapsed: 150 },
  { max: Infinity, expanded: 620, collapsed: 200 },
];

function getSizes(width: number) {
  const tier = SIZE_TIERS.find((t) => width < t.max) ?? SIZE_TIERS[SIZE_TIERS.length - 1];
  return { expanded: tier.expanded, collapsed: tier.collapsed };
}

function StoryPanel({
  story,
  index,
  isActive,
  onActivate,
  width,
}: {
  story: Story;
  index: number;
  isActive: boolean;
  onActivate: () => void;
  width: number;
}) {
  return (
    <article
      onClick={onActivate}
      data-story-index={index}
      style={{ width, minWidth: width, "--card-glow": `${story.accent}35` } as CSSProperties}
      className={`group relative h-[410px] shrink-0 cursor-pointer select-none overflow-hidden rounded-[28px] bg-[#141316] shadow-[inset_0_1px_0_rgba(255,255,255,0.09)] transition-[width,transform,box-shadow] duration-500 ease-out-expo sm:h-[460px] ${
        isActive ? "shadow-[inset_0_1px_0_rgba(255,255,255,0.09),0_30px_70px_var(--card-glow)]" : "hover:-translate-y-1 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.09),0_20px_50px_rgba(9,9,11,0.35)]"
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={story.image}
        alt=""
        draggable={false}
        loading="lazy"
        className={`absolute inset-0 h-full w-full object-cover transition-[transform,filter] duration-500 ease-out ${isActive ? "" : "brightness-[0.65] saturate-[0.85] group-hover:brightness-75"} group-hover:scale-[1.04]`}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/20" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.18),transparent_28%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {!isActive && (
        <span className="absolute left-4 top-4 rounded-full border border-white/25 bg-black/30 px-2.5 py-1 font-urbanist text-[10px] font-semibold uppercase tracking-[0.08em] text-white/80 backdrop-blur-sm">
          {String(index + 1).padStart(2, "0")}
        </span>
      )}

      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        {isActive && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {story.categories.map((category) => (
              <span
                key={category}
                className="rounded-full border px-2.5 py-1 font-urbanist text-[10px] font-semibold uppercase tracking-[0.08em] backdrop-blur-sm"
                style={{ color: story.accent, borderColor: `${story.accent}55`, background: `${story.accent}14` }}
              >
                {category}
              </span>
            ))}
          </div>
        )}
        <p className="truncate font-urbanist text-base font-bold text-white sm:text-lg">{story.project}</p>
        <p
          className={`mt-1 font-urbanist text-[11.5px] uppercase tracking-[0.1em] text-white/55 transition-[max-height,opacity] duration-300 ${
            isActive ? "max-h-6 opacity-100" : "max-h-0 overflow-hidden opacity-0"
          }`}
        >
          {story.industry}
        </p>

        {isActive && (
          <Link
            href={story.href}
            draggable={false}
            data-cursor="none"
            onClick={(e) => e.stopPropagation()}
            className="lens-fade-in mt-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 font-urbanist text-[12px] font-semibold text-white backdrop-blur-sm transition-colors duration-200 hover:border-transparent hover:bg-[var(--hover-bg)]"
            style={{ "--hover-bg": story.accent } as CSSProperties}
          >
            View case study
            <ArrowRight size={13} strokeWidth={2} />
          </Link>
        )}
      </div>
    </article>
  );
}

export default function CaseStudiesExpand() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const draggedRef = useRef(false);
  const [active, setActive] = useState(0);
  const [sizes, setSizes] = useState({ expanded: 620, collapsed: 200 });

  useEffect(() => {
    const onResize = () => setSizes(getSizes(window.innerWidth));
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    const heading = headingRef.current;
    if (!track || !heading) return;

    const updateInset = () => {
      const headingLeft = heading.getBoundingClientRect().left;
      const trackParentLeft = track.parentElement!.getBoundingClientRect().left;
      track.style.paddingLeft = `${Math.max(headingLeft - trackParentLeft, 0)}px`;
    };

    updateInset();
    window.addEventListener("resize", updateInset);
    const ro = new ResizeObserver(updateInset);
    ro.observe(document.body);
    return () => {
      window.removeEventListener("resize", updateInset);
      ro.disconnect();
    };
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    let dragging = false;
    let startX = 0;
    let startScroll = 0;
    let startCardIndex: number | null = null;

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if ((e.target as HTMLElement).closest("a, button")) return;
      dragging = true;
      draggedRef.current = false;
      startX = e.clientX;
      startScroll = el.scrollLeft;
      // Read which card (if any) the press landed on *before* capturing the
      // pointer — once setPointerCapture() is active, e.target on every
      // subsequent event for this pointer (including pointerup) becomes the
      // capturing element itself (the track), not whatever DOM node is
      // actually under the cursor, so this can't be read again in endDrag.
      const cardEl = (e.target as HTMLElement).closest("[data-story-index]");
      startCardIndex = cardEl ? Number(cardEl.getAttribute("data-story-index")) : null;
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

      // setPointerCapture above suppresses the browser's own click synthesis
      // for the card that was pressed (confirmed: a raw element.click() still
      // fires, but a real mousedown→mouseup does not, while capture is
      // active) — cards can't be excluded from drag-initiation the way the
      // nested "View case study" link is, since they're the drag surface
      // itself. So a genuine click (no movement past the drag threshold) is
      // activated here directly, using the index captured at pointerdown.
      if (e.type === "pointerup" && !draggedRef.current && startCardIndex !== null && !Number.isNaN(startCardIndex)) {
        setActive(startCardIndex);
      }
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

  const activeStory = STORIES[active];
  const progress = `${((active + 1) / STORIES.length) * 100}%`;

  const scrollByCard = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (sizes.collapsed + 32), behavior: "smooth" });
  };

  return (
    <div className="bg-light-surface p-3 sm:p-4">
      <section className="theme-light relative overflow-hidden rounded-[32px] bg-canvas py-16 lg:py-24" aria-labelledby="work-expand-heading">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <SectionEyebrow>Success Stories</SectionEyebrow>
                <SectionTitle ref={headingRef} id="work-expand-heading" size="lg">
                  Work that ships, every time.
                </SectionTitle>
              </div>

              <div className="flex flex-col gap-4 lg:items-end">
                <SectionDescription className="max-w-sm">
                  Product launches, premium websites, and operation-heavy platforms with clean handover from day one.
                </SectionDescription>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Previous success story"
                    onClick={() => scrollByCard(-1)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline bg-canvas text-ink-dim transition-colors duration-200 hover:border-ink hover:text-ink"
                  >
                    <ArrowLeft size={16} strokeWidth={1.75} />
                  </button>
                  <button
                    type="button"
                    aria-label="Next success story"
                    onClick={() => scrollByCard(1)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline bg-canvas text-ink-dim transition-colors duration-200 hover:border-ink hover:text-ink"
                  >
                    <ArrowRight size={16} strokeWidth={1.75} />
                  </button>
                  <Link
                    href="/work"
                    className="ml-1 inline-flex items-center gap-2 rounded-full bg-aurora-violet px-5 py-2.5 font-urbanist text-sm font-semibold text-white transition-[background-color,transform] duration-300 hover:scale-[1.02] hover:bg-aurora-violet-dark"
                  >
                    All Success Stories
                    <ArrowRight size={15} strokeWidth={1.75} />
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <div ref={trackRef} className="no-scrollbar mt-12 flex cursor-grab gap-5 overflow-x-auto py-6">
            {STORIES.map((story, i) => (
              <StoryPanel key={story.project} story={story} index={i} isActive={i === active} onActivate={() => setActive(i)} width={i === active ? sizes.expanded : sizes.collapsed} />
            ))}
            <div className="w-6 shrink-0 sm:w-10" aria-hidden />
          </div>
        </Reveal>

        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div key={active} className="lens-fade-in mt-1 overflow-hidden rounded-[24px] border border-hairline bg-canvas-raised">
            <div className="h-1 bg-hairline">
              <div className="h-full bg-aurora-violet transition-[width] duration-500" style={{ width: progress }} />
            </div>
            <div className="grid gap-5 px-6 py-5 sm:px-8 sm:py-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="font-urbanist text-base leading-relaxed text-ink sm:text-lg">{activeStory.description}</p>
                <p className="mt-3 font-urbanist text-[13px] text-ink-dim">
                  {activeStory.project} · {activeStory.industry}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:min-w-[300px]">
                {activeStory.stats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-hairline bg-canvas px-4 py-3">
                    <p className="font-urbanist text-sm font-bold text-ink">{stat.value}</p>
                    <p className="mt-1 font-urbanist text-[11.5px] leading-snug text-ink-dim">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
