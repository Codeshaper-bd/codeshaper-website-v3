import { INDUSTRIES, SERVICE_COLUMNS, type IndustryLink } from "./navigation";

/**
 * Rich content for the Industries Hub (/industries) and the bespoke SaaS
 * detail page (/industries/saas) — everything the thin `IndustryLink` type
 * in navigation.ts doesn't carry (it only holds what the mega menu + the
 * generic DetailPage template need). Kept in its own file rather than
 * bloated onto navigation.ts, the same separation caseStudies.ts already
 * has from navigation.ts.
 *
 * Testimonial personas below are explicit placeholders (invented names/
 * companies), the same convention already used by the homepage's
 * Testimonials.tsx — not real client quotes. Swap for real ones as they're
 * collected.
 */

export type FeaturedIndustry = IndustryLink & {
  challenge: string;
  ctaLabel: string;
};

const FEATURED_SLUGS = ["saas", "ecommerce", "fintech", "real-estate", "logistics", "travel"];

function bySlug(slug: string): IndustryLink {
  const found = INDUSTRIES.find((i) => i.href.endsWith(`/${slug}`));
  if (!found) throw new Error(`Unknown industry slug: ${slug}`);
  return found;
}

const CHALLENGES: Record<string, string> = {
  saas: "Trials that don't convert, onboarding that leaks users, and billing that can't keep up with new plans.",
  ecommerce: "Slow storefronts, cart abandonment, and a CMS the marketing team is afraid to touch.",
  fintech: "Compliance requirements that slow every release, and dashboards users don't trust.",
  "real-estate": "Listings that go stale, leads that fall through the cracks between portal and CRM.",
  logistics: "Dispatch decisions made from spreadsheets, with no live visibility once a job leaves the yard.",
  travel: "Booking flows that lose people at payment, and itineraries that break the moment plans change.",
};

const CTAS: Record<string, string> = {
  saas: "See the SaaS playbook",
  ecommerce: "Talk about your storefront",
  fintech: "Talk about your platform",
  "real-estate": "Talk about your portal",
  logistics: "Talk about your operations",
  travel: "Talk about your booking flow",
};

export const FEATURED_INDUSTRIES: FeaturedIndustry[] = FEATURED_SLUGS.map((slug) => ({
  ...bySlug(slug),
  challenge: CHALLENGES[slug],
  ctaLabel: CTAS[slug],
}));

export const MORE_INDUSTRIES: IndustryLink[] = INDUSTRIES.filter((i) => !FEATURED_SLUGS.includes(i.href.split("/").pop()!));

export type UseCase = { icon: string; title: string; description: string };

export const USE_CASES: UseCase[] = [
  { icon: "layout-dashboard", title: "Customer & admin dashboards", description: "Role-aware views that surface the right data to the right user, not a wall of tables." },
  { icon: "credit-card", title: "Billing & subscriptions", description: "Plans, metering, upgrades/downgrades, and invoicing that hold up as pricing evolves." },
  { icon: "plug", title: "Third-party integrations", description: "CRM, payments, ERP, and analytics wired together so data stops living in five places." },
  { icon: "users", title: "Onboarding & activation flows", description: "Guided first-run experiences built to get a new user to their first real result fast." },
  { icon: "bar-chart-2", title: "Reporting & analytics", description: "Operational and business dashboards built on data people actually trust." },
  { icon: "workflow", title: "Approval & workflow automation", description: "Multi-step review and approval chains that replace email threads and spreadsheets." },
  { icon: "shield", title: "Access control & permissions", description: "Roles, teams, and tenancy boundaries that hold up as an org's structure grows." },
  { icon: "refresh-cw", title: "Legacy modernization", description: "Incremental migration off aging platforms, with production data intact throughout." },
];

export type VerticalExpertiseCard = { n: string; title: string; description: string };

