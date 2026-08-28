/**
 * Rich content for the Services Hub (/services) and the bespoke AI &
 * Automation pillar page (/services/ai) — everything the thin
 * `SERVICE_COLUMNS` data in navigation.ts doesn't carry. Same
 * separation industriesContent.ts / engagementContent.ts have from
 * navigation.ts.
 *
 * The hub's "Trust Strip" deliberately does NOT use the source brief's
 * literal numbers ("Founded 2021 · Team 20+ · 300+ projects delivered
 * · Clients in USA, Canada & Europe") — those are specific factual
 * claims about the company that nothing else in this codebase can back
 * up (only 3 real case studies exist; the real, already-established
 * hub locations are USA/UK/Bangladesh/Japan/Australia/New Zealand, not
 * Canada/Europe). Replaced with the same honest, categorical, already-
 * real proof used on the Industries/Engagement hubs instead of
 * inventing company history.
 */

export type TrustStat = { icon: string; value: string; label: string };

export const TRUST_STATS: TrustStat[] = [
  { icon: "map-pin", value: "6", label: "Collaboration hubs — Bangladesh, USA, UK, Japan, Australia & NZ" },
  { icon: "layers", value: "5", label: "Service pillars, one delivery system" },
  { icon: "handshake", value: "5", label: "Engagement models to fit any scope" },
  { icon: "clipboard-list", value: "Weekly", label: "Demos + shared board on every engagement" },
];

export const TRUST_QUOTE = {
  quote: "Structured delivery, fast communication, and reliable handover.",
  role: "Product Lead, SaaS Company",
};

export type StarterPath = { goal: string; steps: { label: string; href: string }[] };

export const STARTER_PATHS: StarterPath[] = [
  {
    goal: "Launch a new MVP",
    steps: [
      { label: "Product Discovery", href: "/services/design/discovery" },
      { label: "MVP Sprint", href: "/engagement/mvp-sprint" },
      { label: "Product Engineering", href: "/services/engineering" },
    ],
  },
  {
    goal: "Scale an existing SaaS",
    steps: [
      { label: "Product Engineering", href: "/services/engineering" },
      { label: "APIs & Integrations", href: "/services/engineering/apis" },
      { label: "Design Systems", href: "/services/design/design-systems" },
    ],
  },
  {
    goal: "Increase website conversion",
    steps: [
      { label: "CRO", href: "/services/design/cro" },
      { label: "Landing Pages", href: "/services/websites/landing-pages" },
      { label: "Redesign & Replatforming", href: "/services/websites/replatforming" },
    ],
  },
  {
    goal: "Grow eCommerce revenue",
    steps: [
      { label: "Shopify Development", href: "/services/commerce/shopify" },
      { label: "CRO", href: "/services/design/cro" },
      { label: "Care & Maintenance", href: "/services/websites/care" },
    ],
  },
  {
    goal: "Reduce manual operations",
    steps: [
      { label: "Process & Document Automation", href: "/services/ai/automation" },
      { label: "APIs & Integrations", href: "/services/engineering/apis" },
    ],
  },
];

/** Short, honest capability framing per pillar — not metrics, just what tends to improve. */
export const PILLAR_OUTCOMES: Record<string, string[]> = {
  design: ["Clearer flows", "Faster dev handoff", "Consistent UI", "Better conversion foundations"],
  engineering: ["Maintainable code", "Integration-ready", "Clear ownership", "Built to operate, not just ship"],
  websites: ["Fast load times", "SEO-ready foundation", "Content teams can self-serve", "Built for iteration"],
  commerce: ["Conversion-focused", "Operationally sound", "Built to scale", "Maintainable past launch"],
  ai: ["Faster workflows", "Grounded, not generic answers", "Human-in-the-loop by default", "Measurable time saved"],
};

export type Faq = { q: string; a: string };
export type Quote = { quote: string; name: string; role: string; accent: string };

export const SERVICES_FAQS: Faq[] = [
  { q: "Which service should I start with?", a: "Whatever matches your immediate goal — use the \"Help me choose\" paths above, or book a call and we'll recommend a starting point directly." },
  { q: "Can we start with a small MVP or pilot?", a: "Yes — MVP Sprint exists specifically for that: a focused, time-boxed way to validate before committing to a larger build." },
  { q: "Do you handle integrations with our existing tools?", a: "Yes — APIs & Integrations is one of our most common engagements: payments, CRM, ERP, shipping, and analytics platforms." },
  { q: "How do you estimate scope and timeline?", a: "After a short discovery conversation, we share a scoped estimate with clear assumptions — journeys, integrations, and platform scope all factor in." },
  { q: "Who owns the IP and source code?", a: "You do, always. Source, design assets, and documentation are handed over as part of every engagement's standard close-out." },
  { q: "Do you provide ongoing support after launch?", a: "Yes — Care & Maintenance and Dedicated Product Team engagements both exist specifically for the work after v1 ships." },
];

/** AI & Automation pillar page content */

export const AI_SNAPSHOT = [
  { icon: "target", title: "Who this is for", description: "Teams with a specific, repetitive workflow to speed up — not a general appetite for \"adding AI\" somewhere." },
  { icon: "layers", title: "What we build", description: "AI strategy, custom agents and RAG search grounded in your own data, and automation across the tools you already run." },
  { icon: "shield", title: "What matters most", description: "Accuracy, human oversight on anything consequential, and a measurable reduction in manual work." },
];

