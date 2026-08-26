/**
 * Finds the item whose href's last path segment exactly matches `slug`.
 * Shared by every [dynamic]/page.tsx route below instead of each one
 * hand-rolling its own `.find(x => x.href.endsWith('/' + slug))` — that
 * pattern would false-match a slug that's a suffix of another (e.g.
 * "mvp-sprint" vs a hypothetical "lite-mvp-sprint"); comparing the exact
 * last segment doesn't have that risk.
 */
export function findBySlug<T extends { href: string }>(list: T[], slug: string): T | undefined {
  return list.find((item) => item.href.split("/").pop() === slug);
}

/** The exact same last-segment extraction used by generateStaticParams for these routes. */
export function slugFromHref(href: string): string {
  return href.split("/").pop()!;
}

export type ServiceLink = {
  label: string;
  href: string;
  /** Lucide icon key (see lib/icons.tsx) */
  icon: string;
  /** 3–5 word clarifier shown under the label in the mega menu */
  desc: string;
  /** One real paragraph — used as the intro copy on this service's own detail page */
  longDescription: string;
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
      {
        label: "UX/UI Design & Prototyping",
        href: "/services/design/ux-ui",
        icon: "layout-dashboard",
        desc: "Flows, screens, clickable prototypes",
        longDescription:
          "We map user flows, design high-fidelity screens, and build clickable prototypes you can test with real users before a single line of production code is written.",
      },
      {
        label: "Product Discovery & Strategy",
        href: "/services/design/discovery",
        icon: "compass",
        desc: "Scope, roadmap, success metrics",
        longDescription:
          "A focused discovery phase turns a rough idea into a scoped roadmap — clear priorities, success metrics, and a plan the whole team can build against.",
      },
      {
        label: "Design Systems",
        href: "/services/design/design-systems",
        icon: "component",
        desc: "Reusable, documented components",
        longDescription:
          "A documented library of reusable components, tokens, and patterns so design and engineering stay in sync as the product grows past its first release.",
      },
      {
        label: "Conversion Rate Optimization",
        href: "/services/design/cro",
        icon: "trending-up",
        desc: "Test, measure, lift conversion",
        longDescription:
          "We audit funnels, run structured A/B tests, and ship data-backed changes to lift signup, checkout, and activation conversion.",
      },
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
      {
        label: "Web Application",
        href: "/services/engineering/web",
        icon: "monitor",
        desc: "Dashboards and customer portals",
        longDescription: "Custom web applications — admin dashboards, customer portals, and internal tools — built on a modern, maintainable stack.",
      },
      {
        label: "Mobile Application",
        href: "/services/engineering/mobile",
        icon: "smartphone",
        desc: "iOS, Android, cross-platform",
        longDescription: "Native iOS/Android or cross-platform mobile apps, built for performance and shipped through App Store and Play Store review without surprises.",
      },
      {
        label: "SaaS Development",
        href: "/services/engineering/saas",
        icon: "layers",
        desc: "Multi-tenant, billing, roles",
        longDescription: "Multi-tenant SaaS architecture — billing, roles and permissions, and usage metering — built to support your first hundred customers and beyond.",
      },
      {
        label: "Business Applications & Portals",
        href: "/services/engineering/business-apps",
        icon: "building-2",
        desc: "Internal tools that fit ops",
        longDescription: "Internal tools and portals shaped around how your team actually works, replacing spreadsheets and manual handoffs with a system that fits your operations.",
      },
      {
        label: "Rebuild & Modernization",
        href: "/services/engineering/modernization",
        icon: "refresh-cw",
        desc: "Legacy to a modern stack",
        longDescription: "We migrate legacy applications to a modern, supportable stack — incrementally, with production data intact and downtime kept to a minimum.",
      },
      {
        label: "APIs & Integrations",
        href: "/services/engineering/apis",
        icon: "plug",
        desc: "Connect the systems you run",
        longDescription: "Custom APIs and third-party integrations that connect the tools you already run — CRM, payments, ERP — into one coherent system.",
      },
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
      {
        label: "Marketing Websites",
        href: "/services/websites/marketing",
        icon: "globe",
        desc: "Fast, rankable, on-brand",
        longDescription: "Marketing websites built for speed and search from day one — clean semantic markup, fast Core Web Vitals, and a design that matches your brand.",
      },
      {
        label: "Landing Pages",
        href: "/services/websites/landing-pages",
        icon: "file-text",
        desc: "Campaign-ready, built to test",
        longDescription: "Campaign landing pages built to launch fast and test easily, so you can validate messaging and offers before committing budget at scale.",
      },
      {
        label: "Redesign & Replatforming",
        href: "/services/websites/replatforming",
        icon: "wand-2",
        desc: "Move platforms without downtime",
        longDescription: "We move sites between platforms — WordPress, Webflow, headless CMS — without losing SEO rankings or breaking production during the switch.",
      },
      {
        label: "Care & Maintenance",
        href: "/services/websites/care",
        icon: "life-buoy",
        desc: "Updates, monitoring, support",
        longDescription: "Ongoing updates, uptime monitoring, and support after launch, so your site stays fast, secure, and current without needing an in-house team.",
      },
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
      {
        label: "Shopify Development",
        href: "/services/commerce/shopify",
        icon: "shopping-bag",
        desc: "Themes, apps, headless builds",
        longDescription: "Custom Shopify themes, private apps, and headless storefronts built for stores that have outgrown off-the-shelf templates.",
      },
      {
        label: "WooCommerce Development",
        href: "/services/commerce/woocommerce",
        icon: "shopping-cart",
        desc: "WordPress commerce at scale",
        longDescription: "WooCommerce builds tuned for performance at scale — the flexibility of WordPress commerce without the plugin bloat that slows most stores down.",
      },
      {
        label: "Marketplace Development",
        href: "/services/commerce/marketplace",
        icon: "store",
        desc: "Multi-vendor platforms",
        longDescription: "Multi-vendor marketplace platforms — vendor onboarding, split payments, and moderation — built to handle real transaction volume.",
      },
      {
        label: "Custom Commerce Builds",
        href: "/services/commerce/custom",
        icon: "package",
        desc: "Bespoke checkout and ops",
        longDescription: "Fully custom commerce builds for businesses whose checkout, inventory, or fulfillment logic doesn't fit an off-the-shelf platform.",
      },
      {
        label: "Apps & Plugins",
        href: "/services/commerce/apps-plugins",
        icon: "puzzle",
        desc: "Extend your storefront",
        longDescription: "Custom apps and plugins that extend your existing storefront with the exact feature a template can't provide, without a full platform rebuild.",
      },
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
      {
        label: "AI Strategy & Implementation",
        href: "/services/ai/strategy",
        icon: "brain",
        desc: "Where AI actually pays off",
        longDescription: "We start by identifying where AI actually saves time or money in your workflow, then implement it — no strategy decks without a shipped result.",
      },
      {
        label: "Custom AI Agents & RAG Workflows",
        href: "/services/ai/agents-rag",
        icon: "bot",
        desc: "Grounded, tool-using agents",
        longDescription: "AI agents grounded in your own data and tools — not open-ended chatbots — built to complete real tasks with guardrails around what they can do.",
      },
      {
        label: "Process & Document Automation",
        href: "/services/ai/automation",
        icon: "workflow",
        desc: "Capture → review → approve",
        longDescription: "Automating repetitive document and approval workflows — capture, review, approve — so your team spends less time on manual data entry.",
      },
      {
        label: "Knowledge Base & LLM Integrations",
        href: "/services/ai/llm-integrations",
        icon: "book-open",
        desc: "Answers from your own docs",
        longDescription: "LLM-powered search and Q&A grounded in your own documentation, so answers come from your actual knowledge base, not a generic model's guess.",
      },
    ],
  },
];

