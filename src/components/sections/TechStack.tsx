"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import {
  SiAnthropic,
  SiDjango,
  SiDocker,
  SiFigma,
  SiFlutter,
  SiFramer,
  SiGithubactions,
  SiGo,
  SiGooglecloud,
  SiGraphql,
  SiKotlin,
  SiKubernetes,
  SiLangchain,
  SiLaravel,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiPhp,
  SiPostgresql,
  SiPrisma,
  SiPython,
  SiReact,
  SiRedis,
  SiShopify,
  SiStripe,
  SiSupabase,
  SiSwift,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  SiVuedotjs,
  SiWordpress,
  SiAngular,
  SiSvelte,
  SiAstro,
  SiNuxt,
  SiOpenjdk,
  SiSpringboot,
  SiDotnet,
  SiNestjs,
  SiFastapi,
  SiExpo,
  SiBigcommerce,
  SiFirebase,
  SiElasticsearch,
  SiCloudflare,
  SiTerraform,
  SiGooglegemini,
  SiHuggingface,
  SiPytorch,
  SiTensorflow,
} from "react-icons/si";
import { DiMsqlServer } from "react-icons/di";
import { TbBrandCSharp, TbBrandAzure } from "react-icons/tb";
import { FaJava, FaMagento } from "react-icons/fa6";
import Reveal from "@/components/system/Reveal";
import { SectionEyebrow, SectionTitle } from "@/components/system/SectionHeading";

/**
 * Tools & technology as a scroll story (reference: exodusconsulting.com).
 *
 *  · Large screens: the section pins for ~2 screens of scroll. Phase 1:
 *    the technology chips appear one by one, scattered over a faint grid,
 *    while a counter climbs to the total. Phase 2: every chip flies into
 *    its discipline card and the counter resolves to the number of
 *    disciplines. Before they are grouped the chips drift slowly and can be
 *    grabbed and thrown (momentum, friction, soft bounce off the edges and
 *    off each other);
 *    the grouping then flies them in from wherever they are. The frame
 *    loop runs only while the section is on screen.
 *  · Phones, short screens and reduced motion: no pinning; the grouped
 *    cards render directly (they are the real, accessible content; the
 *    floating layer is aria-hidden).
 */
type Category = "All" | "Frontend" | "Backend" | "Mobile" | "Commerce" | "Data" | "Cloud & DevOps" | "AI";

type Tech = {
  name: string;
  category: Exclude<Category, "All">;
  icon?: ComponentType<{ size?: number; color?: string; className?: string }>;
  color: string;
  description: string;
  badge?: string;
};

const CATEGORIES: Category[] = ["All", "Frontend", "Backend", "Mobile", "Commerce", "Data", "Cloud & DevOps", "AI"];

