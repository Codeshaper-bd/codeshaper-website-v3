/**
 * Single source of truth for CodeShaper's service structure.
 *
 * Every place on the site that lists or links to services — header mega
 * menu, mobile nav, homepage tabs, footer, FAQ, contact form, sitemap,
 * the /services hub, group pages, and service detail pages — reads from
 * this file. Do not hardcode service names, slugs, or routes anywhere
 * else.
 *
 * Routes:
 *   /services/<group-slug>    group page
 *   /services/<service-slug>  service detail page
 * Group and service slugs share the /services/ namespace, so they must
 * never collide (asserted at the bottom of this file).
 *
 * Copy marked `// REVIEW` is a first draft and needs a human check before
 * launch: every service `summary`, every `metaDescription`, and the
 * renamed engagement-model copy.
 */

import { SITE_NAME } from "@/lib/site";

export const COMPANY_POSITIONING = "AI Engineering & Software Development Company";

const brand = (title: string) => `${title} | ${SITE_NAME}`;

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type ServiceGroupSlug =
  | "ai-agents-automation"
  | "ai-software-development"
  | "ai-integration-infrastructure"
  | "ui-ux-product-design"
  | "websites-commerce";

export type Service = {
  /** Short label for menus and chips */
  menuLabel: string;
  /** Full keyword-rich name, used as the page H1 */
  title: string;
  slug: string;
  groupSlug: ServiceGroupSlug;
  /** Only used inside Websites & Commerce */
  subgroup?: string;
  /** One sentence shown on cards and as the detail page intro */
  summary: string;
  /** "<title> | CodeShaper" */
  metaTitle: string;
  /** 140–160 characters, includes the main keyword */
  metaDescription: string;
  /** Lucide icon key (see lib/icons.tsx) */
  icon: string;
};

export type ServiceGroup = {
  slug: ServiceGroupSlug;
  /** Group name — used in menus, tabs, footer, and as the group page H1 */
  name: string;
  /** One-line focus statement shown under the group name */
  focus: string;
  /** Flagship group carries the "New" badge */
  flagship?: boolean;
  icon: string;
  /** Subgroup names in display order (Websites & Commerce only) */
  subgroups?: string[];
  /** Slugs whose menu labels make up the grey descriptor line in the mega menu (5–6) */
  descriptorSlugs: string[];
  metaTitle: string;
  metaDescription: string;
};

/* -------------------------------------------------------------------------- */
/* Groups (locked order)                                                      */
/* -------------------------------------------------------------------------- */

export const SERVICE_GROUPS: ServiceGroup[] = [
  {
    slug: "ai-agents-automation",
    name: "AI Agents & Automation",
    focus: "Reliable AI automation that executes real business tasks inside the systems clients already use.",
    flagship: true,
    icon: "sparkles",
    descriptorSlugs: [
      "ai-consulting",
      "ai-agent-development",
      "ai-workflow-automation",
      "ai-chatbot-development",
      "voice-ai-agents",
      "intelligent-document-processing",
    ],
    metaTitle: brand("AI Agents & Automation Services"),
    // REVIEW
    metaDescription:
      "AI agents and automation services that execute real business tasks inside your existing systems, with human approvals, logging, testing and monitoring.",
  },
  {
    slug: "ai-software-development",
    name: "AI & Software Development",
    focus: "AI-powered SaaS products, MVPs and business applications built to scale.",
    icon: "code-2",
    descriptorSlugs: [
      "saas-development",
      "mvp-development",
      "generative-ai-development",
      "web-application-development",
      "mobile-app-development",
      "qa-test-automation",
    ],
    metaTitle: brand("AI & Software Development Services"),
    // REVIEW
    metaDescription:
      "AI and software development services for SaaS products, MVPs, web, mobile and enterprise applications, built production-ready and designed to scale.",
  },
  {
    slug: "ai-integration-infrastructure",
    name: "AI Integration & Infrastructure",
    focus: "Connecting AI to existing systems and data, and running it securely and reliably in production.",
    icon: "network",
    descriptorSlugs: [
      "ai-integration",
      "rag-development",
      "mcp-server-development",
      "data-engineering",
      "private-llm",
      "llmops",
    ],
    metaTitle: brand("AI Integration & Infrastructure Services"),
    // REVIEW
    metaDescription:
      "AI integration and infrastructure services: connect AI to your systems and data, deploy private LLMs, and run AI securely with LLMOps and monitoring.",
  },
  {
    slug: "ui-ux-product-design",
    name: "UI/UX & Product Design",
    focus: "Intuitive, accessible product experiences, including interfaces for AI products.",
    icon: "pen-tool",
    descriptorSlugs: ["ui-ux-design", "product-discovery", "ai-ux-design", "design-systems", "ux-research"],
    metaTitle: brand("UI/UX & Product Design Services"),
    // REVIEW
    metaDescription:
      "UI/UX and product design services for web, mobile and AI products: research, discovery, design systems and accessible interfaces users understand.",
  },
  {
    slug: "websites-commerce",
    name: "Websites & Commerce",
    focus: "Websites and stores that get found in Google and AI search, and convert.",
    icon: "globe",
    subgroups: ["Websites & Growth", "Commerce Development"],
    descriptorSlugs: [
      "website-development",
      "wordpress-development",
      "seo-aeo",
      "shopify-development",
      "woocommerce-development",
      "headless-commerce",
    ],
    metaTitle: brand("Websites & Commerce Services"),
    // REVIEW
    metaDescription:
      "Website and eCommerce development services: WordPress, Webflow, Shopify and WooCommerce builds optimized for Google and AI search, and built to convert.",
  },
];

