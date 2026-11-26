/**
 * PROTOTYPE ONLY: a scripted stand-in for the AI. It matches a few words, asks fixed questions and
 * copies the visitor's answers into the brief. It understands nothing, calls nothing and promises
 * nothing. The same input always gives the same output. The backend replaces this file.
 *
 * Its answers use the real contract (contract.ts), so the screen is exercised exactly as it will be.
 * Only type imports, so the tests can run it as it is.
 */
import type { Action, BriefFields, BriefKey, ClientIssue, Component, ErrorCode, Source } from "./contract";
import { demoDays } from "./actions.ts";

export type Scenario = "normal" | "unavailable" | "budget_exhausted" | "rate_limited" | "session_expired" | "network";

type Flow = "saas" | "automation" | "project";
export type Session = { turn: number; flow: Flow | null; asked: BriefKey | null; brief: BriefFields };

export const newSession = (): Session => ({
  turn: 0,
  flow: null,
  asked: null,
  brief: { goal: null, users: null, features: [], platforms: null, integrations: null, timeline: null, budget: null, constraints: null },
});

/** `proposals` are the screen steps not yet in the contract (proposals.ts). */
export type Outcome = { session: Session; response?: unknown; proposals?: unknown[]; issue?: ClientIssue };

type Reply = { text: string; components?: Component[]; sources?: Source[]; actions?: Action[]; proposals?: unknown[] };
type Step = Reply & { ask: BriefKey | null };

const suggest = (...labels: string[]): Action[] => labels.map((label) => ({ type: "suggest_reply", label }));

const LIMITS: Record<BriefKey, number> = { goal: 600, users: 300, features: 160, platforms: 200, integrations: 300, timeline: 120, budget: 60, constraints: 300 };

/** What each project flow says after each answer. `ask` names the brief field the next answer fills. */
const FLOWS: Record<Flow, Step[]> = {
  saas: [
    {
      text: "A first version usually works best when it does one job well for one group of people. Who is it for?",
      ask: "users",
      actions: suggest("Small businesses", "Consumers", "Not sure yet"),
    },
    {
      text: "That gives the first release a clear audience. These are the services and ways of working that usually apply to a new product. Which two or three things must the first version do?",
      ask: "features",
      components: [
        { type: "services", slugs: ["saas-development", "mvp-development"] },
        { type: "engagement_models", slugs: ["mvp-sprint", "end-to-end-delivery"] },
      ],
      actions: suggest("Sign-up and online booking", "Dashboard and reports", "Not sure yet"),
    },
    { text: "Good, that is a focused scope to start from. Where should people use it?", ask: "platforms", actions: suggest("Web first", "Web and mobile", "Not sure yet") },
    {
      text: "Here is what I have so far, in your own words. Check it, change anything that is wrong, and leave blank what you have not decided.",
      ask: "constraints",
      components: [{ type: "project_brief", fields: {} }],
      actions: [{ type: "review_brief", label: "Review the brief" }, { type: "book_consultation", label: "Book a consultation" }],
    },
  ],
  automation: [
    {
      text: "Automation pays off fastest on work that is frequent, rule-bound and easy to check. This service area covers it. Which tools does that work happen in today?",
      ask: "integrations",
      components: [{ type: "services", slugs: ["ai-agents-automation"] }],
      actions: suggest("Email and spreadsheets", "A helpdesk and chat", "Not sure yet"),
    },
    {
      text: "A sensible starting point keeps a person approving anything important. These are possible building blocks, to be confirmed after seeing your systems. Who does this work now?",
      ask: "users",
      components: [
        {
          type: "technologies",
          items: [
            { name: "Workflow automation", reason: "Moves information between your current tools without replacing them." },
            { name: "Language model with approval step", reason: "Drafts replies or sorts requests; a person approves before anything is sent." },
            { name: "Logging and review", reason: "Shows what was done, so mistakes can be found and corrected." },
          ],
        },
      ],
      actions: suggest("Our support team", "Operations staff", "Not sure yet"),
    },
    {
      text: "Here is the brief so far, in your own words. Check it and change anything that is wrong.",
      ask: "constraints",
      components: [{ type: "project_brief", fields: {} }],
      actions: [{ type: "review_brief", label: "Review the brief" }, { type: "book_consultation", label: "Book a consultation" }],
    },
  ],
  project: [
    { text: "Thanks. To point you the right way: who will use it?", ask: "users", actions: suggest("Our customers", "Our own team", "Not sure yet") },
    { text: "Understood. What are the most important things it should do?", ask: "features", actions: suggest("Not sure yet") },
    {
      text: "Here is what I have so far, in your own words. Check it and change anything that is wrong.",
      ask: "constraints",
      components: [{ type: "project_brief", fields: {} }],
      actions: [{ type: "review_brief", label: "Review the brief" }, { type: "book_consultation", label: "Book a consultation" }],
    },
  ],
};

