import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  SphereGeometry,
  ShaderMaterial,
  Mesh,
  Group,
  TextureLoader,
  SRGBColorSpace,
  LinearFilter,
  Color,
  type Texture,
} from "three";

/**
 * Pearl globe renderer: plain three.js, loaded only via dynamic import.
 *
 * Adapted from Aceternity UI's "3D Globe" (sphere + lit surface + latitude/
 * longitude orientation), with local changes for this hero:
 *  · no @react-three/fiber / drei: an imperative renderer gives on-demand
 *    rendering, exact pointer control and complete disposal;
 *  · surface is a custom shader, a pearl ocean with soft slate continents from
 *    a land mask (Natural Earth 1:50m, public domain), instead of the
 *    photographic Blue Marble texture hot-linked from unpkg;
 *  · no markers, arcs, auto-rotate, zoom, pan, inertia or damping;
 *  · the coloured atmosphere is NOT drawn here: it's CSS behind the canvas,
 *    driven by the hero gradient's own keyframes (see HeroGlobe.tsx).
 *
 * Frames render only when something changes (drag, reset, resize).
 *
 * Geometry contract (CSS px), shared with HeroGlobe.tsx:
 *   D = sphere diameter; the canvas is F = 1.16·D wide and H tall, showing
 *   the rows [Y0, Y0 + H] of a virtual F×F frame centred on the sphere.
 */
export const FRAME = 1.16; // frame width / sphere diameter
export const Y0 = 0.02; // first visible frame row, as a fraction of D

const FOV = 30;
// camera distance so the sphere's silhouette spans 1/FRAME of the frame
const DIST = 1 / Math.sin(Math.atan(Math.tan((FOV / 2) * (Math.PI / 180)) / FRAME));

// initial orientation: Europe / Africa / Asia facing the viewer, tilted so
// the visible upper cap shows the northern hemisphere's land
const BASE_SPIN = -2.15;
const BASE_TILT = 0.22;
const TILT_RANGE = 0.45;

export type GlobeHandle = {
  reset: () => void;
  dispose: () => void;
};

type Options = {
  host: HTMLElement; // the stage box (width F, height H)
  textureUrl: string;
  reducedMotion: boolean;
  onReady: () => void;
  onFail: (reason: string) => void;
  onRotatedChange: (rotated: boolean) => void;
};

const vertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormalV;
  void main() {
    vUv = uv;
    vNormalV = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragment = /* glsl */ `
  uniform sampler2D uLand;
  uniform vec3 uOcean;
  uniform vec3 uLandCol;
  uniform vec3 uRim;
  varying vec2 vUv;
  varying vec3 vNormalV;
  void main() {
    vec3 n = normalize(vNormalV);
    float land = texture2D(uLand, vUv).r;
    vec3 base = mix(uOcean, uLandCol, smoothstep(0.25, 0.75, land));
    // soft key light from upper left, never harsh
    vec3 l = normalize(vec3(-0.45, 0.65, 0.62));
    float diffuse = max(dot(n, l), 0.0);
    float shade = 0.86 + 0.16 * diffuse;
    // gentle limb darkening gives the silhouette shape against light backgrounds
    float facing = clamp(n.z, 0.0, 1.0);
    shade *= 0.9 + 0.1 * facing;
    vec3 col = base * shade;
    // pale rim so the edge reads as an atmosphere-lit surface (colour comes from CSS)
    float rim = pow(1.0 - facing, 3.0);
    col = mix(col, uRim, rim * 0.55);
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

export function createGlobe(o: Options): GlobeHandle {
  const { host } = o;
  let disposed = false;
  let renderer: WebGLRenderer;

  try {
    renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
  } catch {
    o.onFail("webgl-unavailable");
    return { reset() {}, dispose() {} };
  }
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  const canvas = renderer.domElement;
  canvas.className = "absolute inset-0 h-full w-full opacity-0 transition-opacity duration-500";
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.touchAction = "pan-y"; // never block vertical page scrolling
  canvas.style.pointerEvents = "auto"; // the slot around it is click-through
  host.appendChild(canvas);

  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 50);
  camera.position.set(0, 0, DIST);
  camera.lookAt(0, 0, 0);

  const tiltGroup = new Group();
  tiltGroup.rotation.x = BASE_TILT;
  scene.add(tiltGroup);

  const geometry = new SphereGeometry(1, 96, 64);
  const material = new ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms: {
      uLand: { value: null as Texture | null },
      uOcean: { value: new Color("#f4f6fa") },
      uLandCol: { value: new Color("#d3d9e4") },
      uRim: { value: new Color("#ffffff") },
    },
  });
  const sphere = new Mesh(geometry, material);
  sphere.rotation.y = BASE_SPIN;
  tiltGroup.add(sphere);

  // ── sizing ───────────────────────────────────────────────
  let F = 0; // frame width = canvas width (css px)
  let H = 0;
  let D = 0;
  const layout = () => {
    F = host.clientWidth;
    H = host.clientHeight;
    D = F / FRAME;
    if (!F || !H) return;
    renderer.setSize(F, H, false);
    camera.aspect = 1;
    camera.setViewOffset(F, F, 0, Y0 * D, F, H);
    camera.updateProjectionMatrix();
    requestRender();
  };

  // ── on-demand rendering ─────────────────────────────────
  let raf = 0;
  let renders = 0; // dev diagnostics only
  const requestRender = () => {
    if (raf || disposed) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      if (!disposed) {
        renderer.render(scene, camera);
        renders++;
      }
    });
  };

  // ── texture ──────────────────────────────────────────────
  new TextureLoader().load(
    o.textureUrl,
    (tex) => {
      if (disposed) return tex.dispose();
      tex.colorSpace = SRGBColorSpace;
      tex.minFilter = LinearFilter;
      tex.generateMipmaps = false;
      tex.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
      material.uniforms.uLand.value = tex;
      layout();
      requestAnimationFrame(() => {
        if (disposed) return;
        renderer.render(scene, camera);
        canvas.style.opacity = "1";
        o.onReady();
      });
    },
    undefined,
    () => o.onFail("texture-failed")
  );

  // ── drag to rotate (mouse/pen, inside the sphere only) ─────
  let dragging: { id: number; x: number; y: number } | null = null;
  let rotated = false;
  const setRotated = (v: boolean) => {
    if (v !== rotated) {
      rotated = v;
      o.onRotatedChange(v);
    }
  };
  const insideSphere = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    const cx = r.left + F / 2;
    const cy = r.top + (FRAME / 2 - Y0) * D; // sphere centre in canvas space
    return Math.hypot(e.clientX - cx, e.clientY - cy) <= D / 2;
  };

  const onDown = (e: PointerEvent) => {
    if (e.pointerType === "touch" || e.button !== 0 || !insideSphere(e)) return;
    e.preventDefault();
    canvas.setPointerCapture(e.pointerId);
    dragging = { id: e.pointerId, x: e.clientX, y: e.clientY };
    canvas.style.cursor = "grabbing";
    cancelReset();
  };
  const onMove = (e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    if (!dragging) {
      canvas.style.cursor = insideSphere(e) ? "grab" : "";
      return;
    }
    if (e.pointerId !== dragging.id) return;
    const dx = e.clientX - dragging.x;
    const dy = e.clientY - dragging.y;
    dragging.x = e.clientX;
    dragging.y = e.clientY;
    // ~0.35° per px: deliberate, no flinging
    sphere.rotation.y += dx * 0.006;
    tiltGroup.rotation.x = Math.max(BASE_TILT - TILT_RANGE, Math.min(BASE_TILT + TILT_RANGE, tiltGroup.rotation.x + dy * 0.004));
    setRotated(true);
    requestRender();
  };
  const endDrag = (e: PointerEvent) => {
    if (!dragging || e.pointerId !== dragging.id) return;
    if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
    dragging = null;
    canvas.style.cursor = insideSphere(e) ? "grab" : "";
  };
  const onLeave = () => {
    if (!dragging) canvas.style.cursor = "";
  };
  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerup", endDrag);
  canvas.addEventListener("pointercancel", endDrag);
  canvas.addEventListener("lostpointercapture", endDrag);
  canvas.addEventListener("pointerleave", onLeave);

  // ── reset view (short ease, instant under reduced motion) ──
  let resetRaf = 0;
  const cancelReset = () => {
    cancelAnimationFrame(resetRaf);
    resetRaf = 0;
  };
  const reset = () => {
    cancelReset();
    // take the shortest way back around the spin axis
    const twoPi = Math.PI * 2;
    let fromSpin = sphere.rotation.y;
    const delta = ((((BASE_SPIN - fromSpin) % twoPi) + twoPi * 1.5) % twoPi) - Math.PI;
    const toSpin = fromSpin + delta;
    const fromTilt = tiltGroup.rotation.x;
    const finish = () => {
      sphere.rotation.y = BASE_SPIN;
      tiltGroup.rotation.x = BASE_TILT;
      setRotated(false);
      requestRender();
    };
    if (o.reducedMotion) return finish();
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / 600);
      const k = 1 - Math.pow(1 - t, 3);
      sphere.rotation.y = fromSpin + (toSpin - fromSpin) * k;
      tiltGroup.rotation.x = fromTilt + (BASE_TILT - fromTilt) * k;
      renderer.render(scene, camera);
      if (t < 1) resetRaf = requestAnimationFrame(step);
      else finish();
    };
    fromSpin = sphere.rotation.y;
    resetRaf = requestAnimationFrame(step);
  };

  // ── lifecycle: resize, context loss ───────────────────────
  const ro = new ResizeObserver(layout);
  ro.observe(host);
  const onLost = (e: Event) => {
    e.preventDefault();
    o.onFail("context-lost");
  };
  canvas.addEventListener("webglcontextlost", onLost);

  // dev only: lets tooling capture the static fallback from the live render
  if (process.env.NODE_ENV !== "production") {
    const w = window as unknown as Record<string, unknown>;
    w.__heroGlobeState = () => ({ spin: sphere.rotation.y, tilt: tiltGroup.rotation.x, renders });
    (window as unknown as { __heroGlobeSnapshot?: (w: number) => string }).__heroGlobeSnapshot = (w: number) => {
      const prevRatio = renderer.getPixelRatio();
      renderer.setPixelRatio(w / F);
      layout();
      renderer.render(scene, camera);
      const url = canvas.toDataURL("image/webp", 0.9);
      renderer.setPixelRatio(prevRatio);
      layout();
      return url;
    };
  }

  layout();

  return {
    reset,
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      cancelReset();
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", endDrag);
      canvas.removeEventListener("pointercancel", endDrag);
      canvas.removeEventListener("lostpointercapture", endDrag);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("webglcontextlost", onLost);
      if (dragging && canvas.hasPointerCapture(dragging.id)) canvas.releasePointerCapture(dragging.id);
      (material.uniforms.uLand.value as Texture | null)?.dispose();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      canvas.remove();
    },
  };
}