/* -------------------------------------------------------------------------- */
/* Services (locked names, order, and slugs)                                  */
/* -------------------------------------------------------------------------- */

type ServiceInput = Omit<Service, "metaTitle">;

const SERVICE_INPUTS: ServiceInput[] = [
  /* 1. AI Agents & Automation ------------------------------------------------ */
  {
    menuLabel: "AI Strategy & Consulting",
    title: "AI Strategy & Consulting Services",
    slug: "ai-consulting",
    groupSlug: "ai-agents-automation",
    icon: "brain",
    // REVIEW
    summary:
      "We map where AI will actually save time or money in your operations, then turn it into a scoped, costed roadmap your team can build on.",
    // REVIEW
    metaDescription:
      "AI strategy and consulting services that identify high-value use cases, check data readiness and deliver a practical roadmap to production-ready AI.",
  },
  {
    menuLabel: "Custom AI Agents",
    title: "Custom AI Agent Development",
    slug: "ai-agent-development",
    groupSlug: "ai-agents-automation",
    icon: "bot",
    // REVIEW
    summary:
      "Custom AI agents that complete real tasks inside your CRM, helpdesk and internal tools, with human approval steps, logging and testing built in.",
    // REVIEW
    metaDescription:
      "Custom AI agent development for real business tasks: agents that work inside your existing tools, with human approvals, audit logs, testing and monitoring.",
  },
  {
    menuLabel: "AI Workflow Automation",
    title: "AI Workflow & Business Process Automation",
    slug: "ai-workflow-automation",
    groupSlug: "ai-agents-automation",
    icon: "workflow",
    // REVIEW
    summary:
      "We automate repetitive, multi-step business processes with AI, connecting the tools you already use and keeping a person in the loop where it matters.",
    // REVIEW
    metaDescription:
      "AI workflow and business process automation that connects your existing tools, removes manual steps and keeps human approval where decisions matter.",
  },
  {
    menuLabel: "AI Chatbots & Assistants",
    title: "AI Chatbot & Virtual Assistant Development",
    slug: "ai-chatbot-development",
    groupSlug: "ai-agents-automation",
    icon: "message-square",
    // REVIEW
    summary:
      "Chatbots and virtual assistants grounded in your own content and systems, with a clear handoff to a person when a question needs one.",
    // REVIEW
    metaDescription:
      "AI chatbot and virtual assistant development for support, sales and internal teams, grounded in your data and integrated with your tools, with human handoff.",
  },
  {
    menuLabel: "Voice AI Agents",
    title: "Voice AI Agent Development",
    slug: "voice-ai-agents",
    groupSlug: "ai-agents-automation",
    icon: "mic",
    // REVIEW
    summary:
      "Voice AI agents that answer calls, book appointments and qualify leads, integrated with your phone system and CRM and monitored in production.",
    // REVIEW
    metaDescription:
      "Voice AI agent development for inbound and outbound calls: booking, qualification and support agents integrated with your phone system, CRM and calendar.",
  },
  {
    menuLabel: "Document Processing",
    title: "Intelligent Document Processing & Automation",
    slug: "intelligent-document-processing",
    groupSlug: "ai-agents-automation",
    icon: "file-text",
    // REVIEW
    summary:
      "We extract, classify and validate data from invoices, forms and contracts, routing exceptions to your team for review before anything is posted.",
    // REVIEW
    metaDescription:
      "Intelligent document processing that extracts and validates data from invoices, forms and contracts, with human review of exceptions and full audit logs.",
  },

  /* 2. AI & Software Development --------------------------------------------- */
  {
    menuLabel: "SaaS Development",
    title: "SaaS Application Development",
    slug: "saas-development",
    groupSlug: "ai-software-development",
    icon: "layers",
    // REVIEW
    summary:
      "Multi-tenant SaaS products with billing, roles, analytics and AI features, engineered to scale from your first customers to thousands.",
    // REVIEW
    metaDescription:
      "SaaS application development from architecture to launch: multi-tenant platforms with billing, roles, analytics and AI features, built to scale reliably.",
  },
  {
    menuLabel: "MVP Development",
    title: "MVP Development Services",
    slug: "mvp-development",
    groupSlug: "ai-software-development",
    icon: "zap",
    // REVIEW
    summary:
      "A focused first version of your product, scoped to test your riskiest assumptions and built on a codebase you can keep growing.",
    // REVIEW
    metaDescription:
      "MVP development services that turn your idea into a launchable product in weeks, scoped around real user value and built on a codebase ready to scale.",
  },
  {
    menuLabel: "Generative AI Apps",
    title: "Generative AI Application Development",
    slug: "generative-ai-development",
    groupSlug: "ai-software-development",
    icon: "wand-2",
    // REVIEW
    summary:
      "Applications built on large language models, from copilots to search and content tools, with evaluation, guardrails and cost controls from day one.",
    // REVIEW
    metaDescription:
      "Generative AI application development: LLM-powered copilots, search and content tools with evaluation, guardrails and cost controls built in from day one.",
  },
  {
    menuLabel: "Custom Web Apps",
    title: "Custom Web Application Development",
    slug: "web-application-development",
    groupSlug: "ai-software-development",
    icon: "monitor",
    // REVIEW
    summary:
      "Custom web applications, from dashboards to portals and internal tools, built on a modern, maintainable stack and tested before every release.",
    // REVIEW
    metaDescription:
      "Custom web application development for dashboards, customer portals and internal tools, built on a modern stack with automated testing and clean handover.",
  },
  {
    menuLabel: "Enterprise Apps & Portals",
    title: "Enterprise Applications & Business Portals",
    slug: "enterprise-applications",
    groupSlug: "ai-software-development",
    icon: "building-2",
    // REVIEW
    summary:
      "Business portals and enterprise applications shaped around how your teams work, with role-based access, integrations and audit trails.",
    // REVIEW
    metaDescription:
      "Enterprise application and business portal development with role-based access, integrations with your ERP and CRM, audit trails and secure deployment.",
  },
  {
    menuLabel: "Mobile App Development",
    title: "Mobile Application Development",
    slug: "mobile-app-development",
    groupSlug: "ai-software-development",
    icon: "smartphone",
    // REVIEW
    summary:
      "Native and cross-platform iOS and Android apps, built for performance and shipped through App Store and Google Play review.",
    // REVIEW
    metaDescription:
      "Mobile application development for iOS and Android, native or cross-platform, from UX to App Store release, with analytics, testing and ongoing support.",
  },
  {
    menuLabel: "QA & Test Automation",
    title: "QA & Test Automation Services",
    slug: "qa-test-automation",
    groupSlug: "ai-software-development",
    icon: "flask-conical",
    // REVIEW
    summary:
      "Automated and manual testing across web, mobile and APIs, so every release is verified before it reaches your users.",
    // REVIEW
    metaDescription:
      "QA and test automation services covering web, mobile and APIs: automated regression suites, CI integration and manual testing for confident releases.",
  },

  /* 3. AI Integration & Infrastructure --------------------------------------- */
  {
    menuLabel: "AI Integration",
    title: "Enterprise AI & Business Systems Integration",
    slug: "ai-integration",
    groupSlug: "ai-integration-infrastructure",
    icon: "plug",
    // REVIEW
    summary:
      "We connect AI models to your ERP, CRM, data warehouse and internal systems, with secure access controls and reliable APIs between them.",
    // REVIEW
    metaDescription:
      "Enterprise AI integration services that connect LLMs to your ERP, CRM and internal business systems through secure APIs, with access controls and monitoring.",
  },
  {
    menuLabel: "RAG & Knowledge Bases",
    title: "RAG & Enterprise Knowledge Systems",
    slug: "rag-development",
    groupSlug: "ai-integration-infrastructure",
    icon: "book-open",
    // REVIEW
    summary:
      "Retrieval-augmented generation systems that answer from your own documents and data, with sources cited and accuracy measured.",
    // REVIEW
    metaDescription:
      "RAG development and enterprise knowledge systems that answer from your own documents and data, with cited sources, access controls and measured accuracy.",
  },
  {
    menuLabel: "MCP Server Development",
    title: "MCP Server & Tool Development",
    slug: "mcp-server-development",
    groupSlug: "ai-integration-infrastructure",
    icon: "server",
    // REVIEW
    summary:
      "Model Context Protocol servers and tools that give AI assistants safe, permissioned access to your systems and data.",
    // REVIEW
    metaDescription:
      "MCP server and tool development that gives AI assistants and agents secure, permissioned access to your internal systems, APIs and business data sources.",
  },
  {
    menuLabel: "Data Engineering & AI Readiness",
    title: "Data Engineering & AI Readiness",
    slug: "data-engineering",
    groupSlug: "ai-integration-infrastructure",
    icon: "database",
    // REVIEW
    summary:
      "Data pipelines, warehouses and clean, well-governed datasets that make your business ready for analytics and AI.",
    // REVIEW
    metaDescription:
      "Data engineering and AI readiness services: pipelines, warehouses and data quality work that make your business data reliable enough for analytics and AI.",
  },
  {
    menuLabel: "Legacy Modernization",
    title: "Legacy Software Modernization",
    slug: "legacy-modernization",
    groupSlug: "ai-integration-infrastructure",
    icon: "refresh-cw",
    // REVIEW
    summary:
      "We move legacy applications to a modern, supportable stack incrementally, keeping production data intact and downtime to a minimum.",
    // REVIEW
    metaDescription:
      "Legacy software modernization that migrates outdated applications to a modern, maintainable stack incrementally, with data intact and minimal downtime.",
  },
  {
    menuLabel: "Private & On-Prem AI",
    title: "Private AI & On-Premises LLM Deployment",
    slug: "private-llm",
    groupSlug: "ai-integration-infrastructure",
    icon: "lock",
    // REVIEW
    summary:
      "Large language models deployed in your own cloud or data center, so sensitive data never leaves your control.",
    // REVIEW
    metaDescription:
      "Private AI and on-premises LLM deployment in your own cloud or data center, keeping sensitive data under your control on secure, monitored infrastructure.",
  },
  {
    menuLabel: "Cloud, DevOps & Platform Engineering",
    title: "Cloud, DevOps & Platform Engineering",
    slug: "cloud-devops",
    groupSlug: "ai-integration-infrastructure",
    icon: "cloud",
    // REVIEW
    summary:
      "Cloud infrastructure, CI/CD pipelines and platform engineering that make deployments repeatable, secure and observable.",
    // REVIEW
    metaDescription:
      "Cloud, DevOps and platform engineering services: infrastructure as code, CI/CD pipelines, containers and monitoring for secure, repeatable deployments.",
  },
  {
    menuLabel: "LLMOps & AI Observability",
    title: "LLMOps, AI Evaluation & Observability",
    slug: "llmops",
    groupSlug: "ai-integration-infrastructure",
    icon: "activity",
    // REVIEW
    summary:
      "Evaluation suites, tracing, cost tracking and monitoring that keep AI systems accurate and reliable after launch.",
    // REVIEW
    metaDescription:
      "LLMOps, AI evaluation and observability services: test suites, tracing, cost tracking and monitoring that keep production AI systems accurate and reliable.",
  },
  {
    menuLabel: "AI Security & Governance",
    title: "AI Security & Governance",
    slug: "ai-security-governance",
    groupSlug: "ai-integration-infrastructure",
    icon: "shield",
    // REVIEW
    summary:
      "Access controls, data protection, red-teaming and governance policies that let you run AI safely and meet compliance requirements.",
    // REVIEW
    metaDescription:
      "AI security and governance services: access controls, prompt-injection testing, data protection and usage policies so you can run AI safely and compliantly.",
  },

  /* 4. UI/UX & Product Design ------------------------------------------------ */
  {
    menuLabel: "UI/UX Design",
    title: "UI/UX Design Services",
    slug: "ui-ux-design",
    groupSlug: "ui-ux-product-design",
    icon: "layout-dashboard",
    // REVIEW
    summary:
      "User flows, high-fidelity screens and clickable prototypes, designed to be accessible and tested with real users before development.",
    // REVIEW
    metaDescription:
      "UI/UX design services for web and mobile products: user flows, high-fidelity interfaces and clickable prototypes, accessible and tested with real users.",
  },
  {
    menuLabel: "Product Discovery & Strategy",
    title: "Product Discovery & Strategy",
    slug: "product-discovery",
    groupSlug: "ui-ux-product-design",
    icon: "compass",
    // REVIEW
    summary:
      "A focused discovery phase that turns an idea into a validated scope, roadmap and success metrics before you commit to a build.",
    // REVIEW
    metaDescription:
      "Product discovery and strategy services that turn ideas into validated scope, a prioritized roadmap and clear success metrics before development starts.",
  },
  {
    menuLabel: "AI & Conversational UX",
    title: "AI & Conversational UX Design",
    slug: "ai-ux-design",
    groupSlug: "ui-ux-product-design",
    icon: "message-circle",
    // REVIEW
    summary:
      "Interfaces for chat, copilots and agent workflows that show users what the AI is doing and keep them in control.",
    // REVIEW
    metaDescription:
      "AI and conversational UX design for chatbots, copilots and agent workflows, with interfaces that build trust, explain AI actions and keep users in control.",
  },
  {
    menuLabel: "Design Systems",
    title: "Design System Development",
    slug: "design-systems",
    groupSlug: "ui-ux-product-design",
    icon: "component",
    // REVIEW
    summary:
      "Documented libraries of components, tokens and patterns that keep design and engineering consistent as your product grows.",
    // REVIEW
    metaDescription:
      "Design system development: reusable components, design tokens and documentation that keep your product consistent and speed up design and engineering.",
  },
  {
    menuLabel: "UX Research & Testing",
    title: "UX Research & Usability Testing",
    slug: "ux-research",
    groupSlug: "ui-ux-product-design",
    icon: "users",
    // REVIEW
    summary:
      "Interviews, usability tests and analytics reviews that show where users struggle and what to fix first.",
    // REVIEW
    metaDescription:
      "UX research and usability testing services: user interviews, moderated tests and analytics reviews that reveal where users struggle and what to fix first.",
  },

  /* 5. Websites & Commerce — Websites & Growth ------------------------------- */
  {
    menuLabel: "Website Design & Development",
    title: "Website Design & Development",
    slug: "website-development",
    groupSlug: "websites-commerce",
    subgroup: "Websites & Growth",
    icon: "globe",
    // REVIEW
    summary:
      "Fast, accessible business websites built for search from day one, with a CMS your team can update without developers.",
    // REVIEW
    metaDescription:
      "Website design and development for fast, accessible, SEO-ready business websites with a CMS your team can manage, built to rank and convert visitors.",
  },
  {
    menuLabel: "WordPress Development",
    title: "WordPress Development Services",
    slug: "wordpress-development",
    groupSlug: "websites-commerce",
    subgroup: "Websites & Growth",
    icon: "layout-template",
    // REVIEW
    summary:
      "Custom WordPress themes, plugins and builds that stay fast, secure and easy for your team to edit.",
    // REVIEW
    metaDescription:
      "WordPress development services: custom themes, plugins and performance-tuned builds that are secure, fast and easy for your marketing team to manage.",
  },
  {
    menuLabel: "Webflow & Framer Development",
    title: "Webflow & Framer Development",
    slug: "webflow-framer-development",
    groupSlug: "websites-commerce",
    subgroup: "Websites & Growth",
    icon: "brush",
    // REVIEW
    summary:
      "Polished Webflow and Framer sites your marketing team can update and launch new pages on independently.",
    // REVIEW
    metaDescription:
      "Webflow and Framer development for polished, high-performance marketing sites your team can edit independently, with CMS setup, SEO and integrations.",
  },
  {
    menuLabel: "SEO & AI Search Optimization",
    title: "SEO & AI Search Optimization (AEO)",
    slug: "seo-aeo",
    groupSlug: "websites-commerce",
    subgroup: "Websites & Growth",
    icon: "search",
    // REVIEW
    summary:
      "Technical SEO, content structure and schema markup that help your site rank in Google and get cited by AI search assistants.",
    // REVIEW
    metaDescription:
      "SEO and AI search optimization (AEO) services: technical SEO, structured data and content strategy so you rank in Google and get cited in AI answers.",
  },
  {
    menuLabel: "Conversion Rate Optimization",
    title: "Conversion Rate Optimization (CRO)",
    slug: "cro",
    groupSlug: "websites-commerce",
    subgroup: "Websites & Growth",
    icon: "trending-up",
    // REVIEW
    summary:
      "Funnel audits, A/B tests and data-backed changes that lift sign-ups, leads and checkout conversion.",
    // REVIEW
    metaDescription:
      "Conversion rate optimization (CRO) services: funnel audits, A/B testing and data-backed UX changes that increase sign-ups, leads and checkout conversion.",
  },
  {
    menuLabel: "Website Maintenance",
    title: "Website Maintenance & Support",
    slug: "website-maintenance",
    groupSlug: "websites-commerce",
    subgroup: "Websites & Growth",
    icon: "life-buoy",
    // REVIEW
    summary:
      "Updates, backups, uptime monitoring and fixes after launch, so your site stays fast, secure and current.",
    // REVIEW
    metaDescription:
      "Website maintenance and support services: updates, security patches, backups, uptime monitoring and fixes that keep your website fast, secure and current.",
  },

  /* 5. Websites & Commerce — Commerce Development ---------------------------- */
  {
    menuLabel: "Shopify Development",
    title: "Shopify Development Services",
    slug: "shopify-development",
    groupSlug: "websites-commerce",
    subgroup: "Commerce Development",
    icon: "shopping-bag",
    // REVIEW
    summary:
      "Custom Shopify themes, apps and integrations for stores that have outgrown off-the-shelf templates.",
    // REVIEW
    metaDescription:
      "Shopify development services: custom themes, private apps, Shopify Plus builds and integrations for stores that need more than an off-the-shelf template.",
  },
  {
    menuLabel: "WooCommerce Development",
    title: "WooCommerce Development",
    slug: "woocommerce-development",
    groupSlug: "websites-commerce",
    subgroup: "Commerce Development",
    icon: "shopping-cart",
    // REVIEW
    summary:
      "WooCommerce stores tuned for performance and scale, with the flexibility of WordPress and none of the plugin bloat.",
    // REVIEW
    metaDescription:
      "WooCommerce development for fast, scalable WordPress stores: custom themes, plugins, payment and shipping integrations, and performance optimization.",
  },
  {
    menuLabel: "Headless Commerce",
    title: "Headless Commerce Development",
    slug: "headless-commerce",
    groupSlug: "websites-commerce",
    subgroup: "Commerce Development",
    icon: "package",
    // REVIEW
    summary:
      "Fast custom storefronts connected to Shopify, BigCommerce or commercetools, so you keep your commerce back end and gain front-end freedom.",
    // REVIEW
    metaDescription:
      "Headless commerce development: fast custom storefronts on Next.js connected to Shopify, BigCommerce or commercetools, built for speed and flexibility.",
  },
  {
    menuLabel: "Marketplace Development",
    title: "Marketplace Development",
    slug: "marketplace-development",
    groupSlug: "websites-commerce",
    subgroup: "Commerce Development",
    icon: "store",
    // REVIEW
    summary:
      "Multi-vendor marketplaces with vendor onboarding, split payments and moderation, built to handle real transaction volume.",
    // REVIEW
    metaDescription:
      "Marketplace development for multi-vendor platforms: vendor onboarding, split payments, search, reviews and moderation, built to scale with transactions.",
  },
  {
    menuLabel: "Agentic Commerce Readiness",
    title: "Agentic Commerce Readiness",
    slug: "agentic-commerce",
    groupSlug: "websites-commerce",
    subgroup: "Commerce Development",
    icon: "cpu",
    // REVIEW
    summary:
      "We prepare your catalog, product feeds and checkout so AI shopping agents and assistants can find, compare and buy your products.",
    // REVIEW
    metaDescription:
      "Agentic commerce readiness: structured product data, feeds and checkout integrations so AI shopping agents and assistants can discover and buy your products.",
  },
  {
    menuLabel: "eCommerce Migration",
    title: "eCommerce Migration & Integration",
    slug: "ecommerce-migration",
    groupSlug: "websites-commerce",
    subgroup: "Commerce Development",
    icon: "route",
    // REVIEW
    summary:
      "Platform migrations and ERP, PIM and payment integrations that move your store without losing data, SEO rankings or sales.",
    // REVIEW
    metaDescription:
      "eCommerce migration and integration services: move to Shopify or WooCommerce and connect your ERP, PIM and payments without losing data, SEO or sales.",
  },
];