/** Questions that are answered at once and never written into the brief. */
const INTENTS: { match: RegExp; reply: (s: Session, now: number) => Reply }[] = [
  {
    match: /\b((book|schedule|arrange|set up)\b[^.?!]{0,24}\b(call|meeting|consultation)|meeting times?)\b/i,
    reply: (_, now) => ({ text: "Here are some times. They are demonstration data: pick one and you can check everything before confirming.", proposals: [{ type: "booking_calendar", demo: true, duration_minutes: 30, days: demoDays(now) }] }),
  },
  {
    match: /\b(talk (to|with)|speak (to|with)|human|real person|a person|call me|email me|contact (me|you|the team|a person)|team (can )?contact)\b/i,
    reply: () => ({
      text: "Of course. Add your details below and check them before anything is sent. They stay out of this AI conversation.",
      proposals: [{ type: "contact_capture", include_brief: true }],
      actions: suggest("Show meeting times"),
    }),
  },
  {
    match: /\b(brief|summary|summari[sz]e)\b/i,
    reply: (s) =>
      s.brief.goal
        ? { text: "This is the brief so far. Anything not discussed is left blank.", components: [{ type: "project_brief", fields: {} }], actions: [{ type: "review_brief", label: "Review the brief" }] }
        : { text: "There is nothing in the brief yet. What would you like to build?", actions: suggest("A SaaS product", "AI automation") },
  },
  {
    match: /\b(case stud(y|ies)|portfolio|past work|your work|examples? of|projects have you)\b/i,
    reply: () => ({
      text: "Here are projects from our published case studies. Each page says what was built.",
      components: [{ type: "case_studies", slugs: ["essentialist", "fennec", "acculance"] }],
      sources: [{ title: "All case studies", path: "/case-studies" }],
      actions: suggest("What services do you offer?", "Talk to a person"),
    }),
  },
  {
    match: /\b(services?|what (do|can) you (do|build|offer))\b/i,
    reply: () => ({
      text: "Our work is grouped into service areas. These three are a common starting point; the services page lists them all.",
      components: [{ type: "services", slugs: ["ai-agents-automation", "ai-software-development", "ui-ux-product-design"] }],
      sources: [{ title: "All services", path: "/services" }],
      actions: suggest("Show me case studies", "I want to build a SaaS product"),
    }),
  },
  {
    match: /\b(who are you|about (code ?shaper|your company|you)|your company|where are you|offices?)\b/i,
    reply: () => ({
      text: "CodeShaper is a software engineering company. The About page has the company's own account of who we are and where we work. What would you like to build?",
      sources: [{ title: "About CodeShaper", path: "/about" }, { title: "Contact and offices", path: "/contact" }],
      actions: suggest("What services do you offer?", "Talk to a person"),
    }),
  },
  {
    match: /\b(price|pricing|cost|how much|quote|budget for)\b/i,
    reply: () => ({
      text: "I can't give a price here. It depends on scope, and a founder can talk it through with you. The engagement models page explains the ways of working.",
      sources: [{ title: "Engagement models", path: "/engagement" }],
      components: [{ type: "consultation" }],
    }),
  },
  { match: /^\s*(hi|hello|hey)\b[\s!.]*$/i, reply: () => ({ text: "Hello. What would you like to build, or what would you like to know about us?", actions: suggest("I want to build a SaaS product", "Automate a business process", "What services do you offer?") }) },
];

