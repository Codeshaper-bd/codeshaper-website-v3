"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowDown, Check, Copy, RotateCcw } from "lucide-react";
import MarkSvg from "@/components/brand/MarkSvg";
import { BRIEF_LABELS } from "@/lib/ai/contract";
import { splitQuestion, visibleWhileStreaming } from "@/lib/ai/present";
import Card, { type CardActions } from "./Cards";
import { BODY, CHIP, GHOST, ICON, META, PRIMARY, TITLE } from "./ui";
import { BookingCard, ContactCard } from "./ActionCards";
import type { Actions } from "./useActions";
import type { Consultation, Problem, Reply } from "./useConsultation";
import styles from "./ai.module.css";

const PROBLEMS: Partial<Record<Problem, { title: string; text: string; retry?: string; human?: boolean }>> = {
  busy: { title: "Another message is still being answered", text: "Wait a moment, then try again.", retry: "Try again" },
  in_progress: { title: "This message is still being answered", text: "Wait a moment, then ask for it again.", retry: "Check again" },
  duplicate: { title: "That saved reply is no longer kept", text: "Ask again to have it answered anew.", retry: "Ask again", human: true },
  session_limit: { title: "This conversation has reached its limit", text: "Start a new conversation, or reach a person.", human: true },
  conflict: { title: "That message could not be matched", text: "Please write it again." },
  too_large: { title: "That message is too long", text: "Shorten it and send it again." },
  unavailable: { title: "The assistant isn't available right now", text: "Your message is still here. Try again, or reach a person.", retry: "Try again", human: true },
  ai_disabled: { title: "The assistant is switched off", text: "You can reach a person directly.", human: true },
  budget_exhausted: { title: "The assistant has reached its limit for now", text: "It will be back later. The team can take it from here.", human: true },
  rate_limited: { title: "That was a lot of messages at once", text: "Wait a moment, then try again.", retry: "Try again" },
  session_expired: { title: "This session has expired", text: "What you wrote and your brief are still on this screen.", retry: "Continue in a new session", human: true },
  network: { title: "The connection dropped", text: "Nothing was lost. Check your connection and try again.", retry: "Try again", human: true },
};
const FALLBACK = { title: "That reply could not be shown", text: "Please try again, or reach a person.", retry: "Try again", human: true };

export { BODY };

/** The assistant's turn: its mark in the margin, its words in the reading column. */
export function AssistantTurn({ working = false, children }: { working?: boolean; children: React.ReactNode }) {
  return (
    <div className="grid gap-x-3 sm:grid-cols-[20px_minmax(0,1fr)]">
      <div className="mb-1 flex items-center gap-1.5 sm:mb-0 sm:block sm:pt-1">
        <span aria-hidden className={`block text-[#4f46e5] ${working ? styles.working : ""}`}>
          <MarkSvg className="h-[18px] w-[18px]" id="ai-turn-mark" />
        </span>
        <span aria-hidden className="font-urbanist text-[12.5px] font-bold text-content sm:hidden">CodeShaper AI</span>
      </div>
      <div className="min-w-0">
        <span className="sr-only">CodeShaper AI said: </span>
        {children}
      </div>
    </div>
  );
}

/** Which message currently holds each live card: there is only ever one of each on screen. */
/** The cards of an answer: those the service sent, then any made here to design the screen. */
const cardsOf = (m: Reply) => [...(m.response?.components ?? []), ...(m.simulated?.components ?? [])];

export function holders(messages: Consultation["messages"]) {
  const last = (has: (m: Reply) => boolean) => messages.findLast((m): m is Reply => m.from === "assistant" && m.state === "done" && has(m))?.id;
  return {
    brief: last((m) => cardsOf(m).some((c) => c.type === "project_brief")),
    contact: last((m) => !!m.proposals?.some((p) => p.type === "contact_capture")),
    booking: last((m) => !!m.proposals?.some((p) => p.type === "booking_calendar")),
  };
}
export type Holders = ReturnType<typeof holders>;