/** "How We Engage" — shared, identical content in both the Services and Industries mega menus. */
export type EngagementModel = {
  label: string;
  href: string;
  icon: string;
  desc: string;
  longDescription: string;
};

export const ENGAGEMENT_MODELS: EngagementModel[] = [
  {
    label: "MVP Sprint",
    href: "/engagement/mvp-sprint",
    icon: "zap",
    desc: "Idea → product in 6–10 weeks",
    longDescription: "A focused 6–10 week sprint to take a validated idea to a working, launchable product — scoped tightly enough to actually ship on time.",
  },
  {
    label: "End-to-End Delivery",
    href: "/engagement/end-to-end-delivery",
    icon: "layers",
    desc: "Full-cycle product ownership",
    longDescription: "We own the full delivery cycle — design, engineering, QA, and launch — so you get one accountable team instead of coordinating several vendors.",
  },
  {
    label: "Dedicated Product Team",
    href: "/engagement/dedicated-team",
    icon: "users",
    desc: "Embedded team, your roadmap",
    longDescription: "An embedded, dedicated team that works your roadmap and your sprint cadence, functioning as an extension of your own product org.",
  },
  {
    label: "Team Augmentation",
    href: "/engagement/team-augmentation",
    icon: "user-plus",
    desc: "Engineers who ramp fast",
    longDescription: "Individual engineers or designers who slot into your existing team and process, ramping fast without adding management overhead.",
  },
  {
    label: "Global Delivery",
    href: "/engagement/global-delivery",
    icon: "globe",
    desc: "Near-shore + offshore hybrid",
    longDescription: "A hybrid near-shore/offshore delivery model that keeps timezone overlap with your team while managing cost across the full project.",
  },
];

