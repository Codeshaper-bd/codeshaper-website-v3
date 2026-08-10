"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/motion";

/**
 * Hero neural mesh — raw WebGL, two draw calls.
 *
 * A hex-lattice network of ~230 nodes joined by ~700 edges. Signals travel
 * along the edges continuously (a glowing packet per edge, offset by seed), and
 * nodes fire when a signal reaches them. The cursor acts as an attention field:
 * nearby nodes lean toward it, and their edges brighten — so moving the mouse
 * feels like querying the network.
 *
 * This is the AI-first idea stated visually: a system of connected agents
 * passing signals, not decorative noise. Scroll fades and lifts the mesh.
 *
 * Node/edge geometry share one displacement function so endpoints never drift
 * apart. Paused offscreen; skipped entirely for reduced motion / no WebGL.
 */

const SHARED = `
uniform float u_time;
uniform vec2  u_mouse;
uniform float u_aspect;
uniform float u_scroll;

vec2 displace(vec2 p, float seed) {
  // slow ambient drift, unique per node
  p += vec2(
    sin(u_time * 0.18 + seed * 12.9),
    cos(u_time * 0.15 + seed * 7.3)
  ) * 0.012;

  // attention field: lean toward the pointer
  vec2 d = p - u_mouse;
  d.x *= u_aspect;
  float dist = length(d);
  float pull = smoothstep(0.55, 0.0, dist) * 0.055;
  p -= normalize(d + vec2(1e-5)) * pull;

  p.y += u_scroll * 0.25;
  return p;
}

float attention(vec2 p) {
  vec2 d = p - u_mouse;
  d.x *= u_aspect;
  return smoothstep(0.5, 0.0, length(d));
}
`;

const EDGE_VERT = `
attribute vec2 a_pos;
attribute float a_seed;
attribute float a_t;        // 0 at one end, 1 at the other
attribute float a_edgeSeed;
${SHARED}
varying float v_t;
varying float v_edgeSeed;
varying float v_att;

void main() {
  vec2 p = displace(a_pos, a_seed);
  gl_Position = vec4(p.x / u_aspect, p.y, 0.0, 1.0);
  v_t = a_t;
  v_edgeSeed = a_edgeSeed;
  v_att = attention(a_pos);
}
`;

const EDGE_FRAG = `
precision mediump float;
// NOTE: u_time / u_scroll are also declared in the vertex stage, where floats
// default to highp. GLSL ES fails to LINK if the same uniform has different
// precision in the two stages, so they are explicitly highp here.
uniform highp float u_time;
uniform highp float u_scroll;
varying float v_t;
varying float v_edgeSeed;
varying float v_att;

void main() {
  // resting wire — must be readable at rest so the graph reads as a network,
  // not a starfield; the pulse then rides on top of it
  vec3 wire = vec3(0.46, 0.48, 0.92);
  float base = 0.62 + 0.75 * v_att;

  // signal packet travelling along the edge
  float speed = 0.22 + 0.30 * fract(v_edgeSeed * 3.7);
  float head = fract(u_time * speed + v_edgeSeed);
  float d = abs(v_t - head);
  d = min(d, 1.0 - d);
  float pulse = exp(-d * d * 900.0);

  vec3 hot = mix(vec3(0.545, 0.373, 0.878), vec3(0.949, 0.651, 0.353),
                 step(0.72, fract(v_edgeSeed * 5.1)));

  vec3 col = wire * base + hot * pulse * 2.2;
  float a = (base + pulse * 1.1) * (1.0 - u_scroll * 0.95);
  gl_FragColor = vec4(col, a);
}
`;

const NODE_VERT = `
attribute vec2 a_pos;
attribute float a_seed;
attribute float a_size;
${SHARED}
uniform float u_dpr;
varying float v_seed;
varying float v_fire;
varying float v_att;

void main() {
  vec2 p = displace(a_pos, a_seed);
  gl_Position = vec4(p.x / u_aspect, p.y, 0.0, 1.0);

  // periodic firing, staggered per node
  float f = fract(u_time * 0.35 + a_seed);
  v_fire = exp(-f * f * 26.0);
  v_att = attention(a_pos);
  v_seed = a_seed;

  float s = a_size * (1.0 + v_fire * 1.5 + v_att * 0.8);
  gl_PointSize = s * u_dpr * (1.0 - u_scroll * 0.4);
}
`;

