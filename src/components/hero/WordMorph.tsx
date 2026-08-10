"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/motion";

/**
 * Word-morph particle engine — the hero's signature.
 *
 * The company is called Code*shaper*, so the hero literally shapes: ~11k
 * particles are sampled from rendered type and then flow between words,
 * spelling what the studio does before resolving into the hexagon mark:
 *
 *     DESIGN → BUILD → AUTOMATE → SHIP → ⬡
 *
 * Particles don't lerp in straight lines — each one arcs along a per-particle
 * curl offset while in transit, so a morph looks like matter reorganising
 * rather than a crossfade. The pointer pushes particles aside; scrolling
 * disperses the whole field.
 *
 * Targets are sampled on the client from a 2D canvas (so the real display font
 * is used), then uploaded as `a_to`; the previous set stays in `a_from` and a
 * single `u_mix` uniform drives the transition on the GPU.
 */

const COUNT = 11000;

const VERT = `
attribute vec2 a_from;
attribute vec2 a_to;
attribute float a_seed;

uniform float u_time;
uniform float u_mix;      // 0 = from, 1 = to
uniform float u_scroll;
uniform vec2  u_mouse;
uniform float u_aspect;
uniform float u_dpr;
uniform float u_intro;    // 0→1 first appearance
uniform float u_energy;   // 0→1 wheel energy: turbulence + heat
uniform vec2  u_tilt;     // pointer-driven 3D tilt

varying float v_seed;
varying float v_alpha;
varying float v_transit;
varying float v_depth;

void main() {
  float s = a_seed;
  // give every particle a depth slice so the field has real parallax
  float z = fract(s * 7.13) - 0.5;

  // stagger so the word doesn't snap as one block
  float m = clamp((u_mix - s * 0.28) / 0.72, 0.0, 1.0);
  m = m * m * (3.0 - 2.0 * m);

  vec2 pos = mix(a_from, a_to, m);

  // arc through a curl-ish offset while in transit (peaks mid-morph);
  // wheel energy widens the arc so flicking the wheel visibly stirs the field
  float transit = sin(m * 3.14159);
  vec2 arc = vec2(
    sin(s * 25.1 + u_time * 0.7),
    cos(s * 17.7 + u_time * 0.6)
  ) * transit * (0.26 + u_energy * 0.5);
  pos += arc;

  // energy also adds a persistent shimmer even at rest
  pos += vec2(
    sin(u_time * 2.4 + s * 40.0),
    cos(u_time * 2.1 + s * 33.0)
  ) * u_energy * 0.05;

  // idle shimmer once settled
  pos += vec2(
    sin(u_time * 1.1 + s * 30.0),
    cos(u_time * 0.9 + s * 21.0)
  ) * 0.004 * (1.0 - transit);

  // intro: fly in from a dispersed ring
  vec2 outer = normalize(pos + vec2(0.001)) * (1.4 + s * 0.6);
  pos = mix(outer, pos, clamp(u_intro * 1.2 - s * 0.2, 0.0, 1.0));

  // scroll disperse
  pos = mix(pos, outer, u_scroll * 0.85);
  pos.y -= u_scroll * 0.3;

  // pointer sculpting: near particles are pushed aside, deeper ones less,
  // so the cursor carves a soft well through the layered field
  vec2 d = pos - u_mouse;
  d.x *= u_aspect;
  float dist = length(d);
  float force = smoothstep(0.34, 0.0, dist) * 0.20 * (0.55 + z + 0.5);
  pos += normalize(d + vec2(1e-5)) * force;

  // 3D: tilt the field around the pointer, then perspective-divide by depth
  pos += u_tilt * z * 0.9;
  float persp = 1.0 / (1.0 - z * 0.28);
  pos *= persp;

  gl_Position = vec4(pos.x / u_aspect, pos.y, 0.0, 1.0);
  gl_PointSize = (1.5 + 2.2 * s) * persp * u_dpr * (1.0 - u_scroll * 0.5);

  v_seed = s;
  v_transit = transit;
  v_depth = z;
  // nearer particles read brighter — that's what sells the depth
  v_alpha = (1.0 - u_scroll * 0.95)
          * clamp(u_intro * 1.4 - s * 0.3, 0.0, 1.0)
          * (0.55 + (z + 0.5) * 0.75);
}
`;

const FRAG = `
precision mediump float;
uniform highp float u_energy;   // precision must match the vertex stage
varying float v_seed;
varying float v_alpha;
varying float v_transit;
varying float v_depth;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  float a = smoothstep(0.5, 0.0, d);

  vec3 indigo = vec3(0.357, 0.373, 0.937);
  vec3 violet = vec3(0.545, 0.373, 0.878);
  vec3 amber  = vec3(0.949, 0.651, 0.353);

  vec3 col = mix(indigo, violet, fract(v_seed * 2.7));
  // particles glow amber while they're in flight — the "shaping" moment,
  // and wheel energy pushes the whole field warmer
  col = mix(col, amber, min(1.0, v_transit * 0.75 + u_energy * 0.35));
  col = mix(col, vec3(1.0), v_transit * 0.25);
  // depth cue: far slices cool toward indigo
  col = mix(col * 0.72, col, v_depth + 0.5);

  gl_FragColor = vec4(col, a * v_alpha * (0.75 + v_transit * 0.45));
}
`;

