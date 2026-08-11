# Mega Menu + Nav Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace v3's click-through Services mega menu and Industries compact dropdown with the two always-visible 3-column mega menus from the `codeshaper-website-v2-main` reference, restructure the nav bar order, and update Insights/Company/mobile menus to match.

**Architecture:** New shared data in `navigation.ts` (engagement models, service tags, industries, chips, featured cards) feeds a new shared `EngageCard` component and two mega-panel components (`MegaPanel` rebuilt, `IndustriesMegaPanel` new), both rendered through the existing Radix `Nav.Viewport`. `Navbar.tsx` gains a new item order and promotes Industries from a compact dropdown to a mega. `MobileMenu.tsx`'s accordion is restructured to mirror the new content grouping.

**Tech Stack:** Next.js 15 (App Router) + TypeScript + Tailwind v4, Radix UI `NavigationMenu` + `Accordion`, Lucide icons — all unchanged from the existing stack, no new dependencies.

## Global Constraints

- Every route added in this round (`/engagement/*`, `/industries/luxury`, `/industries/restaurant-food`, new `/insights/*`, new `/company/*`) is a nav-only placeholder link, consistent with how every other service/industry link already on the site works — do not create page files for them.
- All new/changed UI lives inside the existing `.theme-light` scope (the whole `<Navbar>` already carries that class) — do not touch `:root`'s dark tokens or any section below the hero.
- **Text-safe color rule (binding on every new usage, learned the hard way in the previous round's final review):** the base `--color-aurora-indigo` (`#667EEA`) and `--color-aurora-amber` (`#14B8A6`, teal) tokens are 3:1-class only — correct for icons, borders, decorative fills, and large text (≥24px, or ≥18.66px bold), but they fail the 4.5:1 minimum for normal text on white. Any new **text** (not icon glyphs, not borders/backgrounds) rendered in an indigo tone must use `--color-aurora-violet` (`#44549B`, 7.03:1) instead; any new **text** in a teal tone must use `--color-aurora-amber-dark` (`#0f766e`, 5.47:1). This applies to default *and* hover text-color states alike. Every step below already applies this rule — if you add anything not explicitly specified, apply it there too.
- `prefers-reduced-motion` handling carries over: every new hover/transition effect this round adds (row hover, icon-tile lift, chip color, feature-card lift) must be inert under `prefers-reduced-motion: reduce`, matching the pattern already used elsewhere in `globals.css`.
- Mega menus and compact dropdowns already fully hide below the `lg` (1024px) breakpoint in favor of `MobileMenu` via the existing `hidden lg:block` wrapper in `Navbar.tsx` — no new responsive breakpoint logic is needed; just make sure the new Industries mega menu lives inside that same wrapper.
- Keep the existing `SERVICE_COLUMNS` numbered order (`design` 01 → `ai` 05) in the Services mega menu's Core Services list — do not reorder to match the reference's AI-first presentation order; the rest of the site (Service Pillars section) already uses this numbering.

---

### Task 1: `navigation.ts` data layer + `icons.tsx` registrations

**Files:**
- Modify: `src/lib/navigation.ts` (full-file replacement — see below)
- Modify: `src/lib/icons.tsx`

**Interfaces:**
- Produces: `ENGAGEMENT_MODELS: EngagementModel[]`, `SERVICE_COLUMNS` (existing type gains a `tags: string` field, values added to all 5 entries), `INDUSTRIES: IndustryLink[]`, `SERVICES_QUICK_ACCESS`, `INDUSTRIES_POPULAR`, `SERVICES_FEATURED`, `INDUSTRIES_FEATURED`, `SIMPLE_MENUS` (now exactly `[insights, company]`, each entry gains an optional `dividerAfterIndex?: number`). All consumed by Tasks 3–7.

- [ ] **Step 1: Replace `src/lib/navigation.ts` in full**

```ts
export type ServiceLink = {
  label: string;
  href: string;
  /** Lucide icon key (see lib/icons.tsx) */
  icon: string;
  /** 3–5 word clarifier shown under the label in the mega menu */
  desc: string;
};

export type ServiceColumn = {
  id: string;
  blurb: string;
  number: string;
  title: string;
  href: string;
  flagship?: boolean;
  /** Comma/dot-joined one-line summary shown in the Services mega menu's Core Services list */
  tags: string;
  links: ServiceLink[];
};

export const SERVICE_COLUMNS: ServiceColumn[] = [
  {
    id: "design",
    blurb: "UX/UI, product strategy, and design systems built for real shipping.",
    number: "01",
    title: "Experience & Product Design",
    href: "/services/design",
    tags: "Discovery · UX/UI · AI UX · systems · audits · handoff",
    links: [
      { label: "UX/UI Design & Prototyping", href: "/services/design/ux-ui", icon: "layout-dashboard", desc: "Flows, screens, clickable prototypes" },
      { label: "Product Discovery & Strategy", href: "/services/design/discovery", icon: "compass", desc: "Scope, roadmap, success metrics" },
      { label: "Design Systems", href: "/services/design/design-systems", icon: "component", desc: "Reusable, documented components" },
      { label: "Conversion Rate Optimization", href: "/services/design/cro", icon: "trending-up", desc: "Test, measure, lift conversion" },
    ],
  },
  {
    id: "engineering",
    blurb: "Scalable engineering for web, mobile, SaaS, and business platforms.",
    number: "02",
    title: "Product Engineering",
    href: "/services/engineering",
    tags: "Web apps · mobile · SaaS · MVP · portals · APIs · modernization",
    links: [
      { label: "Web Application", href: "/services/engineering/web", icon: "monitor", desc: "Dashboards and customer portals" },
      { label: "Mobile Application", href: "/services/engineering/mobile", icon: "smartphone", desc: "iOS, Android, cross-platform" },
      { label: "SaaS Development", href: "/services/engineering/saas", icon: "layers", desc: "Multi-tenant, billing, roles" },
      { label: "Business Applications & Portals", href: "/services/engineering/business-apps", icon: "building-2", desc: "Internal tools that fit ops" },
      { label: "Rebuild & Modernization", href: "/services/engineering/modernization", icon: "refresh-cw", desc: "Legacy to a modern stack" },
      { label: "APIs & Integrations", href: "/services/engineering/apis", icon: "plug", desc: "Connect the systems you run" },
    ],
  },
  {
    id: "websites",
    blurb: "High-performance marketing sites that rank, load fast, and convert.",
    number: "03",
    title: "Websites & Growth",
    href: "/services/websites",
    tags: "Premium sites · WordPress · landing pages · SEO · care",
    links: [
      { label: "Marketing Websites", href: "/services/websites/marketing", icon: "globe", desc: "Fast, rankable, on-brand" },
      { label: "Landing Pages", href: "/services/websites/landing-pages", icon: "file-text", desc: "Campaign-ready, built to test" },
      { label: "Redesign & Replatforming", href: "/services/websites/replatforming", icon: "wand-2", desc: "Move platforms without downtime" },
      { label: "Care & Maintenance", href: "/services/websites/care", icon: "life-buoy", desc: "Updates, monitoring, support" },
    ],
  },
  {
    id: "commerce",
    blurb: "Shopify, WooCommerce, and custom commerce focused on conversion + operations.",
    number: "04",
    title: "Commerce Experiences",
    href: "/services/commerce",
    tags: "Shopify · Woo · headless · marketplace · B2B · checkout · ERP",
    links: [
      { label: "Shopify Development", href: "/services/commerce/shopify", icon: "shopping-bag", desc: "Themes, apps, headless builds" },
      { label: "WooCommerce Development", href: "/services/commerce/woocommerce", icon: "shopping-cart", desc: "WordPress commerce at scale" },
      { label: "Marketplace Development", href: "/services/commerce/marketplace", icon: "store", desc: "Multi-vendor platforms" },
      { label: "Custom Commerce Builds", href: "/services/commerce/custom", icon: "package", desc: "Bespoke checkout and ops" },
      { label: "Apps & Plugins", href: "/services/commerce/apps-plugins", icon: "puzzle", desc: "Extend your storefront" },
    ],
  },
  {
    id: "ai",
    blurb: "Practical AI and automation that reduces manual work and speeds decisions.",
    number: "05",
    title: "AI & Automation",
    href: "/services/ai",
    flagship: true,
    tags: "Strategy · agents · RAG · automation · LLM tools · guardrails · MCP",
    links: [
      { label: "AI Strategy & Implementation", href: "/services/ai/strategy", icon: "brain", desc: "Where AI actually pays off" },
      { label: "Custom AI Agents & RAG Workflows", href: "/services/ai/agents-rag", icon: "bot", desc: "Grounded, tool-using agents" },
      { label: "Process & Document Automation", href: "/services/ai/automation", icon: "workflow", desc: "Capture → review → approve" },
      { label: "Knowledge Base & LLM Integrations", href: "/services/ai/llm-integrations", icon: "book-open", desc: "Answers from your own docs" },
    ],
  },
];

/** "How We Engage" — shared, identical content in both the Services and Industries mega menus. */
export type EngagementModel = {
  label: string;
  href: string;
  icon: string;
  desc: string;
};

export const ENGAGEMENT_MODELS: EngagementModel[] = [
  { label: "MVP Sprint", href: "/engagement/mvp-sprint", icon: "zap", desc: "Idea → product in 6–10 weeks" },
  { label: "End-to-End Delivery", href: "/engagement/end-to-end-delivery", icon: "layers", desc: "Full-cycle product ownership" },
  { label: "Dedicated Product Team", href: "/engagement/dedicated-team", icon: "users", desc: "Embedded team, your roadmap" },
  { label: "Team Augmentation", href: "/engagement/team-augmentation", icon: "user-plus", desc: "Engineers who ramp fast" },
  { label: "Global Delivery", href: "/engagement/global-delivery", icon: "globe", desc: "Near-shore + offshore hybrid" },
];

/** Industries mega menu — "Industries We Serve" center column. */
export type IndustryLink = {
  label: string;
  href: string;
  icon: string;
  desc: string;
};

export const INDUSTRIES: IndustryLink[] = [
  { label: "SaaS", href: "/industries/saas", icon: "cloud", desc: "Scalable B2B & B2C products" },
  { label: "eCommerce & Retail", href: "/industries/ecommerce", icon: "shopping-cart", desc: "Stores that convert at scale" },
  { label: "FinTech", href: "/industries/fintech", icon: "credit-card", desc: "Finance built to move fast" },
  { label: "Real Estate", href: "/industries/real-estate", icon: "building-2", desc: "Platforms buyers trust" },
  { label: "Logistics", href: "/industries/logistics", icon: "truck", desc: "Ops that move without friction" },
  { label: "Travel & Hospitality", href: "/industries/travel", icon: "plane", desc: "Experiences that book" },
  { label: "Professional Services", href: "/industries/professional-services", icon: "briefcase", desc: "Service firms that grow" },
  { label: "Luxury & Lifestyle", href: "/industries/luxury", icon: "gem", desc: "Brands built to endure" },
  { label: "RMG & Fashion", href: "/industries/rmg", icon: "shirt", desc: "Supply chain to storefront" },
  { label: "Restaurant & Food", href: "/industries/restaurant-food", icon: "utensils", desc: "Hospitality that scales" },
];

/** Services mega menu — right column "Quick access" chips. */
export const SERVICES_QUICK_ACCESS: { label: string; href: string }[] = [
  { label: "MVP Sprint", href: "/engagement/mvp-sprint" },
  { label: "AI Agents", href: "/services/ai/agents-rag" },
  { label: "RAG Systems", href: "/services/ai/llm-integrations" },
  { label: "Design Systems", href: "/services/design/design-systems" },
  { label: "Shopify Plus", href: "/services/commerce/shopify" },
  { label: "Team Aug", href: "/engagement/team-augmentation" },
];

/** Industries mega menu — right column "Popular verticals" chips. */
export const INDUSTRIES_POPULAR: { label: string; href: string }[] = [
  { label: "SaaS", href: "/industries/saas" },
  { label: "FinTech", href: "/industries/fintech" },
  { label: "eCommerce", href: "/industries/ecommerce" },
  { label: "Luxury", href: "/industries/luxury" },
  { label: "Travel", href: "/industries/travel" },
];

/** Services mega menu — right column dark "Featured" card. */
export const SERVICES_FEATURED = {
  eyebrow: "AI & Automation · New",
  title: "AI Agents & RAG Pipelines",
  desc: "Production-ready AI workflows for real teams, not just demos.",
  href: "/services/ai/agents-rag",
  icon: "bot",
};

/** Industries mega menu — right column dark "Case Study" card. */
export const INDUSTRIES_FEATURED = {
  eyebrow: "FinTech · Featured",
  body: "Rebuilt a payment platform — 3× transactions with zero-downtime migration",
  href: "/work",
  icon: "credit-card",
};

/** Lucide icon name per dropdown item (rendered at 16px, 1.5px stroke). */
export const SIMPLE_MENUS: {
  id: string;
  label: string;
  /** Renders a hairline divider immediately after this 0-based link index. */
  dividerAfterIndex?: number;
  links: { label: string; href: string; icon: string }[];
}[] = [
  {
    id: "insights",
    label: "Insights",
    dividerAfterIndex: 2,
    links: [
      { label: "Blog", href: "/insights/blog", icon: "file-text" },
      { label: "Playbooks", href: "/insights/playbooks", icon: "clipboard-list" },
      { label: "Research & Newsletters", href: "/insights/research-newsletters", icon: "bar-chart-2" },
      { label: "Webinars", href: "/insights/webinars", icon: "video" },
      { label: "Podcasts", href: "/insights/podcasts", icon: "mic" },
      { label: "FAQs", href: "/insights/faqs", icon: "help-circle" },
      { label: "Downloads", href: "/insights/downloads", icon: "download" },
    ],
  },
  {
    id: "company",
    label: "Company",
    dividerAfterIndex: 4,
    links: [
      { label: "About", href: "/company/about", icon: "building-2" },
      { label: "Leadership Team", href: "/company/leadership", icon: "users" },
      { label: "Life at CodeShaper", href: "/company/life", icon: "sparkles" },
      { label: "Clients & Partners", href: "/company/clients", icon: "handshake" },
      { label: "Locations", href: "/company/locations", icon: "map-pin" },
      { label: "Contact", href: "/company/contact", icon: "message-circle" },
      { label: "Careers", href: "/company/careers", icon: "target" },
    ],
  },
];
```

- [ ] **Step 2: Add the new icon imports and registry entries to `src/lib/icons.tsx`**

Find:

```tsx
  Brain,
  Bot,
  Workflow,
  type LucideIcon,
} from "lucide-react";
```

Replace with:

```tsx
  Brain,
  Bot,
  Workflow,
  Zap,
  UserPlus,
  ClipboardList,
  BarChart2,
  Video,
  Mic,
  HelpCircle,
  Download,
  Cloud,
  CreditCard,
  Gem,
  MapPin,
  MessageCircle,
  Target,
  Utensils,
  type LucideIcon,
} from "lucide-react";
```

Find:

```tsx
  brain: Brain,
  bot: Bot,
  workflow: Workflow,
};
```

Replace with:

```tsx
  brain: Brain,
  bot: Bot,
  workflow: Workflow,
  // mega menu rebuild: engagement models, industries, insights, company
  zap: Zap,
  "user-plus": UserPlus,
  "clipboard-list": ClipboardList,
  "bar-chart-2": BarChart2,
  video: Video,
  mic: Mic,
  "help-circle": HelpCircle,
  download: Download,
  cloud: Cloud,
  "credit-card": CreditCard,
  gem: Gem,
  "map-pin": MapPin,
  "message-circle": MessageCircle,
  target: Target,
  utensils: Utensils,
};
```

- [ ] **Step 3: Verify**

```bash
cd "/Users/alokpaul/Development/Codeshaper Website-v3.0"
npx tsc --noEmit 2>&1 | tail -40
```

Expected: no new type errors from `navigation.ts`/`icons.tsx` (existing errors, if any, predate this task — only check for errors whose file/line is in these two files). Note: `SERVICE_COLUMNS`, `SIMPLE_MENUS`'s old `industries`/`how-we-work` entries, and the old `Work` nav link are still referenced by `Navbar.tsx`/`MegaPanel.tsx`/`MobileMenu.tsx` until Tasks 3–7 land — **expect real compile errors from those three files** referencing `SIMPLE_MENUS.slice(...)` (now only 2 entries, `.slice(2)` returns `[]` — not a type error, just dead code until Task 6) and any place that read a removed field. If `tsc` reports errors specifically inside `navigation.ts` or `icons.tsx` themselves, fix those; errors in the three consuming files are expected and will resolve as later tasks land.

- [ ] **Step 4: Commit**

```bash
git add src/lib/navigation.ts src/lib/icons.tsx
git commit -m "Add mega menu rebuild data: engagement models, industries, service tags, updated dropdowns"
```

---

### Task 2: `globals.css` — mega menu shell, row/tile/card/chip system

**Files:**
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: nothing new.
- Produces: `--color-ink-mid` token; `.mega-panel` becomes a floating rounded card; new classes `.mega-col-label`, `.mega-row`, `.mega-row-name` (bare marker class, styled via `.mega-row:hover .mega-row-name`), `.mega-icon-tile`, `.mega-svc-arrow` (bare marker class, styled via `.mega-row:hover .mega-svc-arrow`), `.mega-feature-card`, `.mega-chip` — all consumed by Tasks 3–5.

- [ ] **Step 1: Add `--color-ink-mid` to the `.theme-light` token block**

Find:

```css
.theme-light {
  --color-canvas: #ffffff;
  --color-canvas-raised: #f7f8fb;
  --color-panel: #ffffff;
  --color-ink: #0b0f19;
  --color-ink-dim: #6b7280;
```

Replace with:

```css
.theme-light {
  --color-canvas: #ffffff;
  --color-canvas-raised: #f7f8fb;
  --color-panel: #ffffff;
  --color-ink: #0b0f19;
  --color-ink-dim: #6b7280;
  /* A tone between ink and ink-dim, used by a couple of mega-menu labels
     in the reference (10.31:1 on white — safely passes). */
  --color-ink-mid: #374151;
```

- [ ] **Step 2: Turn `.mega-panel` into a floating rounded card**

Find:

```css
.mega-panel {
  /* Fully opaque base: a translucent surface + backdrop-filter composites
     incorrectly on some engines and page text reads through (an earlier
     regression). Over a #0A0A0F page the 2% is invisible anyway. The gradient
     wash on top gives the panel depth without risking bleed-through. */
  background:
    radial-gradient(120% 140% at 12% 0%, rgba(102, 126, 234, 0.05), transparent 55%),
    radial-gradient(90% 120% at 88% 10%, rgba(20, 184, 166, 0.04), transparent 60%),
    #ffffff;
  border-bottom: 1px solid var(--color-hairline);
  box-shadow: 0 24px 64px rgba(11, 15, 25, 0.1);
  will-change: transform, opacity;
}
```

Replace with:

```css
.mega-panel {
  /* Floating rounded card (mega menu rebuild) — was an edge-to-edge panel;
     now centered below the bar with its own border + shadow + radius,
     matching the v2 reference. overflow:hidden clips the ::before
     top-hairline (below) to the rounded corners for free. */
  background:
    radial-gradient(120% 140% at 12% 0%, rgba(102, 126, 234, 0.05), transparent 55%),
    radial-gradient(90% 120% at 88% 10%, rgba(20, 184, 166, 0.04), transparent 60%),
    #ffffff;
  border: 1px solid var(--color-hairline);
  border-radius: 24px;
  box-shadow: 0 24px 70px rgba(11, 15, 25, 0.12), 0 4px 14px rgba(11, 15, 25, 0.05);
  overflow: hidden;
  will-change: transform, opacity;
}
```

- [ ] **Step 3: Add the row/tile/card/chip system**

Find:

```css
/* Icon tiles: gradient-lit when active */
.icon-tile {
  transition: background 260ms ease, border-color 260ms ease, box-shadow 260ms ease;
}
.icon-tile[data-on="true"] {
  background: linear-gradient(140deg, rgba(102, 126, 234, 0.18), rgba(20, 184, 166, 0.10));
  border-color: rgba(102, 126, 234, 0.55);
}
```

Replace with:

```css
/* Icon tiles: gradient-lit when active */
.icon-tile {
  transition: background 260ms ease, border-color 260ms ease, box-shadow 260ms ease;
}
.icon-tile[data-on="true"] {
  background: linear-gradient(140deg, rgba(102, 126, 234, 0.18), rgba(20, 184, 166, 0.10));
  border-color: rgba(102, 126, 234, 0.55);
}

/* ── Mega menu row/tile/card system ──────────────────────────
   Shared by EngageCard, MegaPanel (Services), and IndustriesMegaPanel —
   the three "always-visible list" row types the v2 reference calls
   .mega-em-row / .mega-svc / .mega-ind, unified here since they render
   identically. Text-color rule: hover text uses aurora-violet, never bare
   aurora-indigo (3.66:1, fails 4.5:1 for normal text — see Global
   Constraints). Icon/arrow glyphs stay indigo (non-text UI, 3:1 minimum). */
.mega-col-label {
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--color-aurora-violet);
}

.mega-row {
  border: 1px solid transparent;
  transition: background 180ms ease, border-color 180ms ease;
}
.mega-row:hover {
  background: rgba(102, 126, 234, 0.06);
  border-color: rgba(102, 126, 234, 0.12);
}
.mega-row:hover .mega-row-name {
  color: var(--color-aurora-violet);
}
.mega-row:hover .mega-svc-arrow {
  transform: translateX(4px);
  color: var(--color-aurora-indigo);
}

.mega-icon-tile {
  background: linear-gradient(180deg, #ffffff 0%, var(--color-canvas-raised) 100%);
  border: 1px solid rgba(102, 126, 234, 0.18);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 10px 22px rgba(102, 126, 234, 0.08);
  transition: transform 180ms ease, background 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
}
.mega-row:hover .mega-icon-tile {
  transform: translateY(-1px);
  background: rgba(102, 126, 234, 0.1);
  border-color: rgba(102, 126, 234, 0.28);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.85), 0 12px 26px rgba(102, 126, 234, 0.12);
}

.mega-feature-card {
  background:
    radial-gradient(circle at 86% 10%, rgba(102, 126, 234, 0.2), transparent 32%),
    linear-gradient(145deg, #0b0f19 0%, #171a2c 55%, #20264b 100%);
  border: 1px solid rgba(102, 126, 234, 0.18);
  transition: transform 200ms ease, box-shadow 200ms ease;
}
.mega-feature-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 48px rgba(11, 15, 25, 0.18);
}

.mega-chip {
  border: 1px solid var(--color-hairline);
  background: #ffffff;
  color: var(--color-ink-dim);
  transition: background 180ms ease, color 180ms ease, border-color 180ms ease;
}
.mega-chip:hover {
  background: rgba(102, 126, 234, 0.08);
  color: var(--color-aurora-violet);
  border-color: rgba(102, 126, 234, 0.24);
}

@media (prefers-reduced-motion: reduce) {
  .mega-row,
  .mega-icon-tile,
  .mega-feature-card,
  .mega-chip {
    transition: none;
  }
  .mega-feature-card:hover {
    transform: none;
  }
}
```

- [ ] **Step 3.5: Close a pre-existing reduced-motion gap this task activates**

`.mega-panel[data-state="open"]`'s entrance animation and `.menu-col`'s staggered-column entrance (both defined earlier in this file, under "PASS 2 — motion layer") have never had a `prefers-reduced-motion` override — harmless before this round because `.menu-col` matched zero real elements (dead CSS left over from an earlier pass). Tasks 4–5 make `.menu-col` real (three columns per mega panel), so this gap becomes a genuine, user-visible violation of this round's own reduced-motion constraint. Close it here, next to the animation rules it guards:

Find:

```css
.mega-panel[data-state="open"] .menu-col:nth-child(6) { animation-delay: 400ms; }
```

Replace with:

```css
.mega-panel[data-state="open"] .menu-col:nth-child(6) { animation-delay: 400ms; }

@media (prefers-reduced-motion: reduce) {
  .mega-panel[data-state="open"],
  .mega-panel[data-state="closed"],
  .mega-panel[data-state="open"] .menu-col {
    animation: none;
  }
}
```

- [ ] **Step 4: Verify**

```bash
cd "/Users/alokpaul/Development/Codeshaper Website-v3.0"
npx tailwindcss -i src/app/globals.css -o /tmp/mega-menu-css-check.css 2>&1 | tail -30 || true
```

If the standalone Tailwind CLI isn't available/configured, skip that command — `npm run build` in Task 8 is the real gate. Read the edited file back and confirm: `.theme-light` still has exactly one `--color-ink-mid` declaration, `.mega-panel` has both `border-radius: 24px` and `overflow: hidden`, and every new class above is present exactly once (no accidental duplicate paste).

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css
git commit -m "Add mega menu shell CSS: floating card, row/tile/card/chip system"
```

---

### Task 3: `EngageCard.tsx` — shared "How We Engage" column

**Files:**
- Create: `src/components/nav/EngageCard.tsx`

**Interfaces:**
- Consumes: `ENGAGEMENT_MODELS` from `@/lib/navigation` (Task 1), `Icon` from `@/lib/icons`, CSS classes `.menu-col`/`.mega-col-label`/`.mega-row`/`.mega-row-name`/`.mega-icon-tile` (Task 2, `.menu-col` already existed pre-Task-2 — confirm it's still in `globals.css`, it drives the panel's column stagger-in animation).
- Produces: default export `EngageCard()`, a Radix-`Nav.Link`-based component with no props, rendered by Tasks 4 and 5.

- [ ] **Step 1: Create the file**

```tsx
import Link from "next/link";
import * as Nav from "@radix-ui/react-navigation-menu";
import { ArrowRight } from "lucide-react";
import { ENGAGEMENT_MODELS } from "@/lib/navigation";
import { Icon } from "@/lib/icons";

/**
 * "How We Engage" — the left column shared, identically, by the Services
 * and Industries mega menus.
 */
export default function EngageCard() {
  return (
    <div className="menu-col rounded-2xl border border-hairline bg-gradient-to-b from-white to-canvas-raised p-4">
      <p className="mega-col-label mb-3 px-1">How We Engage</p>
      <ul className="space-y-0.5">
        {ENGAGEMENT_MODELS.map((m) => (
          <li key={m.href}>
            <Nav.Link asChild>
              <Link href={m.href} className="mega-row group flex items-start gap-3 rounded-xl p-2.5">
                <span className="mega-icon-tile flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-aurora-indigo">
                  <Icon name={m.icon} size={16} />
                </span>
                <span className="min-w-0 flex-1 pt-0.5">
                  <span className="mega-row-name block font-body text-[13px] font-semibold leading-snug text-ink transition-colors duration-150">
                    {m.label}
                  </span>
                  <span className="mt-0.5 block font-body text-[11.5px] leading-snug text-ink-dim">
                    {m.desc}
                  </span>
                </span>
              </Link>
            </Nav.Link>
          </li>
        ))}
      </ul>
      <Nav.Link asChild>
        <Link
          href="/engagement"
          className="mt-3 inline-flex items-center gap-1.5 px-2.5 font-body text-[12px] font-semibold text-aurora-violet transition-colors hover:text-ink"
        >
          Compare all models
          <ArrowRight size={12} strokeWidth={2} />
        </Link>
      </Nav.Link>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

```bash
cd "/Users/alokpaul/Development/Codeshaper Website-v3.0"
npx tsc --noEmit 2>&1 | grep -i "EngageCard" || echo "no EngageCard-specific errors"
```

This component isn't imported anywhere yet (Tasks 4–5 do that), so it won't affect the running app. Just confirm no type errors inside the new file itself.

- [ ] **Step 3: Commit**

```bash
git add src/components/nav/EngageCard.tsx
git commit -m "Add EngageCard: shared How We Engage column for both mega menus"
```

---

### Task 4: Rebuild `MegaPanel.tsx` — Services, always-visible 3-column

**Files:**
- Modify: `src/components/nav/MegaPanel.tsx` (full-file replacement)
- Modify: `src/app/globals.css` (dead-code cleanup, see Step 2)

**Interfaces:**
- Consumes: `EngageCard` (Task 3), `SERVICE_COLUMNS` (now with `tags`), `SERVICES_QUICK_ACCESS`, `SERVICES_FEATURED` (Task 1), `Icon`/`SERVICE_ICONS` (existing), CSS classes from Task 2.
- Produces: default export `MegaPanel()`, same signature as before (no props) — `Navbar.tsx` (Task 6) already imports and renders it inside `Nav.Content`, no import-site changes needed for this file specifically.

- [ ] **Step 1: Replace `src/components/nav/MegaPanel.tsx` in full**

```tsx
"use client";

import Link from "next/link";
import * as Nav from "@radix-ui/react-navigation-menu";
import { ArrowRight } from "lucide-react";
import { SERVICE_COLUMNS, SERVICES_QUICK_ACCESS, SERVICES_FEATURED } from "@/lib/navigation";
import { Icon, SERVICE_ICONS } from "@/lib/icons";
import EngageCard from "./EngageCard";

/**
 * Services mega panel — 3 columns, everything visible at once (no
 * click-through, no active-pillar state). Left: How We Engage (shared with
 * Industries). Center: the 5 practices as a flat list. Right: a featured
 * AI callout + quick-access chips. Footer: count + two links.
 */
export default function MegaPanel() {
  return (
    <div className="mx-auto max-w-[1180px] p-5">
      <div className="grid grid-cols-[0.95fr_1.08fr_270px] gap-4">
        <EngageCard />

        {/* Center — Core Services */}
        <div className="menu-col min-w-0">
          <p className="mega-col-label mb-3 px-1">Core Services</p>
          <ul>
            {SERVICE_COLUMNS.map((col) => (
              <li key={col.id}>
                <Nav.Link asChild>
                  <Link href={col.href} className="mega-row group flex items-center gap-3.5 rounded-xl p-2.5">
                    <span className="mega-icon-tile flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-aurora-indigo">
                      <Icon name={SERVICE_ICONS[col.id]} size={17} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="mega-row-name font-body text-[14px] font-semibold leading-snug text-ink transition-colors duration-150">
                          {col.title}
                        </span>
                        {col.flagship && (
                          <span className="shrink-0 rounded-full border border-hairline px-1.5 py-px font-body text-[10px] leading-tight text-aurora-amber-dark">
                            New
                          </span>
                        )}
                      </span>
                      <span className="mt-0.5 block truncate font-body text-[12px] leading-snug text-ink-dim">
                        {col.tags}
                      </span>
                    </span>
                    <ArrowRight
                      size={15}
                      strokeWidth={1.75}
                      className="mega-svc-arrow shrink-0 text-ink-faint transition-all duration-200"
                    />
                  </Link>
                </Nav.Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right — Featured + Quick access */}
        <div className="menu-col">
          <p className="mega-col-label mb-3 px-1">Featured</p>
          <Nav.Link asChild>
            <Link href={SERVICES_FEATURED.href} className="mega-feature-card group mb-5 block rounded-2xl p-4">
              <span className="mb-3.5 flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.12] text-white">
                <Icon name={SERVICES_FEATURED.icon} size={17} />
              </span>
              <span className="mb-1.5 block font-body text-[9.5px] font-bold uppercase tracking-[0.1em] text-white/50">
                {SERVICES_FEATURED.eyebrow}
              </span>
              <span className="block font-display text-[17px] font-bold leading-tight tracking-tight text-white">
                {SERVICES_FEATURED.title}
              </span>
              <span className="mt-1.5 block font-body text-[12.5px] leading-relaxed text-white/85">
                {SERVICES_FEATURED.desc}
              </span>
            </Link>
          </Nav.Link>
          <p className="menu-section-label mb-2.5 px-1">Quick access</p>
          <div className="flex flex-wrap gap-1.5">
            {SERVICES_QUICK_ACCESS.map((c) => (
              <Nav.Link asChild key={c.href}>
                <Link href={c.href} className="mega-chip inline-flex items-center rounded-full px-3 py-1.5 font-body text-[11.5px] font-semibold">
                  {c.label}
                </Link>
              </Nav.Link>
            ))}
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-canvas-raised px-5 py-3.5">
        <p className="font-body text-[11.5px] text-ink-dim">
          <span className="font-semibold text-ink">5 services</span>
          <span className="mx-2 inline-block h-[3px] w-[3px] rounded-full bg-hairline-strong align-middle" aria-hidden />
          Full-stack digital product studio
        </p>
        <div className="flex items-center gap-4">
          <Nav.Link asChild>
            <Link href="/work" className="font-body text-[12px] text-ink-dim transition-colors hover:text-ink">
              View Our Work →
            </Link>
          </Nav.Link>
          <Nav.Link asChild>
            <Link
              href="/services"
              className="rounded-full border border-aurora-indigo/30 bg-aurora-indigo/5 px-4 py-2 font-body text-[12px] font-semibold text-aurora-violet transition-colors hover:border-aurora-violet hover:bg-aurora-violet hover:text-white"
            >
              Explore All Services →
            </Link>
          </Nav.Link>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Remove now-dead CSS from `src/app/globals.css`**

The old click-through rail this file replaces was the only consumer of `.ai-col-wash`, `icon-tile[data-on="true"]`'s *usage sites*, and `.detail-links`/`detail-in`. First confirm nothing else in the codebase still uses them:

```bash
cd "/Users/alokpaul/Development/Codeshaper Website-v3.0"
grep -rn "ai-col-wash\|data-on=\|detail-links" src/components src/app --include="*.tsx" --include="*.css"
```

If that grep's only hits are inside `globals.css` itself (the rule definitions) with **zero** hits in any `.tsx` file, remove these three now-orphaned rule blocks from `globals.css`:

```css
/* AI column aurora wash intensifies on hover (8% → 12%) */
.ai-col-wash {
  transition: opacity 300ms ease;
}
.menu-col:hover .ai-col-wash {
  opacity: 0.12 !important;
}
```

```css
.icon-tile[data-on="true"] {
  background: linear-gradient(140deg, rgba(102, 126, 234, 0.18), rgba(20, 184, 166, 0.10));
  border-color: rgba(102, 126, 234, 0.55);
}
```

(Leave the surrounding `.icon-tile { transition: ...; }` rule itself — Insights/Company compact dropdowns still use plain `.icon-tile` without the `data-on` variant.)

```css
/* Mega menu detail pane: links fade/slide in when the active pillar changes */
@keyframes detail-in {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
.detail-links > li {
  animation: detail-in 260ms ease both;
}
.detail-links > li:nth-child(2) { animation-delay: 30ms; }
.detail-links > li:nth-child(3) { animation-delay: 60ms; }
.detail-links > li:nth-child(4) { animation-delay: 90ms; }
.detail-links > li:nth-child(5) { animation-delay: 120ms; }
.detail-links > li:nth-child(6) { animation-delay: 150ms; }

@media (prefers-reduced-motion: reduce) {
  .detail-links > li { animation: none; }
}
```

If the grep finds a use you didn't expect (e.g. `data-on=` used by some unrelated component — `data-on` is a generic-sounding attribute name, double-check any hit is actually the mega-menu pattern and not a coincidental match), leave that specific rule in place and note it in your report instead of deleting it.

- [ ] **Step 3: Verify**

```bash
cd "/Users/alokpaul/Development/Codeshaper Website-v3.0"
lsof -ti:3000,3001 -sTCP:LISTEN | xargs -r kill
(npm run dev > /tmp/codeshaper-dev.log 2>&1 &)
sleep 2 && grep -m1 "Local:" /tmp/codeshaper-dev.log
```

`MegaPanel` isn't wired into `Navbar.tsx`'s new structure yet (Task 6 does that) — `Navbar.tsx` still imports and renders it exactly as before, so the dev server should still show *something* under "Services" (it may look broken/unstyled relative to the old rail since `Navbar.tsx`'s wrapper div still uses the old `top-16`/`w-full` positioning until Task 6 — that's expected, not a bug in this task). Using Playwright MCP tools (deferred — if not visible, `ToolSearch` for `select:mcp__plugin_playwright_playwright__browser_navigate,mcp__plugin_playwright_playwright__browser_click,mcp__plugin_playwright_playwright__browser_take_screenshot,mcp__plugin_playwright_playwright__browser_console_messages` first): navigate, click "Services", screenshot, confirm the 3-column content (How We Engage / Core Services / Featured) renders with real text and no console errors — don't worry about outer panel positioning/shape polish, that's Task 6. Stop the dev server when done.

- [ ] **Step 4: Commit**

```bash
git add src/components/nav/MegaPanel.tsx src/app/globals.css
git commit -m "Rebuild Services mega menu as an always-visible 3-column panel"
```

---

### Task 5: `IndustriesMegaPanel.tsx` — new, Industries 3-column

**Files:**
- Create: `src/components/nav/IndustriesMegaPanel.tsx`

**Interfaces:**
- Consumes: `EngageCard` (Task 3), `INDUSTRIES`, `INDUSTRIES_POPULAR`, `INDUSTRIES_FEATURED` (Task 1), `Icon` (existing), CSS classes from Task 2.
- Produces: default export `IndustriesMegaPanel()`, no props — consumed by `Navbar.tsx` in Task 6.

- [ ] **Step 1: Create the file**

```tsx
"use client";

import Link from "next/link";
import * as Nav from "@radix-ui/react-navigation-menu";
import { INDUSTRIES, INDUSTRIES_POPULAR, INDUSTRIES_FEATURED } from "@/lib/navigation";
import { Icon } from "@/lib/icons";
import EngageCard from "./EngageCard";

/**
 * Industries mega panel — same 3-column shell as Services. Left: How We
 * Engage (shared). Center: a 2-column grid of the 10 industries. Right: a
 * dark case-study card + popular-vertical chips. Footer: count + two links.
 */
export default function IndustriesMegaPanel() {
  return (
    <div className="mx-auto max-w-[1180px] p-5">
      <div className="grid grid-cols-[0.95fr_1.08fr_270px] gap-4">
        <EngageCard />

        {/* Center — Industries We Serve */}
        <div className="menu-col min-w-0">
          <p className="mega-col-label mb-3 px-1">Industries We Serve</p>
          <ul className="grid grid-cols-2 gap-1">
            {INDUSTRIES.map((ind) => (
              <li key={ind.href}>
                <Nav.Link asChild>
                  <Link href={ind.href} className="mega-row group flex items-start gap-2.5 rounded-xl p-2.5">
                    <span className="mega-icon-tile flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-aurora-indigo">
                      <Icon name={ind.icon} size={16} />
                    </span>
                    <span className="min-w-0 flex-1 pt-0.5">
                      <span className="mega-row-name block font-body text-[12.5px] font-semibold leading-snug text-ink transition-colors duration-150">
                        {ind.label}
                      </span>
                      <span className="mt-0.5 block font-body text-[10.5px] leading-snug text-ink-dim">
                        {ind.desc}
                      </span>
                    </span>
                  </Link>
                </Nav.Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right — Case Study + Popular verticals */}
        <div className="menu-col">
          <p className="mega-col-label mb-3 px-1">Case Study</p>
          <Nav.Link asChild>
            <Link href={INDUSTRIES_FEATURED.href} className="mega-feature-card group mb-5 block rounded-2xl p-4">
              <span className="mb-3.5 flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.12] text-white">
                <Icon name={INDUSTRIES_FEATURED.icon} size={17} />
              </span>
              <span className="mb-1.5 block font-body text-[9.5px] font-bold uppercase tracking-[0.1em] text-white/50">
                {INDUSTRIES_FEATURED.eyebrow}
              </span>
              <span className="block font-body text-[13px] font-medium leading-relaxed text-white/90">
                {INDUSTRIES_FEATURED.body}
              </span>
            </Link>
          </Nav.Link>
          <p className="menu-section-label mb-2.5 px-1">Popular verticals</p>
          <div className="flex flex-wrap gap-1.5">
            {INDUSTRIES_POPULAR.map((c) => (
              <Nav.Link asChild key={c.href}>
                <Link href={c.href} className="mega-chip inline-flex items-center rounded-full px-3 py-1.5 font-body text-[11.5px] font-semibold">
                  {c.label}
                </Link>
              </Nav.Link>
            ))}
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-canvas-raised px-5 py-3.5">
        <p className="font-body text-[11.5px] text-ink-dim">
          <span className="font-semibold text-ink">10 industries</span>
          <span className="mx-2 inline-block h-[3px] w-[3px] rounded-full bg-hairline-strong align-middle" aria-hidden />
          Built for high-growth digital teams
        </p>
        <div className="flex items-center gap-4">
          <Nav.Link asChild>
            <Link href="/work" className="font-body text-[12px] text-ink-dim transition-colors hover:text-ink">
              View Case Studies →
            </Link>
          </Nav.Link>
          <Nav.Link asChild>
            <Link
              href="/industries"
              className="rounded-full border border-aurora-indigo/30 bg-aurora-indigo/5 px-4 py-2 font-body text-[12px] font-semibold text-aurora-violet transition-colors hover:border-aurora-violet hover:bg-aurora-violet hover:text-white"
            >
              Explore All Industries →
            </Link>
          </Nav.Link>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

```bash
cd "/Users/alokpaul/Development/Codeshaper Website-v3.0"
npx tsc --noEmit 2>&1 | grep -i "IndustriesMegaPanel" || echo "no IndustriesMegaPanel-specific errors"
```

Not imported anywhere yet (Task 6 wires it in) — just confirm the new file itself type-checks clean.

- [ ] **Step 3: Commit**

```bash
git add src/components/nav/IndustriesMegaPanel.tsx
git commit -m "Add IndustriesMegaPanel: new Industries mega menu, 3-column"
```

---

### Task 6: `Navbar.tsx` — nav order, Industries promoted to mega, floating panel wrapper

**Files:**
- Modify: `src/components/nav/Navbar.tsx`

**Interfaces:**
- Consumes: `MegaPanel` (Task 4), `IndustriesMegaPanel` (Task 5), `SIMPLE_MENUS` (Task 1, now `[insights, company]`), `DropdownItem`'s local type (extended in this task for `dividerAfterIndex`).
- Produces: the nav bar's final item order and floating mega-panel positioning — nothing downstream consumes this file.

- [ ] **Step 1: Import `IndustriesMegaPanel`**

Find:

```tsx
import { SIMPLE_MENUS } from "@/lib/navigation";
import { Icon } from "@/lib/icons";
import MegaPanel from "./MegaPanel";
import MobileMenu from "./MobileMenu";
```

Replace with:

```tsx
import { SIMPLE_MENUS } from "@/lib/navigation";
import { Icon } from "@/lib/icons";
import MegaPanel from "./MegaPanel";
import IndustriesMegaPanel from "./IndustriesMegaPanel";
import MobileMenu from "./MobileMenu";
```

- [ ] **Step 2: `megaOpen` now covers both mega items**

Find:

```tsx
  const megaOpen = openValue === "services";
```

Replace with:

```tsx
  const megaOpen = openValue === "services" || openValue === "industries";
```

- [ ] **Step 3: Rebuild the `Nav.List` — new order, Industries as mega, floating viewport wrapper**

Find:

```tsx
            <div ref={rootRef} className="ml-auto mr-6 hidden lg:block">
              <Nav.Root value={openValue} onValueChange={setOpenValue} className="relative">
                <Nav.List className="flex items-center gap-1">
                  {/* Services — MEGA (uses the shared full-width viewport) */}
                  <Nav.Item value="services">
                    <Nav.Trigger className={triggerCls}>
                      Services
                      <ChevronDown
                        size={13}
                        strokeWidth={1.75}
                        className="transition-transform duration-200 group-data-[state=open]:rotate-180"
                      />
                    </Nav.Trigger>
                    <Nav.Content>
                      <MegaPanel />
                    </Nav.Content>
                  </Nav.Item>

                  {SIMPLE_MENUS.slice(0, 2).map((m) => (
                    <DropdownItem key={m.id} menu={m} />
                  ))}

                  <Nav.Item>
                    <Nav.Link asChild>
                      <Link href="/work" className={triggerCls}>
                        Work
                      </Link>
                    </Nav.Link>
                  </Nav.Item>

                  {SIMPLE_MENUS.slice(2).map((m) => (
                    <DropdownItem key={m.id} menu={m} />
                  ))}
                </Nav.List>

                {/* Shared viewport = the mega panel surface. Compact dropdowns
                    render inside their own Item, so this only shows for Services. */}
                <div
                  className="fixed inset-x-0 top-16 z-40"
                  style={{ pointerEvents: megaOpen ? "auto" : "none" }}
                >
                  <Nav.Viewport className="mega-panel w-full data-[state=closed]:hidden" />
                </div>
              </Nav.Root>
            </div>
```

Replace with:

```tsx
            <div ref={rootRef} className="ml-auto mr-6 hidden lg:block">
              <Nav.Root value={openValue} onValueChange={setOpenValue} className="relative">
                <Nav.List className="flex items-center gap-1">
                  <Nav.Item>
                    <Nav.Link asChild>
                      <Link href="/" className={triggerCls}>
                        Home
                      </Link>
                    </Nav.Link>
                  </Nav.Item>

                  {/* Services + Industries — MEGA (share the floating viewport) */}
                  <Nav.Item value="services">
                    <Nav.Trigger className={triggerCls}>
                      Services
                      <ChevronDown
                        size={13}
                        strokeWidth={1.75}
                        className="transition-transform duration-200 group-data-[state=open]:rotate-180"
                      />
                    </Nav.Trigger>
                    <Nav.Content>
                      <MegaPanel />
                    </Nav.Content>
                  </Nav.Item>

                  <Nav.Item value="industries">
                    <Nav.Trigger className={triggerCls}>
                      Industries
                      <ChevronDown
                        size={13}
                        strokeWidth={1.75}
                        className="transition-transform duration-200 group-data-[state=open]:rotate-180"
                      />
                    </Nav.Trigger>
                    <Nav.Content>
                      <IndustriesMegaPanel />
                    </Nav.Content>
                  </Nav.Item>

                  <Nav.Item>
                    <Nav.Link asChild>
                      <Link href="/work" className={triggerCls}>
                        Success Stories
                      </Link>
                    </Nav.Link>
                  </Nav.Item>

                  {SIMPLE_MENUS.map((m) => (
                    <DropdownItem key={m.id} menu={m} />
                  ))}
                </Nav.List>

                {/* Shared floating viewport = the mega panel surface (Services +
                    Industries). Compact dropdowns render inside their own Item. */}
                <div
                  className="fixed left-1/2 top-[74px] z-40 w-[min(calc(100vw-48px),1180px)] -translate-x-1/2"
                  style={{ pointerEvents: megaOpen ? "auto" : "none" }}
                >
                  <Nav.Viewport className="mega-panel data-[state=closed]:hidden" />
                </div>
              </Nav.Root>
            </div>
```

- [ ] **Step 4: Add the "View Work" secondary button beside "Book a Call"**

Find:

```tsx
            <div className="flex items-center gap-3">
              <Magnetic>
                <Link
                  href="/contact"
                  className="hidden rounded-full bg-aurora-violet px-5 py-2 font-display text-sm font-medium text-white transition-[background-color,transform] duration-300 hover:scale-[1.02] hover:bg-aurora-violet-dark sm:inline-block"
                >
                  Book a Call
                </Link>
              </Magnetic>
```

Replace with:

```tsx
            <div className="flex items-center gap-3">
              <Link
                href="/work"
                className="hidden rounded-full border border-aurora-indigo/25 px-5 py-2 font-display text-sm font-medium text-ink-dim transition-colors duration-300 hover:border-aurora-indigo/45 hover:text-ink sm:inline-block"
              >
                View Work
              </Link>
              <Magnetic>
                <Link
                  href="/contact"
                  className="hidden rounded-full bg-aurora-violet px-5 py-2 font-display text-sm font-medium text-white transition-[background-color,transform] duration-300 hover:scale-[1.02] hover:bg-aurora-violet-dark sm:inline-block"
                >
                  Book a Call
                </Link>
              </Magnetic>
```

- [ ] **Step 5: `DropdownItem` — render dividers, update its type**

Find:

```tsx
function DropdownItem({
  menu,
}: {
  menu: { id: string; label: string; links: { label: string; href: string; icon: string }[] };
}) {
  return (
    <Nav.Item value={menu.id} className="relative">
      <Nav.Trigger className={triggerCls}>
        {menu.label}
        <ChevronDown
          size={13}
          strokeWidth={1.75}
          className="transition-transform duration-200 group-data-[state=open]:rotate-180"
        />
      </Nav.Trigger>
      <Nav.Content className="dropdown-panel absolute left-1/2 top-full z-40 mt-3 w-[300px] -translate-x-1/2 rounded-xl border border-hairline bg-white p-2 shadow-[0_20px_48px_rgba(11,15,25,0.14)]">
        <ul>
          {menu.links.slice(0, 8).map((l) => (
            <li key={l.href}>
              <Nav.Link asChild>
                <Link
                  href={l.href}
                  className="menu-row group flex items-center gap-3 rounded-lg px-2.5 py-2.5 font-body text-[13.5px] text-ink-dim transition-colors hover:text-ink"
                >
                  <span className="icon-tile flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-hairline bg-canvas-raised text-aurora-indigo group-hover:border-aurora-indigo/45">
                    <Icon name={l.icon} size={14} />
                  </span>
                  {l.label}
                </Link>
              </Nav.Link>
            </li>
          ))}
        </ul>
      </Nav.Content>
    </Nav.Item>
  );
}
```

Replace with:

```tsx
function DropdownItem({
  menu,
}: {
  menu: {
    id: string;
    label: string;
    dividerAfterIndex?: number;
    links: { label: string; href: string; icon: string }[];
  };
}) {
  return (
    <Nav.Item value={menu.id} className="relative">
      <Nav.Trigger className={triggerCls}>
        {menu.label}
        <ChevronDown
          size={13}
          strokeWidth={1.75}
          className="transition-transform duration-200 group-data-[state=open]:rotate-180"
        />
      </Nav.Trigger>
      <Nav.Content className="dropdown-panel absolute left-1/2 top-full z-40 mt-3 w-[300px] -translate-x-1/2 rounded-xl border border-hairline bg-white p-2 shadow-[0_20px_48px_rgba(11,15,25,0.14)]">
        <ul>
          {menu.links.map((l, i) => (
            <li key={l.href}>
              <Nav.Link asChild>
                <Link
                  href={l.href}
                  className="menu-row group flex items-center gap-3 rounded-lg px-2.5 py-2.5 font-body text-[13.5px] text-ink-dim transition-colors hover:text-ink"
                >
                  <span className="icon-tile flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-hairline bg-canvas-raised text-aurora-indigo group-hover:border-aurora-indigo/45">
                    <Icon name={l.icon} size={14} />
                  </span>
                  {l.label}
                </Link>
              </Nav.Link>
              {menu.dividerAfterIndex === i && <div className="my-1.5 h-px bg-hairline" aria-hidden />}
            </li>
          ))}
        </ul>
      </Nav.Content>
    </Nav.Item>
  );
}
```

- [ ] **Step 6: Verify**

```bash
cd "/Users/alokpaul/Development/Codeshaper Website-v3.0"
lsof -ti:3000,3001 -sTCP:LISTEN | xargs -r kill
(npm run dev > /tmp/codeshaper-dev.log 2>&1 &)
sleep 2 && grep -m1 "Local:" /tmp/codeshaper-dev.log
```

Using Playwright MCP tools (deferred — `ToolSearch` for `select:mcp__plugin_playwright_playwright__browser_navigate,mcp__plugin_playwright_playwright__browser_click,mcp__plugin_playwright_playwright__browser_take_screenshot,mcp__plugin_playwright_playwright__browser_console_messages,mcp__plugin_playwright_playwright__browser_resize` first), at 1440×900:
1. Navigate, screenshot the bar: confirm order `Home · Services · Industries · Success Stories · Insights · Company` on the left/center and `View Work` + `Book a Call` on the right.
2. Click "Services" — confirm the floating rounded card appears centered below the bar (not edge-to-edge), 3 columns visible, no console errors.
3. Click "Industries" — confirm the floating card now shows the Industries content (How We Engage unchanged, 2-column industries grid, Case Study card), still the same outer shape/position as Services.
4. Click "Insights" — confirm the compact dropdown renders 7 items with a divider after item 3.
5. Click "Company" — confirm 7 items with a divider after item 5.
6. `browser_console_messages` level `error` — expect 0.

Full mobile-menu content parity is Task 7's job — this step only needs the desktop bar/mega/dropdown structure working. Stop the dev server when done.

- [ ] **Step 7: Commit**

```bash
git add src/components/nav/Navbar.tsx
git commit -m "Restructure nav bar: Home/Industries-mega/Success Stories, View Work button"
```

---

### Task 7: `MobileMenu.tsx` — accordion restructure

**Files:**
- Modify: `src/components/nav/MobileMenu.tsx` (full-file replacement)

**Interfaces:**
- Consumes: `ENGAGEMENT_MODELS`, `SERVICES_QUICK_ACCESS`, `SERVICES_FEATURED`, `INDUSTRIES`, `SIMPLE_MENUS` (all Task 1), `SERVICE_COLUMNS`/`SERVICE_ICONS`/`Icon` (existing).
- Produces: default export unchanged (`MobileMenu({ open, onClose })`) — `Navbar.tsx` already renders it, no call-site changes needed.

- [ ] **Step 1: Replace `src/components/nav/MobileMenu.tsx` in full**

```tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
import * as Accordion from "@radix-ui/react-accordion";
import { ArrowRight, Plus } from "lucide-react";
import {
  SERVICE_COLUMNS,
  SIMPLE_MENUS,
  ENGAGEMENT_MODELS,
  SERVICES_QUICK_ACCESS,
  SERVICES_FEATURED,
  INDUSTRIES,
} from "@/lib/navigation";
import { Icon, SERVICE_ICONS } from "@/lib/icons";

/**
 * Mobile navigation (<1024px): full-screen takeover + Radix Accordion.
 * The Services accordion is sub-grouped (How We Engage / Core Services /
 * Featured / Quick Access) to mirror the desktop mega menu's content, not
 * just a flat sub-service list. Industries gets its own accordion.
 */
export default function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div
      className={`fixed inset-0 top-16 z-40 overflow-y-auto bg-canvas transition-opacity duration-300 lg:hidden ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!open}
    >
      <nav aria-label="Mobile" className="px-6 py-8">
        <Link href="/" onClick={onClose} className="block py-3 font-display text-lg font-medium text-ink">
          Home
        </Link>

        <Accordion.Root type="single" collapsible className="border-t border-hairline">
          {/* Services */}
          <Accordion.Item value="services" className="border-b border-hairline">
            <Accordion.Header>
              <Accordion.Trigger className="group flex w-full items-center justify-between gap-3 py-4 text-left font-display text-base font-medium text-ink">
                Services
                <Plus
                  size={16}
                  strokeWidth={1.5}
                  className="shrink-0 text-ink-dim transition-transform duration-300 group-data-[state=open]:rotate-45"
                  aria-hidden
                />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="overflow-hidden pb-5">
              <p className="menu-section-label mb-2 mt-1 font-body">How We Engage</p>
              <ul className="mb-4">
                {ENGAGEMENT_MODELS.map((m) => (
                  <li key={m.href}>
                    <Link href={m.href} onClick={onClose} className="block py-2 font-body text-sm text-ink-dim">
                      {m.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <p className="menu-section-label mb-2 font-body">Core Services</p>
              <ul className="mb-4">
                {SERVICE_COLUMNS.map((col) => (
                  <li key={col.id}>
                    <Link
                      href={col.href}
                      onClick={onClose}
                      className="flex items-center gap-3 py-2 font-body text-sm text-ink-dim"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-hairline bg-canvas-raised text-aurora-indigo">
                        <Icon name={SERVICE_ICONS[col.id]} size={14} />
                      </span>
                      {col.title}
                      {col.flagship && (
                        <span className="rounded-full border border-hairline px-1.5 py-px font-body text-[10px] text-aurora-amber-dark">
                          New
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>

              <p className="menu-section-label mb-2 font-body">Featured</p>
              <Link
                href={SERVICES_FEATURED.href}
                onClick={onClose}
                className="mb-4 block rounded-xl border border-hairline bg-canvas-raised p-4"
              >
                <p className="font-display text-[15px] font-semibold text-ink">{SERVICES_FEATURED.title}</p>
                <p className="mt-1 font-body text-[13px] leading-relaxed text-ink-dim">{SERVICES_FEATURED.desc}</p>
              </Link>

              <p className="menu-section-label mb-2 font-body">Quick Access</p>
              <div className="flex flex-wrap gap-2">
                {SERVICES_QUICK_ACCESS.map((c) => (
                  <Link
                    key={c.href}
                    href={c.href}
                    onClick={onClose}
                    className="mega-chip inline-flex items-center rounded-full px-3 py-1.5 font-body text-xs font-semibold"
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            </Accordion.Content>
          </Accordion.Item>

          {/* Industries */}
          <Accordion.Item value="industries" className="border-b border-hairline">
            <Accordion.Header>
              <Accordion.Trigger className="group flex w-full items-center justify-between gap-3 py-4 text-left font-display text-base font-medium text-ink">
                Industries
                <Plus
                  size={16}
                  strokeWidth={1.5}
                  className="shrink-0 text-ink-dim transition-transform duration-300 group-data-[state=open]:rotate-45"
                  aria-hidden
                />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="overflow-hidden pb-5">
              <ul>
                {INDUSTRIES.map((ind) => (
                  <li key={ind.href}>
                    <Link href={ind.href} onClick={onClose} className="block py-2 font-body text-sm text-ink-dim">
                      {ind.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/industries"
                onClick={onClose}
                className="mt-2 inline-flex items-center gap-1.5 font-body text-[13px] font-semibold text-aurora-violet"
              >
                Explore All Industries
                <ArrowRight size={13} strokeWidth={1.75} />
              </Link>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>

        <Link
          href="/work"
          onClick={onClose}
          className="block border-b border-hairline py-4 font-display text-base font-medium text-ink"
        >
          Success Stories
        </Link>

        <div className="mt-6 space-y-8">
          {SIMPLE_MENUS.map((m) => (
            <div key={m.id}>
              <p className="mb-3 menu-section-label font-body">{m.label}</p>
              <ul className="space-y-1">
                {m.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={onClose}
                      className="flex items-center gap-3 py-1.5 font-body text-sm text-ink-dim"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-hairline bg-canvas-raised text-aurora-indigo">
                        <Icon name={l.icon} size={14} />
                      </span>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 pb-16 sm:flex-row">
          <Link
            href="/work"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-full border border-aurora-indigo/25 px-6 py-3 font-display text-sm font-medium text-ink-dim transition-colors hover:border-aurora-indigo/45 hover:text-ink"
          >
            View Work
          </Link>
          <Link
            href="/contact"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-full bg-aurora-violet px-6 py-3 font-display text-sm font-medium text-white transition-colors duration-300 hover:bg-aurora-violet-dark"
          >
            Book a Call
          </Link>
        </div>
      </nav>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

```bash
cd "/Users/alokpaul/Development/Codeshaper Website-v3.0"
lsof -ti:3000,3001 -sTCP:LISTEN | xargs -r kill
(npm run dev > /tmp/codeshaper-dev.log 2>&1 &)
sleep 2 && grep -m1 "Local:" /tmp/codeshaper-dev.log
```

Using Playwright MCP tools at 390×844: navigate, open the hamburger, screenshot. Expand the Services accordion — confirm all 4 sub-sections (How We Engage / Core Services / Featured / Quick Access) render with real content. Collapse it, expand Industries — confirm all 10 industries + "Explore All Industries" link. Confirm "Success Stories" renders as a plain link, and Insights/Company sections at the bottom show their full updated content. Confirm the bottom shows both "View Work" and "Book a Call" buttons. `browser_console_messages` level `error` — expect 0. Stop the dev server when done.

- [ ] **Step 3: Commit**

```bash
git add src/components/nav/MobileMenu.tsx
git commit -m "Restructure mobile menu: sub-grouped Services accordion, new Industries accordion"
```

---

### Task 8: Full verification pass

**Files:** none (verification only).

- [ ] **Step 1: Fresh build**

```bash
cd "/Users/alokpaul/Development/Codeshaper Website-v3.0"
npm run build 2>&1 | tail -60
```

Expected: clean build, no type errors, no missing-import errors.

- [ ] **Step 2: Full desktop walkthrough (1440×900)**

```bash
lsof -ti:3000,3001 -sTCP:LISTEN | xargs -r kill
(npm run dev > /tmp/codeshaper-dev.log 2>&1 &)
sleep 2 && grep -m1 "Local:" /tmp/codeshaper-dev.log
```

Using Playwright MCP tools:
1. Screenshot the bar (top of page) — confirm the full order and both right-side buttons.
2. Open Services — screenshot; confirm all 3 columns, the dark Featured card, quick-access chips, and the footer bar render correctly with real content and no layout overflow.
3. Open Industries — screenshot; confirm the 2-column industries grid (10 items), Case Study card, popular-verticals chips, footer bar.
4. Hover/click a couple of rows in each mega menu — confirm the hover treatment (background wash, icon lift, text color) applies and no row is unreadable.
5. Open Insights, then Company — screenshot each; confirm divider placement matches the data (after item 3 for Insights, after item 5 for Company).
6. Scroll to where the dark aurora sections begin (`browser_evaluate` `window.scrollTo(0, 1600)`), screenshot — confirm no visual regression versus the last round's verified light→dark boundary (this round didn't touch that boundary, but confirm the new floating mega panel doesn't leave any stray fixed-position artifact visible after scrolling with the menu closed).
7. `browser_console_messages` level `error`, all messages so far — expect 0.

- [ ] **Step 3: Mobile walkthrough (390×844)**

Screenshot hero, open hamburger, expand Services (confirm all 4 sub-sections), collapse, expand Industries (confirm all 10 items), close menu. `browser_console_messages` — expect 0.

- [ ] **Step 4: Reduced-motion walkthrough**

Emulate `prefers-reduced-motion: reduce`, reload. Open Services and Industries — confirm both render fully (all content visible, just without the entrance/hover motion) with no console errors.

- [ ] **Step 5: Responsive breakpoint check**

`browser_resize` to 1023×900 (just below `lg`) — confirm the desktop nav/mega menus are fully hidden and the hamburger is the only way to reach navigation (no partial/broken desktop nav visible at this width).

- [ ] **Step 6: Clean up**

```bash
cd "/Users/alokpaul/Development/Codeshaper Website-v3.0"
rm -f *.png
rm -rf .playwright-mcp
lsof -ti:3000,3001 -sTCP:LISTEN | xargs -r kill
git status --short
```

Confirm `git status` is clean.

- [ ] **Step 7: Final commit (only if Steps 2–5 caught anything requiring a fix)**

If everything passed with no fixes needed, there's nothing to commit here — Task 7's commit is the last one. If a fix was needed, commit it with a message describing what the full walkthrough caught that individual task verification missed.
