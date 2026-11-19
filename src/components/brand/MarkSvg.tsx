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
 */
const RING =
  "M10.3615 22.3604V41.6396C10.3615 43.0959 11.153 44.4371 12.4278 45.1411L30.1572 54.9321C31.3607 55.5967 32.8211 55.5967 34.0246 54.9321L51.754 45.1411C53.0288 44.4371 53.8203 43.0959 53.8203 41.6396V22.3604C53.8203 20.9041 53.0288 19.5629 51.754 18.8589L34.0246 9.06789C32.8211 8.40327 31.3607 8.40327 30.1572 9.06789L12.4278 18.8589C11.153 19.5629 10.3615 20.9041 10.3615 22.3604Z";

export default function MarkSvg({
  className,
  id = "cs-mark-mask",
  premium = false,
}: {
  className?: string;
  id?: string;
  premium?: boolean;
}) {
  const ink = premium ? `url(#${id}-ink)` : "currentColor";
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden>
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
      </defs>
      <path d={RING} strokeWidth="12" strokeLinejoin="round" stroke={ink} mask={`url(#${id})`} />
      {premium && (
        // gloss: a thin bright edge on the ring's outer upper-left
        <path d={RING} strokeWidth="12" strokeLinejoin="round" stroke={`url(#${id}-gloss)`} mask={`url(#${id})`} opacity="0.55" />
      )}
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
