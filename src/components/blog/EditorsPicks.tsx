import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EDITOR_PICKS_SLUGS, getPostBySlug } from "@/lib/blog";
import Reveal from "@/components/system/Reveal";

export default function EditorsPicks() {
  const posts = EDITOR_PICKS_SLUGS.map(getPostBySlug).filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <section className="border-t border-hairline-light bg-light-surface py-14 lg:py-16">
      <div className="mx-auto max-w-3xl px-6 lg:px-10">
        <Reveal>
          <p className="mb-6 font-urbanist text-[11px] font-medium uppercase tracking-[0.2em] text-ink-faint">
            Editor&apos;s picks
          </p>
        </Reveal>
        <ol className="space-y-1">
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={i * 50}>
              <li>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex items-center gap-4 rounded-xl px-3 py-3.5 transition-colors duration-200 hover:bg-light-raised"
                >
                  <span className="font-urbanist text-lg font-bold text-ink-faint">{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex-1 font-urbanist text-[14.5px] font-semibold text-ink transition-colors duration-200 group-hover:text-aurora-violet">
                    {post.title}
                  </span>
                  <ArrowRight size={15} strokeWidth={1.75} className="shrink-0 text-ink-faint transition-transform duration-200 group-hover:translate-x-1 group-hover:text-aurora-violet" />
                </Link>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
