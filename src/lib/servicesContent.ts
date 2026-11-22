/**
 * Rich content for the Services Hub (/services) and the bespoke AI
 * Agents & Automation group page (/services/ai-agents-automation) —
 * everything the service structure in src/data/services.ts doesn't
 * carry. Every service link here is built from that file's slugs via
 * `link()`, which throws on an unknown slug, so these can't point at a
 * page that doesn't exist.
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

import ai from "@/content/ai.json";
import outcomes from "@/content/outcomes.json";
import { getEngagementModel, getGroup, getService, servicePath, type ServiceGroupSlug } from "@/data/services";

/** A chip/link to a service or group page, labelled with its menu label. */
function link(slug: string): { label: string; href: string } | null {
  const svc = getService(slug);
  if (svc) return { label: svc.menuLabel, href: servicePath(slug) };
  const group = getGroup(slug);
  if (group) return { label: group.name, href: servicePath(slug) };
  const model = getEngagementModel(slug);
  if (model) return { label: model.label, href: model.href };
  return null; // taken off the website in the CMS
}

export type TrustStat = { icon: string; value: string; label: string };

export const TRUST_STATS: TrustStat[] = [
  { icon: "map-pin", value: "6", label: "Collaboration hubs — Bangladesh, USA, UK, Japan, Australia & NZ" },
  { icon: "layers", value: "5", label: "Service groups, one delivery system" },
  { icon: "handshake", value: "5", label: "Engagement models to fit any scope" },
  { icon: "clipboard-list", value: "Weekly", label: "Demos + shared board on every engagement" },
];

export const TRUST_QUOTE = {
  quote: "Structured delivery, fast communication, and reliable handover.",
  role: "Product Lead, SaaS Company",
};

export type StarterPath = { goal: string; steps: { label: string; href: string }[] };

const PATHS: { goal: string; steps: ({ label: string; href: string } | null)[] }[] = [
  { goal: "Launch a new MVP", steps: [link("product-discovery"), link("mvp-sprint"), link("mvp-development")] },
  { goal: "Automate a manual business process", steps: [link("ai-consulting"), link("ai-workflow-automation"), link("llmops")] },
  { goal: "Connect AI to your existing systems", steps: [link("ai-integration"), link("rag-development"), link("ai-security-governance")] },
  { goal: "Scale an existing SaaS", steps: [link("saas-development"), link("cloud-devops"), link("design-systems")] },
  { goal: "Grow eCommerce revenue", steps: [link("shopify-development"), link("cro"), link("seo-aeo")] },
];

export const STARTER_PATHS: StarterPath[] = PATHS.map((p) => ({ ...p, steps: p.steps.filter((s) => s !== null) })).filter((p) => p.steps.length);

/** Short, honest capability framing per service group — not metrics, just what tends to improve. */
export const PILLAR_OUTCOMES: Record<ServiceGroupSlug, string[]> = outcomes;

export type Faq = { q: string; a: string };
export type Quote = { quote: string; name: string; role: string; accent: string };

export const SERVICES_FAQS: Faq[] = [
  { q: "Which service should I start with?", a: "Whatever matches your immediate goal — use the \"Help me choose\" paths above, or book a call and we'll recommend a starting point directly." },
  { q: "Can we start with a small MVP or pilot?", a: "Yes — MVP Sprint exists specifically for that: a focused, time-boxed way to validate before committing to a larger build." },
  { q: "Do you handle integrations with our existing tools?", a: "Yes — Enterprise AI & Business Systems Integration is one of our most common engagements: CRM, ERP, helpdesk, payments, and data platforms." },
  { q: "How do you estimate scope and timeline?", a: "After a short discovery conversation, we share a scoped estimate with clear assumptions — journeys, integrations, and platform scope all factor in." },
  { q: "Who owns the IP and source code?", a: "You do, always. Source, design assets, and documentation are handed over as part of every engagement's standard close-out." },
  { q: "Do you provide ongoing support after launch?", a: "Yes — Website Maintenance & Support, LLMOps & AI Observability, and a Dedicated Development Team all exist specifically for the work after v1 ships." },
];

/** AI Agents & Automation group page content */

export const AI_SNAPSHOT: UseCase[] = ai.snapshot;

export type UseCase = { icon: string; title: string; description: string };

export const AI_USE_CASES: UseCase[] = ai.useCases;

export const AI_GOOD_FIT: string[] = ai.goodFit;

export const AI_NOT_IDEAL: string[] = ai.notIdeal;

export type ProcessStep = { n: string; title: string; description: string };

export const AI_PROCESS: ProcessStep[] = ai.process;

export const AI_GUARDRAILS: string[] = ai.guardrails;

export type StackCategory = { category: string; tools: string[] };

export const AI_STACK: StackCategory[] = ai.stack;

export const AI_TESTIMONIALS: Quote[] = [
  { quote: "It answers from our actual docs, not a generic guess — that alone changed how support handles tickets.", name: "Head of Support", role: "B2B Platform", accent: "#8a7bff" },
  { quote: "They were upfront about what wouldn't work yet instead of overselling the automation.", name: "Ops Director", role: "Logistics Company", accent: "#5b9bdb" },
  { quote: "The human-review step meant we could trust it in production from week one.", name: "VP Engineering", role: "Fintech Startup", accent: "#3fae82" },
];

export const AI_FAQS: Faq[] = ai.faqs;