export const SERVICES: Service[] = SERVICE_INPUTS.map((s) => ({ ...s, metaTitle: brand(s.title) }));

/* -------------------------------------------------------------------------- */
/* How We Engage (engagement models — not services)                           */
/* -------------------------------------------------------------------------- */

export type EngagementModel = {
  /** Short label for menus, cards, and footer */
  label: string;
  /** Page H1 */
  title: string;
  href: string;
  icon: string;
  /** 3–5 word clarifier shown under the label in the mega menu */
  desc: string;
  /** Intro paragraph on the model's own page */
  longDescription: string;
  metaDescription: string;
};

export const ENGAGEMENT_MODELS: EngagementModel[] = [
  {
    label: "MVP Sprint",
    title: "MVP Sprint",
    href: "/engagement/mvp-sprint",
    icon: "zap",
    desc: "Idea → product in 6–10 weeks",
    longDescription:
      "A focused 6–10 week sprint to take a validated idea to a working, launchable product — scoped tightly enough to actually ship on time.",
    metaDescription:
      "A focused 6–10 week sprint to take a validated idea to a working, launchable product — scoped tightly enough to actually ship on time.",
  },
  {
    label: "End-to-End Delivery",
    title: "End-to-End Delivery",
    href: "/engagement/end-to-end-delivery",
    icon: "layers",
    desc: "Full-cycle product ownership",
    longDescription:
      "We own the full delivery cycle — design, engineering, QA, and launch — so you get one accountable team instead of coordinating several vendors.",
    metaDescription:
      "We own the full delivery cycle — design, engineering, QA, and launch — so you get one accountable team instead of coordinating several vendors.",
  },
  {
    label: "Dedicated Development Team",
    title: "Hire Dedicated Developers",
    href: "/hire-dedicated-developers",
    icon: "users",
    desc: "Embedded team, your roadmap",
    // REVIEW
    longDescription:
      "Hire a dedicated development team that works your roadmap and sprint cadence as an extension of your own product org — engineers, QA, and a delivery lead, managed by us.",
    // REVIEW
    metaDescription:
      "Hire dedicated developers who work your roadmap as an extension of your team: AI, web and mobile engineers, QA and a delivery lead, managed by CodeShaper.",
  },
  {
    label: "IT Staff Augmentation",
    title: "IT Staff Augmentation Services",
    href: "/staff-augmentation",
    icon: "user-plus",
    desc: "Engineers who ramp fast",
    // REVIEW
    longDescription:
      "Add individual engineers, designers, or QA specialists to your existing team and process. They ramp fast and work your way, without adding management overhead.",
    // REVIEW
    metaDescription:
      "IT staff augmentation services: add vetted AI, software and QA engineers to your existing team in days, working inside your process without hiring overhead.",
  },
  {
    label: "Offshore Development Center",
    title: "Offshore Development Center Setup",
    href: "/offshore-development-center",
    icon: "globe",
    desc: "Your own long-term offshore team",
    // REVIEW
    longDescription:
      "We set up and run an offshore development center for you — hiring, onboarding, delivery processes, and management — so you scale engineering capacity with working-hour overlap and one accountable lead.",
    // REVIEW
    metaDescription:
      "Offshore development center setup: we hire, onboard and manage a long-term engineering team for you, with timezone overlap, clear processes and one lead.",
  },
];

