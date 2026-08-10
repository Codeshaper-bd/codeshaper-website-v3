"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/motion";
import { SEEDANCE_HERO_URL } from "./HeroVideo";

/**
 * Video-filled kinetic type — the hero's signature.
 *
 * The aurora film plays *inside* the letterforms: each frame the video is
 * painted to a canvas, then composited `destination-in` against live text, so
 * the glyphs become windows onto moving light. The word cycles through what the
 * studio does and finally the company name, crossfading through the mask so one
 * word dissolves into the next while the film keeps running underneath.
 *
 *   DESIGN → BUILD → AUTOMATE → SHIP → CODESHAPER
 *
 * Interaction: the pointer parallaxes the film *within* the type (the letters
 * stay put, the light behind them drifts), and scrolling scales the word up so
 * you fall through it into the page.
 *
 * Canvas 2D is deliberate here — masking video through text is one composite
 * op, which is cheaper and far more reliable across browsers than an SVG mask
 * or a WebGL two-texture pass.
 */
const WORDS = ["DESIGN", "BUILD", "AUTOMATE", "SHIP", "CODESHAPER"];
const HOLD = 2100;
const FADE = 900;

export default function VideoType({ className = "" }: { className?: string }) {
  const reduced = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Build the video element in JS: no crossOrigin (CloudFront doesn't send
    // CORS headers, and we never read pixels back — a tainted canvas is fine).
    const video = document.createElement("video");
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = "auto";
    video.setAttribute("playsinline", "");
    const srcs = [SEEDANCE_HERO_URL, "/media/hero-aurora.webm", "/media/hero-aurora.mp4"];
    let srcIdx = 0;
    video.src = srcs[srcIdx];
    const tryNext = () => {
      srcIdx += 1;
      if (srcIdx < srcs.length) {
        video.src = srcs[srcIdx];
        video.load();
        video.play().catch(() => {});
      }
    };
    video.addEventListener("error", tryNext);
    video.addEventListener("canplay", () => setVideoReady(true));
    if (!reduced) video.play().catch(() => {});

    let raf = 0;
    let running = false;
    let dpr = 1;
    let mx = 0, my = 0, cmx = 0, cmy = 0;
    let sc = 0, csc = 0;

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width - 0.5;
      my = (e.clientY - r.top) / r.height - 0.5;
    };
    const onScroll = () => {
      sc = Math.min(1, Math.max(0, window.scrollY / window.innerHeight));
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.floor(canvas.clientWidth * dpr);
      const h = Math.floor(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    /** Fit `text` to the canvas width and stamp it as the mask. */
    const stampText = (text: string, alpha: number, scale: number) => {
      const W = canvas.width;
      const H = canvas.height;
      let size = H * 0.72;
      const family = `var(--font-geom), ui-sans-serif, system-ui, sans-serif`;
      const set = (s: number) => {
        ctx.font = `700 ${s}px ${getComputedStyle(document.body).getPropertyValue("--font-geom") || "sans-serif"}`;
        // fall back to a literal family if the CSS var isn't resolvable
        if (!ctx.font.includes("px")) ctx.font = `700 ${s}px ${family}`;
      };
      set(size);
      const maxW = W * 0.92;
      while (ctx.measureText(text).width > maxW && size > 10) {
        size *= 0.94;
        set(size);
      }
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.translate(W / 2, H / 2);
      ctx.scale(scale, scale);
      ctx.fillStyle = "#fff";
      ctx.fillText(text, 0, 0);
      ctx.restore();
    };

    const t0 = performance.now();
    const draw = () => {
      resize();
      const W = canvas.width;
      const H = canvas.height;
      const now = performance.now();
      const elapsed = now - t0;

      cmx += (mx - cmx) * 0.06;
      cmy += (my - cmy) * 0.06;
      csc += (sc - csc) * 0.1;

      ctx.clearRect(0, 0, W, H);

      // ── 1. paint the moving light ──
      const cover = () => {
        const vw = video.videoWidth || 16;
        const vh = video.videoHeight || 9;
        // scale to cover, then over-scale so parallax never exposes an edge
        const s = Math.max(W / vw, H / vh) * 1.25;
        const dw = vw * s;
        const dh = vh * s;
        const dx = (W - dw) / 2 + cmx * W * 0.08;
        const dy = (H - dh) / 2 + cmy * H * 0.12;
        ctx.drawImage(video, dx, dy, dw, dh);
      };

      if (videoReady && video.readyState >= 2) {
        cover();
      } else {
        // graceful stand-in until the film is ready
        const g = ctx.createLinearGradient(0, 0, W, H);
        g.addColorStop(0, "#5B5FEF");
        g.addColorStop(0.55, "#8B5FE0");
        g.addColorStop(1, "#F2A65A");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }

      // lift contrast so the film reads inside thin strokes
      ctx.save();
      ctx.globalCompositeOperation = "overlay";
      ctx.fillStyle = "rgba(139,95,224,0.35)";
      ctx.fillRect(0, 0, W, H);
      ctx.restore();

      // ── 2. cut it to the shape of the word ──
      ctx.globalCompositeOperation = "destination-in";

      const cycle = HOLD + FADE;
      const idx = reduced ? WORDS.length - 1 : Math.floor(elapsed / cycle) % WORDS.length;
      const next = (idx + 1) % WORDS.length;
      const phase = (elapsed % cycle) / cycle;
      const fading = phase > HOLD / cycle;
      const t = fading ? (phase - HOLD / cycle) / (FADE / cycle) : 0;
      const ease = t * t * (3 - 2 * t);

      // scroll pushes the word toward the viewer
      const scale = 1 + csc * 0.55;

      if (reduced) {
        stampText(WORDS[WORDS.length - 1], 1, 1);
      } else {
        stampText(WORDS[idx], 1 - ease, scale * (1 + ease * 0.06));
        if (fading) stampText(WORDS[next], ease, scale * (0.94 + ease * 0.06));
      }

      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(draw);
    };

    const start = () => {
      if (running) return;
      running = true;
      if (!reduced) video.play().catch(() => {});
      raf = requestAnimationFrame(draw);
    };
    const stop = () => {
      running = false;
      video.pause();
      cancelAnimationFrame(raf);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), {
      threshold: 0,
    });
    io.observe(canvas);

    return () => {
      io.disconnect();
      stop();
      video.removeEventListener("error", tryNext);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reduced, videoReady]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ filter: "drop-shadow(0 0 42px rgba(91,95,239,0.35))" }}
      aria-hidden
    />
  );
}
