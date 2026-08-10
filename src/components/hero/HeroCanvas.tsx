"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/motion";

/**
 * Hero particle field — raw WebGL (no Three.js; one draw call, ~26k points).
 *
 * 26,000 particles drift through a flow field, then assemble into Codeshaper's
 * hexagon mark: an outlined hex with an internal lattice, so it reads as
 * structure being *shaped* out of noise. Interaction:
 *
 *   · load    → particles fly in and assemble (staggered per-particle)
 *   · mouse   → local repulsion field pushes particles aside, damped
 *   · scroll  → the mark disperses and drifts down as you leave the hero
 *
 * Everything is GPU-side: the CPU only updates three uniforms per frame, so it
 * holds 60fps alongside the background video. Paused offscreen via
 * IntersectionObserver. Reduced motion / no-WebGL: renders nothing and lets the
 * static poster + CSS aurora underneath carry the hero.
 */

const COUNT = 26000;

const VERT = `
attribute vec2 a_free;
attribute vec2 a_target;
attribute float a_seed;

uniform float u_time;
uniform float u_assemble;   // 0 dispersed → 1 assembled
uniform float u_scroll;     // 0 at top → 1 one viewport down
uniform vec2  u_mouse;      // unit space
uniform float u_aspect;
uniform float u_dpr;
uniform float u_fit;        // shrinks the mark on portrait viewports

varying float v_seed;
varying float v_alpha;

void main() {
  float s = a_seed;

  // slow organic flow so the field never looks static
  vec2 drift = vec2(
    sin(u_time * 0.24 + s * 12.9 + a_free.y * 2.4),
    cos(u_time * 0.20 + s * 7.7  + a_free.x * 2.1)
  ) * (0.05 + 0.06 * s);
  vec2 free = a_free + drift;

  // staggered assembly: each particle starts at a slightly different moment
  float m = clamp((u_assemble - s * 0.4) / 0.6, 0.0, 1.0);
  m = m * m * (3.0 - 2.0 * m);

  // breathing once assembled
  vec2 target = a_target * u_fit * (1.0 + 0.012 * sin(u_time * 0.6 + s * 6.28));
  vec2 pos = mix(free, target, m);

  // scroll: disperse outward + sink
  pos = mix(pos, free * 1.75, u_scroll * 0.9);
  pos.y -= u_scroll * 0.4;

  // pointer repulsion
  vec2 d = pos - u_mouse;
  d.x *= u_aspect;
  float dist = length(d);
  float force = smoothstep(0.42, 0.0, dist) * 0.22;
  pos += normalize(d + vec2(1e-5)) * force;

  gl_Position = vec4(pos.x / u_aspect, pos.y, 0.0, 1.0);

  float size = (1.0 + 2.4 * s) * (0.55 + 0.85 * m);
  gl_PointSize = size * u_dpr * (1.0 - u_scroll * 0.45);
  v_seed = s;
  v_alpha = (0.30 + 0.70 * m) * (1.0 - u_scroll * 0.95);
}
`;

const FRAG = `
precision mediump float;
varying float v_seed;
varying float v_alpha;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  float a = smoothstep(0.5, 0.0, d);

  vec3 indigo = vec3(0.357, 0.373, 0.937);
  vec3 violet = vec3(0.545, 0.373, 0.878);
  vec3 amber  = vec3(0.949, 0.651, 0.353);

  vec3 col = mix(indigo, violet, smoothstep(0.0, 0.65, v_seed));
  col = mix(col, amber, smoothstep(0.86, 1.0, v_seed));

  gl_FragColor = vec4(col, a * v_alpha);
}
`;

/** Hexagon outline + internal lattice, in unit space (y ∈ [-1,1]). */
function buildTargets(count: number) {
  const t = new Float32Array(count * 2);
  const R = 0.72;
  const corners: [number, number][] = [];
  for (let i = 0; i < 6; i++) {
    // flat-top orientation matching the logo mark
    const a = (Math.PI / 180) * (60 * i - 90);
    corners.push([Math.cos(a) * R, Math.sin(a) * R]);
  }

  for (let i = 0; i < count; i++) {
    const r = Math.random();
    let x: number, y: number;

    if (r < 0.5) {
      // 50% — crisp outline
      const e = (Math.random() * 6) | 0;
      const [x0, y0] = corners[e];
      const [x1, y1] = corners[(e + 1) % 6];
      const k = Math.random();
      x = x0 + (x1 - x0) * k;
      y = y0 + (y1 - y0) * k;
      const j = 0.008;
      x += (Math.random() - 0.5) * j;
      y += (Math.random() - 0.5) * j;
    } else if (r < 0.78) {
      // 28% — internal lattice rings (structure)
      const ring = 0.24 + 0.42 * Math.random();
      const e = (Math.random() * 6) | 0;
      const [x0, y0] = corners[e];
      const [x1, y1] = corners[(e + 1) % 6];
      const k = Math.random();
      x = (x0 + (x1 - x0) * k) * (ring / R);
      y = (y0 + (y1 - y0) * k) * (ring / R);
    } else {
      // 22% — sparse fill so the mark has body
      let px = 0, py = 0, inside = false;
      for (let tries = 0; tries < 8 && !inside; tries++) {
        px = (Math.random() * 2 - 1) * R;
        py = (Math.random() * 2 - 1) * R;
        // hexagon inclusion test (flat-top)
        const q = Math.abs(px), w = Math.abs(py);
        inside = w <= R * 0.866 && q * 0.866 + w * 0.5 <= R * 0.866;
      }
      x = px;
      y = py;
    }
    t[i * 2] = x;
    t[i * 2 + 1] = y;
  }
  return t;
}

