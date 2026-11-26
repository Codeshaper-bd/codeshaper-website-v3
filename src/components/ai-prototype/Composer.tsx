"use client";

import { useLayoutEffect, type RefObject } from "react";
import { ArrowUp, Mic, Square } from "lucide-react";

/** The backend's limit for one message (codeshaper-cms config/ai.php). */
export const MESSAGE_MAX = 1500;
const MAX_LINES = 6;

type Props = {
  inputRef: RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (v: string) => void;
  busy: boolean;
  suggestions: string[];
  onSend: (text: string) => void;
  onStop: () => void;
  onVoice: () => void;
  onContact: () => void;
};

export default function Composer({ inputRef, value, onChange, busy, suggestions, onSend, onStop, onVoice, onContact }: Props) {
  const ready = value.trim().length > 0 && !busy;

  useLayoutEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    const line = parseFloat(getComputedStyle(el).lineHeight) || 24;
    el.style.height = `${Math.min(el.scrollHeight, line * MAX_LINES)}px`;
  }, [value, inputRef]);

  return (
    <div className="shrink-0 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto w-full max-w-[800px] px-3 sm:px-6">
        {suggestions.length > 0 && !busy && (
          <ul aria-label="Suggested replies" className="no-scrollbar flex gap-2 overflow-x-auto px-1 pb-2.5 pt-0.5">
            {suggestions.map((s) => (
              <li key={s} className="shrink-0">
                <button type="button" onClick={() => onSend(s)} className="min-h-10 rounded-full border border-border-strong bg-surface px-3.5 text-[13px] font-medium text-content transition-colors hover:bg-surface-soft">
                  {s}
                </button>
              </li>
            ))}
          </ul>
        )}
        {/* drawn only with scripts; the plain-form address is the site's rule for every form */}
        <form
          action="/contact/continue"
          method="post"
          onSubmit={(e) => {
            e.preventDefault();
            if (ready) onSend(value);
          }}
          className="flex items-end gap-1.5 rounded-[22px] border border-border-strong bg-surface p-2 shadow-[0_12px_32px_-18px_rgba(11,15,25,0.28)] transition-[border-color,box-shadow] focus-within:border-brand/50 focus-within:shadow-[0_0_0_4px_var(--color-brand-soft)]"
        >
          <label htmlFor="ai-message" className="sr-only">
            Your message
          </label>
          <textarea
            id="ai-message"
            ref={inputRef}
            data-autofocus
            rows={1}
            maxLength={MESSAGE_MAX}
            value={value}
            placeholder="Write a message"
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== "Enter" || e.shiftKey || e.nativeEvent.isComposing) return;
              e.preventDefault();
              if (ready) onSend(value);
            }}
            enterKeyHint="send"
            style={{ outline: "none", boxShadow: "none" }}
            className="block min-w-0 flex-1 resize-none self-center bg-transparent px-2.5 py-2 text-[16px] leading-[1.5] text-content placeholder:text-content-muted sm:text-[15px]"
          />
          <button type="button" onClick={onVoice} aria-label="Switch to voice" title="Switch to voice" className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-content-muted transition-colors hover:bg-surface-soft hover:text-content">
            <Mic size={18} aria-hidden />
          </button>
          {busy ? (
            <button type="button" onClick={onStop} aria-label="Stop reply" title="Stop reply" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-content text-surface">
              <Square size={13} fill="currentColor" aria-hidden />
            </button>
          ) : (
            <button type="submit" disabled={!ready} aria-label="Send message" title="Send message" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-content text-surface transition-colors disabled:bg-[#eceef2] disabled:text-content-muted">
              <ArrowUp size={18} strokeWidth={2.2} aria-hidden />
            </button>
          )}
        </form>
        <p className="flex flex-wrap items-center justify-center gap-x-2 pt-1.5 text-center text-[12px] text-content-muted">
          <span>
            Scripted prototype. Nothing is sent or saved.
            {value.length > MESSAGE_MAX - 200 && ` ${value.length}/${MESSAGE_MAX}`}
          </span>
          <button type="button" onClick={onContact} className="min-h-8 font-semibold text-content underline decoration-border-strong underline-offset-4 hover:decoration-content">
            Talk to a person
          </button>
        </p>
      </div>
    </div>
  );
}
