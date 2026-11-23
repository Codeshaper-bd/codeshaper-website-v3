import type { Metadata } from "next";
import Link from "next/link";
import SiteShell from "@/components/system/SiteShell";
import Breadcrumbs from "@/components/system/Breadcrumbs";
import { SectionEyebrow, SectionTitle } from "@/components/system/SectionHeading";
import { INDUSTRIES } from "@/lib/navigation";
import { SERVICE_GROUPS, ENGAGEMENT_MODELS, servicePath, servicesInGroup } from "@/data/services";
import { CASE_STUDIES } from "@/lib/caseStudies";
import { PRODUCTS } from "@/lib/products";
import { BLOG_POSTS } from "@/lib/blog";
import HeroBackdrop from "@/components/system/HeroBackdrop";

/**
 * Human sitemap (/site-map): every real page, grouped, from the same data the
 * menus and /sitemap.xml use, so it can't list a page that doesn't exist.
 */
export const metadata: Metadata = {
  title: "Sitemap",
  description: "Every page on the CodeShaper website, in one place.",
  alternates: { canonical: "/site-map" },
};

type Item = { label: string; href: string };
const link = "font-urbanist text-[14px] text-ink-dim transition-colors hover:text-ink";

function Group({ title, items, href }: { title: string; items: Item[]; href?: string }) {
  if (!items.length) return null;
  return (
    <section>
      <h2 className="font-urbanist text-[12px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
        {href ? <Link href={href} className="hover:text-ink">{title}</Link> : title}
      </h2>
      <ul className="mt-4 space-y-2">
        {items.map((i) => (
          <li key={i.href}><Link href={i.href} className={link}>{i.label}</Link></li>
        ))}
      </ul>
    </section>
  );
}

export default function SiteMapPage() {
  const posts = [...BLOG_POSTS].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <SiteShell>
      <div className="bg-gradient-to-b from-white from-30% to-light-surface px-3 pb-3 sm:px-4 sm:pb-4">
        <section className="page-hero theme-light relative isolate overflow-hidden rounded-b-[28px] sm:rounded-b-[32px] bg-canvas pb-16 pt-32 lg:pb-24 lg:pt-36">
          <HeroBackdrop />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Sitemap" }]} />
            <SectionEyebrow>Sitemap</SectionEyebrow>
            <SectionTitle as="h1">Every page, in one place.</SectionTitle>
          </div>
        </section>
      </div>
      {/* the list: a white card on the page background */}
      <div className="bg-light-surface px-3 pb-3 sm:px-4 sm:pb-4">
        <section className="theme-light rounded-[28px] bg-canvas py-14 sm:rounded-[32px] lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
            <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              <Group
                title="Company"
                items={[
                  { label: "Home", href: "/" },
                  { label: "About", href: "/company/about" },
                  { label: "Contact", href: "/contact" },
                  { label: "Privacy policy", href: "/legal/privacy" },
                  { label: "Terms of service", href: "/legal/terms" },
                ]}
              />
              {SERVICE_GROUPS.map((g) => (
                <Group key={g.slug} title={g.name} href={servicePath(g.slug)} items={servicesInGroup(g.slug).map((s) => ({ label: s.menuLabel ?? s.title, href: servicePath(s.slug) }))} />
              ))}
              <Group title="Engagement models" href="/engagement" items={ENGAGEMENT_MODELS.map((m) => ({ label: m.label, href: m.href }))} />
              <Group title="Industries" href="/industries" items={INDUSTRIES.map((i) => ({ label: i.label, href: i.href }))} />
              <Group title="Case studies" href="/case-studies" items={CASE_STUDIES.map((c) => ({ label: c.project, href: `/case-studies/${c.slug}` }))} />
              <Group title="Products" href="/products" items={PRODUCTS.filter((p) => p.stage !== "retired").map((p) => ({ label: p.title, href: `/products/${p.slug}` }))} />
              <Group title="Blog" href="/blog" items={posts.map((p) => ({ label: p.title, href: `/blog/${p.slug}` }))} />
            </div>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