export const VERTICAL_EXPERTISE: VerticalExpertiseCard[] = [
  {
    n: "01",
    title: "Fewer expensive assumptions",
    description: "We already know where SaaS trials leak or where logistics dispatch breaks down — so early decisions start closer to right.",
  },
  {
    n: "02",
    title: "Vocabulary that matches your team's",
    description: "Discovery moves faster when we already understand your workflows, compliance constraints, and the metrics your team is measured on.",
  },
  {
    n: "03",
    title: "Patterns proven under real usage",
    description: "Billing, dispatch, and booking systems we've shipped before, adapted to your specifics instead of built from a blank page.",
  },
  {
    n: "04",
    title: "Honest scoping from day one",
    description: "We'll tell you what's a 6-week sprint and what genuinely needs a bigger engagement — before you commit budget either way.",
  },
];

export type PillarMapping = { industry: string; industryHref: string; pillars: { title: string; href: string }[] };

const PILLAR_BY_ID: Record<string, { title: string; href: string }> = Object.fromEntries(
  SERVICE_COLUMNS.map((c) => [c.id, { title: c.title, href: c.href }])
);

export const INDUSTRY_SERVICE_MAP: PillarMapping[] = [
  { industry: "SaaS", industryHref: "/industries/saas", pillars: [PILLAR_BY_ID.engineering, PILLAR_BY_ID.ai, PILLAR_BY_ID.design] },
  { industry: "eCommerce & Retail", industryHref: "/industries/ecommerce", pillars: [PILLAR_BY_ID.commerce, PILLAR_BY_ID.websites, PILLAR_BY_ID.design] },
  { industry: "FinTech", industryHref: "/industries/fintech", pillars: [PILLAR_BY_ID.engineering, PILLAR_BY_ID.design, PILLAR_BY_ID.ai] },
  { industry: "Real Estate", industryHref: "/industries/real-estate", pillars: [PILLAR_BY_ID.engineering, PILLAR_BY_ID.websites, PILLAR_BY_ID.ai] },
  { industry: "Logistics", industryHref: "/industries/logistics", pillars: [PILLAR_BY_ID.engineering, PILLAR_BY_ID.ai, PILLAR_BY_ID.design] },
  { industry: "Travel & Hospitality", industryHref: "/industries/travel", pillars: [PILLAR_BY_ID.websites, PILLAR_BY_ID.engineering, PILLAR_BY_ID.design] },
];

export type Quote = { quote: string; name: string; role: string; accent: string };

export const HUB_TESTIMONIALS: Quote[] = [
  {
    quote: "They understood our onboarding funnel faster than vendors we'd worked with for a year.",
    name: "Elena Marsh",
    role: "VP Product, Northlake SaaS",
    accent: "#8a7bff",
  },
  {
    quote: "The dispatch dashboard they built is the first system our ops team actually opens every morning.",
    name: "Ravi Kapoor",
    role: "Ops Director, Freightline Logistics",
    accent: "#5b9bdb",
  },
  {
    quote: "Compliance sign-off used to be our slowest step. It isn't anymore.",
    name: "Dana Whitfield",
    role: "Head of Engineering, Vaultric",
    accent: "#3fae82",
  },
];

export const SAAS_TESTIMONIALS: Quote[] = [
  {
    quote: "Our activation rate moved within the first month of the new onboarding flow shipping.",
    name: "Marcus Lin",
    role: "Founder, Ledgerly",
    accent: "#8a7bff",
  },
  {
    quote: "They rebuilt our billing system without a single day of downtime for existing customers.",
    name: "Priya Chandrasekaran",
    role: "CTO, Northwind Analytics",
    accent: "#d97fc4",
  },
  {
    quote: "Weekly demos meant we never got a surprise — just steady, visible progress.",
    name: "Tobias Reyes",
    role: "Head of Product, Fieldstack",
    accent: "#d99a4e",
  },
];

export type Faq = { q: string; a: string };

