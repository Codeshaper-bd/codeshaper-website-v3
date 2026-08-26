import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { BlogPost } from "@/lib/blog";
import Reveal from "@/components/system/Reveal";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function FeaturedPost({ post }: { post: BlogPost }) {
  return (
    <section className="bg-light-surface py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <p className="mb-5 font-urbanist text-[11px] font-medium uppercase tracking-[0.2em] text-ink-faint">Featured</p>
          <Link
            href={`/blog/${post.slug}`}
            className="group grid overflow-hidden rounded-[28px] border border-hairline-light bg-light-raised transition-shadow duration-300 ease-out-expo hover:shadow-[0_30px_60px_rgba(11,15,25,0.1)] lg:grid-cols-2"
          >
            <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.image}
                alt=""
                className="h-full w-full object-cover transition-transform duration-500 ease-out-expo group-hover:scale-[1.04]"
              />
            </div>
            <div className="flex flex-col justify-center p-8 lg:p-12">
              <p className="font-urbanist text-[12.5px] font-semibold uppercase tracking-[0.08em] text-aurora-violet">
                {post.topic} · {post.readingTime} min read
              </p>
              <h2 className="mt-3 font-urbanist text-2xl font-bold leading-tight tracking-tight text-ink sm:text-3xl">
                {post.title}
              </h2>
              <p className="mt-4 font-urbanist text-[15px] leading-relaxed text-ink-dim">{post.excerpt}</p>
              <p className="mt-5 font-urbanist text-[13px] text-ink-faint">
                {post.author} · {formatDate(post.date)}
              </p>
              <span className="mt-6 inline-flex w-fit items-center gap-2 font-urbanist text-sm font-semibold text-ink transition-colors duration-300 group-hover:text-aurora-violet">
                Read article
                <ArrowRight size={15} strokeWidth={1.75} className="transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
