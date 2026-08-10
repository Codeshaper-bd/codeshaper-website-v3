"use client";

import { useEffect, useRef, useState, forwardRef } from "react";
import { usePrefersReducedMotion } from "@/lib/motion";

/**
 * Hero aurora: lightweight raw-WebGL fragment shader (no Three.js),
 * clipped into Codeshaper's hexagonal mark via CSS clip-path.
 * Falls back to layered CSS gradients when WebGL is unavailable
 * or the user prefers reduced motion (static gradient in that case).
 *
 * NOTE: A Seedance-generated video loop can replace the shader later —
 * drop the file in /public/video/hero-aurora.webm and swap this component.
 */

const HEX_CLIP = "polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)";

const FRAG = `
precision mediump float;
uniform vec2 u_res;
uniform float u_time;

// hash + value noise + fbm — cheap, mobile-friendly
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = p * 2.05 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 p = uv * vec2(u_res.x / u_res.y, 1.0);
  float t = u_time * 0.06;

  // two drifting fbm fields create the aurora ribbons
  float n1 = fbm(p * 1.6 + vec2(t * 0.8, -t * 0.5));
  float n2 = fbm(p * 2.4 - vec2(t * 0.4, t * 0.7) + n1);
  float ribbon = smoothstep(0.25, 0.85, n2);

  vec3 canvasCol = vec3(0.039, 0.039, 0.059);          // #0A0A0F
  vec3 indigo = vec3(0.263, 0.220, 0.792);             // #4338CA
  vec3 violet = vec3(0.545, 0.361, 0.965);             // #8B5CF6
  vec3 amber  = vec3(0.984, 0.749, 0.369);             // #FBBF5E

  vec3 col = mix(indigo, violet, smoothstep(0.2, 0.8, n1));
  // warm amber kicker at the upper-right edge only
  float edge = smoothstep(0.55, 1.05, uv.x + uv.y * 0.35);
  col = mix(col, amber, edge * 0.55 * ribbon);

  col = mix(canvasCol, col, ribbon * 0.85);

  // vignette toward the hex edges so the clip feels soft
  float vig = smoothstep(1.05, 0.45, distance(uv, vec2(0.5)));
  col = mix(canvasCol, col, vig);

  gl_FragColor = vec4(col, 1.0);
}
`;

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const CssFallback = ({ animate }: { animate: boolean }) => (
  <div className="absolute inset-0" style={{ background: "#0A0A0F" }}>
    <div
      className={`absolute -inset-[20%] rounded-full blur-3xl ${animate ? "aurora-fallback-a" : ""}`}
      style={{
        background:
          "radial-gradient(closest-side, rgba(91,95,239,0.85), rgba(139,95,224,0.45), transparent)",
      }}
    />
    <div
      className={`absolute -inset-[25%] rounded-full blur-3xl ${animate ? "aurora-fallback-b" : ""}`}
      style={{
        background:
          "radial-gradient(closest-side at 70% 30%, rgba(242,166,90,0.55), transparent 60%)",
      }}
    />
  </div>
);

const HexAurora = forwardRef<HTMLDivElement, { className?: string; videoSrc?: string }>(
  function HexAurora({ className = "", videoSrc }, outerRef) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [webglFailed, setWebglFailed] = useState(false);
  const [videoOk, setVideoOk] = useState(true);
  const reduced = usePrefersReducedMotion();
  const useVideo = Boolean(videoSrc) && videoOk && !reduced;

  // React doesn't serialize the `muted` attribute in SSR markup, which makes
  // browsers refuse autoplay. Set it imperatively and kick playback.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !useVideo) return;
    v.muted = true;
    v.play().catch(() => {});
  }, [useVideo]);

  useEffect(() => {
    if (reduced || useVideo) return; // video plays instead, or static CSS fallback
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) {
      setWebglFailed(true);
      return;
    }

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(s) ?? "shader compile failed");
      }
      return s;
    };

    let raf = 0;
    let running = false;
    try {
      const prog = gl.createProgram()!;
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error("link failed");
      gl.useProgram(prog);

      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 3, -1, -1, 3]),
        gl.STATIC_DRAW
      );
      const loc = gl.getAttribLocation(prog, "a_pos");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

      const uRes = gl.getUniformLocation(prog, "u_res");
      const uTime = gl.getUniformLocation(prog, "u_time");

      const resize = () => {
        // render at half-res for perf; CSS scales it up (blur-friendly content)
        const dpr = Math.min(window.devicePixelRatio, 1.5) * 0.5;
        const w = Math.max(2, Math.floor(canvas.clientWidth * dpr));
        const h = Math.max(2, Math.floor(canvas.clientHeight * dpr));
        if (canvas.width !== w || canvas.height !== h) {
          canvas.width = w;
          canvas.height = h;
          gl.viewport(0, 0, w, h);
        }
      };

      const t0 = performance.now();
      const frame = () => {
        resize();
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uTime, (performance.now() - t0) / 1000);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
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

      const io = new IntersectionObserver(
        ([e]) => (e.isIntersecting ? start() : stop()),
        { threshold: 0 }
      );
      io.observe(canvas);

      return () => {
        io.disconnect();
        stop();
      };
    } catch {
      setWebglFailed(true);
      cancelAnimationFrame(raf);
    }
  }, [reduced, useVideo]);

  const useFallback = webglFailed || reduced;

  return (
    <div ref={outerRef} className={className} aria-hidden>
      {/* Hex-clipped aurora: Seedance loop → WebGL shader → CSS gradient (§5 fallback chain) */}
      <div className="absolute inset-0" style={{ clipPath: HEX_CLIP }}>
        {useVideo ? (
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            src={videoSrc}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onError={() => setVideoOk(false)}
          />
        ) : useFallback ? (
          <CssFallback animate={!reduced} />
        ) : (
          <canvas ref={canvasRef} className="h-full w-full" />
        )}
        {/* faint hex-cell texture over the aurora */}
        <svg className="absolute inset-0 h-full w-full opacity-[0.07]" aria-hidden>
          <defs>
            <pattern id="hexcells" width="56" height="97" patternUnits="userSpaceOnUse" patternTransform="scale(1)">
              <path
                d="M28 0 L56 16.16 L56 48.5 L28 64.66 L0 48.5 L0 16.16 Z"
                fill="none"
                stroke="white"
                strokeWidth="1"
              />
              <path
                d="M28 64.66 L56 80.83 L56 97 M0 80.83 L28 64.66"
                fill="none"
                stroke="white"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexcells)" />
        </svg>
        {/* text-contrast overlay (§4): darken via gradient, not media opacity */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(10,10,15,0.55) 0%, rgba(10,10,15,0.15) 38%, transparent 60%)",
          }}
        />
        {/* hairline hex border */}
        <div
          className="absolute inset-0 border border-white/10"
          style={{ clipPath: HEX_CLIP }}
        />
      </div>
      {/* soft glow bleeding past the hex edges */}
      <div
        className="absolute inset-[-10%] -z-10 blur-3xl opacity-40"
        style={{
          background:
            "radial-gradient(closest-side, rgba(99,72,220,0.5), transparent 70%)",
        }}
      />
    </div>
  );
});

export default HexAurora;
