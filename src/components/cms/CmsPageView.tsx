import SiteShell from "@/components/system/SiteShell";
import Breadcrumbs from "@/components/system/Breadcrumbs";
import { SectionDescription, SectionEyebrow, SectionTitle } from "@/components/system/SectionHeading";
import RichContent from "@/components/cms/RichContent";
import type { CmsPage } from "@/lib/pages";

/** A page designed in the CMS. */
export default function CmsPageView({ page: p }: { page: CmsPage }) {
  const text = p.layout === "text";
  return (
    <SiteShell>
      <div className="theme-light bg-light-surface">
        {p.layout === "plain" ? (
          <h1 className="sr-only">{p.title}</h1>
        ) : (
          <div className="p-3 sm:p-4">
            <section className="relative overflow-hidden rounded-[32px] bg-canvas px-6 pb-16 pt-32 lg:px-10 lg:pb-20 lg:pt-32">
              <div aria-hidden className="absolute left-1/2 top-0 h-[420px] w-[640px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-30 blur-3xl" style={{ background: "radial-gradient(closest-side, rgba(124,108,255,0.3), transparent)" }} />
              <div className={`relative mx-auto max-w-3xl ${text ? "" : "text-center"}`}>
                <div className={text ? "" : "flex justify-center"}><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: p.title }]} /></div>
                {p.eyebrow && <SectionEyebrow className={text ? "mt-5 w-fit" : "mx-auto mt-5 w-fit"}>{p.eyebrow}</SectionEyebrow>}
                <SectionTitle as="h1" size="lg">{p.title}</SectionTitle>
                {p.intro && <SectionDescription className={text ? "mt-5" : "mx-auto mt-5 max-w-2xl"}>{p.intro}</SectionDescription>}
              </div>
            </section>
          </div>
        )}
        <div className={`mx-auto px-6 pb-20 lg:px-10 ${p.layout === "plain" ? "pt-32" : "pt-10"} ${text ? "max-w-3xl" : "max-w-5xl"}`}>
          <RichContent html={p.html} />
        </div>
      </div>
    </SiteShell>
  );
}