/* -------------------------------------------------------------------------- */
/* Mega menu extras                                                           */
/* -------------------------------------------------------------------------- */

export const SERVICES_FEATURED = {
  eyebrow: "AI Agents & Automation · NEW",
  title: "Production-Ready AI Automation",
  desc: "AI workflows integrated with your systems — with approvals, logs and testing built in.",
  href: "/services/ai-agents-automation",
  icon: "bot",
};

/** Quick Access chips — each resolves to its service page. */
const QUICK_ACCESS_SLUGS: { label: string; slug: string }[] = [
  { label: "AI Agents", slug: "ai-agent-development" },
  { label: "AI Integration", slug: "ai-integration" },
  { label: "RAG Systems", slug: "rag-development" },
  { label: "MVP Development", slug: "mvp-development" },
  { label: "Cloud & DevOps", slug: "cloud-devops" },
  { label: "Shopify Development", slug: "shopify-development" },
];

export const MEGA_MENU_FOOTER = {
  count: `${SERVICE_GROUPS.length} service groups`,
  tagline: "AI engineering & software development company",
};

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

export const servicePath = (slug: string) => `/services/${slug}`;

export function getGroup(slug: string): ServiceGroup | undefined {
  return SERVICE_GROUPS.find((g) => g.slug === slug);
}

