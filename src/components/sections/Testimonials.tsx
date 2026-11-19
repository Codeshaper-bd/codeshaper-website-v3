"use client";

import { REAL_REVIEWS, type Review } from "@/data/reviews";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Play, X } from "lucide-react";
import Reveal from "@/components/system/Reveal";
import { SectionEyebrow, SectionTitle } from "@/components/system/SectionHeading";
import Flag from "@/components/system/Flag";

/**
 * Client reviews: a row of tall portrait cards, face first (the
 * customer-video pattern big software companies use).
 *
 *  · Photo card: the client's portrait fills the card; company + country
 *    on a glass chip at the top; quote, name and role over a soft scrim at
 *    the bottom. With a video, a glass play button + duration appear and a
 *    click opens the full review in a player (native <dialog>; Esc or a
 *    click outside closes it; focus returns to the card).
 *  · Quote card: for a review without a photo yet (initials, soft wash).
 *  · Swipe / trackpad scroll; arrow buttons page the row and disable at
 *    the ends. Same white rounded panel as Industries.
 *
 * HONESTY: only reviews marked `real` render in production. Placeholders
 * (Unsplash portraits, invented names, existing site clips) exist only so
 * the layout can be judged in development and carry a "Placeholder" tag.
 * Replace them with real clients' photos/videos and permitted quotes.
 */
// the Review type and the real reviews live in data/reviews.ts (shared)

const ALL: Review[] = [
  // REAL (quoted word for word): data/reviews.ts
  ...REAL_REVIEWS,
  // PLACEHOLDERS (development only)
  {
    real: false,
    quote: "They turned a vague brief into a product we were genuinely proud to ship.",
    name: "Mia Chen",
    role: "Product Lead",
    company: "Northbridge",
    market: "Canada",
    photo: "/media/reviews/placeholder-1.jpg",
    video: { src: "/media/about-team.mp4", duration: "2:14" },
  },
  {
    real: false,
    quote: "Clear communication every single week. No surprises at handover.",
    name: "Daniel Novak",
    role: "CEO",
    company: "Halcyon",
    photo: "/media/reviews/placeholder-4.jpg",
    video: { src: "/media/case-fintech.mp4", duration: "1:32" },
  },
  {
    real: false,
    quote: "Fast, thoughtful and easy to work with from kickoff to launch.",
    name: "Sara Haddad",
    role: "Founder",
    company: "Driftwood",
    photo: "/media/reviews/placeholder-3.jpg",
  },
  {
    real: false,
    quote: "They caught issues in our process we hadn't even thought to ask about.",
    name: "Leo Marin",
    role: "COO",
    company: "Fieldstone",
    market: "Spain",
    photo: "/media/reviews/placeholder-5.jpg",
    video: { src: "/media/case-commerce.mp4", duration: "1:05" },
  },
  {
    real: false,
    quote: "Our team finally has one product everyone actually uses.",
    name: "Rafiq Ahmed",
    role: "Head of Operations",
    company: "Brightline",
    photo: "/media/reviews/placeholder-2.jpg",
  },
];

const REVIEWS = process.env.NODE_ENV === "production" ? ALL.filter((r) => r.real) : ALL;
const GAP = 16;
const initials = (n: string) => n.split(" ").map((w) => w[0]).join("").slice(0, 2);

function Tag({ r }: { r: Review }) {
  if (r.real) return null;
  return <span className="rounded-full bg-[#fdf2d8] px-2 py-0.5 font-urbanist text-[10px] font-semibold text-[#8a5a0b]">Placeholder</span>;
}