const TECH_STACK: Tech[] = [
  { name: "React", category: "Frontend", icon: SiReact, color: "#61DAFB", description: "Interactive web apps and product dashboards." },
  { name: "Next.js", category: "Frontend", icon: SiNextdotjs, color: "#000000", description: "Fast websites, app routers, SEO, and hybrid rendering." },
  { name: "TypeScript", category: "Frontend", icon: SiTypescript, color: "#3178C6", description: "Safer frontends and maintainable product code." },
  { name: "Tailwind CSS", category: "Frontend", icon: SiTailwindcss, color: "#38BDF8", description: "Responsive interfaces with consistent design tokens." },
  { name: "Framer Motion", category: "Frontend", icon: SiFramer, color: "#A78BFA", description: "Polished interaction and interface motion." },
  { name: "Vue.js", category: "Frontend", icon: SiVuedotjs, color: "#42B883", description: "Flexible app interfaces and admin experiences." },

  { name: "Node.js", category: "Backend", icon: SiNodedotjs, color: "#5FA04E", description: "APIs, realtime systems, and JavaScript backends." },
  { name: "Laravel", category: "Backend", icon: SiLaravel, color: "#FF2D20", description: "Business platforms, portals, and operations systems." },
  { name: "PHP", category: "Backend", icon: SiPhp, color: "#777BB4", description: "CMS, commerce, and backend modernization." },
  { name: "Python", category: "Backend", icon: SiPython, color: "#FFD43B", description: "Automation, data workflows, and AI-connected services." },
  { name: "Django", category: "Backend", icon: SiDjango, color: "#44B78B", description: "Secure backend apps and admin-heavy platforms." },
  { name: "Go", category: "Backend", icon: SiGo, color: "#00ADD8", description: "High-throughput services and infrastructure tooling." },

  { name: "Flutter", category: "Mobile", icon: SiFlutter, color: "#54C5F8", description: "Cross-platform mobile apps with a single codebase." },
  { name: "Swift", category: "Mobile", icon: SiSwift, color: "#FA7343", description: "Native iOS apps with premium performance." },
  { name: "Kotlin", category: "Mobile", icon: SiKotlin, color: "#A97BFF", description: "Native Android apps and modern mobile workflows." },
  { name: "React Native", category: "Mobile", icon: SiReact, color: "#61DAFB", description: "Product-focused mobile apps with shared React skills." },

  { name: "Shopify", category: "Commerce", icon: SiShopify, color: "#95BF47", description: "Conversion-focused storefronts and store operations." },
  { name: "WordPress", category: "Commerce", icon: SiWordpress, color: "#21759B", description: "Premium CMS builds and editorial workflows." },
  { name: "WooCommerce", category: "Commerce", icon: SiWordpress, color: "#96588A", description: "Flexible commerce on WordPress foundations." },
  { name: "Stripe", category: "Commerce", icon: SiStripe, color: "#635BFF", description: "Payments, subscriptions, billing, and checkout." },

  { name: "PostgreSQL", category: "Data", icon: SiPostgresql, color: "#4169E1", description: "Reliable relational data for serious products." },
  { name: "MongoDB", category: "Data", icon: SiMongodb, color: "#47A248", description: "Document data for flexible app models." },
  { name: "MySQL", category: "Data", icon: SiMysql, color: "#4479A1", description: "Battle-tested databases for web platforms." },
  { name: "Redis", category: "Data", icon: SiRedis, color: "#FF4438", description: "Caching, queues, realtime speed, and sessions." },
  { name: "Supabase", category: "Data", icon: SiSupabase, color: "#3ECF8E", description: "Fast product backends, auth, and Postgres tooling." },
  { name: "Prisma", category: "Data", icon: SiPrisma, color: "#9FB7C7", description: "Typed data access for modern TypeScript apps." },
  { name: "GraphQL", category: "Data", icon: SiGraphql, color: "#E10098", description: "Flexible APIs for connected product surfaces." },
  { name: "Docker", category: "Cloud & DevOps", icon: SiDocker, color: "#2496ED", description: "Portable environments and cleaner deployment handoff." },
  { name: "Kubernetes", category: "Cloud & DevOps", icon: SiKubernetes, color: "#326CE5", description: "Container orchestration for scale-ready systems." },
  { name: "Vercel", category: "Cloud & DevOps", icon: SiVercel, color: "#000000", description: "Frontend hosting, previews, and rapid delivery." },
  { name: "Google Cloud", category: "Cloud & DevOps", icon: SiGooglecloud, color: "#4285F4", description: "Cloud infrastructure, storage, compute, and data." },
  { name: "AWS", category: "Cloud & DevOps", color: "#FF9900", description: "Cloud hosting, serverless, storage, and infrastructure.", badge: "AWS" },
  { name: "GitHub Actions", category: "Cloud & DevOps", icon: SiGithubactions, color: "#A3BFFA", description: "CI/CD pipelines and quality gates." },

  { name: "OpenAI", category: "AI", color: "#ffffff", description: "AI copilots, workflow agents, and intelligent automation.", badge: "AI" },
  { name: "Claude", category: "AI", icon: SiAnthropic, color: "#D97757", description: "Research, content, operations, and agent workflows." },
  { name: "LangChain", category: "AI", icon: SiLangchain, color: "#2DD4BF", description: "AI apps connected to tools, data, and workflows." },
  { name: "Figma", category: "AI", icon: SiFigma, color: "#F24E1E", description: "Design systems, prototypes, and product UI collaboration." },
  // added: in-demand stacks
  { name: "Angular", category: "Frontend", icon: SiAngular, color: "#DD0031", description: "Enterprise web apps with a full framework." },
  { name: "Svelte", category: "Frontend", icon: SiSvelte, color: "#FF3E00", description: "Lean, fast interfaces with little runtime." },
  { name: "Astro", category: "Frontend", icon: SiAstro, color: "#BC52EE", description: "Content-first sites that ship almost no JavaScript." },
  { name: "Nuxt", category: "Frontend", icon: SiNuxt, color: "#00DC82", description: "Vue apps with server rendering and SEO." },

  { name: "Java", category: "Backend", icon: FaJava, color: "#E76F00", description: "Enterprise systems and high-load services." },
  { name: "Spring Boot", category: "Backend", icon: SiSpringboot, color: "#6DB33F", description: "Production-ready Java services and APIs." },
  { name: "C#", category: "Backend", icon: TbBrandCSharp, color: "#68217A", description: "Business applications on the Microsoft stack." },
  { name: "ASP.NET", category: "Backend", icon: SiDotnet, color: "#512BD4", description: "Secure web apps and APIs on .NET." },
  { name: "NestJS", category: "Backend", icon: SiNestjs, color: "#E0234E", description: "Structured, scalable Node.js backends." },
  { name: "FastAPI", category: "Backend", icon: SiFastapi, color: "#009688", description: "Fast Python APIs, ideal for AI services." },

  { name: "Expo", category: "Mobile", icon: SiExpo, color: "#000020", description: "Faster React Native builds and releases." },

  { name: "Magento", category: "Commerce", icon: FaMagento, color: "#EE672F", description: "Large catalogs and B2B commerce." },
  { name: "BigCommerce", category: "Commerce", icon: SiBigcommerce, color: "#121118", description: "SaaS commerce for growing brands." },

  { name: "Oracle", category: "Data", color: "#F80000", description: "Enterprise databases at scale.", badge: "ORCL" },
  { name: "SQL Server", category: "Data", icon: DiMsqlServer, color: "#CC2927", description: "Microsoft databases for business systems." },
  { name: "Firebase", category: "Data", icon: SiFirebase, color: "#FFCA28", description: "Realtime data, auth and hosting for apps." },
  { name: "Elasticsearch", category: "Data", icon: SiElasticsearch, color: "#00BFB3", description: "Search and analytics over large data." },

  { name: "Azure", category: "Cloud & DevOps", icon: TbBrandAzure, color: "#0078D4", description: "Microsoft cloud for enterprise workloads." },
  { name: "Cloudflare", category: "Cloud & DevOps", icon: SiCloudflare, color: "#F38020", description: "Edge network, security and serverless." },
  { name: "Terraform", category: "Cloud & DevOps", icon: SiTerraform, color: "#7B42BC", description: "Infrastructure as code, repeatable environments." },

  { name: "Gemini", category: "AI", icon: SiGooglegemini, color: "#8E75B2", description: "Multimodal AI from Google." },
  { name: "Hugging Face", category: "AI", icon: SiHuggingface, color: "#FFB000", description: "Open models and AI tooling." },
  { name: "PyTorch", category: "AI", icon: SiPytorch, color: "#EE4C2C", description: "Training and serving custom models." },
  { name: "TensorFlow", category: "AI", icon: SiTensorflow, color: "#FF6F00", description: "Production machine learning." },
];

