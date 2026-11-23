import Link from "next/link";
import { ArrowRight, BarChart3, Clock, Code2, Globe2, HeartHandshake, Layers, Rocket, ShieldCheck, Sparkles, Target, Users, Zap, type LucideIcon } from "lucide-react";
import { SectionEyebrow, SectionTitle, SectionDescription } from "@/components/system/SectionHeading";
import Reveal from "@/components/system/Reveal";
import FaqAccordion from "@/components/system/FaqAccordion";
import RichContent from "@/components/cms/RichContent";
import { videoEmbed } from "@/lib/details";

/**
 * Sections added in the CMS (Pages, Home, "Add section"). Each type has one
 * fixed design that matches the rest of the site: editors choose the words,
 * pictures and links, never colours or fonts.
 */
type Pic = { url: string; alt?: string; width?: number; height?: number };
type Button = { label: string; href: string };
export type Block =
  | { type: "textImage"; eyebrow?: string; title: string; text?: string; image?: Pic; side?: "left" | "right"; button?: Button }
  | { type: "cta"; title: string; text?: string; button: Button; second?: Button }
  | { type: "stats"; eyebrow?: string; title?: string; items: { value: string; label: string }[] }
  | { type: "cards"; eyebrow?: string; title: string; intro?: string; items: { icon?: string; title: string; text?: string }[] }
  | { type: "logos"; title?: string; logos: (Pic & { href?: string })[] }
  | { type: "video"; eyebrow?: string; title?: string; text?: string; video?: { url: string; poster?: string }; link?: string }
  | { type: "faq"; title: string; intro?: string; items: { q: string; a: string }[] }
  | { type: "text"; eyebrow?: string; title?: string; html: string };

export const ICONS: Record<string, LucideIcon> = {
  sparkles: Sparkles, rocket: Rocket, shield: ShieldCheck, zap: Zap, users: Users, clock: Clock,
  layers: Layers, globe: Globe2, code: Code2, chart: BarChart3, heart: HeartHandshake, target: Target,
};

const COLS: Record<number, string> = { 1: "lg:grid-cols-1", 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4" };
const WRAP = "mx-auto max-w-7xl px-6 lg:px-10";
const SECTION = "theme-light relative bg-light-surface py-16 font-urbanist lg:py-24";
const external = (href: string) => /^https?:\/\//.test(href);

function Btn({ b, dark = false, ghost = false }: { b: Button; dark?: boolean; ghost?: boolean }) {
  const cls = ghost
    ? `border ${dark ? "border-white/25 text-white hover:bg-white/10" : "border-hairline text-ink hover:bg-black/[0.03]"}`
    : dark ? "bg-white text-ink hover:scale-[1.03]" : "bg-aurora-violet text-white hover:scale-[1.02] hover:bg-aurora-violet-dark";
  const props = external(b.href) ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <Link href={b.href} {...props} className={`inline-flex w-fit items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold transition-[background-color,transform] duration-300 ${cls}`}>
      {b.label}
      {!ghost && <ArrowRight size={14} strokeWidth={1.75} aria-hidden />}
    </Link>
  );
}

function Head({ id, eyebrow, title, intro, center = false }: { id: string; eyebrow?: string; title?: string; intro?: string; center?: boolean }) {
  if (!eyebrow && !title && !intro) return null;
  return (
    <Reveal>
      <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
        {eyebrow && <SectionEyebrow className={center ? "mx-auto" : ""}>{eyebrow}</SectionEyebrow>}
        {title && <SectionTitle id={id} className="text-balance">{title}</SectionTitle>}
        {intro && <SectionDescription className="mt-4">{intro}</SectionDescription>}
      </div>
    </Reveal>
  );
}

