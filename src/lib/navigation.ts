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
  links: ServiceLink[];
};

export const SERVICE_COLUMNS: ServiceColumn[] = [
  {
    id: "design",
    blurb: "UX/UI, product strategy, and design systems built for real shipping.",
    number: "01",
    title: "Experience & Product Design",
    href: "/services/design",
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
    links: [
      { label: "AI Strategy & Implementation", href: "/services/ai/strategy", icon: "brain", desc: "Where AI actually pays off" },
      { label: "Custom AI Agents & RAG Workflows", href: "/services/ai/agents-rag", icon: "bot", desc: "Grounded, tool-using agents" },
      { label: "Process & Document Automation", href: "/services/ai/automation", icon: "workflow", desc: "Capture → review → approve" },
      { label: "Knowledge Base & LLM Integrations", href: "/services/ai/llm-integrations", icon: "book-open", desc: "Answers from your own docs" },
    ],
  },
];

/** Lucide icon name per dropdown item (rendered at 16px, 1.5px stroke). */
export const SIMPLE_MENUS: {
  id: string;
  label: string;
  links: { label: string; href: string; icon: string }[];
}[] = [
  {
    id: "industries",
    label: "Industries",
    links: [
      { label: "SaaS & Technology", href: "/industries/saas", icon: "building-2" },
      { label: "eCommerce & Retail", href: "/industries/ecommerce", icon: "shopping-cart" },
      { label: "Real Estate", href: "/industries/real-estate", icon: "home" },
      { label: "Logistics", href: "/industries/logistics", icon: "truck" },
      { label: "Travel", href: "/industries/travel", icon: "plane" },
      { label: "Professional Services", href: "/industries/professional-services", icon: "briefcase" },
      { label: "FinTech", href: "/industries/fintech", icon: "landmark" },
      { label: "RMG", href: "/industries/rmg", icon: "shirt" },
    ],
  },
  {
    id: "how-we-work",
    label: "How We Work",
    links: [
      { label: "Delivery Process", href: "/how-we-work/process", icon: "route" },
      { label: "Engagement Models", href: "/how-we-work/engagement", icon: "handshake" },
      { label: "Handover & Support", href: "/how-we-work/handover", icon: "package-check" },
    ],
  },
  {
    id: "insights",
    label: "Insights",
    links: [
      { label: "Blog", href: "/insights/blog", icon: "newspaper" },
      { label: "Guides", href: "/insights/guides", icon: "book-open" },
      { label: "Newsletter", href: "/insights/newsletter", icon: "mail" },
    ],
  },
  {
    id: "company",
    label: "Company",
    links: [
      { label: "About", href: "/company/about", icon: "info" },
      { label: "Team", href: "/company/team", icon: "users" },
      { label: "Careers", href: "/company/careers", icon: "briefcase" },
      { label: "Contact", href: "/company/contact", icon: "message-square" },
    ],
  },
];
