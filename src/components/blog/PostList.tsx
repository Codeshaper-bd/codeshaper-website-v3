import SiteShell from "@/components/system/SiteShell";
import Breadcrumbs from "@/components/system/Breadcrumbs";
import Reveal from "@/components/system/Reveal";
import { SectionDescription, SectionEyebrow, SectionTitle } from "@/components/system/SectionHeading";
import PostCard from "@/components/blog/PostCard";
import BlogFinalCta from "@/components/blog/BlogFinalCta";
import type { BlogPost } from "@/lib/blog";

/** Articles in one category or with one tag. */
export default function PostList({ eyebrow, title, description, posts }: { eyebrow: string; title: string; description?: string; posts: BlogPost[] }) {
  return (
    <SiteShell>
      <div className="theme-light">
        <div className="bg-light-surface p-3 sm:p-4">
          <section className="rounded-[32px] bg-canvas px-6 pb-16 pt-32 text-center lg:px-10 lg:pb-20 lg:pt-32">
            <div className="flex justify-center"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: title }]} /></div>
            <SectionEyebrow className="mx-auto mt-5 w-fit">{eyebrow}</SectionEyebrow>
            <SectionTitle as="h1" size="lg">{title}</SectionTitle>
            {description && <SectionDescription className="mx-auto mt-5 max-w-2xl">{description}</SectionDescription>}
          </section>
        </div>
        <div className="bg-light-surface">
          <div className="mx-auto grid max-w-7xl gap-5 px-6 py-12 sm:grid-cols-2 lg:grid-cols-3 lg:px-10 lg:py-16">
            {posts.map((p, i) => <Reveal key={p.slug} delay={(i % 3) * 70}><PostCard post={p} /></Reveal>)}
          </div>
        </div>
        <BlogFinalCta />
      </div>
    </SiteShell>
  );
}
