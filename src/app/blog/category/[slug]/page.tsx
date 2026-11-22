import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostList from "@/components/blog/PostList";
import blog from "@/content/blog.json";
import { BLOG_POSTS } from "@/lib/blog";
import { withSeo, type Seo } from "@/lib/details";

type Term = { slug: string; title: string; parent?: string; description?: string; seo?: Seo };
const TERMS = blog.categories as Term[];

export const dynamicParams = false;
export const generateStaticParams = () => TERMS.map((t) => ({ slug: t.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const found = TERMS.find((x) => x.slug === slug);
  if (!found) return {};
  return withSeo({ title: `Category: ${found.title}`, description: found.description ?? `CodeShaper articles about ${found.title}.`, alternates: { canonical: `/blog/category/${found.slug}` } }, found.seo);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const term = TERMS.find((t) => t.slug === slug);
  if (!term) notFound();
  const children = TERMS.filter((t) => t.parent === slug).map((t) => t.slug);
  const posts = BLOG_POSTS.filter((p) => p.topicSlug === slug || children.includes(p.topicSlug ?? ""));
  return <PostList eyebrow="Category" title={term.title} description={term.description} posts={posts} />;
}
