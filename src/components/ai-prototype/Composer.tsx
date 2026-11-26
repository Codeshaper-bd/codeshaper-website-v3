"use client";

import { useLayoutEffect, type RefObject } from "react";
import { ArrowUp, Mic, Square } from "lucide-react";
import { ICON } from "./ui";

/** The backend's limit for one message (codeshaper-cms config/ai.php). */
export const MESSAGE_MAX = 1500;
const MAX_LINES = 6;

type Props = {
  inputRef: RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (v: string) => void;
  busy: boolean;
  /** the first-use note has not been accepted: words only wait */
  waiting: boolean;
  onSend: (text: string) => void;
  onStop: () => void;
  onVoice: () => void;
};

/** Writing, voice and send. Nothing else lives here. */
export default function Composer({ inputRef, value, onChange, busy, waiting, onSend, onStop, onVoice }: Props) {
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
      <div className="mx-auto w-full max-w-[800px] px-3 sm:px-6">
        {/* drawn only with scripts; the plain-form address is the site's rule for every form */}
        <form
          action="/contact/continue"
          method="post"
          onSubmit={(e) => {
            e.preventDefault();
            if (ready) onSend(value);
          }}
          className="flex items-end gap-1 rounded-[16px] border border-content/10 bg-surface p-1.5 shadow-[0_10px_28px_-18px_rgba(45,38,120,0.35)] transition-[border-color,box-shadow] focus-within:border-brand/50 focus-within:shadow-[0_0_0_3px_var(--color-brand-soft),0_10px_28px_-18px_rgba(45,38,120,0.35)]"
        >
          <label htmlFor="ai-message" className="sr-only">
            Your message
          </label>
          <textarea
            id="ai-message"
            ref={inputRef}
            data-autofocus={!waiting || undefined}
            rows={1}
            maxLength={MESSAGE_MAX}
            value={value}
            placeholder={waiting ? "Write now; it is sent when you agree above" : "Write a message"}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== "Enter" || e.shiftKey || e.nativeEvent.isComposing) return;
              e.preventDefault();
              if (ready) onSend(value);
            }}
            enterKeyHint="send"
            style={{ outline: "none", boxShadow: "none" }}
            className="block min-h-9 min-w-0 flex-1 resize-none self-center bg-transparent px-2.5 py-[7px] text-[15px] leading-[1.5] text-content placeholder:text-content-muted max-sm:min-h-11 max-sm:py-2.5 max-sm:text-[16px] pointer-coarse:min-h-11 pointer-coarse:py-2.5"
          />
          <button type="button" onClick={onVoice} aria-label="Switch to voice" title="Voice mode" className={ICON}>
            <Mic size={17} aria-hidden />
          </button>
          {busy ? (
            <button type="button" onClick={onStop} aria-label="Stop reply" title="Stop reply" className={`${ICON} !bg-content !text-surface`}>
              <Square size={12} fill="currentColor" aria-hidden />
            </button>
          ) : (
            <button type="submit" disabled={!ready} aria-label={waiting ? "Keep message until you agree" : "Send message"} title={waiting ? "Keep until you agree" : "Send message"} className={`${ICON} !bg-content !text-surface disabled:!bg-transparent disabled:!text-content-muted`}>
              <ArrowUp size={17} strokeWidth={2.2} aria-hidden />
            </button>
          )}
        </form>
        <p className="pt-1.5 text-center text-[11.5px] text-content-muted [@media(max-height:540px)]:hidden">
          Prototype: scripted replies, simulated actions. Nothing is sent.
          {value.length > MESSAGE_MAX - 200 && ` ${value.length}/${MESSAGE_MAX}`}
        </p>
      </div>
    </div>
  );
}
