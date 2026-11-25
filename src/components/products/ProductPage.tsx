import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import SiteShell from "@/components/system/SiteShell";
import Breadcrumbs from "@/components/system/Breadcrumbs";
import Reveal from "@/components/system/Reveal";
import { SectionDescription, SectionEyebrow, SectionTitle } from "@/components/system/SectionHeading";
import { BookCallCta, JsonLd, ServicesSection, breadcrumbJsonLd } from "@/components/services/ServicePageParts";
import DetailSections from "@/components/cms/DetailSections";
import ProductCard from "@/components/products/ProductCard";
import { Icon } from "@/lib/icons";
import { STAGE, getProduct, productCard, type Product } from "@/lib/products";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export default function ProductPage({ product: p }: { product: Product }) {
  const crumbs = [{ label: "Home", href: "/" }, { label: "Products", href: "/products" }, { label: p.title, href: `/products/${p.slug}` }];
  const demo = p.links?.demo;
  const related = (p.related ?? []).flatMap((s) => getProduct(s) ?? []);
  const plans = p.pricing?.mode === "plans" ? p.pricing.plans ?? [] : [];
  const main = { label: p.cta?.label ?? (p.stage === "soon" ? "Get early access" : "Book a demo"), href: p.cta?.href ?? "/contact" };
  return (
    <SiteShell>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "SoftwareApplication", name: p.title, description: p.summary, url: `${SITE_URL}/products/${p.slug}`, applicationCategory: p.category ?? "BusinessApplication", operatingSystem: p.platforms?.join(", ") ?? "Web", publisher: { "@type": "Organization", name: SITE_NAME } }} />
      <div className="theme-light">
        {/* like every page hero: white at the top so the frame blends with the header, rounded only at the bottom */}
        <div className="bg-gradient-to-b from-white from-30% to-light-surface px-3 pb-3 sm:px-4 sm:pb-4">
          <section className="relative overflow-hidden rounded-b-[28px] bg-canvas sm:rounded-b-[32px] px-6 pb-14 pt-32 lg:px-10 lg:pb-16 lg:pt-32">
            <div aria-hidden className="absolute left-1/2 top-0 h-[460px] w-[760px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-40 blur-3xl" style={{ background: `radial-gradient(closest-side, ${p.accent ?? "#7c6cff"}33, transparent)` }} />
            <div className="relative mx-auto max-w-3xl text-center">
              <div className="flex justify-center"><Breadcrumbs items={[crumbs[0], crumbs[1], { label: p.title }]} /></div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {p.logo && <img src={p.logo} alt="" className="mx-auto mt-6 h-14 w-auto" />}
              <SectionEyebrow className="mx-auto mt-5 w-fit">{[STAGE[p.stage], p.category].filter(Boolean).join(" · ")}</SectionEyebrow>
              <SectionTitle as="h1" size="lg">{p.title}</SectionTitle>
              <p className="mt-4 font-urbanist text-xl font-semibold text-ink">{p.tagline}</p>
              <SectionDescription className="mx-auto mt-4 max-w-2xl">{p.summary}</SectionDescription>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link href={main.href} className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 font-urbanist text-sm font-semibold text-canvas transition-transform duration-300 hover:scale-[1.02]">{main.label}<ArrowRight size={15} strokeWidth={1.75} /></Link>
                {demo && <a href={demo} rel="noopener" className="inline-flex items-center rounded-full border border-hairline-light px-7 py-3.5 font-urbanist text-sm font-semibold text-ink-dim transition-colors hover:text-ink">Open the live demo</a>}
              </div>
              {p.pricing?.mode === "from" && p.pricing.from && <p className="mt-5 font-urbanist text-[14px] text-ink-dim">From <b className="text-ink">{p.pricing.from}</b></p>}
              {p.pricing?.mode === "free" && <p className="mt-5 font-urbanist text-[14px] font-semibold text-ink">Free</p>}
              {p.platforms && <ul className="mt-6 flex flex-wrap justify-center gap-2">{p.platforms.map((t) => <li key={t} className="rounded-full border border-hairline-light px-3 py-1 font-urbanist text-[12.5px] text-ink-faint">{t}</li>)}</ul>}
            </div>
            <Reveal className="relative mx-auto mt-12 max-w-5xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image} alt={p.imageAlt ?? ""} className="w-full rounded-3xl shadow-[0_50px_100px_-50px_rgba(45,38,120,0.5)]" />
            </Reveal>
          </section>
        </div>

        {p.features && (
          <ServicesSection id="features" first label="Features" title={`What ${p.title} does.`}>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {p.features.map((f, i) => (
                <Reveal key={f.title} delay={(i % 3) * 70}>
                  <div className="h-full overflow-hidden rounded-2xl border border-hairline-light bg-light-raised">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {f.image && <img src={f.image} alt="" loading="lazy" className="aspect-[16/10] w-full object-cover" />}
                    <div className="p-6">
                      {!f.image && <span className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline-light text-aurora-violet"><Icon name={f.icon} size={17} /></span>}
                      <h3 className="mt-4 font-urbanist text-[15.5px] font-bold text-ink">{f.title}</h3>
                      {f.description && <p className="mt-2 font-urbanist text-[13.5px] leading-relaxed text-ink-dim">{f.description}</p>}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </ServicesSection>
        )}

        <DetailSections detail={{ stats: p.stats, outcomes: p.benefits, goodFit: p.for, useCases: p.useCases, process: p.process, gallery: p.screens, video: p.video, html: p.html, integrations: p.integrations?.map((x) => x.title), guardrails: p.requirements, reviews: p.reviews, caseStudies: p.caseStudies }} name={p.title} first={!p.features} />

        {plans.length > 0 && (
          <ServicesSection id="pricing" label="Pricing" title="Plans." description={p.pricing?.note}>
            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {plans.map((x) => (
                <div key={x.title} className={`flex flex-col rounded-3xl border p-7 ${x.highlight ? "border-aurora-violet bg-aurora-violet/[0.06]" : "border-hairline-light bg-light-raised"}`}>
                  <h3 className="font-urbanist text-lg font-bold text-ink">{x.title}</h3>
                  <p className="mt-3 font-urbanist text-4xl font-bold tracking-tight text-ink">{x.price}{x.period && <span className="ml-1.5 text-[15px] font-medium tracking-normal text-ink-faint">{x.period}</span>}</p>
                  <ul className="mt-6 flex-1 space-y-3">{(x.features ?? []).map((t) => <li key={t} className="flex gap-2.5 font-urbanist text-[14.5px] text-ink-dim"><Check size={16} className="mt-0.5 shrink-0 text-aurora-violet" />{t}</li>)}</ul>
                  <Link href={x.href ?? "/contact"} className={`mt-7 rounded-full px-6 py-3 text-center font-urbanist text-sm font-semibold ${x.highlight ? "bg-ink text-canvas" : "border border-hairline-light text-ink"}`}>{x.button ?? "Choose"}</Link>
                </div>
              ))}
            </div>
          </ServicesSection>
        )}

        {p.changelog && (
          <ServicesSection id="whats-new" label="What is new" title="Latest changes.">
            <ol className="mt-8 space-y-6 border-l border-hairline-light pl-6">{p.changelog.map((c) => <li key={c.title}>{c.date && <time className="font-urbanist text-[13px] text-ink-faint">{new Date(c.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time>}<h3 className="font-urbanist text-[16px] font-bold text-ink">{c.title}</h3>{c.text && <p className="mt-1 whitespace-pre-line font-urbanist text-[14px] text-ink-dim">{c.text}</p>}</li>)}</ol>
          </ServicesSection>
        )}
        <DetailSections detail={{ faqs: p.faqs }} name={p.title} />
        {related.length > 0 && <ServicesSection id="more-products" label="Products" title="You may also like."><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{related.map((x) => <ProductCard key={x.slug} card={productCard(x)} />)}</div></ServicesSection>}
        <BookCallCta title={p.cta?.title ?? `See ${p.title} in action.`} description="Tell us how you work today. We will show you how it would look for you." secondary={{ label: "All products", href: "/products" }} />
      </div>
    </SiteShell>
  );
}
