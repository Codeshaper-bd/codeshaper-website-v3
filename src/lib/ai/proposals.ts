/**
 * PROPOSED additions to the response contract, for the backend team (not part of contract.ts, which
 * the CMS owns). What an answer might ask the screen to show, checked as strictly as the contract.
 * An assistant can never say something was done: confirmations come only from an action's own result.
 * No imports.
 */
export const BRIEF_FIELDS = ["goal", "users", "features", "platforms", "integrations", "timeline", "budget", "constraints"] as const;
export type BriefChange = { field: (typeof BRIEF_FIELDS)[number]; before: string; after: string };
export const ERRORS = ["slot_unavailable", "booking_failed", "submission_failed", "booking_unavailable"] as const;

export type Proposal =
  | { type: "contact_capture"; include_brief: boolean }
  | { type: "booking_calendar"; demo: true; duration_minutes: number; days: { date: string; slots: string[] }[] }
  | { type: "brief_changes"; changes: BriefChange[] }
  | { type: "recoverable_error"; code: (typeof ERRORS)[number] };

export type Confirmation = { action: "inquiry" | "booking"; status: "submitted" | "confirmed"; reference: string; simulated: boolean };

type Rec = Record<string, unknown>;
const isRec = (v: unknown): v is Rec => typeof v === "object" && v !== null && !Array.isArray(v);
const exactly = (v: Rec, keys: string[]) => Object.keys(v).length === keys.length && keys.every((k) => k in v);
const str = (v: unknown, max: number, min = 0): v is string => typeof v === "string" && v.length >= min && v.length <= max;
const list = (v: unknown, max: number, min = 1): v is unknown[] => Array.isArray(v) && v.length >= min && v.length <= max;

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const INSTANT = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;

function proposal(v: unknown): v is Proposal {
  if (!isRec(v)) return false;
  switch (v.type) {
    case "contact_capture":
      return exactly(v, ["type", "include_brief"]) && typeof v.include_brief === "boolean";
    case "booking_calendar":
      // demo is required to be true until a real booking source exists
      return (
        exactly(v, ["type", "demo", "duration_minutes", "days"]) && v.demo === true && [15, 30, 45, 60].includes(v.duration_minutes as number) &&
        list(v.days, 7) && v.days.every((d) => isRec(d) && exactly(d, ["date", "slots"]) && typeof d.date === "string" && DATE.test(d.date) && list(d.slots, 12) && d.slots.every((s) => typeof s === "string" && INSTANT.test(s)))
      );
    case "brief_changes":
      return exactly(v, ["type", "changes"]) && list(v.changes, 8) && v.changes.every((c) => isRec(c) && exactly(c, ["field", "before", "after"]) && (BRIEF_FIELDS as readonly unknown[]).includes(c.field) && str(c.before, 600) && str(c.after, 600));
    case "recoverable_error":
      return exactly(v, ["type", "code"]) && (ERRORS as readonly unknown[]).includes(v.code);
    default:
      return false;
  }
}

/** Anything unknown or malformed is dropped; at most three are shown. */
export const parseProposals = (v: unknown): Proposal[] => (Array.isArray(v) ? v.filter(proposal).slice(0, 3) : []);

export function parseConfirmation(v: unknown): Confirmation | null {
  if (!isRec(v) || !exactly(v, ["action", "status", "reference", "simulated"])) return null;
  const ok = (v.action === "inquiry" && v.status === "submitted") || (v.action === "booking" && v.status === "confirmed");
  return ok && str(v.reference, 40, 1) && typeof v.simulated === "boolean" ? (v as Confirmation) : null;
}