export type UseCase = { icon: string; title: string; description: string };

export const AI_USE_CASES: UseCase[] = [
  { icon: "book-open", title: "Internal knowledge base search", description: "Answers grounded in your own docs and SOPs, with sources — not a generic model's guess." },
  { icon: "bot", title: "Support copilots", description: "Draft responses and surface relevant history for support agents, human-reviewed before sending." },
  { icon: "workflow", title: "Document capture & review", description: "Extract, classify, and route documents through an approval chain instead of manual entry." },
  { icon: "clipboard-list", title: "Structured reporting", description: "Turn recurring manual reports into an automated pipeline with a human check before it ships." },
  { icon: "plug", title: "Cross-tool automation", description: "Trigger actions across CRM, helpdesk, and internal tools without a person manually bridging them." },
  { icon: "bar-chart-2", title: "Anomaly & usage detection", description: "Flag unusual patterns in operational or product usage data for a human to investigate." },
  { icon: "brain", title: "AI strategy & feasibility", description: "An honest map of where AI actually pays off in your workflow, before any building starts." },
  { icon: "component", title: "UX microcopy & content drafts", description: "Faster first drafts for in-product copy and documentation, edited and approved by your team." },
];

export const AI_GOOD_FIT = [
  "A specific, repetitive workflow with a clear before/after",
  "Internal documentation or SOPs that support/ops teams search constantly",
  "Reporting or approval steps that are manual today but rule-based enough to automate",
  "A team willing to keep a human in the loop on anything consequential",
];

export const AI_NOT_IDEAL = [
  "You want a general-purpose chatbot with no specific workflow attached",
  "The task requires judgment calls with no acceptable error rate and no human review step",
  "Source data is too inconsistent or sparse to ground answers in yet",
];

export type ProcessStep = { n: string; title: string; description: string };

export const AI_PROCESS: ProcessStep[] = [
  { n: "1", title: "Use-case mapping", description: "We map where AI could realistically save time or reduce error in your actual workflow — not a generic capability list." },
  { n: "2", title: "Feasibility & data check", description: "We check whether the data needed to ground the system reliably actually exists and is accessible." },
  { n: "3", title: "Design & guardrails", description: "Scope what the system can and can't do on its own, and where a human reviews before anything ships." },
  { n: "4", title: "Build & evaluate", description: "Iterative build with real test cases, evaluated against accuracy and failure-mode criteria, not just a demo." },
  { n: "5", title: "Launch & monitor", description: "Release with monitoring in place, so drift or failure modes get caught early, not after they compound." },
];

export const AI_GUARDRAILS = [
  "Human review on anything consequential — no fully autonomous high-stakes actions by default",
  "Grounded in your own data via RAG, not relying on a model's unverified general knowledge",
  "Evaluation against real test cases before launch, not just a working demo",
  "Clear logging of what the system did and why, for anything that touches real operations",
  "Data handling scoped to what the use case actually needs — no unnecessary data exposure",
];

export type StackCategory = { category: string; tools: string[] };

export const AI_STACK: StackCategory[] = [
  { category: "LLM Providers", tools: ["OpenAI", "Anthropic", "Open-source models where appropriate"] },
  { category: "Retrieval & RAG", tools: ["Vector databases", "Embedding pipelines", "Document chunking & indexing"] },
  { category: "Automation & Orchestration", tools: ["Workflow automation platforms", "Custom agent orchestration", "Webhooks & schedulers"] },
  { category: "Integration Layer", tools: ["REST/GraphQL APIs", "CRM & helpdesk connectors", "Internal auth & permissions"] },
];

export const AI_TESTIMONIALS: Quote[] = [
  { quote: "It answers from our actual docs, not a generic guess — that alone changed how support handles tickets.", name: "Head of Support", role: "B2B Platform", accent: "#8a7bff" },
  { quote: "They were upfront about what wouldn't work yet instead of overselling the automation.", name: "Ops Director", role: "Logistics Company", accent: "#5b9bdb" },
  { quote: "The human-review step meant we could trust it in production from week one.", name: "VP Engineering", role: "Fintech Startup", accent: "#3fae82" },
];

export const AI_FAQS: Faq[] = [
  { q: "Will this replace our team?", a: "No — every automation we build keeps a human in the loop on consequential decisions. The goal is removing manual busywork, not decision-making." },
  { q: "How do you handle hallucination or wrong answers?", a: "By grounding answers in your own data via RAG rather than relying on a model's general knowledge, and evaluating against real test cases before launch." },
  { q: "Is our data safe?", a: "We scope data access to exactly what the use case needs, and can work within your existing security and access-control requirements." },
  { q: "Do we need our documentation cleaned up first?", a: "Not perfectly — but a feasibility check happens early specifically to catch data gaps before we build on top of them." },
  { q: "Can you integrate with our existing tools?", a: "Yes — most AI and automation engagements are as much about integration (CRM, helpdesk, internal tools) as they are about the model itself." },
  { q: "How do we measure if it's working?", a: "We define success criteria — time saved, error rate, resolution speed — before launch, so impact is measurable, not anecdotal." },
];
