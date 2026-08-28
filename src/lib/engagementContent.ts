import { ENGAGEMENT_MODELS, type EngagementModel } from "./navigation";

/**
 * Rich content for the Engagement Models hub (/engagement) and the
 * bespoke MVP Sprint detail page (/engagement/mvp-sprint) — everything
 * the thin `EngagementModel` type in navigation.ts doesn't carry. Same
 * separation as industriesContent.ts has from navigation.ts.
 *
 * Proof cards and the MVP Sprint "featured sprint" below are explicit
 * placeholders — the source brief for this page directly calls for
 * anonymized placeholder proof until real, publishable metrics exist
 * ("Use placeholders until you add real metrics" / "anonymized until
 * you publish the real"). Not tied to any of the 3 real case studies in
 * caseStudies.ts, since none of those are actually tagged as MVP
 * Sprint / Team Augmentation engagements — inventing that link would
 * misattribute a real client's project to a delivery model they didn't
 * use.
 */

function bySlug(slug: string): EngagementModel {
  const found = ENGAGEMENT_MODELS.find((m) => m.href.endsWith(`/${slug}`));
  if (!found) throw new Error(`Unknown engagement model slug: ${slug}`);
  return found;
}

export type WhatYouGet = { icon: string; title: string; description: string };

export const WHAT_YOU_GET: WhatYouGet[] = [
  { icon: "handshake", title: "Clear ownership", description: "One accountable point of contact. Clear roles, responsibilities, and decision flow." },
  { icon: "clipboard-list", title: "Weekly demos + transparent progress", description: "Predictable check-ins, a visible backlog, and clear next steps — no surprises." },
  { icon: "life-buoy", title: "Quality gates built in", description: "Reviews, QA, and release checks before anything ships." },
  { icon: "book-open", title: "Documentation + handover you can rely on", description: "Clean specs, release notes, and structured handover — not knowledge in someone's head." },
];

export type ComparisonRow = {
  href: string;
  model: string;
  bestFor: string;
  speed: string;
  involvement: string;
  certainty: string;
  pricing: string;
  teamSize: string;
  commitment: string;
};

export const COMPARISON_TABLE: ComparisonRow[] = [
  {
    href: bySlug("mvp-sprint").href,
    model: "MVP Sprint",
    bestFor: "Launch a focused v1 fast",
    speed: "1–2 weeks",
    involvement: "Medium–High",
    certainty: "Clear",
    pricing: "Fixed scope",
    teamSize: "3–6",
    commitment: "4–12 weeks",
  },
  {
    href: bySlug("end-to-end-delivery").href,
    model: "End-to-End Delivery",
    bestFor: "Full build with one accountable partner",
    speed: "1–3 weeks",
    involvement: "Medium",
    certainty: "Mixed",
    pricing: "Milestones / T&M",
    teamSize: "4–10",
    commitment: "2–6+ months",
  },
  {
    href: bySlug("dedicated-team").href,
    model: "Dedicated Product Team",
    bestFor: "Ongoing roadmap delivery",
    speed: "1–2 weeks",
    involvement: "Medium",
    certainty: "Evolving",
    pricing: "Monthly retainer",
    teamSize: "4–12",
    commitment: "3+ months",
  },
  {
    href: bySlug("team-augmentation").href,
    model: "Team Augmentation",
    bestFor: "Fill skill gaps quickly",
    speed: "3–10 days",
    involvement: "High",
    certainty: "Any",
    pricing: "Hourly / Monthly",
    teamSize: "1–8",
    commitment: "Flexible",
  },
  {
    href: bySlug("global-delivery").href,
    model: "Global Delivery Model",
    bestFor: "Scale delivery with strong overlap + efficient scaling",
    speed: "1–2 weeks",
    involvement: "Medium",
    certainty: "Evolving",
    pricing: "Monthly / T&M",
    teamSize: "5–15",
    commitment: "3+ months",
  },
];

export const AT_A_GLANCE = [
  { icon: "zap", label: "Start time", value: "3–10 days" },
  { icon: "clipboard-list", label: "Delivery cadence", value: "Weekly demos" },
  { icon: "layout-dashboard", label: "Visibility", value: "Shared backlog + milestones" },
  { icon: "handshake", label: "Ownership", value: "Single point of contact" },
];

export type QuizChoice = { label: string; primary: string; secondary?: string; reason: string };
export type QuizQuestion = { question: string; choices: QuizChoice[] };

