/**
 * The shape the assistant may answer with: version 1, a mirror of the backend proposal
 * (codeshaper-cms docs/ai/ui-response.v1.schema.json). Everything is checked here before it is
 * drawn. Text is plain text; components come from a closed list and name content by slug only.
 *
 * No imports, so the tests can run it as it is.
 */
export type BriefFields = {
  goal: string | null;
  users: string | null;
  features: string[];
  platforms: string | null;
  integrations: string | null;
  timeline: string | null;
  budget: string | null;
  constraints: string | null;
};
export type BriefKey = keyof BriefFields;

export type Source = { title: string; path: string };
export const ACTION_TYPES = ["suggest_reply", "book_consultation", "open_contact", "review_brief"] as const;
export type Action = { type: (typeof ACTION_TYPES)[number]; label: string };
export type Component =
  | { type: "services" | "case_studies" | "engagement_models"; slugs: string[] }
  | { type: "technologies"; items: { name: string; reason: string }[] }
  | { type: "project_brief"; fields: Partial<BriefFields> }
  | { type: "consultation" }
  | { type: "contact_preview" };
export const ERROR_CODES = ["ai_disabled", "invalid_request", "too_large", "conflict", "duplicate", "in_progress", "rate_limited", "session_limit", "busy", "budget_exhausted", "cancelled", "unavailable", "invalid_response"] as const;
export type ErrorCode = (typeof ERROR_CODES)[number];
export type ResponseError = { code: ErrorCode; retryable: boolean; retry_after?: number };

export type AssistantResponse = {
  contract: "codeshaper.ai.response";
  version: 1;
  request_id: string;
  message_id: string | null;
  status: "completed" | "truncated" | "refused" | "error";
  text: string;
  sources: Source[];
  actions: Action[];
  components: Component[];
  error: ResponseError | null;
};

/** Problems the browser meets itself, outside the answer. `session_expired` needs a backend code later. */
export type ClientIssue = "network" | "session_expired";

export const BRIEF_ORDER: BriefKey[] = ["goal", "users", "features", "platforms", "integrations", "timeline", "budget", "constraints"];
export const BRIEF_LABELS: Record<BriefKey, string> = {
  goal: "Goal",
  users: "Who it is for",
  features: "Key features",
  platforms: "Platforms",
  integrations: "Integrations",
  timeline: "Timeline",
  budget: "Budget",
  constraints: "Constraints",
};
export const BRIEF_LIMITS: Record<BriefKey, number> = { goal: 600, users: 300, features: 160, platforms: 200, integrations: 300, timeline: 120, budget: 60, constraints: 300 };
export const MAX_FEATURES = 12;

export const emptyBrief = (): BriefFields => ({ goal: null, users: null, features: [], platforms: null, integrations: null, timeline: null, budget: null, constraints: null });
export const hasBrief = (b: BriefFields) => BRIEF_ORDER.some((k) => (k === "features" ? b.features.length > 0 : !!b[k]));
export const briefValue = (b: Partial<BriefFields>, k: BriefKey) => (k === "features" ? (b.features ?? []).join(", ") : (b[k] ?? ""));

/** The brief as plain lines, for the contact form. Unknown fields are left out, never filled. */
export function briefToText(b: BriefFields, max = 1000): string {
  return BRIEF_ORDER.map((k) => [BRIEF_LABELS[k], briefValue(b, k)] as const)
    .filter(([, v]) => v)
    .map(([label, v]) => `${label}: ${v}`)
    .join("\n")
    .slice(0, max);
}

type Rec = Record<string, unknown>;
const isRec = (v: unknown): v is Rec => typeof v === "object" && v !== null && !Array.isArray(v);
const only = (v: Rec, keys: string[]) => Object.keys(v).every((k) => keys.includes(k));
const str = (v: unknown, max: number, min = 0): v is string => typeof v === "string" && v.length >= min && v.length <= max;
const list = (v: unknown, max: number, min = 0): v is unknown[] => Array.isArray(v) && v.length >= min && v.length <= max;

const PATH = /^\/(?!\/)[A-Za-z0-9/_-]*$/;
const SLUG = /^[a-z0-9-]{1,120}$/;

const source = (v: unknown): v is Source => isRec(v) && only(v, ["title", "path"]) && str(v.title, 120) && typeof v.path === "string" && PATH.test(v.path);
const action = (v: unknown): v is Action => isRec(v) && only(v, ["type", "label"]) && (ACTION_TYPES as readonly unknown[]).includes(v.type) && str(v.label, 80, 1);

function briefFields(v: unknown): v is Partial<BriefFields> {
  return (
    isRec(v) &&
    only(v, BRIEF_ORDER) &&
    Object.entries(v).every(([k, x]) =>
      k === "features" ? list(x, MAX_FEATURES) && x.every((f) => str(f, BRIEF_LIMITS.features)) : x === null || str(x, BRIEF_LIMITS[k as BriefKey]),
    )
  );
}

function component(v: unknown): v is Component {
  if (!isRec(v)) return false;
  switch (v.type) {
    case "services":
    case "case_studies":
    case "engagement_models":
      return only(v, ["type", "slugs"]) && list(v.slugs, 3, 1) && v.slugs.every((s) => typeof s === "string" && SLUG.test(s));
    case "technologies":
      return only(v, ["type", "items"]) && list(v.items, 6, 1) && v.items.every((i) => isRec(i) && only(i, ["name", "reason"]) && str(i.name, 60) && str(i.reason, 200));
    case "project_brief":
      return only(v, ["type", "fields"]) && briefFields(v.fields);
    case "consultation":
    case "contact_preview":
      return only(v, ["type"]);
    default:
      return false;
  }
}

/** Null when the answer is not this contract. A single bad source, action or component is dropped. */
export function parseResponse(input: unknown): AssistantResponse | null {
  if (!isRec(input) || input.contract !== "codeshaper.ai.response" || input.version !== 1) return null;
  const { request_id, message_id, status, text, sources, actions, components, error } = input;
  if (!str(request_id, 36, 1) || !(message_id === null || str(message_id, 40))) return null;
  if (status !== "completed" && status !== "truncated" && status !== "refused" && status !== "error") return null;
  if (!str(text, 16000) || !Array.isArray(sources) || !Array.isArray(actions) || !Array.isArray(components)) return null;
  let problem: ResponseError | null = null;
  if (status === "error") {
    if (!isRec(error) || !(ERROR_CODES as readonly unknown[]).includes(error.code) || typeof error.retryable !== "boolean") return null;
    const wait = error.retry_after;
    problem = { code: error.code as ErrorCode, retryable: error.retryable, ...(Number.isInteger(wait) && (wait as number) >= 0 ? { retry_after: wait as number } : {}) };
  }
  return {
    contract: "codeshaper.ai.response",
    version: 1,
    request_id,
    message_id,
    status,
    text,
    sources: sources.filter(source).slice(0, 5),
    actions: actions.filter(action).slice(0, 4),
    components: components.filter(component).slice(0, 3),
    error: problem,
  };
}
