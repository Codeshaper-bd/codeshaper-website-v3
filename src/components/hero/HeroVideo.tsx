"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/motion";

/**
 * Full-bleed hero background video (centered-cinematic layout).
 *
 * The video is the hero's primary visual, so it plays at full opacity — legibility
 * comes from a radial vignette + a soft centre scrim above it, never from
 * dimming the media itself.
 *
 * Zero CLS: the layer is absolutely positioned inside the section (reserves no
 * flow space) and `poster` paints a matching frame before decode.
 * Reduced motion: poster image only, video never mounts.
 *
 * Sources: /media/hero-aurora.webm → .mp4. Overwrite either file to swap the
 * loop; no code change required.
 */
/** Seedance 2.0 "aurora silk in zero gravity" loop (10s, 1280×720). */
export const SEEDANCE_HERO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_3G4wWYLzEVDeQ5iYQBJyclXgBPs/hf_20260726_123207_b538d7a0-fcd4-48fd-8714-4822a1af8578.mp4";

export default function HeroVideo() {
  const reduced = usePrefersReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || reduced) return;
    // React omits `muted` from SSR markup, which blocks autoplay.
    v.muted = true;
    v.play().catch(() => {});
    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()),
      { threshold: 0 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <>
      {reduced || failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/media/hero-aurora-poster.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden
        />
      ) : (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          poster="/media/hero-aurora-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onError={() => setFailed(true)}
          aria-hidden
        >
          {/* Seedance 2.0 loop, served straight from Higgsfield's CDN so it
              plays without a manual download. The build sandbox can't reach
              this host, but browsers can. Save it into /public/media and drop
              this <source> to self-host. */}
          <source src={SEEDANCE_HERO_URL} type="video/mp4" />
          {/* locally rendered fallbacks if the CDN URL ever 404s */}
          <source src="/media/hero-aurora.webm" type="video/webm" />
          <source src="/media/hero-aurora.mp4" type="video/mp4" />
        </video>
      )}

      {/* Vignette: darkens edges, keeps the centre bright */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(115% 85% at 50% 45%, transparent 0%, rgba(10,10,15,0.35) 55%, rgba(10,10,15,0.88) 100%)",
        }}
      />
      {/* Soft centre scrim purely behind the copy block */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-1/2 h-[60%] -translate-y-1/2"
        style={{
          background:
            "radial-gradient(60% 70% at 50% 50%, rgba(10,10,15,0.62) 0%, rgba(10,10,15,0.28) 55%, transparent 100%)",
        }}
      />
      {/* Top + bottom fades so the navbar and proof bar sit on solid ground */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-32"
        style={{ background: "linear-gradient(180deg, rgba(10,10,15,0.9), transparent)" }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-40"
        style={{ background: "linear-gradient(0deg, rgba(10,10,15,0.95), transparent)" }}
      />
    </>
  );
}
