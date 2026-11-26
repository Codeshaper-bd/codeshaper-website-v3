import type { VoiceState } from "@/lib/ai/voiceMachine";
import styles from "./ai.module.css";

/**
 * Two candidate looks for voice, for the owner to choose between. Both are decoration driven by the
 * state only, on loops: no sound is measured. The real version must move with the real input and
 * output level. SVG and CSS only.
 */
export type VoiceStyle = "orb" | "wave";
export const VOICE_STYLES: [VoiceStyle, string][] = [
  ["orb", "A · Spatial orb"],
  ["wave", "B · Editorial waveform"],
];

/** A ribbon two screens long that repeats exactly, so sliding it by half loops without a seam. */
function ribbon(amplitude: number, waves: number, phase: number) {
  const points: string[] = [];
  for (let x = 0; x <= 1280; x += 8) {
    const t = (x / 640) * Math.PI * 2;
    // quieter at the edges of each screen, fuller in the middle
    const swell = 0.35 + 0.65 * Math.sin((x / 640) * Math.PI) ** 2;
    const y = 100 + amplitude * swell * Math.sin(t * waves + phase);
    points.push(`${x === 0 ? "M" : "L"}${x} ${y.toFixed(1)}`);
  }
  return points.join("");
}
const RIBBONS = [
  { d: ribbon(48, 3, 0), width: 3.5, opacity: 1, speed: 1 },
  { d: ribbon(36, 4, 1.8), width: 2.25, opacity: 0.5, speed: 2 },
  { d: ribbon(60, 2, 3.6), width: 1.5, opacity: 0.3, speed: 3 },
  { d: ribbon(24, 5, 4.9), width: 1, opacity: 0.25, speed: 2 },
];

export default function VoiceVisual({ look, state, size }: { look: VoiceStyle; state: VoiceState; size: "full" | "medium" | "compact" }) {
  const fit = size === "full" ? "" : styles[size];
  if (look === "wave") {
    return (
      <div aria-hidden data-visual="wave" data-state={state} className={`${styles.wave} ${fit}`}>
        <svg viewBox="0 0 640 200" preserveAspectRatio="none">
          {RIBBONS.map((r, i) => (
            <g key={i} className={styles.level}>
              <path className={styles[`slide${r.speed}`]} d={r.d} fill="none" strokeWidth={r.width} strokeOpacity={r.opacity} vectorEffect="non-scaling-stroke" />
            </g>
          ))}
        </svg>
      </div>
    );
  }
  return (
    <div aria-hidden data-visual="orb" data-state={state} className={`${styles.orb} ${fit}`}>
      <span className={styles.shadow} />
      <span className={styles.halo} />
      <span className={styles.sphere}>
        <span className={styles.cloud} />
        <span className={styles.cloud} />
        <span className={styles.cloud} />
        <span className={styles.shine} />
      </span>
    </div>
  );
}
