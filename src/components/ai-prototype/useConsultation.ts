"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { parseResponse, type Action, type AssistantResponse, type BriefFields, type ClientIssue, type Component, type ErrorCode } from "@/lib/ai/contract";
import type { Clock } from "@/lib/ai/live";
import { newSession, respond, type Scenario, type Session } from "@/lib/ai/mockConsultant";
import { demoDays, separateContact, type Contact } from "@/lib/ai/actions";
import { parseProposals, type Proposal } from "@/lib/ai/proposals";

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
  /** steps the answer asks the screen to show (proposals.ts) */
  proposals?: Proposal[];
  /** opened by a button, not answered by the assistant */
  local?: boolean;
  // ── only with the gateway connected ──
  requestId?: string;
  /** what the server says may be done about a failure */
  retry?: "same_id" | "new_attempt" | "none";
  /** the words came from the test service */
  synthetic?: boolean;
  /** cards made in the browser to design the screen: not from the service */
  simulated?: { components: Component[]; actions: Action[] };
  stopping?: boolean;
};
export type Said = { id: number; from: "visitor"; text: string; kept?: boolean };
export type Message = Reply | Said;

const THINK_MS = 700;
const WORD_MS = 28;
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function useConsultation(announce: (text: string) => void, onContact: (details: Partial<Contact>) => void) {
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
        patch(id, { state: "done", text: response.text, response, proposals: parseProposals(outcome.proposals) });
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
    if (!text.trim() || pending.current !== null) return false;
    // contact details are taken out here, before anything goes to the assistant
    const { forAssistant, shown, contact } = separateContact(text.trim());
    const kept = Object.keys(contact).length > 0;
    if (kept) onContact(contact);
    const visitor = nextId.current++;
    const id = nextId.current++;
    setMessages((all) => [...all, { id: visitor, from: "visitor", text: shown, kept }, { id, from: "assistant", state: "thinking", asked: forAssistant, text: "" }]);
    answer(id, forAssistant);
    return true;
  };

  /** A button's own step, with no assistant involved: it works before the note is accepted and when AI is down. */
  const open = (kind: "contact" | "booking") => {
    const id = nextId.current++;
    const proposal: Proposal =
      kind === "contact" ? { type: "contact_capture", include_brief: true } : { type: "booking_calendar", demo: true, duration_minutes: 30, days: demoDays(Date.now()) };
    const text = kind === "contact" ? "Here is a message to the team. This part does not use AI." : "Here are some demonstration times. This part does not use AI.";
    setMessages((all) => [...all, { id, from: "assistant", state: "done", asked: "", text, proposals: [proposal], local: true }]);
    announce(text);
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

  /** An edit is a new draft; only "Looks right" confirms it. */
  const editBrief = (next: BriefFields) => {
    session.current = { ...session.current, brief: next };
    setBrief(next);
    setConfirmed(false);
    announce("Brief updated. Please confirm it.");
  };
  const confirmBrief = () => {
    setConfirmed(true);
    announce("Project brief confirmed");
  };

  return {
    live: undefined as Live | undefined,
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
    editBrief,
    confirmBrief,
    open,
    session: () => session.current,
  };
}
/** What exists only when a real service answers: the session and its end. */
export type Live = {
  /** starts the session after the note is accepted; the problem to show, or null */
  accept: () => Promise<Problem | null>;
  /** true when the server still holds a conversation for this browser (after a reload) */
  restore: () => Promise<boolean>;
  clock: Clock | null;
  /** asks the server whether the session still lives, and returns its clock */
  check: () => Promise<boolean>;
  renew: () => Promise<boolean>;
  startOver: () => Promise<boolean>;
};
export type Consultation = ReturnType<typeof useConsultation>;
