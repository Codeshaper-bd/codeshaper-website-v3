import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CaseStudy } from "@/lib/caseStudies";

/** Grid/related card — same visual recipe as blog/PostCard.tsx, adapted for outcome-first case study framing. */
export default function CaseStudyCard({ story }: { story: CaseStudy }) {
  const tags = [story.industry, ...story.services].slice(0, 3);

  return (
    <Link
      href={`/case-studies/${story.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-hairline-light bg-light-raised transition-[transform,box-shadow,border-color] duration-300 ease-out-expo hover:-translate-y-1 hover:border-aurora-indigo/30 hover:shadow-[0_20px_44px_rgba(11,15,25,0.08)]"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-light-surface">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={story.image}
          alt=""
          className="h-full w-full object-cover transition-transform duration-500 ease-out-expo group-hover:scale-[1.06]"
        />
        <span className="absolute left-3 top-3 max-w-[calc(100%-1.5rem)] truncate whitespace-nowrap rounded-full bg-white/90 px-2.5 py-1 font-urbanist text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink-mid backdrop-blur-sm">
          {story.industry}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-urbanist text-[17px] font-bold leading-snug tracking-tight text-ink transition-colors duration-300 group-hover:text-aurora-violet">
          {story.headline}
        </h3>
        <p className="mt-2 flex-1 font-urbanist text-[13.5px] leading-relaxed text-ink-dim line-clamp-2">
          {story.summary}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <span key={t} className="rounded-full border border-hairline-light px-2 py-0.5 font-urbanist text-[10.5px] text-ink-faint">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-hairline-light pt-4">
          <span className="font-urbanist text-[12.5px] text-ink-faint">{story.project}</span>
          <span className="inline-flex items-center gap-1 font-urbanist text-[13px] font-semibold text-ink-mid transition-colors duration-300 group-hover:text-aurora-violet">
            View case study
            <ArrowRight size={13} strokeWidth={1.75} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
