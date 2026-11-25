import { SITE } from "@/lib/siteSettings";

/**
 * CodeShaper's offices, shared by the footer and the contact page.
 *
 * All six are real branches (owner, 23 Nov 2026). Dhaka and Auckland are word
 * for word as published on codeshaper.net. The other four have no address yet:
 * the footer shows the Dhaka address for them until the owner sends theirs
 * (TEMP, must be replaced before launch); the contact page does the same
 * (owner, 24 Nov 2026), see withStandIn.
 */
export type Office = {
  /** footer key (country, lower case) */
  key: string;
  title: string;
  city: string;
  country: string;
  lines?: string[];
  tel?: string;
  zone?: string;
  /** true while the address is the Dhaka stand-in */
  pending?: boolean;
  /** the country the map searches in (a stand-in address is in Bangladesh) */
  mapCountry?: string;
};

const DHAKA_LINES = ["3rd Floor, Road# 29, House# 395,", "New DOHS, Mohakhali, Dhaka 1206"];
const DHAKA_TEL = "+8801787662759";

/** Built in until the CMS sends its own list (CMS › Settings › Contact and social › Offices). */
const BUILT_IN: Office[] = [
  { key: "bangladesh", title: "Operations HQ · Dhaka", city: "Dhaka", country: "Bangladesh", lines: DHAKA_LINES, tel: DHAKA_TEL, zone: "Asia/Dhaka" },
  { key: "new zealand", title: "Global HQ · Auckland", city: "Auckland", country: "New Zealand", lines: ["3 Herekino Street, Westgate,", "Auckland 0814"], tel: "+64277758777", zone: "Pacific/Auckland" },
  // TEMP (owner, 23 Nov 2026): address and phone still to come
  { key: "japan", title: "Office · Japan", city: "Japan", country: "Japan", zone: "Asia/Tokyo", pending: true },
  { key: "usa", title: "Office · USA", city: "USA", country: "United States", pending: true }, // add the city for local time
  { key: "uk", title: "Office · UK", city: "UK", country: "United Kingdom", zone: "Europe/London", pending: true },
  { key: "australia", title: "Office · Australia", city: "Australia", country: "Australia", pending: true }, // add the city for local time
];

/**
 * The offices: from the CMS when it has any (owner, 25 Nov 2026: "addresses should be editable from the CMS"),
 * else the built-in list. An office without an address is pending and keeps the Dhaka stand-in below.
 */
export const OFFICE_LIST: Office[] = SITE.offices?.length
  ? SITE.offices.map((o) => ({ key: o.key, title: o.title, city: o.city, country: o.country, lines: o.lines?.length ? o.lines : undefined, tel: o.tel, zone: o.zone, pending: !o.lines?.length || undefined }))
  : BUILT_IN;

/** Footer view: pending offices fall back to the Dhaka address and phone (TEMP). */
export const FOOTER_OFFICES: Record<string, { title: string; lines?: string[]; tel?: string; zone?: string }> = Object.fromEntries(
  OFFICE_LIST.map((o) => [o.key, { title: o.title, zone: o.zone, lines: o.lines ?? DHAKA_LINES, tel: o.tel ?? DHAKA_TEL }]),
);

/** A Google Maps link for an address (no key, opens Maps or the app). */
export const mapsLink = (o: Office) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(["CodeShaper", ...(o.lines ?? []), o.mapCountry ?? o.country].join(" "))}`;
/** The same place as an embeddable map (loaded only when the visitor asks for it). */
export const mapsEmbed = (o: Office) => `https://maps.google.com/maps?q=${encodeURIComponent([...(o.lines ?? []), o.mapCountry ?? o.country].join(" "))}&z=15&output=embed`;

/**
 * Contact page view (owner, 24 Nov 2026: "show all six; for now use the Bangladesh
 * address, map and everything"): a pending office takes Dhaka's address, phone and
 * map until its own arrives. TEMP, replace before launch.
 */
export function withStandIn(o: Office): Office {
  if (!o.pending) return o;
  const dhaka = OFFICE_LIST.find((x) => x.key === "bangladesh" && !x.pending) ?? BUILT_IN[0];
  return { ...o, lines: dhaka.lines, tel: dhaka.tel, mapCountry: dhaka.country };
}