export default function HeroCanvas({ className = "" }: { className?: string }) {
  const reduced = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ok, setOk] = useState(true);

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: true,
      premultipliedAlpha: false,
      powerPreference: "high-performance",
    });
    if (!gl) {
      setOk(false);
      return;
    }

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS))
        throw new Error(gl.getShaderInfoLog(sh) ?? "compile");
      return sh;
    };

    let raf = 0;
    let running = false;

    try {
      const prog = gl.createProgram()!;
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error("link");
      gl.useProgram(prog);

      // ── buffers ──
      const free = new Float32Array(COUNT * 2);
      const seed = new Float32Array(COUNT);
      for (let i = 0; i < COUNT; i++) {
        const a = Math.random() * Math.PI * 2;
        const rr = 0.35 + Math.random() * 1.15;
        free[i * 2] = Math.cos(a) * rr;
        free[i * 2 + 1] = Math.sin(a) * rr * 0.9;
        seed[i] = Math.random();
      }
      const target = buildTargets(COUNT);

      const bind = (data: Float32Array, name: string, size: number) => {
        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        const loc = gl.getAttribLocation(prog, name);
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
      };
      bind(free, "a_free", 2);
      bind(target, "a_target", 2);
      bind(seed, "a_seed", 1);

      const uTime = gl.getUniformLocation(prog, "u_time");
      const uAsm = gl.getUniformLocation(prog, "u_assemble");
      const uScroll = gl.getUniformLocation(prog, "u_scroll");
      const uMouse = gl.getUniformLocation(prog, "u_mouse");
      const uAspect = gl.getUniformLocation(prog, "u_aspect");
      const uDpr = gl.getUniformLocation(prog, "u_dpr");
      const uFit = gl.getUniformLocation(prog, "u_fit");

      gl.disable(gl.DEPTH_TEST);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE); // additive glow

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

      // ── interaction state ──
      let mx = 0, my = -3, cmx = 0, cmy = -3; // start offscreen
      let scrollT = 0, cScroll = 0;

      const onMove = (e: MouseEvent) => {
        const r = canvas.getBoundingClientRect();
        mx = ((e.clientX - r.left) / r.width) * 2 - 1;
        my = -(((e.clientY - r.top) / r.height) * 2 - 1);
      };
      const onLeave = () => { my = -3; };
      const onScroll = () => {
        scrollT = Math.min(1, Math.max(0, window.scrollY / window.innerHeight));
      };

      const t0 = performance.now();
      const frame = () => {
        resize();
        const t = (performance.now() - t0) / 1000;
        cmx += (mx - cmx) * 0.08;
        cmy += (my - cmy) * 0.08;
        cScroll += (scrollT - cScroll) * 0.1;

        const aspect = canvas.clientWidth / Math.max(1, canvas.clientHeight);
        // assembly: 0 → 1 over the first ~2.6s after mount
        const assemble = Math.min(1, Math.max(0, (t - 0.35) / 2.2));

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform1f(uTime, t);
        gl.uniform1f(uAsm, assemble);
        gl.uniform1f(uScroll, cScroll);
        gl.uniform2f(uMouse, cmx * aspect, cmy);
        gl.uniform1f(uAspect, aspect);
        gl.uniform1f(uDpr, dpr);
        // portrait: shrink so the whole hexagon stays on screen
        gl.uniform1f(uFit, Math.min(1, Math.max(0.5, aspect * 0.95)));
        gl.drawArrays(gl.POINTS, 0, COUNT);
        raf = requestAnimationFrame(frame);
      };

      const start = () => {
        if (running) return;
        running = true;
        raf = requestAnimationFrame(frame);
      };
      const stop = () => {
        running = false;
        cancelAnimationFrame(raf);
      };

      window.addEventListener("mousemove", onMove, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      canvas.addEventListener("mouseleave", onLeave);
      const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), {
        threshold: 0,
      });
      io.observe(canvas);

      return () => {
        io.disconnect();
        stop();
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("scroll", onScroll);
        canvas.removeEventListener("mouseleave", onLeave);
      };
    } catch {
      setOk(false);
      cancelAnimationFrame(raf);
    }
  }, [reduced]);

  if (reduced || !ok) return null;

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
