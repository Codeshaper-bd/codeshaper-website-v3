"use client";

import { useCallback, useEffect, useLayoutEffect, useReducer, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type Lenis from "lenis";
import { ArrowUpRight, CalendarClock, MessageSquareText, Mic, MoreHorizontal, SquarePen, UserRound, X } from "lucide-react";
import MarkSvg from "@/components/brand/MarkSvg";
import type { Scenario } from "@/lib/ai/mockConsultant";
import { initialVoice, voiceReducer } from "@/lib/ai/voiceMachine";
import type { CardActions } from "./Cards";
import { BODY, FIELD, FIELD_LABEL, GHOST, ICON, META, PRIMARY, SECONDARY } from "./ui";
import Composer from "./Composer";
import Conversation, { AssistantTurn, holders, Steps, VisitorTurn } from "./Conversation";
import HeroBackdrop from "@/components/system/HeroBackdrop";
import { useActions, type BookingResult, type InquiryResult } from "./useActions";
import type { Reply } from "./useConsultation";
import { useConsultation } from "./useConsultation";
import { useDialog } from "./useDialog";
import styles from "./ai.module.css";
import VoiceView from "./VoiceView";
import type { Founder } from "@/lib/founders";
import { VOICE_STYLES, type VoiceStyle } from "./VoiceVisual";

/**
 * PROTOTYPE (UX02): the website turned conversational. A full-screen canvas on the hero's own
 * background, one centred column, and everything (brief, inquiry, booking) completed inside it.
 * For assistive technology it is a dialog: focus stays in it, Escape closes it, the page waits.
 * No backend, no microphone, nothing stored, every action simulated.
 */
export type Handoff = { id: number; text: string; mode: "text" | "voice"; origin?: DOMRect };
/** `onClose` gets the unsent words, so the homepage box can hold them again. */
type Props = { open: boolean; handoff: Handoff | null; founders: Founder[]; onClose: (draft: string) => void; onTaken: () => void };

const SCENARIOS: [Scenario, string][] = [
  ["normal", "Normal replies"],
  ["unavailable", "AI unavailable"],
  ["budget_exhausted", "Budget used up"],
  ["rate_limited", "Rate limited"],
  ["session_expired", "Session expired"],
  ["network", "Network failure"],
];
const STARTERS = ["I want to build a SaaS product", "Automate a business process", "What services do you offer?", "Show me case studies"];
const HEADER_BUTTON = `${ICON} !text-content`;
const MENU_ITEM = "flex h-9 w-full items-center gap-2.5 rounded-[8px] px-2.5 text-left font-urbanist text-[13.5px] font-semibold text-content hover:bg-surface-soft max-sm:h-11 pointer-coarse:h-11";

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
/** Where the composer starts or ends its journey: over the hero's box. */
function over(box: DOMRect, composer: DOMRect) {
  return { transform: `translate(${box.left + box.width / 2 - (composer.left + composer.width / 2)}px, ${box.top - composer.top}px) scaleX(${box.width / composer.width})` };
}

export default function Workspace({ open, handoff, founders, onClose, onTaken }: Props) {
  const [announcement, setAnnouncement] = useState("");
  const announce = useCallback((t: string) => setAnnouncement(t), []);
  const actions = useActions(announce);
  const chat = useConsultation(announce, actions.prefill);
  const [view, setView] = useState<"text" | "voice">("text");
  const [voice, dispatch] = useReducer(voiceReducer, initialVoice);
  const [draft, setDraft] = useState("");
  /** the first-use note has been read; the visitor's first words wait until then */
  const [accepted, setAccepted] = useState(false);
  const [waiting, setWaiting] = useState("");
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
  const backdrop = useRef<HTMLDivElement>(null);
  const composer = useRef<HTMLDivElement>(null);

  const leaveVoice = () => {
    // ending and restarting keeps the (simulated) permission, and stops every voice timer
    dispatch({ type: "END" });
    dispatch({ type: "RESTART" });
  };
  const showText = (text?: string) => {
    leaveVoice();
    if (text) setDraft(text);
    setView("text");
    requestAnimationFrame(() => input.current?.focus({ preventScroll: true }));
  };
  const finishClose = () => {
    closing.current = false;
    onClose(draft || waiting);
  };
  /** The composer goes back to the hero's box while the canvas fades, and the homepage is there again. */
  const close = (animated = true) => {
    if (closing.current) return;
    chat.stop();
    leaveVoice();
    setMenu(false);
    const el = dialog.current;
    if (!animated || !el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return finishClose();
    closing.current = true;
    const home = document.querySelector("#hero-brief")?.closest("form")?.getBoundingClientRect();
    const box = composer.current;
    if (box && home && home.bottom > 0 && home.top < window.innerHeight) {
      box.animate([{ transform: "none" }, over(home, box.getBoundingClientRect())], { duration: 380, easing: EASE, fill: "forwards" });
    }
    // the words leave first, so they never lie over the homepage's; then the colour hands over
    el.querySelectorAll<HTMLElement>("[data-arrives]").forEach((part) => part.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, easing: "ease-in", fill: "forwards" }));
    const background = backdrop.current;
    if (!background) return finishClose();
    const fade = background.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, delay: 110, easing: "ease-in-out", fill: "both" });
    fade.finished.then(finishClose, finishClose);
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
    else if (chat.send(handoff.text)) {
      setDraft((d) => (d === handoff.text ? "" : d));
      onTaken();
    } else setDraft(handoff.text);
  });

  const accept = () => {
    setAccepted(true);
    if (waiting && chat.send(waiting)) {
      setWaiting("");
      onTaken();
    }
    requestAnimationFrame(() => (view === "text" ? input.current : dialog.current)?.focus({ preventScroll: true }));
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

  // the homepage becomes the conversation: the background fades up, the box travels to its place
  useLayoutEffect(() => {
    if (!open || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const from = handoff?.origin;
    const running: (Animation | undefined)[] = [backdrop.current?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 520, easing: "ease-out" })];
    dialog.current?.querySelectorAll<HTMLElement>("[data-arrives]").forEach((el) =>
      running.push(el.animate([{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "none" }], { duration: 520, delay: 160, easing: EASE, fill: "backwards" })),
    );
    const box = composer.current;
    if (box && from) running.push(box.animate([over(from, box.getBoundingClientRect()), { transform: "none" }], { duration: 560, easing: EASE }));
    // undone if this runs twice (development): otherwise the box would be measured mid-journey
    return () => running.forEach((a) => a?.cancel());
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once for each opening
  }, [open]);

  if (!open) return null;

  const toVoice = () => {
    chat.stop();
    setView("voice");
  };
  const send = (text: string) => {
    // until the note is accepted, words only wait
    if (!accepted) {
      setWaiting(text);
      setDraft("");
      return;
    }
    if (chat.send(text) && text === draft) setDraft("");
  };
  /** The inline contact and booking steps. No AI is involved, so they work before the note is accepted. */
  const step = (kind: "contact" | "booking") => {
    setMenu(false);
    if (!accepted) setView("text");
    chat.open(kind);
  };
  const cards: CardActions = {
    founders,
    brief: chat.brief,
    confirmed: chat.confirmed,
    onSaveBrief: chat.editBrief,
    onConfirmBrief: chat.confirmBrief,
    onContact: () => step("contact"),
    onBook: () => step("booking"),
  };
  const fresh = () => {
    setMenu(false);
    chat.reset();
    actions.restart();
    leaveVoice();
    setDraft("");
    setWaiting("");
    announce("New conversation");
    requestAnimationFrame(() => input.current?.focus({ preventScroll: true }));
  };
  const pick = (run: () => void) => () => {
    setMenu(false);
    run();
  };
  const held = holders(chat.messages);
  const latest = chat.messages.findLast((m): m is Reply => m.from === "assistant" && m.state === "done");
  const voiceStep = latest && (latest.proposals?.length || latest.response?.components.length) ? <Steps reply={latest} cards={cards} actions={actions} held={held} /> : undefined;

  /** The first-use note, in the conversation. Until it is accepted nothing reaches the assistant. */
  const note = (
    <>
      <p className={BODY}>
        Before I read anything: I&rsquo;m an <strong>AI consultant</strong>, not a person, and I can be wrong. In this prototype my replies are scripted and nothing you write or say leaves your browser. Please leave out anything confidential. I can&rsquo;t agree a price, a date or a contract.
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <button type="button" data-autofocus className={PRIMARY} onClick={accept}>
          {waiting && view === "text" ? "Send my message" : view === "voice" ? "Agree and use voice" : "Agree and start"}
        </button>
        <button type="button" className={SECONDARY} onClick={() => step("contact")}>
          Contact the team without AI
        </button>
      </div>
      <p className={`mt-1.5 ${META}`}>
        <a href="/privacy" target="_blank" rel="noopener" className="font-medium text-content underline decoration-border-strong underline-offset-4">
          Privacy information<span className="sr-only"> (opens in a new tab)</span>
        </a>{" "}
        · Draft wording, awaiting privacy and legal review.
      </p>
    </>
  );

  const HEAD_LINK = `${GHOST} hover:!bg-white/70 max-lg:hidden`;

  return createPortal(
    <div ref={root} data-lenis-prevent data-ai-workspace className={`theme-light fixed inset-x-0 top-0 z-[150] h-[100dvh] ${styles.canvas}`}>
      <div ref={dialog} role="dialog" aria-modal="true" aria-labelledby="ai-title" tabIndex={-1} className="relative flex h-full w-full flex-col text-content">
        {/* the homepage hero's own background, calmer, so words stay easy to read */}
        <div ref={backdrop} aria-hidden data-canvas-background className="absolute inset-0 -z-10 overflow-hidden bg-white">
          <div className={`absolute inset-0 isolate ${styles.calm}`}>
            <HeroBackdrop />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/65 to-white/35" />
        </div>

        <header data-arrives className="shrink-0 pt-[env(safe-area-inset-top)]">
          <div className="mx-auto flex w-full max-w-7xl items-center gap-2 py-2 pl-4 pr-2 sm:px-6 sm:py-4 lg:px-10 [@media(max-height:540px)]:py-1">
            <span className="flex min-w-0 flex-1 items-center gap-2.5">
              <MarkSvg premium pearls className="h-8 w-8 shrink-0 drop-shadow-[0_3px_8px_rgba(97,95,255,0.35)]" id="ai-mark" />
              <span className="min-w-0 sm:flex sm:items-center sm:gap-2.5">
                <h2 id="ai-title" className="whitespace-nowrap font-urbanist text-[19px] font-extrabold leading-tight tracking-[-0.02em] text-content sm:text-[21px]">
                  CodeShaper<span className="sr-only"> AI</span>
                </h2>
                <p className="w-fit whitespace-nowrap text-[11.5px] leading-tight text-content-muted sm:rounded-full sm:bg-white/70 sm:px-2.5 sm:py-1 sm:ring-1 sm:ring-border">
                  <span className="max-xl:hidden">AI consultant · prototype</span>
                  <span className="xl:hidden">AI · prototype</span>
                </p>
              </span>
            </span>
            {/* phones: the composer's microphone and the voice screen's "Switch to text" do this */}
            <div role="group" aria-label="How to talk" className="hidden shrink-0 rounded-[11px] bg-white/75 p-0.5 ring-1 ring-border sm:flex">
              {([["text", "Text", MessageSquareText], ["voice", "Voice", Mic]] as const).map(([v, label, Icon]) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={view === v}
                  onClick={() => (v === "text" ? showText() : toVoice())}
                  className={`inline-flex h-8 items-center gap-1.5 rounded-[9px] px-3 font-urbanist text-[13px] font-semibold transition-colors pointer-coarse:h-10 ${view === v ? "bg-content text-surface" : "text-content-muted hover:text-content"}`}
                >
                  <Icon size={15} aria-hidden />
                  {label}
                </button>
              ))}
            </div>
            <span className="flex shrink-0 items-center justify-end gap-0.5 sm:flex-1">
              <button type="button" className={HEAD_LINK} onClick={() => step("contact")}>
                <UserRound size={14} aria-hidden /> Contact
              </button>
              <button type="button" className={HEAD_LINK} onClick={() => step("booking")}>
                <CalendarClock size={14} aria-hidden /> Book a call
              </button>
              <button type="button" className={HEADER_BUTTON} aria-expanded={menu} aria-controls="ai-menu" onClick={() => setMenu((o) => !o)} aria-label="More options" title="More options">
                <MoreHorizontal size={18} aria-hidden />
              </button>
              <button type="button" className={HEADER_BUTTON} onClick={() => close()} aria-label="Close consultation" title="Back to the website">
                <X size={18} aria-hidden />
              </button>
            </span>
          </div>
        </header>

        {menu && (
          <>
            <div aria-hidden className="absolute inset-0 z-30" onMouseDown={() => setMenu(false)} />
            <div ref={menuBox} id="ai-menu" role="dialog" aria-label="More options" tabIndex={-1} data-lenis-prevent className={`absolute right-2 top-[calc(env(safe-area-inset-top)+60px)] z-40 max-h-[calc(100%-76px)] w-[260px] overflow-y-auto rounded-[14px] border border-content/10 bg-surface p-1.5 shadow-[0_24px_50px_-24px_rgba(11,15,25,0.45)] sm:right-5 ${styles.panel}`}>
              <button type="button" className={MENU_ITEM} onClick={() => step("contact")}>
                <UserRound size={16} aria-hidden /> Contact the team
              </button>
              <button type="button" className={MENU_ITEM} onClick={() => step("booking")}>
                <CalendarClock size={16} aria-hidden /> Book a call
              </button>
              {chat.messages.length > 0 && (
                <button type="button" className={MENU_ITEM} onClick={pick(fresh)}>
                  <SquarePen size={16} aria-hidden /> New conversation
                </button>
              )}
              <button type="button" className={`${MENU_ITEM} sm:hidden`} onClick={pick(() => (view === "text" ? toVoice() : showText()))}>
                {view === "text" ? <Mic size={16} aria-hidden /> : <MessageSquareText size={16} aria-hidden />}
                {view === "text" ? "Voice mode" : "Text mode"}
              </button>
              <fieldset className="mt-1 border-t border-border px-2.5 pb-1 pt-2.5 text-[13px]">
                <legend className="sr-only">Prototype controls</legend>
                <p aria-hidden className="font-urbanist text-[12px] font-bold uppercase tracking-[0.1em] text-content-muted">Prototype controls</p>
                {(
                  [
                    ["Voice look", look, setLook, VOICE_STYLES],
                    ["Next reply", chat.scenario, chat.setScenario, SCENARIOS],
                    ["Next inquiry", actions.inquiryResult, actions.setInquiryResult, [["ok", "Succeeds"], ["failed", "Fails"]] as [InquiryResult, string][]],
                    ["Next booking", actions.bookingResult, actions.setBookingResult, [["ok", "Succeeds"], ["slot_taken", "Time just taken"], ["failed", "Fails"]] as [BookingResult, string][]],
                  ] as [string, string, (v: never) => void, [string, string][]][]
                ).map(([label, value, set, options]) => (
                  <label key={label} className={`mt-2 ${FIELD_LABEL}`}>
                    {label}
                    <select value={value} onChange={(e) => set(e.target.value as never)} className={`${FIELD} !px-2`}>
                      {options.map(([v, text]) => (
                        <option key={v} value={v}>{text}</option>
                      ))}
                    </select>
                  </label>
                ))}
                <label className="mt-1 flex h-9 items-center gap-2 max-sm:h-11 pointer-coarse:h-11">
                  <input type="checkbox" checked={denyMicrophone} onChange={(e) => setDenyMicrophone(e.target.checked)} /> Microphone is blocked
                </label>
                <label className="flex h-9 items-center gap-2 max-sm:h-11 pointer-coarse:h-11">
                  <input type="checkbox" checked={failTranscription} onChange={(e) => setFailTranscription(e.target.checked)} /> Transcription fails
                </label>
              </fieldset>
            </div>
          </>
        )}

        <div data-arrives className="flex min-h-0 flex-1 flex-col">
          {view === "voice" ? (
            <VoiceView
              voice={voice}
              dispatch={dispatch}
              chat={chat}
              look={look}
              failTranscription={failTranscription}
              denyMicrophone={denyMicrophone}
              notice={accepted ? undefined : <div className="mt-6 w-full max-w-[560px] text-left">{note}</div>}
              step={voiceStep}
              onBook={() => step("booking")}
              onText={showText}
            />
          ) : (
            <Conversation chat={chat} cards={cards} actions={actions} onSend={send}>
              {!accepted && (
                <div className={`space-y-6 ${chat.messages.length ? "mb-6" : "my-auto"}`}>
                  {waiting && <VisitorTurn text={waiting} note="Not sent yet" />}
                  <AssistantTurn>{note}</AssistantTurn>
                </div>
              )}
              {accepted && chat.messages.length === 0 && (
                <div className="my-auto py-6">
                  <h3 className="max-w-xl text-balance font-urbanist text-[26px] font-extrabold leading-[1.15] tracking-[-0.02em] sm:text-[32px]">What would you like to build?</h3>
                  <p className="mt-2 max-w-md text-[15px] leading-relaxed text-content-muted">Describe an idea or a problem, or ask about our work. A person is one step away.</p>
                  <ul aria-label="Suggested questions" className="mt-5 grid gap-x-8 border-t border-border sm:grid-cols-2">
                    {STARTERS.map((t) => (
                      <li key={t} className="border-b border-border">
                        <button type="button" onClick={() => send(t)} className="group flex min-h-11 w-full items-center justify-between gap-3 text-left font-urbanist text-[14.5px] font-semibold text-content">
                          {t}
                          <ArrowUpRight size={14} aria-hidden className="shrink-0 text-content-muted transition-[color,transform] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Conversation>
          )}
        </div>

        {/* the same box all the way: the hero's, now where the conversation is written */}
        {view === "text" && (
          <div ref={composer} className={`shrink-0 origin-top ${styles.writer}`}>
            <Composer inputRef={input} value={draft} onChange={setDraft} busy={chat.busy} waiting={!accepted} onSend={send} onStop={chat.stop} onVoice={toVoice} />
          </div>
        )}

        <p role="status" aria-live="polite" className="sr-only">
          {announcement}
        </p>
      </div>
    </div>,
    document.body,
  );
}
