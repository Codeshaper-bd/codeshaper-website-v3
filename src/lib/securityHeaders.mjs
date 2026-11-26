/**
 * The website's security headers (next.config.ts).
 *
 * Two policies. The enforced one holds only what cannot break a page. The strict one is Report-Only:
 * it shows what enforcing it would block. It cannot be enforced yet, because Next.js puts inline
 * scripts in every prerendered page; allowing them needs either 'unsafe-inline' (which would give up
 * most of the protection) or a per-request nonce (which would end static pages). That choice is still
 * to be made. Hosts here are the ones the code uses; a new integration or a custom Cal.com domain must be added.
 */
const CAL = ["https://app.cal.com", "https://cal.com"];
const TAGS = ["https://www.googletagmanager.com", "https://connect.facebook.net", "https://snap.licdn.com", "https://www.clarity.ms", "https://scripts.clarity.ms"];
const TAG_DATA = ["https://*.google-analytics.com", "https://analytics.google.com", "https://www.googletagmanager.com", "https://www.facebook.com", "https://px.ads.linkedin.com", "https://*.clarity.ms", "https://c.bing.com"];
const FRAMES = ["https://www.youtube-nocookie.com", "https://player.vimeo.com", "https://www.google.com", "https://maps.google.com", "https://www.figma.com", "https://www.loom.com", "https://codepen.io"];
// stock and thumbnail pictures the content still uses
const PICTURES = ["https://i.ytimg.com", "https://picsum.photos", "https://fastly.picsum.photos"];

const join = (/** @type {Record<string, string[]>} */ policy) => Object.entries(policy).map(([name, values]) => `${name} ${values.join(" ")}`).join("; ");

/** A draft preview also loads pictures and videos straight from the CMS (published pages use local copies). */
const reportOnly = (/** @type {string[]} */ media) => join({
  "default-src": ["'self'"],
  "script-src": ["'self'", ...TAGS, "https://app.cal.com"],
  "style-src": ["'self'"],
  // React's style={…} attributes; they cannot run code
  "style-src-attr": ["'unsafe-inline'"],
  "img-src": ["'self'", "data:", "blob:", ...PICTURES, ...TAG_DATA, ...media],
  "font-src": ["'self'"],
  "media-src": ["'self'", ...media],
  "connect-src": ["'self'", ...TAG_DATA, "https://app.cal.com"],
  "frame-src": ["'self'", ...CAL, ...FRAMES, "https://www.googletagmanager.com"],
  "worker-src": ["'self'", "blob:"],
  "manifest-src": ["'self'"],
  "object-src": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
});

const enforced = (/** @type {string[]} */ ancestors) => join({ "base-uri": ["'self'"], "object-src": ["'none'"], "form-action": ["'self'"], "frame-ancestors": ancestors });

/** Where the admin lives (owner, 26 Nov 2026); on a developer's computer, the local CMS. */
const ADMIN = { production: "https://admin.codeshaper.net", development: "http://localhost:8090" };

/** The CMS's address, which frames draft previews: only a clean http(s) origin counts. */
function cmsOrigin(/** @type {Record<string, string | undefined>} */ env) {
  const value = env.CMS_PUBLIC_ORIGIN || (env.NODE_ENV === "production" ? ADMIN.production : ADMIN.development);
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.origin : "";
  } catch {
    return "";
  }
}

/** @param {Record<string, string | undefined>} [env] */
export function securityHeaderRules(env = process.env) {
  const common = [
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    // browsers ignore it over plain http; without includeSubDomains, other subdomains are not affected
    ...(env.NODE_ENV === "production" ? [{ key: "Strict-Transport-Security", value: "max-age=31536000" }] : []),
  ];
  const report = (/** @type {string[]} */ media) => ({ key: "Content-Security-Policy-Report-Only", value: reportOnly(media) });
  const origin = cmsOrigin(env);
  return [
    // not the two plain-form pages: they set their own, stricter headers, and these would replace them
    { source: "/((?!preview/|contact/continue|newsletter/subscribe).*)", headers: [...common, report([]), { key: "X-Frame-Options", value: "SAMEORIGIN" }, { key: "Content-Security-Policy", value: enforced(["'self'"]) }] },
    // the CMS shows drafts in a frame; X-Frame-Options cannot name another origin, so frame-ancestors does
    { source: "/preview/:path*", headers: [...common, report(origin ? [origin] : []), { key: "Content-Security-Policy", value: enforced(origin ? ["'self'", origin] : ["'self'"]) }] },
  ];
}