export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

export function servicesInGroup(groupSlug: string): Service[] {
  return SERVICES.filter((s) => s.groupSlug === groupSlug);
}

/** Grey descriptor line in the mega menu / homepage tabs, e.g. "SaaS Development · MVP Development · …" */
export function groupDescriptor(group: ServiceGroup): string {
  return group.descriptorSlugs.map((slug) => getService(slug)!.menuLabel).join(" · ");
}

/** A group's services split into its subgroups (or one unnamed section when it has none). */
export function groupSections(group: ServiceGroup): { name?: string; services: Service[] }[] {
  const services = servicesInGroup(group.slug);
  if (!group.subgroups) return [{ services }];
  return group.subgroups.map((name) => ({ name, services: services.filter((s) => s.subgroup === name) }));
}

/**
 * Three other services from the same group — same subgroup first (so a
 * Shopify page suggests other commerce services, not WordPress), then
 * the rest of the group in its listed order.
 */
export function relatedServices(service: Service, count = 3): Service[] {
  const siblings = servicesInGroup(service.groupSlug).filter((s) => s.slug !== service.slug);
  const sameSubgroup = siblings.filter((s) => s.subgroup === service.subgroup);
  const rest = siblings.filter((s) => s.subgroup !== service.subgroup);
  return [...sameSubgroup, ...rest].slice(0, count);
}

