"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { parseResponse, type AssistantResponse, type BriefFields, type ClientIssue, type ErrorCode } from "@/lib/ai/contract";
import { newSession, respond, type Scenario, type Session } from "@/lib/ai/mockConsultant";

/**
 * The conversation, shared by text and voice. Held in memory only: closing the window keeps it,
 * reloading or leaving the page loses it. The reply "arrives" on timers to show the states a real
 * stream will have; nothing leaves the browser.
 */
export type Problem = ErrorCode | ClientIssue;
export type Reply = {
  id: number;
  from: "assistant";
  state: "thinking" | "streaming" | "done" | "cancelled" | "problem";
  /** what the visitor said, for "Try again" */
  asked: string;
  text: string;
  response?: AssistantResponse;
  problem?: Problem;
  retryAfter?: number;
  feedback?: "up" | "down";
};
export type Said = { id: number; from: "visitor"; text: string };
export type Message = Reply | Said;

const THINK_MS = 700;
const WORD_MS = 28;
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function useConsultation(announce: (text: string) => void) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [brief, setBrief] = useState<BriefFields>(() => newSession().brief);
  const [confirmed, setConfirmed] = useState(false);
  const [scenario, setScenario] = useState<Scenario>("normal");
  const session = useRef<Session>(newSession());
  const timers = useRef<number[]>([]);
  const pending = useRef<number | null>(null); // the reply on its way; guards against a second send
  const nextId = useRef(1);
  const [busy, setBusy] = useState(false);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  const later = (ms: number, run: () => void) => timers.current.push(window.setTimeout(run, ms));
  const patch = (id: number, change: Partial<Reply>) => setMessages((all) => all.map((m) => (m.id === id && m.from === "assistant" ? { ...m, ...change } : m)));
  const settle = () => {
    pending.current = null;
    setBusy(false);
  };

  const answer = (id: number, said: string) => {
    pending.current = id;
    setBusy(true);
    announce("CodeShaper AI is preparing a reply");
    later(THINK_MS, () => {
      const outcome = respond(session.current, said, scenario);
      if (outcome.issue) {
        settle();
        patch(id, { state: "problem", problem: outcome.issue });
        return;
      }
      const response = parseResponse(outcome.response);
      if (!response || response.error) {
        settle();
        patch(id, { state: "problem", problem: response?.error?.code ?? "invalid_response", retryAfter: response?.error?.retry_after });
        return;
      }
      const finish = () => {
        // the conversation moves on only when the whole reply arrived
        session.current = outcome.session;
        setBrief(outcome.session.brief);
        setConfirmed(false);
        settle();
        patch(id, { state: "done", text: response.text, response });
        announce(`CodeShaper AI: ${response.text}`);
      };
      if (reducedMotion()) return finish();
      const words = response.text.split(" ");
      let shown = 0;
      const step = () => {
        shown += 1;
        if (shown >= words.length) return finish();
        patch(id, { state: "streaming", text: words.slice(0, shown).join(" ") });
        later(WORD_MS, step);
      };
      step();
    });
  };

  /** False when a reply is still on its way: nothing is added twice. */
  const send = (text: string) => {
    const said = text.trim();
    if (!said || pending.current !== null) return false;
    const visitor = nextId.current++;
    const id = nextId.current++;
    setMessages((all) => [...all, { id: visitor, from: "visitor", text: said }, { id, from: "assistant", state: "thinking", asked: said, text: "" }]);
    answer(id, said);
    return true;
  };

  /** Answers the same message again, in place. */
  const retry = (id: number) => {
    const m = messages.find((x) => x.id === id);
    if (!m || m.from !== "assistant" || pending.current !== null) return;
    patch(id, { state: "thinking", text: "", problem: undefined, response: undefined });
    answer(id, m.asked);
  };

  const stop = useCallback(() => {
    const id = pending.current;
    if (id === null) return;
    clearTimers();
    pending.current = null;
    setBusy(false);
    setMessages((all) => all.map((m) => (m.id === id && m.from === "assistant" ? { ...m, state: "cancelled" } : m)));
    announce("Reply stopped");
  }, [announce]);

  const reset = () => {
    clearTimers();
    pending.current = null;
    session.current = newSession();
    setBusy(false);
    setMessages([]);
    setBrief(session.current.brief);
    setConfirmed(false);
  };

  const saveBriefEdits = (next: BriefFields) => {
    session.current = { ...session.current, brief: next };
    setBrief(next);
    setConfirmed(true);
    announce("Project brief confirmed");
  };

  return {
    messages,
    brief,
    confirmed,
    busy,
    scenario,
    setScenario,
    send,
    retry,
    stop,
    reset,
    saveBriefEdits,
    rate: (id: number, feedback: "up" | "down") => patch(id, { feedback }),
    session: () => session.current,
  };
}
export type Consultation = ReturnType<typeof useConsultation>;
