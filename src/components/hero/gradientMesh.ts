export type MeshBlob = {
  /** base position as a fraction of width/height, 0–1 */
  x: number;
  y: number;
  /** radius as a fraction of max(width, height) */
  r: number;
  color: string;
  /** drift speed, radians per ms */
  speed: number;
  /** phase offset, radians */
  phase: number;
  /** drift amplitude as a fraction of width/height */
  amp: number;
};

export const MESH_BLOBS: MeshBlob[] = [
  { x: 0.26, y: 0.3, r: 0.58, color: "rgba(102,126,234,0.55)", speed: 0.00009, phase: 0, amp: 0.09 },
  { x: 0.74, y: 0.42, r: 0.5, color: "rgba(20,184,166,0.4)", speed: 0.00007, phase: 2.1, amp: 0.11 },
  { x: 0.48, y: 0.7, r: 0.64, color: "rgba(68,84,155,0.32)", speed: 0.00006, phase: 4.4, amp: 0.08 },
];

/**
 * Paints a soft, slowly-drifting multi-blob radial-gradient mesh onto `ctx`
 * — a white base with indigo/teal/deep-indigo blobs. Pure function: same
 * (width, height, elapsedMs) always produces the same frame. Used
 * identically by the full-bleed hero background (HeroMesh) and the
 * video-masked type (MeshType) so both read as one visual system.
 */
export function drawGradientMesh(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  elapsedMs: number
): void {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  const size = Math.max(width, height);
  for (const b of MESH_BLOBS) {
    const dx = Math.sin(elapsedMs * b.speed + b.phase) * b.amp * width;
    const dy = Math.cos(elapsedMs * b.speed * 0.8 + b.phase) * b.amp * height;
    const cx = b.x * width + dx;
    const cy = b.y * height + dy;
    const r = b.r * size;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, b.color);
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);
  }
}