const GROUPS = CATEGORIES.filter((c): c is Exclude<Category, "All"> => c !== "All");
const GROUP_LABEL: Record<Exclude<Category, "All">, string> = {
  Frontend: "Frontend",
  Backend: "Backend",
  Mobile: "Mobile",
  Commerce: "Commerce",
  Data: "Data",
  "Cloud & DevOps": "Cloud & DevOps",
  AI: "AI & Design",
};
const ORDERED = GROUPS.flatMap((g) => TECH_STACK.filter((t) => t.category === g));
const N = ORDERED.length;

/** deterministic pseudo-random, so the scatter is the same on every load */
function rand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}
/** where each chip lands in phase 1 (fractions of the scatter area) and when */
/** appear order only; positions are packed at runtime from real chip sizes */
const SCATTER = ORDERED.map((_, i) => ({ order: rand(i + 301) }));
const APPEAR_ORDER = SCATTER.map((s, i) => ({ i, o: s.order }))
  .sort((a, b) => a.o - b.o)
  .reduce<number[]>((acc, { i }, rank) => ((acc[i] = rank), acc), []);

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function Chip({ t }: { t: Tech }) {
  const Icon = t.icon;
  return (
    <span className="inline-flex h-[30px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[9px] border border-[#0b0f19]/[0.08] bg-white px-2.5 font-urbanist text-[12.5px] font-semibold text-ink shadow-[0_1px_2px_rgba(11,15,25,0.05)]">
      {Icon ? <Icon size={14} color={t.color} /> : <span className="text-[10px] font-bold" style={{ color: t.color === "#ffffff" ? "#0b0f19" : `color-mix(in srgb, ${t.color} 62%, #000)` }}>{t.badge}</span>}
      {t.name}
    </span>
  );
}

