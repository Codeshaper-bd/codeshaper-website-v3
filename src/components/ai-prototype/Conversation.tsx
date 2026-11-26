"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowDown, CalendarClock, Check, Copy, RotateCcw } from "lucide-react";
import MarkSvg from "@/components/brand/MarkSvg";
import type { Action } from "@/lib/ai/contract";
import { splitQuestion } from "@/lib/ai/present";
import Card, { OUTLINE, PRIMARY, QUIET, type CardActions } from "./Cards";
import type { Consultation, Problem, Reply } from "./useConsultation";
import styles from "./ai.module.css";

const PROBLEMS: Partial<Record<Problem, { title: string; text: string; retry?: string; human?: boolean }>> = {
  unavailable: { title: "The assistant isn't available right now", text: "Your message is still here. Try again, or reach a person.", retry: "Try again", human: true },
  ai_disabled: { title: "The assistant is switched off", text: "You can reach a person directly.", human: true },
  budget_exhausted: { title: "The assistant has reached its limit for now", text: "It will be back later. The team can take it from here.", human: true },
  rate_limited: { title: "That was a lot of messages at once", text: "Wait a moment, then try again.", retry: "Try again" },
  session_expired: { title: "This session has expired", text: "What you wrote and your brief are still on this screen.", retry: "Continue in a new session", human: true },
  network: { title: "The connection dropped", text: "Nothing was lost. Check your connection and try again.", retry: "Try again", human: true },
};
const FALLBACK = { title: "That reply could not be shown", text: "Please try again, or reach a person.", retry: "Try again", human: true };

export const BODY = "text-[16px] leading-[1.75] text-content";

/** The assistant's turn: its mark in the margin, its words in the reading column. */
export function AssistantTurn({ working = false, children }: { working?: boolean; children: React.ReactNode }) {
  return (
    <div className="grid gap-x-4 sm:grid-cols-[32px_minmax(0,1fr)]">
      <div className="mb-1.5 flex items-center gap-2 sm:mb-0 sm:block">
        <span aria-hidden className={`grid h-6 w-6 place-items-center rounded-[9px] bg-brand-soft text-[#4f46e5] sm:h-8 sm:w-8 sm:rounded-control ${working ? styles.working : ""}`}>
          <MarkSvg className="h-4 w-4 sm:h-5 sm:w-5" id="ai-turn-mark" />
        </span>
        <span aria-hidden className="font-urbanist text-[13px] font-bold text-content sm:hidden">CodeShaper AI</span>
      </div>
      <div className="min-w-0 sm:pt-0.5">
        <span className="sr-only">CodeShaper AI said: </span>
        {children}
      </div>
    </div>
  );
}

export function VisitorTurn({ text, note, latest }: { text: string; note?: string; latest?: boolean }) {
  return (
    <div data-latest-visitor={latest || undefined} className="flex flex-col items-end">
      <p className="max-w-[88%] whitespace-pre-wrap break-words rounded-[22px] rounded-br-[8px] bg-brand-soft px-4 py-3 text-[16px] leading-relaxed text-content sm:max-w-[75%]">
        <span className="sr-only">You said: </span>
        {text}
      </p>
      {note && <p className="mt-1.5 text-[12.5px] text-content-muted">{note}</p>}
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
    <button type="button" className={OUTLINE} onClick={onClick} disabled={disabled || left > 0}>
      <RotateCcw size={14} aria-hidden />
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
      <button type="button" onClick={copy} aria-label="Copy reply" title="Copy reply" className="-ml-3 grid h-11 w-11 place-items-center rounded-full text-content-muted transition-colors hover:bg-surface-soft hover:text-content">
        {copied === "yes" ? <Check size={15} aria-hidden /> : <Copy size={15} aria-hidden />}
      </button>
      <span role="status" className="text-[12.5px] text-content-muted">
        {copied === "yes" ? "Copied" : copied === "no" ? "Could not copy" : ""}
      </span>
    </span>
  );
}

type TurnProps = { reply: Reply; latest: boolean; chat: Consultation; cards: CardActions; showBrief: boolean; onAction: (a: Action) => void; onSend: (text: string) => void };

