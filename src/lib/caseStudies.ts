/**
 * Case study data. Only three real, verified projects exist right now —
 * Fennec, Essentialist, and Acculance (the same three marked "real" in
 * CaseStudiesExpand.tsx on the homepage). No placeholder/invented case
 * studies are added here: a hub page whose entire premise is "proof, not
 * promises" would undermine itself by padding the grid with fabricated
 * companies and results, unlike a homepage teaser card where a clearly
 * generic filler blurb reads as less consequential.
 *
 * Fields are intentionally optional past the base set. Essentialist has
 * every rich section because the user supplied that full case study
 * (dates, team, tech, a real client quote) directly. Fennec and Acculance
 * only carry what's already established elsewhere in the codebase
 * (CaseStudiesExpand.tsx's project descriptions/categories/stats) —
 * their detail pages render a leaner template rather than inventing
 * timelines, teams, challenges, or outcome numbers that were never
 * confirmed. CaseStudyDetail.tsx renders each section only when its data
 * is present, so the template scales up automatically as more real case
 * studies (with more real detail) are added later.
 */
export type Stat = { value: string; label: string };
export type Solution = { problem: string; decision: string; whyItWorked: string };
export type GalleryImage = { src: string; caption: string };

export type CaseStudy = {
  slug: string;
  project: string;
  /** Outcome-first H1 */
  headline: string;
  /** 1–2 line context, used on cards and as the hero sub */
  summary: string;
  industry: string;
  services: string[];
  engagementModel?: string;
  tech: string[];
  platforms?: string;
  image: string;
  accent: string;
  /** Impact stats strip — 2–5 items, all honest/categorical, never invented numbers */
  stats: Stat[];

  timeline?: string;
  team?: string;
  liveUrl?: string;

  challenge?: string[];
  risk?: string;

  goals?: {
    business: string[];
    user: string[];
    engineering: string[];
  };

  deliverables?: string[];

  approach?: string[];
  cadence?: string;

  solutions?: Solution[];

  /** Tiered proof — only include the tiers that are actually real for this project */
  results?: {
    operational?: string[];
    qualitative?: string[];
  };

  gallery?: GalleryImage[];

  testimonial?: { quote: string; name: string; role: string };

  whatsNext?: string[];
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "essentialist",
    project: "Essentialist",
    headline: "Launched a premium membership experience in 8–10 weeks — built for trust, conversion, and fast publishing.",
    summary:
      "Essentialist is a luxury travel membership brand for high-income travelers in the US & EU. CodeShaper delivered the full launch — marketing website, membership application flow, CMS operations, and ongoing care — so the team could grow applications and publish content faster without engineering bottlenecks.",
    industry: "Luxury Travel",
    services: ["UI/UX Design", "Website Design & Development", "Website Maintenance"],
    engagementModel: "End-to-End Delivery",
    tech: ["WordPress", "GSAP", "Custom Frontend"],
    platforms: "Marketing Website + Application Flow",
    image: "https://picsum.photos/seed/essentialist-travel/1200/800",
    accent: "#d97fc4",
    stats: [
      { value: "8–10 weeks", label: "Time to launch" },
      { value: "Weekly", label: "Demos & reviews" },
      { value: "CMS-enabled", label: "Faster publishing" },
      { value: "Ongoing", label: "Care & maintenance" },
    ],
    timeline: "Nov 2020 → Jan 2021 (~8–10 weeks)",
    team: "PM + UI/UX + Frontend + WordPress (4 roles)",
    liveUrl: "https://essentialist.com",
    challenge: [
      "Needed a premium brand feel (luxury/editorial) without looking like a template",
      "The membership application flow had to build trust quickly and stay frictionless",
      "Content updates needed to be fast and safe for editors — no dev dependency",
      "Media-heavy pages risked slow performance if not handled carefully",
      "SEO had to be right from day one to avoid launch visibility issues",
      "Delivery needed speed without sacrificing polish inside a tight launch window",
    ],
    risk:
      "A launch with weak UX or slow performance would reduce applications, hurt brand perception, and create ongoing operational friction.",
    goals: {
      business: [
        "Improve membership applications with a high-trust experience",
        "Establish premium brand perception from the first impression",
        "Enable faster publishing for content-led growth",
      ],
      user: [
        "Understand the value quickly",
        "Move through the application with clarity and confidence",
        "Experience a polished, fast, premium interface",
      ],
      engineering: [
        "A CMS that editors can use safely",
        "Maintainable components and clean handover",
        "Strong foundation for SEO + analytics measurement",
      ],
    },
    deliverables: [
      "UX flows + application journey refinement",
      "High-fidelity UI screens + responsive layouts",
      "Component system / design patterns for consistency",
      "Marketing site build (Home, Membership, Editors, About, FAQs, Contact)",
      "Membership application flow implementation",
      "WordPress CMS setup for content operations",
      "Technical SEO foundation (IA + on-page structure + indexing basics)",
      "Performance foundations for media-heavy pages",
      "Documentation + handover package",
      "Ongoing care & maintenance (post-launch)",
    ],
    approach: [
      "Discovery kickoff + content/brand alignment",
      "Prioritization + launch scope definition",
      "UX/UI design + iterations with stakeholder feedback",
      "Engineering build + CMS setup",
      "QA + launch readiness checks",
      "Release + post-launch support (maintenance loop)",
    ],
    cadence: "Weekly demos · shared board visibility · iterative reviews · release checkpoints",
    solutions: [
      {
        problem: "Luxury brands lose trust instantly if the UI feels generic",
        decision: "Built a clean editorial layout system with consistent typography, spacing, and component rhythm",
        whyItWorked: "The experience felt premium while staying scalable and easy to maintain",
      },
      {
        problem: "Membership applications can feel intimidating or unclear",
        decision: "Reduced cognitive load: clear structure, concise steps, and supportive microcopy",
        whyItWorked: "Users could understand the value and proceed without friction",
      },
      {
        problem: "Teams need fast content publishing, but layouts can break easily",
        decision: "CMS content patterns with guardrails — repeatable blocks, safe sections",
        whyItWorked: "Editors could publish updates quickly without engineering dependency",
      },
      {
        problem: "Media-heavy pages can become slow quickly",
        decision: "Media optimization patterns — compression guidelines, lazy-loading, correct priority handling",
        whyItWorked: "Maintained premium visuals without sacrificing speed",
      },
      {
        problem: "New launches often miss technical SEO basics",
        decision: "Clean IA, internal linking, metadata discipline, and indexability setup",
        whyItWorked: "Reduced long-term SEO cleanup and set a foundation for growth",
      },
    ],
    results: {
      operational: [
        "Delivered launch in ~8–10 weeks",
        "Weekly demos ensured alignment and fast iteration",
        "CMS enabled faster content publishing",
        "Clean handover + ongoing maintenance established",
      ],
      qualitative: [
        "Stakeholder feedback highlighted responsiveness and openness to changes",
        "Premium visual execution strengthened brand perception at launch",
      ],
    },
    gallery: [
      { src: "https://picsum.photos/seed/essentialist-home/1200/800", caption: "Homepage built for premium clarity — value proposition within the first scroll" },
      { src: "https://picsum.photos/seed/essentialist-apply/1200/800", caption: "Application flow optimized for trust and low friction" },
      { src: "https://picsum.photos/seed/essentialist-editors/1200/800", caption: "Editors page designed to reinforce credibility" },
    ],
    testimonial: {
      quote:
        "This was a web development project and we were very pleased with the service and responsiveness… Definitely recommend this seller!",
      name: "Joan Roca",
      role: "Founder & CEO, Essentialist",
    },
    whatsNext: [
      "Iterative testing on the application flow — copy, steps, positioning",
      "Performance and SEO growth improvements with measurable baselines",
      "New landing pages for campaigns and partnerships",
      "Content expansion without engineering bottlenecks",
      "Further integrations if needed — CRM/email segmentation, analytics deepening",
    ],
  },
  {
    slug: "fennec",
    project: "Fennec",
    headline: "Unified nightlife operations into one connected web and mobile platform.",
    summary:
      "Fennec brings venues, guests, events, and memberships together in a single connected platform — a web app for operators and a mobile app for guests, built and supported as an ongoing engagement.",
    industry: "Nightlife & Hospitality",
    services: ["Custom Web Apps", "Mobile App Development", "Product Discovery & Strategy"],
    tech: ["Web App", "Mobile App"],
    platforms: "Web + Mobile",
    image: "https://picsum.photos/seed/fennec-nightlife/1200/800",
    accent: "#8a7bff",
    stats: [
      { value: "Web + App", label: "Platforms shipped" },
      { value: "Ongoing", label: "Engagement" },
    ],
    deliverables: [
      "Web application for venue and event operations",
      "Companion mobile app for guests",
      "Membership and event management workflows",
      "Ongoing feature development and support",
    ],
    approach: [
      "Discovery and scope alignment",
      "UX/UI design across web and mobile",
      "Engineering build and QA",
      "Release, then continuous iteration as an ongoing engagement",
    ],
    cadence: "Weekly demos · shared board visibility · continuous iteration",
    gallery: [
      { src: "https://picsum.photos/seed/fennec-venues/1200/800", caption: "Venue operations, in one place" },
      { src: "https://picsum.photos/seed/fennec-guests/1200/800", caption: "Guest-facing mobile experience" },
    ],
  },
  {
    slug: "acculance",
    project: "Acculance",
    headline: "Built a SaaS-ready POS, inventory, and accounting platform for growing businesses.",
    summary:
      "Acculance unifies point-of-sale, inventory, and accounting into one platform, built on Laravel and Vue for businesses that have outgrown spreadsheets and disconnected tools.",
    industry: "Retail & Business Ops",
    services: ["SaaS Development", "Custom Web Apps"],
    tech: ["Laravel", "Vue"],
    platforms: "Web (Admin + POS)",
    image: "https://picsum.photos/seed/acculance-pos/1200/800",
    accent: "#5b9bdb",
    stats: [
      { value: "3 Modules", label: "POS · Inventory · Accounting" },
      { value: "Laravel / Vue", label: "Stack" },
    ],
    deliverables: [
      "Point-of-sale module",
      "Inventory tracking module",
      "Accounting module",
      "SaaS-ready multi-tenant foundation",
    ],
    approach: [
      "Discovery and module scoping",
      "UX/UI design for POS and back-office flows",
      "Engineering build across all three modules",
      "QA, release, and iteration",
    ],
    cadence: "Weekly demos · shared board visibility · release checkpoints",
    gallery: [
      { src: "https://picsum.photos/seed/acculance-dashboard/1200/800", caption: "Unified dashboard across POS, inventory, and accounting" },
      { src: "https://picsum.photos/seed/acculance-inventory/1200/800", caption: "Inventory tracking built for growing catalogs" },
    ],
  },
];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug);
}

export function getRelatedCaseStudies(current: CaseStudy, count = 3): CaseStudy[] {
  return CASE_STUDIES.filter((c) => c.slug !== current.slug).slice(0, count);
}

export const CASE_STUDY_INDUSTRIES: string[] = Array.from(new Set(CASE_STUDIES.map((c) => c.industry)));
