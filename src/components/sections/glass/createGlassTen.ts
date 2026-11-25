import {
  BackSide,
  BoxGeometry,
  CanvasTexture,
  Color,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  NeutralToneMapping,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  Scene,
  SRGBColorSpace,
  WebGLRenderer,
} from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import digits from "./digits.typeface.json";

/**
 * Real-time glass numeral for "Our journey": an extruded, bevelled "10" in a
 * physically based glass material (transmission + dispersion + a touch of
 * iridescence). What makes glass read as premium rather than grey plastic is
 * what it reflects and refracts, so the scene provides both:
 *  - a soft studio environment of white and pastel light panels (lavender,
 *    sky, peach) for the reflections;
 *  - the section's own wash painted on a backdrop plane, with a soft pool of
 *    colour light behind the numeral for the glass to bend.
 * The canvas therefore blends seamlessly with the section around it.
 *
 * Plain three.js, loaded only through dynamic import (like the hero globe).
 * Renders only while on screen; one still frame under reduced motion.
 */
/** ok: false when WebGL could not start (the caller shows its CSS stand-in) */
export type GlassTen = { dispose: () => void; ok?: boolean };

type Anchor = { x: number; y: number; height: number };
type Options = { canvas: HTMLCanvasElement; value: string; anchor: () => Anchor; reducedMotion: boolean; dragTarget?: HTMLElement | null };

/** Studio light for reflections: a soft white room with pastel light panels. */
function studio() {
  const scene = new Scene();
  const room = new Mesh(new BoxGeometry(20, 20, 20), new MeshBasicMaterial({ color: new Color("#cfcdda"), side: BackSide }));
  scene.add(room);
  const panel = (w: number, h: number, color: string, x: number, y: number, z: number, ry = 0, rx = 0) => {
    const m = new Mesh(new PlaneGeometry(w, h), new MeshBasicMaterial({ color: new Color(color) }));
    m.position.set(x, y, z);
    m.rotation.set(rx, ry, 0);
    m.lookAt(0, 0, 0);
    scene.add(m);
  };
  panel(12, 3, "#ffffff", 0, 9, 2); // key light from above
  panel(6, 8, "#c7bfff", -9, 1, 3); // lavender, left
  panel(6, 8, "#b9d8ff", 9, 2, -2); // sky, right
  panel(10, 4, "#ffd6c4", 2, -8, 4); // peach, below
  panel(4, 10, "#ffffff", -3, 0, 9.5); // a tall strip in front: the long highlight on the faces
  // dark panels: glass reads by contrast, so its edges need something dark to reflect
  panel(5, 14, "#1d1b2e", -9.5, 0, -6);
  panel(5, 14, "#25223a", 9.5, -1, 6);
  panel(14, 3, "#2b2842", 0, -9.5, -4);
  return scene;
}

/** The section's soft wash, plus a pool of colour light where the numeral sits. */
function paintBackdrop(w: number, h: number, a: Anchor) {
  const c = document.createElement("canvas");
  c.width = Math.max(2, Math.round(w));
  c.height = Math.max(2, Math.round(h));
  const g = c.getContext("2d")!;
  g.fillStyle = "#ffffff";
  g.fillRect(0, 0, c.width, c.height);
  const blob = (x: number, y: number, r: number, color: string) => {
    const grad = g.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, color);
    grad.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, c.width, c.height);
  };
  // the section wash (same as the CSS fallback)
  blob(0, 0, c.width * 0.7, "rgba(199,192,255,0.38)");
  blob(c.width, c.height * 0.2, c.width * 0.55, "rgba(186,214,255,0.32)");
  blob(c.width * 0.7, c.height * 1.1, c.width * 0.6, "rgba(255,214,196,0.32)");
  // the light behind the glass: lavender core, sky to the upper right, peach to the lower left
  const cx = a.x * c.width;
  const cy = a.y * c.height;
  const r = a.height * c.height;
  blob(cx - r * 0.25, cy + r * 0.2, r * 0.75, "rgba(255,200,186,0.55)");
  blob(cx + r * 0.35, cy - r * 0.25, r * 0.8, "rgba(165,200,255,0.6)");
  blob(cx, cy, r * 0.65, "rgba(178,164,255,0.62)");
  const tex = new CanvasTexture(c);
  tex.colorSpace = SRGBColorSpace;
  return tex;
}