/** Only the latest reply can be tried again: an older one would be answered out of order. */
function Answer({ reply, latest, chat, cards, showBrief, onAction, onSend }: TurnProps) {
  const done = reply.state === "done";
  const problem = reply.problem ? (PROBLEMS[reply.problem] ?? FALLBACK) : null;
  const components = done ? (reply.response?.components ?? []).filter((c) => c.type !== "project_brief" || showBrief) : [];
  // with something to show, the question moves below it, where the visitor will answer it
  const { lead, question } = components.length ? splitQuestion(reply.text) : { lead: reply.text, question: null };
  const actions = done ? (reply.response?.actions ?? []) : [];
  const suggestions = latest && !chat.busy ? actions.filter((a) => a.type === "suggest_reply") : [];
  // a button the card already offers is not offered twice
  const buttons = components.length ? [] : actions.filter((a) => a.type !== "suggest_reply");

  return (
    <AssistantTurn working={reply.state === "thinking" || reply.state === "streaming"}>
      {reply.state === "thinking" && (
        <p className="flex min-h-8 items-center gap-2.5 text-[15px] text-content-muted">
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
          <span className="text-[14px] text-content-muted">Reply stopped.</span>
          {latest && (
            <button type="button" className={OUTLINE} onClick={() => chat.retry(reply.id)} disabled={chat.busy}>
              <RotateCcw size={14} aria-hidden /> Try again
            </button>
          )}
        </div>
      )}
      {problem && (
        <div role="alert" data-problem={reply.problem} className="rounded-panel bg-surface-soft p-5">
          <p className="flex items-start gap-2.5 font-urbanist text-[17px] font-bold leading-snug text-content">
            <span aria-hidden className="mt-2 h-2 w-2 shrink-0 rounded-full bg-warning" />
            {problem.title}
          </p>
          <p className="mt-1 text-[14.5px] leading-relaxed text-content-muted">{problem.text}</p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            {latest && problem.retry && <RetryButton label={problem.retry} wait={reply.retryAfter ?? 0} disabled={chat.busy} onClick={() => chat.retry(reply.id)} />}
            {problem.human && (
              <>
                <Link href="/contact" data-booking className={problem.retry ? QUIET : PRIMARY}>
                  <CalendarClock size={15} aria-hidden /> Book a call
                </Link>
                <button type="button" className={QUIET} onClick={cards.onContact}>
                  Write to the team
                </button>
              </>
            )}
          </div>
        </div>
      )}
      {components.length > 0 && (
        <div className={`mt-5 space-y-6 ${styles.rise}`}>
          {components.map((c, i) => (
            <Card key={`${c.type}-${i}`} component={c} actions={cards} />
          ))}
        </div>
      )}
      {question && <p data-question className={`mt-5 font-medium ${BODY} ${styles.rise}`}>{question}</p>}
      {done && !!reply.response?.sources.length && (
        <p className="mt-3 text-[13px] text-content-muted">
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
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          {buttons.map((a) =>
            a.type === "book_consultation" ? (
              <Link key={a.type} href="/contact" data-booking className={OUTLINE}>
                {a.label}
              </Link>
            ) : (
              <button key={a.type} type="button" className={OUTLINE} onClick={() => onAction(a)}>
                {a.label}
              </button>
            ),
          )}
        </div>
      )}
      {done && (
        <div className="mt-1">
          <CopyButton text={reply.text} />
        </div>
      )}
      {suggestions.length > 0 && (
        <ul aria-label="Suggested replies" className={`mt-2 flex flex-wrap gap-2 ${styles.rise}`}>
          {suggestions.map((a) => (
            <li key={a.label}>
              <button type="button" onClick={() => onSend(a.label)} className="min-h-11 rounded-full border border-brand/30 bg-surface px-4 text-left text-[14px] font-medium text-content transition-colors hover:bg-brand-soft">
                {a.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </AssistantTurn>
  );
}

type Props = { chat: Consultation; cards: CardActions; onAction: (a: Action) => void; onSend: (text: string) => void; children?: React.ReactNode };

export default function Conversation({ chat, cards, onAction, onSend, children }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const stick = useRef(true);
  const [away, setAway] = useState(false);
  const count = chat.messages.length;
  const last = chat.messages.at(-1);
  const briefAt = chat.messages.findLast((m) => m.from === "assistant" && m.response?.components.some((c) => c.type === "project_brief"))?.id;
  const latestVisitor = chat.messages.findLast((m) => m.from === "visitor")?.id;

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    stick.current = true;
    el.scrollTop = el.scrollHeight;
  }, [count]);
  // the visitor's message stays on top so a reply is read from its start; once a question sits below cards, show the question
  useEffect(() => {
    const el = box.current;
    if (!el || !stick.current) return;
    const mine = el.querySelector<HTMLElement>("[data-latest-visitor]");
    // after the cards have taken their height
    const frame = requestAnimationFrame(() => {
      const asked = el.querySelector("li:last-child [data-question]");
      const top = mine && !asked ? Math.max(0, mine.offsetTop - 16) : el.scrollHeight;
      el.scrollTop = Math.min(el.scrollHeight - el.clientHeight, top);
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
        className="h-full overflow-y-auto overscroll-contain"
        tabIndex={0}
        role="region"
        aria-label="Conversation"
      >
        <div className="relative mx-auto flex min-h-full w-full max-w-[848px] flex-col px-4 py-6 sm:px-6 sm:py-9">
          {children}
          {/* a short conversation sits by the box it is written in */}
          <ol className={chat.messages.length ? "mt-auto space-y-9" : ""}>
            {chat.messages.map((m) => (
              <li key={m.id}>
                {m.from === "visitor" ? (
                  <VisitorTurn text={m.text} latest={m.id === latestVisitor} />
                ) : (
                  <Answer reply={m} latest={m.id === last?.id} chat={chat} cards={cards} showBrief={m.id === briefAt} onAction={onAction} onSend={onSend} />
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
          className="absolute bottom-3 left-1/2 grid h-11 w-11 -translate-x-1/2 place-items-center rounded-full border border-border-strong bg-surface text-content shadow-[0_6px_18px_-8px_rgba(11,15,25,0.35)]"
          aria-label="Jump to the latest message"
        >
          <ArrowDown size={16} aria-hidden />
        </button>
      )}
    </div>
  );
}
