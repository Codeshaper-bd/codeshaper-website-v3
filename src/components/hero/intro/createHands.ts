/**
 * Ported from the Codeshaper Astro build (the original handshake, kept as
 * is at the owner's request) with light polish in v3: outlines and finger
 * edges a touch denser and stronger so the clasp reads more clearly, and a
 * soft glow at the grip as the hands lock (instead of a spark dot).
 *
 * Halftone handshake (owner request, 18 November 2026): a human arm from the
 * left and an AI arm from the right meet in a handshake under the Codeshaper
 * mark, drawn as thousands of fine dots on a 2D canvas.
 *
 * Original art, built procedurally: each hand is a union of simple shapes
 * (forearm, palm, wrapping fingers, thumb) painted into an offscreen mask;
 * dots are sampled from it, denser toward the edges, along the finger
 * outlines and on the underside, for a stippled sense of volume. Human dots
 * are soft round points shading lavender to rose; AI dots snap to a pixel grid
 * and shade violet to sky, so the two read as "people" and "AI".
 *
 * set(t): 0 = dust drifting in the fog, 1 = handshake formed (arms first, the
 * clasp last), 2 = dissolved upward and gone. Same 1200 x 700 "meet" geometry
 * as the mark (centred at 600, 350); the clasp sits just below it.
 */

export interface HandsHandle {
  set: (t: number) => void;
  dispose: () => void;
}

const W = 1200;
const H = 700;
/** Centre of the clasp. */
export const CLASP = { x: 600, y: 556 };

interface Dot {
  tx: number;
  ty: number;
  ox: number;
  oy: number;
  delay: number;
  phase: number;
  size: number;
  /** Outline / finger-edge dots draw stronger than the inner stipple. */
  weight: number;
  /** Distance from the clasp, for the grip glow. */
  dist: number;
  bucket: number;
}

/** A finger or thumb: a polyline with a radius (round caps and joins). */
type Stroke = { pts: [number, number][]; r: number };

interface HandShape {
  arm: [number, number][]; // polygon
  palm: { x: number; y: number; rx: number; ry: number; rot: number };
  strokes: Stroke[];
}

// Human hand (left): palm under the clasp, fingers wrapping over the back of
// the AI hand, thumb lying across the top.
const HUMAN: HandShape = {
  arm: [
    [-40, 572],
    [180, 548],
    [380, 536],
    [500, 530],
    [520, 602],
    [380, 628],
    [180, 650],
    [-40, 690],
  ],
  palm: { x: 548, y: 566, rx: 70, ry: 40, rot: -0.12 },
  strokes: [
    {
      pts: [
        [574, 528],
        [626, 530],
        [652, 552],
      ],
      r: 11,
    },
    {
      pts: [
        [580, 548],
        [632, 552],
        [656, 574],
      ],
      r: 11,
    },
    {
      pts: [
        [582, 568],
        [632, 574],
        [652, 594],
      ],
      r: 10.5,
    },
    {
      pts: [
        [578, 586],
        [622, 594],
        [638, 610],
      ],
      r: 9.5,
    },
    {
      pts: [
        [530, 532],
        [572, 512],
        [618, 506],
      ],
      r: 12,
    }, // thumb
  ],
};

// AI hand (right): palm behind, fingers wrapping under the human hand, thumb
// crossing the human thumb on top.
const AI: HandShape = {
  arm: [
    [1240, 568],
    [1020, 546],
    [820, 534],
    [700, 528],
    [682, 600],
    [820, 626],
    [1020, 648],
    [1240, 688],
  ],
  palm: { x: 654, y: 562, rx: 68, ry: 40, rot: 0.12 },
  strokes: [
    {
      pts: [
        [628, 590],
        [576, 604],
        [552, 590],
      ],
      r: 10,
    },
    {
      pts: [
        [630, 606],
        [580, 620],
        [558, 608],
      ],
      r: 9.5,
    },
    {
      pts: [
        [628, 620],
        [588, 632],
        [570, 624],
      ],
      r: 8.5,
    },
    {
      pts: [
        [668, 528],
        [628, 512],
        [588, 512],
      ],
      r: 11.5,
    }, // thumb
  ],
};

function strokePath(ctx: CanvasRenderingContext2D, s: Stroke) {
  ctx.beginPath();
  s.pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.stroke();
}

