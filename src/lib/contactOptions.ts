/**
 * The contact form's choices (owner, 24 Nov 2026: "lay the fields out like the
 * old site's form"). Reasons and budgets are the old codeshaper.net form's own
 * options; "what are you looking for" uses today's service groups (the old list
 * named services the company no longer sells). Shared by the form and
 * /api/contact so the two can never drift apart.
 */
export const CONTACT_REASONS = ["Start a New Project", "Make a General Query", "Get Support"] as const;
export type ContactReason = (typeof CONTACT_REASONS)[number];
export const NEW_PROJECT: ContactReason = "Start a New Project";

export const BUDGETS = ["$1k–$2k", "$2k–$5k", "$5k–$10k", "$10k–$20k", "$20k+", "No idea yet"] as const;