/** Never an answer to a question: a meeting or a person asked for, or a bare greeting. */
const ALWAYS = new Set([INTENTS[0], INTENTS[1], INTENTS[INTENTS.length - 1]]);
const SKIP = /^\s*(not sure( yet)?|i (do not|don'?t) know|skip|no idea)[\s.!]*$/i;
const SAAS = /\b(saas|mvp|startup|start-up|founder|new product)\b/i;
const AUTOMATE = /\b(automat\w*|workflow|manual|agent|support tickets|spreadsheets?)\b/i;

const FAILURES: Record<string, { code: ErrorCode; retryable: boolean; retry_after?: number }> = {
  unavailable: { code: "unavailable", retryable: true },
  budget_exhausted: { code: "budget_exhausted", retryable: false },
  rate_limited: { code: "rate_limited", retryable: true, retry_after: 30 },
};

const response = (turn: number, reply: Reply, error: (typeof FAILURES)[string] | null = null) => ({
  contract: "codeshaper.ai.response",
  version: 1,
  request_id: `mock-${turn}`,
  message_id: error ? null : `mock-${turn}:a`,
  status: error ? "error" : "completed",
  text: error ? "" : reply.text,
  sources: reply.sources ?? [],
  actions: reply.actions ?? [],
  components: reply.components ?? [],
  error,
});

const CHANGE = /^(actually|also|and also|please add|add |remove |drop |change )|\b(also (need|want|add)|no longer need)\b/i;
const WHEN = /\b(within|in|by|before) (\d+ (days|weeks|months)|(january|february|march|april|may|june|july|august|september|october|november|december)( \d{4})?|next (week|month|quarter|year))\b/i;

/** A correction said in plain words. Pattern matching only: the real version reads the sentence. */
function revise(brief: BriefFields, said: string): { brief: BriefFields; field: BriefKey; said: string } | null {
  const gone = said.match(/\b(?:remove|drop|no longer need) (?:the )?(.+?)[.!]?$/i)?.[1];
  if (gone) {
    const features = brief.features.filter((f) => !f.toLowerCase().includes(gone.toLowerCase()));
    return features.length === brief.features.length ? null : { brief: { ...brief, features }, field: "features", said: `remove ${gone}` };
  }
  const when = said.match(WHEN)?.[0];
  if (when) return { brief: { ...brief, timeline: when.toLowerCase() }, field: "timeline", said: `a timeline of ${when.toLowerCase()}` };
  if (!CHANGE.test(said)) return null;
  if (/\b(mobile( app(lication)?)?|ios|android)\b/i.test(said)) {
    const platforms = brief.platforms?.toLowerCase().includes("mobile") ? brief.platforms : [brief.platforms, "mobile application"].filter(Boolean).join(", ");
    return { brief: { ...brief, platforms: platforms.slice(0, LIMITS.platforms) }, field: "platforms", said: "a mobile application" };
  }
  const budget = said.match(/\bbudget (?:is|of|around) (.+?)[.!]?$/i)?.[1];
  if (budget) return { brief: { ...brief, budget: budget.slice(0, LIMITS.budget) }, field: "budget", said: "your budget" };
  const added = said
    .replace(/^(actually|also|and also|please add|add|change)\b[,:]?\s*/i, "")
    .replace(/^(we|i) (also )?(need|want)( to add)?\s*/i, "")
    .replace(/^(also )?(add|need|want)\s*/i, "")
    .replace(/^(a|an|the) /i, "")
    .replace(/[.!]$/, "")
    .slice(0, LIMITS.features);
  return added ? { brief: record(brief, "features", added), field: "features", said: added } : null;
}

const shownValue = (b: BriefFields, k: BriefKey) => (k === "features" ? b.features.join(", ") : (b[k] ?? "")).slice(0, 600);

const record = (brief: BriefFields, key: BriefKey, text: string): BriefFields => {
  if (key === "features") {
    const added = text.split(/[,;\n]+/).map((f) => f.trim().slice(0, LIMITS.features)).filter(Boolean);
    return { ...brief, features: [...brief.features, ...added].slice(0, 12) };
  }
  const value = key === "constraints" && brief.constraints ? `${brief.constraints}; ${text}` : text;
  return { ...brief, [key]: value.slice(0, LIMITS[key]) };
};

export function respond(session: Session, text: string, scenario: Scenario = "normal", now = Date.now()): Outcome {
  if (scenario === "network" || scenario === "session_expired") return { session, issue: scenario };
  const turn = session.turn + 1;
  if (scenario !== "normal") return { session, response: response(turn, { text: "" }, FAILURES[scenario]) };
  const said = text.trim();
  // brief cards are filled from the brief as it is after this answer
  const finish = (next: Session, reply: Reply): Outcome => ({
    session: next,
    response: response(turn, { ...reply, components: reply.components?.map((c) => (c.type === "project_brief" ? { type: c.type, fields: next.brief } : c)) }),
    proposals: reply.proposals,
  });

  // an answer to the open question wins over a word that merely looks like a request ("offices", "services")
  const request = INTENTS.find((i) => i.match.test(said));
  const isQuestion = /\?\s*$|^\s*(show|tell|what|who|where|how|can|could|do|i'?d rather|book|talk|speak)\b/i.test(said);
  if (request && ALWAYS.has(request)) return finish({ ...session, turn }, request.reply(session, now));

  if (session.flow && !isQuestion) {
    const change = revise(session.brief, said);
    if (change) {
      return finish(
        { ...session, turn, brief: change.brief },
        {
          text: change.said.startsWith("remove ") ? `Understood. I have updated the draft to ${change.said}. Please check it.` : `Understood. I have updated the draft to include ${change.said}. Please check it.`,
          components: [{ type: "project_brief", fields: change.brief }],
          proposals: [{ type: "brief_changes", changes: [{ field: change.field, before: shownValue(session.brief, change.field), after: shownValue(change.brief, change.field) }] }],
        },
      );
    }
  }
  if (request && (!session.flow || isQuestion)) return finish({ ...session, turn }, request.reply(session, now));

  if (!session.flow) {
    const flow: Flow = SAAS.test(said) ? "saas" : AUTOMATE.test(said) ? "automation" : "project";
    const step = FLOWS[flow][0];
    return finish({ turn, flow, asked: step.ask, brief: record(session.brief, "goal", said) }, step);
  }

  const brief = session.asked && !SKIP.test(said) ? record(session.brief, session.asked, said) : session.brief;
  // the flow has moved on one step for every answer, skipped or not
  const done = FLOWS[session.flow].findIndex((s) => s.ask === session.asked);
  const step = FLOWS[session.flow][done + 1];
  if (step) return finish({ turn, flow: session.flow, asked: step.ask, brief }, step);
  return finish(
    { turn, flow: session.flow, asked: "constraints", brief },
    { text: "Noted. I added that to the brief under constraints. You can review it, or bring in a person.", components: [{ type: "project_brief", fields: brief }], actions: [{ type: "review_brief", label: "Review the brief" }, { type: "book_consultation", label: "Book a consultation" }] },
  );
}

/** What the simulated transcription "hears": a sample that fits where the conversation is. */
export function voiceSample(session: Session): string {
  const samples: Partial<Record<BriefKey, string>> = {
    users: "Small clinics and their patients",
    features: "Online booking, reminders",
    platforms: "Web first, then mobile",
    integrations: "Email and spreadsheets",
    constraints: "We would like to start within two months",
  };
  return (session.asked && samples[session.asked]) || "I'm a founder and want to launch a SaaS MVP for clinic bookings";
}