export const DECISION_QUIZ: QuizQuestion[] = [
  {
    question: "What's your timeline?",
    choices: [
      { label: "Weeks", primary: "mvp-sprint", reason: "A tight timeline is exactly what MVP Sprint is built for — scope locked, shipped in 4–12 weeks." },
      { label: "Months", primary: "end-to-end-delivery", reason: "A multi-month build fits End-to-End Delivery's milestone-based ownership model." },
      { label: "Ongoing", primary: "dedicated-team", secondary: "global-delivery", reason: "Ongoing work is what a Dedicated Product Team (or Global Delivery at scale) is built to sustain." },
    ],
  },
  {
    question: "How clear is your scope?",
    choices: [
      { label: "Clear", primary: "mvp-sprint", secondary: "end-to-end-delivery", reason: "Clear scope means we can commit to fixed milestones instead of open-ended discovery." },
      { label: "Evolving", primary: "dedicated-team", reason: "Evolving scope fits a retainer model that adapts sprint to sprint, not a fixed contract." },
      { label: "Not sure yet", primary: "end-to-end-delivery", reason: "We'd start with a short discovery phase before locking in a delivery model." },
    ],
  },
  {
    question: "Do you have internal delivery leadership?",
    choices: [
      { label: "Yes, we lead delivery", primary: "team-augmentation", reason: "With your own delivery lead in place, we simply plug engineers into your existing process." },
      { label: "No, we need that owned for us", primary: "end-to-end-delivery", reason: "Without in-house delivery leadership, End-to-End Delivery gives you one accountable owner for the whole build." },
    ],
  },
];

export type ModelOverview = EngagementModel & { oneLiner: string; bestFor: string[]; startTime: string; ctaLabel: string };

export const MODEL_OVERVIEWS: ModelOverview[] = [
  {
    ...bySlug("mvp-sprint"),
    oneLiner: "Validate and launch a focused MVP fast — without scope chaos.",
    bestFor: ["New product launch / v1", "Quick validation + traction"],
    startTime: "1–2 weeks",
    ctaLabel: "Explore MVP Sprint",
  },
  {
    ...bySlug("end-to-end-delivery"),
    oneLiner: "One accountable partner from scope to launch — built with predictable milestones.",
    bestFor: ["Full product builds", "Redesign + replatform + integrations"],
    startTime: "1–3 weeks",
    ctaLabel: "Explore End-to-End Delivery",
  },
  {
    ...bySlug("dedicated-team"),
    oneLiner: "A stable squad aligned to your roadmap — consistent output every sprint.",
    bestFor: ["Ongoing feature delivery", "Scaling product velocity"],
    startTime: "1–2 weeks",
    ctaLabel: "Explore Dedicated Product Team",
  },
  {
    ...bySlug("team-augmentation"),
    oneLiner: "Add vetted engineers/designers to your team — fast and integration-ready.",
    bestFor: ["Skill gaps or delivery surge", "Hiring freeze / short-term capacity"],
    startTime: "3–10 days",
    ctaLabel: "Explore Team Augmentation",
  },
  {
    ...bySlug("global-delivery"),
    oneLiner: "Scalable delivery with strong overlap, clear rituals, and quality gates.",
    bestFor: ["Continuous delivery without local hiring", "Cost efficiency with structure"],
    startTime: "1–2 weeks",
    ctaLabel: "Explore Global Delivery",
  },
];

export type DeliveryStep = { n: string; title: string; description: string };

export const DELIVERY_STEPS: DeliveryStep[] = [
  { n: "1", title: "Discovery & kickoff", description: "Goals, scope, and success metrics — agreed before anything else starts." },
  { n: "2", title: "Planning & backlog", description: "Milestones, tickets, and acceptance criteria, so build work never starts undefined." },
  { n: "3", title: "Build & QA", description: "Engineering and testing run in the same sprint, not as a separate phase bolted on after." },
  { n: "4", title: "Demo & feedback", description: "Weekly demos and structured reviews keep direction correct before it compounds." },
  { n: "5", title: "Release & monitor", description: "Release checks, rollback readiness, and monitoring before anything reaches real users." },
  { n: "6", title: "Support & iteration", description: "Continuous improvement after launch, on whichever cadence fits your team next." },
];

export const DELIVERY_TOOLS = ["Jira", "Notion", "Slack", "GitHub", "Figma"];

export type Faq = { q: string; a: string };
export type Quote = { quote: string; name: string; role: string; accent: string };

