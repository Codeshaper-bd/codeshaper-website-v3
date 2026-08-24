"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowLeft, ArrowRight, Play, Quote } from "lucide-react";
import Reveal from "@/components/system/Reveal";

/**
 * Client Testimonials — after Engagement Models. Reuses the exact
 * draggable-row mechanics proven out in CaseStudies (native
 * `overflow-x: auto` + pointer-driven `scrollLeft`, no ScrollTrigger, no
 * `data-cursor="drag"` since that itself read as an unwanted hover effect
 * there, interactive elements excluded from drag-initiation so their own
 * clicks still fire) and the same first-card-aligns-with-heading fix
 * (track measures the heading's rendered `left` offset and applies it as
 * its own padding-left — this section was missing that fix initially,
 * which is why the row didn't line up with the heading).
 *
 * Cards are white with a hairline border (`bg-[#fafafa]`, `border-hairline`,
 * `hover:border-aurora-violet/20`) rather than CaseStudies' dark shell —
 * a border reads clean on a light card next to a light section (this is
 * Services' own card recipe), whereas the same border read as a dull,
 * undefined line on CaseStudies' dark cards, which is why those went
 * borderless instead. Each card keeps its own accent-tinted glow on
 * hover (the `--card-glow` custom-property technique already used
 * elsewhere), just layered on top of the border-color hover instead of
 * replacing it.
 *
 * Video cards are genuinely playable: clicking the poster swaps in a real
 * `<video>` with controls. Sources are existing site placeholder clips
 * (already used elsewhere as generic b-roll) — swap for real client
 * testimonial recordings when available. All names/companies/quotes here
 * are explicit placeholders (clearly invented company names, not real
 * brands) per the user's own "dummy testimonial for now" request.
 */
type Testimonial =
  | { type: "text"; name: string; role: string; quote: string; avatar: string; accent: string }
  | { type: "video"; name: string; role: string; quote: string; poster: string; video: string; accent: string };

const TESTIMONIALS: Testimonial[] = [
  {
    type: "video",
    name: "Jordan Ellis",
    role: "Founder, Lumen Studio",
    quote: "Codeshaper felt like an extension of our own team from day one.",
    poster: "https://picsum.photos/seed/testimonial-jordan/600/760",
    video: "/media/about-team.mp4",
    accent: "#7c6cff",
  },
  {
    type: "text",
    name: "Priya Nandan",
    role: "Product Lead, Northbridge Retail",
    quote: "They turned a vague brief into a product we were genuinely proud to ship.",
    avatar: "https://picsum.photos/seed/testimonial-priya/120/120",
    accent: "#d97fc4",
  },
  {
    type: "video",
    name: "Marcus Fell",
    role: "CEO, Halcyon Robotics",
    quote: "Communication was clear every single week — no surprises at handover.",
    poster: "https://picsum.photos/seed/testimonial-marcus/600/760",
    video: "/media/case-fintech.mp4",
    accent: "#5b9bdb",
  },
  {
    type: "text",
    name: "Sara Voss",
    role: "Head of Design, Everline",
    quote: "Our new site finally matches the quality of the product it's selling.",
    avatar: "https://picsum.photos/seed/testimonial-sara/120/120",
    accent: "#d99a4e",
  },
  {
    type: "video",
    name: "Tomas Reyes",
    role: "Founder, Driftwood Goods",
    quote: "Fast, thoughtful, and genuinely easy to work with from kickoff to launch.",
    poster: "https://picsum.photos/seed/testimonial-tomas/600/760",
    video: "/media/case-commerce.mp4",
    accent: "#3fae82",
  },
  {
    type: "text",
    name: "Anya Kowalski",
    role: "COO, Fieldstone Labs",
    quote: "They caught issues in our process we hadn't even thought to ask about.",
    avatar: "https://picsum.photos/seed/testimonial-anya/120/120",
    accent: "#d1487a",
  },
];

function TextCard({ t }: { t: Extract<Testimonial, { type: "text" }> }) {
  return (
    <article
      className="flex h-[420px] w-[300px] shrink-0 select-none flex-col overflow-hidden rounded-[28px] border border-hairline bg-[#fafafa] p-7 transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-2 hover:border-aurora-violet/20 hover:shadow-[0_32px_70px_var(--card-glow)] sm:w-[340px] sm:p-8"
      style={{ "--card-glow": `${t.accent}26` } as CSSProperties}
    >
      <Quote size={30} strokeWidth={1.5} style={{ color: t.accent }} />
      <p className="mt-5 flex-1 font-urbanist text-[17px] font-medium leading-relaxed text-ink">“{t.quote}”</p>
      <div className="mt-6 flex items-center gap-3 border-t border-hairline pt-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={t.avatar} alt="" draggable={false} className="h-11 w-11 shrink-0 rounded-full object-cover" />
        <div className="min-w-0">
          <p className="truncate font-urbanist text-[13.5px] font-bold text-ink">{t.name}</p>
          <p className="truncate font-urbanist text-[12px] text-ink-dim">{t.role}</p>
        </div>
      </div>
    </article>
  );
}

