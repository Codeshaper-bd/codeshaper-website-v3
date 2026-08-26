"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, X, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { TOPICS, FORMATS, LEVELS, type BlogPost } from "@/lib/blog";
import PostCard from "./PostCard";
import { SectionEyebrow, SectionTitle, SectionDescription } from "@/components/system/SectionHeading";

const PAGE_SIZE = 6;

type Sort = "latest" | "relevant";

function chipCls(active: boolean) {
  return `rounded-full border px-3.5 py-1.5 font-urbanist text-[13px] font-medium transition-colors duration-200 ${
    active
      ? "border-aurora-violet bg-aurora-violet/10 text-aurora-violet"
      : "border-hairline-light text-ink-dim hover:border-ink-faint hover:text-ink"
  }`;
}

function toggle(set: Set<string>, value: string) {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

export default function BlogBrowser({ posts, initialTopic }: { posts: BlogPost[]; initialTopic?: string }) {
  const [query, setQuery] = useState("");
  const [topics, setTopics] = useState<Set<string>>(() => (initialTopic ? new Set([initialTopic]) : new Set()));
  const [formats, setFormats] = useState<Set<string>>(new Set());
  const [levels, setLevels] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<Sort>("latest");
  const [page, setPage] = useState(1);

  const q = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    let list = posts.filter((p) => {
      if (topics.size && !topics.has(p.topic)) return false;
      if (formats.size && !formats.has(p.format)) return false;
      if (levels.size && !levels.has(p.level)) return false;
      if (q) {
        const haystack = `${p.title} ${p.excerpt} ${p.topic} ${(p.techTags ?? []).join(" ")}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    if (sort === "relevant" && q) {
      list = [...list].sort((a, b) => score(b, q) - score(a, q));
    } else {
      list = [...list].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    return list;
  }, [posts, topics, formats, levels, q, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const clampedPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((clampedPage - 1) * PAGE_SIZE, clampedPage * PAGE_SIZE);

  const hasActiveFilters = topics.size > 0 || formats.size > 0 || levels.size > 0 || q.length > 0;

  const resetAll = () => {
    setQuery("");
    setTopics(new Set());
    setFormats(new Set());
    setLevels(new Set());
    setSort("latest");
    setPage(1);
  };

  return (
    <section id="browse" className="bg-canvas py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionEyebrow>Browse</SectionEyebrow>
        <SectionTitle id="browse-heading">Latest articles</SectionTitle>
        <SectionDescription className="mt-3 max-w-xl">
          New posts on product delivery, engineering, and automation.
        </SectionDescription>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_300px]">
          <div>{/* Search */}
        <div className="relative mt-8 max-w-lg">
          <Search size={16} strokeWidth={1.75} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            type="text"
            placeholder='Search articles (e.g., "MVP", "Shopify", "RAG", "CRO")'
            className="w-full rounded-full border border-hairline-light bg-light-raised py-3 pl-11 pr-4 font-urbanist text-sm text-ink placeholder:text-ink-faint outline-none transition-colors focus:border-aurora-violet/60"
          />
        </div>

        {/* Filter chips */}
        <div className="mt-6 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 font-urbanist text-[11px] font-medium uppercase tracking-[0.14em] text-ink-faint">Topic</span>
            {TOPICS.map((t) => (
              <button key={t} type="button" onClick={() => { setTopics((s) => toggle(s, t)); setPage(1); }} className={chipCls(topics.has(t))}>
                {t}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 font-urbanist text-[11px] font-medium uppercase tracking-[0.14em] text-ink-faint">Format</span>
            {FORMATS.map((f) => (
              <button key={f} type="button" onClick={() => { setFormats((s) => toggle(s, f)); setPage(1); }} className={chipCls(formats.has(f))}>
                {f}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 font-urbanist text-[11px] font-medium uppercase tracking-[0.14em] text-ink-faint">Level</span>
            {LEVELS.map((l) => (
              <button key={l} type="button" onClick={() => { setLevels((s) => toggle(s, l)); setPage(1); }} className={chipCls(levels.has(l))}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Sort + reset + count */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-hairline-light pt-5">
          <p className="font-urbanist text-[13px] text-ink-faint">
            {filtered.length} {filtered.length === 1 ? "article" : "articles"}
          </p>
          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetAll}
                className="inline-flex items-center gap-1 font-urbanist text-[13px] font-medium text-ink-faint transition-colors hover:text-ink"
              >
                <X size={13} strokeWidth={1.75} />
                Clear filters
              </button>
            )}
            <label className="flex items-center gap-2 font-urbanist text-[13px] text-ink-dim">
              Sort
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="rounded-lg border border-hairline-light bg-light-raised px-2.5 py-1.5 font-urbanist text-[13px] text-ink outline-none"
              >
                <option value="latest">Latest</option>
                <option value="relevant" disabled={!q}>
                  Most relevant{!q ? " (search first)" : ""}
                </option>
              </select>
            </label>
          </div>
        </div>

        {/* Grid */}
        {pageItems.length > 0 ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pageItems.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-hairline-light py-16 text-center">
            <p className="font-urbanist text-sm text-ink-dim">No articles match those filters yet.</p>
            <button type="button" onClick={resetAll} className="mt-3 font-urbanist text-sm font-semibold text-aurora-violet">
              Clear filters
            </button>
          </div>
        )}

        {/* Pagination */}
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

          <aside className="h-fit lg:sticky lg:top-32">
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
  );
}

function score(post: BlogPost, q: string): number {
  const title = post.title.toLowerCase();
  const excerpt = post.excerpt.toLowerCase();
  let s = 0;
  if (title.includes(q)) s += 3;
  if (excerpt.includes(q)) s += 1;
  if (post.topic.toLowerCase().includes(q)) s += 1;
  return s;
}
