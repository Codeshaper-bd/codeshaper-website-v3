"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, X, ArrowRight } from "lucide-react";
import type { CaseStudy } from "@/lib/caseStudies";
import { CASE_STUDY_INDUSTRIES } from "@/lib/caseStudies";
import CaseStudyCard from "./CaseStudyCard";
import { SectionEyebrow, SectionTitle, SectionDescription } from "@/components/system/SectionHeading";

/** The top match, shown as a large horizontal card — same treatment blog/BlogBrowser uses for its page-1 lead result. */
function FeaturedRow({ story }: { story: CaseStudy }) {
  return (
    <Link
      href={`/case-studies/${story.slug}`}
      className="group grid overflow-hidden rounded-[28px] border border-hairline-light bg-light-raised transition-shadow duration-300 ease-out-expo hover:shadow-[0_24px_50px_rgba(11,15,25,0.09)] sm:grid-cols-2"
    >
      <div className="relative aspect-[16/10] overflow-hidden sm:aspect-auto">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={story.image}
          alt=""
          className="h-full w-full object-cover transition-transform duration-500 ease-out-expo group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
        <p className="font-urbanist text-[12px] font-semibold uppercase tracking-[0.08em] text-aurora-violet">
          {story.industry} · {story.project}
        </p>
        <h2 className="mt-3 font-urbanist text-xl font-bold leading-tight tracking-tight text-ink sm:text-2xl">
          {story.headline}
        </h2>
        <p className="mt-3 font-urbanist text-[14px] leading-relaxed text-ink-dim line-clamp-2">{story.summary}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {story.services.slice(0, 3).map((s) => (
            <span key={s} className="rounded-full border border-hairline-light px-2.5 py-1 font-urbanist text-[11px] text-ink-faint">
              {s}
            </span>
          ))}
        </div>
        <span className="mt-5 inline-flex w-fit items-center gap-2 font-urbanist text-sm font-semibold text-ink transition-colors duration-300 group-hover:text-aurora-violet">
          View case study
          <ArrowRight size={15} strokeWidth={1.75} className="transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

export default function CaseStudyBrowser({ stories }: { stories: CaseStudy[] }) {
  const [query, setQuery] = useState("");
  const [industry, setIndustry] = useState<string | null>(null);

  const q = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    return stories.filter((s) => {
      if (industry && s.industry !== industry) return false;
      if (q) {
        const haystack = `${s.project} ${s.headline} ${s.summary} ${s.industry} ${s.services.join(" ")} ${s.tech.join(" ")}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [stories, industry, q]);

  const hasActiveFilters = industry !== null || q.length > 0;
  const resetAll = () => {
    setQuery("");
    setIndustry(null);
  };

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <section id="browse" className="relative overflow-hidden bg-light-surface py-14 lg:py-20">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "url(/media/hex-pattern-tile.svg)", backgroundSize: "112px 194px" }}
      />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <SectionEyebrow>Case Studies</SectionEyebrow>
        <SectionTitle id="browse-heading">All case studies</SectionTitle>
        <SectionDescription className="mt-3 max-w-xl">
          Every project we can show in the open — filter by industry or search by keyword.
        </SectionDescription>

        <div className="mt-8">
          <div className="relative">
            <Search size={19} strokeWidth={1.75} className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-ink-faint" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder='Search case studies (e.g., "POS", "membership", "mobile")'
              className="w-full rounded-2xl border border-hairline-light bg-light-raised py-4 pl-14 pr-5 font-urbanist text-[15px] text-ink shadow-[0_1px_2px_rgba(11,15,25,0.04)] outline-none transition-[border-color,box-shadow] placeholder:text-ink-faint focus:border-aurora-violet/60 focus:shadow-[0_8px_24px_rgba(124,108,255,0.12)]"
            />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIndustry(null)}
              className={`shrink-0 rounded-full border px-4 py-2 font-urbanist text-[14px] font-semibold transition-colors duration-200 ${
                industry === null
                  ? "border-ink bg-ink text-canvas"
                  : "border-hairline-light text-ink-dim hover:border-ink-faint hover:text-ink"
              }`}
            >
              All industries
            </button>
            {CASE_STUDY_INDUSTRIES.map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndustry((cur) => (cur === i ? null : i))}
                className={`shrink-0 rounded-full border px-4 py-2 font-urbanist text-[14px] font-semibold transition-colors duration-200 ${
                  industry === i
                    ? "border-aurora-violet bg-aurora-violet/10 text-aurora-violet"
                    : "border-hairline-light text-ink-dim hover:border-ink-faint hover:text-ink"
                }`}
              >
                {i}
              </button>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-hairline-light pt-4">
            <p className="font-urbanist text-[13px] text-ink-faint">
              {filtered.length} {filtered.length === 1 ? "case study" : "case studies"}
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

          {filtered.length > 0 ? (
            <div className="mt-6 space-y-5">
              {featured && <FeaturedRow story={featured} />}
              {rest.length > 0 && (
                <div className="grid gap-5 sm:grid-cols-2">
                  {rest.map((s) => (
                    <CaseStudyCard key={s.slug} story={s} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-hairline-light py-16 text-center">
              <p className="font-urbanist text-sm text-ink-dim">No case studies match those filters yet.</p>
              <button type="button" onClick={resetAll} className="mt-3 font-urbanist text-sm font-semibold text-aurora-violet">
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
