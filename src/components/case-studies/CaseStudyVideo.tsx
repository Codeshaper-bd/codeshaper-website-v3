"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

/** Silent project films load on approach and only play while visible. */
export default function CaseStudyVideo({
  src,
  poster,
  project,
  className = "",
}: {
  src: string;
  poster: string;
  project: string;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const manuallyStarted = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const load = () => {
      if (!video.getAttribute("src")) {
        video.src = src;
        video.load();
      }
    };
    const syncPlayback = () => {
      if (visible && !document.hidden && !userPaused.current && (!reducedMotion.matches || manuallyStarted.current)) {
        load();
        void video.play().catch(() => { /* The play button remains available if autoplay is blocked. */ });
      } else {
        video.pause();
      }
    };
    const onMotionChange = () => {
      manuallyStarted.current = false;
      syncPlayback();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= 0.35;
      syncPlayback();
    }, { threshold: [0, 0.35] });

    observer.observe(video);
    document.addEventListener("visibilitychange", syncPlayback);
    reducedMotion.addEventListener("change", onMotionChange);
    return () => {
      observer.disconnect();
      video.pause();
      document.removeEventListener("visibilitychange", syncPlayback);
      reducedMotion.removeEventListener("change", onMotionChange);
    };
  }, [src]);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      userPaused.current = false;
      manuallyStarted.current = true;
      if (!video.getAttribute("src")) video.src = src;
      void video.play().catch(() => {});
    } else {
      userPaused.current = true;
      video.pause();
    }
  };

  return (
    <div className={`relative isolate h-full w-full overflow-hidden bg-[#0b0f19] ${className}`}>
      {failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={poster} alt={`${project} project preview`} className="h-full w-full object-contain" />
      ) : (
        <video
          ref={videoRef}
          poster={poster}
          muted
          loop
          playsInline
          preload="none"
          aria-label={`${project} project film`}
          className="h-full w-full object-contain"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onError={() => { setFailed(true); setPlaying(false); }}
        />
      )}
      {!failed && (
        <button
          type="button"
          onClick={togglePlayback}
          aria-label={`${playing ? "Pause" : "Play"} ${project} project film`}
          className="absolute bottom-3 left-3 z-10 inline-flex h-10 items-center gap-2 rounded-full border border-white/25 bg-black/60 px-3.5 font-urbanist text-xs font-semibold text-white shadow-sm backdrop-blur-md transition-colors hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {playing ? <Pause size={13} fill="currentColor" aria-hidden /> : <Play size={13} fill="currentColor" aria-hidden />}
          <span>{playing ? "Pause" : "Play film"}</span>
        </button>
      )}
    </div>
  );
}
