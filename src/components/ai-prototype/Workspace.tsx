"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useReducer, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import type Lenis from "lenis";
import { CalendarClock, FlaskConical, Mail, MessageSquareText, Mic, SquarePen, X } from "lucide-react";
import MarkSvg from "@/components/brand/MarkSvg";
import { saveBrief } from "@/lib/briefHandoff";
import { hasBrief, type Action } from "@/lib/ai/contract";
import type { Scenario } from "@/lib/ai/mockConsultant";
import { initialVoice, voiceReducer } from "@/lib/ai/voiceMachine";
import BriefPanel, { type PanelView } from "./BriefPanel";
import { OUTLINE, PRIMARY, type CardActions } from "./Cards";
import Composer from "./Composer";
import Conversation from "./Conversation";
import { useConsultation } from "./useConsultation";
import { useDialog } from "./useDialog";
import VoiceView from "./VoiceView";

/**
 * PROTOTYPE (UX01): the full-screen AI consultation window. One centred column: conversation first,
 * cards and the brief only when asked for or relevant. No backend, no microphone, nothing stored.
 */
export type Handoff = { id: number; text: string; mode: "text" | "voice"; origin?: DOMRect };
type Props = { open: boolean; handoff: Handoff | null; onClose: () => void; onTaken: () => void };

const SCENARIOS: [Scenario, string][] = [
  ["normal", "Normal replies"],
  ["unavailable", "AI unavailable"],
  ["budget_exhausted", "Budget used up"],
  ["rate_limited", "Rate limited"],
  ["session_expired", "Session expired"],
  ["network", "Network failure"],
];
const STARTERS = ["I want to build a SaaS product", "Automate a business process", "What services do you offer?", "Show me case studies"];
const HEADER_BUTTON = "grid h-10 w-10 shrink-0 place-items-center rounded-full text-content transition-colors hover:bg-surface-soft";

