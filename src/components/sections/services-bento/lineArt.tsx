/**
 * Line-art backdrops for the service cards, one distinct pattern per card
 * (owner references: a radial burst, flowing ribbon lines). Static SVG built
 * from deterministic maths (same markup on server and client), animated with
 * slow CSS transforms only (globals.css "Service line art"). Decorative.
 */

/** small deterministic PRNG so server and client markup match */
function rng(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

/** AI Agents: a ribbon of thin flowing lines (violet → pink), drifting. */
export function Ribbon() {
  const lines = Array.from({ length: 34 }, (_, i) => {
    const o = i * 3.2;
    return `M -40 ${210 - o * 0.4} C 120 ${150 - o}, 220 ${300 - o * 1.6}, 460 ${90 - o * 0.9}`;
  });
  return (
    <svg aria-hidden className="la-ribbon pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 420 300" preserveAspectRatio="none">
      <defs>
        <linearGradient id="la-rib" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#f472b6" stopOpacity="0.15" />
          <stop offset="0.45" stopColor="#c084fc" stopOpacity="0.75" />
          <stop offset="1" stopColor="#7c6cff" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      {lines.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="url(#la-rib)" strokeWidth="1" opacity={0.45 + (i % 6) * 0.09} />
      ))}
    </svg>
  );
}

/** Software: a radial burst from the bottom centre, dots at the tips. */
export function Burst() {
  const r = rng(7);
  const rays = Array.from({ length: 130 }, () => {
    const a = (-168 + r() * 156) * (Math.PI / 180);
    const len = 90 + r() * 170;
    return { x: 210 + Math.cos(a) * len, y: 310 + Math.sin(a) * len, o: 0.45 + r() * 0.55, w: r() > 0.75 ? 1.3 : 0.8, dot: r() > 0.55 };
  });
  return (
    <svg aria-hidden className="la-burst pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 420 300" preserveAspectRatio="xMidYMax slice">
      <defs>
        <radialGradient id="la-burst-glow" cx="0.5" cy="1.05" r="0.7">
          <stop offset="0" stopColor="#fbbf77" stopOpacity="0.8" />
          <stop offset="1" stopColor="#fbbf77" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="la-burst-ray" gradientUnits="userSpaceOnUse" x1="210" y1="310" x2="210" y2="40">
          <stop offset="0" stopColor="#f59e0b" stopOpacity="0.5" />
          <stop offset="1" stopColor="#4f46e5" />
        </linearGradient>
      </defs>
      <rect width="420" height="300" fill="url(#la-burst-glow)" />
      {rays.map((p, i) => (
        <g key={i} opacity={p.o}>
          <line x1="210" y1="310" x2={p.x} y2={p.y} stroke="url(#la-burst-ray)" strokeWidth={p.w} />
          {p.dot && <circle cx={p.x} cy={p.y} r="1.4" fill="#4f46e5" />}
        </g>
      ))}
    </svg>
  );
}

/** UI/UX Design: a fine perspective grid, like a design canvas, slowly panning. */
export function PerspectiveGrid() {
  const vx = 210;
  const vy = -120;
  const verticals = Array.from({ length: 23 }, (_, i) => -230 + i * 40);
  const horizontals = Array.from({ length: 12 }, (_, i) => 300 - Math.pow(i / 11, 1.8) * 230);
  return (
    <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 420 300" preserveAspectRatio="none">
      <defs>
        <linearGradient id="la-grid-fade" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" stopOpacity="1" />
        </linearGradient>
        <mask id="la-grid-mask">
          <rect width="420" height="300" fill="url(#la-grid-fade)" />
        </mask>
      </defs>
      <g mask="url(#la-grid-mask)" stroke="#d946a8" strokeOpacity="0.5" strokeWidth="0.8">
        <g className="la-grid-pan">
          {verticals.map((x) => (
            <line key={x} x1={x} y1="300" x2={vx + (x - vx) * 0.12} y2={vy} />
          ))}
        </g>
        {horizontals.map((y, i) => (
          <line key={i} x1="0" y1={y} x2="420" y2={y} />
        ))}
      </g>
    </svg>
  );
}

/** Websites: topographic contour arcs (warm orange → pink), slowly turning. */
export function Contours() {
  const r = rng(11);
  const rings = Array.from({ length: 16 }, (_, i) => {
    const base = 30 + i * 18;
    const pts = Array.from({ length: 48 }, (_, k) => {
      const a = (k / 48) * Math.PI * 2;
      const wob = 1 + Math.sin(a * 3 + i * 0.6) * 0.07 + (r() - 0.5) * 0.03;
      return `${(Math.cos(a) * base * wob).toFixed(1)},${(Math.sin(a) * base * 0.8 * wob).toFixed(1)}`;
    });
    return `M ${pts.join(" L ")} Z`;
  });
  return (
    <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 420 300" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="la-topo" x1="0" x2="1" y1="1" y2="0">
          <stop offset="0" stopColor="#fb923c" />
          <stop offset="1" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      <g transform="translate(40 300)">
        <g className="la-topo-turn" fill="none" stroke="url(#la-topo)" strokeWidth="1.1">
          {rings.map((d, i) => (
            <path key={i} d={d} opacity={0.8 - i * 0.03} />
          ))}
        </g>
      </g>
    </svg>
  );
}
