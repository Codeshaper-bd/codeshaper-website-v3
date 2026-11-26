"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useReducer, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import type Lenis from "lenis";
import { ArrowUpRight, CalendarClock, FileText, MessageSquareText, Mic, MoreHorizontal, SquarePen, UserRound, X } from "lucide-react";
import MarkSvg from "@/components/brand/MarkSvg";
import { saveBrief } from "@/lib/briefHandoff";
import { hasBrief, type Action } from "@/lib/ai/contract";
import type { Scenario } from "@/lib/ai/mockConsultant";
import { initialVoice, voiceReducer } from "@/lib/ai/voiceMachine";
import BriefPanel, { type PanelView } from "./BriefPanel";
import { OUTLINE, PRIMARY, type CardActions } from "./Cards";
import Composer from "./Composer";
import Conversation, { AssistantTurn, BODY, VisitorTurn } from "./Conversation";
import { useConsultation } from "./useConsultation";
import { useDialog } from "./useDialog";
import styles from "./ai.module.css";
import VoiceView from "./VoiceView";
import type { Founder } from "@/lib/founders";
import { VOICE_STYLES, type VoiceStyle } from "./VoiceVisual";

/**
 * PROTOTYPE (UX01): the full-screen AI consultation window. One centred column: conversation first,
 * cards and the brief only when asked for or relevant. No backend, no microphone, nothing stored.
 */
export type Handoff = { id: number; text: string; mode: "text" | "voice"; origin?: DOMRect };
type Props = { open: boolean; handoff: Handoff | null; founders: Founder[]; onClose: () => void; onTaken: () => void };

const SCENARIOS: [Scenario, string][] = [
  ["normal", "Normal replies"],
  ["unavailable", "AI unavailable"],
  ["budget_exhausted", "Budget used up"],
  ["rate_limited", "Rate limited"],
  ["session_expired", "Session expired"],
  ["network", "Network failure"],
];
const STARTERS = ["I want to build a SaaS product", "Automate a business process", "What services do you offer?", "Show me case studies"];
const HEADER_BUTTON = "grid h-11 w-11 shrink-0 place-items-center rounded-full text-content transition-colors hover:bg-surface-soft";
const MENU_ITEM = "flex min-h-11 w-full items-center gap-2.5 rounded-control px-3 text-left font-urbanist text-[14px] font-semibold text-content hover:bg-surface-soft";

/** The part of the window that lies over the hero's box, as a clip. */
function inset(box: DOMRect, within: DOMRect) {
  const px = (n: number) => `${Math.max(0, n)}px`;
  return `inset(${px(box.top - within.top)} ${px(within.right - box.right)} ${px(within.bottom - box.bottom)} ${px(box.left - within.left)} round 20px)`;
}

