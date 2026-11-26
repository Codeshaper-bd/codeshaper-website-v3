"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { BRIEF_LABELS, BRIEF_LIMITS, briefValue, hasBrief, type BriefFields, type BriefKey, type Component } from "@/lib/ai/contract";
import { Icon } from "@/lib/icons";
// types only: founders.ts reads server-only content, so the people come in as data
import type { Founder } from "@/lib/founders";
import { modelItem, serviceItem, studyItem, type CatalogItem } from "./catalog";
import { AREA, FIELD_LABEL, GHOST, LINK, META, PRIMARY, SECONDARY, SURFACE, TITLE } from "./ui";

/**
 * The closed set of things an answer may show. Information reads as part of the reply: plain rows on
 * the background. Each is drawn from checked data and the website's own content; text from the
 * assistant is only ever placed as text. Few at first, more on request.
 */
export type CardActions = { founders: Founder[]; brief: BriefFields; confirmed: boolean; onSaveBrief: (b: BriefFields) => void; onConfirmBrief: () => void; onContact: () => void; onBook: () => void };

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

const ROW = "group -mx-2 flex min-h-11 w-[calc(100%+1rem)] items-start gap-3 rounded-[10px] px-2 py-2 transition-colors hover:bg-content/[0.035]";
const Out = () => <ArrowUpRight size={14} aria-hidden className="ml-auto mt-1 shrink-0 text-content-muted opacity-60 group-hover:text-brand group-hover:opacity-100" />;
const Words = ({ title, text, aside }: { title: string; text: string; aside?: string }) => (
  <span className="min-w-0">
    <span className={`block ${TITLE}`}>
      {title}
      {aside && <span className="ml-2 font-sans text-[12.5px] font-normal text-content-muted">{aside}</span>}
    </span>
    <span className="line-clamp-2 text-[13px] leading-relaxed text-content-muted sm:line-clamp-1">{text}</span>
  </span>
);

function Service({ item }: { item: CatalogItem }) {
  return (
    <Page href={item.href} className={ROW}>
      <span className="mt-0.5 shrink-0 text-[#4f46e5]">
        <Icon name={item.icon ?? "sparkles"} size={16} />
      </span>
      <Words title={item.title} text={item.text} />
      <Out />
    </Page>
  );
}

function Model({ item }: { item: CatalogItem }) {
  return (
    <Page href={item.href} className={ROW}>
      <Words title={item.title} text={item.text} aside={item.meta} />
      <Out />
    </Page>
  );
}

/** A story with its own picture shows it small; one without gets its colour, never a made-up image. */
function Study({ item }: { item: CatalogItem }) {
  return (
    <Page href={item.href} className={`${ROW} gap-3.5`}>
      {item.image ? (
        <span className="relative mt-0.5 block aspect-[4/3] w-[88px] shrink-0 overflow-hidden rounded-[8px] bg-surface-soft sm:w-[116px]">
          <Image src={item.image} alt={item.imageAlt ?? ""} fill sizes="240px" className="object-cover" />
        </span>
      ) : (
        <span aria-hidden className="mt-1 h-8 w-[3px] shrink-0 rounded-full" style={{ backgroundColor: item.accent }} />
      )}
      <Words title={item.title} text={item.text} aside={item.meta} />
      <Out />
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
    <section aria-label={title} className="max-w-[600px]">
      <h3 className={`font-medium ${META}`}>{title}</h3>
      <ul className="mt-1">
        {items.slice(0, all ? items.length : first).map((i) => (
          <li key={i.slug} className="flex">
            <Row item={i} />
          </li>
        ))}
      </ul>
      {hidden > 0 && (
        <button type="button" aria-expanded={all} onClick={() => setAll(!all)} className={`${GHOST} -ml-2.5 text-content-muted`}>
          {all ? "Show fewer" : `Show ${hidden} more`}
          <ChevronDown size={14} aria-hidden className={all ? "rotate-180" : ""} />
        </button>
      )}
    </section>
  );
}

const SHOWN: BriefKey[] = ["goal", "users", "features", "platforms", "integrations", "timeline", "budget", "constraints"];

/**
 * The draft brief as a short document: only what is known. Corrections are usually said in a
 * message; the same fields can also be edited here. Nothing is confirmed until the visitor says so.
 */