export const HUB_FAQS: Faq[] = [
  {
    q: "Do you only work with the industries listed here?",
    a: "These are where we have the deepest repeat experience, but we regularly take on adjacent verticals — tell us what you're building and we'll give you an honest fit check.",
  },
  {
    q: "Can you share a case study from my exact industry?",
    a: "We'll point you to the closest real project we have and be direct about what's the same and what's different if it isn't an exact match yet.",
  },
  {
    q: "How fast can we get started?",
    a: "An MVP Sprint can kick off within about a week of scoping. Larger engagements start with a short discovery phase to lock scope before any build work begins.",
  },
  {
    q: "Do you work with our existing engineering team?",
    a: "Yes — Team Augmentation and Dedicated Product Team are both built for that; our people slot into your process instead of replacing it.",
  },
  {
    q: "Who owns the code and IP?",
    a: "You do, always. Source, design assets, and documentation are handed over as part of every engagement's standard close-out.",
  },
  {
    q: "How do you handle industry-specific compliance?",
    a: "We scope compliance requirements (data residency, access logging, audit trails, etc.) during discovery, not after the build starts — it shapes the architecture from day one.",
  },
];

export const SAAS_FAQS: Faq[] = [
  {
    q: "We already have an MVP — can you take over from here?",
    a: "Yes. Most SaaS engagements start with a codebase audit so we understand what's there before proposing changes, rather than recommending a rebuild by default.",
  },
  {
    q: "Do you build multi-tenant architecture from scratch?",
    a: "We do, and we'll also tell you honestly if single-tenant with a later migration path is the faster, cheaper route for your current stage.",
  },
  {
    q: "Can you integrate with Stripe, our CRM, or our existing auth provider?",
    a: "Yes — integration work like this is a large share of what we do for SaaS clients specifically, not a bolt-on afterthought.",
  },
  {
    q: "What if our pricing model changes mid-build?",
    a: "We design billing logic to expect that — plans, metering, and entitlements are built as configurable data, not hardcoded assumptions.",
  },
  {
    q: "How involved do we need to be during the build?",
    a: "Weekly demos and shared board visibility are standard, but day-to-day involvement scales to what your team has time for — from hands-on to lightly-checked-in.",
  },
  {
    q: "Can you help after launch, not just build and leave?",
    a: "Yes — Care & Maintenance and Dedicated Product Team engagements both exist specifically for the ongoing work after v1 ships.",
  },
];

export const SAAS_SNAPSHOT = [
  { icon: "users", title: "Who we build for", description: "Early-stage founders validating a first version, and growing SaaS teams scaling past their first hundred customers." },
  { icon: "layers", title: "What we build", description: "Multi-tenant architecture, billing and metering, role-based access, onboarding flows, and the analytics that prove it's working." },
  { icon: "target", title: "What matters most", description: "Time-to-value for new users, retention past the trial window, and a system that doesn't need a rebuild at the next growth stage." },
];

export const SAAS_PROBLEMS: string[] = [
  "Trial signups that don't convert to paid because onboarding takes too long to reach value",
  "Billing logic hardcoded around the first pricing model, breaking the moment plans change",
  "No clean way to separate tenant data as the customer base grows past the first few accounts",
  "Admin and customer-facing dashboards built as an afterthought, not a real product surface",
  "Feature flags and permissions managed by hand instead of by a real access model",
  "Analytics that can't answer basic retention or activation questions with confidence",
  "Integrations (Stripe, CRM, SSO) bolted on individually instead of designed as a system",
  "Technical debt from the MVP phase slowing every release six months post-launch",
  "No clear ownership of the codebase after the original founding engineers move on",
];

export const SAAS_OUTCOMES: string[] = [
  "A billing system that survives your next three pricing changes, not just the current one",
  "Onboarding that gets new users to their first real result inside one session",
  "Dashboards your team opens because they trust the numbers, not despite them",
  "A permissions and tenancy model that scales past your next 10x in customers",
  "Clean, documented handover so you're never dependent on one person's memory",
  "A codebase your next engineering hire can actually ramp up on quickly",
];

export type SolutionPillar = { title: string; href: string; items: string[] };