function Company({ r, dark }: { r: Review; dark?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-urbanist text-[11.5px] font-semibold backdrop-blur-md ${
        dark ? "border-white/25 bg-black/20 text-white" : "border-[#0b0f19]/[0.08] bg-white/70 text-ink"
      }`}
    >
      {r.company}
      {r.market && (
        <>
          <span className={dark ? "text-white/50" : "text-ink-faint"}>·</span>
          <Flag market={r.market} />
        </>
      )}
    </span>
  );
}

function PhotoCard({ r, onPlay }: { r: Review & { photo: string }; onPlay: (r: Review, from: HTMLElement) => void }) {
  const inner = (
    <>
      <Image
        src={r.photo}
        alt={`${r.name}, ${r.role} at ${r.company}`}
        fill
        sizes="320px"
        className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/c:scale-[1.05]"
      />
      <span aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,rgba(11,15,25,0.9)_0%,rgba(11,15,25,0.55)_32%,rgba(11,15,25,0)_60%)]" />
      <span className="absolute inset-x-4 top-4 flex items-start justify-between gap-2">
        <Company r={r} dark />
        <Tag r={r} />
      </span>


      <span className="absolute inset-x-0 bottom-0 p-5">
        <span className="line-clamp-4 block font-urbanist text-[16px] font-medium leading-snug text-white">&ldquo;{r.quote}&rdquo;</span>
        <span className="mt-4 flex items-center justify-between gap-3 border-t border-white/15 pt-3.5">
          <span className="min-w-0 leading-tight">
            <span className="block font-urbanist text-[14px] font-semibold text-white">{r.name}</span>
            <span className="mt-0.5 block truncate font-urbanist text-[12.5px] text-white/70">
              {r.role}, {r.company}
            </span>
          </span>
          {r.video && (
            <span aria-hidden className="flex shrink-0 items-center gap-2">
              <span className="font-urbanist text-[11.5px] font-semibold tabular-nums text-white/80">{r.video.duration}</span>
              <span className="relative grid h-11 w-11 place-items-center rounded-full border border-white/40 bg-white/20 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] backdrop-blur-xl transition-[transform,background-color,color] duration-300 group-hover/c:scale-110 group-hover/c:bg-white group-hover/c:text-ink">
                <span className="absolute inset-0 rounded-full bg-white/25 motion-safe:animate-ping [animation-duration:2.6s]" />
                <Play size={16} className="relative translate-x-[1.5px] fill-current" />
              </span>
            </span>
          )}
        </span>
      </span>
    </>
  );

  const cls =
    "group/c relative block h-full w-full overflow-hidden rounded-[24px] bg-[#0b0f19] text-left shadow-[0_1px_2px_rgba(11,15,25,0.06)] transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-[0_30px_50px_-28px_rgba(11,15,25,0.55)]";
  return r.video ? (
    <button type="button" onClick={(e) => onPlay(r, e.currentTarget)} aria-label={`Play video review from ${r.name} (${r.video.duration})`} className={cls}>
      {inner}
    </button>
  ) : (
    <figure className={cls}>{inner}</figure>
  );
}

function QuoteCard({ r }: { r: Review }) {
  return (
    <figure className="group/c relative flex h-full flex-col overflow-hidden rounded-[24px] border border-[#0b0f19]/[0.06] bg-[#f7f5f2] p-6 transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-[0_30px_50px_-30px_rgba(11,15,25,0.4)]">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(90% 70% at 100% 100%, rgba(255,162,108,0.45) 0%, rgba(255,201,112,0.2) 40%, rgba(255,255,255,0) 75%)" }}
      />
      <span className="relative flex items-start justify-between gap-2">
        <Company r={r} />
        <Tag r={r} />
      </span>
      <svg viewBox="0 0 32 24" className="relative mt-8 h-6 w-8 text-[#f08a3e]" aria-hidden>
        <path fill="currentColor" d="M0 24V14.4C0 6.6 4.1 1.8 12.3 0l1.5 3.2C9.6 4.6 7.6 7.2 7.3 11H13v13H0zm18.6 0V14.4C18.6 6.6 22.7 1.8 30.9 0l1.1 3.2c-4.2 1.4-6.2 4-6.5 7.8h5.9v13H18.6z" />
      </svg>
      <blockquote className="relative mt-4 flex-1 font-urbanist text-[19px] font-medium leading-snug tracking-[-0.01em] text-ink">{r.quote}</blockquote>
      <figcaption className="relative mt-6 flex items-center justify-between gap-3 border-t border-[#0b0f19]/[0.08] pt-4">
        <span className="flex items-center gap-3">
          <span aria-hidden className="grid h-10 w-10 place-items-center rounded-full bg-white font-urbanist text-[13px] font-semibold text-ink shadow-[0_1px_2px_rgba(11,15,25,0.08)]">
            {initials(r.name)}
          </span>
          <span className="leading-tight">
            <span className="block font-urbanist text-[14px] font-semibold text-ink">{r.name}</span>
            <span className="mt-0.5 block font-urbanist text-[12.5px] text-ink-dim">
              {r.role}, {r.company}
            </span>
          </span>
        </span>
        {r.caseSlug && (
          <Link
            href={`/case-studies/${r.caseSlug}`}
            aria-label={`Read the ${r.company} case study`}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#0b0f19] text-white transition-transform duration-300 hover:rotate-45"
          >
            <ArrowUpRight size={15} strokeWidth={2} aria-hidden />
          </Link>
        )}
      </figcaption>
    </figure>
  );
}

export default function Testimonials() {
  const railRef = useRef<HTMLUListElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const playerRef = useRef<HTMLVideoElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);
  const [edge, setEdge] = useState({ start: true, end: true });
  const [open, setOpen] = useState<Review | null>(null);

  const syncEdges = () => {
    const el = railRef.current;
    if (el) setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
  };
  useEffect(() => {
    syncEdges();
    const el = railRef.current;
    if (!el) return;
    const ro = new ResizeObserver(syncEdges);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const page = (dir: 1 | -1) => {
    const el = railRef.current;
    const card = el?.querySelector<HTMLElement>("li");
    if (el && card) el.scrollBy({ left: dir * (card.offsetWidth + GAP), behavior: "smooth" });
  };

  useEffect(() => {
    const d = dialogRef.current;
    if (!d || !open) return;
    if (!d.open) d.showModal();
    document.body.style.overflow = "hidden";
    d.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    playerRef.current?.play().catch(() => {});
  }, [open]);
  const close = () => {
    playerRef.current?.pause();
    dialogRef.current?.close();
  };

  const scrolls = !(edge.start && edge.end);

  return (
    <div className="bg-light-surface p-3 sm:p-4">
      <section className="theme-light relative overflow-hidden rounded-[32px] bg-canvas py-16 lg:py-24" aria-labelledby="testimonials-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <Reveal>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <SectionEyebrow>Client reviews</SectionEyebrow>
                <SectionTitle id="testimonials-heading" className="max-w-[16ch] text-balance">
                  Hear it from the people we build with.
                </SectionTitle>
              </div>
              {scrolls && (
                <div className="flex items-center gap-2">
                  {[
                    { d: -1 as const, label: "Previous reviews", Icon: ArrowLeft, off: edge.start },
                    { d: 1 as const, label: "Next reviews", Icon: ArrowRight, off: edge.end },
                  ].map(({ d, label, Icon, off }) => (
                    <button
                      key={label}
                      type="button"
                      aria-label={label}
                      disabled={off}
                      onClick={() => page(d)}
                      className="group grid h-11 w-11 place-items-center rounded-full border border-[#0b0f19]/10 bg-white text-ink transition-[background-color,color,opacity,transform] duration-200 hover:bg-[#0b0f19] hover:text-white active:scale-95 disabled:cursor-default disabled:opacity-35 disabled:hover:bg-white disabled:hover:text-ink"
                    >
                      <Icon size={16} strokeWidth={1.9} aria-hidden className={`transition-transform duration-200 ${d < 0 ? "group-hover:-translate-x-0.5" : "group-hover:translate-x-0.5"}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Reveal>

          <Reveal delay={80}>
            <ul
              ref={railRef}
              onScroll={syncEdges}
              aria-label="Client reviews"
              className="-mx-4 mt-10 flex snap-x snap-mandatory scroll-px-4 overflow-x-auto px-4 pb-4 pt-1 [scrollbar-width:none] sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:-mx-10 lg:mt-14 lg:scroll-px-10 lg:px-10 [&::-webkit-scrollbar]:hidden"
              style={{ gap: GAP }}
            >
              {REVIEWS.map((r) => (
                <li key={r.name} className="relative h-[460px] w-[280px] shrink-0 snap-start sm:w-[300px] lg:h-[480px] lg:w-[300px]">
                  {r.photo ? (
                    <PhotoCard
                      r={r as Review & { photo: string }}
                      onPlay={(v, from) => {
                        returnTo.current = from;
                        setOpen(v);
                      }}
                    />
                  ) : (
                    <QuoteCard r={r} />
                  )}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* full video player */}
      <dialog
        ref={dialogRef}
        onClose={() => {
          document.body.style.overflow = "";
          setOpen(null);
          returnTo.current?.focus();
        }}
        aria-label={open ? `Video review from ${open.name}` : "Video review"}
        className="svc-dialog fixed inset-0 m-0 h-[100dvh] max-h-none w-full max-w-none bg-transparent p-0"
      >
        {open?.video && (
          <div className="flex h-full items-center justify-center p-4 sm:p-8" onClick={(e) => e.target === e.currentTarget && close()}>
            <div className="svc-dialog-panel w-full max-w-5xl overflow-hidden rounded-[24px] bg-[#0b0f19] shadow-[0_40px_100px_-30px_rgba(11,15,25,0.6)]">
              <video ref={playerRef} src={open.video.src} poster={open.photo} controls playsInline className="aspect-video w-full bg-black" />
              <div className="flex items-center justify-between gap-4 p-5">
                <span className="flex items-center gap-3">
                  {open.photo && (
                    <span className="relative h-10 w-10 overflow-hidden rounded-full">
                      <Image src={open.photo} alt="" fill sizes="40px" className="object-cover" />
                    </span>
                  )}
                  <span className="leading-tight">
                    <span className="flex items-center gap-2 font-urbanist text-[14px] font-semibold text-white">
                      {open.name}
                      <Tag r={open} />
                    </span>
                    <span className="mt-0.5 flex items-center gap-1.5 font-urbanist text-[12.5px] text-white/70">
                      {open.role}, {open.company}
                      {open.market && (
                        <>
                          <Flag market={open.market} />
                          {open.market}
                        </>
                      )}
                    </span>
                  </span>
                </span>
                <button
                  type="button"
                  data-autofocus
                  onClick={close}
                  aria-label="Close video"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                >
                  <X size={18} aria-hidden />
                </button>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