export const HUB_FAQS: Faq[] = [
  { q: "How quickly can we start?", a: "Team Augmentation can often start within 3–10 days; other models typically start within 1–3 weeks, depending on role availability and how ready the scope is." },
  { q: "How do you handle scope changes?", a: "We keep changes transparent — trade-offs, priorities, and timeline impact are discussed openly rather than absorbed silently or refused outright." },
  { q: "Can we scale the team up or down?", a: "Yes, especially under Team Augmentation, Dedicated Product Team, and Global Delivery — team size is designed to flex with your roadmap." },
  { q: "What if we need a replacement for a team member?", a: "We handle transitions with proper handover and overlap, so a role change doesn't stall your delivery cadence." },
  { q: "Do we own the IP and source code?", a: "Yes, always. Source, design assets, and documentation are handed over as part of every engagement's standard close-out." },
  { q: "What tools do you work with?", a: "Jira, Notion, Slack, GitHub, and Figma are our defaults — we're also glad to work inside your existing toolset." },
  { q: "How do you report progress?", a: "Weekly demos, a shared backlog, and a visible decision log — progress is something you can see, not something we describe after the fact." },
  { q: "What pricing model is best for us?", a: "It depends on how clear your scope is: fixed-scope for locked requirements, milestone or T&M for evolving ones, and retainer for ongoing work. We'll recommend one on the first call." },
  { q: "Do you offer post-launch support?", a: "Yes — Care & Maintenance and Dedicated Product Team engagements both exist specifically for the work after v1 ships." },
  { q: "How do we keep communication fast across time zones?", a: "Weekly demo overlap windows, async written updates, and a single accountable point of contact keep cross-timezone work from turning into blind spots." },
];

export const HUB_TESTIMONIALS: Quote[] = [
  { quote: "The weekly demos made progress completely visible. No surprises — just steady delivery.", name: "Founder", role: "SaaS Product", accent: "#8a7bff" },
  { quote: "They integrated into our workflow quickly and communicated clearly throughout.", name: "CTO", role: "Digital Platform", accent: "#5b9bdb" },
  { quote: "The team understood the goal fast and helped us cut scope without losing impact.", name: "Product Manager", role: "Marketplace", accent: "#3fae82" },
  { quote: "We felt supported from planning to release — handover was clean and structured.", name: "Ops Lead", role: "Internal Tooling", accent: "#d99a4e" },
];

export type ProofCard = { model: string; href: string; title: string; body: string; outcome: string };

export const HUB_PROOF: ProofCard[] = [
  {
    model: "MVP Sprint",
    href: "/engagement/mvp-sprint",
    title: "Shipped an MVP in 8 weeks",
    body: "Built core flows, admin, and integrations for a SaaS product under a locked scope.",
    outcome: "Faster launch, a validated roadmap for v2.",
  },
  {
    model: "Dedicated Product Team",
    href: "/engagement/dedicated-team",
    title: "Ongoing delivery for 6+ months",
    body: "A stable squad shipping improvements every sprint for a growing platform.",
    outcome: "Steady velocity, reduced backlog pressure.",
  },
  {
    model: "Team Augmentation",
    href: "/engagement/team-augmentation",
    title: "Scaled a team by 3 engineers for 4 months",
    body: "Embedded into the client's existing workflow to accelerate delivery without hiring.",
    outcome: "Cleared priority backlog, shipped key releases.",
  },
];

/** MVP Sprint page content */

export const MVP_BENEFITS = [
  { icon: "zap", title: "Speed to market", description: "Launch a usable v1 quickly, instead of waiting for a feature-complete version that never quite arrives." },
  { icon: "shield", title: "Lower risk", description: "Scope stays focused and measurable, so budget goes toward what actually validates the product." },
  { icon: "target", title: "Better decisions", description: "Real user feedback informs v2 — not internal opinions about what might matter." },
];

export const MVP_AI_EDGE = [
  "Faster backlog drafts from flows and requirements",
  "Faster QA support — test cases and edge-case coverage",
  "Faster iteration on UX microcopy and UI variants",
  "Faster scaffolding for standard components",
];

export const MVP_GOOD_FIT = [
  "Idea or prototype moving to a market-ready v1",
  "MVP built for funding, partnerships, or early traction",
  "An internal tool replacing manual operations",
  "A new feature line that needs fast validation",
];