/** The clasp is drawn larger than the arms, so the handshake reads clearly. */
const CLASP_SCALE = 1.45;
const claspSpace = (ctx: CanvasRenderingContext2D) => {
  ctx.translate(CLASP.x, CLASP.y);
  ctx.scale(CLASP_SCALE, CLASP_SCALE);
  ctx.translate(-CLASP.x, -CLASP.y);
};

function paintHand(ctx: CanvasRenderingContext2D, hand: HandShape, crease: boolean) {
  ctx.save();
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#fff';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  if (crease) {
    claspSpace(ctx);
    // Outlines of each finger: dots gather there, so fingers read as
    // separate shapes in the clasp.
    for (const s of hand.strokes) {
      ctx.globalCompositeOperation = 'source-over';
      ctx.lineWidth = s.r * 2 + 4;
      strokePath(ctx, s);
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = Math.max(2, s.r * 2 - 3.5);
      strokePath(ctx, s);
    }
    ctx.restore();
    return;
  }
  ctx.beginPath();
  hand.arm.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.closePath();
  ctx.fill();
  claspSpace(ctx);
  const p = hand.palm;
  ctx.beginPath();
  ctx.ellipse(p.x, p.y, p.rx, p.ry, p.rot, 0, Math.PI * 2);
  ctx.fill();
  for (const s of hand.strokes) {
    ctx.lineWidth = s.r * 2;
    strokePath(ctx, s);
  }
  ctx.restore();
}

const BUCKETS = 6;

function sample(hand: HandShape, grid: boolean) {
  const pixels = (crease: boolean, blur = 0) => {
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const ctx = c.getContext('2d', { willReadFrequently: true })!;
    if (blur) ctx.filter = `blur(${blur}px)`;
    paintHand(ctx, hand, crease);
    return ctx.getImageData(0, 0, W, H).data;
  };
  const solid = pixels(false);
  const depth = pixels(false, 10); // how deep inside the shape a point is
  const crease = pixels(true);

  const dots: Dot[] = [];
  const step = grid ? 3.2 : 2.5;
  for (let y = 0; y < H; y += step) {
    for (let x = 0; x < W; x += step) {
      const jx = grid ? x : x + (Math.random() - 0.5) * step;
      const jy = grid ? y : y + (Math.random() - 0.5) * step;
      const i = ((Math.round(jy) * W + Math.round(jx)) * 4) | 0;
      if ((solid[i + 3] ?? 0) < 128) continue;
      const edge = 1 - (depth[i + 3] ?? 0) / 255;
      const fold = (crease[i + 3] ?? 0) / 255;
      const lower = Math.max(0, Math.min(1, (jy - 560) / 90)); // shadowed underside
      const p = 0.12 + edge * 0.64 + lower * 0.18 + fold * 0.6;
      if (Math.random() > p) continue;
      const d = Math.hypot(jx - CLASP.x, jy - CLASP.y);
      const reach = Math.min(1, d / 640); // 0 at the clasp, 1 far up the arm
      dots.push({
        tx: jx,
        ty: jy,
        ox: Math.random() * W,
        oy: H * 0.2 + Math.random() * H * 0.9,
        delay: 0.42 * (1 - reach), // arms first, clasp last
        phase: Math.random() * Math.PI * 2,
        size: grid ? 1.5 : 0.9 + Math.random() * 0.8,
        // Colour runs along the arm: bucket 0 at the clasp.
        bucket: Math.min(BUCKETS - 1, Math.floor(reach * BUCKETS)),
        weight: 0.6 + 0.4 * Math.min(1, Math.max(edge, fold)),
        dist: d,
      });
    }
  }
  return dots.sort((a, b) => a.bucket - b.bucket);
}

/** Hand gradients from the design tokens (hex), clasp colour first. */
export function handColours() {
  const style = getComputedStyle(document.documentElement);
  const read = (name: string, fallback: string) => style.getPropertyValue(name).trim() || fallback;
  return {
    human: [read('--color-hand-rose', '#c58ad8'), read('--color-hand-human', '#9a8cd3')] as [
      string,
      string,
    ],
    ai: [read('--color-brand', '#615fff'), read('--color-hand-sky', '#4fa3ff')] as [string, string],
  };
}

/** Hex colour mix, for the gradient buckets. */
function mix(a: string, b: string, t: number) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `rgb(${pa.map((v, i) => Math.round(v + ((pb[i] ?? v) - v) * t)).join(' ')})`;
}

