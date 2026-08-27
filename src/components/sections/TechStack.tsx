"use client";

import { useMemo, useState, type ComponentType, type CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
} from "react-icons/si";
import Reveal from "@/components/system/Reveal";
import { SectionEyebrow, SectionTitle, SectionDescription } from "@/components/system/SectionHeading";

/**
 * Tech Stack — reworked per direct feedback on the first pass: the section
 * uses the same "floating rounded card" frame as Testimonials/CaseStudies
 * (`bg-light-surface p-3 sm:p-4` outer margin + `rounded-[32px]` inner
 * section). That replaces the previous flush-dark `bg-canvas` section and
 * the redundant second bordered panel nested inside it.
 *
 * Tiles dropped their inline description entirely (icon + name only,
 * in a small square) — closer to hyperline.co's own dense icon grid and
 * the actual mechanism that makes this "compact": a tile with no body
 * copy can be roughly a third the size, so far more fit per row without
 * the grid needing more height. The description now only shows in a
 * hover reveal *inside* the same tile (an absolutely-positioned overlay,
 * so it can't affect the grid's row height), and hovering one tile dims
 * the rest via a `:has()` rule in globals.css — the same spotlight
 * behavior visible in the hyperline.co reference when hovering "Mollie".
 *
 * Round 2, direct feedback: the section was kept dark inside on purpose
 * (see above) but that dark tone itself was rejected — converted to
 * `theme-light` like every other section, which meant recoloring
 * everything that assumed a near-black backdrop rather than just the
 * outer background: the grid-line texture (white lines → dark), the
 * category pills' hover state (`bg-white/[0.06]` → a dark-tinted
 * equivalent), each tile's resting border/fill (`border-white/[0.07]
 * bg-white/[0.035]` → `border-hairline bg-[#fafafa]`, matching every
 * other card sitewide), the icon chip (flat `bg-black/25` → the shared
 * `.mega-icon-tile` class already used elsewhere instead of a one-off
 * value), and the bottom CTA's hover color (`bg-aurora-amber`, a
 * decorative-only token not meant for text-bearing backgrounds →
 * `aurora-violet-dark`, the same hover every other CTA on the site
 * uses). The per-tile hover-reveal face keeps its own dark gradient
 * overlay + white text on purpose — it's a self-contained popover, not
 * part of the section's base surface, the same way Testimonials' video
 * cards keep a dark overlay on an otherwise light card.
 *
 * Two TECH_STACK entries (Next.js, Vercel) had `color: "#ffffff"` — a
 * deliberate choice for their monochrome logomarks on the old dark
 * tile, invisible against the new light one. Switched both to
 * `#000000`, equally on-brand for either logo and now visible on the
 * light tile background. OpenAI's `#ffffff` was left alone — it has no
 * icon (badge-text fallback only), and that fallback's own text color
 * was already switched to `text-ink` above.
 */
type Category = "All" | "Frontend" | "Backend" | "Mobile" | "Commerce" | "Cloud & Data" | "AI";

type Tech = {
  name: string;
  category: Exclude<Category, "All">;
  icon?: ComponentType<{ size?: number; color?: string; className?: string }>;
  color: string;
  description: string;
  badge?: string;
};

const CATEGORIES: Category[] = ["All", "Frontend", "Backend", "Mobile", "Commerce", "Cloud & Data", "AI"];

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

  { name: "PostgreSQL", category: "Cloud & Data", icon: SiPostgresql, color: "#4169E1", description: "Reliable relational data for serious products." },
  { name: "MongoDB", category: "Cloud & Data", icon: SiMongodb, color: "#47A248", description: "Document data for flexible app models." },
  { name: "MySQL", category: "Cloud & Data", icon: SiMysql, color: "#4479A1", description: "Battle-tested databases for web platforms." },
  { name: "Redis", category: "Cloud & Data", icon: SiRedis, color: "#FF4438", description: "Caching, queues, realtime speed, and sessions." },
  { name: "Supabase", category: "Cloud & Data", icon: SiSupabase, color: "#3ECF8E", description: "Fast product backends, auth, and Postgres tooling." },
  { name: "Prisma", category: "Cloud & Data", icon: SiPrisma, color: "#9FB7C7", description: "Typed data access for modern TypeScript apps." },
  { name: "GraphQL", category: "Cloud & Data", icon: SiGraphql, color: "#E10098", description: "Flexible APIs for connected product surfaces." },
  { name: "Docker", category: "Cloud & Data", icon: SiDocker, color: "#2496ED", description: "Portable environments and cleaner deployment handoff." },
  { name: "Kubernetes", category: "Cloud & Data", icon: SiKubernetes, color: "#326CE5", description: "Container orchestration for scale-ready systems." },
  { name: "Vercel", category: "Cloud & Data", icon: SiVercel, color: "#000000", description: "Frontend hosting, previews, and rapid delivery." },
  { name: "Google Cloud", category: "Cloud & Data", icon: SiGooglecloud, color: "#4285F4", description: "Cloud infrastructure, storage, compute, and data." },
  { name: "AWS", category: "Cloud & Data", color: "#FF9900", description: "Cloud hosting, serverless, storage, and infrastructure.", badge: "AWS" },
  { name: "GitHub Actions", category: "Cloud & Data", icon: SiGithubactions, color: "#A3BFFA", description: "CI/CD pipelines and quality gates." },

  { name: "OpenAI", category: "AI", color: "#ffffff", description: "AI copilots, workflow agents, and intelligent automation.", badge: "AI" },
  { name: "Claude", category: "AI", icon: SiAnthropic, color: "#D97757", description: "Research, content, operations, and agent workflows." },
  { name: "LangChain", category: "AI", icon: SiLangchain, color: "#2DD4BF", description: "AI apps connected to tools, data, and workflows." },
  { name: "Figma", category: "AI", icon: SiFigma, color: "#F24E1E", description: "Design systems, prototypes, and product UI collaboration." },
];

