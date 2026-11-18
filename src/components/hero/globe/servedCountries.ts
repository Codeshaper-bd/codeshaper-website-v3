/**
 * Countries highlighted on the hero globe, keyed by ISO 3166-1 alpha-3
 * (Natural Earth ADM0_A3, see countryIndex.ts for every available code).
 *
 * SOURCE: read from Codeshaper's Fiverr "World Domination 17%" map
 * (33 countries ≈ 17% of ~195). Verify against the live profile.
 * `count` = projects delivered for clients in that country (Fiverr orders
 * plus direct work). Shown in the tooltip and used for the tint depth (more
 * projects, deeper colour). Only enter real numbers; leave it out if unknown.
 * Edit this list freely: no images need regenerating.
 */
export type ServedCountry = { a3: string; name: string; count?: number };

/** Tooltip second line: "22 projects delivered" (singular when 1). */
export const COUNT_LABEL = { one: "project delivered", many: "projects delivered", unknown: "Client country" };

export const SERVED: ServedCountry[] = [
  // Americas
  { a3: "USA", name: "United States" },
  { a3: "CAN", name: "Canada", count: 22 },
  { a3: "MEX", name: "Mexico" },
  { a3: "BRA", name: "Brazil" },
  { a3: "CHL", name: "Chile" },
  // Europe
  { a3: "GBR", name: "United Kingdom" },
  { a3: "IRL", name: "Ireland" },
  { a3: "FRA", name: "France" },
  { a3: "ESP", name: "Spain" },
  { a3: "PRT", name: "Portugal" },
  { a3: "DEU", name: "Germany" },
  { a3: "NLD", name: "Netherlands" },
  { a3: "BEL", name: "Belgium" },
  { a3: "CHE", name: "Switzerland" },
  { a3: "AUT", name: "Austria" },
  { a3: "ITA", name: "Italy" },
  { a3: "DNK", name: "Denmark" },
  { a3: "NOR", name: "Norway" },
  { a3: "SWE", name: "Sweden" },
  { a3: "FIN", name: "Finland" },
  // Middle East & Africa
  { a3: "ISR", name: "Israel" },
  { a3: "ARE", name: "United Arab Emirates" },
  { a3: "NGA", name: "Nigeria" },
  { a3: "KEN", name: "Kenya" },
  // Asia-Pacific
  { a3: "PAK", name: "Pakistan" },
  { a3: "IND", name: "India" },
  { a3: "CHN", name: "China" },
  { a3: "THA", name: "Thailand" },
  { a3: "KHM", name: "Cambodia" },
  { a3: "MYS", name: "Malaysia" },
  { a3: "IDN", name: "Indonesia" },
  { a3: "AUS", name: "Australia" },
  { a3: "NZL", name: "New Zealand" },
];

/** Headquarters pin. */
export const HQ = { label: "Dhaka, Bangladesh", detail: "Headquarters", lat: 23.8103, lng: 90.4125 };
