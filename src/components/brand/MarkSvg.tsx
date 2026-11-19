/**
 * The Codeshaper brand mark (hexagon ring, ">" chevron, "_" cursor) as
 * inline SVG, from the owner-supplied Fav Icon.svg (same paths as the
 * Codeshaper Astro build). The cursor bar carries `mark-cursor`, so it can
 * blink like a live prompt (globals.css; off under reduced motion).
 *
 * `premium`: drawn like a small version of the polished 3D mark from the
 * hero intro: a lit gradient (light violet top-left → deep indigo
 * bottom-right) and a glossy highlight along the upper-left of the ring.
 * Plain: one colour (currentColor).
 *
 * `pearls`: "scattered pearls" (owner idea): a pearlescent sheen (soft pink
 * and sky iridescence) over the ring, and three small pearls of different
 * sizes resting just outside it, floating very gently (globals.css
 * .mark-pearl; still under reduced motion).
 */
const RING =
  "M10.3615 22.3604V41.6396C10.3615 43.0959 11.153 44.4371 12.4278 45.1411L30.1572 54.9321C31.3607 55.5967 32.8211 55.5967 34.0246 54.9321L51.754 45.1411C53.0288 44.4371 53.8203 43.0959 53.8203 41.6396V22.3604C53.8203 20.9041 53.0288 19.5629 51.754 18.8589L34.0246 9.06789C32.8211 8.40327 31.3607 8.40327 30.1572 9.06789L12.4278 18.8589C11.153 19.5629 10.3615 20.9041 10.3615 22.3604Z";

/** Pearls resting outside the ring: [cx, cy, r] in the 64-unit box. */
const PEARLS: [number, number, number][] = [
  [60, 8.5, 4.2],
  [2.5, 54, 3],
  [62, 58.5, 2.1],
  [1.5, 12, 1.6],
];

export default function MarkSvg({
  className,
  id = "cs-mark-mask",
  premium = false,
  pearls = false,
}: {
  className?: string;
  id?: string;
  premium?: boolean;
  pearls?: boolean;
}) {
  const ink = premium ? `url(#${id}-ink)` : "currentColor";
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden overflow="visible">
      <defs>
        <mask id={id} maskUnits="userSpaceOnUse" x="4" y="2" width="56" height="60">
          <rect fill="white" x="4" y="2" width="56" height="60" />
          <path
            fill="black"
            d="M30.1572 9.06789C31.3607 8.40327 32.8211 8.40327 34.0246 9.06789L51.754 18.8589C53.0288 19.5629 53.8203 20.9041 53.8203 22.3604V41.6396C53.8203 43.0959 53.0288 44.4371 51.754 45.1411L34.0246 54.9321C32.8211 55.5967 31.3607 55.5967 30.1572 54.9321L12.4278 45.1411C11.153 44.4371 10.3615 43.0959 10.3615 41.6396V22.3604C10.3615 20.9041 11.153 19.5629 12.4278 18.8589L30.1572 9.06789Z"
          />
        </mask>
        {premium && (
          <>
            <linearGradient id={`${id}-ink`} x1="8" y1="4" x2="56" y2="60" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#8f8cff" />
              <stop offset="0.45" stopColor="#615fff" />
              <stop offset="1" stopColor="#3f37c9" />
            </linearGradient>
            <linearGradient id={`${id}-gloss`} x1="6" y1="4" x2="34" y2="34" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#fff" stopOpacity="0.75" />
              <stop offset="0.55" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
          </>
        )}
        {pearls && (
          <>
            {/* nacre: pink and sky iridescence drifting across the ring */}
            <linearGradient id={`${id}-nacre`} x1="4" y1="60" x2="60" y2="4" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#ffd3ef" stopOpacity="0" />
              <stop offset="0.3" stopColor="#ffd3ef" stopOpacity="0.65" />
              <stop offset="0.5" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="0.72" stopColor="#c9e7ff" stopOpacity="0.6" />
              <stop offset="1" stopColor="#c9e7ff" stopOpacity="0" />
            </linearGradient>
            {/* a pearl: lit from the top left, lavender in the shade, a pink rim */}
            <radialGradient id={`${id}-pearl`} cx="0.36" cy="0.32" r="0.75">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="0.45" stopColor="#f3effd" />
              <stop offset="0.8" stopColor="#cfc6f0" />
              <stop offset="1" stopColor="#e9c9e8" />
            </radialGradient>
          </>
        )}
      </defs>
      <path d={RING} strokeWidth="12" strokeLinejoin="round" stroke={ink} mask={`url(#${id})`} />
      {premium && (
        // gloss: a thin bright edge on the ring's outer upper-left
        <path d={RING} strokeWidth="12" strokeLinejoin="round" stroke={`url(#${id}-gloss)`} mask={`url(#${id})`} opacity="0.55" />
      )}
      {pearls && <path d={RING} strokeWidth="12" strokeLinejoin="round" stroke={`url(#${id}-nacre)`} mask={`url(#${id})`} />}
      {pearls &&
        PEARLS.map(([cx, cy, r], i) => (
          <g key={i} className="mark-pearl" style={{ animationDelay: `${i * -1.7}s` }}>
            <circle cx={cx} cy={cy + r * 0.35} r={r * 0.95} fill="#615fff" opacity="0.18" />
            <circle cx={cx} cy={cy} r={r} fill={`url(#${id}-pearl)`} />
            <circle cx={cx - r * 0.35} cy={cy - r * 0.38} r={r * 0.28} fill="#fff" opacity="0.95" />
          </g>
        ))}
      <path className="mark-cursor" d="M32.7656 39.8281H43.3762" strokeWidth="6" strokeLinecap="round" stroke={ink} />
      <path
        d="M20.7168 37.6016L28.0415 31.0561L20.7168 24.5107"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke={ink}
      />
    </svg>
  );
}
