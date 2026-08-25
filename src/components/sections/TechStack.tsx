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
  { name: "Next.js", category: "Frontend", icon: SiNextdotjs, color: "#ffffff", description: "Fast websites, app routers, SEO, and hybrid rendering." },
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
  { name: "Vercel", category: "Cloud & Data", icon: SiVercel, color: "#ffffff", description: "Frontend hosting, previews, and rapid delivery." },
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
    <section className="relative overflow-hidden bg-canvas py-16 lg:py-24" aria-labelledby="tech-stack-heading">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 inline-flex items-center gap-2.5 font-urbanist text-[11px] font-medium uppercase tracking-[0.28em] text-ink-dim">
              <span className="h-1.5 w-1.5 rounded-full bg-aurora-amber" />
              Tech Stack
            </p>
            <h2 id="tech-stack-heading" className="font-urbanist text-4xl font-bold leading-tight text-ink sm:text-5xl">
              Modern tools, AI-ready delivery.
            </h2>
            <p className="mt-4 font-urbanist text-base leading-relaxed text-ink-dim">
              We pick proven technology for the job, then connect it with AI-assisted workflows where it improves speed, clarity, support, or operations.
            </p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-8 flex justify-center">
            <div className="no-scrollbar flex max-w-full gap-1 overflow-x-auto rounded-full border border-hairline bg-canvas-raised/80 p-1">
              {CATEGORIES.map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-pressed={category === item}
                  onClick={() => setCategory(item)}
                  className={`shrink-0 rounded-full px-4 py-2 font-urbanist text-[12.5px] font-semibold transition-colors duration-200 ${
                    category === item ? "bg-ink text-canvas" : "text-ink-dim hover:bg-white/[0.06] hover:text-ink"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={180}>
          <div className="relative mx-auto mt-10 max-w-6xl overflow-hidden rounded-[32px] border border-hairline-strong bg-canvas-raised/80 p-2 shadow-[0_30px_90px_rgba(0,0,0,0.28)]">
            <div className="tech-scan pointer-events-none absolute inset-x-2 top-2 h-24 rounded-[26px] opacity-70" />
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {visibleTech.map((tech, i) => {
                const Icon = tech.icon;
                return (
                  <div
                    key={`${category}-${tech.name}`}
                    className="tech-tile group relative min-h-[126px] overflow-hidden rounded-[24px] border border-white/[0.06] bg-white/[0.035] p-4 transition-[border-color,background-color,transform] duration-300 hover:-translate-y-1 hover:border-white/18 hover:bg-white/[0.07]"
                    style={{ "--tile-color": tech.color, animationDelay: `${(i % 12) * 28}ms` } as CSSProperties}
                  >
                    <div className="flex h-full flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                          {Icon ? (
                            <Icon size={26} color={tech.color} aria-hidden />
                          ) : (
                            <span className="font-urbanist text-[13px] font-bold text-white">{tech.badge}</span>
                          )}
                        </span>
                        <span className="rounded-full border border-white/10 px-2 py-1 font-urbanist text-[10px] text-white/45">
                          {tech.category === "Cloud & Data" ? "Infra" : tech.category}
                        </span>
                      </div>
                      <div className="mt-auto pt-5">
                        <h3 className="font-urbanist text-[15px] font-bold text-ink">{tech.name}</h3>
                        <p className="mt-1 line-clamp-2 font-urbanist text-[11.5px] leading-snug text-ink-dim">
                          {tech.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>

        <Reveal delay={240}>
          <div className="mx-auto mt-8 flex max-w-6xl flex-col gap-4 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl font-urbanist text-sm leading-relaxed text-ink-dim">
              Frontend, backend, mobile, commerce, cloud, data, and AI automation stay under one delivery rhythm, so the stack feels coherent when your team takes over.
            </p>
            <Link
              href="/services"
              className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-aurora-violet px-6 py-3 font-urbanist text-sm font-semibold text-canvas transition-[background-color,transform] duration-300 hover:scale-[1.02] hover:bg-aurora-amber"
            >
              Match tech to service
              <ArrowRight size={15} strokeWidth={1.75} />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
