import mainPages from "@/content/mainPages.json";

/**
 * Company figures used in more than one place, with one source each so the
 * site never contradicts itself (owner, 25 Nov 2026: "overall 60+ countries").
 *
 * Countries served: the homepage stat labelled "Countries served"
 * (CMS › Pages › Home › stats). The hero line, the trust strip and llms.txt all
 * read it from here. The globe still pins only the countries listed in
 * servedCountries.ts; it is a picture, not the count.
 */
function findStat(node: unknown, label: RegExp): string | undefined {
  if (!node || typeof node !== "object") return undefined;
  if (Array.isArray(node)) {
    for (const x of node) {
      const v = findStat(x, label);
      if (v) return v;
    }
    return undefined;
  }
  const o = node as Record<string, unknown>;
  if (typeof o.label === "string" && typeof o.value === "string" && label.test(o.label)) return o.value;
  for (const v of Object.values(o)) {
    const hit = findStat(v, label);
    if (hit) return hit;
  }
  return undefined;
}

export const COUNTRIES_SERVED = findStat((mainPages as Record<string, unknown>).home, /countries/i) ?? "60+";
