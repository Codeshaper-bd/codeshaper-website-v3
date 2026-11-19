"use client";

import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { ArrowUp, Bot, Rocket, RefreshCw, CornerDownLeft, type LucideIcon } from "lucide-react";

/**
 * Hero project prompt, in the compact "AI input" pattern: one white input
 * card, a round send button, and an idea tray tucked underneath.
 *
 * Honest by design: there is no chatbot. Sending takes the visitor to
 * /contact with their text prefilled in the contact form's brief field
 * (ContactForm reads ?brief=). It's a plain GET form, so it also works
 * before hydration and without JavaScript.
 *
 *  · Enter sends, Shift+Enter adds a line (chat convention); an empty box
 *    doesn't send, the click just focuses the input
 *  · the input starts at one line and grows to 5 lines, then scrolls
 *  · while empty and unfocused the hint cycles through example ideas
 *    (static under reduced motion, paused offscreen); a visually hidden
 *    <label> and the native placeholder stay for assistive tech
 *  · tray ideas are real links to /contact?brief=…; with JS they fill the box
 *  · the send button reads as inactive (grey) until there's text
 */
const IDEAS: { label: string; icon: LucideIcon; brief: string }[] = [
  { label: "AI agent", icon: Bot, brief: "We'd like an AI agent that automates part of our workflow: " },
  { label: "SaaS MVP", icon: Rocket, brief: "We want to launch an MVP for a SaaS product: " },
  { label: "Modernize a platform", icon: RefreshCw, brief: "We need to modernize an existing platform: " },
];

const EXAMPLES = [
  "an AI agent that answers support tickets…",
  "a SaaS MVP for booking clinic appointments…",
  "an internal tool that replaces our spreadsheets…",
  "a mobile app for our field team…",
];

const MAX = 1000;
const MAX_LINES = 5;

export default function HeroAsk() {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [example, setExample] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const hasText = value.trim().length > 0;

  // grow with content: one line → MAX_LINES, then scroll
  useLayoutEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const line = parseFloat(getComputedStyle(el).lineHeight) || 26;
    el.style.height = `${Math.min(el.scrollHeight, line * MAX_LINES)}px`;
  }, [value]);

  // rotate example ideas while the box is empty, unfocused and on screen
  const idle = !value && !focused;
  useEffect(() => {
    if (!idle || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const form = formRef.current;
    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    if (form) io.observe(form);
    const timer = window.setInterval(() => {
      if (visible && document.visibilityState === "visible") setExample((i) => (i + 1) % EXAMPLES.length);
    }, 3200);
    return () => {
      clearInterval(timer);
      io.disconnect();
    };
  }, [idle]);

  const focusEnd = (text: string) =>
    requestAnimationFrame(() => {
      const el = areaRef.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(text.length, text.length);
    });

  const applyIdea = (e: MouseEvent<HTMLAnchorElement>, brief: string) => {
    e.preventDefault();
    setValue(brief);
    focusEnd(brief);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Enter" || e.shiftKey || e.nativeEvent.isComposing) return;
    e.preventDefault();
    if (hasText) formRef.current?.requestSubmit();
  };

  const onSendClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (hasText) return;
    e.preventDefault();
    focusEnd(value);
  };

  return (
    <div className="w-full max-w-[600px]">
      <form
        ref={formRef}
        action="/contact"
        method="get"
        className="relative z-10 rounded-[20px] border border-[#0b0f19]/[0.08] bg-white text-left shadow-[0_1px_2px_rgba(11,15,25,0.04),0_12px_32px_-12px_rgba(11,15,25,0.18)] transition-[border-color,box-shadow] duration-200 focus-within:border-[#7c5cff]/45 focus-within:shadow-[0_0_0_4px_rgba(124,92,255,0.12),0_12px_32px_-12px_rgba(11,15,25,0.18)]"
      >
        <label htmlFor="hero-brief" className="sr-only">
          What would you like to build?
        </label>
        <div className="relative px-4 pt-3.5 sm:px-[18px]">
          <textarea
            id="hero-brief"
            ref={areaRef}
            name="brief"
            rows={1}
            maxLength={MAX}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={onKeyDown}
            enterKeyHint="send"
            placeholder={`What would you like to build? ${EXAMPLES[0]}`}
            // the global unlayered :focus-visible outline would draw a box
            // inside the card; the card's focus-within ring marks focus instead
            style={{ outline: "none", boxShadow: "none" }}
            className={`block w-full resize-none overflow-y-auto bg-transparent text-[15.5px] leading-[1.6] text-[#0b0f19] placeholder:text-[#6b7180] sm:text-[16px] ${
              idle ? "placeholder:text-transparent" : ""
            }`}
          />
          {/* animated hint, only while empty and unfocused (visual only) */}
          {idle && (
            <p
              aria-hidden
              className="pointer-events-none absolute inset-x-4 top-3.5 flex min-w-0 gap-1 text-[15.5px] leading-[1.6] text-[#6b7180] sm:inset-x-[18px] sm:text-[16px]"
            >
              <span className="hidden shrink-0 sm:inline">Describe your idea:</span>
              <span key={example} className="hero-ask-example min-w-0 truncate">
                {EXAMPLES[example]}
              </span>
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 px-3 pb-3 pt-2 sm:px-3.5">
          <span className="hidden items-center gap-1.5 pl-1 text-[12px] text-[#6b7180] sm:flex">
            <kbd className="inline-flex h-5 items-center rounded-md border border-[#0b0f19]/10 bg-[#f6f7f9] px-1.5 font-sans text-[11px] text-[#4b5263]">
              <CornerDownLeft size={11} strokeWidth={2} aria-hidden />
            </kbd>
            to send · goes straight to our team
          </span>
          <button
            type="submit"
            onClick={onSendClick}
            aria-label="Send to our team"
            title="Send to our team"
            className={`ml-auto grid h-9 w-9 shrink-0 place-items-center rounded-full transition-[background-color,color,transform] duration-200 active:scale-[0.94] ${
              hasText ? "bg-[#0b0f19] text-white hover:bg-[#262b3a]" : "bg-[#eceef2] text-[#8a90a0]"
            }`}
          >
            <ArrowUp size={17} strokeWidth={2.2} aria-hidden />
          </button>
        </div>
      </form>

      {/* idea tray, tucked under the card */}
      <div className="hero-ask-tray mx-3 -mt-3 rounded-b-[18px] px-2 pb-1.5 pt-[18px] sm:mx-4">
        <div className="no-scrollbar flex items-center gap-1 overflow-x-auto [mask-image:linear-gradient(to_right,black_82%,transparent)] sm:justify-center sm:[mask-image:none]">
          <span className="shrink-0 px-2 text-[12px] font-medium text-[#4b5263]">Try</span>
          {IDEAS.map((idea) => (
            <a
              key={idea.label}
              href={`/contact?brief=${encodeURIComponent(idea.brief)}`}
              onClick={(e) => applyIdea(e, idea.brief)}
              className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-[12.5px] font-medium text-[#1f2433] transition-colors duration-200 hover:bg-white/80"
            >
              <idea.icon size={13} strokeWidth={2} aria-hidden className="text-[#5b4fd6]" />
              {idea.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
