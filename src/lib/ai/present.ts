/** How an answer and a brief are laid out. Pure: no imports but types, so the tests can run it. */
import type { BriefFields, BriefKey } from "./contract";

/** A reply's closing question, taken out so the screen can keep it below any cards, where it is found. */
export function splitQuestion(text: string): { lead: string; question: string | null } {
  const whole = text.trim();
  if (!whole.endsWith("?")) return { lead: whole, question: null };
  // the last sentence: after the final end mark that is followed by a space
  const ends = [...whole.slice(0, -1).matchAll(/[.!?।]\s+/g)];
  const last = ends.at(-1);
  if (!last) return { lead: "", question: whole };
  const cut = last.index + last[0].length;
  return { lead: whole.slice(0, cut).trim(), question: whole.slice(cut) };
}

const FACTS: [BriefKey, string][] = [
  ["users", "Who it is for"],
  ["platforms", "Platforms"],
  ["integrations", "Integrations"],
  ["timeline", "Timeline"],
  ["budget", "Budget"],
  ["constraints", "Constraints"],
];

/** The compact card: the goal, a few requirements, two facts, and how much is still open. */
export function briefSummary(b: BriefFields) {
  const filled = (k: BriefKey) => (k === "features" ? b.features.length > 0 : !!b[k]);
  const all: BriefKey[] = ["goal", "users", "features", "platforms", "integrations", "timeline", "budget", "constraints"];
  return {
    goal: b.goal,
    features: b.features.slice(0, 3),
    moreFeatures: Math.max(0, b.features.length - 3),
    facts: FACTS.filter(([k]) => filled(k)).slice(0, 2).map(([k, label]) => [label, b[k] as string] as [string, string]),
    open: all.filter((k) => !filled(k)).length,
  };
}
