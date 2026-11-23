"use client";

import Image from "next/image";
import { useEffect, useRef, type ReactNode, type CSSProperties } from "react";
import styles from "./PhotoCloud.module.css";

const palettes = [
  ["#f6c27a", "#a9cdfb"], ["#8b7dff", "#e6d6ff"], ["#ff9fb4", "#ffd08a"],
  ["#5b9cf0", "#c7defc"], ["#ffa47a", "#d9b8ff"],
];

// Opening rectangles: centre x/y and width as percentages of the stage, then aspect ratio.
const photos = [
  { file: "wall-duo", area: "duo", alt: "Two teammates beside the CodeShaper mural", wide: [7, 43, 7.5, 1.4], narrow: [13, 63, 21, 1.35], angle: -5 },
  { file: "new-year", area: "year", alt: "New Year at the CodeShaper studio", wide: [25.2, 10, 10.2, 1.8], narrow: [32, 55, 15, 1.4], angle: 2 },
  { file: "desk-portrait", area: "portrait", alt: "A designer at her workstation", wide: [93, 12, 8, 1.12], narrow: [89, 51, 14, 0.9], angle: -3 },
  { file: "beach-sign", area: "sign", alt: "Holding the I love CodeShaper sign on the beach", wide: [94, 46, 7, 0.82], narrow: [87, 65, 16, 0.85], angle: 4 },
  { file: "desk", area: "desk", alt: "A developer at his desk", wide: [12, 68, 10.5, 1.55], narrow: [14, 75, 22, 1.6], angle: -2 },
  { file: "team-hoodies", area: "hero", alt: "The team in matching CodeShaper hoodies", wide: [76, 11, 8.5, 1.35], narrow: [70, 53, 18, 1.4], angle: -3 },
  { file: "studio-lunch", area: "lunch", alt: "Teammates sharing lunch at the studio", wide: [5.5, 10, 9, 1.5], narrow: [14, 51, 20, 1.5], angle: 3 },
  { file: "airport", area: "airport", alt: "The team at the airport before the annual tour", wide: [15, 84, 13, 1.95], narrow: [15, 87, 23, 1.7], angle: 3 },
  { file: "studio-birthday", area: "cake", alt: "A birthday celebration around a cake at the studio", wide: [72, 85, 12, 1.95], narrow: [72, 87, 19, 1.55], angle: 1 },
  { file: "studio-gathering", area: "group", alt: "CodeShaper teammates gathered indoors", wide: [89, 80, 12.5, 1.85], narrow: [87, 77, 21, 1.5], angle: -3 },
];

