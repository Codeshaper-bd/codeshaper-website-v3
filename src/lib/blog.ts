/**
 * Static blog content — the CMS/dynamic version referenced in the URL
 * strategy (/blog/{slug}) doesn't exist yet, so this is a typed array
 * standing in for it. Every post here is a genuine, complete article
 * (not filler), written from the same practices already described on
 * the Services/Engagement pages — not fabricated case studies, client
 * quotes, or view-count/analytics numbers. Author is "The CodeShaper
 * Team" throughout rather than an invented named byline, since no real
 * individual authors are attached to this content yet.
 *
 * Cover images use the same seeded picsum.photos placeholder convention
 * already used for Testimonials/CaseStudiesExpand — clearly a stand-in,
 * not a real photo, until real cover art exists.
 */

export type PostFormat = "Guide" | "Checklist" | "Opinion";
export type PostLevel = "Beginner" | "Intermediate" | "Advanced";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  body: string[];
  topic: string;
  format: PostFormat;
  level: PostLevel;
  industry?: string;
  techTags?: string[];
  author: string;
  date: string; // ISO
  readingTime: number; // minutes
  image: string;
  featured?: boolean;
};

export const TOPICS = [
  "Product Strategy",
  "UX/UI",
  "Commerce",
  "AI & Automation",
  "Web Engineering",
  "Integrations",
] as const;