const NODE_FRAG = `
precision mediump float;
uniform highp float u_scroll;   // must match the vertex stage's precision
varying float v_seed;
varying float v_fire;
varying float v_att;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  float core = smoothstep(0.5, 0.06, d);
  float halo = smoothstep(0.5, 0.0, d) * 0.5;

  vec3 indigo = vec3(0.357, 0.373, 0.937);
  vec3 violet = vec3(0.545, 0.373, 0.878);
  vec3 amber  = vec3(0.949, 0.651, 0.353);

  vec3 col = mix(indigo, violet, fract(v_seed * 3.1));
  col = mix(col, amber, step(0.88, fract(v_seed * 7.7)));
  col = mix(col, vec3(1.0), v_fire * 0.5);

  float a = (core * (0.72 + 0.58 * (v_fire * 0.8 + v_att)) + halo * (0.45 + v_att * 0.6))
          * (1.0 - u_scroll * 0.95);
  gl_FragColor = vec4(col, a);
}
`;

/** Hex-lattice node positions in unit space (y ∈ [-1,1], x pre-aspect). */
function buildGraph(aspectGuess: number) {
  const nodes: [number, number][] = [];
  const cols = 17;
  const rows = 11;
  const w = 2.35 * aspectGuess;
  const h = 2.3;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const stagger = r % 2 === 0 ? 0 : 0.5;
      const x = ((c + stagger) / (cols - 1) - 0.5) * w;
      const y = (r / (rows - 1) - 0.5) * h;
      // jitter so it reads organic, not like graph paper
      const jx = (Math.random() - 0.5) * 0.055;
      const jy = (Math.random() - 0.5) * 0.055;
      // thin (don't clear) the field behind the copy block
      const dCentre = Math.hypot(x / aspectGuess, y);
      if (dCentre < 0.36 && Math.random() < 0.55) continue;
      nodes.push([x + jx, y + jy]);
    }
  }

  const edges: [number, number][] = [];
  const maxD = (w / (cols - 1)) * 1.45;
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i][0] - nodes[j][0];
      const dy = nodes[i][1] - nodes[j][1];
      if (Math.hypot(dx, dy) < maxD) edges.push([i, j]);
    }
  }
  return { nodes, edges };
}