export const SAAS_SOLUTIONS: SolutionPillar[] = [
  {
    title: "Product Engineering",
    href: "/services/engineering/saas",
    items: ["Multi-tenant architecture", "Billing, metering & entitlements", "Role-based access control", "API design & integrations"],
  },
  {
    title: "Experience & Product Design",
    href: "/services/design/ux-ui",
    items: ["Onboarding & activation flows", "Admin & customer dashboards", "Design systems for fast iteration", "Conversion-focused pricing pages"],
  },
  {
    title: "AI & Automation",
    href: "/services/ai/agents-rag",
    items: ["In-product AI assistants", "Usage-based automation triggers", "Support & documentation search", "Anomaly detection on usage data"],
  },
  {
    title: "Websites & Growth",
    href: "/services/websites/marketing",
    items: ["Marketing site & landing pages", "SEO-ready technical foundation", "Changelog & docs infrastructure", "Care & maintenance post-launch"],
  },
];

export const SAAS_USE_CASES: UseCase[] = [
  { icon: "layers", title: "Multi-tenant SaaS architecture", description: "Data isolation and tenancy boundaries built to hold up past your first hundred customers." },
  { icon: "credit-card", title: "Subscription billing & metering", description: "Plans, usage-based pricing, upgrades/downgrades, and invoicing via Stripe or your billing provider." },
  { icon: "users", title: "Onboarding & activation", description: "Guided first-run flows built around the specific action that predicts retention." },
  { icon: "layout-dashboard", title: "Admin & customer dashboards", description: "Two real products in one: an internal ops view and a customer-facing surface." },
  { icon: "bar-chart-2", title: "Product analytics", description: "Activation, retention, and usage reporting your team can actually make decisions from." },
  { icon: "plug", title: "Third-party & SSO integrations", description: "Stripe, CRM, support tools, and enterprise SSO wired in as first-class citizens." },
  { icon: "workflow", title: "Workflow & approval automation", description: "In-app review chains and automation that replace manual ops work." },
  { icon: "bot", title: "In-product AI features", description: "AI assistants and automation grounded in your own product data, not a generic chatbot." },
  { icon: "refresh-cw", title: "Legacy platform migration", description: "Moving an aging monolith to a modern, maintainable stack without a big-bang rewrite." },
  { icon: "shield", title: "Security & compliance readiness", description: "Audit logging, access control, and the groundwork SOC 2 / GDPR reviews expect." },
];

export type ProcessStep = { n: string; title: string; description: string };

export const SAAS_PROCESS: ProcessStep[] = [
  { n: "1", title: "Discovery & audit", description: "We map your current product (or blank-slate goals), constraints, and the metrics that define success." },
  { n: "2", title: "Architecture & scope", description: "Multi-tenancy, billing model, and integration points get decided before a line of production code is written." },
  { n: "3", title: "Design", description: "Onboarding, dashboards, and core flows designed around the specific actions that drive activation." },
  { n: "4", title: "Engineering build", description: "Iterative delivery in weekly cycles, with a working build to review at every checkpoint." },
  { n: "5", title: "QA & launch readiness", description: "Cross-tenant testing, billing edge cases, and access-control checks before anything ships to real users." },
  { n: "6", title: "Launch & ongoing care", description: "Release, then continued iteration or maintenance — whichever cadence fits your team next." },
];

export type ToolCategory = { category: string; tools: string[] };

function faqJsonLd(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export const HUB_FAQ_JSON_LD = faqJsonLd(HUB_FAQS);
export const SAAS_FAQ_JSON_LD = faqJsonLd(SAAS_FAQS);

export const SAAS_STACK: ToolCategory[] = [
  { category: "Frontend", tools: ["Next.js", "React", "TypeScript", "Tailwind CSS"] },
  { category: "Backend", tools: ["Node.js", "PostgreSQL", "Redis", "Prisma"] },
  { category: "Billing & Payments", tools: ["Stripe", "Paddle", "Usage metering"] },
  { category: "Infra & DevOps", tools: ["AWS", "Vercel", "Docker", "GitHub Actions"] },
  { category: "AI & Automation", tools: ["OpenAI / Anthropic APIs", "RAG pipelines", "Workflow automation"] },
];
