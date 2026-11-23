# 07 · Images & visuals

## What we use, in order of preference

1. **Real work:** client project screens and videos (`public/media/case-studies/`), product screens (CMS › Products).
2. **Real people:** team photos (`public/media/studio/`), leadership portraits (CMS). Real beats stock every time.
3. **Data made visible:** the globe, the dotted world map, charts, built from real data only.
4. **Product-style UI vignettes:** small, believable interface fragments (services bento). Only where there is no real screen.
5. **Stock photos:** industries only, and never of "people pretending to be clients".

Never: AI-generated people, fake client logos, illustration filler, sparkle/robot "AI" clichés.

## Treatment

- **Screens** sit in the browser frame ([06-components](06-components.md)), anchored top-left (`object-left-top`) so the app's navigation shows.
- **Media panels** behind screens: warm `#f6f4f1` with at most one soft radial wash in the subject's own colour (≤ 40% opacity).
- **Portraits:** `aspect-[4/5]`, consistent crop (eyes in the top third), grayscale at rest → colour on hover for a group, so mixed photos look like one set.
- **Aspect ratios:** 16:9 (blog lead, video), 16:10 (product screens), 4:3 (thumbnails), 4:5 (people). Pick one per pattern and keep it.
- **Radius** of an image = the radius of its container minus the padding.

## Technical

- Use `next/image` with honest `sizes`; decorative images get `alt=""`, meaningful ones a real description.
- Pictures from the CMS live under `/cms/…`; static ones under `/media/…`.
- Keep hero and above-the-fold images light; everything below the fold is lazy.
- Placeholders (missing photo) show a neutral card with a person icon and a **Placeholder** chip, never a random stock face.
