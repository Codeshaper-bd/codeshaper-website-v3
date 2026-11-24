"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, X, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { TOPICS, type BlogPost } from "@/lib/blog";
import PostCard, { PostMeta } from "./PostCard";
import ReadCount from "./ReadCount";
import { SectionEyebrow, SectionTitle } from "@/components/system/SectionHeading";
import DotField from "@/components/sections/human-ai-flow/DotField";
import { useBlogStats } from "./blogStatsClient";
import { topicColor } from "@/lib/topicColors";

/**
 * Blog index › browse (owner, 24 Nov 2026: "more organized, easier to read").
 *  1. One toolbar: title left, search right; topics underneath as one row
 *     of chips, each with its article count (one topic at a time, kept in
 *     the URL as ?topic= so a filtered view can be shared).
 *  2. A status line that says what is shown ("3 articles in Commerce").
 *  3. Sort: Latest, or Most read (real read counts from the CMS).
 *  4. With no filter, page 1 opens with the newest article as a lead story;
 *     everything else is a calm three-column grid. While filtering there is
 *     no lead story, so the results read as one list.
 * The sidebar (newsletter + "need help") is gone: the newsletter sits above
 * the footer on every page, and the call to action closes this page.
 */
const PAGE_SIZE = 9;

function LeadStory({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group grid overflow-hidden rounded-[28px] border border-hairline-light bg-white p-2.5 transition-[transform,box-shadow,border-color] duration-300 ease-out-expo hover:-translate-y-1 hover:border-[#0b0f19]/[0.12] hover:shadow-[0_28px_60px_-30px_rgba(11,15,25,0.35)] lg:grid-cols-12"
    >
      <div className="relative aspect-[16/9] overflow-hidden rounded-[20px] bg-light-surface lg:col-span-7 lg:aspect-auto lg:min-h-[360px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.image}
          alt={post.imageAlt ?? ""}
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 font-urbanist text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink shadow-[0_2px_8px_-2px_rgba(11,15,25,0.2)] backdrop-blur-sm">
          Latest
        </span>
        <ReadCount slug={post.slug} badge className="bottom-4! left-4!" />
      </div>
      <div className="flex flex-col px-4 pb-4 pt-6 sm:px-6 lg:col-span-5 lg:px-9 lg:py-9">
        <PostMeta post={post} />
        <h3 className="mt-3 text-balance font-urbanist text-[24px] font-bold leading-[1.18] tracking-[-0.02em] text-ink transition-colors duration-300 group-hover:text-aurora-violet sm:text-[30px]">
          {post.title}
        </h3>
        <p className="mt-4 line-clamp-3 font-urbanist text-[15px] leading-relaxed text-ink-dim">{post.excerpt}</p>
        <span className="mt-auto flex items-center justify-between gap-4 pt-8 font-urbanist text-[13.5px] font-semibold text-ink">
          Read the article
          <span className="grid h-10 w-10 place-items-center rounded-full border border-[#0b0f19]/[0.1] transition-[background-color,border-color,color,transform] duration-300 group-hover:rotate-45 group-hover:border-[#0b0f19] group-hover:bg-[#0b0f19] group-hover:text-white">
            <ArrowUpRight size={16} strokeWidth={2} aria-hidden />
          </span>
        </span>
      </div>
    </Link>
  );
}

function Chip({ active, label, count, color, onClick }: { active: boolean; label: string; count: number; color?: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      // a selected topic takes its own colour (white text, ≥ 5:1)
      style={active && color ? { backgroundColor: color, borderColor: color } : undefined}
      className={`inline-flex shrink-0 items-center gap-2 rounded-full border py-2 ${color ? "pl-3.5" : "pl-4"} pr-2 font-urbanist text-[13.5px] font-semibold transition-[background-color,border-color,color] duration-200 ${
        active
          ? "border-[#0b0f19] bg-[#0b0f19] text-white"
          : "border-hairline-light bg-white text-ink-dim hover:border-[#0b0f19]/[0.2] hover:text-ink"
      }`}
    >
      {color && <span aria-hidden className="h-2 w-2 rounded-full" style={{ backgroundColor: active ? "#fff" : color }} />}
      {label}
      <span
        className={`grid h-[22px] min-w-[22px] place-items-center rounded-full px-1.5 text-[11px] font-semibold tabular-nums ${
          active ? "bg-white/15 text-white" : "bg-[#f3f2ef] text-ink-faint"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

export default function BlogBrowser({ posts }: { posts: BlogPost[] }) {
  // Read from the URL client-side (a server `searchParams` read would make
  // /blog dynamic and broke its metadata in Lighthouse).
  const searchParams = useSearchParams();
  const [topic, setTopic] = useState<string | null>(() => {
    const t = searchParams.get("topic");
    return t && TOPICS.includes(t) ? t : null;
  });
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<"latest" | "popular">("latest");
  const stats = useBlogStats();

  const sorted = useMemo(() => {
    const byDate = [...posts].sort((a, b) => b.date.localeCompare(a.date));
    if (sort === "latest") return byDate;
    const reads = (slug: string) => stats?.[slug]?.reads ?? 0;
    return byDate.sort((a, b) => reads(b.slug) - reads(a.slug));
  }, [posts, sort, stats]);
  const counts = useMemo(() => {
    const m = new Map<string, number>();
    for (const p of posts) m.set(p.topic, (m.get(p.topic) ?? 0) + 1);
    return m;
  }, [posts]);
  const topics = TOPICS.filter((t) => counts.get(t));

  const q = query.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      sorted.filter((p) => {
        if (topic && p.topic !== topic) return false;
        if (!q) return true;
        return `${p.title} ${p.excerpt} ${p.topic} ${(p.techTags ?? []).join(" ")}`.toLowerCase().includes(q);
      }),
    [sorted, topic, q],
  );

  const filtering = Boolean(topic || q);
  // the newest article leads page 1 when nothing is filtered and the list is by date
  const lead = !filtering && sort === "latest" ? filtered.find((p) => p.featured) ?? filtered[0] : undefined;
  const list = lead ? filtered.filter((p) => p !== lead) : filtered;
  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const items = list.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const chooseTopic = (t: string | null) => {
    setTopic(t);
    setPage(1);
    const url = new URL(window.location.href);
    if (t) url.searchParams.set("topic", t);
    else url.searchParams.delete("topic");
    window.history.replaceState(window.history.state, "", url);
  };
  const resetAll = () => {
    setQuery("");
    chooseTopic(null);
  };
  const goTo = (n: number) => {
    setPage(n);
    document.getElementById("browse")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const n = filtered.length;
  const status = (
    <>
      <span className="font-semibold text-ink">{n}</span> {n === 1 ? "article" : "articles"}
      {topic && (
        <>
          {" "}in <span className="font-semibold text-ink">{topic}</span>
        </>
      )}
      {q && (
        <>
          {" "}matching <span className="font-semibold text-ink">&ldquo;{query.trim()}&rdquo;</span>
        </>
      )}
    </>
  );

  return (
    <section id="browse" aria-labelledby="browse-heading" className="theme-light relative scroll-mt-24 overflow-clip bg-light-surface py-16 lg:py-24">
      <DotField className="[mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        {/* toolbar: title + search */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <SectionEyebrow>Browse</SectionEyebrow>
            <SectionTitle id="browse-heading">All articles</SectionTitle>
          </div>
          <div className="relative w-full lg:w-[380px]">
            <label htmlFor="blog-search" className="sr-only">
              Search articles
            </label>
            <Search size={17} strokeWidth={1.9} aria-hidden className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-ink-faint" />
            <input
              id="blog-search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              type="search"
              autoComplete="off"
              placeholder="Search: MVP, Shopify, RAG…"
              className="h-12 w-full rounded-full border border-hairline-light bg-white pl-12 pr-11 font-urbanist text-[14.5px] text-ink shadow-[0_1px_2px_rgba(11,15,25,0.04)] transition-[border-color,box-shadow] duration-200 placeholder:text-[#6b7183] hover:border-[#0b0f19]/[0.16] focus:border-[#0b0f19]/[0.3] focus:shadow-[0_0_0_4px_rgba(79,70,229,0.1)] focus-visible:outline-none! [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setPage(1);
                }}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-ink-faint transition-colors hover:bg-[#f3f2ef] hover:text-ink"
              >
                <X size={14} strokeWidth={2} />
              </button>
            )}
          </div>
        </div>

        {/* topics: wrap on desktop, swipe on phones */}
        <div
          role="group"
          aria-label="Filter by topic"
          className="no-scrollbar -mx-6 mt-8 flex gap-2 overflow-x-auto px-6 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
        >
          <Chip active={!topic} label="All topics" count={posts.length} onClick={() => chooseTopic(null)} />
          {topics.map((t) => (
            <Chip key={t} active={topic === t} label={t} count={counts.get(t) ?? 0} color={topicColor(t)} onClick={() => chooseTopic(topic === t ? null : t)} />
          ))}
        </div>

        <div className="mt-6 flex min-h-[37px] items-center justify-between gap-4 border-t border-[#0b0f19]/[0.08] pt-4">
          <p aria-live="polite" className="font-urbanist text-[13.5px] text-ink-dim">
            {status}
          </p>
          <div className="flex items-center gap-2">
          {filtering && (
            <button
              type="button"
              onClick={resetAll}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-urbanist text-[13px] font-semibold text-ink-dim transition-colors hover:bg-white hover:text-ink"
            >
              <X size={13} strokeWidth={2} aria-hidden />
              Clear filters
            </button>
          )}
          <div role="radiogroup" aria-label="Sort articles" className="flex rounded-full border border-hairline-light bg-white p-1">
            {(["latest", "popular"] as const).map((k) => (
              <button
                key={k}
                type="button"
                role="radio"
                aria-checked={sort === k}
                onClick={() => {
                  setSort(k);
                  setPage(1);
                }}
                className={`rounded-full px-3.5 py-1.5 font-urbanist text-[12.5px] font-semibold transition-colors duration-200 ${
                  sort === k ? "bg-[#0b0f19] text-white" : "text-ink-dim hover:text-ink"
                }`}
              >
                {k === "latest" ? "Latest" : "Most read"}
              </button>
            ))}
          </div>
          </div>
        </div>

        {n === 0 ? (
          <div className="mt-8 rounded-[24px] border border-dashed border-[#0b0f19]/[0.14] bg-white/60 px-6 py-16 text-center">
            <p className="font-urbanist text-[15px] font-semibold text-ink">No articles match that yet.</p>
            <p className="mt-1.5 font-urbanist text-[13.5px] text-ink-dim">Try another word, or browse every topic.</p>
            <button
              type="button"
              onClick={resetAll}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#0b0f19] px-5 py-2.5 font-urbanist text-[13px] font-semibold text-white transition-colors hover:bg-[#1f2433]"
            >
              Show all articles
            </button>
          </div>
        ) : (
          <>
            {lead && current === 1 && (
              <div className="mt-8">
                <LeadStory post={lead} />
              </div>
            )}
            {items.length > 0 && (
              <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((post) => (
                  <li key={post.slug}>
                    <PostCard post={post} />
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {totalPages > 1 && (
          <nav aria-label="Article pages" className="mt-12 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => goTo(Math.max(1, current - 1))}
              disabled={current === 1}
              aria-label="Previous page"
              className="grid h-10 w-10 place-items-center rounded-full border border-hairline-light bg-white text-ink-dim transition-colors hover:border-[#0b0f19]/[0.2] hover:text-ink disabled:pointer-events-none disabled:opacity-35"
            >
              <ChevronLeft size={16} strokeWidth={1.9} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => goTo(k)}
                aria-current={k === current ? "page" : undefined}
                className={`grid h-10 w-10 place-items-center rounded-full font-urbanist text-[13.5px] font-semibold tabular-nums transition-colors ${
                  k === current ? "bg-[#0b0f19] text-white" : "text-ink-dim hover:bg-white hover:text-ink"
                }`}
              >
                {k}
              </button>
            ))}
            <button
              type="button"
              onClick={() => goTo(Math.min(totalPages, current + 1))}
              disabled={current === totalPages}
              aria-label="Next page"
              className="grid h-10 w-10 place-items-center rounded-full border border-hairline-light bg-white text-ink-dim transition-colors hover:border-[#0b0f19]/[0.2] hover:text-ink disabled:pointer-events-none disabled:opacity-35"
            >
              <ChevronRight size={16} strokeWidth={1.9} />
            </button>
          </nav>
        )}
      </div>
    </section>
  );
}
