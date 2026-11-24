/**
 * A small line drawing of each office city's best-known landmark (owner,
 * 24 Nov 2026: concept from a reference, drawn our own way). One stroke weight,
 * currentColor, 28 px; generic outlines, not anyone's artwork.
 */
const P = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

const DRAWINGS: Record<string, React.ReactNode> = {
  // Dhaka: the Shaheed Minar (a bowed central frame, two pairs either side, the sun behind)
  bangladesh: (
    <>
      <circle cx="16" cy="11" r="4" {...P} />
      <path d="M12 26V9.5c0-1.5 1.8-3 4-3s4 1.5 4 3V26M13.5 12h5M13.5 15h5M13.5 18h5" {...P} />
      <path d="M8 26V13.5M10 26V12M22 26V12M24 26V13.5M4 26h24" {...P} />
    </>
  ),
  // Auckland: the Sky Tower
  "new zealand": (
    <>
      <path d="M16 2v5M14.5 7h3M13 12.5c0-2 1.3-3.5 3-3.5s3 1.5 3 3.5-1.3 2.5-3 2.5-3-.5-3-2.5Z" {...P} />
      <path d="M15 15l-1.5 11M17 15l1.5 11M10 26h12" {...P} />
    </>
  ),
  // Japan: a torii gate
  japan: (
    <>
      <path d="M4 8.5c4 1.2 8 1.6 12 1.6s8-.4 12-1.6M7 13h18M9.5 9.5V26M22.5 9.5V26M16 10.5V13" {...P} />
      <path d="M6 26h7M19 26h7" {...P} />
    </>
  ),
  // USA: a skyline tower with a spire
  usa: (
    <>
      <path d="M16 2v4M14 6h4l1 4h-6l1-4ZM12.5 10h7v16h-7zM9 26V16h3.5M23 26V14h-3.5M5 26h22" {...P} />
      <path d="M15 14h2M15 18h2M15 22h2" {...P} />
    </>
  ),
  // UK: the Elizabeth Tower (Big Ben)
  uk: (
    <>
      <path d="M16 2l2.5 5h-5L16 2ZM13 7h6v6h-6zM12 13h8v13h-8zM9 26h14" {...P} />
      <circle cx="16" cy="10" r="1.8" {...P} />
      <path d="M14.5 17h3M14.5 21h3" {...P} />
    </>
  ),
  // Australia: the Sydney Opera House sails
  australia: (
    <>
      <path d="M4 24h24M6 24c1-6 4-10 8-11-1.5 4-2 7.5-1.5 11M12.5 24c1.2-5.5 4-9 8.5-10-1.8 3.5-2.2 7-1.6 10M19.5 24c1-4 3-6.5 6.5-7.2-1.2 2.6-1.4 4.8-1 7.2" {...P} />
      <path d="M3 27h26" {...P} />
    </>
  ),
};

export default function Landmark({ place, className = "" }: { place: string; className?: string }) {
  const key = place.toLowerCase();
  const drawing = DRAWINGS[key] ?? DRAWINGS[{ "new zealand": "new zealand", dhaka: "bangladesh", auckland: "new zealand", "united states": "usa", "united kingdom": "uk" }[key] ?? ""];
  if (!drawing) return null;
  return (
    <svg viewBox="0 0 32 30" width="30" height="28" aria-hidden className={className}>
      {drawing}
    </svg>
  );
}