export default function TechStack() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const slotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [animated, setAnimated] = useState(false);

  // pinned scroll story on large screens only, never under reduced motion
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (min-height: 860px) and (prefers-reduced-motion: no-preference)");
    const sync = () => setAnimated(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!animated) return;
    const track = trackRef.current;
    const stage = stageRef.current;
    const field = fieldRef.current;
    if (!track || !stage || !field) return;

    let slots: { x: number; y: number }[] = [];
    let start: { x: number; y: number }[] = [];
    let bounds = { x0: 0, y0: 0, x1: 0, y1: 0 };
    const sizes: { w: number; h: number }[] = ORDERED.map(() => ({ w: 0, h: 0 }));
    // free-floating physics before the chips are grouped: offset + velocity per chip
    const off = ORDERED.map(() => ({ x: 0, y: 0 }));
    const vel = ORDERED.map(() => ({ x: 0, y: 0 }));
    const free = ORDERED.map(() => true);
    let drag: { i: number; px: number; py: number; t: number; vx: number; vy: number } | null = null;

    let stickyTop = 0;
    let stageH = 0;
    const measure = () => {
      // the stage is only as tall as its content; centre it while pinned
      stageH = stage.offsetHeight;
      stickyTop = Math.max(0, (window.innerHeight - stageH) / 2);
      stage.style.top = `${stickyTop}px`;
      const s = stage.getBoundingClientRect();
      const f = field.getBoundingClientRect();
      slots = slotRefs.current.map((el) => {
        const r = el!.getBoundingClientRect();
        return { x: r.left - s.left, y: r.top - s.top };
      });
      chipRefs.current.forEach((el, i) => {
        if (el) sizes[i] = { w: el.offsetWidth, h: el.offsetHeight };
      });
      bounds = { x0: f.left - s.left, y0: f.top - s.top, x1: f.right - s.left, y1: f.bottom - s.top };
      // pack: each chip tries seeded random spots and keeps the first that
      // overlaps nothing (10px breathing room), else the least-overlapping one
      const placed: { x: number; y: number; w: number; h: number }[] = [];
      const fx = f.left - s.left;
      const fy = f.top - s.top;
      start = ORDERED.map((_, i) => {
        const { w, h } = sizes[i];
        let best = { x: fx, y: fy };
        let bestScore = Infinity;
        for (let k = 0; k < 120 && bestScore > 0; k++) {
          const x = fx + rand(i * 131 + k * 7 + 1) * Math.max(0, f.width - w);
          const y = fy + rand(i * 197 + k * 11 + 5) * Math.max(0, f.height - h);
          let score = 0;
          for (const q of placed) {
            const ox = Math.min(x + w, q.x + q.w) - Math.max(x, q.x) + 10;
            const oy = Math.min(y + h, q.y + q.h) - Math.max(y, q.y) + 10;
            if (ox > 0 && oy > 0) score += ox * oy;
          }
          if (score < bestScore) {
            bestScore = score;
            best = { x, y };
          }
        }
        placed.push({ ...best, w, h });
        return best;
      });
    };

    let raf = 0;
    let last = performance.now();
    let visible = false;
    let ps = -1;
    const frame = (now: number) => {
      raf = 0;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = now / 1000;
      const r = track.getBoundingClientRect();
      const target = clamp((stickyTop - r.top) / (r.height - stageH));
      // smoothed progress: glides toward the scroll position instead of jumping with it
      ps = ps < 0 ? target : ps + (target - ps) * (1 - Math.pow(0.002, dt));
      const p = ps;

      // chip-to-chip collisions while scattered: overlapping boxes are pushed
      // apart and, when approaching, trade momentum (restitution 0.8). A held
      // chip acts as an immovable pusher.
      for (let i = 0; i < N; i++) {
        if (!free[i] || !start[i]) continue;
        for (let j = i + 1; j < N; j++) {
          if (!free[j] || !start[j]) continue;
          const ax = start[i].x + off[i].x;
          const ay = start[i].y + off[i].y;
          const bx = start[j].x + off[j].x;
          const by = start[j].y + off[j].y;
          const ox = Math.min(ax + sizes[i].w, bx + sizes[j].w) - Math.max(ax, bx) + 2;
          const oy = Math.min(ay + sizes[i].h, by + sizes[j].h) - Math.max(ay, by) + 2;
          if (ox <= 0 || oy <= 0) continue;
          const di = drag?.i === i;
          const dj = drag?.i === j;
          const wi = di ? 0 : dj ? 1 : 0.5;
          const wj = dj ? 0 : di ? 1 : 0.5;
          const axis = ox < oy ? "x" : "y";
          const pen = axis === "x" ? ox : oy;
          const dir = (axis === "x" ? ax + sizes[i].w / 2 < bx + sizes[j].w / 2 : ay + sizes[i].h / 2 < by + sizes[j].h / 2) ? -1 : 1;
          off[i][axis] += dir * pen * wi;
          off[j][axis] -= dir * pen * wj;
          const dv = axis === "x" ? (drag ? drag.vx : 0) : drag ? drag.vy : 0;
          const vi = di ? dv : vel[i][axis];
          const vj = dj ? dv : vel[j][axis];
          if ((vi - vj) * -dir <= 0) continue; // already separating
          if (di) vel[j][axis] = vi * 1.1;
          else if (dj) vel[i][axis] = vj * 1.1;
          else {
            const m = (vi + vj) / 2;
            const h = ((vi - vj) / 2) * 0.8;
            vel[i][axis] = m - h;
            vel[j][axis] = m + h;
          }
        }
      }

      ORDERED.forEach((_, i) => {
        const el = chipRefs.current[i];
        if (!el || !slots[i]) return;
        const rank = APPEAR_ORDER[i];
        const a = ease(clamp((p - (0.02 + (rank / N) * 0.36)) / 0.09)); // phase 1: appear (long, gentle)
        const g = ease(clamp((p - (0.5 + (i / N) * 0.14)) / 0.2)); // phase 2: gather
        free[i] = g < 0.01 && a > 0.9;

        // throw physics: glide with friction, bounce softly off the field edges
        if (drag?.i !== i) {
          off[i].x += vel[i].x * dt;
          off[i].y += vel[i].y * dt;
          const k = Math.pow(0.06, dt); // friction: ~94% of speed lost per second
          vel[i].x *= k;
          vel[i].y *= k;
          const bx = start[i].x + off[i].x;
          const by = start[i].y + off[i].y;
          const maxX = bounds.x1 - sizes[i].w;
          const maxY = bounds.y1 - sizes[i].h;
          if (bx < bounds.x0 || bx > maxX) {
            off[i].x = Math.min(maxX, Math.max(bounds.x0, bx)) - start[i].x;
            vel[i].x *= -0.55;
          }
          if (by < bounds.y0 || by > maxY) {
            off[i].y = Math.min(maxY, Math.max(bounds.y0, by)) - start[i].y;
            vel[i].y *= -0.55;
          }
        }

        // slow idle drift, fading out as the chip is gathered
        const drift = 1 - g;
        const dx = Math.sin(t * 0.32 + i * 1.7) * 9 * drift;
        const dy = Math.cos(t * 0.27 + i * 2.3) * 7 * drift;
        const bx = start[i].x + off[i].x + dx;
        const by = start[i].y + off[i].y + dy + (1 - a) * 18;
        const x = bx + (slots[i].x - bx) * g;
        const y = by + (slots[i].y - by) * g;
        const tilt = Math.max(-10, Math.min(10, vel[i].x * 0.012)) * drift;
        const lift = drag?.i === i ? 1.06 : 1;
        el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${tilt}deg) scale(${(0.92 + 0.08 * a) * lift})`;
        el.style.opacity = String(a);
        el.style.pointerEvents = free[i] ? "auto" : "none";
        el.style.cursor = drag?.i === i ? "grabbing" : "grab";
        el.style.zIndex = drag?.i === i ? "5" : "";
      });

      const c = ease(clamp((p - 0.52) / 0.2));
      cardRefs.current.forEach((card, k) => {
        if (!card) return;
        card.style.opacity = String(ease(clamp((p - (0.5 + k * 0.03)) / 0.18)));
      });
      field.style.opacity = String(1 - c);

      if (visible) raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    // drag + throw
    const onDown = (e: PointerEvent) => {
      const i = chipRefs.current.findIndex((el) => el === e.currentTarget);
      if (i < 0 || !free[i]) return;
      e.preventDefault();
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      vel[i] = { x: 0, y: 0 };
      drag = { i, px: e.clientX, py: e.clientY, t: performance.now(), vx: 0, vy: 0 };
    };
    const onMove = (e: PointerEvent) => {
      if (!drag) return;
      const now = performance.now();
      const dx = e.clientX - drag.px;
      const dy = e.clientY - drag.py;
      const dtm = Math.max(1, now - drag.t) / 1000;
      off[drag.i].x += dx;
      off[drag.i].y += dy;
      // smoothed release velocity (px/s)
      drag.vx = drag.vx * 0.6 + (dx / dtm) * 0.4;
      drag.vy = drag.vy * 0.6 + (dy / dtm) * 0.4;
      drag.px = e.clientX;
      drag.py = e.clientY;
      drag.t = now;
    };
    const onUp = () => {
      if (!drag) return;
      const cap = 2400;
      vel[drag.i] = { x: Math.max(-cap, Math.min(cap, drag.vx)), y: Math.max(-cap, Math.min(cap, drag.vy)) };
      drag = null;
    };
    const chips = chipRefs.current.filter(Boolean) as HTMLElement[];
    chips.forEach((el) => el.addEventListener("pointerdown", onDown));
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    // run the loop only while the section is on screen
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) kick();
    });
    io.observe(track);
    const onScroll = () => kick();
    const onResize = () => {
      measure();
      kick();
    };
    measure();
    frame(performance.now());
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      chips.forEach((el) => el.removeEventListener("pointerdown", onDown));
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [animated]);

  const cards = (
    <div className="w-full">
      {GROUPS.map((g, k) => {
        const items = TECH_STACK.filter((t) => t.category === g);
        return (
          <div
            key={g}
            ref={(el) => {
              cardRefs.current[k] = el;
            }}
            className="grid gap-3 border-t border-[#0b0f19]/[0.08] py-2.5 last:border-b sm:grid-cols-[170px_minmax(0,1fr)] sm:items-center sm:gap-6"
            style={animated ? { opacity: 0 } : undefined}
          >
            <div className="flex items-baseline gap-2.5">
              <span className="font-urbanist text-[11px] font-medium tabular-nums text-ink-faint">{String(k + 1).padStart(2, "0")}</span>
              <h3 className="font-urbanist text-[15px] font-semibold tracking-[-0.01em] text-ink">{GROUP_LABEL[g]}</h3>
            </div>
            <ul className="flex flex-wrap gap-1.5">
              {items.map((t) => {
                const i = ORDERED.indexOf(t);
                return (
                  <li key={t.name}>
                    <span
                      ref={(el) => {
                        slotRefs.current[i] = el;
                      }}
                      className="block"
                      style={animated ? { visibility: "hidden" } : undefined}
                    >
                      <Chip t={t} />
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="bg-light-surface p-3 sm:p-4">
      <section className="theme-light relative overflow-clip rounded-[32px] bg-canvas" aria-labelledby="tech-stack-heading">
        <div ref={trackRef} className={animated ? "relative h-[300vh]" : "relative"}>
          <div ref={stageRef} className={animated ? "sticky top-0 flex flex-col overflow-hidden" : "relative py-16 lg:py-24"}>
            {/* faint grid, like a canvas the tools land on */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(11,15,25,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(11,15,25,0.04)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(80%_70%_at_50%_55%,black,transparent)]"
            />

            <div className={`relative mx-auto flex w-full max-w-7xl flex-col px-4 sm:px-6 lg:px-10 ${animated ? "py-24" : ""}`}>
              <Reveal>
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <SectionEyebrow>Tools &amp; technology</SectionEyebrow>
                    <SectionTitle id="tech-stack-heading" className="max-w-[16ch] text-balance">
                      Many tools. One working system.
                    </SectionTitle>
                  </div>
                </div>
              </Reveal>

              <div className="relative mt-10 lg:mt-14">
                {/* phase 1 scatter area: the space the list will occupy */}
                {animated && <div ref={fieldRef} aria-hidden className="pointer-events-none absolute -inset-y-6 inset-x-0" />}
                {cards}
              </div>

            </div>


            {/* floating chips: scattered first, then flown into their cards */}
            {animated && (
              <div aria-hidden className="pointer-events-none absolute inset-0">
                {ORDERED.map((t, i) => (
                  <span
                    key={t.name}
                    ref={(el) => {
                      chipRefs.current[i] = el;
                    }}
                    className="absolute left-0 top-0 touch-none select-none will-change-transform"
                    style={{ opacity: 0 }}
                  >
                    <Chip t={t} />
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
