"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarClock, Check, ChevronDown } from "lucide-react";
import { briefToText, hasBrief, type BriefFields, type Component } from "@/lib/ai/contract";
import { briefSummary } from "@/lib/ai/present";
// types only: founders.ts reads server-only content, so the people come in as data
import type { Founder } from "@/lib/founders";
import { Icon } from "@/lib/icons";
import { modelItem, serviceItem, studyItem, type CatalogItem } from "./catalog";

/**
 * The closed set of things an answer may show, drawn as quiet editorial lists rather than tiles.
 * Each is drawn from checked data and the website's own content; text from the assistant is only
 * ever placed as text. Few at first, more on request, so the next question stays in view.
 */
export const PRIMARY = "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-content px-5 font-urbanist text-[14px] font-semibold text-surface transition-colors hover:bg-[#262b3a] disabled:cursor-not-allowed disabled:opacity-40";
export const OUTLINE = "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border-strong bg-surface px-5 font-urbanist text-[14px] font-semibold text-content transition-colors hover:bg-surface-soft disabled:cursor-not-allowed disabled:opacity-40";
export const QUIET = "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full px-3 font-urbanist text-[14px] font-semibold text-content underline decoration-border-strong underline-offset-4 hover:decoration-content";
const LABEL = "font-urbanist text-[12px] font-bold uppercase tracking-[0.12em] text-content-muted";

export type CardActions = { founders: Founder[]; brief: BriefFields; confirmed: boolean; onReviewBrief: () => void; onConfirmBrief: () => void; onContinue: () => void; onContact: () => void };

