import { createHmac } from "node:crypto";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { withFilm } from "@/lib/caseStudies";
import { safeEqual, signingKeys, tokenFor } from "@/lib/credentials.mjs";
import { toSite } from "../../../../../scripts/cms/transform.mjs";
import BlogArticle from "@/components/blog/BlogArticle";
import CaseStudyArticle from "@/components/case-studies/CaseStudyArticle";
import CmsPageView from "@/components/cms/CmsPageView";
import HomeView from "@/components/home/HomeView";
import EngagementModelPage from "@/components/engagement/EngagementModelPage";
import IndustryPage from "@/components/industries/IndustryPage";
import ProductPage from "@/components/products/ProductPage";
import ServiceDetailPage from "@/components/services/ServiceDetailPage";
import ServiceGroupPage from "@/components/services/ServiceGroupPage";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Preview", robots: { index: false, follow: false } };

/* eslint-disable @typescript-eslint/no-explicit-any */
type Props = { params: Promise<{ type: string; id: string }>; searchParams: Promise<{ until?: string; sign?: string; draft?: string }> };

function valid(type: string, id: string, until: string, sign: string) {
  if (!/^\d+$/.test(id) || !/^\d+$/.test(until) || Number(until) * 1000 < Date.now()) return false;
  // the signing key only, never a request token; during a key change either key is accepted
  return signingKeys().some((key) => safeEqual(createHmac("sha256", key).update(`preview|${type}|${id}|${until}`).digest("hex"), sign));
}

/** One draft from the CMS in the real design. The link comes from the CMS and works for one hour. */
export default async function PreviewPage({ params, searchParams }: Props) {
  const { type, id } = await params;
  const { until = "", sign = "", draft = "" } = await searchParams;
  if (!valid(type, id, until, sign)) notFound();

  const r = await fetch(`${process.env.CMS_URL}/api/intake/content?preview=${type}:${id}${/^[A-Za-z0-9]{40}$/.test(draft) ? `&draft=${draft}` : ""}`, { headers: { Authorization: `Bearer ${tokenFor("preview")}`, Accept: "application/json" }, cache: "no-store" });
  if (!r.ok) notFound();
  const raw = await r.json();
  const missing: string[] = [];
  const site = toSite(raw, (m) => missing.push(m));
  const slug: string = raw.preview.slug;
  const has = (list: any[]) => list.find((x) => x.slug === slug);

  let view = null;
  if (type === "posts") view = has(site.posts) && <BlogArticle post={has(site.posts)} detail={site.details.posts[slug]} />;
  if (type === "case_studies") view = has(site.caseStudies) && <CaseStudyArticle story={withFilm(has(site.caseStudies))} detail={site.details.caseStudies[slug]} />;
  if (type === "services") view = has(site.services.services) ? <ServiceDetailPage service={has(site.services.services)} detail={site.details.services[slug]} /> : has(site.services.groups) && <ServiceGroupPage group={has(site.services.groups)} detail={site.details.services[slug]} />;
  if (type === "industries") { const i = site.industries.find((x: any) => x.href === `/industries/${slug}`); view = i && <IndustryPage industry={i} detail={site.details.industries[slug]} />; }
  if (type === "engagement_models") { const path = raw.engagement_models.find((x: any) => x.slug === slug)?.path; const m = site.services.models.find((x: any) => x.href === path); view = m && <EngagementModelPage model={m} detail={site.details.models[slug]} />; }
  if (type === "products") view = has(site.products) && <ProductPage product={has(site.products)} />;
  if (type === "pages") {
    // the homepage, with what is typed in the CMS (live preview)
    if (raw.pages.find((x: any) => x.id === Number(id))?.system === "home") return <HomeView data={site.mainPages.home} preview />;
    const p = site.pages.find((x: any) => x.path === `/${slug}`); view = p && <CmsPageView page={p} />;
  }

  return (
    <>
      <div className="fixed bottom-4 left-1/2 z-[90] -translate-x-1/2 rounded-full bg-[#17142e] px-5 py-2.5 font-urbanist text-[13px] font-semibold text-white shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)]">Preview: visitors cannot see this yet</div>
      {view || (
        <main className="grid min-h-svh place-items-center bg-white p-8 text-center font-urbanist text-[#1d1b33]">
          <div className="max-w-md"><h1 className="text-2xl font-bold">Not enough to preview yet</h1><p className="mt-3 text-[#5d5a75]">Fill in what is listed under “Before publishing” in the CMS, then try again.</p>{missing.filter((m) => m.includes("not complete") || m.includes("no ")).slice(0, 3).map((m) => <p key={m} className="mt-2 text-sm text-[#8a87a3]">{m}</p>)}</div>
        </main>
      )}
    </>
  );
}
