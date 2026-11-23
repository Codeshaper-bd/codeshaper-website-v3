"use client";

import { useEffect, useRef, useState } from "react";
import { SiEnvato, SiUpwork } from "react-icons/si";
import { RiOpenaiFill } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { ArrowUpRight, BadgeCheck, BarChart3, Briefcase, Globe2, MapPin, Rocket, Users, type LucideIcon } from "lucide-react";
import { SectionEyebrow, SectionTitle } from "@/components/system/SectionHeading";
import Reveal from "@/components/system/Reveal";
import GlassTen3D from "@/components/sections/glass/GlassTen3D";
import { homeCopy, type CopyOf } from "@/lib/homeCopy";

/**
 * Homepage › Our journey (CMS key `atAGlance`, position 3, white card).
 * Right after the client logos, it answers "who are you, and are you
 * established?". Two calm columns: the story and recognition pills on the
 * left; on the right an empty stage where a real-time glass "10" (three.js)
 * floats, refracting soft colour light. Below, the figures in one frosted
 * strip. Words, figures and badges come from the CMS (Pages › Home ›
 * Our journey); only real badges belong here.
 *
 * Semantic tokens; `theme-light` sits on the outer frame.
 */
type Stat = { value: string; label: string };
type Badge = { title: string; text?: string; href?: string };

/** The section's background: a soft lavender / sky / peach wash on white. */
const WASH =
  "radial-gradient(60% 70% at 0% 0%, rgba(199,192,255,0.38), transparent 70%), radial-gradient(50% 60% at 100% 20%, rgba(186,214,255,0.32), transparent 70%), radial-gradient(60% 60% at 70% 110%, rgba(255,214,196,0.32), transparent 70%), #ffffff";

const parse = (v: string) => {
  const m = /^(\d+)(.*)$/.exec(v.trim());
  return m ? { n: Number(m[1]), pad: m[1].length, suffix: m[2] } : null;
};

/** A small icon per figure, picked from its label (so the CMS needs no extra field). */
function statIcon(label: string): LucideIcon {
  const l = label.toLowerCase();
  if (/user|people|reach/.test(l)) return Users;
  if (/project/.test(l)) return Briefcase;
  if (/countr/.test(l)) return Globe2;
  if (/location|office|hub/.test(l)) return MapPin;
  if (/product|launch/.test(l)) return Rocket;
  return BarChart3;
}

/** Which recognised badge this is, from its words (so the CMS needs no extra field). */
type Kind = "clutch" | "openai" | "google" | "envato" | "upwork" | "other";
const kindOf = (b: Badge): Kind => {
  const t = `${b.title} ${b.text ?? ""}`.toLowerCase();
  if (t.includes("clutch")) return "clutch";
  if (t.includes("openai")) return "openai";
  if (t.includes("google")) return "google";
  if (t.includes("envato")) return "envato";
  if (t.includes("upwork")) return "upwork";
  return "other";
};
/** Review platforms get the five stars the owner's badges show. */
const STARRED: Kind[] = ["google", "envato"];

function BadgeVisual({ kind }: { kind: Kind }) {
  if (kind === "clutch")
    // the official Clutch award artwork supplied by the owner
    // eslint-disable-next-line @next/next/no-img-element
    return <img src="/media/badges/clutch-top-software-developers-auckland-2026.png" alt="" width={30} height={32} className="h-8 w-auto shrink-0" />;
  const icon =
    kind === "openai" ? <RiOpenaiFill size={16} className="text-[#0b0f19]" aria-hidden />
    : kind === "google" ? <FcGoogle size={16} aria-hidden />
    : kind === "envato" ? <SiEnvato size={14} className="text-[#81b441]" aria-hidden />
    : kind === "upwork" ? <SiUpwork size={14} className="text-[#14a800]" aria-hidden />
    : <BadgeCheck size={15} strokeWidth={2} className="text-brand" aria-hidden />;
  return <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border bg-white">{icon}</span>;
}

