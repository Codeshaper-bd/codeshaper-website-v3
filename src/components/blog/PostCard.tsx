import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { BlogPost } from "@/lib/blog";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-hairline-light bg-light-raised transition-[transform,box-shadow,border-color] duration-300 ease-out-expo hover:-translate-y-1 hover:border-aurora-indigo/30 hover:shadow-[0_20px_44px_rgba(11,15,25,0.08)]"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-light-surface">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.image}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out-expo group-hover:scale-[1.06]"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 font-urbanist text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink-mid backdrop-blur-sm">
          {post.topic}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="font-urbanist text-[11.5px] font-medium text-ink-faint">
          {post.readingTime} min read · {formatDate(post.date)}
        </p>
        <h3 className="mt-2 font-urbanist text-[17px] font-bold leading-snug tracking-tight text-ink transition-colors duration-300 group-hover:text-aurora-violet">
          {post.title}
        </h3>
        <p className="mt-2 flex-1 font-urbanist text-[13.5px] leading-relaxed text-ink-dim line-clamp-2">
          {post.excerpt}
        </p>

        {post.techTags && post.techTags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {post.techTags.map((t) => (
              <span key={t} className="rounded-full border border-hairline-light px-2 py-0.5 font-urbanist text-[10.5px] text-ink-faint">
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-hairline-light pt-4">
          <span className="font-urbanist text-[12.5px] text-ink-faint">{post.author}</span>
          <span className="inline-flex items-center gap-1 font-urbanist text-[13px] font-semibold text-ink-mid transition-colors duration-300 group-hover:text-aurora-violet">
            Read
            <ArrowRight size={13} strokeWidth={1.75} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