const WORDS = ["DESIGN", "BUILD", "AUTOMATE", "SHIP"];

/** Sample glyph pixels of `text` into `count` points in unit space. */
function sampleText(text: string, count: number, aspect: number): Float32Array {
  const W = 900;
  const H = 300;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // shrink long words so every step occupies the same optical width
  let size = 190;
  const family = `"Space Grotesk Variable", "Space Grotesk", system-ui, sans-serif`;
  ctx.font = `700 ${size}px ${family}`;
  const maxW = W * 0.88;
  while (ctx.measureText(text).width > maxW && size > 40) {
    size -= 6;
    ctx.font = `700 ${size}px ${family}`;
  }
  ctx.fillText(text, W / 2, H / 2);

  const data = ctx.getImageData(0, 0, W, H).data;
  const hits: [number, number][] = [];
  for (let y = 0; y < H; y += 2) {
    for (let x = 0; x < W; x += 2) {
      if (data[(y * W + x) * 4 + 3] > 128) hits.push([x, y]);
    }
  }

  const out = new Float32Array(count * 2);
  // fit the 3:1 word block inside the canvas without distorting it:
  // x lives in aspect-scaled space (the shader divides by aspect again)
  const halfW = Math.min(0.86 * aspect, 2.1);
  const halfH = halfW / (W / H);
  for (let i = 0; i < count; i++) {
    const [hx, hy] = hits[(Math.random() * hits.length) | 0] ?? [W / 2, H / 2];
    // jitter within the 2px sampling cell so edges stay soft
    const px = (hx + Math.random() * 2) / W - 0.5;
    const py = (hy + Math.random() * 2) / H - 0.5;
    out[i * 2] = px * 2 * halfW;
    out[i * 2 + 1] = -py * 2 * halfH;
  }
  return out;
}

/** Hexagon mark target set — the resting state the sequence resolves into. */
function sampleHex(count: number): Float32Array {
  const out = new Float32Array(count * 2);
  const R = 0.78;
  const corners: [number, number][] = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 180) * (60 * i - 90);
    corners.push([Math.cos(a) * R, Math.sin(a) * R]);
  }
  for (let i = 0; i < count; i++) {
    const r = Math.random();
    const e = (Math.random() * 6) | 0;
    const [x0, y0] = corners[e];
    const [x1, y1] = corners[(e + 1) % 6];
    const k = Math.random();
    const ring = r < 0.62 ? 1 : 0.35 + Math.random() * 0.5;
    out[i * 2] = (x0 + (x1 - x0) * k) * ring + (Math.random() - 0.5) * 0.01;
    out[i * 2 + 1] = (y0 + (y1 - y0) * k) * ring + (Math.random() - 0.5) * 0.01;
  }
  return out;
}

