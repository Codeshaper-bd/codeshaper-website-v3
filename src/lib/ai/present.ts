/** How an answer is laid out. Pure: no imports, so the tests can run it. */

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

const OPENS_A_QUESTION = /^(who|what|which|where|when|why|how|can|could|do|does|is|are|would|will|should|shall)\b/i;

/**
 * What to show of a reply still arriving. A closing question is placed below the cards once the reply
 * is whole, so an unfinished or final sentence that reads like one is not shown above them first.
 */
export function visibleWhileStreaming(text: string): string {
  const whole = text.trim();
  const ends = [...whole.slice(0, -1).matchAll(/[.!?।]\s+/g)];
  const cut = ends.length ? ends[ends.length - 1].index + ends[ends.length - 1][0].length : 0;
  const tail = whole.slice(cut);
  const finishedOtherwise = /[.!।]$/.test(tail);
  return !finishedOtherwise && OPENS_A_QUESTION.test(tail) ? whole.slice(0, cut).trim() : whole;
}
