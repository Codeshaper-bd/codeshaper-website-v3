import stories from "@/content/caseStudies.json";

/**
 * Case study data. Fennec, Essentialist, Acculance, and TOI Coin are
 * featured projects. TOI Coin's copy describes only its supplied film;
 * no delivery metrics or technical stack are inferred. No invented case
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
  /** Where the client is based (or "Global"). Only set when known. */
  market?: string;
  services: string[];
  engagementModel?: string;
  tech: string[];
  platforms?: string;
  image: string;
  imageAlt?: string;
  /** Project film, and the still shown before it plays */
  video?: string;
  poster?: string;
  featured?: boolean;
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

/**
 * Project films live in /public/media, not in the CMS. They are added here
 * because every sync rewrites src/content/caseStudies.json.
 */
const FILMS: Record<string, { video: string; poster: string }> = {
  essentialist: { video: "/media/case-studies/essentialist.mp4", poster: "/media/case-studies/essentialist-poster.jpg" },
  fennec: { video: "/media/case-studies/fennec.mp4", poster: "/media/case-studies/fennec-poster.jpg" },
  "toi-coin": { video: "/media/case-studies/toi.mp4", poster: "/media/case-studies/toi-poster.jpg" },
};

/** Adds the project's film. The CMS cover stays, unless it is still a stock placeholder. */
export function withFilm(story: CaseStudy): CaseStudy {
  const film = FILMS[story.slug];
  if (!film) return story;
  return { ...story, ...film, image: story.image.startsWith("https://picsum.photos/") ? film.poster : story.image };
}

/** Not in the CMS yet. A CMS case study with the same slug replaces it. */
const TOI_COIN: CaseStudy = {
  slug: "toi-coin",
  project: "TOI Coin",
  headline: "TOI Coin, brought to life in motion.",
  summary: "Explore TOI Coin through a project film featuring its visual identity, digital artwork, and brand in motion.",
  industry: "Blockchain & Web3",
  services: ["Brand Presentation", "Motion Design"],
  tech: [],
  image: "/media/case-studies/toi-poster.jpg",
  accent: "#137960",
  stats: [],
  deliverables: [
    "Distinctive visual identity",
    "Digital brand presentation",
    "Motion-led storytelling",
  ],
};

// written in the CMS (Case studies)
const published: CaseStudy[] = stories;

export const CASE_STUDIES: CaseStudy[] = [
  ...published,
  ...(published.some((c) => c.slug === TOI_COIN.slug) ? [] : [TOI_COIN]),
].map(withFilm);

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug);
}

export function getRelatedCaseStudies(current: CaseStudy, count = 3): CaseStudy[] {
  return CASE_STUDIES.filter((c) => c.slug !== current.slug).slice(0, count);
}

export const CASE_STUDY_INDUSTRIES: string[] = Array.from(new Set(CASE_STUDIES.map((c) => c.industry)));