function useNarrow() {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const apply = () => setNarrow(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return narrow;
}

/** Opens in a new tab, so the conversation stays where it is. */
function Page({ href, className, children }: { href: string; className: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener" className={className}>
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

const ROW = "group flex min-h-14 w-full items-center gap-3.5 py-3 transition-colors";
const Arrow = () => <ArrowUpRight size={16} aria-hidden className="ml-auto shrink-0 text-content-muted transition-[color,transform] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />;
const Words = ({ title, text }: { title: string; text: string }) => (
  <span className="min-w-0">
    <span className="block font-urbanist text-[16px] font-bold leading-snug text-content">{title}</span>
    <span className="mt-0.5 line-clamp-2 text-[14px] leading-relaxed text-content-muted sm:line-clamp-1">{text}</span>
  </span>
);

function Service({ item }: { item: CatalogItem }) {
  return (
    <Page href={item.href} className={ROW}>
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-control bg-brand-soft text-[#4f46e5]">
        <Icon name={item.icon ?? "sparkles"} size={18} />
      </span>
      <Words title={item.title} text={item.text} />
      <Arrow />
    </Page>
  );
}

function Model({ item }: { item: CatalogItem }) {
  return (
    <Page href={item.href} className={ROW}>
      <Words title={item.title} text={item.text} />
      <span className="ml-auto shrink-0 text-right max-sm:hidden">
        <span className="block text-[12px] text-content-muted">Commitment</span>
        <span className="block font-urbanist text-[14px] font-semibold text-content">{item.meta}</span>
      </span>
      <ArrowUpRight size={16} aria-hidden className="shrink-0 text-content-muted max-sm:ml-auto group-hover:text-brand" />
    </Page>
  );
}

/** A story with its own picture is shown large; one without gets its colour from the content, never a made-up image. */
function Study({ item }: { item: CatalogItem }) {
  if (!item.image) {
    return (
      <Page href={item.href} className={ROW}>
        <span aria-hidden className="h-10 w-1 shrink-0 rounded-full" style={{ backgroundColor: item.accent }} />
        <Words title={item.title} text={item.text} />
        <Arrow />
      </Page>
    );
  }
  return (
    <Page href={item.href} className="group grid w-full gap-4 py-4 sm:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] sm:items-center">
      <span className="relative block aspect-[16/10] overflow-hidden rounded-control bg-surface-soft">
        <Image src={item.image} alt={item.imageAlt ?? ""} fill sizes="(min-width: 640px) 340px, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
      </span>
      <span className="min-w-0">
        <span className="block text-[12.5px] text-content-muted">{item.meta}</span>
        <span className="mt-0.5 flex items-center gap-1.5 font-urbanist text-[20px] font-bold text-content">
          {item.title}
          <ArrowUpRight size={17} aria-hidden className="text-content-muted group-hover:text-brand" />
        </span>
        <span className="mt-1 line-clamp-3 text-[14px] leading-relaxed text-content-muted">{item.text}</span>
      </span>
    </Page>
  );
}

function List({ title, slugs, find, Row }: { title: string; slugs: string[]; find: (slug: string) => CatalogItem | null; Row: (p: { item: CatalogItem }) => React.ReactNode }) {
  const narrow = useNarrow();
  const [all, setAll] = useState(false);
  const items = slugs.map(find).filter((i): i is CatalogItem => i !== null);
  if (!items.length) return null;
  const first = narrow ? 1 : 2;
  const hidden = Math.max(0, items.length - first);
  return (
    <section aria-label={title}>
      <h3 className={LABEL}>{title}</h3>
      <ul className="mt-1 divide-y divide-border border-b border-border">
        {items.slice(0, all ? items.length : first).map((i) => (
          <li key={i.slug} className="flex">
            <Row item={i} />
          </li>
        ))}
      </ul>
      {hidden > 0 && (
        <button type="button" aria-expanded={all} onClick={() => setAll(!all)} className="inline-flex min-h-11 items-center gap-1.5 font-urbanist text-[13.5px] font-semibold text-content-muted hover:text-content">
          {all ? "Show fewer" : `Show ${hidden} more`}
          <ChevronDown size={15} aria-hidden className={all ? "rotate-180" : ""} />
        </button>
      )}
    </section>
  );
}

/** The brief in a few lines. The full list is one tap away; nothing is sent from here. */
function BriefCard({ brief, confirmed, onReviewBrief, onConfirmBrief, onContinue }: CardActions) {
  const s = briefSummary(brief);
  return (
    <section aria-label="Project brief" data-card="brief" className="rounded-panel bg-surface-soft p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className={LABEL}>Your project brief</h3>
        <span className="inline-flex items-center gap-1.5 text-[12.5px] text-content-muted">
          <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${confirmed ? "bg-success" : "bg-warning"}`} />
          {confirmed ? "Confirmed by you" : "Draft"}
        </span>
      </div>
      <p className="mt-2 break-words font-urbanist text-[19px] font-bold leading-snug text-content sm:text-[21px]">{s.goal ?? "No goal written yet"}</p>
      {s.features.length > 0 && (
        <ul aria-label="Key requirements" className="mt-3 flex flex-wrap gap-2">
          {s.features.map((f, i) => (
            <li key={i} className="max-w-full break-words rounded-full bg-surface px-3 py-1.5 text-[13.5px] text-content">
              {f}
            </li>
          ))}
          {s.moreFeatures > 0 && <li className="px-1 py-1.5 text-[13.5px] text-content-muted">+{s.moreFeatures} more</li>}
        </ul>
      )}
      {s.facts.length > 0 && (
        <dl className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
          {s.facts.map(([label, value]) => (
            <div key={label}>
              <dt className="text-[12.5px] text-content-muted">{label}</dt>
              <dd className="break-words text-[14.5px] text-content">{value}</dd>
            </div>
          ))}
        </dl>
      )}
      {s.open > 0 && <p className="mt-3 text-[13px] text-content-muted">{s.open} details not discussed yet. They can stay that way.</p>}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        {confirmed ? (
          <button type="button" className={PRIMARY} onClick={onContinue}>
            Continue to contact form <ArrowRight size={15} aria-hidden />
          </button>
        ) : (
          <button type="button" className={PRIMARY} onClick={onConfirmBrief}>
            <Check size={15} aria-hidden /> Looks right
          </button>
        )}
        <button type="button" className={QUIET} onClick={onReviewBrief}>
          Review brief
        </button>
      </div>
    </section>
  );
}

function Founders({ people }: { people: Founder[] }) {
  return (
    <span className="flex shrink-0 -space-x-3">
      {people.map((p) => (
        <span key={p.photo} className="relative block h-12 w-12 overflow-hidden rounded-full bg-surface-soft ring-[3px] ring-surface">
          <Image src={p.photo} alt={`${p.name}, ${p.title}`} fill sizes="96px" className="origin-[50%_30%] scale-[1.45] object-cover object-[52%_25%]" />
        </span>
      ))}
    </span>
  );
}

export default function Card({ component, actions }: { component: Component; actions: CardActions }) {
  switch (component.type) {
    case "services":
      return <List title="Relevant services" slugs={component.slugs} find={serviceItem} Row={Service} />;
    case "case_studies":
      return <List title="Case studies" slugs={component.slugs} find={studyItem} Row={Study} />;
    case "engagement_models":
      return <List title="Ways of working" slugs={component.slugs} find={modelItem} Row={Model} />;
    case "technologies":
      return (
        <section aria-label="Possible building blocks">
          <h3 className={LABEL}>Possible building blocks</h3>
          <ol className="mt-1 divide-y divide-border border-y border-border">
            {component.items.map((i, n) => (
              <li key={i.name} className="flex gap-3.5 py-3">
                <span aria-hidden className="w-6 shrink-0 font-urbanist text-[14px] font-bold text-[#4f46e5]">{n + 1}</span>
                <span>
                  <span className="block font-urbanist text-[15px] font-bold text-content">{i.name}</span>
                  <span className="block text-[14px] leading-relaxed text-content-muted">{i.reason}</span>
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-2 text-[12.5px] text-content-muted">A suggestion to discuss, not a specification.</p>
        </section>
      );
    case "project_brief":
      // always the brief as it stands now, including the visitor's own edits
      return hasBrief(actions.brief) ? <BriefCard {...actions} /> : null;
    case "consultation":
      return (
        <section aria-label="Talk to a person" data-card="consultation" className="rounded-panel bg-surface-soft p-5 sm:p-6">
          <div className="flex items-center gap-4">
            <Founders people={actions.founders} />
            <div>
              <h3 className="font-urbanist text-[18px] font-bold leading-snug text-content">Talk it through with our founders</h3>
              <p className="text-[13.5px] text-content-muted">A person reads and replies.</p>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
            <Link href="/contact" data-booking className={PRIMARY}>
              <CalendarClock size={15} aria-hidden /> Book a call
            </Link>
            <button type="button" className={QUIET} onClick={actions.onContact}>
              Write to the team
            </button>
          </div>
          <p className="mt-2 text-[12.5px] text-content-muted">Both are real: the booking calendar and our contact form.</p>
        </section>
      );
    case "contact_preview":
      return (
        <section aria-label="What would go to the contact form" className="border-y border-border py-4">
          <p className="whitespace-pre-wrap break-words text-[14px] text-content">{briefToText(actions.brief) || "Nothing to add yet."}</p>
          <button type="button" className={`${QUIET} -ml-3 mt-1`} onClick={actions.onContinue}>
            Check it before the contact form
          </button>
        </section>
      );
  }
}
