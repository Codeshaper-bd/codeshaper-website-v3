"use client";

import { useRef, useState } from "react";
import { ArrowRight, Check, X } from "lucide-react";
import { BRIEF_LABELS, BRIEF_LIMITS, BRIEF_ORDER, briefToText, hasBrief, MAX_FEATURES, type BriefFields, type BriefKey } from "@/lib/ai/contract";
import { PRIMARY, QUIET } from "./Cards";
import { useDialog } from "./useDialog";
import styles from "./ai.module.css";

export type PanelView = "edit" | "share" | "contact";
type Props = {
  view: PanelView;
  brief: BriefFields;
  /** what the visitor last wrote, offered to the contact form when there is no brief yet */
  fallback: string;
  onView: (v: PanelView) => void;
  onSave: (b: BriefFields) => void;
  onContinue: (text: string) => boolean;
  onClose: () => void;
};

const FIELD = "mt-1 w-full rounded-control border border-border-strong bg-surface px-3 py-2.5 text-[16px] leading-relaxed text-content sm:text-[14px]";

/** Opened only when asked for: edit the brief, or see exactly what would go to the contact form. */
export default function BriefPanel({ view, brief, fallback, onView, onSave, onContinue, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState<Record<BriefKey, string>>(() =>
    Object.fromEntries(BRIEF_ORDER.map((k) => [k, k === "features" ? brief.features.join("\n") : (brief[k] ?? "")])) as Record<BriefKey, string>,
  );
  const [message, setMessage] = useState(() => briefToText(brief) || fallback.slice(0, 1000));
  const [blocked, setBlocked] = useState(false);
  useDialog(ref, true, onClose);

  const edited = (): BriefFields => {
    const value = (k: BriefKey) => draft[k].trim().slice(0, BRIEF_LIMITS[k]) || null;
    return {
      goal: value("goal"),
      users: value("users"),
      features: draft.features.split("\n").map((f) => f.trim().slice(0, BRIEF_LIMITS.features)).filter(Boolean).slice(0, MAX_FEATURES),
      platforms: value("platforms"),
      integrations: value("integrations"),
      timeline: value("timeline"),
      budget: value("budget"),
      constraints: value("constraints"),
    };
  };
  const title = view === "edit" ? "Review your brief" : view === "share" ? "Continue to contact form" : "Write to the team";

  return (
    <div className="absolute inset-0 z-20 flex items-end justify-center bg-content/25 sm:items-stretch sm:justify-end" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-panel-title"
        tabIndex={-1}
        data-panel={view}
        className={`flex max-h-[92%] w-full flex-col rounded-t-[24px] bg-surface shadow-[0_-20px_50px_-30px_rgba(11,15,25,0.45)] sm:max-h-none sm:w-[480px] sm:rounded-none sm:rounded-l-[24px] ${styles.panel}`}
      >
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border py-3 pl-5 pr-3">
          <h2 id="ai-panel-title" className="font-urbanist text-[18px] font-bold text-content">
            {title}
          </h2>
          <button type="button" onClick={onClose} aria-label="Close panel" className="grid h-11 w-11 place-items-center rounded-full text-content hover:bg-surface-soft">
            <X size={18} aria-hidden />
          </button>
        </header>

        {view === "edit" ? (
          <form
            action="/contact/continue"
            method="post"
            className="flex min-h-0 flex-1 flex-col"
            onSubmit={(e) => {
              e.preventDefault();
              onSave(edited());
              onClose();
            }}
          >
            <div data-lenis-prevent className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-5 py-4">
              <p className="text-[13px] leading-relaxed text-content-muted">Everything is optional. Leave blank what you have not decided.</p>
              {BRIEF_ORDER.map((k, i) => (
                <label key={k} className="block text-[13px] font-semibold text-content">
                  {BRIEF_LABELS[k]}
                  {k === "features" && <span className="font-normal text-content-muted"> (one per line)</span>}
                  {k === "goal" || k === "features" || k === "constraints" ? (
                    <textarea data-autofocus={i === 0 || undefined} rows={k === "constraints" ? 2 : 3} className={FIELD} value={draft[k]} maxLength={k === "features" ? 2000 : BRIEF_LIMITS[k]} onChange={(e) => setDraft({ ...draft, [k]: e.target.value })} />
                  ) : (
                    <input className={FIELD} value={draft[k]} maxLength={BRIEF_LIMITS[k]} placeholder="Not discussed yet" onChange={(e) => setDraft({ ...draft, [k]: e.target.value })} />
                  )}
                </label>
              ))}
            </div>
            <footer className="flex shrink-0 flex-col gap-1 border-t border-border px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:flex-row sm:items-center">
              <button type="submit" className={PRIMARY}>
                <Check size={15} aria-hidden /> Save and confirm
              </button>
              <button
                type="button"
                className={QUIET}
                disabled={!hasBrief(edited())}
                onClick={() => {
                  onSave(edited());
                  setMessage(briefToText(edited()));
                  onView("share");
                }}
              >
                Continue to contact form <ArrowRight size={15} aria-hidden />
              </button>
            </footer>
          </form>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col">
            <div data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4">
              <p className="rounded-control bg-surface-soft p-3 text-[13px] leading-relaxed text-content">
                <strong>Nothing is sent from here.</strong> This opens our real contact form with the text filled in. It is sent only if you add your details and press send there.
              </p>
              <label className="mt-4 block text-[13px] font-semibold text-content">
                Message for the team
                <textarea data-autofocus rows={11} maxLength={1000} value={message} onChange={(e) => setMessage(e.target.value)} className={FIELD} />
              </label>
              <p className="mt-1 text-right text-[12px] text-content-muted">{message.length}/1000</p>
              {blocked && (
                <p role="alert" className="mt-2 text-[13px] text-content">
                  This browser would not keep the text. Copy it, then paste it into the form.
                </p>
              )}
            </div>
            <footer className="flex shrink-0 flex-col border-t border-border px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:flex-row">
              <button type="button" className={PRIMARY} onClick={() => !onContinue(message) && setBlocked(true)}>
                Open the contact form <ArrowRight size={15} aria-hidden />
              </button>
            </footer>
          </div>
        )}
      </div>
    </div>
  );
}
