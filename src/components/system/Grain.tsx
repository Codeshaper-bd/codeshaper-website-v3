/**
 * Film grain that reads on any surface: an overlay-blended pass textures
 * colour, a faint multiply pass keeps it visible on white too. Static SVG
 * noise tile (no request). Decorative, never intercepts pointer events.
 */
const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export default function Grain({ strength = 1 }: { strength?: number }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 mix-blend-overlay" style={{ opacity: 0.4 * strength, backgroundImage: NOISE, backgroundSize: "180px 180px" }} />
      <div className="absolute inset-0 mix-blend-multiply" style={{ opacity: 0.045 * strength, backgroundImage: NOISE, backgroundSize: "180px 180px" }} />
    </div>
  );
}