function Picture({ pic, className = "" }: { pic: Pic; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={pic.url} alt={pic.alt ?? ""} width={pic.width} height={pic.height} loading="lazy" decoding="async" className={className} />;
}

export default function HomeBlock({ block, id }: { block: Block; id: string }) {
  const h = `${id}-heading`;
  switch (block.type) {
    case "textImage": {
      const right = block.side !== "left";
      return (
        <section className={SECTION} aria-labelledby={h}>
          <div className={`${WRAP} grid items-center gap-10 lg:grid-cols-2 lg:gap-16`}>
            <Reveal className={right ? "" : "lg:order-2"}>
              {block.eyebrow && <SectionEyebrow>{block.eyebrow}</SectionEyebrow>}
              <SectionTitle id={h} className="max-w-[18ch] text-balance">{block.title}</SectionTitle>
              {block.text && <SectionDescription className="mt-5 max-w-lg whitespace-pre-line">{block.text}</SectionDescription>}
              {block.button && <div className="mt-8"><Btn b={block.button} /></div>}
            </Reveal>
            {block.image && (
              <Reveal delay={100} className={right ? "" : "lg:order-1"}>
                <Picture pic={block.image} className="aspect-[4/3] w-full rounded-[28px] border border-hairline object-cover shadow-[0_30px_60px_-30px_rgba(11,15,25,0.35)]" />
              </Reveal>
            )}
          </div>
        </section>
      );
    }
    case "cta":
      return (
        <section className="theme-light bg-light-surface px-4 py-12 font-urbanist sm:px-6 lg:py-16" aria-labelledby={h}>
          <Reveal>
            <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] bg-ink px-6 py-14 text-center sm:px-12 lg:py-20">
              <div aria-hidden className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[640px] -translate-x-1/2 rounded-full bg-aurora-violet/40 blur-[90px]" />
              <h2 id={h} className="relative mx-auto max-w-[22ch] text-balance text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">{block.title}</h2>
              {block.text && <p className="relative mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-white/60">{block.text}</p>}
              <div className="relative mt-8 flex flex-wrap justify-center gap-3">
                <Btn b={block.button} dark />
                {block.second && <Btn b={block.second} dark ghost />}
              </div>
            </div>
          </Reveal>
        </section>
      );
    case "stats":
      return (
        <section className={SECTION} aria-labelledby={block.title ? h : undefined}>
          <div className={WRAP}>
            <Head id={h} eyebrow={block.eyebrow} title={block.title} center />
            <Reveal delay={80}>
              <dl className={`grid grid-cols-2 border-y border-hairline ${COLS[Math.min(block.items.length, 4)]} ${block.title || block.eyebrow ? "mt-12" : ""}`}>
                {block.items.map((s, i) => (
                  <div key={i} className={`px-4 py-8 text-center ${i > 0 ? "lg:border-l lg:border-hairline" : ""}`}>
                    <dt className="sr-only">{s.label}</dt>
                    <dd className="text-4xl font-bold tracking-tight text-ink sm:text-5xl">{s.value}</dd>
                    <dd className="mt-2 text-[13px] text-ink-dim">{s.label}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </section>
      );
    case "cards":
      return (
        <section className={SECTION} aria-labelledby={h}>
          <div className={WRAP}>
            <Head id={h} eyebrow={block.eyebrow} title={block.title} intro={block.intro} />
            <ul className={`mt-12 grid gap-4 sm:grid-cols-2 ${block.items.length % 3 === 0 ? "lg:grid-cols-3" : block.items.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-2"}`}>
              {block.items.map((c, i) => {
                const Icon = ICONS[c.icon ?? ""] ?? Sparkles;
                return (
                  <li key={i}>
                    <Reveal delay={60 * i} className="h-full">
                      <div className="h-full rounded-[24px] border border-hairline bg-white p-6 shadow-[0_1px_2px_rgba(11,15,25,0.04)] transition-shadow duration-300 hover:shadow-[0_20px_40px_-24px_rgba(11,15,25,0.3)]">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-aurora-violet/10 text-aurora-violet"><Icon size={19} strokeWidth={1.8} aria-hidden /></span>
                        <h3 className="mt-5 text-[16px] font-bold leading-snug text-ink">{c.title}</h3>
                        {c.text && <p className="mt-2 text-[14px] leading-relaxed text-ink-dim">{c.text}</p>}
                      </div>
                    </Reveal>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      );
    case "logos":
      return (
        <section className="theme-light bg-light-surface py-14 font-urbanist lg:py-20" aria-labelledby={block.title ? h : undefined}>
          <div className={WRAP}>
            {block.title && <h2 id={h} className="text-center text-[13px] font-semibold uppercase tracking-[0.2em] text-ink-faint">{block.title}</h2>}
            <Reveal delay={60}>
              <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
                {block.logos.map((l, i) => {
                  const img = <Picture pic={l} className="h-9 w-auto max-w-[150px] object-contain opacity-70 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0" />;
                  return <li key={i}>{l.href ? <a href={l.href} target="_blank" rel="noopener noreferrer" aria-label={l.alt}>{img}</a> : img}</li>;
                })}
              </ul>
            </Reveal>
          </div>
        </section>
      );
    case "video": {
      const embed = block.link ? videoEmbed(block.link) : null;
      return (
        <section className={SECTION} aria-labelledby={block.title ? h : undefined}>
          <div className={WRAP}>
            <Head id={h} eyebrow={block.eyebrow} title={block.title} intro={block.text} center />
            <Reveal delay={80}>
              <div className={`mx-auto max-w-5xl overflow-hidden rounded-[28px] border border-hairline bg-ink shadow-[0_40px_80px_-40px_rgba(11,15,25,0.45)] ${block.title || block.eyebrow ? "mt-12" : ""}`}>
                {block.video ? (
                  <video src={block.video.url} poster={block.video.poster} controls playsInline preload="metadata" className="aspect-video w-full" />
                ) : embed ? (
                  <iframe src={embed} title={block.title ?? "Video"} loading="lazy" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen className="aspect-video w-full" />
                ) : null}
              </div>
            </Reveal>
          </div>
        </section>
      );
    }
    case "faq":
      // the accordion takes its colours from the light theme around it
      return <div className="theme-light bg-light-surface"><FaqAccordion id={h} title={block.title} items={block.items} description={block.intro} spaced /></div>;
    case "text":
      return (
        <section className={SECTION} aria-labelledby={block.title ? h : undefined}>
          <div className="mx-auto max-w-3xl px-6">
            <Head id={h} eyebrow={block.eyebrow} title={block.title} />
            <RichContent html={block.html} narrow className={block.title ? "mt-8" : ""} />
          </div>
        </section>
      );
  }
}
