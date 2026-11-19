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

export const REAL_REVIEWS: Review[] = [
  {
    real: true,
    quote: "This was a web development project and we were very pleased with the service and responsiveness… Definitely recommend this seller!",
    name: "Joan Roca",
    role: "Founder & CEO",
    company: "Essentialist",
    market: "Spain",
    caseSlug: "essentialist",
  },
];
