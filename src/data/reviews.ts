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

/** A YouTube video review without a photo shows a frame of its own video (its thumbnail). */
export const REAL_REVIEWS: Review[] = (reviews as Review[]).map((r) => {
  const id = youtubeId(r.video?.src);
  return !r.photo && id ? { ...r, photo: `https://i.ytimg.com/vi/${id}/hqdefault.jpg` } : r;
});

/** The YouTube video id in a review's video link (watch, youtu.be or shorts), else null. */
export function youtubeId(src?: string): string | null {
  const m = src?.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
  return m ? m[1] : null;
}
/** A Shorts video is upright (9:16). */
export const isShort = (src?: string) => /youtube\.com\/shorts\//.test(src ?? "");