export default function NeuralCanvas({ className = "" }: { className?: string }) {
  const reduced = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ok, setOk] = useState(true);

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: true, alpha: true, premultipliedAlpha: false });
    if (!gl) {
      setOk(false);
      return;
    }

    let raf = 0;
    let running = false;

    const mkProgram = (vs: string, fs: string) => {
      const c = (type: number, src: string) => {
        const sh = gl.createShader(type)!;
        gl.shaderSource(sh, src);
        gl.compileShader(sh);
        if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS))
          throw new Error(gl.getShaderInfoLog(sh) ?? "compile");
        return sh;
      };
      const p = gl.createProgram()!;
      gl.attachShader(p, c(gl.VERTEX_SHADER, vs));
      gl.attachShader(p, c(gl.FRAGMENT_SHADER, fs));
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS))
        throw new Error("link: " + (gl.getProgramInfoLog(p) ?? ""));
      return p;
    };

    try {
      const aspect0 = Math.max(0.6, canvas.clientWidth / Math.max(1, canvas.clientHeight));
      const { nodes, edges } = buildGraph(aspect0);

      const nodePos = new Float32Array(nodes.length * 2);
      const nodeSeed = new Float32Array(nodes.length);
      const nodeSize = new Float32Array(nodes.length);
      nodes.forEach(([x, y], i) => {
        nodePos[i * 2] = x;
        nodePos[i * 2 + 1] = y;
        nodeSeed[i] = Math.random();
        nodeSize[i] = 2.8 + Math.random() * 4.2;
      });

      const ev = new Float32Array(edges.length * 2 * 2);
      const es = new Float32Array(edges.length * 2);
      const et = new Float32Array(edges.length * 2);
      const ee = new Float32Array(edges.length * 2);
      edges.forEach(([a, b], k) => {
        const seedE = Math.random();
        [a, b].forEach((n, side) => {
          const idx = k * 2 + side;
          ev[idx * 2] = nodePos[n * 2];
          ev[idx * 2 + 1] = nodePos[n * 2 + 1];
          es[idx] = nodeSeed[n];
          et[idx] = side;
          ee[idx] = seedE;
        });
      });

      const edgeProg = mkProgram(EDGE_VERT, EDGE_FRAG);
      const nodeProg = mkProgram(NODE_VERT, NODE_FRAG);

      const buf = (data: Float32Array) => {
        const b = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, b);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        return b!;
      };
      const bEv = buf(ev), bEs = buf(es), bEt = buf(et), bEe = buf(ee);
      const bNp = buf(nodePos), bNs = buf(nodeSeed), bNz = buf(nodeSize);

      const attach = (prog: WebGLProgram, b: WebGLBuffer, name: string, size: number) => {
        const loc = gl.getAttribLocation(prog, name);
        if (loc < 0) return;
        gl.bindBuffer(gl.ARRAY_BUFFER, b);
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
      };
      const U = (prog: WebGLProgram, n: string) => gl.getUniformLocation(prog, n);

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

      let mx = 0, my = -3, cmx = 0, cmy = -3, st = 0, cst = 0;
      const onMove = (e: MouseEvent) => {
        const r = canvas.getBoundingClientRect();
        mx = ((e.clientX - r.left) / r.width) * 2 - 1;
        my = -(((e.clientY - r.top) / r.height) * 2 - 1);
      };
      const onLeave = () => { my = -3; };
      const onScroll = () => {
        st = Math.min(1, Math.max(0, window.scrollY / window.innerHeight));
      };

      const t0 = performance.now();
      const frame = () => {
        resize();
        const t = (performance.now() - t0) / 1000;
        cmx += (mx - cmx) * 0.07;
        cmy += (my - cmy) * 0.07;
        cst += (st - cst) * 0.1;
        const aspect = canvas.clientWidth / Math.max(1, canvas.clientHeight);

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // edges
        gl.useProgram(edgeProg);
        attach(edgeProg, bEv, "a_pos", 2);
        attach(edgeProg, bEs, "a_seed", 1);
        attach(edgeProg, bEt, "a_t", 1);
        attach(edgeProg, bEe, "a_edgeSeed", 1);
        gl.uniform1f(U(edgeProg, "u_time"), t);
        gl.uniform2f(U(edgeProg, "u_mouse"), cmx * aspect, cmy);
        gl.uniform1f(U(edgeProg, "u_aspect"), aspect);
        gl.uniform1f(U(edgeProg, "u_scroll"), cst);
        gl.drawArrays(gl.LINES, 0, edges.length * 2);

        // nodes
        gl.useProgram(nodeProg);
        attach(nodeProg, bNp, "a_pos", 2);
        attach(nodeProg, bNs, "a_seed", 1);
        attach(nodeProg, bNz, "a_size", 1);
        gl.uniform1f(U(nodeProg, "u_time"), t);
        gl.uniform2f(U(nodeProg, "u_mouse"), cmx * aspect, cmy);
        gl.uniform1f(U(nodeProg, "u_aspect"), aspect);
        gl.uniform1f(U(nodeProg, "u_scroll"), cst);
        gl.uniform1f(U(nodeProg, "u_dpr"), dpr);
        gl.drawArrays(gl.POINTS, 0, nodes.length);

        raf = requestAnimationFrame(frame);
      };

      const start = () => { if (!running) { running = true; raf = requestAnimationFrame(frame); } };
      const stop = () => { running = false; cancelAnimationFrame(raf); };

      window.addEventListener("mousemove", onMove, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      canvas.addEventListener("mouseleave", onLeave);
      const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0 });
      io.observe(canvas);

      return () => {
        io.disconnect();
        stop();
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("scroll", onScroll);
        canvas.removeEventListener("mouseleave", onLeave);
      };
    } catch (err) {
      // surface GL problems instead of silently dropping the whole visual
      console.error("[NeuralCanvas]", err);
      setOk(false);
      cancelAnimationFrame(raf);
    }
  }, [reduced]);

  if (reduced || !ok) return null;
  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
