import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogArticle from "@/components/blog/BlogArticle";
import { BLOG_POSTS, getPostBySlug } from "@/lib/blog";
import { postDetail, withSeo } from "@/lib/details";

export const dynamicParams = false;

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return withSeo({ title: post.title, description: post.excerpt, alternates: { canonical: `/blog/${post.slug}` }, openGraph: { type: "article", images: [post.image] } }, postDetail(slug).seo);
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPostBySlug((await params).slug);
  if (!post) notFound();
  return <BlogArticle post={post} />;
}
