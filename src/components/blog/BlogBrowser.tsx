"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Search, X, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { TOPICS, type BlogPost } from "@/lib/blog";
import PostCard from "./PostCard";
import NewsletterForm from "./NewsletterForm";
import { SectionEyebrow, SectionTitle, SectionDescription } from "@/components/system/SectionHeading";

const PAGE_SIZE = 7;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

/** The current page's first result, shown as a large horizontal card — only on page 1, so it's always the single most recent match, never a page-2+ item picked arbitrarily. */
function FeaturedRow({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group grid overflow-hidden rounded-[28px] border border-hairline-light bg-light-raised transition-shadow duration-300 ease-out-expo hover:shadow-[0_24px_50px_rgba(11,15,25,0.09)] sm:grid-cols-2"
    >
      <div className="relative aspect-[16/10] overflow-hidden sm:aspect-auto">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.image}
          alt=""
          className="h-full w-full object-cover transition-transform duration-500 ease-out-expo group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
        <p className="font-urbanist text-[12px] font-semibold uppercase tracking-[0.08em] text-aurora-violet">
          {post.topic} · {post.readingTime} min read
        </p>
        <h2 className="mt-3 font-urbanist text-xl font-bold leading-tight tracking-tight text-ink sm:text-2xl">
          {post.title}
        </h2>
        <p className="mt-3 font-urbanist text-[14px] leading-relaxed text-ink-dim line-clamp-2">{post.excerpt}</p>
        <p className="mt-4 font-urbanist text-[12.5px] text-ink-faint">
          {post.author} · {formatDate(post.date)}
        </p>
        <span className="mt-5 inline-flex w-fit items-center gap-2 font-urbanist text-sm font-semibold text-ink transition-colors duration-300 group-hover:text-aurora-violet">
          Read article
          <ArrowRight size={15} strokeWidth={1.75} className="transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

export default function BlogBrowser({ posts, initialTopic }: { posts: BlogPost[]; initialTopic?: string }) {
  const [query, setQuery] = useState("");
  const [topics, setTopics] = useState<Set<string>>(() => (initialTopic ? new Set([initialTopic]) : new Set()));
  const [page, setPage] = useState(1);
  const chipRowRef = useRef<HTMLDivElement>(null);
  const draggedRef = useRef(false);

  // Drag-to-scroll on the topic chip row (mouse only — touch already
  // scrolls natively). Same mechanics as Testimonials'/CaseStudies'
  // draggable rows, except a press starting ON a chip is allowed to
  // begin a drag too (the chips fill the row, so excluding them would
  // leave almost no draggable surface) — a real drag still suppresses
  // that chip's click via the same capture-phase technique.
  useEffect(() => {
    const el = chipRowRef.current;
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
      // Pointer capture is deliberately NOT taken here — only once a real
      // drag is confirmed in onPointerMove. Capturing eagerly on every
      // mousedown (even a plain click with near-zero movement) intercepted
      // the browser's own click-target resolution for chips underneath the
      // pointer, silently swallowing ordinary clicks — confirmed via a
      // Playwright click (which has natural mouse jitter) failing to
      // toggle a chip, while a raw DOM `.click()` (no pointer events at
      // all) worked fine.
      el.style.cursor = "grabbing";
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (!draggedRef.current && Math.abs(dx) > 6) {
        draggedRef.current = true;
        el.setPointerCapture(e.pointerId);
      }
      if (draggedRef.current) el.scrollLeft = startScroll - dx;
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

  const q = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    const list = posts.filter((p) => {
      if (topics.size && !topics.has(p.topic)) return false;
      if (q) {
        const haystack = `${p.title} ${p.excerpt} ${p.topic} ${(p.techTags ?? []).join(" ")}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
    return [...list].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [posts, topics, q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const clampedPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((clampedPage - 1) * PAGE_SIZE, clampedPage * PAGE_SIZE);
  const featuredItem = clampedPage === 1 ? pageItems[0] : undefined;
  const restItems = clampedPage === 1 ? pageItems.slice(1) : pageItems;

  const hasActiveFilters = topics.size > 0 || q.length > 0;

  const resetAll = () => {
    setQuery("");
    setTopics(new Set());
    setPage(1);
  };

  const toggleTopic = (t: string) => {
    setTopics((s) => {
      const next = new Set(s);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
    setPage(1);
  };

  return (
    <div id="browse" className="bg-light-surface p-3 sm:p-4">
      <section className="relative overflow-hidden rounded-[32px] bg-canvas py-14 lg:py-20">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "url(/media/hex-pattern-tile.svg)", backgroundSize: "112px 194px" }}
        />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <SectionEyebrow>Browse</SectionEyebrow>
        <SectionTitle id="browse-heading">Latest articles</SectionTitle>
        <SectionDescription className="mt-3 max-w-xl">
          New posts on product delivery, engineering, and automation.
        </SectionDescription>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_300px]">
          <div className="min-w-0">
            {/* Standout search */}
            <div className="relative">
              <Search size={19} strokeWidth={1.75} className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                type="text"
                placeholder='Search articles (e.g., "MVP", "Shopify", "RAG", "CRO")'
                className="w-full rounded-2xl border border-hairline-light bg-light-raised py-4 pl-14 pr-5 font-urbanist text-[15px] text-ink shadow-[0_1px_2px_rgba(11,15,25,0.04)] outline-none transition-[border-color,box-shadow] placeholder:text-ink-faint focus:border-aurora-violet/60 focus:shadow-[0_8px_24px_rgba(124,108,255,0.12)]"
              />
            </div>

            {/* Topic chips — draggable row */}
            <div
              ref={chipRowRef}
              className="no-scrollbar mt-5 flex cursor-grab items-center gap-2.5 overflow-x-auto"
            >
              <button
                type="button"
                onClick={() => {
                  setTopics(new Set());
                  setPage(1);
                }}
                className={`shrink-0 rounded-full border px-4 py-2 font-urbanist text-[14px] font-semibold transition-colors duration-200 ${
                  topics.size === 0
                    ? "border-ink bg-ink text-canvas"
                    : "border-hairline-light text-ink-dim hover:border-ink-faint hover:text-ink"
                }`}
              >
                All topics
              </button>
              {TOPICS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleTopic(t)}
                  className={`shrink-0 rounded-full border px-4 py-2 font-urbanist text-[14px] font-semibold transition-colors duration-200 ${
                    topics.has(t)
                      ? "border-aurora-violet bg-aurora-violet/10 text-aurora-violet"
                      : "border-hairline-light text-ink-dim hover:border-ink-faint hover:text-ink"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-hairline-light pt-4">
              <p className="font-urbanist text-[13px] text-ink-faint">
                {filtered.length} {filtered.length === 1 ? "article" : "articles"}
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetAll}
                  className="inline-flex items-center gap-1 font-urbanist text-[13px] font-medium text-ink-faint transition-colors hover:text-ink"
                >
                  <X size={13} strokeWidth={1.75} />
                  Clear
                </button>
              )}
            </div>

            {pageItems.length > 0 ? (
              <div className="mt-6 space-y-5">
                {featuredItem && <FeaturedRow post={featuredItem} />}
                <div className="grid gap-5 sm:grid-cols-2">
                  {restItems.map((post) => (
                    <PostCard key={post.slug} post={post} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-hairline-light py-16 text-center">
                <p className="font-urbanist text-sm text-ink-dim">No articles match those filters yet.</p>
                <button type="button" onClick={resetAll} className="mt-3 font-urbanist text-sm font-semibold text-aurora-violet">
                  Clear filters
                </button>
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={clampedPage === 1}
                  aria-label="Previous page"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline-light text-ink-dim transition-colors hover:border-ink-faint hover:text-ink disabled:opacity-30"
                >
                  <ChevronLeft size={16} strokeWidth={1.75} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setPage(n)}
                    aria-current={n === clampedPage ? "page" : undefined}
                    className={`flex h-9 w-9 items-center justify-center rounded-full font-urbanist text-[13px] font-semibold transition-colors ${
                      n === clampedPage ? "bg-ink text-canvas" : "text-ink-dim hover:bg-light-surface"
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={clampedPage === totalPages}
                  aria-label="Next page"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline-light text-ink-dim transition-colors hover:border-ink-faint hover:text-ink disabled:opacity-30"
                >
                  <ChevronRight size={16} strokeWidth={1.75} />
                </button>
              </div>
            )}
          </div>

          <aside className="space-y-5 lg:sticky lg:top-32 lg:h-fit">
            <NewsletterForm />
            <div className="rounded-2xl border border-hairline-light bg-light-raised p-6">
              <h3 className="font-urbanist text-[15px] font-bold text-ink">Need help shipping this?</h3>
              <p className="mt-2 font-urbanist text-[13px] leading-relaxed text-ink-dim">
                If you&apos;re building a product and need predictable delivery, we&apos;ll recommend the right
                service and engagement model.
              </p>
              <Link
                href="/contact"
                className="mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-aurora-violet/70 px-5 py-2.5 font-urbanist text-[13px] font-semibold text-ink transition-colors hover:border-aurora-violet"
              >
                Book a Call
                <ArrowRight size={13} strokeWidth={1.75} />
              </Link>
              <Link
                href="/engagement"
                className="mt-3 block text-center font-urbanist text-[12.5px] font-medium text-ink-faint transition-colors hover:text-ink"
              >
                Explore Engagement Models →
              </Link>
            </div>
          </aside>
        </div>
      </div>
      </section>
    </div>
  );
}
