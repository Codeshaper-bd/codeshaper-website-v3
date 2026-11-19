/**
 * Countries highlighted on the hero globe, keyed by ISO 3166-1 alpha-3
 * (Natural Earth ADM0_A3, see countryIndex.ts for every available code).
 *
 * SOURCE: read from Codeshaper's Fiverr "World Domination 17%" map
 * (33 countries ≈ 17% of ~195). Verify against the live profile.
 * `count` = sales for clients in that country (Fiverr orders plus direct
 * work). Shown in the tooltip and as a floating label on the globe, and
 * used for the tint depth (more sales, deeper colour). ONLY ENTER REAL
 * NUMBERS; leave it out if unknown. `lat`/`lng` is where the label sits
 * (an approximate centre of the country).
 */
export type ServedCountry = { a3: string; name: string; lat: number; lng: number; count?: number; sample?: boolean };

/** Tooltip / label wording: "175 sales" (singular when 1). */
export const COUNT_LABEL = { one: "sale", many: "sales", unknown: "Client country" };

const REAL: ServedCountry[] = [
  // Americas
  { a3: "USA", name: "United States", lat: 39.8, lng: -98.6 },
  { a3: "CAN", name: "Canada", lat: 54.5, lng: -105.0, count: 22 },
  { a3: "MEX", name: "Mexico", lat: 23.6, lng: -102.5 },
  { a3: "BRA", name: "Brazil", lat: -10.8, lng: -52.9 },
  { a3: "CHL", name: "Chile", lat: -33.5, lng: -70.7 },
  // Europe
  { a3: "GBR", name: "United Kingdom", lat: 53.5, lng: -1.8 },
  { a3: "IRL", name: "Ireland", lat: 53.2, lng: -8.0 },
  { a3: "FRA", name: "France", lat: 46.6, lng: 2.2 },
  { a3: "ESP", name: "Spain", lat: 40.2, lng: -3.7 },
  { a3: "PRT", name: "Portugal", lat: 39.6, lng: -8.0 },
  { a3: "DEU", name: "Germany", lat: 51.1, lng: 10.4 },
  { a3: "NLD", name: "Netherlands", lat: 52.2, lng: 5.3 },
  { a3: "BEL", name: "Belgium", lat: 50.6, lng: 4.6 },
  { a3: "CHE", name: "Switzerland", lat: 46.8, lng: 8.2 },
  { a3: "AUT", name: "Austria", lat: 47.6, lng: 14.1 },
  { a3: "ITA", name: "Italy", lat: 42.8, lng: 12.8 },
  { a3: "DNK", name: "Denmark", lat: 56.0, lng: 9.5 },
  { a3: "NOR", name: "Norway", lat: 61.0, lng: 8.5 },
  { a3: "SWE", name: "Sweden", lat: 62.0, lng: 15.0 },
  { a3: "FIN", name: "Finland", lat: 64.0, lng: 26.0 },
  // Middle East & Africa
  { a3: "ISR", name: "Israel", lat: 31.0, lng: 34.9 },
  { a3: "ARE", name: "United Arab Emirates", lat: 24.3, lng: 54.3 },
  { a3: "NGA", name: "Nigeria", lat: 9.1, lng: 8.7 },
  { a3: "KEN", name: "Kenya", lat: 0.2, lng: 37.9 },
  // Asia-Pacific
  { a3: "PAK", name: "Pakistan", lat: 30.0, lng: 69.3 },
  { a3: "IND", name: "India", lat: 22.0, lng: 79.0 },
  { a3: "CHN", name: "China", lat: 35.0, lng: 103.0 },
  { a3: "THA", name: "Thailand", lat: 15.5, lng: 101.0 },
  { a3: "KHM", name: "Cambodia", lat: 12.6, lng: 104.9 },
  { a3: "MYS", name: "Malaysia", lat: 3.5, lng: 102.0 },
  { a3: "IDN", name: "Indonesia", lat: -2.5, lng: 118.0 },
  { a3: "AUS", name: "Australia", lat: -25.3, lng: 133.8 },
  { a3: "NZL", name: "New Zealand", lat: -41.0, lng: 174.0 },
];

/**
 * DEVELOPMENT ONLY sample sales, so the floating labels can be judged
 * before real numbers exist. Never used in production (see SERVED below);
 * entries carry `sample: true` and show a "sample" marker.
 */
const SAMPLE_COUNTS: Record<string, number> = {
  USA: 175, GBR: 48, AUS: 36, DEU: 27, ARE: 19, ESP: 14, FRA: 12, NLD: 11, IND: 9, CHE: 8,
  ITA: 7, SWE: 7, IRL: 6, NOR: 5, BRA: 5, MYS: 4, ISR: 4, NZL: 4, DNK: 3, BEL: 3,
  AUT: 3, FIN: 2, PRT: 2, MEX: 2, CHN: 2, THA: 2, PAK: 2, IDN: 2, KEN: 1, NGA: 1, KHM: 1, CHL: 1,
};

export const SERVED: ServedCountry[] =
  process.env.NODE_ENV === "production"
    ? REAL
    : REAL.map((c) => (c.count || !SAMPLE_COUNTS[c.a3] ? c : { ...c, count: SAMPLE_COUNTS[c.a3], sample: true }));

/** Headquarters pin. */
export const HQ = { label: "Dhaka, Bangladesh", detail: "Headquarters", lat: 23.8103, lng: 90.4125 };
