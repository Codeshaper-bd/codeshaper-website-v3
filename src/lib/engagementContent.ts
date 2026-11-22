import content from "@/content/engagement.json";
import { getEngagementModel, type EngagementModel } from "@/data/services";

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
 * Sprint / IT Staff Augmentation engagements — inventing that link would
 * misattribute a real client's project to a delivery model they didn't
 * use.
 */

function bySlug(slug: string): EngagementModel {
  const found = getEngagementModel(slug);
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

export const COMPARISON_TABLE: ComparisonRow[] = content.comparison;

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
      { label: "Ongoing", primary: "hire-dedicated-developers", secondary: "offshore-development-center", reason: "Ongoing work is what a Dedicated Development Team (or an Offshore Development Center at scale) is built to sustain." },
    ],
  },
  {
    question: "How clear is your scope?",
    choices: [
      { label: "Clear", primary: "mvp-sprint", secondary: "end-to-end-delivery", reason: "Clear scope means we can commit to fixed milestones instead of open-ended discovery." },
      { label: "Evolving", primary: "hire-dedicated-developers", reason: "Evolving scope fits a retainer model that adapts sprint to sprint, not a fixed contract." },
      { label: "Not sure yet", primary: "end-to-end-delivery", reason: "We'd start with a short discovery phase before locking in a delivery model." },
    ],
  },
  {
    question: "Do you have internal delivery leadership?",
    choices: [
      { label: "Yes, we lead delivery", primary: "staff-augmentation", reason: "With your own delivery lead in place, we simply plug engineers into your existing process." },
      { label: "No, we need that owned for us", primary: "end-to-end-delivery", reason: "Without in-house delivery leadership, End-to-End Delivery gives you one accountable owner for the whole build." },
    ],
  },
];

export type ModelOverview = EngagementModel & { oneLiner: string; bestFor: string[]; startTime: string; ctaLabel: string };

const OVERVIEWS: ModelOverview[] = [
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
    ...bySlug("hire-dedicated-developers"),
    oneLiner: "A stable team aligned to your roadmap — consistent output every sprint.",
    bestFor: ["Ongoing feature delivery", "Scaling product velocity"],
    startTime: "1–2 weeks",
    ctaLabel: "Explore Dedicated Development Team",
  },
  {
    ...bySlug("staff-augmentation"),
    oneLiner: "Add vetted engineers/designers to your team — fast and integration-ready.",
    bestFor: ["Skill gaps or delivery surge", "Hiring freeze / short-term capacity"],
    startTime: "3–10 days",
    ctaLabel: "Explore IT Staff Augmentation",
  },
  {
    ...bySlug("offshore-development-center"),
    // REVIEW
    oneLiner: "Your own long-term offshore team — hired, onboarded, and run by us, with clear rituals and quality gates.",
    bestFor: ["Continuous delivery without local hiring", "Cost efficiency with structure"],
    startTime: "1–2 weeks",
    ctaLabel: "Explore Offshore Development Center",
  },
];

/** The one-line text can be changed in the CMS. */
export const MODEL_OVERVIEWS: ModelOverview[] = OVERVIEWS.map((m) => ({ ...m, oneLiner: (content.oneLiners as Record<string, string>)[m.href] ?? m.oneLiner }));

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
  { q: "How quickly can we start?", a: "IT Staff Augmentation can often start within 3–10 days; other models typically start within 1–3 weeks, depending on role availability and how ready the scope is." },
  { q: "How do you handle scope changes?", a: "We keep changes transparent — trade-offs, priorities, and timeline impact are discussed openly rather than absorbed silently or refused outright." },
  { q: "Can we scale the team up or down?", a: "Yes, especially with IT Staff Augmentation, a Dedicated Development Team, or an Offshore Development Center — team size is designed to flex with your roadmap." },
  { q: "What if we need a replacement for a team member?", a: "We handle transitions with proper handover and overlap, so a role change doesn't stall your delivery cadence." },
  { q: "Do we own the IP and source code?", a: "Yes, always. Source, design assets, and documentation are handed over as part of every engagement's standard close-out." },
  { q: "What tools do you work with?", a: "Jira, Notion, Slack, GitHub, and Figma are our defaults — we're also glad to work inside your existing toolset." },
  { q: "How do you report progress?", a: "Weekly demos, a shared backlog, and a visible decision log — progress is something you can see, not something we describe after the fact." },
  { q: "What pricing model is best for us?", a: "It depends on how clear your scope is: fixed-scope for locked requirements, milestone or T&M for evolving ones, and retainer for ongoing work. We'll recommend one on the first call." },
  { q: "Do you offer post-launch support?", a: "Yes — Website Maintenance & Support and a Dedicated Development Team both exist specifically for the work after v1 ships." },
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
    model: bySlug("mvp-sprint").label,
    href: bySlug("mvp-sprint").href,
    title: "Shipped an MVP in 8 weeks",
    body: "Built core flows, admin, and integrations for a SaaS product under a locked scope.",
    outcome: "Faster launch, a validated roadmap for v2.",
  },
  {
    model: bySlug("hire-dedicated-developers").label,
    href: bySlug("hire-dedicated-developers").href,
    title: "Ongoing delivery for 6+ months",
    body: "A stable squad shipping improvements every sprint for a growing platform.",
    outcome: "Steady velocity, reduced backlog pressure.",
  },
  {
    model: bySlug("staff-augmentation").label,
    href: bySlug("staff-augmentation").href,
    title: "Scaled a team by 3 engineers for 4 months",
    body: "Embedded into the client's existing workflow to accelerate delivery without hiring.",
    outcome: "Cleared priority backlog, shipped key releases.",
  },
];

/** MVP Sprint page content */

export const MVP_BENEFITS = content.mvp.benefits;

export const MVP_AI_EDGE: string[] = content.mvp.aiEdge;

export const MVP_GOOD_FIT: string[] = content.mvp.goodFit;

export const MVP_NOT_IDEAL: string[] = content.mvp.notIdeal;

export type Deliverable = { title: string; items: string[] };

export const MVP_DELIVERABLES: Deliverable[] = content.mvp.deliverables;

export const MVP_TEAM: string[] = content.mvp.team;
export const MVP_TEAM_SPECIALISTS: string[] = content.mvp.specialists;
export const MVP_YOU_PROVIDE: string[] = content.mvp.youProvide;

export const MVP_TIMELINE: DeliveryStep[] = content.mvp.timeline;

export const MVP_ENGINEERING_STANDARDS: string[] = content.mvp.engineering;

export const MVP_COMMUNICATION_STANDARDS: string[] = content.mvp.communication;

export type PricingApproach = { title: string; description: string };

export const MVP_PRICING: PricingApproach[] = content.mvp.pricing;

export const MVP_PRICING_DEPENDS_ON: string[] = content.mvp.pricingDependsOn;

export const MVP_FAQS: Faq[] = content.mvp.faqs;
