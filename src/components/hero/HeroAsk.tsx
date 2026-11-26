"use client";

import { useEffect, useLayoutEffect, useRef, useState, type FormEvent, type KeyboardEvent, type MouseEvent } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { BRIEF_MAX, saveBrief } from "@/lib/briefHandoff";
import { ArrowUp, Bot, Mic, Rocket, RefreshCw, CornerDownLeft, type LucideIcon } from "lucide-react";
import type { Handoff } from "@/components/ai-prototype/Workspace";

/**
 * Hero project prompt, in the compact "AI input" pattern: one white input
 * card, a round send button, and an idea tray tucked underneath.
 *
 * Honest by design: there is no chatbot, and nothing is sent from here. The
 * button opens /contact with the visitor's text already in the contact form
 * (lib/briefHandoff: kept in this tab, never in the address). Before the page's
 * script is ready, or without it, the plain POST form still works.
 *
 *  · Enter continues, Shift+Enter adds a line (chat convention); an empty box
 *    doesn't continue, the click just focuses the input
 *  · the input starts at one line and grows to 5 lines, then scrolls
 *  · while empty and unfocused the hint cycles through example ideas
 *    (static under reduced motion, paused offscreen); a visually hidden
 *    <label> and the native placeholder stay for assistive tech
 *  · tray ideas are real links to /contact; with JS they fill the box
 *  · the button reads as inactive (grey) until there's text
 *
 * UX01 prototype (development only, NEXT_PUBLIC_AI_PROTOTYPE=1): submitting opens a scripted AI
 * consultation window instead, with a voice entry; the contact form is the link under the proof line. A production
 * build contains none of it, whatever the variable says.
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

const MAX_LINES = 5;

// written out here so a production build can drop the window and its code altogether
const Workspace =
  process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_AI_PROTOTYPE === "1"
    ? dynamic(() => import("@/components/ai-prototype/Workspace"), { ssr: false })
    : null;

export default function HeroAsk() {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [example, setExample] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const hasText = value.trim().length > 0;
  const router = useRouter();
  const [consultation, setConsultation] = useState<{ open: boolean; handoff: Handoff | null }>({ open: false, handoff: null });
  const opened = useRef(0);

  const openConsultation = (mode: Handoff["mode"]) =>
    setConsultation({ open: true, handoff: { id: ++opened.current, mode, text: value.trim(), origin: formRef.current?.getBoundingClientRect() } });

  // keep the words in this tab and open the form; if storage is blocked, the form's own POST goes ahead
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    if (Workspace) {
      e.preventDefault();
      if (hasText) openConsultation("text");
      return;
    }
    if (!saveBrief(areaRef.current?.value ?? "")) return;
    e.preventDefault();
    router.push("/contact");
  };

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
        action="/contact/continue"
        method="post"
        onSubmit={onSubmit}
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
            maxLength={BRIEF_MAX}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={onKeyDown}
            enterKeyHint="go"
            placeholder={`What would you like to build? ${EXAMPLES[0]}`}
            // the global unlayered :focus-visible outline would draw a box
            // inside the card; the card's focus-within ring marks focus instead
            style={{ outline: "none", boxShadow: "none" }}
            className={`block w-full resize-none overflow-y-auto bg-transparent text-[16px] leading-[1.6] text-[#0b0f19] placeholder:text-[#6b7180] sm:text-[14px] ${
              idle ? "placeholder:text-transparent" : ""
            }`}
          />
          {/* animated hint, only while empty and unfocused (visual only) */}
          {idle && (
            <p
              aria-hidden
              className="pointer-events-none absolute inset-x-4 top-3.5 flex min-w-0 gap-1 text-[16px] leading-[1.6] text-[#6b7180] sm:inset-x-[18px] sm:text-[14px]"
            >
              <span className="hidden shrink-0 sm:inline">Describe your idea:</span>
              <span key={example} className="hero-ask-example min-w-0 truncate">
                {EXAMPLES[example]}
              </span>
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 px-3 pb-3 pt-2 sm:px-3.5">
          {Workspace && consultation.handoff && !consultation.open ? (
            // closing the window keeps the conversation; this is the way back to it
            <button
              type="button"
              onClick={() => setConsultation((c) => ({ ...c, open: true }))}
              className="mr-auto min-h-10 rounded-full px-2.5 text-[12.5px] font-semibold text-[#4f46e5] underline decoration-[#4f46e5]/30 underline-offset-4 hover:decoration-[#4f46e5]"
            >
              Resume<span className="hidden sm:inline"> your consultation</span>
            </button>
          ) : (
          <span className="hidden items-center gap-1.5 pl-1 text-[12px] text-[#6b7180] sm:flex">
            <kbd className="inline-flex h-5 items-center rounded-md border border-[#0b0f19]/10 bg-[#f6f7f9] px-1.5 font-sans text-[11px] text-[#4b5263]">
              <CornerDownLeft size={11} strokeWidth={2} aria-hidden />
            </kbd>
            {Workspace ? "to start · prototype, nothing is sent" : "to continue · nothing is sent yet"}
          </span>
          )}
          {Workspace && (
            <span className="mr-auto flex items-center gap-1 sm:ml-auto sm:mr-0">
              <button
                type="button"
                onClick={() => openConsultation("voice")}
                aria-label="Start a voice consultation (simulated)"
                title="Talk instead (simulated)"
                className="inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-[12.5px] font-semibold text-[#0b0f19] hover:bg-[#f3f2f7]"
              >
                <Mic size={15} strokeWidth={2} aria-hidden />
                Talk
              </button>
            </span>
          )}
          <button
            type="submit"
            onClick={onSendClick}
            aria-label={Workspace ? "Start the AI consultation (prototype)" : "Continue to the contact form"}
            title={Workspace ? "Start the AI consultation (prototype)" : "Continue to the contact form"}
            className={`${Workspace ? "" : "ml-auto "}grid h-9 w-9 shrink-0 place-items-center rounded-full transition-[background-color,color,transform] duration-200 active:scale-[0.94] ${
              hasText ? "bg-[#0b0f19] text-white hover:bg-[#262b3a]" : "bg-[#eceef2] text-[#8a90a0]"
            }`}
          >
            <ArrowUp size={17} strokeWidth={2.2} aria-hidden />
          </button>
        </div>
      </form>

      {/* mounted from the first opening on, so closing it keeps the conversation */}
      {Workspace && consultation.handoff && (
        <Workspace
          open={consultation.open}
          handoff={consultation.handoff}
          onClose={() => setConsultation((c) => ({ ...c, open: false }))}
          onTaken={() => setValue("")}
        />
      )}

      {/* idea tray, tucked under the card */}
      <div className="hero-ask-tray mx-3 -mt-3 rounded-b-[18px] px-2 pb-1.5 pt-[18px] sm:mx-4">
        <div className="no-scrollbar flex items-center gap-1 overflow-x-auto [mask-image:linear-gradient(to_right,black_82%,transparent)] sm:justify-center sm:[mask-image:none]">
          <span className="shrink-0 px-2 text-[12px] font-medium text-[#4b5263]">Try</span>
          {IDEAS.map((idea) => (
            <Link
              key={idea.label}
              href="/contact"
              onClick={(e) => applyIdea(e, idea.brief)}
              className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-[12.5px] font-medium text-[#1f2433] transition-colors duration-200 hover:bg-white/80"
            >
              <idea.icon size={13} strokeWidth={2} aria-hidden className="text-[#5b4fd6]" />
              {idea.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
