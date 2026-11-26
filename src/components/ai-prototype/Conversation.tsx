"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowDown, CalendarClock, Check, Copy, Mail, RotateCcw, ThumbsDown, ThumbsUp } from "lucide-react";
import type { Action } from "@/lib/ai/contract";
import Card, { OUTLINE, PRIMARY, type CardActions } from "./Cards";
import type { Consultation, Problem, Reply } from "./useConsultation";
import styles from "./ai.module.css";

const PROBLEMS: Partial<Record<Problem, { title: string; text: string; retry?: string; human?: boolean }>> = {
  unavailable: { title: "The assistant isn't available right now", text: "Your message is still here. You can try again, or reach a person directly.", retry: "Try again", human: true },
  ai_disabled: { title: "The assistant is switched off", text: "You can reach a person directly.", human: true },
  budget_exhausted: { title: "The assistant has reached its limit for now", text: "It will be back later. The team can take it from here.", human: true },
  rate_limited: { title: "That was a lot of messages at once", text: "Wait a moment, then try again.", retry: "Try again" },
  session_expired: { title: "This session has expired", text: "What you wrote and your brief are still on this screen.", retry: "Continue in a new session", human: true },
  network: { title: "The connection dropped", text: "Nothing was lost. Check your connection and try again.", retry: "Try again", human: true },
};
const FALLBACK = { title: "That reply could not be shown", text: "Please try again, or reach a person.", retry: "Try again", human: true };

const ICON = "grid h-10 w-10 place-items-center rounded-full text-content-muted transition-colors hover:bg-surface-soft hover:text-content aria-pressed:bg-brand-soft aria-pressed:text-content";

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

function Tools({ reply, onRate }: { reply: Reply; onRate: (f: "up" | "down") => void }) {
  const [copied, setCopied] = useState<"" | "yes" | "no">("");
  const copy = () =>
    navigator.clipboard
      .writeText(reply.text)
      .then(() => setCopied("yes"))
      .catch(() => setCopied("no"));
  return (
    <div className="-ml-2.5 flex items-center">
      <button type="button" className={ICON} onClick={copy} aria-label="Copy reply" title="Copy reply">
        {copied === "yes" ? <Check size={15} aria-hidden /> : <Copy size={15} aria-hidden />}
      </button>
      <button type="button" className={ICON} onClick={() => onRate("up")} aria-pressed={reply.feedback === "up"} aria-label="Helpful" title="Helpful">
        <ThumbsUp size={15} aria-hidden />
      </button>
      <button type="button" className={ICON} onClick={() => onRate("down")} aria-pressed={reply.feedback === "down"} aria-label="Not helpful" title="Not helpful">
        <ThumbsDown size={15} aria-hidden />
      </button>
      <span role="status" className="ml-1 text-[12px] text-content-muted">
        {copied === "yes" ? "Copied" : copied === "no" ? "Could not copy" : reply.feedback ? "Noted on this screen only" : ""}
      </span>
    </div>
  );
}

type MessageProps = { reply: Reply; latest: boolean; chat: Consultation; cards: CardActions; showBrief: boolean; onAction: (a: Action) => void };

