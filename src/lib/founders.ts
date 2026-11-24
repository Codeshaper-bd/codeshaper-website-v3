import { mainPage } from "@/lib/mainPages";

/**
 * Who the blog's free 30-minute call is with (owner, 24 Nov 2026).
 * CMS › Pages › Blog › Founder call: both founders (the default, owner
 * 24 Nov 2026), Shuvo Sutradhar (CTO) only, or Alok Paul (CEO) only.
 */
export type Founder = { name: string; title: string; photo: string };

const FOUNDERS = {
  // titles (owner, 24 Nov 2026): Shuvo Sutradhar, CTO; Alok Paul, CEO
  founder: { name: "Shuvo Sutradhar", title: "CTO", photo: "/media/team/shuvo-sutradhar.webp" },
  cofounder: { name: "Alok Paul", title: "CEO", photo: "/media/team/alok-paul.webp" },
} satisfies Record<string, Founder>;

export const CALL_MINUTES = 30;

/** One founder by key (the per-article Founder's note, CMS › Post › Key points). */
export const founderBy = (key: "founder" | "cofounder"): Founder => FOUNDERS[key];

export function callPeople(): Founder[] {
  const choice = (mainPage("blog") as { consult?: string }).consult;
  if (choice === "cofounder") return [FOUNDERS.cofounder];
  if (choice === "founder") return [FOUNDERS.founder];
  return [FOUNDERS.founder, FOUNDERS.cofounder];
}

/** Both founders (the article rail card always shows both, owner 24 Nov 2026). */
export const bothFounders = (): Founder[] => [FOUNDERS.founder, FOUNDERS.cofounder];

/** "our founders" / "our CTO" / "our CEO" */
export function whoLabel(people: Founder[]): string {
  if (people.length > 1) return "our founders";
  return `our ${people[0].title}`;
}
