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

/*
 * Services, service groups, How We Engage, the Services mega menu's
 * featured card and quick-access chips all live in src/data/services.ts
 * (the single source of truth for the service structure).
 */

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

/** Industries mega menu — right column "Popular verticals" chips. */
export const INDUSTRIES_POPULAR: { label: string; href: string }[] = [
  { label: "SaaS", href: "/industries/saas" },
  { label: "FinTech", href: "/industries/fintech" },
  { label: "eCommerce", href: "/industries/ecommerce" },
  { label: "Luxury", href: "/industries/luxury" },
  { label: "Travel", href: "/industries/travel" },
];

/** Industries mega menu — right column dark "Case Study" card. */
export const INDUSTRIES_FEATURED = {
  eyebrow: "Retail & Business Ops · Featured",
  body: "A SaaS-ready POS, inventory, and accounting platform built for growing businesses",
  href: "/case-studies/acculance",
  icon: "shopping-cart",
};

/** Lucide icon name per dropdown item (rendered at 16px, 1.5px stroke). */
export const SIMPLE_MENUS: {
  id: string;
  label: string;
  /** Renders a hairline divider immediately after this 0-based link index. */
  dividerAfterIndex?: number;
  links: { label: string; href: string; icon: string }[];
  /**
   * Set to false to hide this menu from the nav without deleting its data —
   * Insights is disabled for now (only Blog is live; Playbooks/Webinars/
   * Podcasts/etc. are still stubs), and Navbar/MobileMenu just renders a
   * plain "Blog" link in its place. Flip back to true (or omit) once the
   * rest of Insights has real content and it should return as a dropdown.
   */
  enabled?: boolean;
}[] = [
  {
    id: "insights",
    label: "Insights",
    enabled: false,
    dividerAfterIndex: 2,
    links: [
      { label: "Blog", href: "/blog", icon: "file-text" },
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
    dividerAfterIndex: 0,
    links: [
      { label: "About", href: "/company/about", icon: "building-2" },
      // Hidden until these pages are real (they currently render the
      // "coming soon" stub from app/[...slug]/page.tsx). Uncomment each
      // one as its page is built, and restore dividerAfterIndex: 4 once
      // all four sit between About and Contact again.
      // { label: "Leadership Team", href: "/company/leadership", icon: "users" },
      // { label: "Life at CodeShaper", href: "/company/life", icon: "sparkles" },
      // { label: "Clients & Partners", href: "/company/clients", icon: "handshake" },
      // { label: "Locations", href: "/company/locations", icon: "map-pin" },
      { label: "Contact", href: "/contact", icon: "message-circle" },
      // { label: "Careers", href: "/company/careers", icon: "target" },
    ],
  },
];
