import type { IndustryLink } from "@/lib/navigation";
import industries from "@/content/industries.json";
import industryServices from "@/content/industryServices.json";
import saas from "@/content/saas.json";

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
  accent: string;
};

/** All industries, each with a challenge line, a CTA, and its own accent — the hub page shows every one, not a "featured 6 + more" split. */
export const FEATURED_INDUSTRIES: FeaturedIndustry[] = industries;

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

export type VerticalExpertiseCard = { n: string; title: string; description: string; accent: string };

export const VERTICAL_EXPERTISE: VerticalExpertiseCard[] = [
  {
    n: "01",
    title: "Fewer expensive assumptions",
    description: "We already know where SaaS trials leak or where logistics dispatch breaks down — so early decisions start closer to right.",
    accent: "#8a7bff",
  },
  {
    n: "02",
    title: "Vocabulary that matches your team's",
    description: "Discovery moves faster when we already understand your workflows, compliance constraints, and the metrics your team is measured on.",
    accent: "#5b9bdb",
  },
  {
    n: "03",
    title: "Patterns proven under real usage",
    description: "Billing, dispatch, and booking systems we've shipped before, adapted to your specifics instead of built from a blank page.",
    accent: "#3fae82",
  },
  {
    n: "04",
    title: "Honest scoping from day one",
    description: "We'll tell you what's a 6-week sprint and what genuinely needs a bigger engagement — before you commit budget either way.",
    accent: "#d99a4e",
  },
];

export type PillarMapping = { industry: string; industryHref: string; icon: string; accent: string; pillars: { title: string; href: string }[] };

export const INDUSTRY_SERVICE_MAP: PillarMapping[] = industryServices;

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
    a: "Yes — IT Staff Augmentation and a Dedicated Development Team are both built for that; our people slot into your process instead of replacing it.",
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

export const HUB_FAQ_STATS = [
  { value: industries.length, label: "Industries served" },
  { value: 6, label: "Real, global collaboration hubs" },
];

export const HUB_FAQ_CTA = {
  title: "Still not sure where you fit?",
  description: "Tell us about your industry and we'll point you to the right fit — honestly, even if it's not us.",
  label: "Book a Call",
  href: "/contact",
};

export const SAAS_FAQS: Faq[] = saas.faqs;

const SNAPSHOT_ACCENTS = ["#8a7bff", "#5b9bdb", "#3fae82"];
export const SAAS_SNAPSHOT = saas.snapshot.map((s, i) => ({ ...s, accent: SNAPSHOT_ACCENTS[i % SNAPSHOT_ACCENTS.length] }));

export const SAAS_PROBLEMS: string[] = saas.problems;

export const SAAS_OUTCOMES: string[] = saas.outcomes;

export type SolutionPillar = { title: string; href: string; items: string[]; icon: string; accent: string };

export const SAAS_SOLUTIONS: SolutionPillar[] = saas.solutions;

export const SAAS_USE_CASES: UseCase[] = saas.useCases;

export type ProcessStep = { n: string; title: string; description: string };

export const SAAS_PROCESS: ProcessStep[] = saas.process;

export type ToolCategory = { category: string; tools: string[]; icon: string; accent: string };

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

const STACK_ACCENTS = ["#8a7bff", "#5b9bdb", "#3fae82", "#d99a4e", "#db5a89"];
export const SAAS_STACK: ToolCategory[] = saas.stack.map((s, i) => ({ ...s, accent: STACK_ACCENTS[i % STACK_ACCENTS.length] }));

export const SAAS_FAQ_STATS = [
  { value: 6, label: "Typical weeks to a scoped MVP" },
  { value: 40, suffix: "+", label: "SaaS features shipped to date" },
];

export const SAAS_FAQ_CTA = {
  title: "Not sure where your product stands?",
  description: "Tell us your stage — MVP, growth, or mid-rebuild — and we'll recommend a starting point.",
  label: "Book a Call",
  href: "/contact",
};
