"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, CalendarClock, Check, Mail, PencilLine, Send } from "lucide-react";
import { BRIEF_LABELS, BRIEF_ORDER, briefToText, briefValue, hasBrief, type BriefFields, type Component } from "@/lib/ai/contract";
import { modelItem, serviceItem, studyItem, type CatalogItem } from "./catalog";

/**
 * The closed set of things an answer may show. Each is drawn from checked data and the website's own
 * content; text from the assistant is only ever placed as text.
 */
export const PRIMARY = "inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-content px-4 font-urbanist text-[13.5px] font-semibold text-surface transition-colors hover:bg-[#262b3a] disabled:cursor-not-allowed disabled:opacity-40";
export const OUTLINE = "inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-border-strong bg-surface px-4 font-urbanist text-[13.5px] font-semibold text-content transition-colors hover:bg-surface-soft disabled:cursor-not-allowed disabled:opacity-40";
const HEADING = "font-urbanist text-[12px] font-bold uppercase tracking-[0.1em] text-content-muted";

export type CardActions = { brief: BriefFields; confirmed: boolean; onReviewBrief: () => void; onConfirmBrief: () => void; onShare: () => void; onContact: () => void };

/** Cards open the page in a new tab, so the conversation stays where it is. */
function ItemCard({ item }: { item: CatalogItem }) {
  return (
    <a
      href={item.href}
      target="_blank"
      rel="noopener"
      className="group flex w-full min-w-0 flex-col overflow-hidden rounded-control border border-border bg-surface transition-colors hover:border-border-strong hover:bg-surface-soft"
    >
      {item.image && (
        <span className="relative block aspect-[16/9] bg-surface-soft">
          <Image src={item.image} alt={item.imageAlt ?? ""} fill sizes="(min-width: 640px) 260px, 100vw" className="object-cover" />
        </span>
      )}
      <span className="flex flex-1 flex-col gap-1 p-3.5">
        {item.meta && <span className="text-[12px] text-content-muted">{item.meta}</span>}
        <span className="flex items-start justify-between gap-2 font-urbanist text-[15px] font-bold leading-snug text-content">
          {item.title}
          <ArrowUpRight size={15} aria-hidden className="mt-0.5 shrink-0 text-content-muted transition-colors group-hover:text-brand" />
        </span>
        <span className="line-clamp-3 text-[13px] leading-relaxed text-content-muted">{item.text}</span>
        <span className="sr-only">(opens in a new tab)</span>
      </span>
    </a>
  );
}

function Items({ title, slugs, find }: { title: string; slugs: string[]; find: (slug: string) => CatalogItem | null }) {
  const found = slugs.map(find).filter((i): i is CatalogItem => i !== null);
  if (!found.length) return null;
  // pictures only when every card has one: a mixed row looks broken
  const items = found.every((i) => i.image) ? found : found.map((i) => ({ ...i, image: undefined }));
  return (
    <section aria-label={title}>
      <h3 className={HEADING}>{title}</h3>
      <ul className={`mt-2 grid gap-2.5 ${items.length === 3 ? "sm:grid-cols-3" : items.length === 2 ? "sm:grid-cols-2" : "sm:max-w-sm"}`}>
        {items.map((i) => (
          <li key={i.slug} className="flex">
            <ItemCard item={i} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function BriefRows({ brief }: { brief: BriefFields }) {
  return (
    <dl className="divide-y divide-border">
      {BRIEF_ORDER.map((k) => {
        const value = briefValue(brief, k);
        return (
          <div key={k} className="grid gap-0.5 py-2 sm:grid-cols-[130px_minmax(0,1fr)] sm:gap-3">
            <dt className="text-[13px] text-content-muted">{BRIEF_LABELS[k]}</dt>
            <dd className={`break-words text-[14px] ${value ? "text-content" : "text-content-muted"}`}>{value || "Not discussed yet"}</dd>
          </div>
        );
      })}
    </dl>
  );
}

function BriefCard({ brief, confirmed, onReviewBrief, onConfirmBrief, onShare }: CardActions) {
  return (
    <section aria-label="Project brief" data-card="brief" className="rounded-panel border border-border bg-surface p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-urbanist text-[17px] font-bold text-content">Project brief</h3>
        <span className="inline-flex items-center gap-1.5 text-[12px] text-content-muted">
          <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${confirmed ? "bg-success" : "bg-warning"}`} />
          {confirmed ? "Confirmed by you" : "Draft, please check"}
        </span>
      </div>
      <div className="mt-2">
        <BriefRows brief={brief} />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {!confirmed && (
          <button type="button" className={PRIMARY} onClick={onConfirmBrief}>
            <Check size={15} aria-hidden /> Looks right
          </button>
        )}
        <button type="button" className={OUTLINE} onClick={onReviewBrief}>
          <PencilLine size={15} aria-hidden /> Review and edit
        </button>
        <button type="button" className={confirmed ? PRIMARY : OUTLINE} onClick={onShare}>
          <Send size={15} aria-hidden /> Share with the team
        </button>
        <Link href="/contact" data-booking className={OUTLINE}>
          <CalendarClock size={15} aria-hidden /> Book a consultation
        </Link>
      </div>
    </section>
  );
}

export default function Card({ component, actions }: { component: Component; actions: CardActions }) {
  switch (component.type) {
    case "services":
      return <Items title="Relevant services" slugs={component.slugs} find={serviceItem} />;
    case "case_studies":
      return <Items title="Case studies" slugs={component.slugs} find={studyItem} />;
    case "engagement_models":
      return <Items title="Ways of working" slugs={component.slugs} find={modelItem} />;
    case "technologies":
      return (
        <section aria-label="Possible building blocks">
          <h3 className={HEADING}>Possible building blocks</h3>
          <ul className="mt-2 divide-y divide-border rounded-control border border-border">
            {component.items.map((i) => (
              <li key={i.name} className="grid gap-0.5 p-3.5 sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-3">
                <span className="font-urbanist text-[14px] font-bold text-content">{i.name}</span>
                <span className="text-[13px] leading-relaxed text-content-muted">{i.reason}</span>
              </li>
            ))}
          </ul>
          <p className="mt-1.5 text-[12px] text-content-muted">A suggestion to discuss, not a specification.</p>
        </section>
      );
    case "project_brief":
      // always the brief as it stands now, including the visitor's own edits
      return hasBrief(actions.brief) ? <BriefCard {...actions} /> : null;
    case "consultation":
      return (
        <section aria-label="Talk to a person" data-card="consultation" className="rounded-panel border border-border bg-surface-soft p-4 sm:p-5">
          <h3 className="font-urbanist text-[16px] font-bold text-content">Talk to a person</h3>
          <p className="mt-1 text-[13.5px] leading-relaxed text-content-muted">Book a call with the founders, or write to the team.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href="/contact" data-booking className={PRIMARY}>
              <CalendarClock size={15} aria-hidden /> Book a consultation
            </Link>
            <button type="button" className={OUTLINE} onClick={actions.onContact}>
              <Mail size={15} aria-hidden /> Write to the team
            </button>
          </div>
        </section>
      );
    case "contact_preview":
      return (
        <section aria-label="What would go to the contact form" className="rounded-panel border border-border p-4">
          <p className="whitespace-pre-wrap break-words text-[13.5px] text-content">{briefToText(actions.brief) || "Nothing to add yet."}</p>
          <button type="button" className={`${OUTLINE} mt-3`} onClick={actions.onShare}>
            Review before the contact form
          </button>
        </section>
      );
  }
}
