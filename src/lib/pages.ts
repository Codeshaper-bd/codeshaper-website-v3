import "server-only";
import data from "@/content/pages.json";
import type { Seo } from "@/lib/details";

export type CmsPage = { path: string; title: string; intro?: string; eyebrow?: string; layout: string; html?: string; image?: string; seo?: Seo };
export const PAGES = data as unknown as CmsPage[];
export const getPage = (path: string) => PAGES.find((p) => p.path === path);