export const FORMATS: PostFormat[] = ["Guide", "Checklist", "Opinion"];
export const LEVELS: PostLevel[] = ["Beginner", "Intermediate", "Advanced"];

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "rag-for-support-teams",
    title: "RAG for Support Teams: Turning Docs into Answers Without Chaos",
    excerpt:
      "Retrieval-augmented generation sounds abstract until you frame it correctly: it's a way to make your existing documentation answer questions, not a replacement for it.",
    topic: "AI & Automation",
    format: "Guide",
    level: "Intermediate",
    industry: "SaaS",
    techTags: ["LLM", "Vector DB", "Next.js"],
    author: "The CodeShaper Team",
    date: "2026-07-14",
    readingTime: 7,
    image: "https://picsum.photos/seed/blog-rag-support/1200/800",
    featured: true,
    body: [
      "Most support teams already have the answer to a customer's question written down somewhere — a help doc, a Slack thread, a changelog entry. The problem isn't a lack of documentation; it's that the documentation is scattered, and a generic chatbot with no grounding will either refuse to answer or, worse, make something up.",
      "Retrieval-augmented generation (RAG) fixes this by changing what the model is allowed to answer from. Instead of relying on what it was trained on, the model is given a retrieved set of your own documents at query time and asked to answer only from those. Get the retrieval step right, and the hallucination problem mostly disappears — not because the model got smarter, but because you stopped asking it to guess.",
      "The part that actually takes engineering effort isn't the language model call — it's the retrieval pipeline. Documents need to be chunked sensibly (not just split every N characters), embedded, indexed in a vector store, and re-ranked before they ever reach the model. A support KB that's mostly short FAQ entries needs a different chunking strategy than a KB full of long troubleshooting runbooks, and getting this wrong is the single most common reason a RAG system gives confidently wrong answers.",
      "The other half of a system that's actually safe to hand to a support team is guardrails: a confidence threshold below which the system says \"I don't know\" instead of answering, a citation back to the source document so an agent can verify before forwarding an answer to a customer, and a feedback loop so wrong answers get flagged and the underlying doc gets fixed — not just the model prompt.",
      "Where this earns its cost fastest is tier-1 deflection: the volume of \"where do I find X\" and \"how do I reset Y\" tickets that eat agent time without needing human judgment. A well-grounded RAG system in front of your help center can cut that volume meaningfully, freeing agents for the tickets that actually need a person — without ever pretending to replace one.",
    ],
  },
  {
    slug: "mvp-sprint-scoping",
    title: "MVP Sprint: How to Scope a v1 Without Overbuilding",
    excerpt:
      "The most common way an MVP sprint fails isn't a missed deadline — it's shipping a v1 that tries to be the v3 you'll actually need a year from now.",
    topic: "Product Strategy",
    format: "Guide",
    level: "Beginner",
    author: "The CodeShaper Team",
    date: "2026-07-02",
    readingTime: 6,
    image: "https://picsum.photos/seed/blog-mvp-sprint/1200/800",
    body: [
      "An MVP sprint has one job: get a real product in front of real users fast enough that you're learning from actual usage instead of more planning. That framing sounds obvious, but most scoping conversations drift away from it within the first hour, because every stakeholder in the room has a feature they're sure is \"basically required for launch.\"",
      "The scoping question that actually cuts through this isn't \"is this feature useful\" — almost everything proposed in a kickoff is useful. The question is \"does the product fail to answer its core question without this.\" If you're validating whether people will pay for a scheduling tool, the core question is about scheduling and payment, not about the settings page, the admin dashboard, or the third integration someone mentioned in passing.",
      "A useful trick for keeping a v1 honest: write the one-sentence hypothesis you're actually testing (\"freelancers will pay $20/month to auto-send invoice reminders\") before scoping a single screen. Every feature on the table then gets tested against that sentence, not against \"would this be nice to have.\" Almost everything that survives that filter is smaller than the room initially assumed.",
      "The other failure mode is architectural, not scope-based: building the v1 on infrastructure sized for the v3 you're hoping for. Multi-tenant billing, role-based permissions, and horizontal scaling are real engineering costs that a 6–10 week sprint usually can't absorb without starving the actual feature work — and most of them are premature for a product that doesn't have paying customers yet. The right instinct is to build the v1 in a way that doesn't block the v3 architecturally, not to build the v3 architecture on day one.",
      "A sprint that ends with a working, narrow product a real user can try — even an unglamorous one — beats a sprint that ends with 70% of a broader vision and nothing a user could actually use yet. Scope ruthlessly toward the first question, and let everything else wait for the evidence that it's worth building.",
    ],
  },
  {
    slug: "cro-checklist-ecommerce",
    title: "A Practical CRO Checklist for eCommerce Teams",
    excerpt:
      "Most conversion audits start with a redesign. Start with the checklist instead — the highest-leverage fixes are usually structural, not visual.",
    topic: "Commerce",
    format: "Checklist",
    level: "Intermediate",
    industry: "eCommerce",
    author: "The CodeShaper Team",
    date: "2026-06-20",
    readingTime: 5,
    image: "https://picsum.photos/seed/blog-cro-checklist/1200/800",
    body: [
      "Conversion rate optimization gets treated as a design problem more often than it should. A visual refresh can help, but the checkout and product-page issues that actually cost the most conversions are usually structural: broken assumptions about what information a buyer needs, and when.",
      "Start with the product page. Can a shopper answer \"will this work for me\" without leaving the page — sizing, materials, return policy, and real (not stock) photos of the product in use? Every extra click to answer a basic question is a chance for the shopper to leave and not come back.",
      "Checkout is the highest-leverage section on the entire site, because every visitor who reaches it has already decided to buy. Audit it for: how many form fields are actually required, whether guest checkout exists, whether shipping cost surprises the buyer late instead of early, and whether the page loads fast on mobile specifically (checkout abandonment on slow mobile connections is disproportionately high).",
      "Site speed deserves its own line item, not a footnote: a product page that takes four seconds to become interactive is losing sales before a single design decision even matters. Compressed images, deferred non-critical scripts, and a CDN in front of static assets usually recover more revenue than a visual redesign will.",
      "Finally, instrument before you optimize. A CRO pass without analytics in place is a guess dressed up as a strategy — you need to know where in the funnel people are actually dropping off before deciding what to fix first. If you don't have that data yet, setting it up is the actual first item on this checklist, not an afterthought.",
    ],
  },
  {
    slug: "design-systems-101",
    title: "Design Systems 101: What's Actually Worth Documenting",
    excerpt:
      "A design system that documents everything gets used by no one. The useful version is smaller, opinionated, and enforced in code, not just in Figma.",
    topic: "UX/UI",
    format: "Guide",
    level: "Beginner",
    techTags: ["Figma", "React"],
    author: "The CodeShaper Team",
    date: "2026-06-05",
    readingTime: 6,
    image: "https://picsum.photos/seed/blog-design-systems/1200/800",
    body: [
      "Most design systems die the same way: someone spends weeks documenting every color, spacing value, and component variant in exhaustive detail, and six months later half of it is out of sync with the actual product because updating the docs was never part of anyone's workflow.",
      "The version that survives is smaller on purpose. It documents the decisions that are genuinely easy to get wrong twice — a type scale, a spacing scale, the handful of button/input/card components that appear on every screen — and it deliberately doesn't try to cover every one-off layout in the product. Not every screen needs a system; the repeating 20% of the UI does.",
      "The real enforcement mechanism isn't the documentation site — it's the component library. A rule written in a Figma file is a suggestion; a rule expressed as the only button component available in code is a constraint. Teams that treat the code library as the source of truth (and the docs as a description of it, not the other way around) end up with far less drift between what's designed and what ships.",
      "Tokens are worth the setup cost specifically because they make a rebrand or a dark-mode pass tractable later — colors, spacing, and type scale expressed as named variables rather than hardcoded values in a hundred places. This is the single highest-leverage piece of a design system for a team that expects the product to keep evolving.",
      "Skip documenting anything you don't actually intend to reuse. A design system is a tool for consistency at scale, not a museum exhibit — if a pattern only appears once, it doesn't belong in the system yet.",
    ],
  },
  {
    slug: "shopify-vs-custom-storefront",
    title: "Choosing Between Shopify and a Custom Storefront",
    excerpt:
      "This isn't a \"which is better\" question — it's a question about which constraints you're willing to accept, and when a platform's limits start costing more than they save.",
    topic: "Commerce",
    format: "Opinion",
    level: "Intermediate",
    industry: "eCommerce",
    techTags: ["Shopify", "Headless"],
    author: "The CodeShaper Team",
    date: "2026-05-22",
    readingTime: 6,
    image: "https://picsum.photos/seed/blog-shopify-custom/1200/800",
    body: [
      "Shopify (or WooCommerce, for a WordPress-based stack) wins for most stores for a simple reason: checkout, payments, inventory, and fraud protection are solved problems that a platform vendor maintains for you, and rebuilding all of that yourself is rarely where a store's real differentiation lives.",
      "Where the calculus changes is when your actual business logic doesn't fit the platform's model — multi-vendor marketplaces, complex B2B pricing tiers, or checkout flows tightly coupled to a custom fulfillment or subscription system. At that point you're not fighting the platform for convenience anymore, you're fighting it for correctness, and that's expensive in a different way: theme limitations, app conflicts, and a checkout you can't fully control.",
      "Headless commerce is the middle path worth knowing about: keep Shopify (or a similar platform) as the commerce backend — payments, inventory, order management — but build the actual storefront as a custom frontend that calls its APIs. You keep the parts of the platform that are genuinely hard to replicate well, and get full control over the parts that actually differentiate the brand: page speed, custom layouts, and content that doesn't fit a theme's block system.",
      "The honest failure mode to watch for either direction: teams that go fully custom because a platform felt \"limiting\" during a demo, then spend the next year rebuilding checkout security, PCI compliance, and inventory sync that a platform would have handled for free. And teams that stay on a platform because migration feels risky, while quietly losing conversion to page speed and layout constraints they've stopped noticing.",
      "The right call is almost never about which technology is \"better\" in the abstract — it's about which constraints your actual catalog, pricing model, and fulfillment process can live with, and which ones would cost more to work around than to build.",
    ],
  },
  {
    slug: "legacy-rebuild-checklist",
    title: "Legacy to Modern: A Rebuild Checklist That Avoids Big-Bang Rewrites",
    excerpt:
      "The riskiest way to modernize a legacy system is also the most tempting one: rewrite it from scratch. Here's the checklist for doing it incrementally instead.",
    topic: "Web Engineering",
    format: "Checklist",
    level: "Advanced",
    author: "The CodeShaper Team",
    date: "2026-05-08",
    readingTime: 7,
    image: "https://picsum.photos/seed/blog-legacy-rebuild/1200/800",
    body: [
      "A full rewrite is the most tempting option for a legacy system, and usually the riskiest one: it freezes feature development for months, the new system has to reach feature parity before it can replace the old one, and \"feature parity\" always turns out to include undocumented behavior nobody remembered was load-bearing until it broke.",
      "The incremental alternative starts with instrumentation, not code changes: before touching anything, map what the legacy system actually does in production (not what the docs say it does), including the edge cases and quiet workarounds that accumulated over years. You can't safely replace what you haven't actually observed.",
      "The strangler-fig pattern — routing specific slices of traffic to new, modernized services while the legacy system keeps handling everything else — lets you ship incremental value and de-risk the migration piece by piece, instead of betting the whole project on one cutover date. Pick the highest-pain, most self-contained slice first, not the easiest one; that's where the case for modernization is easiest to prove.",
      "Data migration deserves more caution than code migration. Schema mismatches, silent type coercions, and \"we've always just handled that in application code\" business logic hiding in the old data layer are where legacy rebuilds actually go over budget. Dual-write or dual-read strategies during the transition — writing to both old and new systems, comparing results — catch this before it becomes a production incident.",
      "Keep a rollback path alive for longer than feels necessary. The instinct once the new system is live is to decommission the old one immediately; resist it until the new system has handled a full real-world cycle (a full billing period, a seasonal traffic peak, whatever the legacy system's actual stress test looks like) without needing the old system as a safety net.",
    ],
  },
  {
    slug: "dedicated-product-team-explained",
    title: "What a Dedicated Product Team Actually Looks Like",
    excerpt:
      "\"Embedded team\" gets used loosely in proposals. Here's what actually distinguishes a dedicated team from a project team or a staffing arrangement.",
    topic: "Product Strategy",
    format: "Opinion",
    level: "Beginner",
    author: "The CodeShaper Team",
    date: "2026-04-24",
    readingTime: 5,
    image: "https://picsum.photos/seed/blog-dedicated-team/1200/800",
    body: [
      "A dedicated product team gets pitched in a lot of proposals, but the phrase does a lot of unearned work — it can mean anything from \"the same three engineers for the length of one project\" to \"a genuinely stable squad that works your roadmap indefinitely.\" The difference matters more than it sounds like it should.",
      "The real distinguishing feature isn't headcount, it's continuity and context. A project team assembled for a fixed scope disbands (or gets reassigned) at the end of it, taking a year of accumulated context about your codebase, your users, and your past decisions with them. A dedicated team stays attached to the product across multiple release cycles, which means the second sprint starts faster than the first, not slower.",
      "This model earns its cost specifically when the roadmap itself is the uncertain part — you know you need continuous product development, but the exact sequence of what gets built next depends on what you learn from what just shipped. A fixed-scope project team is a poor fit for that kind of ongoing, adaptive roadmap; a dedicated team that works your actual sprint cadence isn't.",
      "The tell for whether a \"dedicated team\" pitch is real: ask what happens to the team composition between projects, and whether the same people who shipped last quarter are the ones planning next quarter. If the honest answer is \"we'll staff it fresh each time based on availability,\" that's a staffing arrangement wearing dedicated-team language, not the thing itself.",
      "None of this makes a dedicated team the right choice for every situation — a well-scoped, fixed-deliverable project genuinely doesn't need this level of continuity, and paying for it anyway is waste. The model earns its premium specifically when the roadmap is long and the direction is still being figured out in real time.",
    ],
  },
  {
    slug: "apis-integrations-questions",
    title: "APIs & Integrations: The Questions to Ask Before You Connect Two Systems",
    excerpt:
      "Most integration projects go wrong before a line of code is written — in the assumptions nobody checked about what the other system actually guarantees.",
    topic: "Integrations",
    format: "Guide",
    level: "Intermediate",
    techTags: ["REST", "Webhooks"],
    author: "The CodeShaper Team",
    date: "2026-04-10",
    readingTime: 6,
    image: "https://picsum.photos/seed/blog-api-integrations/1200/800",
    body: [
      "Connecting two systems sounds like a technical problem, but the questions that actually determine whether an integration is reliable are mostly about guarantees, not endpoints: what happens when the other system is down, what happens when a webhook is delivered twice, and who owns the data when both systems disagree about the current state of a record.",
      "Idempotency is the one that bites teams most often. If your system receives the same webhook twice — which happens more often than API docs admit, since \"at least once\" delivery is the norm, not the exception — does processing it twice create a duplicate order, double-charge a customer, or send a duplicate notification? If the answer isn't already \"no, because we check for that,\" that's the first thing to fix, not the last.",
      "Rate limits and retry behavior need an explicit plan, not an assumption. A naive retry loop against a rate-limited API can turn a temporary blip into a self-inflicted outage — exponential backoff with jitter, and a circuit breaker that stops hammering a system that's clearly down, are the difference between a resilient integration and one that makes incidents worse.",
      "Authentication and credential rotation are underrated failure points: an integration that works fine until an API key expires or a partner rotates their OAuth secrets without warning is a support ticket waiting to happen. Building in a clear failure mode (an alert, not a silent data gap) for auth failures specifically is worth the extra hour.",
      "Finally, decide explicitly who's the source of truth for shared data before you build, not after the first conflict. Two systems that both think they own \"the current shipping address\" will eventually disagree, and resolving that after the fact — with real customer data already in an inconsistent state — is much more expensive than deciding it up front.",
    ],
  },
  {
    slug: "process-automation-without-chaos",
    title: "Process Automation Without the Chaos: Capture, Review, Approve",
    excerpt:
      "The automation projects that actually stick follow a simple shape: capture the input reliably, keep a human in the loop where judgment matters, and automate the parts that don't need one.",
    topic: "AI & Automation",
    format: "Guide",
    level: "Intermediate",
    author: "The CodeShaper Team",
    date: "2026-03-27",
    readingTime: 6,
    image: "https://picsum.photos/seed/blog-process-automation/1200/800",
    body: [
      "Document and process automation projects tend to fail in one of two directions: either they try to remove humans from steps that genuinely need judgment (and the errors that follow kill trust in the system fast), or they automate nothing meaningful because every step still routes through a person \"just in case.\" The useful middle is a clear capture → review → approve shape.",
      "Capture is the step worth investing in first, because everything downstream depends on it. Whether it's OCR on scanned invoices, a structured intake form instead of a free-text email, or an API feed instead of a manual export — unreliable capture means every later step is built on data nobody trusts, and people quietly route around the automation to double-check it by hand.",
      "The review step is where automation earns trust instead of losing it: surface exceptions and low-confidence cases to a human, and let the clear, high-confidence cases pass straight through. A system that flags the 10% of cases actually worth a human's attention is doing its job; a system that either flags everything or nothing isn't calibrated yet.",
      "Approval workflows are where a lot of internal tools quietly become unmanageable — routing logic that grows one exception at a time until nobody can explain why a given request needs three approvers instead of one. Keeping the routing rules explicit, visible, and versioned (not buried in someone's institutional memory) is what keeps this maintainable a year later.",
      "The honest measure of whether an automation project worked isn't \"we removed the humans\" — it's whether the humans still in the loop are spending their time on the 10% of cases that actually need judgment, instead of re-keying data that a reliable capture step should have handled cleanly in the first place.",
    ],
  },
  {
    slug: "team-augmentation-vs-outsourcing",
    title: "Team Augmentation vs. Full Outsourcing: How to Decide",
    excerpt:
      "The choice isn't about trust or control in the abstract — it's about whether you have the internal capacity to direct the work, or need someone else to own that too.",
    topic: "Product Strategy",
    format: "Opinion",
    level: "Beginner",
    author: "The CodeShaper Team",
    date: "2026-03-13",
    readingTime: 5,
    image: "https://picsum.photos/seed/blog-team-augmentation/1200/800",
    body: [
      "Team augmentation and full project outsourcing get compared like they're the same decision at different price points. They're not — they answer different questions, and picking based on price alone is how teams end up with an arrangement that doesn't match what they actually needed.",
      "Team augmentation assumes you already have product direction, technical leadership, and the ability to onboard and manage additional engineers — you just need capacity. The people who join ramp into your existing team, your existing process, and your existing codebase, and the ownership of what gets built stays entirely with you.",
      "Full outsourcing (or an end-to-end delivery model) assumes the opposite: you need someone else to own direction, technical decisions, and delivery accountability, not just add headcount. This is the right fit when the internal capacity to manage a build — not just do the work — is the actual gap, or when the team wants one accountable partner instead of coordinating several individual contractors.",
      "The failure mode in each direction is predictable. Augmentation without real internal management capacity leaves added engineers without clear direction, quietly under-utilized. Full outsourcing when a strong internal team already exists creates redundant decision-making layers and slows things down instead of speeding them up.",
      "The honest question to ask isn't \"which is cheaper\" — it's \"where is the actual gap: capacity, or the capability to direct capacity.\" Answer that first, and the right model usually becomes obvious.",
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getFeaturedPost(): BlogPost {
  return BLOG_POSTS.find((p) => p.featured) ?? BLOG_POSTS[0];
}

export function getRelatedPosts(post: BlogPost, count = 3): BlogPost[] {
  const sameTopic = BLOG_POSTS.filter((p) => p.slug !== post.slug && p.topic === post.topic);
  const rest = BLOG_POSTS.filter((p) => p.slug !== post.slug && p.topic !== post.topic);
  return [...sameTopic, ...rest].slice(0, count);
}

/** Curated sequences through the real posts above — reusing posts across paths is normal for a small catalog. */
export const READING_PATHS: { title: string; description: string; slugs: string[] }[] = [
  {
    title: "Launch an MVP",
    description: "Scope tightly, keep the system malleable, and know what a dedicated team should look like once you're past v1.",
    slugs: ["mvp-sprint-scoping", "design-systems-101", "dedicated-product-team-explained"],
  },
  {
    title: "Improve eCommerce conversion",
    description: "Fix the structural issues first, then decide whether your platform is actually the bottleneck.",
    slugs: ["cro-checklist-ecommerce", "shopify-vs-custom-storefront", "legacy-rebuild-checklist"],
  },
  {
    title: "Automate your operations",
    description: "Get documents flowing reliably, connect the systems safely, then layer in retrieval-grounded AI.",
    slugs: ["process-automation-without-chaos", "apis-integrations-questions", "rag-for-support-teams"],
  },
];

/** No real analytics exist yet, so this is an honest "editor's picks" list, not a fabricated most-read ranking. */
export const EDITOR_PICKS_SLUGS: string[] = [
  "rag-for-support-teams",
  "mvp-sprint-scoping",
  "legacy-rebuild-checklist",
  "cro-checklist-ecommerce",
  "process-automation-without-chaos",
];
