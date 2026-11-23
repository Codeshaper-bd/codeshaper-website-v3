import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { SectionEyebrow, SectionTitle } from "@/components/system/SectionHeading";
import Reveal from "@/components/system/Reveal";
import { BLOG_POSTS, type BlogPost } from "@/lib/blog";
import { homeCopy, type CopyOf } from "@/lib/homeCopy";
import DotField from "@/components/sections/human-ai-flow/DotField";

/**
 * Homepage › latest articles. Closes the page with proof of thinking: one
 * lead story (a post marked featured, else the newest) and the next three as
 * a reading list. Server-rendered on purpose: only these four cards reach the
 * page, never the articles' full text. The words above come from the CMS
 * (Pages › Home); the posts from Blog.
 */
const fmt = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

function pick(): BlogPost[] {
  const newest = [...BLOG_POSTS].sort((a, b) => b.date.localeCompare(a.date));
  const lead = newest.find((p) => p.featured) ?? newest[0];
  return lead ? [lead, ...newest.filter((p) => p !== lead).slice(0, 3)] : [];
}

function Meta({ post }: { post: BlogPost }) {
  return (
    <p className="font-urbanist text-[12px] font-medium text-ink-faint">
      <span className="font-semibold text-[#4f46e5]">{post.topic}</span>
      <span aria-hidden className="mx-1.5">
        ·
      </span>
      {post.readingTime} min read
      <span aria-hidden className="mx-1.5">
        ·
      </span>
      <time dateTime={post.date}>{fmt(post.date)}</time>
    </p>
  );
}

export default function BlogLatest({ copy }: { copy?: CopyOf<"blogPosts"> }) {
  const c = homeCopy("blogPosts", copy);
  const [lead, ...rest] = pick();
  if (!lead) return null;

  return (
    <section aria-labelledby="blog-latest-heading" className="theme-light relative overflow-clip bg-light-surface py-16 font-urbanist lg:py-24">
      {/* the shared dotted background (as Human + AI), fading out at the top and bottom */}
      <DotField className="[mask-image:linear-gradient(to_bottom,transparent,black_22%,black_78%,transparent)]" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <SectionEyebrow>{c.eyebrow}</SectionEyebrow>
                <SectionTitle id="blog-latest-heading" className="max-w-[18ch] text-balance">
                  {c.title}
                </SectionTitle>
              </div>
              <Link
                href="/blog"
                className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-hairline-light bg-white px-5 py-2.5 text-[13px] font-semibold text-ink transition-[border-color,box-shadow] duration-300 hover:border-aurora-indigo/30 hover:shadow-[0_10px_24px_-14px_rgba(11,15,25,0.35)]"
              >
                {c.button}
                <ArrowRight size={14} strokeWidth={1.9} aria-hidden />
              </Link>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-5 lg:mt-14 lg:grid-cols-12 lg:gap-6">
            {/* lead story */}
            <Reveal delay={60} className="lg:col-span-7">
              <Link
                href={`/blog/${lead.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-hairline-light bg-white p-2.5 transition-[transform,box-shadow,border-color] duration-300 ease-out-expo hover:-translate-y-1 hover:border-[#0b0f19]/[0.12] hover:shadow-[0_28px_60px_-30px_rgba(11,15,25,0.35)]"
              >
                {/* the image sits in a thin white frame, like the product and case-study cards */}
                <div className="relative aspect-[16/9] overflow-hidden rounded-[20px] bg-light-surface">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={lead.image}
                    alt={lead.imageAlt ?? ""}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink shadow-[0_2px_8px_-2px_rgba(11,15,25,0.2)] backdrop-blur-sm">
                    Latest
                  </span>
                </div>
                <div className="flex flex-1 flex-col px-4 pb-4 pt-6 sm:px-6 sm:pb-5 sm:pt-7">
                  <Meta post={lead} />
                  <h3 className="mt-3 max-w-[30ch] text-balance text-[22px] font-bold leading-[1.2] tracking-[-0.02em] text-ink transition-colors duration-300 group-hover:text-aurora-violet sm:text-[26px]">
                    {lead.title}
                  </h3>
                  <p className="mt-3 line-clamp-2 max-w-[60ch] text-[14.5px] leading-relaxed text-ink-dim">{lead.excerpt}</p>
                  <span className="mt-auto flex items-center justify-between gap-4 pt-6 text-[13.5px] font-semibold text-ink">
                    Read the article
                    <span className="grid h-9 w-9 place-items-center rounded-full border border-[#0b0f19]/[0.1] transition-[background-color,border-color,color,transform] duration-300 group-hover:rotate-45 group-hover:border-[#0b0f19] group-hover:bg-[#0b0f19] group-hover:text-white">
                      <ArrowUpRight size={15} strokeWidth={2} aria-hidden />
                    </span>
                  </span>
                </div>
              </Link>
            </Reveal>

            {/* reading list */}
            {rest.length > 0 && (
              <Reveal delay={140} className="lg:col-span-5">
                <div className="flex h-full flex-col rounded-[28px] border border-hairline-light bg-white p-2.5">
                <p className="px-4 pb-2 pt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-faint sm:px-5">More articles</p>
                <ul className="flex flex-1 flex-col">
                  {rest.map((p, i) => (
                    <li key={p.slug} className={`flex-1 ${i > 0 ? "border-t border-hairline-light" : ""}`}>
                      <Link href={`/blog/${p.slug}`} className="group flex h-full items-center gap-4 rounded-[18px] px-2.5 py-4 transition-colors duration-300 hover:bg-[#f7f6fb] sm:gap-5 sm:px-3">
                        <div className="relative aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-[14px] bg-light-surface sm:w-28">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={p.image}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover transition-transform duration-500 ease-out-expo group-hover:scale-[1.06]"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <Meta post={p} />
                          <h3 className="mt-1.5 line-clamp-2 text-[15.5px] font-bold leading-snug tracking-tight text-ink transition-colors duration-300 group-hover:text-aurora-violet">
                            {p.title}
                          </h3>
                          <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-ink-dim max-sm:hidden">{p.excerpt}</p>
                        </div>
                        <ArrowUpRight
                          size={16}
                          strokeWidth={2}
                          aria-hidden
                          className="shrink-0 self-start text-ink-faint opacity-0 transition-[opacity,transform,color] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink group-hover:opacity-100 max-sm:hidden"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
                </div>
              </Reveal>
            )}
          </div>
        </div>
    </section>
  );
}