/** Only the latest reply can be tried again: an older one would be answered out of order. */
function AssistantMessage({ reply, latest, chat, cards, showBrief, onAction }: MessageProps) {
  const done = reply.state === "done";
  const problem = reply.problem ? (PROBLEMS[reply.problem] ?? FALLBACK) : null;
  const components = done ? (reply.response?.components ?? []).filter((c) => c.type !== "project_brief" || showBrief) : [];
  // a button the card already offers is not offered twice; suggested replies sit above the box
  const actions = done && !components.length ? (reply.response?.actions ?? []).filter((a) => a.type !== "suggest_reply") : [];

  return (
    <div className="min-w-0">
      <p className="font-urbanist text-[12.5px] font-bold text-content">
        CodeShaper AI<span className="sr-only"> said:</span>
      </p>
      {reply.state === "thinking" && (
        <p className="mt-2 flex items-center gap-2 text-[14px] text-content-muted">
          <span aria-hidden className={styles.dots}>
            <i />
            <i />
            <i />
          </span>
          Preparing a reply
        </p>
      )}
      {reply.text && <p className="mt-1.5 whitespace-pre-wrap break-words text-[15px] leading-[1.7] text-content">{reply.text}</p>}
      {reply.state === "cancelled" && (
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <span className="text-[13px] text-content-muted">Reply stopped.</span>
          {latest && (
            <button type="button" className={OUTLINE} onClick={() => chat.retry(reply.id)} disabled={chat.busy}>
              <RotateCcw size={14} aria-hidden /> Try again
            </button>
          )}
        </div>
      )}
      {problem && (
        <div role="alert" data-problem={reply.problem} className="mt-2 rounded-panel border border-border bg-surface-soft p-4">
          <p className="flex items-center gap-2 font-urbanist text-[15px] font-bold text-content">
            <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-warning" />
            {problem.title}
          </p>
          <p className="mt-1 text-[13.5px] leading-relaxed text-content-muted">{problem.text}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {problem.human && (
              <>
                <Link href="/contact" data-booking className={PRIMARY}>
                  <CalendarClock size={15} aria-hidden /> Book a consultation
                </Link>
                <button type="button" className={OUTLINE} onClick={cards.onContact}>
                  <Mail size={15} aria-hidden /> Write to the team
                </button>
              </>
            )}
            {latest && problem.retry && <RetryButton label={problem.retry} wait={reply.retryAfter ?? 0} disabled={chat.busy} onClick={() => chat.retry(reply.id)} />}
          </div>
        </div>
      )}
      {components.length > 0 && (
        <div className={`mt-4 space-y-4 ${styles.rise}`}>
          {components.map((c, i) => (
            <Card key={`${c.type}-${i}`} component={c} actions={cards} />
          ))}
        </div>
      )}
      {done && !!reply.response?.sources.length && (
        <p className="mt-3 text-[12.5px] text-content-muted">
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
      {actions.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {actions.map((a) =>
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
          <Tools reply={reply} onRate={(f) => chat.rate(reply.id, f)} />
        </div>
      )}
    </div>
  );
}

export default function Conversation({ chat, cards, onAction, children }: { chat: Consultation; cards: CardActions; onAction: (a: Action) => void; children?: React.ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const stick = useRef(true);
  const [away, setAway] = useState(false);
  const count = chat.messages.length;
  const last = chat.messages.at(-1);
  const briefAt = chat.messages.findLast((m) => m.from === "assistant" && m.response?.components.some((c) => c.type === "project_brief"))?.id;

  // a new message goes to the end; as its reply grows, the visitor's words stay at the top, so a long reply is read from its start
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    stick.current = true;
    el.scrollTop = el.scrollHeight;
  }, [count]);
  useEffect(() => {
    const el = box.current;
    if (!el || !stick.current) return;
    const mine = el.querySelector<HTMLElement>("[data-latest-visitor]");
    const top = mine ? Math.max(0, mine.offsetTop - 16) : el.scrollHeight;
    el.scrollTop = Math.min(el.scrollHeight - el.clientHeight, top);
  }, [last]);

  const onScroll = () => {
    const el = box.current;
    if (el) setAway(el.scrollHeight - el.scrollTop - el.clientHeight > 160);
  };
  const latestVisitor = chat.messages.findLast((m) => m.from === "visitor")?.id;

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
        <div className="relative mx-auto w-full max-w-[800px] px-4 py-6 sm:px-6">
          {children}
          <ol className="space-y-7">
            {chat.messages.map((m) =>
              m.from === "visitor" ? (
                <li key={m.id} data-latest-visitor={m.id === latestVisitor || undefined} className="flex justify-end">
                  <p className="max-w-[85%] whitespace-pre-wrap break-words rounded-[18px] bg-surface-soft px-4 py-2.5 text-[15px] leading-relaxed text-content">
                    <span className="sr-only">You said: </span>
                    {m.text}
                  </p>
                </li>
              ) : (
                <li key={m.id}>
                  <AssistantMessage reply={m} latest={m.id === last?.id} chat={chat} cards={cards} showBrief={m.id === briefAt} onAction={onAction} />
                </li>
              ),
            )}
          </ol>
        </div>
      </div>
      {away && (
        <button
          type="button"
          onClick={() => box.current?.scrollTo({ top: box.current.scrollHeight })}
          className="absolute bottom-3 left-1/2 grid h-10 w-10 -translate-x-1/2 place-items-center rounded-full border border-border-strong bg-surface text-content shadow-[0_6px_18px_-8px_rgba(11,15,25,0.35)]"
          aria-label="Jump to the latest message"
        >
          <ArrowDown size={16} aria-hidden />
        </button>
      )}
    </div>
  );
}
