import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseResponse } from "../src/lib/ai/contract.ts";
import { newSession, respond, voiceSample } from "../src/lib/ai/mockConsultant.ts";

const run = (messages, scenario = "normal") => {
  let session = newSession();
  const turns = messages.map((m) => {
    const out = respond(session, m, scenario);
    session = out.session;
    return out.response ? { ...out, response: parseResponse(out.response) } : out;
  });
  return { session, turns, last: turns.at(-1) };
};
const kinds = (turn) => turn.response.components.map((c) => c.type);
const questions = (text) => (text.match(/\?/g) ?? []).length;

const FOUNDER = ["I'm a founder and want to launch a SaaS MVP for clinic bookings", "Small clinics and their patients", "Online booking, reminders", "Web first"];
const AUTOMATION = ["We want AI to automate our support workflow", "Zendesk and Slack", "Our support team of five"];

test("founder flow: one question at a time, ends in a brief made of the visitor's words", () => {
  const { turns, session } = run(FOUNDER);
  for (const t of turns) assert.ok(t.response, "every reply passes the contract");
  for (const t of turns.slice(0, 3)) assert.equal(questions(t.response.text), 1);
  assert.deepEqual(kinds(turns[0]), []);
  assert.ok(kinds(turns[1]).includes("services"));
  assert.ok(kinds(turns[3]).includes("project_brief"));
  assert.deepEqual(session.brief, { goal: FOUNDER[0], users: FOUNDER[1], features: ["Online booking", "reminders"], platforms: "Web first", integrations: null, timeline: null, budget: null, constraints: null });
});

test("automation flow: recommends, then briefs, without asking for budget or contact", () => {
  const { turns, session } = run(AUTOMATION);
  assert.ok(kinds(turns[0]).includes("services"));
  assert.ok(kinds(turns[1]).includes("technologies"));
  assert.ok(kinds(turns[2]).includes("project_brief"));
  assert.equal(session.brief.integrations, "Zendesk and Slack");
  assert.equal(session.brief.budget, null);
  for (const t of turns) assert.doesNotMatch(t.response.text, /your (email|name|phone|budget)/i);
});

test("services, case studies, company and brief questions get the matching answer", () => {
  assert.deepEqual(kinds(run(["What services do you offer?"]).last), ["services"]);
  assert.deepEqual(kinds(run(["Show me some case studies"]).last), ["case_studies"]);
  assert.ok(run(["Tell me about your company"]).last.response.sources.some((s) => s.path === "/about"));
  assert.deepEqual(kinds(run([...FOUNDER.slice(0, 2), "Show me my brief"]).last), ["project_brief"]);
  assert.deepEqual(kinds(run(["Show me my brief"]).last), []);
});

test("a side question is not written into the brief, and the open question stays open", () => {
  const { session } = run([FOUNDER[0], "What services do you offer?", "Small clinics"]);
  assert.equal(session.brief.users, "Small clinics");
  assert.equal(session.brief.features.length, 0);
});

test("'not sure' leaves the answer unknown and moves on", () => {
  const { session } = run([FOUNDER[0], "Not sure yet", "Booking"]);
  assert.equal(session.brief.users, null);
  assert.deepEqual(session.brief.features, ["Booking"]);
});

test("asking for a person offers the human routes at once", () => {
  for (const m of ["Can I talk to a human?", "I'd rather speak with someone", "Book a call"]) assert.deepEqual(kinds(run([m]).last), ["consultation"], m);
});

test("the same words give the same answers", () => {
  assert.deepEqual(run(FOUNDER).turns, run(FOUNDER).turns);
});

test("failure scenarios answer honestly and change nothing", () => {
  for (const [scenario, code] of [["unavailable", "unavailable"], ["budget_exhausted", "budget_exhausted"], ["rate_limited", "rate_limited"]]) {
    const { last, session } = run([FOUNDER[0]], scenario);
    assert.equal(last.response.error.code, code);
    assert.deepEqual(session, newSession());
  }
  for (const issue of ["network", "session_expired"]) {
    const { last, session } = run([FOUNDER[0]], issue);
    assert.equal(last.issue, issue);
    assert.deepEqual(session, newSession());
  }
});

test("replies make no commercial promise or unverified claim", () => {
  const all = [...run(FOUNDER).turns, ...run(AUTOMATION).turns, ...["What services do you offer?", "Show me case studies", "Tell me about your company", "Can I talk to a human?", "How much does it cost?", "hello"].map((m) => run([m]).last)];
  for (const t of all) assert.doesNotMatch(t.response.text, /\$|guarantee|certified|\d+\s*(clients|projects|years|%)|we promise|best in/i);
});

test("the sample voice transcript follows the conversation", () => {
  assert.match(voiceSample(newSession()), /SaaS/);
  assert.notEqual(voiceSample(run([FOUNDER[0]]).session), voiceSample(newSession()));
});

test("the prototype never records, calls out or stores", () => {
  const files = ["src/lib/ai/contract.ts", "src/lib/ai/mockConsultant.ts", "src/lib/ai/voiceMachine.ts", "src/lib/ai/present.ts", ...["Workspace.tsx", "Conversation.tsx", "Composer.tsx", "Cards.tsx", "BriefPanel.tsx", "VoiceView.tsx", "VoiceVisual.tsx", "useConsultation.ts", "useDialog.ts", "catalog.ts"].map((f) => `src/components/ai-prototype/${f}`)];
  for (const f of files) assert.doesNotMatch(readFileSync(f, "utf8"), /getUserMedia|MediaRecorder|SpeechRecognition|speechSynthesis|AudioContext|fetch\(|XMLHttpRequest|WebSocket|EventSource|sendBeacon|localStorage|sessionStorage|document\.cookie|dangerouslySetInnerHTML|gtag|dataLayer|\/api\//, f);
});

test("the entry point exists only in development with the flag set", () => {
  const hero = readFileSync("src/components/hero/HeroAsk.tsx", "utf8");
  assert.match(hero, /process\.env\.NODE_ENV !== "production" && process\.env\.NEXT_PUBLIC_AI_PROTOTYPE === "1"/);
  assert.match(hero, /action="\/contact\/continue"/);
});

test("a greeting in the middle of a conversation is not an answer", () => {
  const { session } = run([FOUNDER[0], "Hello", "Small clinics"]);
  assert.equal(session.brief.users, "Small clinics");
  assert.equal(run([...FOUNDER, "hi!"]).session.brief.constraints, null);
});