export default function WordMorph({ className = "" }: { className?: string }) {
  const reduced = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ok, setOk] = useState(true);

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: true, premultipliedAlpha: false });
    if (!gl) {
      setOk(false);
      return;
    }

    let raf = 0;
    let running = false;
    let disposed = false;

    const run = async () => {
      // wait for the display font so sampled glyphs are the real typeface
      try {
        await (document as Document & { fonts?: FontFaceSet }).fonts?.ready;
      } catch {
        /* no-op */
      }
      if (disposed) return;

      try {
        const compile = (type: number, src: string) => {
          const sh = gl.createShader(type)!;
          gl.shaderSource(sh, src);
          gl.compileShader(sh);
          if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS))
            throw new Error("shader: " + gl.getShaderInfoLog(sh));
          return sh;
        };
        const prog = gl.createProgram()!;
        gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
        gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
        gl.linkProgram(prog);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS))
          throw new Error("link: " + gl.getProgramInfoLog(prog));
        gl.useProgram(prog);

        const aspect0 = Math.max(0.5, canvas.clientWidth / Math.max(1, canvas.clientHeight));
        const frames = [
          ...WORDS.map((w) => sampleText(w, COUNT, aspect0)),
          sampleHex(COUNT),
        ];

        const seed = new Float32Array(COUNT);
        for (let i = 0; i < COUNT; i++) seed[i] = Math.random();

        const mkBuf = (data: Float32Array) => {
          const b = gl.createBuffer()!;
          gl.bindBuffer(gl.ARRAY_BUFFER, b);
          gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
          return b;
        };
        const bFrom = mkBuf(frames[frames.length - 1]);
        const bTo = mkBuf(frames[0]);
        const bSeed = mkBuf(seed);

        const attach = (b: WebGLBuffer, name: string, size: number) => {
          const loc = gl.getAttribLocation(prog, name);
          gl.bindBuffer(gl.ARRAY_BUFFER, b);
          gl.enableVertexAttribArray(loc);
          gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
        };

        const U = (n: string) => gl.getUniformLocation(prog, n);
        gl.disable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

        let dpr = 1;
        const resize = () => {
          dpr = Math.min(window.devicePixelRatio || 1, 1.75);
          const w = Math.floor(canvas.clientWidth * dpr);
          const h = Math.floor(canvas.clientHeight * dpr);
          if (canvas.width !== w || canvas.height !== h) {
            canvas.width = w;
            canvas.height = h;
            gl.viewport(0, 0, w, h);
          }
        };

        let mx = 0, my = -3, cmx = 0, cmy = -3, sc = 0, csc = 0;
        let energy = 0, cEnergy = 0;   // wheel-driven turbulence, decays
        let tx = 0, ty = 0, ctx = 0, cty = 0;

        // Mouse wheel stirs the field and hurries the next morph. It does NOT
        // consume the event — the page keeps scrolling normally (no jacking).
        const onWheel = (e: WheelEvent) => {
          energy = Math.min(1, energy + Math.min(0.35, Math.abs(e.deltaY) / 900));
        };
        const onMove = (e: MouseEvent) => {
          const r = canvas.getBoundingClientRect();
          mx = ((e.clientX - r.left) / r.width) * 2 - 1;
          my = -(((e.clientY - r.top) / r.height) * 2 - 1);
          // pointer position also tilts the depth stack
          tx = mx * 0.14;
          ty = my * 0.09;
        };
        const onLeave = () => { my = -3; };
        const onScroll = () => {
          sc = Math.min(1, Math.max(0, window.scrollY / window.innerHeight));
        };

        let idx = 0;              // index of the frame currently in `a_to`
        let mix = 0;
        let holdUntil = 0;
        const HOLD = 2200;        // ms a word rests before the next morph
        const MORPH = 1250;       // ms the morph itself takes
        let morphStart = 500;

        const t0 = performance.now();
        const frame = () => {
          resize();
          const now = performance.now();
          const t = (now - t0) / 1000;

          // wheel energy decays; while it's high the hold shortens, so
          // scrolling the wheel visibly hurries the next word
          energy *= 0.965;
          cEnergy += (energy - cEnergy) * 0.12;
          if (mix >= 1 && cEnergy > 0.12) holdUntil -= 16 * cEnergy * 3;

          // advance the sequence
          if (mix >= 1 && now > holdUntil) {
            // promote current `to` into `from`, load the next word
            idx = (idx + 1) % frames.length;
            gl.bindBuffer(gl.ARRAY_BUFFER, bFrom);
            gl.bufferData(gl.ARRAY_BUFFER, frames[(idx + frames.length - 1) % frames.length], gl.DYNAMIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, bTo);
            gl.bufferData(gl.ARRAY_BUFFER, frames[idx], gl.DYNAMIC_DRAW);
            mix = 0;
            morphStart = now;
          } else if (mix < 1) {
            mix = Math.min(1, (now - morphStart) / MORPH);
            if (mix >= 1) holdUntil = now + HOLD;
          }

          cmx += (mx - cmx) * 0.08;
          cmy += (my - cmy) * 0.08;
          csc += (sc - csc) * 0.1;
          ctx += (tx - ctx) * 0.05;
          cty += (ty - cty) * 0.05;
          const aspect = canvas.clientWidth / Math.max(1, canvas.clientHeight);

          gl.clearColor(0, 0, 0, 0);
          gl.clear(gl.COLOR_BUFFER_BIT);

          attach(bFrom, "a_from", 2);
          attach(bTo, "a_to", 2);
          attach(bSeed, "a_seed", 1);

          gl.uniform1f(U("u_time"), t);
          gl.uniform1f(U("u_mix"), mix);
          gl.uniform1f(U("u_scroll"), csc);
          gl.uniform2f(U("u_mouse"), cmx * aspect, cmy);
          gl.uniform1f(U("u_aspect"), aspect);
          gl.uniform1f(U("u_dpr"), dpr);
          gl.uniform1f(U("u_intro"), Math.min(1, t / 1.4));
          gl.uniform1f(U("u_energy"), cEnergy);
          gl.uniform2f(U("u_tilt"), ctx, cty);
          gl.drawArrays(gl.POINTS, 0, COUNT);

          raf = requestAnimationFrame(frame);
        };

        const start = () => { if (!running) { running = true; raf = requestAnimationFrame(frame); } };
        const stop = () => { running = false; cancelAnimationFrame(raf); };

        window.addEventListener("mousemove", onMove, { passive: true });
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("wheel", onWheel, { passive: true });
        canvas.addEventListener("mouseleave", onLeave);
        const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0 });
        io.observe(canvas);

        cleanup = () => {
          io.disconnect();
          stop();
          window.removeEventListener("mousemove", onMove);
          window.removeEventListener("scroll", onScroll);
          window.removeEventListener("wheel", onWheel);
          canvas.removeEventListener("mouseleave", onLeave);
        };
      } catch (err) {
        console.error("[WordMorph]", err);
        setOk(false);
      }
    };

    let cleanup: (() => void) | null = null;
    run();

    return () => {
      disposed = true;
      cleanup?.();
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  if (reduced || !ok) return null;
  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
