import { SITE } from "@/lib/siteSettings";

/**
 * Company facts as published on codeshaper.net's footer (owner-supplied,
 * 23 Nov 2026). Used until the same fields are filled in CMS › Settings ›
 * Contact and social, which then win field by field. Shared by the footer and
 * the booking window so the two always show the same details.
 */
export const PUBLISHED = {
  email: "info@codeshaper.net",
  support: "support@codeshaper.net",
  phone: "+880-1754218741",
  whatsapp: "+8801787662759",
  social: {
    facebook: "https://www.facebook.com/Codeshaperbd/",
    x: "https://twitter.com/codeshaperbd",
    linkedin: "https://www.linkedin.com/company/codeshaper",
    pinterest: "https://www.pinterest.com/codeshaperbd/",
    behance: "https://www.behance.net/codeshaper",
  } as Record<string, string>,
};

/** The direct ways to reach us: CMS values first, the published ones otherwise. */
export function contactChannels() {
  const c = SITE.contact ?? {};
  return { email: c.email || PUBLISHED.email, phone: c.phone || PUBLISHED.phone, whatsapp: c.whatsapp || PUBLISHED.whatsapp };
}
