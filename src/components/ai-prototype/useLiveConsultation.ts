"use client";

import { useCallback, useRef, useState } from "react";
import { createAiClient } from "@/lib/ai/client";
import { parseResponse, type AssistantResponse, type BriefFields, type Component } from "@/lib/ai/contract";
import { ended, NOTICE_VERSION, outcomeOf, touched, trackSession, type Clock, type SessionTimes } from "@/lib/ai/live";
import { demoDays, separateContact, type Contact } from "@/lib/ai/actions";
import { parseProposals, type Proposal } from "@/lib/ai/proposals";
import { newSession, respond, type Scenario, type Session } from "@/lib/ai/mockConsultant";
import type { Consultation, Message, Problem, Reply } from "./useConsultation";

/**
 * The conversation connected to the website's gateway and, behind it, the CMS with its FAKE provider.
 *
 * From the server: the words of each answer, the session, limits, cost control and every failure.
 * Made here in the browser, and labelled so: the brief, suggested replies, cards, contact and
 * booking steps. They are design simulations and are dropped when the service provides them.
 */
export function useLiveConsultation(announce: (text: string) => void, onContact: (details: Partial<Contact>) => void): Consultation {
  const [client] = useState(() => createAiClient());
  const [messages, setMessages] = useState<Message[]>([]);
  const [brief, setBrief] = useState<BriefFields>(() => newSession().brief);
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [clock, setClock] = useState<Clock | null>(null);
  const simulation = useRef<Session>(newSession());
  const hasSession = useRef(false);
  /** the server ended the session: a new one is started only when the visitor chooses to */
  const lapsed = useRef(false);
  /** counts sessions: a late answer about an earlier one must not end the current one */
  const sessionNo = useRef(0);
  const pending = useRef<{ id: number; requestId: string } | null>(null);
  /** bumped by "new conversation": answers to an earlier one are ignored */
  const generation = useRef(0);
  const nextId = useRef(1);

  const patch = (id: number, change: Partial<Reply>) => setMessages((all) => all.map((m) => (m.id === id && m.from === "assistant" ? { ...m, ...change } : m)));
  const noteSession = (info: SessionTimes, serverNow: number | null) => {
    hasSession.current = true;
    lapsed.current = false;
    sessionNo.current++;
    setClock(trackSession(info, Date.now(), serverNow ?? Date.now()));
  };
  /** an answer is activity: the server has just moved the idle end */
  const active = () => setClock((c) => (c ? touched(c, Date.now()) : c));
  const over = () => {
    hasSession.current = false;
    lapsed.current = true;
    setClock((c) => (c ? ended(c, Date.now()) : c));
  };

  const start = async (fresh = false): Promise<Problem | null> => {
    try {
      const r = await client.start(NOTICE_VERSION, fresh);
      if (r.ok && r.session) {
        noteSession(r.session, r.serverNow);
        return null;
      }
      // the gateway being switched off looks like a missing address
      return r.error?.code === "not_found" ? "unavailable" : (r.error?.code ?? "unavailable");
    } catch {
      return "network";
    }
  };

  type Work = { requestId: string; said: string; retryOf?: string };

  const deliver = async (id: number, work: Work) => {
    const mine = generation.current;
    pending.current = { id, requestId: work.requestId };
    setBusy(true);
    announce("CodeShaper AI is preparing a reply");
    const done = (change: Partial<Reply>, say: string) => {
      if (mine !== generation.current) return;
      pending.current = null;
      setBusy(false);
      patch(id, { stopping: false, ...change });
      announce(say);
    };

    if (lapsed.current) return done({ state: "problem", problem: "session_expired", retry: "new_attempt" }, "Your session has ended");
    if (!hasSession.current) {
      const problem = await start();
      if (mine !== generation.current) return;
      if (problem) return done({ state: "problem", problem, retry: "same_id" }, "The assistant could not be reached");
    }
    let shown = "";
    const onText = (piece: string) => {
      if (mine !== generation.current) return;
      shown += piece;
      patch(id, { state: "streaming", text: shown });
    };
    let response: AssistantResponse;
    try {
      response = work.retryOf ? await client.newAttempt(work.retryOf, onText, undefined, work.requestId) : await client.send(work.said, onText, { requestId: work.requestId });
    } catch {
      return done({ state: "problem", problem: "network", retry: "same_id" }, "The connection dropped");
    }
    if (mine !== generation.current) return;
    if (response.session) active();
    const outcome = outcomeOf(response);
    if (outcome.state === "cancelled") return done({ state: "cancelled", retry: outcome.retry }, "Reply stopped");
    if (outcome.state === "problem") {
      if (outcome.problem === "session_expired") over();
      return done({ state: "problem", problem: outcome.problem, retry: outcome.retry, retryAfter: response.error?.retry_after }, "The reply did not arrive");
    }
    // SIMULATED, from the same words: what cards a later service might send with this answer
    const sim = respond(simulation.current, work.said);
    const parsed = parseResponse(sim.response);
    simulation.current = sim.session;
    setBrief(sim.session.brief);
    if (parsed?.components.some((c: Component) => c.type === "project_brief")) setConfirmed(false);
    done(
      {
        state: "done",
        text: response.text,
        response,
        synthetic: true,
        simulated: { components: parsed?.components ?? [], actions: parsed?.actions ?? [] },
        proposals: parseProposals(sim.proposals),
      },
      `CodeShaper AI: ${response.text}`,
    );
  };

  const send = (text: string) => {
    if (!text.trim() || pending.current) return false;
    // contact details are taken out here, before anything goes to the server
    const { forAssistant, shown, contact } = separateContact(text.trim());
    const kept = Object.keys(contact).length > 0;
    if (kept) onContact(contact);
    const visitor = nextId.current++;
    const id = nextId.current++;
    const requestId = crypto.randomUUID();
    setMessages((all) => [...all, { id: visitor, from: "visitor", text: shown, kept }, { id, from: "assistant", state: "thinking", asked: forAssistant, text: "", requestId }]);
    void deliver(id, { requestId, said: forAssistant });
    return true;
  };

  /** Does only what the server allows: the same delivery again, or a new attempt that may be charged. */
  const retry = (id: number) => {
    const m = messages.find((x) => x.id === id);
    if (!m || m.from !== "assistant" || !m.requestId || pending.current) return;
    const expired = m.problem === "session_expired";
    // a new session knows nothing of the old request: the words are sent as a new one
    const fresh = expired || m.retry === "new_attempt";
    const requestId = fresh ? crypto.randomUUID() : m.requestId;
    patch(id, { state: "thinking", text: "", problem: undefined, response: undefined, requestId });
    void (async () => {
      if (expired) await start(true);
      await deliver(id, { requestId, said: m.asked, retryOf: m.retry === "new_attempt" && !expired ? m.requestId : undefined });
    })();
  };

  /** Asks the server to stop. The answer that follows says what happened; the call may still be charged. */
  const stop = () => {
    const now = pending.current;
    if (!now) return;
    patch(now.id, { stopping: true });
    announce("Asking to stop. A call already made may still be charged.");
    client.cancel(now.requestId).catch(() => patch(now.id, { stopping: false }));
  };

  const clear = () => {
    generation.current++;
    pending.current = null;
    simulation.current = newSession();
    setBusy(false);
    setMessages([]);
    setBrief(simulation.current.brief);
    setConfirmed(false);
  };

  /** A new conversation ends the old session, which erases its words on the server. */
  const reset = () => {
    clear();
    lapsed.current = false;
    if (!hasSession.current) return;
    hasSession.current = false;
    setClock(null);
    client.end().catch(() => {});
  };

  const open = (kind: "contact" | "booking") => {
    const id = nextId.current++;
    const proposal: Proposal =
      kind === "contact" ? { type: "contact_capture", include_brief: true } : { type: "booking_calendar", demo: true, duration_minutes: 30, days: demoDays(Date.now()) };
    const text = kind === "contact" ? "Here is a message to the team. This part does not use AI." : "Here are some demonstration times. This part does not use AI.";
    setMessages((all) => [...all, { id, from: "assistant", state: "done", asked: "", text, proposals: [proposal], local: true }]);
    announce(text);
  };

  const restore = useCallback(async () => {
    try {
      const data = await client.restore();
      if (!data?.session || !Array.isArray(data.messages)) return false;
      noteSession(data.session, data.serverNow);
      const restored: Message[] = data.messages.flatMap((m: { request_id: string; text: string; response: unknown }) => {
        const response = parseResponse(m.response);
        if (!response) return [];
        const outcome = outcomeOf(response);
        const reply: Reply = {
          id: nextId.current + 1, from: "assistant", asked: m.text, requestId: m.request_id, text: response.text, synthetic: true,
          ...(outcome.state === "done" ? { state: "done", response } : outcome.state === "cancelled" ? { state: "cancelled", retry: outcome.retry } : { state: "problem", problem: outcome.problem, retry: outcome.retry }),
        };
        const said: Message = { id: nextId.current, from: "visitor", text: m.text };
        nextId.current += 2;
        return [said, reply];
      });
      // never over a conversation already on screen
      setMessages((all) => (all.length ? all : restored));
      return true;
    } catch {
      return false;
    }
    // only the client is used from outside, and it never changes
  }, [client]);

  const check = async () => {
    const asked = sessionNo.current;
    try {
      const data = await client.restore();
      if (asked !== sessionNo.current) return true;
      if (!data?.session) {
        over();
        return false;
      }
      noteSession(data.session, data.serverNow);
      return true;
    } catch {
      return false;
    }
  };

  const renew = async () => {
    try {
      const r = await client.renew();
      if (r.ok && r.session) {
        noteSession(r.session, r.serverNow);
        announce("The session was kept");
        return true;
      }
      if (r.error?.code === "session_expired") over();
    } catch {
      /* the notice stays and can be tried again */
    }
    return false;
  };

  const startOver = async () => {
    clear();
    const problem = await start(true);
    return problem === null;
  };

  return {
    live: { accept: () => start(), restore, clock, check, renew, startOver },
    messages,
    brief,
    confirmed,
    busy,
    scenario: "normal" as Scenario,
    setScenario: () => {},
    send,
    retry,
    stop,
    reset,
    editBrief: (next: BriefFields) => {
      simulation.current = { ...simulation.current, brief: next };
      setBrief(next);
      setConfirmed(false);
      announce("Brief updated. Please confirm it.");
    },
    confirmBrief: () => {
      setConfirmed(true);
      announce("Project brief confirmed");
    },
    open,
    session: () => simulation.current,
  };
}