export function createGlassTen({ canvas, value, anchor, reducedMotion, dragTarget }: Options): GlassTen {
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
  } catch {
    return { dispose() {}, ok: false };
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = NeutralToneMapping;
  renderer.toneMappingExposure = 1.1;

  const scene = new Scene();
  scene.background = new Color("#ffffff");
  const pmrem = new PMREMGenerator(renderer);
  const envScene = studio();
  const env = pmrem.fromScene(envScene, 0.02).texture;
  scene.environment = env;

  const camera = new PerspectiveCamera(26, 1, 1, 5000);
  camera.position.set(0, 0, 1200);

  const backdropMat = new MeshBasicMaterial({ toneMapped: false });
  const backdrop = new Mesh(new PlaneGeometry(1, 1), backdropMat);
  backdrop.position.z = -320;
  scene.add(backdrop);

  const font = new FontLoader().parse(digits as never);
  const geo = new TextGeometry(value, { font, size: 100, depth: 30, curveSegments: 24, bevelEnabled: true, bevelThickness: 10, bevelSize: 6, bevelSegments: 12 });
  geo.center();
  geo.computeBoundingBox();
  const glyphHeight = geo.boundingBox!.max.y - geo.boundingBox!.min.y;
  const glass = new MeshPhysicalMaterial({
    color: new Color("#ffffff"),
    metalness: 0,
    roughness: 0.0,
    transmission: 1,
    thickness: 70,
    ior: 1.48,
    dispersion: 8,
    iridescence: 0.6,
    iridescenceIOR: 1.35,
    iridescenceThicknessRange: [180, 520],
    clearcoat: 1,
    clearcoatRoughness: 0.02,
    specularIntensity: 1,
    envMapIntensity: 1.3,
  });
  const mesh = new Mesh(geo, glass);
  scene.add(mesh);

  let viewH = 1;
  const base = { x: 0, y: 0 };
  const layout = () => {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const fov = (camera.fov * Math.PI) / 180;
    const atBack = 2 * Math.tan(fov / 2) * (camera.position.z - backdrop.position.z);
    backdrop.scale.set(atBack * camera.aspect, atBack, 1);
    const a = anchor();
    backdropMat.map?.dispose();
    backdropMat.map = paintBackdrop(w, h, a);
    backdropMat.needsUpdate = true;
    viewH = 2 * Math.tan(fov / 2) * camera.position.z;
    const viewW = viewH * camera.aspect;
    mesh.scale.setScalar((a.height * viewH) / glyphHeight);
    base.x = (a.x - 0.5) * viewW;
    base.y = (0.5 - a.y) * viewH;
    mesh.position.set(base.x, base.y, 0);
  };

  // pointer: a gentle turn towards the cursor, eased
  const target = { x: 0, y: 0 };
  const eased = { x: 0, y: 0 };
  const onMove = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    target.x = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - 0.5) * 2));
    target.y = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - 0.5) * 2));
  };
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (fine && !reducedMotion) window.addEventListener("pointermove", onMove, { passive: true });

  // drag to spin: the numeral turns with the pointer, keeps some momentum when
  // released, then springs back to its resting angle (mouse, pen and touch)
  const spin = { x: 0, y: 0, vx: 0, vy: 0, dragging: false, lastX: 0, lastY: 0 };
  const onDown = (e: PointerEvent) => {
    if (!dragTarget) return;
    spin.dragging = true;
    spin.lastX = e.clientX;
    spin.lastY = e.clientY;
    spin.vx = spin.vy = 0;
    dragTarget.setPointerCapture(e.pointerId);
    dragTarget.style.cursor = "grabbing";
    kick();
  };
  const onDrag = (e: PointerEvent) => {
    if (!spin.dragging) return;
    const dx = e.clientX - spin.lastX;
    const dy = e.clientY - spin.lastY;
    spin.lastX = e.clientX;
    spin.lastY = e.clientY;
    spin.vy = dx * 0.012;
    spin.vx = dy * 0.008;
    spin.y += spin.vy;
    spin.x = Math.max(-0.9, Math.min(0.9, spin.x + spin.vx));
    kick();
  };
  const onUp = (e: PointerEvent) => {
    if (!spin.dragging || !dragTarget) return;
    spin.dragging = false;
    dragTarget.releasePointerCapture?.(e.pointerId);
    dragTarget.style.cursor = "grab";
    kick();
  };
  if (dragTarget) {
    dragTarget.style.cursor = "grab";
    dragTarget.style.touchAction = "pan-y"; // vertical swipes still scroll the page on phones
    dragTarget.addEventListener("pointerdown", onDown);
    dragTarget.addEventListener("pointermove", onDrag);
    dragTarget.addEventListener("pointerup", onUp);
    dragTarget.addEventListener("pointercancel", onUp);
  }

  let raf = 0;
  let visible = true;
  let disposed = false;
  const start = performance.now();
  const frame = () => {
    raf = 0;
    if (disposed) return;
    const t = (performance.now() - start) / 1000;
    const m = reducedMotion ? 0 : 1;
    eased.x += (target.x - eased.x) * 0.05;
    eased.y += (target.y - eased.y) * 0.05;
    if (!spin.dragging) {
      // momentum, then a soft spring back to rest (the nearest full turn, so it never unwinds)
      spin.y += spin.vy;
      spin.x += spin.vx;
      spin.vy *= 0.94;
      spin.vx *= 0.9;
      const home = Math.round(spin.y / (Math.PI * 2)) * Math.PI * 2;
      if (Math.abs(spin.vy) < 0.02) spin.y += (home - spin.y) * 0.06;
      spin.x += (0 - spin.x) * 0.08;
    }
    mesh.rotation.y = -0.38 + spin.y + m * (Math.sin(t * 0.3) * 0.12 + eased.x * 0.16);
    mesh.rotation.x = 0.1 + spin.x + m * (Math.sin(t * 0.23) * 0.05 - eased.y * 0.08);
    mesh.rotation.z = -0.04;
    mesh.position.y = base.y + m * Math.sin(t * 0.7) * viewH * 0.01;
    renderer.render(scene, camera);
    const settling = Math.abs(spin.vy) > 0.0005 || Math.abs(spin.x) > 0.0005 || Math.abs(spin.y - Math.round(spin.y / (Math.PI * 2)) * Math.PI * 2) > 0.0005;
    if (visible && (!reducedMotion || spin.dragging || settling)) raf = requestAnimationFrame(frame);
  };
  const kick = () => {
    if (!raf && !disposed) raf = requestAnimationFrame(frame);
  };

  const ro = new ResizeObserver(() => {
    layout();
    kick();
  });
  ro.observe(canvas);
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) kick();
  });
  io.observe(canvas);
  layout();
  kick();

  return {
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      dragTarget?.removeEventListener("pointerdown", onDown);
      dragTarget?.removeEventListener("pointermove", onDrag);
      dragTarget?.removeEventListener("pointerup", onUp);
      dragTarget?.removeEventListener("pointercancel", onUp);
      geo.dispose();
      glass.dispose();
      backdropMat.map?.dispose();
      backdropMat.dispose();
      backdrop.geometry.dispose();
      envScene.traverse((o) => {
        if (o instanceof Mesh) {
          o.geometry.dispose();
          (o.material as MeshBasicMaterial).dispose();
        }
      });
      env.dispose();
      pmrem.dispose();
      renderer.dispose();
      // give the WebGL context back now: a tab gets about 16, and site navigation creates new ones
      renderer.forceContextLoss();
    },
  };
}
