import reviews from "@/content/reviews.json";

/**
 * Real client reviews, quoted word for word (shared by the Testimonials
 * section and the service pop-ups). Only add reviews a client actually gave,
 * with permission. `caseSlug` links a review to its case study, which is how
 * a service pop-up finds the review that belongs to its projects.
 */
export type Review = {
  real: boolean;
  quote: string;
  name: string;
  role: string;
  company: string;
  market?: string;
  caseSlug?: string;
  photo?: string;
  video?: { src: string; duration: string };
};

export const REAL_REVIEWS: Review[] = reviews;
