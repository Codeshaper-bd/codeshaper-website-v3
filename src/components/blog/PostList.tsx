import SiteShell from "@/components/system/SiteShell";
import Breadcrumbs from "@/components/system/Breadcrumbs";
import Reveal from "@/components/system/Reveal";
import HeroBackdrop from "@/components/system/HeroBackdrop";
import DotField from "@/components/sections/human-ai-flow/DotField";
import { SectionDescription, SectionEyebrow, SectionTitle } from "@/components/system/SectionHeading";
import PostCard from "@/components/blog/PostCard";
import BlogFinalCta from "@/components/blog/BlogFinalCta";
import type { BlogPost } from "@/lib/blog";

/** Articles in one category or with one tag: the shared page hero, then the same cards as the blog index. */
export default function PostList({ eyebrow, title, description, posts }: { eyebrow: string; title: string; description?: string; posts: BlogPost[] }) {
  return (
    <SiteShell>
      <div className="theme-light">
        <div className="bg-gradient-to-b from-white from-30% to-light-surface px-3 pb-3 sm:px-4 sm:pb-4">
          <section className="page-hero theme-light relative isolate overflow-hidden rounded-b-[28px] bg-canvas px-6 pb-14 pt-32 sm:rounded-b-[32px] lg:px-10 lg:pb-16 lg:pt-36">
            <HeroBackdrop />
            <div className="relative mx-auto max-w-[1200px] [&>*]:max-w-3xl">
              <div className="flex">
                <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: title }]} />
              </div>
              <SectionEyebrow className="w-fit">{eyebrow}</SectionEyebrow>
              <SectionTitle as="h1" size="lg">{title}</SectionTitle>
              {description && <SectionDescription className="mt-5 max-w-2xl">{description}</SectionDescription>}
              <p className="mt-6 font-urbanist text-[13px] font-medium text-ink-dim">
                {posts.length} {posts.length === 1 ? "article" : "articles"}
              </p>
            </div>
          </section>
        </div>
        <section className="relative overflow-clip bg-light-surface py-14 lg:py-20">
          <DotField className="[mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]" />
          <ul className="relative mx-auto grid max-w-7xl gap-5 px-6 sm:grid-cols-2 lg:grid-cols-3 lg:px-10">
            {posts.map((p, i) => (
              <li key={p.slug}>
                <Reveal delay={(i % 3) * 70} className="h-full">
                  <PostCard post={p} />
                </Reveal>
              </li>
            ))}
          </ul>
        </section>
        <BlogFinalCta />
      </div>
    </SiteShell>
  );
}
