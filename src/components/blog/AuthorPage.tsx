import Image from "next/image";
import { BookOpen, Globe } from "lucide-react";
import SiteShell from "@/components/system/SiteShell";
import Breadcrumbs from "@/components/system/Breadcrumbs";
import Reveal from "@/components/system/Reveal";
import HeroBackdrop from "@/components/system/HeroBackdrop";
import DotField from "@/components/sections/human-ai-flow/DotField";
import { SectionEyebrow, SectionTitle } from "@/components/system/SectionHeading";
import PostCard, { TopicLabel } from "@/components/blog/PostCard";
import BlogFinalCta from "@/components/blog/BlogFinalCta";
import AuthorReads from "@/components/blog/AuthorReads";
import { TEAM_NAME, type Author } from "@/lib/authors";
import type { BlogPost } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";
import JsonLd from "@/components/system/JsonLd";

const LINKEDIN_PATH =
  "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V21h-4V9Z";

/**
 * An author's page (/blog/author/[slug]): who they are (photo, role, bio,
 * links from CMS › Blog › Authors), what they write about (their topics),
 * how much they have written and how often it is read, then all their
 * articles, newest first.
 */
export default function AuthorPage({ author, posts }: { author: Author; posts: BlogPost[] }) {
  const isTeam = author.title === TEAM_NAME;
  const topics = [...new Set(posts.map((p) => p.topic))];
  const url = `${SITE_URL}/blog/author/${author.slug}`;

  const PROFILE_JSON_LD = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url,
    mainEntity: isTeam
      ? { "@type": "Organization", name: "CodeShaper", url: SITE_URL }
      : {
          "@type": "Person",
          name: author.title,
          jobTitle: author.role,
          description: author.bio,
          image: author.photo,
          sameAs: [author.linkedin, author.website].filter(Boolean),
          worksFor: { "@type": "Organization", name: "CodeShaper", url: SITE_URL },
        },
  };

  return (
    <SiteShell>
      <div className="theme-light">
        <JsonLd data={PROFILE_JSON_LD} />

        <div className="bg-gradient-to-b from-white from-30% to-light-surface px-3 pb-3 sm:px-4 sm:pb-4">
          <section className="page-hero theme-light relative isolate overflow-hidden rounded-b-[28px] bg-canvas px-6 pb-14 pt-32 sm:rounded-b-[32px] lg:px-10 lg:pb-16 lg:pt-36">
            <HeroBackdrop />
            <div className="relative mx-auto max-w-[1200px]">
              <div className="flex">
                <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: author.title }]} />
              </div>
              <Reveal>
                <div className="flex flex-col gap-7 sm:flex-row sm:items-center sm:gap-8">
                  <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full bg-white shadow-[0_18px_40px_-20px_rgba(79,70,229,0.55)] ring-4 ring-white sm:h-32 sm:w-32">
                    <Image
                      src={author.photo || "/brand/favicon.png"}
                      alt={author.title}
                      fill
                      sizes="128px"
                      priority
                      className={author.photo ? "object-cover" : "object-contain p-5"}
                    />
                  </div>
                  <div className="max-w-3xl">
                    <SectionEyebrow className="w-fit">Author</SectionEyebrow>
                    <SectionTitle as="h1" size="lg">
                      {author.title}
                    </SectionTitle>
                    {(author.role || isTeam) && (
                      <p className="mt-2 font-urbanist text-[16px] font-medium text-ink-dim">
                        {author.role ?? "Engineers, designers and strategists at CodeShaper"}
                      </p>
                    )}
                  </div>
                </div>
                {author.bio && <p className="mt-7 max-w-3xl font-urbanist text-[17px] leading-relaxed text-ink-dim">{author.bio}</p>}

                <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 font-urbanist text-[14px] text-ink-dim">
                  <li className="flex items-center gap-2">
                    <BookOpen size={15} strokeWidth={1.9} aria-hidden className="text-ink-faint" />
                    <span>
                      <b className="font-semibold text-ink">{posts.length}</b> {posts.length === 1 ? "article" : "articles"}
                    </span>
                  </li>
                  <AuthorReads slugs={posts.map((p) => p.slug)} />
                  {author.linkedin && (
                    <li>
                      <a href={author.linkedin} target="_blank" rel="noopener noreferrer me" className="inline-flex items-center gap-2 font-semibold text-ink transition-colors hover:text-[#0a66c2]">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                          <path d={LINKEDIN_PATH} />
                        </svg>
                        LinkedIn
                      </a>
                    </li>
                  )}
                  {author.website && (
                    <li>
                      <a href={author.website} target="_blank" rel="noopener noreferrer me" className="inline-flex items-center gap-2 font-semibold text-ink transition-colors hover:text-[#4f46e5]">
                        <Globe size={15} strokeWidth={1.9} aria-hidden />
                        Website
                      </a>
                    </li>
                  )}
                </ul>

                {topics.length > 0 && (
                  <div className="mt-6 flex flex-wrap items-center gap-2 font-urbanist text-[12.5px]">
                    <span className="mr-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-faint">Writes about</span>
                    {topics.map((t) => (
                      <TopicLabel key={t} topic={t} className="px-2.5! py-1.5!" />
                    ))}
                  </div>
                )}
              </Reveal>
            </div>
          </section>
        </div>

        <section aria-labelledby="author-posts" className="relative overflow-clip bg-light-surface py-14 lg:py-20">
          <DotField className="[mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]" />
          <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
            <h2 id="author-posts" className="font-urbanist text-[24px] font-bold tracking-[-0.015em] text-ink sm:text-[28px]">
              {isTeam ? "Articles by the team" : `Articles by ${author.title.split(" ")[0]}`}
            </h2>
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((p, i) => (
                <li key={p.slug}>
                  <Reveal delay={(i % 3) * 70} className="h-full">
                    <PostCard post={p} />
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <BlogFinalCta />
      </div>
    </SiteShell>
  );
}