function VideoCard({ t }: { t: Extract<Testimonial, { type: "video" }> }) {
  const [playing, setPlaying] = useState(false);

  return (
    <article
      className="group relative h-[420px] w-[300px] shrink-0 select-none overflow-hidden rounded-[28px] border border-hairline bg-[#fafafa] transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-2 hover:border-aurora-violet/20 hover:shadow-[0_32px_70px_var(--card-glow)] sm:w-[340px]"
      style={{ "--card-glow": `${t.accent}26` } as CSSProperties}
    >
      {playing ? (
        <video
          src={t.video}
          controls
          autoPlay
          playsInline
          className="h-full w-full object-cover"
        />
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={t.poster}
            alt=""
            draggable={false}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/25" />

          <button
            type="button"
            aria-label={`Play testimonial from ${t.name}`}
            data-cursor="none"
            onClick={() => setPlaying(true)}
            className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md transition-[transform,background-color,border-color] duration-300 ease-out hover:scale-110 hover:border-transparent hover:bg-[var(--hover-bg)]"
            style={{ "--hover-bg": t.accent } as CSSProperties}
          >
            <Play size={20} strokeWidth={2} fill="white" className="ml-0.5" />
          </button>

          <div className="absolute inset-x-0 bottom-0 p-6">
            <p className="font-urbanist text-[13.5px] italic leading-relaxed text-white/85 line-clamp-2">“{t.quote}”</p>
            <p className="mt-3 font-urbanist text-[13.5px] font-bold text-white">{t.name}</p>
            <p className="font-urbanist text-[12px] text-white/55">{t.role}</p>
          </div>
        </>
      )}
    </article>
  );
}

export default function Testimonials() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const draggedRef = useRef(false);

  // Keep the track's left padding pixel-matched to the heading's own left
  // edge, so the first card lines up with the heading — same fix CaseStudies
  // needed for its own full-bleed row.
  useEffect(() => {
    const track = trackRef.current;
    const heading = headingRef.current;
    if (!track || !heading) return;

    const updateInset = () => {
      const left = heading.getBoundingClientRect().left;
      track.style.paddingLeft = `${Math.max(left, 0)}px`;
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

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      // Don't start drag-tracking (and don't setPointerCapture) when the
      // press lands on a real interactive element — capturing the pointer
      // on the track interferes with that element's own click synthesis
      // for a genuine mouse down→up sequence (confirmed: a raw `.click()`
      // still worked, but a realistic mousedown/mouseup did not, until
      // this was added), so its own click handler never fires.
      if ((e.target as HTMLElement).closest("a, button")) return;
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
    el.scrollBy({ left: dir * 360, behavior: "smooth" });
  };

  return (
    <section className="theme-light relative overflow-x-hidden bg-light-surface py-16 lg:py-24" aria-labelledby="testimonials-heading">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 inline-flex items-center gap-2.5 font-urbanist text-[11px] font-medium uppercase tracking-[0.28em] text-ink-dim">
                <span className="h-1.5 w-1.5 rounded-full bg-aurora-amber" />
                Client Testimonials
              </p>
              <h2 ref={headingRef} id="testimonials-heading" className="font-urbanist text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl">
                Trusted by teams who shipped with us.
              </h2>
            </div>

            <div className="flex items-center gap-3 self-start lg:self-end">
              <p className="max-w-[26ch] font-urbanist text-[14px] leading-relaxed text-ink-dim">
                Drag to browse — hear it directly from the people we've worked with.
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
        <div ref={trackRef} className="no-scrollbar mt-12 flex cursor-grab gap-6 overflow-x-auto py-6">
          {TESTIMONIALS.map((t) =>
            t.type === "text" ? <TextCard key={t.name} t={t} /> : <VideoCard key={t.name} t={t} />
          )}
          <div className="w-6 shrink-0 sm:w-10" aria-hidden />
        </div>
      </Reveal>
    </section>
  );
}
