import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { BlogPost } from "@/lib/blog";
import ReadCount from "./ReadCount";
import { topicColor } from "@/lib/topicColors";

/** The topic as a soft pill in its own colour (lib/topicColors). */
export function TopicLabel({ topic, className = "" }: { topic: string; className?: string }) {
  const c = topicColor(topic);
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full px-2 py-[3px] font-semibold leading-none ${className}`}
      style={{ color: c, backgroundColor: `color-mix(in srgb, ${c} 9%, white)` }}
    >
      {topic}
    </span>
  );
}

export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

/** Topic (indigo) · reading time · date: the one meta line every blog card uses (the read count is a badge on the image). */
export function PostMeta({ post, className = "" }: { post: BlogPost; className?: string }) {
  return (
    <p className={`font-urbanist text-[12px] font-medium text-ink-faint ${className}`}>
      <TopicLabel topic={post.topic} className="mr-1.5" />
      <span className="whitespace-nowrap">{post.readingTime} min read</span>
      <span aria-hidden className="mx-1.5">·</span>
      <time dateTime={post.date} className="whitespace-nowrap">{fmtDate(post.date)}</time>
    </p>
  );
}

/**
 * A blog card (blog index, category and tag pages, related posts). Same
 * language as the homepage Blog section: the image in a thin white frame,
 * one meta line, title, two lines of excerpt, and a quiet "Read" row.
 * No author line (it is the same team on every post) and no tech tags
 * (they made the cards uneven): less noise, faster to scan.
 */
export default function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col rounded-[24px] border border-hairline-light bg-white p-2 transition-[transform,box-shadow,border-color] duration-300 ease-out-expo hover:-translate-y-1 hover:border-[#0b0f19]/[0.12] hover:shadow-[0_24px_50px_-30px_rgba(11,15,25,0.35)]"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[18px] bg-light-surface">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.image}
          alt={post.imageAlt ?? ""}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.05]"
        />
        <ReadCount slug={post.slug} badge />
      </div>

      <div className="flex flex-1 flex-col px-3.5 pb-3.5 pt-5">
        <PostMeta post={post} />
        <h3 className="mt-2.5 line-clamp-2 text-balance font-urbanist text-[18px] font-bold leading-snug tracking-tight text-ink transition-colors duration-300 group-hover:text-aurora-violet">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 font-urbanist text-[13.5px] leading-relaxed text-ink-dim">{post.excerpt}</p>
        <span className="mt-auto flex items-center justify-between pt-5 font-urbanist text-[13px] font-semibold text-ink">
          Read article
          <span className="grid h-8 w-8 place-items-center rounded-full border border-[#0b0f19]/[0.1] transition-[background-color,border-color,color,transform] duration-300 group-hover:rotate-45 group-hover:border-[#0b0f19] group-hover:bg-[#0b0f19] group-hover:text-white">
            <ArrowUpRight size={14} strokeWidth={2} aria-hidden />
          </span>
        </span>
      </div>
    </Link>
  );
}
