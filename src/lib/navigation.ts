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