export default function Workspace({ open, handoff, founders, onClose, onTaken }: Props) {
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
  const [menu, setMenu] = useState(false);
  const [look, setLook] = useState<VoiceStyle>("orb");
  const closing = useRef(false);
  const menuBox = useRef<HTMLDivElement>(null);
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
  const finishClose = () => {
    closing.current = false;
    onClose();
  };
  /** Back into the hero's box, the way it came. */
  const close = (animated = true) => {
    if (closing.current) return;
    chat.stop();
    leaveVoice();
    setPanel(null);
    setMenu(false);
    const el = dialog.current;
    const home = document.querySelector("#hero-brief")?.closest("form")?.getBoundingClientRect();
    if (!animated || !el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return finishClose();
    closing.current = true;
    const to = el.getBoundingClientRect();
    const visible = home && home.bottom > 0 && home.top < window.innerHeight;
    const run = el.animate(
      [{ clipPath: "inset(0px 0px 0px 0px round 0px)", opacity: 1 }, { clipPath: visible ? inset(home, to) : "inset(0px 0px 0px 0px round 0px)", opacity: 0 }],
      { duration: 240, easing: "cubic-bezier(0.4, 0, 0.2, 1)", fill: "forwards" },
    );
    run.finished.then(finishClose, finishClose);
  };
  useDialog(dialog, open, () => close());
  useDialog(menuBox, open && menu, () => setMenu(false));

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
    close(false);
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
    el.animate(
      [
        { clipPath: inset(from, el.getBoundingClientRect()), opacity: 0.6 },
        { clipPath: "inset(0px 0px 0px 0px round 0px)", opacity: 1 },
      ],
      { duration: 420, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once for each opening
  }, [open]);

  if (!open) return null;

  const lastSaid = chat.messages.findLast((m) => m.from === "visitor")?.text ?? (waiting || draft);
  const send = (text: string) => {
    if (chat.send(text) && text === draft) setDraft("");
  };
  const cards: CardActions = {
    founders,
    brief: chat.brief,
    confirmed: chat.confirmed,
    onReviewBrief: () => setPanel("edit"),
    onConfirmBrief: () => chat.saveBriefEdits(chat.brief),
    onContinue: () => setPanel("share"),
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

  const pick = (run: () => void) => () => {
    setMenu(false);
    run();
  };
  const toVoice = () => {
    chat.stop();
    setView("voice");
  };
  const briefReady = accepted && hasBrief(chat.brief);

  /** The first-use note, in the conversation. Until it is accepted nothing is processed or sent. */
  const note = (
    <>
      <p className={BODY}>
        Before I read anything: I&rsquo;m an <strong>AI consultant</strong>, not a person, and I can be wrong. In this prototype my replies are scripted and nothing you write or say leaves your browser. Please leave out anything confidential. I can&rsquo;t agree a price, a date or a contract.
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <button type="button" data-autofocus className={PRIMARY} onClick={accept}>
          {waiting && view === "text" ? "Send my message" : view === "voice" ? "Agree and use voice" : "Agree and start"}
        </button>
        {/* a browser that will not keep the text: show it, so it can be copied */}
        <button type="button" className={OUTLINE} onClick={() => !toContactForm(waiting || draft) && setPanel("contact")}>
          Use the contact form instead
        </button>
      </div>
      <p className="mt-2 text-[13px] text-content-muted">
        <a href="/privacy" target="_blank" rel="noopener" className="font-medium text-content underline decoration-border-strong underline-offset-4">
          Privacy information<span className="sr-only"> (opens in a new tab)</span>
        </a>{" "}
        · Draft wording, awaiting privacy and legal review.
      </p>
    </>
  );

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
        <header className="shrink-0 border-b border-border pt-[env(safe-area-inset-top)]">
          <div className="flex items-center gap-2 py-2 pl-4 pr-2 sm:px-5 sm:py-3 [@media(max-height:540px)]:py-1">
            <span className="flex min-w-0 flex-1 items-center gap-3">
              <MarkSvg premium className="h-8 w-8 shrink-0" id="ai-mark" />
              <span className="min-w-0">
                <h2 id="ai-title" className="whitespace-nowrap font-urbanist text-[17px] font-extrabold leading-tight tracking-[-0.01em] text-content">
                  CodeShaper AI
                </h2>
                <p className="whitespace-nowrap text-[12px] leading-tight text-content-muted">
                  <span className="max-sm:hidden">AI consultant · prototype</span>
                  <span className="sm:hidden">AI · prototype</span>
                </p>
              </span>
            </span>
            {/* phones: the composer's microphone and the voice screen's "Switch to text" do this */}
            <div role="group" aria-label="How to talk" className="hidden shrink-0 rounded-full bg-surface-soft p-1 ring-1 ring-border sm:flex">
              {([["text", "Text", MessageSquareText], ["voice", "Voice", Mic]] as const).map(([v, label, Icon]) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={view === v}
                  onClick={() => (v === "text" ? showText() : toVoice())}
                  className={`inline-flex h-10 items-center gap-1.5 rounded-full px-4 font-urbanist text-[13.5px] font-semibold transition-colors ${view === v ? "bg-surface text-content shadow-[0_2px_8px_-3px_rgba(11,15,25,0.28)]" : "text-content-muted hover:text-content"}`}
                >
                  <Icon size={15} aria-hidden />
                  {label}
                </button>
              ))}
            </div>
            <span className="flex shrink-0 items-center justify-end gap-0.5 sm:flex-1">
              {briefReady && (
                <button type="button" onClick={() => setPanel("edit")} className="inline-flex h-11 items-center gap-1.5 rounded-full px-3 font-urbanist text-[13.5px] font-semibold text-content hover:bg-surface-soft max-md:hidden">
                  <FileText size={15} aria-hidden /> Brief
                </button>
              )}
              <button type="button" onClick={() => setPanel("contact")} className="inline-flex h-11 items-center gap-1.5 rounded-full px-3 font-urbanist text-[13.5px] font-semibold text-content hover:bg-surface-soft max-lg:hidden">
                <UserRound size={15} aria-hidden /> Talk to a person
              </button>
              <button type="button" className={HEADER_BUTTON} aria-expanded={menu} aria-controls="ai-menu" onClick={() => setMenu((o) => !o)} aria-label="More options" title="More options">
                <MoreHorizontal size={20} aria-hidden />
              </button>
              <button type="button" className={HEADER_BUTTON} onClick={() => close()} aria-label="Close consultation" title="Close">
                <X size={20} aria-hidden />
              </button>
            </span>
          </div>
        </header>

        {menu && (
          <>
            <div aria-hidden className="absolute inset-0 z-30" onMouseDown={() => setMenu(false)} />
            <div ref={menuBox} id="ai-menu" role="dialog" aria-label="More options" tabIndex={-1} data-lenis-prevent className={`absolute right-2 top-[calc(env(safe-area-inset-top)+60px)] z-40 max-h-[calc(100%-76px)] w-[290px] overflow-y-auto rounded-panel border border-border-strong bg-surface p-2 shadow-[0_24px_50px_-24px_rgba(11,15,25,0.45)] sm:right-5 ${styles.panel}`}>
              <button type="button" className={MENU_ITEM} onClick={pick(() => setPanel("contact"))}>
                <UserRound size={16} aria-hidden /> Talk to a person
              </button>
              <Link href="/contact" data-booking className={MENU_ITEM} onClick={() => setMenu(false)}>
                <CalendarClock size={16} aria-hidden /> Book a call
              </Link>
              {briefReady && (
                <button type="button" className={MENU_ITEM} onClick={pick(() => setPanel("edit"))}>
                  <FileText size={16} aria-hidden /> Review brief
                </button>
              )}
              {chat.messages.length > 0 && (
                <button type="button" className={MENU_ITEM} onClick={pick(fresh)}>
                  <SquarePen size={16} aria-hidden /> New conversation
                </button>
              )}
              <button type="button" className={`${MENU_ITEM} sm:hidden`} onClick={pick(() => (view === "text" ? toVoice() : showText()))}>
                {view === "text" ? <Mic size={16} aria-hidden /> : <MessageSquareText size={16} aria-hidden />}
                {view === "text" ? "Voice mode" : "Text mode"}
              </button>
              <fieldset className="mt-2 border-t border-border px-3 pb-2 pt-3 text-[13px]">
                <legend className="sr-only">Prototype controls</legend>
                <p aria-hidden className="font-urbanist text-[12px] font-bold uppercase tracking-[0.1em] text-content-muted">Prototype controls</p>
                <label className="mt-2 block font-semibold">
                  Voice look
                  <select value={look} onChange={(e) => setLook(e.target.value as VoiceStyle)} className="mt-1 h-11 w-full rounded-control border border-border-strong bg-surface px-2">
                    {VOICE_STYLES.map(([v, label]) => (
                      <option key={v} value={v}>{label}</option>
                    ))}
                  </select>
                </label>
                <label className="mt-2 block font-semibold">
                  Next reply
                  <select value={chat.scenario} onChange={(e) => chat.setScenario(e.target.value as Scenario)} className="mt-1 h-11 w-full rounded-control border border-border-strong bg-surface px-2">
                    {SCENARIOS.map(([v, label]) => (
                      <option key={v} value={v}>{label}</option>
                    ))}
                  </select>
                </label>
                <label className="mt-1 flex min-h-11 items-center gap-2">
                  <input type="checkbox" checked={denyMicrophone} onChange={(e) => setDenyMicrophone(e.target.checked)} /> Microphone is blocked
                </label>
                <label className="flex min-h-11 items-center gap-2">
                  <input type="checkbox" checked={failTranscription} onChange={(e) => setFailTranscription(e.target.checked)} /> Transcription fails
                </label>
              </fieldset>
            </div>
          </>
        )}

        {view === "voice" ? (
          <VoiceView
            voice={voice}
            dispatch={dispatch}
            chat={chat}
            look={look}
            failTranscription={failTranscription}
            denyMicrophone={denyMicrophone}
            notice={accepted ? undefined : <div className="mt-6 w-full max-w-[560px] text-left">{note}</div>}
            onText={showText}
          />
        ) : (
          <>
            <Conversation chat={chat} cards={cards} onAction={onAction} onSend={send}>
              {!accepted && (
                <div className={`my-auto space-y-8 ${styles.rise}`}>
                  {waiting && <VisitorTurn text={waiting} note="Not sent yet" />}
                  <AssistantTurn>{note}</AssistantTurn>
                </div>
              )}
              {accepted && chat.messages.length === 0 && (
                <div className={`my-auto py-6 ${styles.rise}`}>
                  <MarkSvg premium pearls className="h-14 w-14" id="ai-hello" />
                  <h3 className="mt-5 max-w-xl text-balance font-urbanist text-[32px] font-extrabold leading-[1.08] tracking-[-0.025em] sm:text-[44px]">What would you like to build?</h3>
                  <p className="mt-3 max-w-md text-[16px] leading-relaxed text-content-muted">Describe an idea or a problem, or ask about our work. A person is one step away.</p>
                  <ul aria-label="Suggested questions" className="mt-7 grid gap-x-8 border-t border-border sm:grid-cols-2">
                    {STARTERS.map((t) => (
                      <li key={t} className="border-b border-border">
                        <button type="button" onClick={() => send(t)} className="group flex min-h-14 w-full items-center justify-between gap-3 text-left font-urbanist text-[15.5px] font-semibold text-content">
                          {t}
                          <ArrowUpRight size={16} aria-hidden className="shrink-0 text-content-muted transition-[color,transform] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Conversation>
            {accepted && <Composer inputRef={input} value={draft} onChange={setDraft} busy={chat.busy} onSend={send} onStop={chat.stop} onVoice={toVoice} />}
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