export default function Workspace({ open, handoff, onClose, onTaken }: Props) {
  const router = useRouter();
  const [announcement, setAnnouncement] = useState("");
  const announce = useCallback((t: string) => setAnnouncement(t), []);
  const chat = useConsultation(announce);
  const [view, setView] = useState<"text" | "voice">("text");
  const [voice, dispatch] = useReducer(voiceReducer, initialVoice);
  const [draft, setDraft] = useState("");
  /** the first-use note has been read; the visitor's first words wait until then */
  const [accepted, setAccepted] = useState(false);
  const [waiting, setWaiting] = useState("");
  const [panel, setPanel] = useState<PanelView | null>(null);
  const [lab, setLab] = useState(false);
  const [failTranscription, setFailTranscription] = useState(false);
  const [denyMicrophone, setDenyMicrophone] = useState(false);
  const taken = useRef(0);
  const dialog = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);

  const leaveVoice = () => {
    // ending and restarting keeps the (simulated) permission, and stops every voice timer
    dispatch({ type: "END" });
    dispatch({ type: "RESTART" });
  };
  const showText = (text?: string) => {
    leaveVoice();
    if (text) setDraft(text);
    setPanel(null);
    setView("text");
    requestAnimationFrame(() => input.current?.focus({ preventScroll: true }));
  };
  const close = () => {
    chat.stop();
    leaveVoice();
    setPanel(null);
    setLab(false);
    onClose();
  };
  useDialog(dialog, open, close);

  // what the hero handed over: a first message, or the wish to talk
  // eslint-disable-next-line react-hooks/exhaustive-deps -- checked after every render; the id makes it act once
  useEffect(() => {
    if (!open || !handoff || handoff.id === taken.current) return;
    taken.current = handoff.id;
    setView(handoff.mode);
    if (!handoff.text) return;
    if (handoff.mode === "voice") setDraft(handoff.text);
    else if (!accepted) setWaiting(handoff.text);
    else if (chat.send(handoff.text)) onTaken();
    else setDraft(handoff.text);
  });

  const accept = () => {
    setAccepted(true);
    if (waiting && chat.send(waiting)) {
      setWaiting("");
      onTaken();
    }
    requestAnimationFrame(() => (view === "text" ? input.current : dialog.current)?.focus({ preventScroll: true }));
  };

  /** Hands text to the existing contact form (kept in this tab, never in the address) and goes there. */
  const toContactForm = (text: string) => {
    if (text.trim() && !saveBrief(text)) return false;
    close();
    router.push("/contact");
    return true;
  };

  // the page behind stays still; phones: follow the part of the screen the keyboard leaves
  useLayoutEffect(() => {
    if (!open) return;
    const lenis = (window as Window & { __lenis?: Lenis }).__lenis;
    const overflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    lenis?.stop();
    const viewport = window.visualViewport;
    const fit = () => {
      const el = root.current;
      if (!el || !viewport) return;
      el.style.height = `${viewport.height}px`;
      el.style.transform = `translateY(${viewport.offsetTop}px)`;
    };
    fit();
    viewport?.addEventListener("resize", fit);
    viewport?.addEventListener("scroll", fit);
    return () => {
      viewport?.removeEventListener("resize", fit);
      viewport?.removeEventListener("scroll", fit);
      document.documentElement.style.overflow = overflow;
      lenis?.start();
    };
  }, [open]);

  // the window grows out of the hero's box
  useLayoutEffect(() => {
    const el = dialog.current;
    const from = handoff?.origin;
    if (!open || !el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!from) return void el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: "ease-out" });
    const to = el.getBoundingClientRect();
    const px = (n: number) => `${Math.max(0, n)}px`;
    el.animate(
      [
        { clipPath: `inset(${px(from.top - to.top)} ${px(to.right - from.right)} ${px(to.bottom - from.bottom)} ${px(from.left - to.left)} round 20px)`, opacity: 0.6 },
        { clipPath: "inset(0px 0px 0px 0px round 0px)", opacity: 1 },
      ],
      { duration: 420, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once for each opening
  }, [open]);

  if (!open) return null;

  const lastSaid = chat.messages.findLast((m) => m.from === "visitor")?.text ?? (waiting || draft);
  const lastReply = chat.messages.at(-1);
  const suggestions =
    lastReply?.from === "assistant" && lastReply.state === "done" ? (lastReply.response?.actions.filter((a) => a.type === "suggest_reply").map((a) => a.label) ?? []) : chat.messages.length === 0 && accepted ? STARTERS : [];
  // the brief is already in front of the visitor when the latest reply carries its card
  const briefShowing = lastReply?.from === "assistant" && !!lastReply.response?.components.some((c) => c.type === "project_brief");
  const send = (text: string) => {
    if (chat.send(text) && text === draft) setDraft("");
  };
  const cards: CardActions = {
    brief: chat.brief,
    confirmed: chat.confirmed,
    onReviewBrief: () => setPanel("edit"),
    onConfirmBrief: () => chat.saveBriefEdits(chat.brief),
    onShare: () => setPanel("share"),
    onContact: () => setPanel("contact"),
  };
  const onAction = (a: Action) => {
    if (a.type === "review_brief") setPanel("edit");
    if (a.type === "open_contact") setPanel("contact");
  };
  const fresh = () => {
    chat.reset();
    leaveVoice();
    setDraft("");
    setWaiting("");
    setPanel(null);
    announce("New conversation");
    requestAnimationFrame(() => input.current?.focus({ preventScroll: true }));
  };

  return createPortal(
    <div ref={root} data-lenis-prevent data-ai-workspace className="theme-light fixed inset-x-0 top-0 z-[150] flex h-[100dvh] items-stretch justify-center bg-page/85 backdrop-blur-md sm:p-3 lg:p-4">
      <div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-title"
        tabIndex={-1}
        className="relative flex h-full w-full max-w-[1600px] flex-col overflow-hidden bg-surface text-content shadow-[0_40px_100px_-50px_rgba(11,15,25,0.45),0_0_0_1px_rgba(11,15,25,0.06)] sm:rounded-section"
      >
        <header className="flex shrink-0 items-center gap-2 border-b border-border px-3 pb-2 pt-[max(0.5rem,env(safe-area-inset-top))] sm:px-5 sm:py-3">
          <span className="flex min-w-0 flex-1 items-center gap-2 sm:gap-2.5">
            <MarkSvg className="h-7 w-7 shrink-0" id="ai-mark" />
            <span className="min-w-0">
              <h2 id="ai-title" className="truncate font-urbanist text-[16px] font-bold leading-tight text-content">
                CodeShaper AI
              </h2>
              <p className="truncate text-[12px] leading-tight text-content-muted">
                <span className="max-sm:hidden">AI consultant · prototype</span>
                <span className="sm:hidden">AI · prototype</span>
              </p>
            </span>
          </span>
          {/* phones: no room beside the name; the composer's microphone and the voice screen's "Switch to text" do this */}
          <div role="group" aria-label="How to talk" className="hidden shrink-0 rounded-full bg-surface-soft p-1 ring-1 ring-border sm:flex">
            {([["text", "Text", MessageSquareText], ["voice", "Voice", Mic]] as const).map(([v, label, Icon]) => (
              <button
                key={v}
                type="button"
                aria-pressed={view === v}
                onClick={() => (v === "text" ? showText() : (chat.stop(), setView("voice")))}
                className={`inline-flex h-9 items-center gap-1.5 rounded-full px-3 font-urbanist text-[13px] font-semibold transition-colors ${view === v ? "bg-surface text-content shadow-[0_2px_8px_-3px_rgba(11,15,25,0.28)]" : "text-content-muted hover:text-content"}`}
              >
                <Icon size={14} aria-hidden />
                {label}
              </button>
            ))}
          </div>
          <span className="flex shrink-0 items-center justify-end sm:flex-1">
            <button type="button" className={HEADER_BUTTON} aria-expanded={lab} aria-controls="ai-lab" onClick={() => setLab((o) => !o)} aria-label="Prototype controls" title="Prototype controls">
              <FlaskConical size={17} aria-hidden />
            </button>
            {chat.messages.length > 0 && (
              <button type="button" className={HEADER_BUTTON} onClick={fresh} aria-label="New conversation" title="New conversation">
                <SquarePen size={17} aria-hidden />
              </button>
            )}
            <button type="button" className={HEADER_BUTTON} onClick={close} aria-label="Close consultation" title="Close">
              <X size={19} aria-hidden />
            </button>
          </span>
        </header>

        {lab && (
          <div id="ai-lab" className="absolute right-3 top-[60px] z-30 w-[260px] rounded-panel border border-border-strong bg-surface p-4 text-[13px] shadow-[0_18px_40px_-20px_rgba(11,15,25,0.4)] sm:right-5">
            <p className="font-urbanist font-bold">Prototype controls</p>
            <p className="mt-0.5 text-[12px] text-content-muted">For review only. Not part of the product.</p>
            <label className="mt-3 block font-semibold">
              Next reply
              <select value={chat.scenario} onChange={(e) => chat.setScenario(e.target.value as Scenario)} className="mt-1 h-10 w-full rounded-control border border-border-strong bg-surface px-2">
                {SCENARIOS.map(([v, label]) => (
                  <option key={v} value={v}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="mt-2 flex min-h-10 items-center gap-2">
              <input type="checkbox" checked={denyMicrophone} onChange={(e) => setDenyMicrophone(e.target.checked)} /> Microphone is blocked
            </label>
            <label className="flex min-h-10 items-center gap-2">
              <input type="checkbox" checked={failTranscription} onChange={(e) => setFailTranscription(e.target.checked)} /> Transcription fails
            </label>
          </div>
        )}

        {!accepted ? (
          <div data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto">
            <div className="mx-auto flex min-h-full w-full max-w-[560px] flex-col justify-center px-5 py-8">
              <h3 className="font-urbanist text-[26px] font-bold leading-tight tracking-[-0.015em]">Before we start</h3>
              <ul className="mt-4 space-y-2.5 text-[14.5px] leading-relaxed text-content">
                <li>You are talking with an <strong>AI consultant</strong>, not a person. It can be wrong.</li>
                <li>In this prototype the replies are scripted, and nothing you write or say leaves your browser.</li>
                <li>Please leave out passwords, client data and anything confidential.</li>
                <li>It cannot agree a price, a date or a contract. A person can.</li>
              </ul>
              {waiting && (
                <div className="mt-5 rounded-panel bg-surface-soft p-4">
                  <p className="text-[12px] font-semibold text-content-muted">Your message, not sent yet</p>
                  <p className="mt-1 max-h-28 overflow-y-auto whitespace-pre-wrap break-words text-[14.5px]">{waiting}</p>
                </div>
              )}
              <div className="mt-6 flex flex-wrap gap-2">
                <button type="button" data-autofocus className={PRIMARY} onClick={accept}>
                  {waiting ? "Send and start" : "Start the consultation"}
                </button>
                {/* a browser that will not keep the text: show it, so it can be copied */}
                <button type="button" className={OUTLINE} onClick={() => !toContactForm(waiting || draft) && setPanel("contact")}>
                  <Mail size={15} aria-hidden /> Use the contact form instead
                </button>
                <Link href="/contact" data-booking className={OUTLINE}>
                  <CalendarClock size={15} aria-hidden /> Book a call
                </Link>
              </div>
            </div>
          </div>
        ) : view === "voice" ? (
          <VoiceView voice={voice} dispatch={dispatch} chat={chat} failTranscription={failTranscription} denyMicrophone={denyMicrophone} onText={showText} />
        ) : (
          <>
            <Conversation chat={chat} cards={cards} onAction={onAction}>
              {chat.messages.length === 0 && (
                <div className="py-[8vh] text-center">
                  <h3 className="font-urbanist text-[28px] font-bold leading-tight tracking-[-0.02em]">What would you like to build?</h3>
                  <p className="mx-auto mt-2 max-w-md text-[14.5px] leading-relaxed text-content-muted">Describe an idea or a problem, or ask about our work. You can bring in a person at any point.</p>
                </div>
              )}
            </Conversation>
            {hasBrief(chat.brief) && !chat.busy && !briefShowing && (
              <div className="mx-auto flex w-full max-w-[800px] justify-end px-4 pb-1 sm:px-6">
                <button type="button" onClick={() => setPanel("edit")} className="min-h-8 text-[12.5px] font-semibold text-content underline decoration-border-strong underline-offset-4 hover:decoration-content">
                  Your brief so far
                </button>
              </div>
            )}
            <Composer inputRef={input} value={draft} onChange={setDraft} busy={chat.busy} suggestions={suggestions} onSend={send} onStop={chat.stop} onVoice={() => (chat.stop(), setView("voice"))} onContact={() => setPanel("contact")} />
          </>
        )}

        {panel && <BriefPanel key={panel === "edit" ? "edit" : "send"} view={panel} brief={chat.brief} fallback={lastSaid} onView={setPanel} onSave={chat.saveBriefEdits} onContinue={toContactForm} onClose={() => setPanel(null)} />}
        <p role="status" aria-live="polite" className="sr-only">
          {announcement}
        </p>
      </div>
    </div>,
    document.body,
  );
}
