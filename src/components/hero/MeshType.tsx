"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/motion";
import { drawGradientMesh } from "./gradientMesh";

/**
 * Mesh-masked kinetic type — the light hero's signature.
 *
 * The gradient mesh plays *inside* the letterforms via canvas
 * `destination-in` compositing (glyphs become windows onto the drifting
 * mesh), while the word cycles through what the studio does. Replaces
 * VideoType, which did the same trick with the dark aurora video — same
 * mask mechanics, mesh instead of video, so no external asset is needed.
 *
 * Interaction: the pointer parallaxes the mesh within the type; scrolling
 * scales the word up so you fall through it into the page.
 */
const WORDS = ["DESIGN", "BUILD", "AUTOMATE", "SHIP", "CODESHAPER"];
const HOLD = 2100;
const FADE = 900;

export default function MeshType({ className = "" }: { className?: string }) {
  const reduced = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = false;
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
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
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
      const set = (s: number) => {
        const family = getComputedStyle(document.body).getPropertyValue("--font-urbanist") || "sans-serif";
        ctx.font = `700 ${s}px ${family}`;
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
      ctx.fillStyle = "#000";
      ctx.fillText(text, 0, 0);
      ctx.restore();
    };

    const t0 = performance.now();
    const draw = () => {
      resize();
      const W = canvas.width;
      const H = canvas.height;
      const elapsed = performance.now() - t0;

      cmx += (mx - cmx) * 0.06;
      cmy += (my - cmy) * 0.06;
      csc += (sc - csc) * 0.1;

      // 1. paint the drifting mesh, offset by pointer for parallax
      drawGradientMesh(ctx, W, H, elapsed + cmx * 4000 + cmy * 3000);

      // 2. cut it to the shape of the word
      ctx.globalCompositeOperation = "destination-in";
      const cycle = HOLD + FADE;
      const idx = reduced ? WORDS.length - 1 : Math.floor(elapsed / cycle) % WORDS.length;
      const next = (idx + 1) % WORDS.length;
      const phase = (elapsed % cycle) / cycle;
      const fading = phase > HOLD / cycle;
      const t = fading ? (phase - HOLD / cycle) / (FADE / cycle) : 0;
      const ease = t * t * (3 - 2 * t);
      const scale = 1 + csc * 0.55;

      if (reduced) {
        stampText(WORDS[WORDS.length - 1], 1, 1);
      } else {
        stampText(WORDS[idx], 1 - ease, scale * (1 + ease * 0.06));
        if (fading) stampText(WORDS[next], ease, scale * (0.94 + ease * 0.06));
      }

      ctx.globalCompositeOperation = "source-over";
      if (!reduced) raf = requestAnimationFrame(draw);
    };

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(draw);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0 });
    io.observe(canvas);

    return () => {
      io.disconnect();
      stop();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ filter: "drop-shadow(0 0 32px rgba(102,126,234,0.25))" }}
      aria-hidden
    />
  );
}
