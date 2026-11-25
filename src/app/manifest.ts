import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/site";
import { SITE } from "@/lib/siteSettings";

/** Web app manifest: the name and icon a phone uses when the site is added to the home screen. */
export default function manifest(): MetadataRoute.Manifest {
  const icon = SITE.seo.favicon;
  return {
    name: `${SITE_NAME}: AI engineering & software development`,
    short_name: SITE_NAME,
    start_url: "/",
    display: "browser",
    background_color: "#f5f4f2",
    theme_color: "#4f46e5",
    icons: icon
      ? [{ src: icon, sizes: "any" }]
      : [
          { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "/brand/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
        ],
  };
}
