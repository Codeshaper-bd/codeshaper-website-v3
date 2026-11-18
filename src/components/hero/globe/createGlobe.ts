import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  SphereGeometry,
  ShaderMaterial,
  Mesh,
  Group,
  TextureLoader,
  DataTexture,
  RGBAFormat,
  SRGBColorSpace,
  LinearFilter,
  NearestFilter,
  Color,
  Raycaster,
  Vector2,
  Vector3,
  type Texture,
} from "three";
import { COUNTRY_CODES } from "./countryIndex";

/**
 * Pearl globe renderer: plain three.js, loaded only via dynamic import.
 *
 * Adapted from Aceternity UI's "3D Globe" (sphere + lit surface + latitude/
 * longitude orientation), with local changes for this hero:
 *  · no @react-three/fiber / drei: an imperative renderer gives on-demand
 *    rendering, exact pointer control and complete disposal;
 *  · surface is a custom shader: pearl ocean, soft slate land (land mask),
 *    and "served" countries in a deeper slate-indigo, from a lossless
 *    country ID map (both from Natural Earth 1:50m, public domain);
 *  · hovering a served country deepens it and reports it for a tooltip
 *    (picked on the CPU from the same ID map, so GPU and tooltip agree);
 *  · an HQ pin position is projected every frame and handed to the DOM;
 *  · no auto-rotate, zoom, pan, inertia or damping; no arcs or avatars;
 *  · the coloured atmosphere is CSS behind the canvas (HeroGlobe.tsx).
 *
 * Frames render only when something changes (drag, hover, reset, resize).
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

// initial orientation: Europe → South Asia facing the viewer (HQ pin in view),
// tilted so the visible upper cap shows the northern hemisphere's land
export const BASE_SPIN = -2.74;
const BASE_TILT = 0.0;
const TILT_RANGE = 0.45;

export type HoverInfo = { name: string; detail?: string; x: number; y: number };
export type PinInfo = { x: number; y: number; visible: boolean };

export type GlobeHandle = {
  reset: () => void;
  dispose: () => void;
};

type Options = {
  host: HTMLElement; // the stage box (width F, height H)
  landUrl: string;
  idsUrl: string;
  served: { a3: string; name: string; count?: number }[];
  countLabel: { one: string; many: string; unknown: string };
  hq: { lat: number; lng: number };
  reducedMotion: boolean;
  onReady: () => void;
  onFail: (reason: string) => void;
  onRotatedChange: (rotated: boolean) => void;
  onHover: (info: HoverInfo | null) => void;
  onPin: (pin: PinInfo) => void;
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
  uniform sampler2D uIds;
  uniform sampler2D uServed;
  uniform float uHover;
  uniform vec3 uOcean;
  uniform vec3 uLandCol;
  uniform vec3 uServedCol;
  uniform vec3 uHoverCol;
  uniform vec3 uRim;
  varying vec2 vUv;
  varying vec3 vNormalV;
  void main() {
    vec3 n = normalize(vNormalV);
    float land = smoothstep(0.25, 0.75, texture2D(uLand, vUv).r);
    float id = floor(texture2D(uIds, vUv).r * 255.0 + 0.5);
    float served = texture2D(uServed, vec2((id + 0.5) / 256.0, 0.5)).r;
    // served is 0 (not served) or a 0.6–1.0 depth; deeper = more projects
    vec3 landCol = served > 0.0 ? mix(uLandCol, uServedCol, 0.35 + 0.9 * (served - 0.6)) : uLandCol;
    if (served > 0.5 && abs(id - uHover) < 0.5) landCol = uHoverCol;
    vec3 base = mix(uOcean, landCol, land);
    // soft key light from upper left, never harsh
    vec3 l = normalize(vec3(-0.45, 0.65, 0.62));
    float shade = 0.86 + 0.16 * max(dot(n, l), 0.0);
    // gentle limb darkening gives the silhouette shape against light backgrounds
    float facing = clamp(n.z, 0.0, 1.0);
    shade *= 0.9 + 0.1 * facing;
    vec3 col = base * shade;
    // pale rim so the edge reads as an atmosphere-lit surface (colour comes from CSS)
    col = mix(col, uRim, pow(1.0 - facing, 3.0) * 0.55);
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

/** Unit-sphere point for lat/lng, matching SphereGeometry's UV layout. */
function latLngToLocal(lat: number, lng: number) {
  const phi = ((lng + 180) / 360) * Math.PI * 2;
  const theta = ((90 - lat) / 180) * Math.PI;
  return new Vector3(-Math.cos(phi) * Math.sin(theta), Math.cos(theta), Math.sin(phi) * Math.sin(theta));
}

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

  // served-country lookup: texel i is white when country ID i is served
  const servedByA3 = new Map(o.served.map((s) => [s.a3, s]));
  // Value encodes tint depth: 0 = not served; known counts map (log scale)
  // to 0.6–1.0 so volume reads at a glance; unknown counts sit mid-way.
  const lookup = new Uint8Array(256 * 4);
  const maxLog = Math.log1p(Math.max(1, ...o.served.map((s) => s.count ?? 0)));
  COUNTRY_CODES.forEach((a3, i) => {
    const s = servedByA3.get(a3);
    if (!s || i + 1 >= 256) return;
    const depth = s.count ? 0.6 + 0.4 * (Math.log1p(s.count) / maxLog) : 0.72;
    lookup.fill(Math.round(depth * 255), (i + 1) * 4, (i + 1) * 4 + 4);
  });
  const servedTex = new DataTexture(lookup, 256, 1, RGBAFormat);
  servedTex.magFilter = NearestFilter;
  servedTex.minFilter = NearestFilter;
  servedTex.needsUpdate = true;

  const geometry = new SphereGeometry(1, 96, 64);
  const material = new ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms: {
      uLand: { value: null as Texture | null },
      uIds: { value: null as Texture | null },
      uServed: { value: servedTex },
      uHover: { value: -1 },
      uOcean: { value: new Color("#f4f6fa") },
      uLandCol: { value: new Color("#d6dbe5") },
      uServedCol: { value: new Color("#7d84b8") },
      uHoverCol: { value: new Color("#6f6bd8") },
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

  // ── drawing (every frame goes through here) ───────────────
  const hqLocal = latLngToLocal(o.hq.lat, o.hq.lng);
  const tmp = new Vector3();
  const toCam = new Vector3();
  let renders = 0; // dev diagnostics only
  const draw = () => {
    if (disposed) return;
    renderer.render(scene, camera);
    renders++;
    // project the HQ pin; hidden when it turns to the far side
    tmp.copy(hqLocal).applyMatrix4(sphere.matrixWorld);
    toCam.copy(camera.position).sub(tmp);
    const visible = tmp.dot(toCam) > 0.02;
    tmp.project(camera);
    o.onPin({ x: ((tmp.x + 1) / 2) * F, y: ((1 - tmp.y) / 2) * H, visible });
  };
  let raf = 0;
  const requestRender = () => {
    if (raf || disposed) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      draw();
    });
  };

  // ── textures: land mask (sRGB, smooth) + country IDs (raw, nearest) ──
  let idPixels: Uint8Array | null = null;
  let idW = 0;
  let idH = 0;
  const loader = new TextureLoader();
  Promise.all([loader.loadAsync(o.landUrl), loader.loadAsync(o.idsUrl)])
    .then(([land, ids]) => {
      if (disposed) {
        land.dispose();
        ids.dispose();
        return;
      }
      land.colorSpace = SRGBColorSpace;
      land.minFilter = LinearFilter;
      land.generateMipmaps = false;
      land.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
      ids.magFilter = NearestFilter;
      ids.minFilter = NearestFilter;
      ids.generateMipmaps = false;
      material.uniforms.uLand.value = land;
      material.uniforms.uIds.value = ids;

      // CPU copy of the ID map's red channel for hover picking
      const img = ids.image as HTMLImageElement;
      idW = img.width;
      idH = img.height;
      const c = document.createElement("canvas");
      c.width = idW;
      c.height = idH;
      const g = c.getContext("2d", { willReadFrequently: true });
      if (g) {
        g.drawImage(img, 0, 0);
        const rgba = g.getImageData(0, 0, idW, idH).data;
        idPixels = new Uint8Array(idW * idH);
        for (let i = 0; i < idPixels.length; i++) idPixels[i] = rgba[i * 4];
      }

      layout();
      requestAnimationFrame(() => {
        if (disposed) return;
        draw();
        canvas.style.opacity = "1";
        o.onReady();
      });
    })
    .catch(() => o.onFail("texture-failed"));

  // ── hover: which served country is under the pointer? ─────
  const raycaster = new Raycaster();
  const ndc = new Vector2();
  let hoverId = -1;
  const setHover = (id: number) => {
    if (id === hoverId) return;
    hoverId = id;
    material.uniforms.uHover.value = id;
    requestRender();
  };
  const pick = (e: PointerEvent) => {
    if (!idPixels) return null;
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1));
    raycaster.setFromCamera(ndc, camera);
    const hit = raycaster.intersectObject(sphere, false)[0];
    if (!hit?.uv) return null;
    const px = Math.min(idW - 1, Math.floor(hit.uv.x * idW));
    const py = Math.min(idH - 1, Math.floor((1 - hit.uv.y) * idH));
    const id = idPixels[py * idW + px];
    if (!id) return null;
    const entry = servedByA3.get(COUNTRY_CODES[id - 1]);
    return entry ? { id, entry, x: e.clientX - r.left, y: e.clientY - r.top } : null;
  };
  const clearHover = () => {
    setHover(-1);
    o.onHover(null);
  };

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
    clearHover();
    cancelReset();
  };
  const onMove = (e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    if (!dragging) {
      const inside = insideSphere(e);
      canvas.style.cursor = inside ? "grab" : "";
      const hit = inside ? pick(e) : null;
      if (hit) {
        setHover(hit.id);
        o.onHover({
          name: hit.entry.name,
          detail: hit.entry.count
            ? `${hit.entry.count} ${hit.entry.count === 1 ? o.countLabel.one : o.countLabel.many}`
            : o.countLabel.unknown,
          x: hit.x,
          y: hit.y,
        });
      } else clearHover();
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
    if (!dragging) {
      canvas.style.cursor = "";
      clearHover();
    }
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
    clearHover();
    const twoPi = Math.PI * 2;
    const fromSpin = sphere.rotation.y;
    // take the shortest way back around the spin axis
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
      draw();
      if (t < 1) resetRaf = requestAnimationFrame(step);
      else finish();
    };
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

  // dev only: diagnostics + capture of the static fallback from the live render
  if (process.env.NODE_ENV !== "production") {
    const w = window as unknown as Record<string, unknown>;
    w.__heroGlobeState = () => ({ spin: sphere.rotation.y, tilt: tiltGroup.rotation.x, renders, hoverId });
    w.__heroGlobeSnapshot = (px: number) => {
      const prev = renderer.getPixelRatio();
      renderer.setPixelRatio(px / F);
      layout();
      renderer.render(scene, camera);
      const url = canvas.toDataURL("image/webp", 0.9);
      renderer.setPixelRatio(prev);
      layout();
      return url;
    };
    w.__heroGlobePin = () => {
      tmp.copy(hqLocal).applyMatrix4(sphere.matrixWorld).project(camera);
      return { fx: (tmp.x + 1) / 2, fy: (1 - tmp.y) / 2 };
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
      (material.uniforms.uIds.value as Texture | null)?.dispose();
      servedTex.dispose();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      idPixels = null;
      canvas.remove();
    },
  };
}