export const MVP_NOT_IDEAL = [
  "You want a full platform in v1, without prioritization",
  "Requirements are unknown and stakeholders can't align",
  "Delivery depends on long external approvals or procurement",
];

export type Deliverable = { title: string; items: string[] };

export const MVP_DELIVERABLES: Deliverable[] = [
  { title: "Blueprint", items: ["MVP scope: must-have / should-have / later", "Core user journeys + flow map", "Acceptance criteria (high level) + delivery plan"] },
  { title: "Design", items: ["UX/UI for core flows", "Clickable prototype for key journeys", "Dev-ready specs + handoff documentation"] },
  { title: "Build", items: ["MVP web or mobile app (based on scope)", "Backend/API + essential integrations", "Authentication + role access, as needed"] },
  { title: "Release-ready", items: ["QA passes on critical scenarios", "Staging → production deployment", "Release notes + handover package + v2 roadmap"] },
];

export const MVP_TEAM = ["Delivery Lead — project ownership + cadence", "Product Designer, when design scope is included", "Frontend Engineer", "Backend Engineer", "QA Engineer", "DevOps support, when needed"];
export const MVP_TEAM_SPECIALISTS = ["Solution architect — complex systems", "Data/AI engineer — AI features"];
export const MVP_YOU_PROVIDE = ["A decision-maker available for weekly feedback", "Access to brand/product assets, if any", "Priority clarity — what matters most for v1"];

export const MVP_TIMELINE: DeliveryStep[] = [
  { n: "1", title: "Kickoff + scope lock", description: "Days 1–5 — goals, success metrics, core journeys, MVP scope, and milestones." },
  { n: "2", title: "UX/UI + backlog shaping", description: "Week 1–2 — flows, prototype (if included), ticket breakdown, and build plan." },
  { n: "3", title: "Build + QA in weekly increments", description: "Week 2–10 — a weekly cadence of demo, feedback, and next increment." },
  { n: "4", title: "Hardening + release readiness", description: "Final 1–2 weeks — bug fixing, a performance baseline, and the launch checklist." },
  { n: "5", title: "Launch + handover + next roadmap", description: "Production release, full documentation, and a v2 plan." },
];

export const MVP_ENGINEERING_STANDARDS = [
  "Code reviews before merge",
  "QA gates for critical flows",
  "Release checklist — staging to production",
  "Performance baselines where relevant (e.g. Core Web Vitals for web)",
  "Basic accessibility considerations from sprint 1, where applicable",
  "Documentation and handover included",
  "Clear change control — scope changes stay transparent",
];

export const MVP_COMMUNICATION_STANDARDS = ["One owner responsible for delivery", "Weekly checkpoint + demo", "Async updates between meetings"];

export type PricingApproach = { title: string; description: string };

export const MVP_PRICING: PricingApproach[] = [
  { title: "Fixed-scope / fixed-price", description: "For certainty when scope is clear from the start." },
  { title: "Sprint-based pricing", description: "When phased execution fits the build better than one lump commitment." },
  { title: "Time & materials", description: "When discovery reveals scope that's still evolving." },
];

export const MVP_PRICING_DEPENDS_ON = ["Journeys/screens + integrations", "Platform scope — web vs. web + mobile", "Admin complexity + roles/permissions", "Timeline constraints"];

export const MVP_FAQS: Faq[] = [
  { q: "What do you mean by \"MVP\"?", a: "A focused version of the product that delivers the core value and can be used by real users, without unnecessary features." },
  { q: "Can you help us define the MVP scope?", a: "Yes — scope definition is a core part of the MVP Sprint model, not something you're expected to arrive with already finished." },
  { q: "What if our scope changes mid-sprint?", a: "We handle changes transparently — we'll adjust priorities, trade features, or extend the timeline, based on what matters most." },
  { q: "Do you include UI design and prototyping?", a: "Yes, if your sprint includes the design track. If you already have designs, we can build directly from those instead." },
  { q: "Can you integrate with our existing stack?", a: "Yes. We can build within your stack, or recommend a pragmatic stack chosen for speed if you're starting from scratch." },
  { q: "Do we own the source code and IP?", a: "Yes. You own every deliverable once payments are completed." },
  { q: "Do you provide post-launch support?", a: "Yes — we can support fixes, improvements, and iterations as a follow-up engagement after the sprint ends." },
  { q: "How quickly can we start?", a: "Typically within 1–2 weeks, depending on availability and how ready the scope is." },
];
