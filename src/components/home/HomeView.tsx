import { Fragment } from "react";
import LazySection, { type SectionName } from "@/components/system/LazySection";
import SiteShell from "@/components/system/SiteShell";
import Hero from "@/components/hero/Hero";
import TrustStrip from "@/components/sections/TrustStrip";
import BlogLatest from "@/components/sections/BlogLatest";
import LetsTalk from "@/components/sections/LetsTalk";
import ProductsShowcase from "@/components/sections/ProductsShowcase";
import HomeBlock, { type Block } from "@/components/home/HomeBlock";
import type { CopyOf } from "@/lib/homeCopy";

/**
 * The homepage, from what the CMS says (Pages, Home): the hero first, then
 * the sections in the editor's order. Built-in sections keep their design
 * and take new words; added sections use one of the fixed designs in
 * HomeBlock. Below-the-fold built-ins load their code on approach.
 */
export type HomeItem = { key: string; copy?: Record<string, unknown> } | { key: "block"; id: string; block: Block };
export type HomeData = { hero?: CopyOf<"hero">; sections?: (HomeItem | string)[] };

const LAZY = ["atAGlance", "caseStudies", "servicesBento", "testimonials", "humanAiFlow", "industries", "techStack", "impactWorkflow", "engagementModels", "leadership", "aboutStudio", "faq"] satisfies SectionName[];
const isLazy = (s: string): s is SectionName => (LAZY as string[]).includes(s);
/** CMS live preview: after each reload, go to the section being edited (#edit-…), past the smooth scroller. */
const TO_EDITED = `(function(){var go=function(){var el=location.hash&&document.getElementById(location.hash.slice(1));if(!el)return;var y=el.getBoundingClientRect().top+window.scrollY-24;var l=window.__lenis;if(l)l.scrollTo(y,{immediate:true,force:true});else window.scrollTo(0,y);};var moved=false;["wheel","touchstart","keydown"].forEach(function(e){window.addEventListener(e,function(){moved=true;},{once:true,passive:true});});[0,300,900,2000,3500].forEach(function(t){setTimeout(function(){if(!moved)go();},t);});})();`;

/** The owner's order (23 Nov 2026), used when the CMS sends none: page background and white cards alternate. */
const ORIGINAL: HomeItem[] = ["trustStrip", "atAGlance", "caseStudies", "servicesBento", "products", "testimonials", "humanAiFlow", "industries", "techStack", "impactWorkflow", "engagementModels", "faq", "blogPosts", "letsTalk"].map((key) => ({ key }));

export default function HomeView({ data, preview = false }: { data: HomeData; preview?: boolean }) {
  const items = (data.sections ?? ORIGINAL).map((s) => (typeof s === "string" ? { key: s } : s));
  return (
    <SiteShell>
      {preview ? <div id="edit-hero"><Hero copy={data.hero} /></div> : <Hero copy={data.hero} />}
      {items.map((item) => {
        const id = "block" in item ? item.id : item.key;
        const view =
          "block" in item ? <HomeBlock block={item.block} id={`home-${item.id}`} />
          : item.key === "trustStrip" ? <TrustStrip copy={item.copy} />
          : item.key === "blogPosts" ? <BlogLatest copy={item.copy} />
          : item.key === "letsTalk" ? <LetsTalk copy={item.copy} />
          : item.key === "products" ? <ProductsShowcase copy={item.copy} />
          : isLazy(item.key) ? <LazySection name={item.key} props={item.copy ? { copy: item.copy } : undefined} rootMargin={preview ? "4000px 0px" : undefined} />
          : null;
        if (!view) return null;
        // eager sections far down the page: the browser skips their rendering work until they come near
        if (!preview && (item.key === "products" || item.key === "blogPosts")) {
          return <div key={id} style={{ contentVisibility: "auto", containIntrinsicSize: "auto 1100px" }}>{view}</div>;
        }
        return preview ? <div key={id} id={`edit-${id}`}>{view}</div> : <Fragment key={id}>{view}</Fragment>;
      })}
      {preview && <script dangerouslySetInnerHTML={{ __html: TO_EDITED }} />}
    </SiteShell>
  );
}
