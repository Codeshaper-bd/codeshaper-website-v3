import stories from "@/content/caseStudies.json";

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
  /** Where the client is based (or "Global"). Only set when known. */
  market?: string;
  services: string[];
  engagementModel?: string;
  tech: string[];
  platforms?: string;
  image: string;
  imageAlt?: string;
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

// written in the CMS (Case studies)
export const CASE_STUDIES: CaseStudy[] = stories;

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug);
}

export function getRelatedCaseStudies(current: CaseStudy, count = 3): CaseStudy[] {
  return CASE_STUDIES.filter((c) => c.slug !== current.slug).slice(0, count);
}

export const CASE_STUDY_INDUSTRIES: string[] = Array.from(new Set(CASE_STUDIES.map((c) => c.industry)));
