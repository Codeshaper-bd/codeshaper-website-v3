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
  onSend: (text: string) => void;
  onStop: () => void;
  onVoice: () => void;
};

/** Writing, voice and send. Nothing else lives here. */
export default function Composer({ inputRef, value, onChange, busy, onSend, onStop, onVoice }: Props) {
  const ready = value.trim().length > 0 && !busy;

  useLayoutEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    const line = parseFloat(getComputedStyle(el).lineHeight) || 24;
    el.style.height = `${Math.min(el.scrollHeight, line * MAX_LINES + 20)}px`;
  }, [value, inputRef]);

  return (
    <div className="shrink-0 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto w-full max-w-[848px] px-3 sm:px-6">
        {/* drawn only with scripts; the plain-form address is the site's rule for every form */}
        <form
          action="/contact/continue"
          method="post"
          onSubmit={(e) => {
            e.preventDefault();
            if (ready) onSend(value);
          }}
          className="flex items-end gap-1 rounded-[28px] border border-border-strong bg-surface p-2 shadow-[0_18px_44px_-24px_rgba(45,38,120,0.35)] transition-[border-color,box-shadow] focus-within:border-brand/50 focus-within:shadow-[0_0_0_4px_var(--color-brand-soft),0_18px_44px_-24px_rgba(45,38,120,0.35)]"
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
            className="block min-h-11 min-w-0 flex-1 resize-none self-center bg-transparent px-3.5 py-2.5 text-[16px] leading-[1.5] text-content placeholder:text-content-muted"
          />
          <button type="button" onClick={onVoice} aria-label="Switch to voice" title="Voice mode" className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-content-muted transition-colors hover:bg-surface-soft hover:text-content">
            <Mic size={19} aria-hidden />
          </button>
          {busy ? (
            <button type="button" onClick={onStop} aria-label="Stop reply" title="Stop reply" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-content text-surface">
              <Square size={13} fill="currentColor" aria-hidden />
            </button>
          ) : (
            <button type="submit" disabled={!ready} aria-label="Send message" title="Send message" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-content text-surface transition-colors disabled:bg-[#eceef2] disabled:text-content-muted">
              <ArrowUp size={19} strokeWidth={2.2} aria-hidden />
            </button>
          )}
        </form>
        <p className="pt-2 text-center text-[12px] text-content-muted [@media(max-height:540px)]:hidden">
          Prototype: replies are scripted and nothing is sent.
          {value.length > MESSAGE_MAX - 200 && ` ${value.length}/${MESSAGE_MAX}`}
        </p>
      </div>
    </div>
  );
}