export default function TechStack() {
  const [category, setCategory] = useState<Category>("All");
  const visibleTech = useMemo(
    () => (category === "All" ? TECH_STACK : TECH_STACK.filter((tech) => tech.category === category)),
    [category]
  );

  return (
    <div className="bg-light-surface p-3 sm:p-4">
      <section className="theme-light relative overflow-hidden rounded-[32px] bg-canvas py-14 lg:py-16" aria-labelledby="tech-stack-heading">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(11,15,25,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(11,15,25,0.035)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <SectionEyebrow>Tech Stack</SectionEyebrow>
                <SectionTitle id="tech-stack-heading" className="max-w-xs">
                  Modern tools, AI-ready delivery.
                </SectionTitle>
                <SectionDescription className="mt-2.5 max-w-lg">
                  We pick proven technology for the job, then connect it with AI-assisted workflows where it improves speed, clarity, or operations.
                </SectionDescription>
              </div>

              <div className="no-scrollbar flex max-w-full shrink-0 gap-1 overflow-x-auto rounded-full border border-hairline bg-canvas-raised/80 p-1">
                {CATEGORIES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={category === item}
                    onClick={() => setCategory(item)}
                    className={`shrink-0 rounded-full px-3.5 py-2 font-urbanist text-[12px] font-semibold transition-colors duration-200 ${
                      category === item ? "bg-ink text-canvas" : "text-ink-dim hover:bg-black/[0.04] hover:text-ink"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="tech-board relative mt-7 grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-9">
              {visibleTech.map((tech, i) => {
                const Icon = tech.icon;
                return (
                  <div
                    key={`${category}-${tech.name}`}
                    className="tech-tile group relative h-[84px] overflow-hidden rounded-2xl border border-hairline bg-[#fafafa] transition-[filter,border-color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-ink/15 hover:bg-canvas sm:h-[92px]"
                    style={{ "--tile-color": tech.color, animationDelay: `${(i % 18) * 22}ms` } as CSSProperties}
                  >
                    {/* resting face: icon + name */}
                    <div className="flex h-full flex-col items-center justify-center gap-2 p-2 text-center transition-opacity duration-200 group-hover:opacity-0">
                      <span className="mega-icon-tile flex h-8 w-8 items-center justify-center rounded-lg sm:h-9 sm:w-9">
                        {Icon ? (
                          <Icon size={18} color={tech.color} aria-hidden />
                        ) : (
                          <span className="font-urbanist text-[9px] font-bold text-ink">{tech.badge}</span>
                        )}
                      </span>
                      <span className="font-urbanist text-[10.5px] font-semibold leading-tight text-ink/85">{tech.name}</span>
                    </div>

                    {/* hover face: name + description + category, no layout impact (absolute) */}
                    <div
                      aria-hidden
                      className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-2.5 text-center opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                      style={{ background: `linear-gradient(165deg, ${tech.color}26, rgba(10,10,15,0.94) 65%)` }}
                    >
                      <span className="font-urbanist text-[11px] font-bold text-white">{tech.name}</span>
                      <span className="line-clamp-2 font-urbanist text-[9px] leading-snug text-white/70">{tech.description}</span>
                      <span className="mt-0.5 rounded-full border border-white/15 px-1.5 py-0.5 font-urbanist text-[8px] text-white/60">
                        {tech.category === "Cloud & Data" ? "Infra" : tech.category}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="mt-8 flex flex-col gap-4 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-2xl font-urbanist text-[13px] leading-relaxed text-ink-dim">
                Frontend, backend, mobile, commerce, cloud, data, and AI automation stay under one delivery rhythm, so the stack feels coherent when your team takes over.
              </p>
              <Link
                href="/services"
                className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-aurora-violet px-6 py-3 font-urbanist text-sm font-semibold text-canvas transition-[background-color,transform] duration-300 hover:scale-[1.02] hover:bg-aurora-violet-dark"
              >
                Match tech to service
                <ArrowRight size={15} strokeWidth={1.75} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
