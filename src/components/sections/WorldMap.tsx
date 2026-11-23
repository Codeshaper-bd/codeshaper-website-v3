"use client";

import { useEffect, useRef, useState } from "react";
import { HQ, SERVED } from "@/components/hero/globe/servedCountries";

/**
 * Dotted world map for "At a glance": the land drawn as a grid of fine dots
 * (sampled from the globe's land mask, /media/globe-land.webp), the client
 * countries as brand-coloured points (the same list as the hero globe, never
 * the development sample counts) and Dhaka as the delivery hub, with thin
 * arcs from the hub to every client country that draw in once the map is
 * seen. Hovering a point names the country. Latitudes 80°N to 58°S (no
 * Antarctica). Decorative for assistive tech: the countries are listed in
 * the section text instead.
 */
const W = 1000;
const TOP = 80;
const BOTTOM = -58;
const H = Math.round((W * (TOP - BOTTOM)) / 360);
const project = (lat: number, lng: number) => ({ x: ((lng + 180) / 360) * W, y: ((TOP - lat) / (TOP - BOTTOM)) * H });

const hub = project(HQ.lat, HQ.lng);
const points = SERVED.map((c) => ({ ...c, ...project(c.lat, c.lng) }));
/** A gentle arc from the hub: control point above the midpoint, higher for longer routes. */
const arc = (x: number, y: number) => {
  const mx = (hub.x + x) / 2;
  const my = (hub.y + y) / 2;
  const d = Math.hypot(x - hub.x, y - hub.y);
  return `M${hub.x},${hub.y} Q${mx},${my - d * 0.28} ${x},${y}`;
};

export default function WorldMap({ hubLabel }: { hubLabel: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [seen, setSeen] = useState(false);
  const [hover, setHover] = useState<number | null>(null);

  // land dots
  useEffect(() => {
    const el = canvas.current;
    const box = wrap.current;
    if (!el || !box) return;
    let mask: ImageData | null = null;
    const img = new Image();
    img.decoding = "async";
    img.src = "/media/globe-land.webp";

    const draw = () => {
      if (!mask) return;
      const { width } = box.getBoundingClientRect();
      const height = (width * H) / W;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      el.width = Math.round(width * dpr);
      el.height = Math.round(height * dpr);
      const ctx = el.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      const cols = width < 640 ? 110 : 170;
      const step = width / cols;
      const rows = Math.floor(height / step);
      const r = Math.max(1, step * 0.27);
      ctx.fillStyle = "rgba(11,15,25,0.26)";
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const lng = ((i + 0.5) / cols) * 360 - 180;
          const lat = TOP - ((j + 0.5) / rows) * (TOP - BOTTOM);
          const sx = Math.min(mask.width - 1, Math.floor(((lng + 180) / 360) * mask.width));
          const sy = Math.min(mask.height - 1, Math.floor(((90 - lat) / 180) * mask.height));
          if (mask.data[(sy * mask.width + sx) * 4] > 128) {
            ctx.beginPath();
            ctx.arc((i + 0.5) * step, (j + 0.5) * step, r, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    };

    img.onload = () => {
      const off = document.createElement("canvas");
      off.width = 512;
      off.height = 256;
      const octx = off.getContext("2d", { willReadFrequently: true });
      if (!octx) return;
      octx.drawImage(img, 0, 0, off.width, off.height);
      mask = octx.getImageData(0, 0, off.width, off.height);
      draw();
    };
    const ro = new ResizeObserver(() => draw());
    ro.observe(box);
    return () => ro.disconnect();
  }, []);

  // draw the arcs in once the map is on screen
  useEffect(() => {
    const box = wrap.current;
    if (!box) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setSeen(true);
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setSeen(true), io.disconnect()), { threshold: 0.3 });
    io.observe(box);
    return () => io.disconnect();
  }, []);

  const tip = hover === null ? null : points[hover];

  return (
    <div ref={wrap} className="relative w-full" style={{ aspectRatio: `${W} / ${H}` }} aria-hidden>
      <canvas ref={canvas} className="absolute inset-0 h-full w-full" />
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full overflow-visible">
        <defs>
          <linearGradient id="wm-arc" x1="0" x2="1">
            <stop offset="0" stopColor="#615fff" stopOpacity="0.32" />
            <stop offset="1" stopColor="#a78bfa" stopOpacity="0.22" />
          </linearGradient>
        </defs>
        {points.map((p, i) => (
          <path
            key={`a-${p.a3}`}
            d={arc(p.x, p.y)}
            fill="none"
            stroke="url(#wm-arc)"
            strokeWidth={hover === i ? 1.6 : 0.7}
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset={seen ? 0 : 1}
            style={{ transition: `stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1) ${i * 35}ms, stroke-width .2s`, opacity: hover === null || hover === i ? 1 : 0.35 }}
          />
        ))}
        {points.map((p, i) => (
          <g key={p.a3} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} className="cursor-default" style={{ pointerEvents: "all" }}>
            <circle cx={p.x} cy={p.y} r={12} fill="transparent" />
            <circle cx={p.x} cy={p.y} r={hover === i ? 7 : 5} fill="#615fff" opacity={0.16} style={{ transition: "r .2s" }} />
            <circle cx={p.x} cy={p.y} r={2.6} fill="#615fff" stroke="#fff" strokeWidth={1.2} />
          </g>
        ))}
        {/* the hub */}
        <circle cx={hub.x} cy={hub.y} r={14} fill="#0b0f19" opacity={0.08}>
          <animate attributeName="r" values="8;18;8" dur="3.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.14;0;0.14" dur="3.2s" repeatCount="indefinite" />
        </circle>
        <circle cx={hub.x} cy={hub.y} r={5} fill="#0b0f19" stroke="#fff" strokeWidth={2} />
      </svg>

      {/* labels */}
      <span
        className="pointer-events-none absolute -translate-x-1/2 translate-y-3 whitespace-nowrap max-sm:hidden rounded-full bg-[#0b0f19] px-2.5 py-1 font-urbanist text-[11px] font-semibold text-white shadow-[0_6px_16px_-8px_rgba(11,15,25,0.6)]"
        style={{ left: `${(hub.x / W) * 100}%`, top: `${(hub.y / H) * 100}%` }}
      >
        {hubLabel}
      </span>
      {tip && (
        <span
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-[calc(100%+10px)] whitespace-nowrap rounded-full border border-[#0b0f19]/[0.08] bg-white px-2.5 py-1 font-urbanist text-[11.5px] font-semibold text-ink shadow-[0_8px_20px_-10px_rgba(11,15,25,0.4)]"
          style={{ left: `${(tip.x / W) * 100}%`, top: `${(tip.y / H) * 100}%` }}
        >
          {tip.name}
        </span>
      )}
    </div>
  );
}
