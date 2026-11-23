/**
 * Turns what the CMS sends (GET /api/intake/content) into the shapes the
 * website's code uses. Pure: no network, no files. Used by the content sync
 * and by the private preview.
 *
 * Nothing half-filled gets through: an item that would break a page is left
 * out and reported in `warn`.
 */
const has = (v) => v !== null && v !== undefined && v !== "" && !(Array.isArray(v) && v.length === 0) && !(typeof v === "object" && !Array.isArray(v) && Object.keys(v).length === 0);
const strip = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => has(v)));
const list = (v) => (Array.isArray(v) ? v.filter((x) => typeof x === "string" && x.trim()) : []);
const rows = (v, keys) => (Array.isArray(v) ? v.filter((r) => r && keys.every((k) => has(r[k]))) : []);
const cards = (v) => rows(v, ["title"]).map((r) => strip({ icon: r.icon || "sparkles", title: r.title, description: r.text ?? r.description ?? "", image: r.image }));
const steps = (v) => rows(v, ["title"]).map((r, i) => ({ n: String(i + 1), title: r.title, description: r.text ?? "" }));
const faqs = (v) => rows(v, ["q", "a"]).map((r) => ({ q: r.q, a: r.a }));
const stack = (v) => rows(v, ["category"]).filter((r) => r.tools?.length).map((r) => strip({ category: r.category, tools: r.tools, icon: r.icon }));
const safeHref = (h) => (typeof h === "string" && /^(\/(?!\/)|https?:\/\/|mailto:|tel:|#)/i.test(h) ? h : undefined);
const brand = (t) => (/\| CodeShaper$/.test(t) ? t : `${t} | CodeShaper`);

/** `<h2>`/`<p>` only, as the first articles were written → sections. Anything richer stays HTML. */
export function simpleSections(html) {
  const out = [];
  const re = /\s*<h2(?: id="[^"]*")?>([^<]*)<\/h2>((?:\s*<p>[^<]*<\/p>)+)/gy;
  let m;
  let end = 0;
  while ((m = re.exec(html))) {
    out.push({ heading: decode(m[1]), paragraphs: [...m[2].matchAll(/<p>([^<]*)<\/p>/g)].map((x) => decode(x[1])) });
    end = re.lastIndex;
  }
  return out.length && !html.slice(end).trim() ? out : null;
}
const decode = (s) => s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&amp;/g, "&");
export const headingsOf = (html) => [...html.matchAll(/<h2 id="([^"]+)"[^>]*>(.*?)<\/h2>/g)].map((m) => ({ id: m[1], text: decode(m[2].replace(/<[^>]+>/g, "")) })).filter((h) => h.text);

// ── the homepage (Pages, Home) ─────────────────────────────────────────────
const HOME_BUILT_IN = ["trustStrip", "atAGlance", "caseStudies", "servicesBento", "products", "testimonials", "humanAiFlow", "industries", "techStack", "impactWorkflow", "engagementModels", "leadership", "aboutStudio", "faq", "blogPosts", "letsTalk"];
const HOME_ADDED = { textImage: "Text and picture", cta: "Call to action", stats: "Numbers", cards: "Cards", logos: "Logo strip", video: "Video", faq: "Questions", text: "Free text" };
const words = (v) => (typeof v === "string" && v.trim() ? v.trim() : undefined);
const lines = (v) => (typeof v === "string" ? v.split(/\r?\n/).map((x) => x.trim()).filter(Boolean) : list(v));
const picture = (i) => (i?.url ? strip({ url: i.url, alt: i.alt, width: i.width, height: i.height }) : undefined);
const homeButton = (label, href) => (words(label) && safeHref(href) ? { label: words(label), href } : undefined);
const VIDEO_LINK = /(youtube\.com\/(watch\?|shorts\/|embed\/)|youtu\.be\/|vimeo\.com\/)/i;

/** A built-in section's words. Only text: anything left empty keeps the website's original. */
function homeWords(d = {}, key) {
  const out = {};
  for (const [k, v] of Object.entries(d ?? {})) if (typeof v === "string" && words(v)) out[k] = words(v);
  if (key === "humanAiFlow" && Array.isArray(d.phases)) {
    const phases = d.phases.slice(0, 4).map((p) => strip({ title: words(p?.title), body: words(p?.body), ai: lines(p?.ai), people: lines(p?.people) }));
    if (phases.some(has)) out.phases = phases;
  }
  if (key === "faq" && faqs(d.items).length) out.items = faqs(d.items);
  if (key === "leadership" && Array.isArray(d.people)) {
    const people = d.people.slice(0, 8).map((p) => strip({ name: words(p?.name), role: words(p?.role), bio: words(p?.bio), linkedin: (p?.linkedin ?? "").startsWith("https://") ? p.linkedin : undefined, photo: picture(p?.photo) })).filter((p) => p.name || p.role);
    if (people.length) out.people = people;
  }
  if (key === "letsTalk" && Array.isArray(d.steps)) {
    const steps = d.steps.slice(0, 3).map((p) => strip({ title: words(p?.title), body: words(p?.body) }) ?? {});
    if (steps.some(has)) out.steps = steps;
  }
  return has(out) ? out : undefined;
}

/** A section added in the CMS, in the shape components/home/HomeBlock draws. Half-filled ones are left out. */
function homeBlock(type, d) {
  const head = { eyebrow: words(d.eyebrow), title: words(d.title) };
  switch (type) {
    case "textImage":
      return head.title && strip({ type, ...head, text: words(d.text), image: picture(d.image), side: d.side === "left" ? "left" : "right", button: homeButton(d.button_label, d.button_href) });
    case "cta": {
      const button = homeButton(d.button_label, d.button_href);
      return head.title && button && strip({ type, title: head.title, text: words(d.text), button, second: homeButton(d.second_label, d.second_href) });
    }
    case "stats": {
      const items = rows(d.items, ["value", "label"]).slice(0, 4).map((x) => ({ value: String(x.value).trim(), label: String(x.label).trim() }));
      return items.length >= 2 && strip({ type, ...head, items });
    }
    case "cards": {
      const items = rows(d.items, ["title"]).slice(0, 8).map((x) => strip({ icon: x.icon, title: x.title, text: words(x.text) }));
      return head.title && items.length > 0 && strip({ type, ...head, intro: words(d.intro), items });
    }
    case "logos": {
      const logos = (Array.isArray(d.logos) ? d.logos : []).map((l) => picture(l?.image) && strip({ ...picture(l.image), href: /^https?:\/\//i.test(l?.href ?? "") ? l.href : undefined })).filter(Boolean);
      return logos.length > 0 && strip({ type, title: head.title, logos });
    }
    case "video": {
      const video = d.video?.url ? strip({ url: d.video.url, poster: d.poster?.url }) : undefined;
      const link = !video && /^https:\/\//i.test(d.link ?? "") && VIDEO_LINK.test(d.link) ? d.link : undefined;
      return (video || link) && strip({ type, ...head, text: words(d.text), video, link });
    }
    case "faq": {
      const items = faqs(d.items);
      return head.title && items.length > 0 && strip({ type, title: head.title, intro: words(d.intro), items });
    }
    case "text":
      return has(d.body) && strip({ type, ...head, html: d.body });
  }
  return undefined;
}

/** The sections that show, in order: built-ins with their words, added ones with their content. */
function homeSections(v, warn) {
  const seen = new Set();
  return (Array.isArray(v) ? v : []).flatMap((r, i) => {
    const type = r?.type ?? r?.key; // older pages kept {key, on}
    const d = r?.data ?? r ?? {};
    if (!d.on) return [];
    if (HOME_BUILT_IN.includes(type)) {
      if (seen.has(type)) return [];
      seen.add(type);
      return [strip({ key: type, copy: homeWords(d, type) })];
    }
    const added = type === "faqBlock" ? "faq" : type;
    if (!HOME_ADDED[added]) return [];
    const block = homeBlock(added, d);
    if (!block) {
      warn(`Home: the "${HOME_ADDED[added]}" section is not complete, so it is not shown`);
      return [];
    }
    return [{ key: "block", id: `s${i + 1}`, block }];
  });
}

export function toSite(raw, warn = () => {}) {
  const by = (k) => Object.fromEntries((raw[k] ?? []).map((x) => [x.slug, x]));
  const cats = by("post_categories"), tags = by("tags"), authors = by("authors"), tech = by("technologies");
  const bySlug = { service: by("services"), industry: by("industries"), case_study: by("case_studies"), engagement_model: by("engagement_models"), review: by("reviews"), product: by("products"), post: by("posts") };
  const uniq = (k) => {
    const seen = new Set();
    return (raw[k] ?? []).filter((x) => {
      if (seen.has(x.slug)) return warn(`${k}: two items use the address "${x.slug}"; the second was left out`), false;
      seen.add(x.slug);
      return true;
    });
  };
  const seo = (x) => strip({ title: x.seo?.title, description: x.seo?.description, image: x.seo?.image?.url, canonical: x.seo?.canonical, noindex: x.seo?.noindex || undefined });

  // ── services ─────────────────────────────────────────────────────────────
  const all = uniq("services").sort((a, b) => a.sort - b.sort);
  const node = Object.fromEntries(all.map((s) => [s.slug, s]));
  const idToSlug = Object.fromEntries(all.map((s) => [s.id, s.slug]));
  const groupOf = (s) => { let p = s; for (let i = 0; p && i < 4; i++) { if (p.kind === "group") return p; p = node[p.parent]; } return null; };
  const services = all.filter((s) => s.kind === "service").flatMap((s) => {
    const g = groupOf(s);
    if (!g) return warn(`service "${s.title}" has no published group; left out`), [];
    if (!has(s.data?.summary)) return warn(`service "${s.title}" has no summary; left out`), [];
    const parent = node[s.parent];
    return [strip({ menuLabel: s.data.menu_label || s.title, title: s.title, slug: s.slug, groupSlug: g.slug, subgroup: parent?.kind === "subgroup" ? parent.title : undefined, summary: s.data.summary, metaTitle: brand(s.seo?.title || s.title), metaDescription: s.seo?.description || s.data.summary, icon: s.data.icon || "sparkles", hidden: s.data.hide_in_menu || undefined })];
  });
  // keep groups together, in their own order
  const groupsRaw = all.filter((s) => s.kind === "group");
  const order = Object.fromEntries(groupsRaw.map((g, i) => [g.slug, i]));
  services.sort((a, b) => order[a.groupSlug] - order[b.groupSlug]);
  const groups = groupsRaw.flatMap((g) => {
    const inside = services.filter((s) => s.groupSlug === g.slug);
    if (!inside.length) return warn(`service group "${g.title}" has no services; left out`), [];
    const named = (g.data?.descriptor_ids ?? []).map((id) => idToSlug[id]).filter((s) => inside.some((x) => x.slug === s));
    const subs = all.filter((s) => s.kind === "subgroup" && s.parent === g.slug).map((s) => s.title).filter((t) => inside.some((x) => x.subgroup === t));
    return [strip({ slug: g.slug, name: g.title, focus: g.data?.summary, flagship: g.data?.flagship || undefined, icon: g.data?.icon || "sparkles", subgroups: subs, descriptorSlugs: named.length ? named : inside.slice(0, 6).map((s) => s.slug), metaTitle: brand(g.seo?.title || g.title), metaDescription: g.seo?.description || g.data?.summary })];
  });
  const outcomes = Object.fromEntries(groupsRaw.map((g) => [g.slug, list(g.data?.outcomes)]));

  const models = uniq("engagement_models").sort((a, b) => a.sort - b.sort).map((m) => ({ label: m.data?.menu_label || m.title, title: m.title, href: m.path, icon: m.data?.icon || "handshake", desc: m.data?.desc ?? "", longDescription: m.data?.summary, metaDescription: m.seo?.description || m.data?.summary }));
  const comparison = uniq("engagement_models").sort((a, b) => a.sort - b.sort).filter((m) => ["bestFor", "speed", "involvement", "certainty", "pricing", "teamSize", "commitment"].every((k) => has(m.data?.compare?.[k]))).map((m) => ({ href: m.path, model: m.data.menu_label || m.title, ...m.data.compare }));
  const oneLiners = Object.fromEntries(uniq("engagement_models").filter((m) => has(m.data?.one_liner)).map((m) => [m.path, m.data.one_liner]));

  // ── industries ───────────────────────────────────────────────────────────
  const indRaw = uniq("industries").sort((a, b) => a.sort - b.sort);
  const industries = indRaw.map((i) => strip({ label: i.title, href: i.path, icon: i.data?.icon || "building-2", desc: i.data?.desc || i.title, summary: i.data?.summary, outcome: i.data?.outcome || i.data?.desc || i.title, systems: list(i.data?.systems), challenge: i.data?.challenge || i.data?.summary, ctaLabel: i.data?.cta_label || "Talk about your project", accent: i.data?.accent || "#7c6cff", hidden: i.data?.hide_in_menu || undefined }));
  for (const i of industries) i.systems ??= [];
  const industryServices = indRaw.filter((i) => i.links?.service?.some((s) => node[s]?.kind === "group")).map((i) => ({ industry: i.title, industryHref: i.path, icon: i.data?.icon || "building-2", accent: i.data?.accent || "#7c6cff", pillars: i.links.service.filter((s) => node[s]?.kind === "group").map((s) => ({ title: node[s].title, href: node[s].path })) }));

  // ── reviews ──────────────────────────────────────────────────────────────
  const review = (r) => strip({ real: true, quote: r.quote, name: r.title, role: r.data?.role ?? "", company: r.data?.company ?? "", market: r.data?.market, caseSlug: r.links?.case_study?.[0], photo: r.photo?.url, video: has(r.data?.video?.src) ? { src: r.data.video.src, duration: r.data.video.duration ?? "" } : undefined, rating: r.rating, sourceUrl: safeHref(r.data?.source_url) });
  const reviewsRaw = uniq("reviews").sort((a, b) => a.sort - b.sort).filter((r) => r.permission && has(r.quote) && has(r.title));
  const reviews = reviewsRaw.map(review).map((r) => ({ role: "", company: "", ...r }));
  const reviewBySlug = Object.fromEntries(reviewsRaw.map((r, i) => [r.slug, reviews[i]]));

  // ── case studies ─────────────────────────────────────────────────────────
  const caseRaw = uniq("case_studies").sort((a, b) => a.sort - b.sort);
  const caseStudies = caseRaw.flatMap((c) => {
    const d = c.data ?? {};
    if (!has(d.headline) || !has(d.summary) || !c.cover?.url) return warn(`case study "${c.title}" is not complete; left out`), [];
    const q = c.links?.review?.map((s) => reviewBySlug[s]).find(Boolean);
    const results = strip({ operational: list(d.results?.operational), qualitative: list(d.results?.qualitative) });
    const goals = { business: list(d.goals?.business), user: list(d.goals?.user), engineering: list(d.goals?.engineering) };
    const svc = (c.links?.service ?? []).map((s) => bySlug.service[s]).filter(Boolean).map((s) => s.data?.menu_label || s.title);
    return [{
      ...strip({
        slug: c.slug, project: c.title, headline: d.headline, summary: d.summary, industry: d.industry || bySlug.industry[c.links?.industry?.[0]]?.title || "Software", market: d.market,
        engagementModel: bySlug.engagement_model[c.links?.engagement_model?.[0]]?.title ?? d.engagement_shown, platforms: d.platforms, image: c.cover.url, imageAlt: c.cover.alt, accent: d.accent || "#615fff",
        timeline: d.timeline, team: d.team, liveUrl: safeHref(d.live_url), challenge: list(d.challenge), risk: d.risk, goals: Object.values(goals).some((g) => g.length) ? goals : undefined,
        deliverables: list(d.deliverables), approach: list(d.approach), cadence: d.cadence, solutions: rows(d.solutions, ["problem", "decision", "whyItWorked"]).map(({ problem, decision, whyItWorked }) => ({ problem, decision, whyItWorked })),
        results, gallery: rows(d.gallery, ["image"]).filter((g) => g.image.url).map((g) => ({ src: g.image.url, caption: g.caption ?? "" })), whatsNext: list(d.next),
        testimonial: q ? { quote: q.quote, name: q.name, role: [q.role, q.company].filter(Boolean).join(", ") } : undefined, featured: c.is_featured || undefined,
      }),
      services: svc, tech: (c.links?.technology ?? []).map((t) => tech[t]?.title).filter(Boolean), stats: rows(d.stats, ["value", "label"]).map(({ value, label }) => ({ value, label })),
    }];
  });

  // ── blog ─────────────────────────────────────────────────────────────────
  const details = { posts: {}, services: {}, industries: {}, models: {}, caseStudies: {} };
  const posts = uniq("posts").flatMap((p) => {
    const cat = cats[p.category];
    if (!has(p.excerpt) || !has(p.body) || !cat || !p.cover?.url) return warn(`post "${p.title}" is not complete; left out`), [];
    const sections = simpleSections(p.body);
    const a = authors[p.author];
    const date = p.dated_on ?? p.published_at?.slice(0, 10) ?? new Date().toISOString().slice(0, 10);
    details.posts[p.slug] = strip({ html: sections ? undefined : p.body, seo: seo(p), cta: cta(p), author: a && strip({ name: a.title, role: a.data?.role, bio: a.data?.bio, photo: a.photo?.url, linkedin: safeHref(a.data?.linkedin), website: safeHref(a.data?.website) }), sources: rows(p.data?.sources, ["title", "url"]).filter((s) => safeHref(s.url)), related: p.links?.post ?? [], hideToc: p.data?.hide_toc || undefined });
    return [{
      ...strip({ slug: p.slug, title: p.title, excerpt: p.excerpt, topic: cat.title, topicSlug: cat.slug, format: p.format || "Guide", level: p.level || "Beginner", industry: bySlug.industry[p.links?.industry?.[0]]?.title, techTags: (p.links?.tag ?? []).map((t) => tags[t]?.title).filter(Boolean), tagSlugs: p.links?.tag, author: a?.title ?? "The CodeShaper Team", date, lastUpdated: p.reviewed_on ?? date, readingTime: p.data?.reading_shown ?? p.reading_minutes ?? 1, image: p.cover.url, imageAlt: p.cover.alt, featured: p.is_featured || undefined, headings: sections ? undefined : headingsOf(p.body) }),
      summaryPoints: list(p.data?.key_points), sections: sections ?? [], faqs: faqs(p.data?.faqs),
    }];
  }).sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.date.localeCompare(a.date));
  const taxonomy = (o, key) => Object.values(o).map((t) => strip({ slug: t.slug, title: t.title, parent: t.parent, description: t.data?.description, color: t.data?.color, seo: seo(t), count: posts.filter((p) => key(p, t.slug)).length })).filter((t) => t.count);
  const blog = { categories: taxonomy(cats, (p, s) => p.topicSlug === s || cats[p.topicSlug]?.parent === s), tags: taxonomy(tags, (p, s) => p.tagSlugs?.includes(s)) };

  // ── long content for detail pages ────────────────────────────────────────
  function cta(x) {
    return strip({ title: x.data?.cta?.title, label: x.data?.cta?.label, href: safeHref(x.data?.cta?.href) });
  }
  const detail = (x) => {
    const d = x.data ?? {};
    return strip({
      headline: d.headline, outcomes: x.kind === "group" ? undefined : list(d.outcomes), snapshot: cards(d.snapshot), stats: rows(d.stats, ["value", "label"]), problems: list(d.problems), deliverables: cards(d.deliverables), useCases: cards(d.use_cases), benefits: cards(d.benefits),
      goodFit: list(d.good_fit), notIdeal: list(d.not_ideal), process: steps(d.process), stack: stack(d.stack), guardrails: list(d.guardrails), facts: strip({ ...(d.facts ?? {}) }), compare: rows(d.compare, ["title"]), mistakes: list(d.mistakes),
      resources: rows(d.resources, ["title", "href"]).filter((r) => safeHref(r.href)), compliance: cards(d.compliance), integrations: list(d.integrations), solutions: rows(d.solutions, ["title"]), faqs: faqs(d.faqs),
      gallery: rows(d.gallery, ["image"]).filter((g) => g.image.url).map((g) => strip({ src: g.image.url, alt: g.image.alt, caption: g.caption })), video: has(d.video?.url) ? strip({ url: d.video.url, poster: d.video.poster?.url }) : undefined,
      html: x.body, cta: cta(x), seo: seo(x),
      caseStudies: (x.links?.case_study ?? []).filter((s) => caseStudies.some((c) => c.slug === s)), reviews: (x.links?.review ?? []).map((s) => reviewBySlug[s]).filter(Boolean), related: x.links?.service ?? [], posts: (x.links?.post ?? []).filter((s) => posts.some((p) => p.slug === s)), technologies: (x.links?.technology ?? []).map((t) => tech[t]?.title).filter(Boolean),
    });
  };
  for (const s of all) if (s.kind !== "subgroup") details.services[s.slug] = detail(s);
  for (const i of indRaw) details.industries[i.slug] = detail(i);
  for (const m of uniq("engagement_models")) details.models[m.slug] = detail(m);
  for (const c of caseRaw) details.caseStudies[c.slug] = strip({ html: c.body, seo: seo(c), faqs: faqs(c.data?.faqs), cta: cta(c), video: has(c.data?.video?.url) ? { url: c.data.video.url } : undefined, beforeAfter: rows(c.data?.before_after, ["title", "before", "after"]) });

  // pages with a design of their own
  const g = bySlug.service["ai-agents-automation"]?.data ?? {};
  const ai = { snapshot: cards(g.snapshot), useCases: cards(g.use_cases), goodFit: list(g.good_fit), notIdeal: list(g.not_ideal), process: steps(g.process), guardrails: list(g.guardrails), stack: stack(g.stack).map(({ category, tools }) => ({ category, tools })), faqs: faqs(g.faqs) };
  const s = bySlug.industry.saas?.data ?? {};
  const saas = { snapshot: cards(s.snapshot), problems: list(s.problems), outcomes: list(s.outcomes), solutions: rows(s.solutions, ["title"]), useCases: cards(s.use_cases), process: steps(s.process), stack: stack(s.stack), faqs: faqs(s.faqs) };
  const v = bySlug.engagement_model["mvp-sprint"]?.data ?? {};
  const mvp = { benefits: cards(v.benefits), aiEdge: list(v.ai_edge), goodFit: list(v.good_fit), notIdeal: list(v.not_ideal), deliverables: rows(v.deliverables, ["title"]), team: list(v.team), specialists: list(v.specialists), youProvide: list(v.you_provide), timeline: steps(v.process), engineering: list(v.standards), communication: list(v.communication), pricing: rows(v.pricing, ["title"]).map((r) => ({ title: r.title, description: r.text ?? "" })), pricingDependsOn: list(v.pricing_depends_on), faqs: faqs(v.faqs) };

  // ── products and pages ───────────────────────────────────────────────────
  const pcats = by("product_categories");
  const products = uniq("products").sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0) || a.sort - b.sort).flatMap((p) => {
    const d = p.data ?? {};
    if (!has(d.tagline) || !has(d.summary) || !p.cover?.url) return warn(`product "${p.title}" is not complete; left out`), [];
    return [strip({
      slug: p.slug, title: p.title, stage: p.stage, tagline: d.tagline, summary: d.summary, html: p.body, category: pcats[p.category]?.title, image: p.cover.url, imageAlt: p.cover.alt, logo: p.logo?.url, accent: d.accent, platforms: list(d.platforms), featured: p.is_featured || undefined,
      features: cards(d.features).map((f) => ({ ...f, image: f.image?.url })), benefits: list(d.benefits), for: list(d.for), useCases: cards(d.use_cases), process: steps(d.process), stats: rows(d.stats, ["value", "label"]),
      screens: rows(d.screens, ["image"]).filter((x) => x.image.url).map((x) => strip({ src: x.image.url, alt: x.image.alt, caption: x.caption })), video: has(d.video?.url) ? strip({ url: d.video.url, poster: d.video.poster?.url }) : undefined,
      pricing: strip({ mode: d.pricing?.mode || "demo", from: d.pricing?.from, note: d.pricing?.note, plans: rows(d.pricing?.plans, ["title", "price"]).map((x) => strip({ ...x, href: safeHref(x.href) })) }), faqs: faqs(d.faqs), integrations: rows(d.integrations, ["title"]).map((x) => strip({ title: x.title, logo: x.logo?.url })),
      changelog: rows(d.changelog, ["title"]), requirements: list(d.requirements), links: strip(Object.fromEntries(Object.entries(d.links ?? {}).map(([k, x]) => [k, safeHref(x)]))), technologies: (p.links?.technology ?? []).map((t) => tech[t]?.title).filter(Boolean),
      reviews: (p.links?.review ?? []).map((x) => reviewBySlug[x]).filter(Boolean), caseStudies: (p.links?.case_study ?? []).filter((x) => caseStudies.some((c) => c.slug === x)), related: p.links?.product ?? [], cta: cta(p), seo: seo(p),
    })];
  });
  const pages = uniq("pages").filter((p) => !p.system).map((p) => strip({ path: p.path, title: p.title, intro: p.data?.intro, eyebrow: p.data?.eyebrow, layout: p.data?.layout || "hero", html: p.body, image: p.cover?.url, seo: seo(p), menu: p.data?.menu, menuLabel: p.data?.menu_label }));
  const menu = pages.filter((p) => p.menu && p.menu !== "none").map((p) => ({ label: p.menuLabel || p.title, href: p.path, where: p.menu }));
  if (products.length) menu.unshift({ label: "Products", href: "/products", where: "both" });
  const mainPages = Object.fromEntries((raw.pages ?? []).filter((p) => p.system).map((p) => [p.system, p.system === "home" ? { ...strip({ seo: seo(p), hero: homeWords(p.data?.hero) }), sections: homeSections(p.data?.sections, warn) } : strip({ seo: seo(p) })]));

  // ── the whole website ────────────────────────────────────────────────────
  const S = raw.site ?? {};
  const links = (v) => rows(v, ["label", "href"]).filter((l) => safeHref(l.href)).map((l) => strip({ label: l.label, href: l.href, icon: l.icon }));
  const button = (b) => (has(b?.label) && safeHref(b?.href) ? { label: b.label, href: b.href } : undefined);
  const once = new Set();
  const items = rows(S.header?.items, ["type", "label"]).flatMap((i) => {
    if (i.type === "link") return safeHref(i.href) ? [{ type: "link", label: i.label, href: i.href }] : [];
    if (i.type === "group") return links(i.links).length ? [{ type: "group", label: i.label, links: links(i.links).map((l) => ({ ...l, icon: l.icon || "file-text" })) }] : [];
    if (once.has(i.type)) return []; // the large panels exist once
    once.add(i.type);
    return [{ type: i.type, label: i.label }];
  });
  // your own products get a top-level link (after Case studies), unless the header already links there
  const linksTo = (href) => items.some((i) => i.href === href || i.links?.some((l) => l.href === href));
  if (products.length && !linksTo("/products")) {
    const at = items.findIndex((i) => i.href === "/case-studies");
    items.splice(at >= 0 ? at + 1 : items.length, 0, { type: "link", label: "Products", href: "/products" });
  }
  // pages that asked for the Company menu
  const extra = menu.filter((m) => m.where !== "footer" && m.href !== "/products").map((m) => ({ label: m.label, href: m.href, icon: "file-text" }));
  const company = items.find((i) => i.type === "group" && i.label === "Company") ?? items.find((i) => i.type === "group");
  if (company) company.links.push(...extra.filter((e) => !company.links.some((l) => l.href === e.href)));
  else if (extra.length) items.push({ type: "group", label: "Company", links: extra });
  const header = { items, button: button(S.header?.button) ?? { label: "Book a Call", href: "/contact" } };
  const f = S.footer ?? {};
  const footerLinks = links(f.links);
  footerLinks.push(...menu.filter((m) => m.where !== "company" && !footerLinks.some((l) => l.href === m.href)).map((m) => ({ label: m.label, href: m.href })));
  const site = {
    contact: strip({ email: S.contact?.email, phone: S.contact?.phone, whatsapp: S.contact?.whatsapp, address: S.contact?.address, hours: S.contact?.hours, social: strip(Object.fromEntries(Object.entries(S.contact?.social ?? {}).filter(([, u]) => /^https?:\/\//i.test(u ?? "")))) }),
    footer: strip({ tagline: f.tagline, button: button(f.button), links: footerLinks, places: list(f.places), badges: rows(f.badges, ["title", "href"]).filter((b) => /^https?:\/\//i.test(b.href)).map((b) => strip({ title: b.title, subtitle: b.subtitle, href: b.href, color: /^#[0-9a-f]{6}$/i.test(b.color ?? "") ? b.color : undefined })), copyright: f.copyright }),
    seo: strip({ title: S.seo?.title, description: S.seo?.description, image: S.seo?.image?.url, google: S.seo?.google, bing: S.seo?.bing }),
  };
  const a = S.announcement ?? {};
  const announcement = a.mode === "off" ? { mode: "off" } : a.mode === "manual" && has(a.text) && safeHref(a.href) ? { mode: "manual", kind: a.kind || "new", text: a.text, href: a.href } : { mode: "auto" };
  const redirects = (raw.redirects ?? []).filter((r) => /^\/[^\s]*$/.test(r.from) && r.from !== r.to);

  return {
    services: { groups, services, models }, engagement: { comparison, oneLiners, mvp }, industries, industryServices, saas, ai, outcomes,
    posts, blog, caseStudies, reviews, details, products, pages, mainPages, header, site, announcement, redirects,
  };
}

/** Refuse to replace a good site with an empty or broken one. */
export function checkSite(site) {
  const problems = [];
  const need = { "service groups": site.services.groups, services: site.services.services, "engagement models": site.services.models, industries: site.industries, posts: site.posts, "case studies": site.caseStudies };
  for (const [name, v] of Object.entries(need)) if (!v.length) problems.push(`There are no published ${name}.`);
  if (!site.header.items.length) problems.push("The header menu is empty.");
  // these have pages of their own in the code
  for (const s of ["ai-agents-automation"]) if (!site.services.groups.some((g) => g.slug === s)) problems.push(`The service group "${s}" must stay published.`);
  for (const h of ["/engagement/mvp-sprint", "/engagement/end-to-end-delivery", "/hire-dedicated-developers", "/staff-augmentation", "/offshore-development-center"]) if (!site.services.models.some((m) => m.href === h)) problems.push(`The engagement model at ${h} must stay published.`);
  if (!site.industries.some((i) => i.href === "/industries/saas")) problems.push("The SaaS industry must stay published.");
  return problems;
}
