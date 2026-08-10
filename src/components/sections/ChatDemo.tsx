"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/motion";

/**
 * Interactive SCRIPTED chat (Pass 2 §3.4): clicking a suggestion or typing
 * anything streams a canned response ~20ms/char after a typing indicator.
 * 3 canned Q&A pairs + a friendly default for free-typed input.
 * "Scripted preview" label always visible. Reduced motion: instant text.
 * PLACEHOLDER wording (incl. % claims) — needs sign-off.
 */
type Msg = { role: "user" | "agent"; text: string; typing?: boolean };

const PAIRS: { q: string; match: RegExp; a: string }[] = [
  {
    q: "How could AI cut our invoice processing time?",
    match: /invoice|billing|payable|finance|document/i,
    a: "Typical setup: an extraction agent reads incoming invoices, validates line items against your PO system, and routes exceptions to a human queue. Most teams see 70–80% of invoices flow through untouched. On a call we'd map this to your exact stack.",
  },
  {
    q: "Can an agent answer our support tickets?",
    match: /support|ticket|helpdesk|customer/i,
    a: "Yes — a RAG agent grounded in your help docs and past tickets can draft or fully resolve tier-1 replies. We start in draft mode (a human approves each reply), measure accuracy for a few weeks, then graduate safe categories to auto-send.",
  },
  {
    q: "What would automating onboarding look like?",
    match: /onboard|hr|employee|hire/i,
    a: "Usually three parts: agents chase missing documents, provisioning runs through your existing APIs, and a knowledge-base copilot answers the new hire's first-week questions. Most of the win is in the chasing.",
  },
];

const DEFAULT_ANSWER =
  "Good question — the honest answer depends on where your team loses the most hours. In a 30-minute call we map your workflow and tell you which piece is automatable this quarter, and which isn't worth it yet.";

export default function ChatDemo() {
  const reduced = usePrefersReducedMotion();
  const [messages, setMessages] = useState<Msg[]>([
    { role: "agent", text: "Hi — I'm a demo of the kind of agent we build. Ask me a business question, or tap a suggestion below." },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const t = timers.current;
    return () => t.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  const send = (raw?: string) => {
    const text = (raw ?? input).trim();
    if (!text || busy) return;
    setInput("");
    setBusy(true);
    const answer = PAIRS.find((p) => p.match.test(text))?.a ?? DEFAULT_ANSWER;

    setMessages((m) => [...m, { role: "user", text }, { role: "agent", text: "", typing: true }]);

    if (reduced) {
      setMessages((m) => [...m.slice(0, -1), { role: "agent", text: answer }]);
      setBusy(false);
      return;
    }

    // typing indicator ~700ms, then stream ~20ms/char
    const t0 = setTimeout(() => {
      setMessages((m) => [...m.slice(0, -1), { role: "agent", text: "" }]);
      answer.split("").forEach((_, i) => {
        const t = setTimeout(() => {
          setMessages((m) => [...m.slice(0, -1), { role: "agent", text: answer.slice(0, i + 1) }]);
          if (i === answer.length - 1) setBusy(false);
        }, i * 20);
        timers.current.push(t);
      });
    }, 700);
    timers.current.push(t0);
  };

  const remainingSuggestions = PAIRS.filter((p) => !messages.some((m) => m.role === "user" && m.text === p.q));

  return (
    <div className="flex h-[430px] flex-col" aria-label="AI agent demo (scripted)">
      <div className="mb-5 flex items-center justify-between">
        <p className="font-display text-sm font-medium text-ink">Agent demo</p>
        <span className="rounded-full border border-hairline px-2.5 py-0.5 font-body text-[10px] uppercase tracking-widest text-ink-faint">
          Scripted preview
        </span>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto pr-1" role="log" aria-live="polite">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-xl px-4 py-3 font-body text-sm leading-relaxed ${
              m.role === "user"
                ? "ml-auto bg-aurora-violet/25 text-ink"
                : "border border-hairline bg-canvas/60 text-ink-dim"
            }`}
          >
            {m.typing ? (
              <span className="flex gap-1 py-1" aria-label="Agent is typing">
                <span className="typing-dot h-1.5 w-1.5 rounded-full bg-ink-dim" />
                <span className="typing-dot h-1.5 w-1.5 rounded-full bg-ink-dim" />
                <span className="typing-dot h-1.5 w-1.5 rounded-full bg-ink-dim" />
              </span>
            ) : (
              m.text || <span className="inline-block animate-pulse">▍</span>
            )}
          </div>
        ))}
      </div>

      {remainingSuggestions.length > 0 && messages.length < 6 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {remainingSuggestions.map((p) => (
            <button
              key={p.q}
              onClick={() => send(p.q)}
              disabled={busy}
              className="rounded-full border border-hairline px-3 py-1.5 font-body text-xs text-ink-dim transition-colors hover:border-aurora-violet/50 hover:text-ink disabled:opacity-40"
            >
              {p.q}
            </button>
          ))}
        </div>
      )}

      <form
        className="mt-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a business question…"
          aria-label="Ask the demo agent a question"
          className="min-w-0 flex-1 rounded-full border border-hairline bg-canvas/60 px-4 py-2.5 font-body text-sm text-ink placeholder:text-ink-faint outline-none transition-colors focus:border-aurora-violet/60"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="rounded-full border border-aurora-violet/60 px-5 py-2.5 font-display text-sm text-ink transition-opacity disabled:opacity-40"
        >
          Send
        </button>
      </form>
    </div>
  );
}