function BriefCard({ brief, confirmed, onSaveBrief, onConfirmBrief, onContact }: CardActions) {
  const [edit, setEdit] = useState<Record<string, string> | null>(null);
  const known = SHOWN.filter((k) => briefValue(brief, k));
  const start = () => setEdit(Object.fromEntries(known.map((k) => [k, k === "features" ? brief.features.join("\n") : briefValue(brief, k)])));
  const save = () => {
    if (!edit) return;
    const next: BriefFields = { ...brief };
    for (const [key, value] of Object.entries(edit)) {
      const k = key as BriefKey;
      if (k === "features") next.features = value.split("\n").map((f) => f.trim().slice(0, BRIEF_LIMITS.features)).filter(Boolean).slice(0, 12);
      else next[k] = value.trim().slice(0, BRIEF_LIMITS[k]) || null;
    }
    onSaveBrief(next);
    setEdit(null);
  };

  return (
    <section aria-label="Project brief" data-card="brief" className={SURFACE}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        <h3 className={`font-medium ${META}`}>Project brief</h3>
        <span role="status" className={`inline-flex items-center gap-1.5 ${META}`}>
          <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${confirmed ? "bg-success" : "bg-warning"}`} />
          {confirmed ? "Confirmed by you" : "Draft prepared by the assistant"}
        </span>
      </div>
      {edit ? (
        <form
          action="/contact/continue"
          method="post"
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
        >
          <div className="mt-3 space-y-2.5">
            {Object.keys(edit).map((k) => (
              <label key={k} className={FIELD_LABEL}>
                {BRIEF_LABELS[k as BriefKey]}
                {k === "features" && <span className="font-normal text-content-muted"> (one per line)</span>}
                <textarea rows={k === "features" ? 3 : 1} value={edit[k]} onChange={(e) => setEdit({ ...edit, [k]: e.target.value })} className={`${AREA} !min-h-10 max-sm:!min-h-11`} />
              </label>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <button type="submit" className={PRIMARY}>
              Save changes
            </button>
            <button type="button" className={GHOST} onClick={() => setEdit(null)}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <p className={`mt-1.5 break-words ${TITLE}`}>{brief.goal ?? "No goal written yet"}</p>
          <dl className="mt-2 space-y-1 text-[14px] leading-relaxed">
            {known
              .filter((k) => k !== "goal")
              .map((k) => (
                <div key={k} className="grid gap-x-3 sm:grid-cols-[104px_minmax(0,1fr)]">
                  <dt className="pt-px text-[12.5px] text-content-muted">{BRIEF_LABELS[k]}</dt>
                  <dd className="break-words text-content">
                    {k === "features" ? (
                      <ul aria-label="Key requirements">
                        {brief.features.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    ) : (
                      briefValue(brief, k)
                    )}
                  </dd>
                </div>
              ))}
          </dl>
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {confirmed ? (
              <button type="button" className={PRIMARY} onClick={onContact}>
                Send to the team
              </button>
            ) : (
              <button type="button" className={PRIMARY} onClick={onConfirmBrief}>
                Looks right
              </button>
            )}
            <button type="button" className={GHOST} onClick={start}>
              Edit
            </button>
            <span className={`ml-auto ${META}`}>Or just say what to change.</span>
          </div>
        </>
      )}
    </section>
  );
}

function Founders({ people }: { people: Founder[] }) {
  return (
    <span className="flex shrink-0 -space-x-2">
      {people.map((p) => (
        <span key={p.photo} className="relative block h-8 w-8 overflow-hidden rounded-full bg-surface-soft ring-2 ring-surface">
          <Image src={p.photo} alt={`${p.name}, ${p.title}`} fill sizes="64px" className="origin-[50%_30%] scale-[1.45] object-cover object-[52%_25%]" />
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
        <section aria-label="Possible building blocks" className="max-w-[600px]">
          <h3 className={`font-medium ${META}`}>Possible building blocks</h3>
          <ol className="mt-1.5 space-y-2">
            {component.items.map((i, n) => (
              <li key={i.name} className="flex gap-3">
                <span aria-hidden className="w-4 shrink-0 pt-px text-[12.5px] tabular-nums text-content-muted">{n + 1}</span>
                <span>
                  <span className={`block ${TITLE}`}>{i.name}</span>
                  <span className="block text-[13px] leading-relaxed text-content-muted">{i.reason}</span>
                </span>
              </li>
            ))}
          </ol>
          <p className={`mt-2 ${META}`}>A suggestion to discuss, not a specification.</p>
        </section>
      );
    case "project_brief":
      // always the brief as it stands now, including the visitor's own edits
      return hasBrief(actions.brief) ? <BriefCard {...actions} /> : null;
    case "consultation":
      return (
        <section aria-label="Talk to a person" data-card="consultation">
          <div className="flex items-center gap-3">
            <Founders people={actions.founders} />
            <p className="text-[14px] text-content">
              <strong className="font-urbanist">Talk it through with our founders.</strong> A person reads and replies.
            </p>
          </div>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            <button type="button" className={PRIMARY} onClick={actions.onBook}>
              Book a call
            </button>
            <button type="button" className={SECONDARY} onClick={actions.onContact}>
              Write to the team
            </button>
          </div>
        </section>
      );
    case "contact_preview":
      return (
        <button type="button" className={`${LINK} -ml-1.5`} onClick={actions.onContact}>
          Send this to the team
        </button>
      );
  }
}