function TrustBadge({ b }: { b: Badge }) {
  const kind = kindOf(b);
  const proof = b.href?.startsWith("https://");
  const inner = (
    <>
      <BadgeVisual kind={kind} />
      <span className="min-w-0 flex-1 text-left">
        <span className="block whitespace-nowrap font-urbanist text-[13px] font-semibold leading-tight text-content">{b.title}</span>
        {(b.text || STARRED.includes(kind)) && (
          <span className="mt-0.5 flex items-center gap-x-1.5 whitespace-nowrap font-urbanist text-[11.5px] leading-tight text-content-muted">
            {STARRED.includes(kind) && (
              <span aria-label="Five stars" className="text-[10px] tracking-[0.04em] text-[#f5a524]">
                ★★★★★
              </span>
            )}
            {b.text}
          </span>
        )}
      </span>
      {proof && <ArrowUpRight size={15} strokeWidth={2} aria-hidden className="shrink-0 text-content-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />}
    </>
  );
  const cls = "group inline-flex items-center gap-2.5 rounded-full border border-border bg-white/80 py-1.5 pl-1.5 pr-4 shadow-[0_1px_2px_rgba(11,15,25,0.04)] backdrop-blur-sm";
  return proof ? (
    <a
      href={b.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${b.title}${b.text ? `, ${b.text}` : ""} (opens the source)`}
      className={`${cls} transition-[border-color,box-shadow] hover:border-border-strong hover:shadow-[0_10px_24px_-14px_rgba(11,15,25,0.3)]`}
    >
      {inner}
    </a>
  ) : (
    <span className={cls}>{inner}</span>
  );
}

/** The title; its leading figure ("10+ years…") stays in the title ink (owner: no gradient). */
function Title({ text }: { text: string }) {
  const m = /^(\d[\d,.]*\+?)(\s.*)$/.exec(text.trim());
  if (!m) return <>{text}</>;
  return (
    <>
      <span className="tabular-nums">{m[1]}</span>
      {m[2]}
    </>
  );
}

export default function AtAGlance({ copy }: { copy?: CopyOf<"atAGlance"> }) {
  const c = homeCopy("atAGlance", copy);
  const stats = (c.stats as Stat[]).filter((s) => s.value && s.label);
  const badges = ((c.badges ?? []) as Badge[]).filter((b) => b.title);
  const ref = useRef<HTMLDListElement>(null);
  const slot = useRef<HTMLDivElement>(null);
  const [t, setT] = useState(1);

  // count the figures up once, when they come into view
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    setT(0);
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const k = Math.min(1, (now - start) / 1300);
          setT(1 - Math.pow(1 - k, 3));
          if (k < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="theme-light bg-page p-frame sm:p-frame-lg">
      <section aria-labelledby="journey-heading" className="relative isolate overflow-hidden rounded-section py-section lg:py-section-lg" style={{ background: WASH }}>
        {/* the real-time glass "10" (three.js) and its light, drawn across the whole section;
            it places itself on the empty stage slot below. The CSS wash is the fallback. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
          <GlassTen3D value={c.years} slot={slot} />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
            {/* the story and the recognition */}
            <Reveal className="order-2 lg:order-1">
              <SectionEyebrow>{c.eyebrow}</SectionEyebrow>
              <SectionTitle id="journey-heading" className="max-w-[22ch] text-balance">
                <Title text={c.title} />
              </SectionTitle>
              {c.story && <p className="mt-6 max-w-[50ch] text-pretty font-urbanist text-[16px] leading-relaxed text-content-muted sm:text-[17px]">{c.story}</p>}
              {badges.length > 0 && (
                <ul className="mt-9 flex max-w-[560px] flex-wrap gap-2.5" aria-label="Recognition">
                  {badges.map((b) => (
                    <li key={b.title}>
                      <TrustBadge b={b} />
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>

            {/* the stage: kept empty; the glass "10" is drawn here by the layer above */}
            <div ref={slot} aria-hidden title="Drag to turn" className="order-1 aspect-[16/11] w-full select-none lg:order-2 lg:aspect-[1/1] lg:max-h-[540px]" />
          </div>

          {/* the figures: one open strip (no card, border or shadow: owner request); icon, figure and label per column, soft inset dividers */}
          {stats.length > 0 && (
            <Reveal delay={120}>
              <dl
                ref={ref}
                className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:mt-14 lg:grid-cols-5"
              >
                {stats.map((s, i) => {
                  const p = parse(s.value);
                  const shown = p ? `${String(Math.round(p.n * t)).padStart(p.pad, "0")}${p.suffix}` : s.value;
                  const Icon = statIcon(s.label);
                  return (
                    <div key={`${s.label}-${i}`} className="group relative flex flex-col px-6 py-7 lg:px-8 lg:py-9">
                      {/* inset divider: short, fading at both ends */}
                      {i > 0 && (
                        <span
                          aria-hidden
                          className="absolute bottom-7 left-0 top-7 w-px bg-gradient-to-b from-transparent via-[#0b0f19]/[0.08] to-transparent max-lg:hidden"
                        />
                      )}
                      <dt className="sr-only">{s.label}</dt>
                      {/* icon key: a small raised tile (hairline, top highlight, soft shadow); ink icon, brand on hover */}
                      <span
                        aria-hidden
                        className="grid h-10 w-10 place-items-center rounded-[12px] border border-[#0b0f19]/[0.07] bg-gradient-to-b from-white to-[#f3f2fa] text-[#0b0f19] shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_1px_2px_rgba(11,15,25,0.06),0_8px_18px_-10px_rgba(59,47,122,0.3)] transition-[transform,color,box-shadow] duration-300 ease-out group-hover:-translate-y-0.5 group-hover:text-[#4f46e5] group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_1px_2px_rgba(11,15,25,0.06),0_12px_24px_-10px_rgba(79,70,229,0.4)]"
                      >
                        <Icon size={17} strokeWidth={1.6} />
                      </span>
                      <dd className="mt-5 font-urbanist text-[34px] font-bold leading-none tracking-[-0.04em] text-content tabular-nums lg:text-[40px]">
                        <span aria-hidden>{shown}</span>
                        <span className="sr-only">{s.value}</span>
                      </dd>
                      <p aria-hidden className="mt-2 font-urbanist text-[13px] leading-snug text-content-muted">
                        {s.label}
                      </p>
                    </div>
                  );
                })}
              </dl>
            </Reveal>
          )}
        </div>
      </section>
    </div>
  );
}
