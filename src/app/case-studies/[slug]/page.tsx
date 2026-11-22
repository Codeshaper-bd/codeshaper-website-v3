import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CaseStudyArticle from "@/components/case-studies/CaseStudyArticle";
import { CASE_STUDIES, getCaseStudyBySlug } from "@/lib/caseStudies";
import { storyDetail, withSeo } from "@/lib/details";

export const dynamicParams = false;

export function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const story = getCaseStudyBySlug(slug);
  if (!story) return {};
  return withSeo({ title: `${story.project} Case Study`, description: story.summary, alternates: { canonical: `/case-studies/${story.slug}` }, openGraph: { type: "article", images: [story.image] } }, storyDetail(slug).seo);
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const story = getCaseStudyBySlug((await params).slug);
  if (!story) notFound();
  return <CaseStudyArticle story={story} />;
}