export const SERVICES_QUICK_ACCESS: { label: string; href: string }[] = QUICK_ACCESS_SLUGS.map(({ label, slug }) => {
  if (!getService(slug)) throw new Error(`Quick access chip "${label}" points to unknown service "${slug}"`);
  return { label, href: servicePath(slug) };
});

/** Engagement models by the last segment of their href. */
export function getEngagementModel(slug: string): EngagementModel | undefined {
  return ENGAGEMENT_MODELS.find((m) => m.href.split("/").pop() === slug);
}

/* -------------------------------------------------------------------------- */
/* Integrity checks — fail the build, not production, if the data drifts       */
/* -------------------------------------------------------------------------- */

{
  const allSlugs = [...SERVICE_GROUPS.map((g) => g.slug), ...SERVICES.map((s) => s.slug)];
  const dupes = allSlugs.filter((s, i) => allSlugs.indexOf(s) !== i);
  if (dupes.length) throw new Error(`Duplicate /services/ slugs: ${dupes.join(", ")}`);
  for (const g of SERVICE_GROUPS) {
    for (const slug of g.descriptorSlugs) {
      if (getService(slug)?.groupSlug !== g.slug) throw new Error(`Descriptor slug "${slug}" is not in group "${g.slug}"`);
    }
  }
  for (const s of SERVICES) {
    const g = getGroup(s.groupSlug)!;
    if (g.subgroups && !g.subgroups.includes(s.subgroup ?? "")) throw new Error(`Service "${s.slug}" needs a valid subgroup`);
  }
}