export default function PhotoCloud({ children }: { children: ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return;
    const motion = matchMedia("(prefers-reduced-motion: no-preference) and (min-height: 600px)");
    const tiles = Array.from(stage.querySelectorAll<HTMLElement>(`.${styles.tile}`));
    let pointerFrame = 0;
    function measure() {
      if (!stage) return;
      const width = stage.clientWidth;
      const height = stage.clientHeight;
      tiles.forEach((tile, index) => {
        const wall = tile.offsetParent as HTMLElement;
        const gallery = wall.offsetParent as HTMLElement;
        const photo = photos[index];
        const [x, y, relativeWidth, ratio] = width >= 1200 ? photo.wide : photo.narrow;
        const openingWidth = Math.min(width * relativeWidth / 100, height * .18 * ratio);
        const openingHeight = openingWidth / ratio;
        const left = gallery.offsetLeft + wall.offsetLeft + tile.offsetLeft;
        const top = gallery.offsetTop + wall.offsetTop + tile.offsetTop;
        tile.style.setProperty("--dx", `${width * x / 100 - openingWidth / 2 - left}px`);
        tile.style.setProperty("--dy", `${height * y / 100 - openingHeight / 2 - top}px`);
        tile.style.setProperty("--dw", `${openingWidth - tile.offsetWidth}px`);
        tile.style.setProperty("--dh", `${openingHeight - tile.offsetHeight}px`);
      });
    }
    let frame = 0;
    let near = false;
    function update() {
      frame = 0;
      if (!track || !stage) return;
      const inset = parseFloat(getComputedStyle(stage).top) || 0;
      const travel = Math.max(1, track.offsetHeight - stage.offsetHeight);
      const progress = Math.min(1, Math.max(0, (inset - track.getBoundingClientRect().top) / (travel * .85)));
      const eased = progress * progress * (3 - 2 * progress);
      stage.style.setProperty("--loose", motion.matches ? String(1 - eased) : "0");
      const reveal = Math.min(1, Math.max(0, (eased - .44) / .56));
      stage.style.setProperty("--reveal", motion.matches ? String(reveal) : "1");
    }
    function schedule() {
      if (near && motion.matches && !frame) frame = requestAnimationFrame(update);
    }
    function setPointerDepth(clientX: number, clientY: number) {
      if (!motion.matches) return;
      cancelAnimationFrame(pointerFrame);
      pointerFrame = requestAnimationFrame(() => {
        if (!stage) return;
        const bounds = stage.getBoundingClientRect();
        const x = Math.max(-1, Math.min(1, (clientX - bounds.left) / bounds.width * 2 - 1));
        const y = Math.max(-1, Math.min(1, (clientY - bounds.top) / bounds.height * 2 - 1));
        tiles.forEach((tile, index) => {
          const depth = 4 + (index % 4) * 2.5;
          tile.style.setProperty("--px", `${x * depth}px`);
          tile.style.setProperty("--py", `${y * depth * .65}px`);
        });
      });
    }
    function resetPointerDepth() {
      tiles.forEach((tile) => {
        tile.style.setProperty("--px", "0px");
        tile.style.setProperty("--py", "0px");
      });
    }
    function onPointerMove(event: PointerEvent) {
      setPointerDepth(event.clientX, event.clientY);
    }
    const observer = new IntersectionObserver(([entry]) => {
      near = entry.isIntersecting;
      if (near) update();
    }, { rootMargin: "150px" });
    observer.observe(track);
    const resize = new ResizeObserver(() => { measure(); schedule(); });
    measure();
    resize.observe(stage);
    window.addEventListener("scroll", schedule, { passive: true });
    stage.addEventListener("pointermove", onPointerMove, { passive: true });
    stage.addEventListener("pointerleave", resetPointerDepth);
    motion.addEventListener("change", update);
    update();
    return () => {
      observer.disconnect();
      resize.disconnect();
      cancelAnimationFrame(frame);
      cancelAnimationFrame(pointerFrame);
      window.removeEventListener("scroll", schedule);
      stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerleave", resetPointerDepth);
      motion.removeEventListener("change", update);
    };
  }, []);

  return (
    <div className={styles.track} ref={trackRef}>
      <section className={`theme-light ${styles.stage}`} ref={stageRef} aria-labelledby="impact-heading">
        <div className={styles.light} aria-hidden="true">
          {palettes.map(([core, outer], i) => (
            <div key={core} style={{
              backgroundImage: `radial-gradient(ellipse 70% 85% at 50% 100%, ${core}, ${outer}99 52%, transparent 86%)`,
              animationDelay: `${i * 6 - 3}s`,
            }} />
          ))}
        </div>
        {children}
        <div className={styles.gallery} role="group" aria-label="Life at CodeShaper">
          <div className={styles.backdrop} aria-hidden="true" />
          <div className={styles.grain} aria-hidden="true" />
          <ul className={styles.wall}>
            {photos.map(({ file, area, alt, angle }, index) => (
              <li key={file} className={styles.tile} style={{
                gridArea: area,
                "--angle": angle + "deg", "--delay": -index * .7 + "s",
              } as CSSProperties}>
                <div className={styles.print}>
                  {/* the photo sits inside a white print frame (collage look) */}
                  <div className={styles.photo}>
                    <Image src={`/media/studio/${file}.webp`} alt={alt} fill
                      sizes={area === "hero" ? "(min-width: 768px) 560px, 74vw" : "(min-width: 768px) 420px, 48vw"}
                      className={styles.image} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