/** The cards an answer carries. Used by the text conversation and, for the latest answer, by voice. */
export function Steps({ reply, cards, actions, held }: { reply: Reply; cards: CardActions; actions: Actions; held: Holders }) {
  const components = cardsOf(reply).filter((c) => c.type !== "project_brief" || reply.id === held.brief);
  const proposals = (reply.proposals ?? []).filter((p) => (p.type !== "contact_capture" || reply.id === held.contact) && (p.type !== "booking_calendar" || reply.id === held.booking));
  if (!components.length && !proposals.length) return null;
  return (
    <div className={`mt-3.5 space-y-4 ${styles.rise}`}>
      {reply.synthetic && <p className={`border-t border-dashed border-content/20 pt-2 ${META}`}>Below: simulated here in your browser, not sent by the AI service.</p>}
      {proposals.map((p) =>
        p.type === "brief_changes" ? (
          <ul key={p.type} aria-label="What changed in the draft" className="space-y-0.5 border-l-2 border-brand/60 pl-3">
            {p.changes.map((c) => (
              <li key={c.field} className="text-[13px] text-content">
                <strong className="font-urbanist">{BRIEF_LABELS[c.field]}:</strong> <span className="text-content-muted line-through">{c.before || "not set"}</span> <span aria-hidden>→</span>
                <span className="sr-only"> is now </span> {c.after || "removed"}
              </li>
            ))}
          </ul>
        ) : null,
      )}
      {components.map((c, i) => (
        <Card key={`${c.type}-${i}`} component={c} actions={cards} />
      ))}
      {proposals.map((p) =>
        p.type === "contact_capture" ? (
          <ContactCard key={`contact-${actions.round}`} actions={actions} brief={cards.brief} />
        ) : p.type === "booking_calendar" ? (
          <BookingCard key={`booking-${actions.round}`} actions={actions} calendar={p} />
        ) : null,
      )}
    </div>
  );
}

export function VisitorTurn({ text, note, latest }: { text: string; note?: string; latest?: boolean }) {
  return (
    <div data-latest-visitor={latest || undefined} className="flex flex-col items-end">
      <p className="max-w-[88%] whitespace-pre-wrap break-words rounded-[14px] rounded-br-[5px] bg-brand-soft px-3.5 py-2 text-[15px] leading-[1.6] text-content sm:max-w-[75%]">
        <span className="sr-only">You said: </span>
        {text}
      </p>
      {note && <p className={`mt-1 ${META}`}>{note}</p>}
    </div>
  );
}

