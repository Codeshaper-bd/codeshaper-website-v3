"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Reveal from "@/components/system/Reveal";
import { usePrefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

/**
 * Success Stories — full redo. Real content (adapted from the v2 site's own
 * Fennec/Essentialist/Acculance case studies — Fennec and Essentialist are
 * confirmed real clients in TrustStrip; not invented for this rebuild), now
 * as a horizontal card gallery instead of a vertical stack: cards sit in a
 * row wider than the viewport, and scrolling the page down drives them
 * leftward (each card's own journey runs from off-screen right into view
 * and on past the left) via one GSAP scrub tween — no ScrollTrigger `pin`
 * (this codebase has an explicit "no pinning anywhere" rule; see
 * Reveal.tsx and Hero's own scrub-only comment). The row stays in the
 * viewport through plain CSS `position: sticky` on its wrapper while a
 * tall track beneath provides the scroll distance the tween scrubs
 * against — same non-pinning mechanism proven out in this section's
 * previous pass, just driving translateX instead of opacity/scale.
 *
 * Card width is intentionally NOT clamped to the site's usual max-w-7xl
 * container — the row's total width is just its cards' natural widths,
 * so adding/removing a story changes the row's width and therefore how
 * far it has to scroll, with no separate size to keep in sync.
 */
type Story = {
  project: string;
  headline: string;
  description: string;
  tags: string[];
  image: string;
  gradient: string;
  stat: { value: string; label: string };
  href: string;
};

const STORIES: Story[] = [
  {
    project: "Fennec",
    headline: "Built a connected web and mobile platform for nightlife operations.",
    description:
      "We delivered Fennec's product ecosystem across web, mobile, and business workflows — supporting venues, guests, events, memberships, and ongoing product growth.",
    tags: ["Nightlife SaaS", "Web App", "Mobile App"],
    image: "/media/case-fintech.jpg",
    gradient: "linear-gradient(145deg, #1c1c46 0%, #2b2a72 55%, #3d3a90 100%)",
    stat: { value: "Web + App", label: "Product Ecosystem" },
    href: "/work/fennec",
  },
  {
    project: "Essentialist",
    headline: "Launched a premium membership website with motion, CMS, and application flow.",
    description:
      "A high-end WordPress experience for a luxury travel membership brand, including GSAP animation, CMS structure, and a polished membership journey.",
    tags: ["WordPress", "GSAP", "Membership Flow"],
    image: "/media/case-commerce.jpg",
    gradient: "linear-gradient(145deg, #2b1c40 0%, #4a2b5e 55%, #6b3a5e 100%)",
    stat: { value: "CMS + Motion", label: "Membership Platform" },
    href: "/work/essentialist",
  },
  {
    project: "Acculance",
    headline: "Built a SaaS-ready POS, inventory, and accounting platform.",
    description:
      "A business management product covering sales, inventory, POS, accounting, reporting, and operational workflows for growing businesses.",
    tags: ["SaaS", "POS", "Accounting"],
    image: "/media/case-logistics.jpg",
    gradient: "linear-gradient(145deg, #12203a 0%, #1e3a5f 55%, #2a4a72 100%)",
    stat: { value: "POS + Inventory", label: "Business Platform" },
    href: "/work/acculance",
  },
];

function StoryCard({ story }: { story: Story }) {
  return (
    <article className="flex h-full w-[340px] shrink-0 flex-col overflow-hidden rounded-[28px] border border-hairline bg-canvas shadow-[0_20px_50px_rgba(9,9,11,0.1)] sm:w-[400px]">
      <div className="relative flex h-[240px] shrink-0 items-center justify-center overflow-hidden" style={{ background: story.gradient }}>
        <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.35)] sm:h-36 sm:w-36">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={story.image} alt="" loading="lazy" className="h-full w-full object-cover" />
        </div>
        <div className="absolute right-4 top-4 rounded-2xl bg-white/10 px-3 py-2 text-right backdrop-blur-sm">
          <p className="font-urbanist text-[13px] font-bold leading-tight text-white">{story.stat.value}</p>
          <p className="font-urbanist text-[9.5px] uppercase tracking-wide text-white/55">{story.stat.label}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-7">
        <p className="font-urbanist text-[11px] font-bold uppercase tracking-[0.2em] text-aurora-violet">Case Study</p>
        <h3 className="mt-2.5 font-urbanist text-lg font-bold leading-snug tracking-tight text-ink">{story.headline}</h3>
        <p className="mt-2.5 flex-1 font-urbanist text-[13.5px] leading-relaxed text-ink-dim">{story.description}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {story.tags.map((t) => (
            <span key={t} className="rounded-full border border-hairline bg-canvas-raised px-2.5 py-1 font-urbanist text-[11px] text-ink-dim">
              {t}
            </span>
          ))}
        </div>

        <Link
          href={story.href}
          className="group/link mt-5 inline-flex w-fit items-center gap-1.5 font-urbanist text-[13.5px] font-semibold text-ink transition-colors duration-200 hover:text-aurora-violet"
        >
          Read More
          <ArrowRight size={14} strokeWidth={2} className="transition-transform duration-200 group-hover/link:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}

export default function CaseStudies() {
  const reduced = usePrefersReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    const row = rowRef.current;
    if (reduced || !track || !viewport || !row) return;

    const ctx = gsap.context(() => {
      const distance = () => Math.max(row.scrollWidth - viewport.clientWidth, 0);

      const tween = gsap.to(row, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: track,
          start: "top top+=96",
          end: "bottom bottom",
          scrub: 0.4,
          invalidateOnRefresh: true,
        },
      });

      const onResize = () => ScrollTrigger.refresh();
      window.addEventListener("resize", onResize);
      return () => {
        window.removeEventListener("resize", onResize);
        tween.kill();
      };
    }, track);

    return () => ctx.revert();
  }, [reduced]);

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
            </div>
            <p className="max-w-sm font-urbanist text-[15px] leading-relaxed text-ink-dim">
              From unclear scope to launched product — with weekly progress, clean handover, and outcomes clients
              own.
            </p>
          </div>
        </Reveal>
      </div>

      {reduced ? (
        <div className="mx-auto mt-12 flex max-w-7xl gap-6 overflow-x-auto px-6 pb-4 lg:px-10">
          {STORIES.map((story) => (
            <StoryCard key={story.project} story={story} />
          ))}
        </div>
      ) : (
        <div ref={trackRef} className="relative mt-8" style={{ height: "260vh" }}>
          <div ref={viewportRef} className="sticky top-0 flex h-screen items-center overflow-hidden pl-6 lg:pl-10">
            <div ref={rowRef} className="flex w-max gap-6">
              {STORIES.map((story) => (
                <StoryCard key={story.project} story={story} />
              ))}
              {/*
                Trailing spacer sized off the viewport (not a fixed px value) so the
                row is guaranteed wider than the screen — and therefore has real
                distance to scrub — no matter how few cards there are or how wide
                the browser window is.
              */}
              <div className="w-[60vw] shrink-0" aria-hidden />
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <div className="mt-10 flex justify-center lg:mt-6">
            <Link
              href="/work"
              className="inline-flex items-center gap-2 rounded-full bg-aurora-violet px-7 py-3.5 font-urbanist text-sm font-semibold text-white transition-[background-color,transform] duration-300 hover:scale-[1.02] hover:bg-aurora-violet-dark"
            >
              View All Success Stories
              <ArrowRight size={15} strokeWidth={1.75} />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