export function createHands(
  canvas: HTMLCanvasElement,
  o: {
    /** Human gradient: clasp colour, arm colour (hex). */
    human: [string, string];
    /** AI gradient: clasp colour, arm colour (hex). */
    ai: [string, string];
    animate: boolean;
  },
): HandsHandle {
  const ctx = canvas.getContext('2d');
  if (!ctx) return { set() {}, dispose() {} };

  const groups = [
    { dots: sample(HUMAN, false), colours: o.human },
    { dots: sample(AI, true), colours: o.ai },
  ].map((g) => ({
    dots: g.dots,
    palette: Array.from({ length: BUCKETS }, (_, b) =>
      mix(g.colours[0], g.colours[1], b / (BUCKETS - 1)),
    ),
  }));

  let t = o.animate ? 0 : 1;
  let raf = 0;
  let disposed = false;
  let visible = true;
  const start = performance.now();
  const ease = (v: number) => (v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2);
  const clamp = (v: number) => Math.min(1, Math.max(0, v));

  const draw = (now: number) => {
    const time = (now - start) / 1000;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cw = canvas.clientWidth;
    const ch = canvas.clientHeight;
    if (canvas.width !== Math.round(cw * dpr) || canvas.height !== Math.round(ch * dpr)) {
      canvas.width = Math.round(cw * dpr);
      canvas.height = Math.round(ch * dpr);
    }
    const s = Math.min(cw / W, ch / H);
    const offX = (cw - W * s) / 2;
    const offY = (ch - H * s) / 2;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cw, ch);

    const form = clamp(t);
    const leave = clamp(t - 1);
    // the grip: as the clasp completes, a soft glow blooms there and fades
    const grip = clamp((t - 0.88) / 0.12);
    const bloom = Math.sin(Math.PI * grip);
    for (const g of groups) {
      let bucket = -1;
      for (const d of g.dots) {
        if (d.bucket !== bucket) {
          bucket = d.bucket;
          ctx.fillStyle = g.palette[bucket]!;
        }
        const k = ease(clamp((form - d.delay) / (1 - 0.42)));
        const drift = (1 - k) * 6;
        let x = d.ox + (d.tx - d.ox) * k + Math.sin(time * 0.6 + d.phase) * drift;
        let y = d.oy + (d.ty - d.oy) * k + Math.cos(time * 0.5 + d.phase) * drift;
        if (leave > 0) {
          const l = ease(leave);
          x += (d.tx - CLASP.x) * 0.3 * l + Math.sin(d.phase) * 40 * l;
          y -= (90 + (d.phase % 1) * 140) * l;
        }
        // Arms fade out softly toward the sides instead of ending in a hard edge.
        const fade = Math.min(1, Math.max(0, Math.min(d.tx - 40, 1160 - d.tx) / 260));
        const glow = bloom > 0 ? bloom * Math.exp(-((d.dist / 150) ** 2)) : 0;
        const alpha = Math.min(1, (0.16 + 0.76 * k * d.weight + glow * 0.45) * (1 - leave) * (0.1 + 0.9 * fade * fade));
        if (alpha < 0.01) continue;
        ctx.globalAlpha = alpha;
        const size = Math.max(1, d.size * s * 1.2);
        ctx.fillRect(offX + x * s - size / 2, offY + y * s - size / 2, size, size);
      }
    }
    ctx.globalAlpha = 1;
  };

  const frame = (now: number) => {
    raf = 0;
    if (disposed) return;
    draw(now);
    // Keep the dust drifting while it is dust; settle once formed.
    const moving = t < 0.999 || (t > 1 && t < 2);
    if (o.animate && moving && visible && document.visibilityState === 'visible') {
      raf = requestAnimationFrame(frame);
    }
  };
  const kick = () => {
    if (!raf && !disposed) raf = requestAnimationFrame(frame);
  };

  const ro = new ResizeObserver(kick);
  ro.observe(canvas);
  const io = new IntersectionObserver(([entry]) => {
    visible = !!entry?.isIntersecting;
    if (visible) kick();
  });
  io.observe(canvas);
  document.addEventListener('visibilitychange', kick);
  kick();

  return {
    set(next) {
      t = Math.max(0, Math.min(2, next));
      kick();
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', kick);
    },
  };
}