/** "Try again" waits out the time the server asked for. */
function RetryButton({ label, wait, disabled, onClick }: { label: string; wait: number; disabled: boolean; onClick: () => void }) {
  const [left, setLeft] = useState(wait);
  useEffect(() => {
    if (left <= 0) return;
    const t = window.setTimeout(() => setLeft(left - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);
  return (
    <button type="button" className={PRIMARY} onClick={onClick} disabled={disabled || left > 0}>
      <RotateCcw size={13} aria-hidden />
      {left > 0 ? `${label} in ${left}s` : label}
    </button>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState<"" | "yes" | "no">("");
  const copy = () =>
    navigator.clipboard
      .writeText(text)
      .then(() => setCopied("yes"))
      .catch(() => setCopied("no"));
  return (
    <span className="inline-flex items-center">
      <button type="button" onClick={copy} aria-label="Copy reply" title="Copy reply" className={`${ICON} -ml-2.5`}>
        {copied === "yes" ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />}
      </button>
      <span role="status" className="text-[12.5px] text-content-muted">
        {copied === "yes" ? "Copied" : copied === "no" ? "Could not copy" : ""}
      </span>
    </span>
  );
}

type TurnProps = { reply: Reply; latest: boolean; chat: Consultation; cards: CardActions; actions: Actions; held: Holders; onSend: (text: string) => void };

/** Only the latest reply can be tried again: an older one would be answered out of order. */
function Answer({ reply, latest, chat, cards, actions, held, onSend }: TurnProps) {
  const done = reply.state === "done";
  const problem = reply.problem ? (PROBLEMS[reply.problem] ?? FALLBACK) : null;
  // a retry is offered only where it makes sense and the server has not ruled it out
  const canRetry = latest && !!problem?.retry && reply.retry !== "none";
  const components = done ? cardsOf(reply) : [];
  const carries = components.length > 0 || (done && !!reply.proposals?.length);
  // with something to show, the question moves below it, where the visitor will answer it
  const { lead, question } = carries ? splitQuestion(reply.text) : { lead: reply.state === "streaming" ? visibleWhileStreaming(reply.text) : reply.text, question: null };
  const offered = done ? [...(reply.response?.actions ?? []), ...(reply.simulated?.actions ?? [])] : [];
  const suggestions = latest && !chat.busy ? offered.filter((a) => a.type === "suggest_reply") : [];
  // a button a card already offers is not offered twice
  const buttons = carries ? [] : offered.filter((a) => a.type === "book_consultation" || a.type === "open_contact");

  return (
    <AssistantTurn working={reply.state === "thinking" || reply.state === "streaming"}>
      {reply.state === "thinking" && (
        <p className="flex min-h-6 items-center gap-2 text-[14px] text-content-muted">
          Thinking
          <span aria-hidden className={styles.dots}>
            <i />
            <i />
            <i />
          </span>
        </p>
      )}
      {lead && (
        <p className={`whitespace-pre-wrap break-words ${BODY}`}>
          {lead}
          {reply.state === "streaming" && <span aria-hidden className={styles.caret} />}
        </p>
      )}
      {reply.state === "cancelled" && (
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <span className="text-[13.5px] text-content-muted">{reply.requestId ? "Reply stopped. A call already made may still be charged." : "Reply stopped."}</span>
          {latest && reply.retry !== "none" && (
            <button type="button" className={GHOST} onClick={() => chat.retry(reply.id)} disabled={chat.busy}>
              <RotateCcw size={13} aria-hidden /> {reply.retry === "new_attempt" ? "Try again (new attempt)" : "Try again"}
            </button>
          )}
        </div>
      )}
      {problem && (
        <div role="alert" data-problem={reply.problem}>
          <p className={`flex items-start gap-2 ${TITLE}`}>
            <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />
            {problem.title}
          </p>
          <p className="mt-0.5 text-[14px] leading-relaxed text-content-muted">{problem.text}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {canRetry && <RetryButton label={reply.retry === "new_attempt" ? `${problem.retry} (new attempt)` : problem.retry!} wait={reply.retryAfter ?? 0} disabled={chat.busy} onClick={() => chat.retry(reply.id)} />}
            {problem.human && (
              <>
                <button type="button" className={canRetry ? GHOST : PRIMARY} onClick={cards.onBook}>
                  Book a call
                </button>
                <button type="button" className={GHOST} onClick={cards.onContact}>
                  Write to the team
                </button>
              </>
            )}
          </div>
        </div>
      )}
      {done && <Steps reply={reply} cards={cards} actions={actions} held={held} />}
      {question && <p data-question className={`mt-4 font-medium ${BODY} ${styles.rise}`}>{question}</p>}
      {done && !!reply.response?.sources.length && (
        <p className={`mt-2.5 ${META}`}>
          From the website:{" "}
          {reply.response.sources.map((s, i) => (
            <span key={s.path}>
              {i > 0 && " · "}
              <a href={s.path} target="_blank" rel="noopener" className="font-medium text-content underline decoration-border-strong underline-offset-4 hover:decoration-content">
                {s.title}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </span>
          ))}
        </p>
      )}
      {buttons.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {buttons.map((a) => (
            <button key={a.type} type="button" className={`${GHOST} border border-content/10`} onClick={a.type === "book_consultation" ? cards.onBook : cards.onContact}>
              {a.label}
            </button>
          ))}
        </div>
      )}
      {reply.stopping && <p className={`mt-1 ${META}`}>Stopping. A call already made may still be charged.</p>}
      {done && reply.synthetic && <p className={`mt-1 ${META}`}>Synthetic reply from the test service{reply.response?.replayed ? " (saved copy, not charged again)" : ""}.</p>}
      {done && !reply.local && (
        <div className="mt-1">
          <CopyButton text={reply.text} />
        </div>
      )}
      {suggestions.length > 0 && (
        <ul aria-label="Suggested replies" className={`mt-1.5 flex flex-wrap gap-1.5 ${styles.rise}`}>
          {suggestions.map((a) => (
            <li key={a.label}>
              <button type="button" onClick={() => onSend(a.label)} className={CHIP}>
                {a.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </AssistantTurn>
  );
}

type Props = { chat: Consultation; cards: CardActions; actions: Actions; onSend: (text: string) => void; children?: React.ReactNode };

export default function Conversation({ chat, cards, actions, onSend, children }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const stick = useRef(true);
  const [away, setAway] = useState(false);
  const count = chat.messages.length;
  const last = chat.messages.at(-1);
  const held = holders(chat.messages);
  const latestVisitor = chat.messages.findLast((m) => m.from === "visitor")?.id;

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    stick.current = true;
    el.scrollTop = el.scrollHeight;
  }, [count]);
  // the visitor's message stays on top so a reply is read from its start; once the reply is whole the
  // view moves on, gently and only downwards, to what has to be answered or filled in
  useEffect(() => {
    const el = box.current;
    if (!el || !stick.current) return;
    // after the cards have taken their height
    const frame = requestAnimationFrame(() => {
      const mine = el.querySelector<HTMLElement>("[data-latest-visitor]");
      const item = el.querySelector<HTMLElement>("li:last-child");
      const asked = item?.querySelector("[data-question]");
      // a card to complete: show its start; a question under cards: show it; otherwise read from the visitor's words
      const card = item?.querySelector<HTMLElement>(':is([data-card="contact"], [data-card="booking"])');
      const reading = card ? item : mine;
      const end = el.scrollHeight - el.clientHeight;
      let top = reading && !asked ? Math.min(end, Math.max(0, reading.offsetTop - 16)) : end;
      // never leave the suggested replies cut in half by the message box
      const chips = item?.querySelector<HTMLElement>('[aria-label="Suggested replies"]');
      if (chips) {
        const from = chips.getBoundingClientRect().top - el.getBoundingClientRect().top + el.scrollTop;
        const bottom = from + chips.offsetHeight + 8;
        const room = reading ? reading.offsetTop - 8 : end;
        if (from < top + el.clientHeight && bottom > top + el.clientHeight && bottom - el.clientHeight <= Math.max(room, top)) top = Math.min(end, bottom - el.clientHeight);
      }
      const answering = last?.from === "assistant" && (last.state === "streaming" || last.state === "thinking");
      const gentle = !answering && top > el.scrollTop && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollTo({ top: answering || !asked ? top : Math.max(top, el.scrollTop), behavior: gentle ? "smooth" : "instant" });
    });
    return () => cancelAnimationFrame(frame);
  }, [last]);

  const onScroll = () => {
    const el = box.current;
    if (el) setAway(el.scrollHeight - el.scrollTop - el.clientHeight > 160);
  };

  return (
    <div className="relative min-h-0 flex-1">
      <div
        ref={box}
        data-lenis-prevent
        data-scroll="conversation"
        onScroll={onScroll}
        onWheel={() => (stick.current = false)}
        onTouchMove={() => (stick.current = false)}
        className="h-full overflow-y-auto overscroll-contain [mask-image:linear-gradient(to_bottom,black_calc(100%-20px),transparent)]"
        tabIndex={0}
        role="region"
        aria-label="Conversation"
      >
        <div className="relative mx-auto flex min-h-full w-full max-w-[800px] flex-col px-4 pb-7 pt-5 sm:px-6 sm:pt-7">
          {children}
          {/* a short conversation sits by the box it is written in */}
          <ol className={chat.messages.length ? "mt-auto space-y-6" : ""}>
            {chat.messages.map((m) => (
              <li key={m.id}>
                {m.from === "visitor" ? (
                  <VisitorTurn text={m.text} latest={m.id === latestVisitor} note={m.kept ? "Contact details were kept out of the AI conversation" : undefined} />
                ) : (
                  <Answer reply={m} latest={m.id === last?.id} chat={chat} cards={cards} actions={actions} held={held} onSend={onSend} />
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
      {away && (
        <button
          type="button"
          onClick={() => box.current?.scrollTo({ top: box.current.scrollHeight })}
          className={`${styles.jump} absolute bottom-3 left-1/2 grid h-9 w-9 -translate-x-1/2 place-items-center rounded-full max-sm:h-11 max-sm:w-11 border border-border-strong bg-surface text-content shadow-[0_6px_18px_-8px_rgba(11,15,25,0.35)]`}
          aria-label="Jump to the latest message"
        >
          <ArrowDown size={16} aria-hidden />
        </button>
      )}
    </div>
  );
}