/** Industries mega menu — "Industries We Serve" center column. */
export type IndustryLink = {
  label: string;
  href: string;
  icon: string;
  desc: string;
  /** One real paragraph — used as the intro copy on this industry's own detail page */
  summary: string;
  /** Short outcome framing, shown as a supporting line on the detail page */
  outcome: string;
  /** 3 representative systems/workflows we build for this vertical */
  systems: string[];
};

export const INDUSTRIES: IndustryLink[] = [
  {
    label: "SaaS",
    href: "/industries/saas",
    icon: "cloud",
    desc: "Scalable B2B & B2C products",
    summary: "Dashboards, onboarding, billing, analytics, and product workflows that can scale past the first launch.",
    outcome: "Retention-ready product systems",
    systems: ["MVP", "Billing", "Analytics"],
  },
  {
    label: "eCommerce & Retail",
    href: "/industries/ecommerce",
    icon: "shopping-cart",
    desc: "Stores that convert at scale",
    summary: "Headless storefronts, Shopify/WooCommerce builds, checkout flows, subscriptions, and owner-ready CMS operations.",
    outcome: "Fast storefronts and cleaner ops",
    systems: ["Storefront", "Checkout", "CMS"],
  },
  {
    label: "FinTech",
    href: "/industries/fintech",
    icon: "credit-card",
    desc: "Finance built to move fast",
    summary: "Secure workflows, data-heavy dashboards, onboarding journeys, reporting, and integration-ready platforms.",
    outcome: "Trusted product and data flows",
    systems: ["KYC", "Data", "Security"],
  },
  {
    label: "Real Estate",
    href: "/industries/real-estate",
    icon: "building-2",
    desc: "Platforms buyers trust",
    summary: "Property portals, listing systems, lead routing, deal visibility, CRM sync, and maintainable CMS workflows.",
    outcome: "Lead-to-listing clarity",
    systems: ["Listings", "CRM", "Portal"],
  },
  {
    label: "Logistics",
    href: "/industries/logistics",
    icon: "truck",
    desc: "Ops that move without friction",
    summary: "Tracking dashboards, dispatch tools, approval flows, route visibility, reporting, and AI-assisted operations.",
    outcome: "Operational visibility in motion",
    systems: ["Dispatch", "Tracking", "Reports"],
  },
  {
    label: "Travel & Hospitality",
    href: "/industries/travel",
    icon: "plane",
    desc: "Experiences that book",
    summary: "Booking experiences, itinerary flows, vendor integrations, membership journeys, and premium CMS systems.",
    outcome: "Premium planning experiences",
    systems: ["Booking", "Vendors", "Membership"],
  },
  {
    label: "Professional Services",
    href: "/industries/professional-services",
    icon: "briefcase",
    desc: "Service firms that grow",
    summary: "Premium websites, portals, CRM workflows, proposal flows, booking systems, and internal automation.",
    outcome: "Sharper lead and delivery flow",
    systems: ["CRM", "Portal", "Automation"],
  },
  {
    label: "Luxury & Lifestyle",
    href: "/industries/luxury",
    icon: "gem",
    desc: "Brands built to endure",
    summary: "Premium brand websites, curated e-commerce, and CRM systems built for high-touch, relationship-driven sales.",
    outcome: "Brand experiences built to endure",
    systems: ["Storefront", "CRM", "Content"],
  },
  {
    label: "RMG & Fashion",
    href: "/industries/rmg",
    icon: "shirt",
    desc: "Supply chain to storefront",
    summary: "Production tracking, inventory visibility, approval systems, reporting, and operational dashboards.",
    outcome: "Cleaner production control",
    systems: ["Inventory", "Approvals", "Dashboards"],
  },
  {
    label: "Restaurant & Food",
    href: "/industries/restaurant-food",
    icon: "utensils",
    desc: "Hospitality that scales",
    summary: "Ordering systems, reservation flows, loyalty programs, and multi-location dashboards for hospitality operations.",
    outcome: "Smoother ordering and operations",
    systems: ["Ordering", "Reservations", "Loyalty"],
  },
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
      { label: "Contact", href: "/contact", icon: "message-circle" },
      { label: "Careers", href: "/company/careers", icon: "target" },
    ],
  },
];
