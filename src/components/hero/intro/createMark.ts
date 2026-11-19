/**
 * Codeshaper mark in 3D: nine pieces cut from the brand mark (Fav Icon.svg,
 * owner-supplied) that start scattered and lock together as the visitor
 * scrolls the hero. Plain three.js, loaded only via dynamic import.
 *
 * Pieces (SVG units, 64 x 64 box):
 *  - the hexagon ring, split into its six sides (seams on the corner
 *    bisectors, so the joins read like the blocks of a build);
 *  - the chevron's two strokes and the cursor bar (round-capped capsules).
 *
 * The caller drives `setProgress(0..1)` (GSAP ScrollTrigger scrub). At 1 the
 * mark is whole and the cursor blinks. Hover lifts a piece toward the camera
 * and reports a label for a small HTML tag. The pointer tilts the mark a
 * little. Frames render only while the canvas is on screen and the page is
 * visible; `dispose()` releases everything.
 */
import {
  NoToneMapping,
  AmbientLight,
  CanvasTexture,
  Color,
  DirectionalLight,
  ExtrudeGeometry,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Path,
  Plane,
  MeshBasicMaterial,
  AdditiveBlending,
  PMREMGenerator,
  Raycaster,
  Scene,
  Shape,
  SRGBColorSpace,
  Vector2,
  Vector3,
  WebGLRenderer,
  type BufferGeometry,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export interface MarkHandle {
  setProgress: (p: number) => void;
  dispose: () => void;
}

export interface MarkOptions {
  host: HTMLElement;
  /** Brand violet of the mark. */
  color: string;
  onReady: () => void;
  onFail: () => void;
  /** Hovered piece: label and its position in host pixels, or null. */
  onHover: (info: { label: string; x: number; y: number } | null) => void;
  /** Pixel height of the assembled mark for a host of w x h (default 86% of h). */
  markHeight?: (w: number, h: number) => number;
}

/* ------------------------------------------------------------- Geometry */
const CX = 32.09;
const CY = 32;
const toLocal = (x: number, y: number) => new Vector2(x - CX, CY - y);

// Hexagon (the path's inner edge) and the ring's thickness outward (stroke 12
// masked to the outside half in the SVG).
const HEX = [
  [32.09, 8.4],
  [53.82, 20.2],
  [53.82, 43.8],
  [32.09, 55.6],
  [10.36, 43.8],
  [10.36, 20.2],
].map(([x, y]) => toLocal(x!, y!));
const RING = 6;
const GAP = 0.45; // seam width between pieces
const DEPTH = 5;

/** Outward offset polygon: offset each edge, intersect neighbours. */
function offsetPolygon(points: Vector2[], d: number) {
  const n = points.length;
  const lines = points.map((p, i) => {
    const q = points[(i + 1) % n]!;
    const dir = q.clone().sub(p).normalize();
    const normal = new Vector2(-dir.y, dir.x); // outward: the hexagon runs clockwise (y up)
    return { p: p.clone().addScaledVector(normal, d), dir };
  });
  return lines.map((line, i) => {
    const prev = lines[(i - 1 + n) % n]!;
    // Intersect prev line and this line.
    const denom = prev.dir.x * line.dir.y - prev.dir.y * line.dir.x;
    const t = ((line.p.x - prev.p.x) * line.dir.y - (line.p.y - prev.p.y) * line.dir.x) / denom;
    return prev.p.clone().addScaledVector(prev.dir, t);
  });
}

/** Shrink a polygon toward its centroid by `g` (for visible seams). */
function inset(points: Vector2[], g: number) {
  const c = points.reduce((a, p) => a.add(p), new Vector2()).multiplyScalar(1 / points.length);
  return points.map((p) => p.clone().add(c.clone().sub(p).setLength(g)));
}

function capsule(ax: number, ay: number, bx: number, by: number, w: number) {
  const a = toLocal(ax, ay);
  const b = toLocal(bx, by);
  const r = w / 2;
  const len = a.distanceTo(b);
  const angle = Math.atan2(b.y - a.y, b.x - a.x);
  const s = new Shape();
  s.moveTo(0, -r);
  s.lineTo(len, -r);
  s.absarc(len, 0, r, -Math.PI / 2, Math.PI / 2, false);
  s.lineTo(0, r);
  s.absarc(0, 0, r, Math.PI / 2, (3 * Math.PI) / 2, false);
  return { shape: s, angle, origin: a };
}

const extrude = (shape: Shape) =>
  new ExtrudeGeometry(shape, {
    depth: DEPTH,
    bevelEnabled: true,
    bevelThickness: 0.7,
    bevelSize: 0.55,
    bevelSegments: 3,
    curveSegments: 18,
  });

/** Soft round glow texture (drawn once on a canvas). */
function glowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, 'rgba(255,255,255,0.9)');
  grad.addColorStop(0.35, 'rgba(160,150,255,0.45)');
  grad.addColorStop(1, 'rgba(160,150,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

const SIDE_LABELS = ['AI', 'Build', 'Test', 'Release', 'Plan', 'Human'];

interface Piece {
  mesh: Mesh;
  home: Vector3;
  from: Vector3;
  rot: Vector3;
  delay: number;
  lift: number;
  label: string;
  phase: number;
  /** Throw state: offset, velocity, extra rotation and spin (mark-local). */
  off: Vector3;
  vel: Vector3;
  angle: Vector3;
  spin: Vector3;
  /** Collision: geometry centre (home) and radius, and the current centre. */
  centre: Vector3;
  radius: number;
  now: Vector3;
}

export function createMark(o: MarkOptions): MarkHandle {
  const { host } = o;
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  } catch {
    o.onFail();
    return { setProgress() {}, dispose() {} };
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setClearColor(0x000000, 0);
  // No tone mapping: keep the brand violet true instead of filmic-washed.
  renderer.toneMapping = NoToneMapping;
  renderer.outputColorSpace = SRGBColorSpace;
  const canvas = renderer.domElement;
  canvas.className = 'absolute inset-0 size-full';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.touchAction = 'pan-y';
  host.appendChild(canvas);

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = env;
  scene.environmentIntensity = 0.45;
  scene.add(new AmbientLight(0xffffff, 0.35));
  const key = new DirectionalLight(0xffffff, 1.25);
  key.position.set(-40, 60, 90);
  scene.add(key);

  const camera = new PerspectiveCamera(30, 1, 1, 1000);
  camera.position.set(0, 0, 170);

  const mark = new Group();
  scene.add(mark);

  const material = new MeshPhysicalMaterial({
    color: new Color(o.color),
    roughness: 0.42,
    metalness: 0.02,
    clearcoat: 0.5,
    clearcoatRoughness: 0.28,
    sheen: 1,
    sheenRoughness: 0.45,
    sheenColor: new Color('#c9c4ff'),
  });

  /* Build the nine pieces. */
  const geometries: BufferGeometry[] = [];
  const pieces: Piece[] = [];
  const outer = offsetPolygon(HEX, RING);
  // Pseudo-random but stable scatter.
  let seed = 9;
  const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

  const addPiece = (geometry: BufferGeometry, label: string, centre: Vector2, index: number) => {
    geometry.translate(0, 0, -DEPTH / 2);
    geometries.push(geometry);
    const mesh = new Mesh(geometry, material.clone());
    const dir =
      centre.lengthSq() > 0.01 ? centre.clone().normalize() : new Vector2(0.3, -1).normalize();
    const reach = 40 + rand() * 34;
    const piece: Piece = {
      mesh,
      home: new Vector3(0, 0, 0),
      from: new Vector3(
        dir.x * reach * 1.5 + (rand() - 0.5) * 18,
        dir.y * reach * 0.7 + (rand() - 0.5) * 14,
        -18 + rand() * 46,
      ),
      rot: new Vector3((rand() - 0.5) * 2.6, (rand() - 0.5) * 2.6, (rand() - 0.5) * 2.2),
      delay: index * 0.045,
      lift: 0,
      label,
      phase: rand() * Math.PI * 2,
      off: new Vector3(),
      vel: new Vector3(),
      angle: new Vector3(),
      spin: new Vector3(),
      centre: new Vector3(),
      radius: 1,
      now: new Vector3(),
    };
    geometry.computeBoundingSphere();
    piece.centre.copy(geometry.boundingSphere!.center);
    // A snug circle: long pieces are thin, so most of the sphere is air.
    piece.radius = geometry.boundingSphere!.radius * 0.62;
    mesh.userData.piece = piece;
    mark.add(mesh);
    pieces.push(piece);
  };

  HEX.forEach((p, i) => {
    const q = HEX[(i + 1) % HEX.length]!;
    const quad = inset([p, q, outer[(i + 1) % HEX.length]!, outer[i]!], GAP);
    const shape = new Shape(quad);
    const centre = quad.reduce((a, v) => a.add(v), new Vector2()).multiplyScalar(0.25);
    addPiece(extrude(shape), SIDE_LABELS[i]!, centre, i);
  });

  const strokes: [number, number, number, number, string][] = [
    [20.72, 24.51, 28.04, 31.06, 'Code'],
    [28.04, 31.06, 20.72, 37.6, 'Code'],
    [32.77, 39.83, 43.38, 39.83, 'Ship'],
  ];
  strokes.forEach(([ax, ay, bx, by, label], i) => {
    const { shape, angle, origin } = capsule(ax, ay, bx, by, 5.4);
    const geometry = extrude(shape);
    geometry.rotateZ(angle);
    geometry.translate(origin.x, origin.y, 0);
    const mid = toLocal((ax + bx) / 2, (ay + by) / 2);
    addPiece(geometry, label, mid, 6 + i);
  });

  /* The finished mark: one seamless piece with rounded corners and a polished,
     reflective finish. It replaces the nine pieces once they have locked
     together, so the seams disappear. */
  const rounded = (target: Shape | Path, pts: Vector2[], radius: number) => {
    const n = pts.length;
    pts.forEach((p, i) => {
      const prev = pts[(i - 1 + n) % n]!;
      const next = pts[(i + 1) % n]!;
      const a = p.clone().add(prev.clone().sub(p).setLength(radius));
      const b = p.clone().add(next.clone().sub(p).setLength(radius));
      if (i === 0) target.moveTo(a.x, a.y);
      else target.lineTo(a.x, a.y);
      target.quadraticCurveTo(p.x, p.y, b.x, b.y);
    });
    target.closePath();
  };
  const polished = new MeshPhysicalMaterial({
    color: new Color(o.color),
    roughness: 0.16,
    metalness: 0.12,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    envMapIntensity: 1.7,
    sheen: 0.6,
    sheenRoughness: 0.35,
    sheenColor: new Color('#d9d6ff'),
  });
  const smooth = (shape: Shape) =>
    new ExtrudeGeometry(shape, {
      depth: DEPTH,
      bevelEnabled: true,
      bevelThickness: 1.3,
      bevelSize: 1,
      bevelSegments: 8,
      curveSegments: 24,
    });
  const whole = new Group();
  whole.visible = false;
  {
    const ringShape = new Shape();
    rounded(ringShape, offsetPolygon(HEX, RING - 0.2), 4.2);
    const hole = new Path();
    rounded(hole, inset(HEX, -0.2), 2.4);
    ringShape.holes.push(hole);
    const parts = [smooth(ringShape)];
    for (const [ax, ay, bx, by] of strokes) {
      const { shape, angle, origin } = capsule(ax, ay, bx, by, 5.4);
      const g = smooth(shape);
      g.rotateZ(angle);
      g.translate(origin.x, origin.y, 0);
      parts.push(g);
    }
    parts.forEach((g, i) => {
      g.translate(0, 0, -DEPTH / 2);
      geometries.push(g);
      whole.add(new Mesh(g, i === parts.length - 1 ? polished.clone() : polished));
    });
  }
  const wholeCursor = whole.children[whole.children.length - 1] as Mesh;
  mark.add(whole);

  // Soft glow behind the mark, growing as it assembles.
  const glowTex = glowTexture();
  const glow = new Mesh(
    new PlaneGeometry(130, 130),
    new MeshBasicMaterial({
      map: glowTex,
      transparent: true,
      opacity: 0,
      blending: AdditiveBlending,
      depthWrite: false,
    }),
  );
  glow.position.z = -12;
  scene.add(glow);

  /* --------------------------------------------------------- State + frame */
  // Pieces start pearl white and turn brand violet as they lock in.
  const pearl = new Color('#f1effb');
  const brand = new Color(o.color);
  let progress = 0;
  let shown = 0; // eased progress
  const pointer = new Vector2(0, 0);
  const tilt = new Vector2(0, 0);
  const raycaster = new Raycaster();
  let hovered: Piece | null = null;
  let disposed = false;
  let visible = true;
  let raf = 0;
  const start = performance.now();
  let last = start;
  let dragged: Piece | null = null;
  const dragPlane = new Plane(new Vector3(0, 0, 1), 0);
  const dragPoint = new Vector3();
  const dragPrev = new Vector3();
  let dragTime = 0;

  const ease = (t: number) => 1 - Math.pow(1 - t, 3);
  const clamp = (v: number) => Math.min(1, Math.max(0, v));
  const assembled = () => shown > 0.975;

  const resize = () => {
    const w = host.clientWidth;
    const h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Distance at which the 72-unit mark is exactly markHeight pixels tall.
    const target = o.markHeight?.(w, h) ?? h * 0.86;
    camera.position.z = (72 * h) / (2 * Math.tan((camera.fov * Math.PI) / 360) * target);
    camera.updateProjectionMatrix();
  };

  const frame = (now: number) => {
    raf = 0;
    if (disposed) return;
    const t = (now - start) / 1000;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    shown += (progress - shown) * 0.12;
    const isWhole = assembled();
    whole.visible = isWhole;
    tilt.lerp(pointer, 0.06);
    mark.rotation.y = tilt.x * 0.32 + (1 - shown) * Math.sin(t * 0.25) * 0.15;
    mark.rotation.x = -tilt.y * 0.22;

    for (const piece of pieces) {
      const local = ease(clamp((shown - piece.delay) / (1 - 0.45)));
      const idle = 1 - local;
      const bob = Math.sin(t * 0.9 + piece.phase) * 1.6 * idle;
      // Thrown pieces float back to their place on a slow, soft spring.
      if (dragged !== piece) {
        piece.vel.addScaledVector(piece.off, -1.6 * dt);
        piece.vel.multiplyScalar(Math.exp(-1.5 * dt));
        piece.off.addScaledVector(piece.vel, dt);
      }
      piece.angle.addScaledVector(piece.spin, dt);
      piece.spin.multiplyScalar(Math.exp(-0.9 * dt));
      piece.angle.multiplyScalar(Math.exp(-0.5 * dt));
      piece.mesh.visible = !isWhole;
      piece.lift += ((hovered === piece ? 1 : 0) - piece.lift) * 0.15;
      // Bigger while scattered, true size once assembled.
      piece.mesh.scale.setScalar(1 + idle * 0.6);
      piece.mesh.position.set(
        (piece.from.x + piece.off.x) * idle,
        (piece.from.y + piece.off.y) * idle + bob,
        (piece.from.z + piece.off.z) * idle + piece.lift * 4,
      );
      piece.mesh.rotation.set(
        (piece.rot.x + piece.angle.x) * idle + Math.sin(t * 0.5 + piece.phase) * 0.12 * idle,
        (piece.rot.y + piece.angle.y) * idle,
        (piece.rot.z + piece.angle.z) * idle,
      );
      const m = piece.mesh.material as MeshPhysicalMaterial;
      m.color.copy(pearl).lerp(brand, local);
      m.emissive.set(0xffffff);
      m.emissiveIntensity = piece.lift * 0.12;
    }
    // Pieces bump into each other while they are scattered: overlapping
    // pairs are pushed apart and trade momentum (a little bounce), then the
    // springs float them home. Screen-plane (x, y) only, so what overlaps on
    // screen is what collides.
    if (shown < 0.3) {
      for (const piece of pieces) {
        piece.mesh.updateMatrix();
        piece.now.copy(piece.centre).applyMatrix4(piece.mesh.matrix);
      }
      const scale = 1 + (1 - shown) * 0.6;
      for (let i = 0; i < pieces.length; i++) {
        for (let j = i + 1; j < pieces.length; j++) {
          const a = pieces[i]!;
          const b = pieces[j]!;
          const dx = a.now.x - b.now.x;
          const dy = a.now.y - b.now.y;
          const dist = Math.hypot(dx, dy) || 0.001;
          const min = (a.radius + b.radius) * scale;
          if (dist >= min) continue;
          const nx = dx / dist;
          const ny = dy / dist;
          // A dragged piece is held: it pushes, it is not pushed.
          const wa = dragged === a ? 0 : dragged === b ? 1 : 0.5;
          const wb = 1 - wa;
          const overlap = min - dist;
          a.off.x += nx * overlap * wa;
          a.off.y += ny * overlap * wa;
          b.off.x -= nx * overlap * wb;
          b.off.y -= ny * overlap * wb;
          const closing = (a.vel.x - b.vel.x) * nx + (a.vel.y - b.vel.y) * ny;
          if (closing < 0) {
            const impulse = -1.6 * closing; // restitution 0.6
            a.vel.x += nx * impulse * wa;
            a.vel.y += ny * impulse * wa;
            b.vel.x -= nx * impulse * wb;
            b.vel.y -= ny * impulse * wb;
            // A knock sets the struck piece tumbling.
            const knock = Math.min(6, impulse * 0.03);
            a.spin.z += (Math.random() - 0.5) * knock * wa * 2;
            b.spin.z += (Math.random() - 0.5) * knock * wb * 2;
            b.spin.x += ny * knock * wb;
            a.spin.x -= ny * knock * wa;
          }
        }
      }
    }

    // Cursor blinks once the mark is whole.
    const cm = wholeCursor.material as MeshPhysicalMaterial;
    cm.emissive.set(0xffffff);
    cm.emissiveIntensity = isWhole && Math.sin(t * 5) > 0 ? 0.35 : 0;
    (glow.material as MeshBasicMaterial).opacity = 0.15 + shown * 0.55;

    renderer.render(scene, camera);

    // Hover label follows the lifted piece.
    if (hovered) {
      const p = new Vector3();
      hovered.mesh.geometry.computeBoundingSphere();
      p.copy(hovered.mesh.geometry.boundingSphere!.center)
        .applyMatrix4(hovered.mesh.matrixWorld)
        .project(camera);
      o.onHover({
        label: hovered.label,
        x: ((p.x + 1) / 2) * host.clientWidth,
        y: ((1 - p.y) / 2) * host.clientHeight,
      });
    }
    if (visible && document.visibilityState === 'visible') raf = requestAnimationFrame(frame);
  };
  const kick = () => {
    if (!raf && !disposed) raf = requestAnimationFrame(frame);
  };

  /* -------------------------------------------------------------- Pointer */
  const ndc = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    return new Vector2(
      ((e.clientX - r.left) / r.width) * 2 - 1,
      -(((e.clientY - r.top) / r.height) * 2 - 1),
    );
  };
  /** Pointer position on the drag plane, in mark-local coordinates. */
  const pointOnPlane = (e: PointerEvent) => {
    raycaster.setFromCamera(ndc(e), camera);
    if (!raycaster.ray.intersectPlane(dragPlane, dragPoint)) return null;
    return mark.worldToLocal(dragPoint.clone());
  };
  const meshes = () => pieces.map((piece) => piece.mesh);
  const onDown = (e: PointerEvent) => {
    if (e.pointerType === 'touch' || e.button !== 0 || shown > 0.5) return;
    raycaster.setFromCamera(ndc(e), camera);
    const hit = raycaster.intersectObjects(meshes(), false)[0];
    const piece = (hit?.object.userData.piece as Piece | undefined) ?? null;
    if (!piece || !hit) return;
    e.preventDefault();
    dragged = piece;
    dragPlane.set(new Vector3(0, 0, 1), -hit.point.z);
    dragPrev.copy(pointOnPlane(e) ?? new Vector3());
    dragTime = performance.now();
    piece.vel.set(0, 0, 0);
    canvas.setPointerCapture(e.pointerId);
    canvas.style.cursor = 'grabbing';
    kick();
  };
  const onDrag = (e: PointerEvent) => {
    if (!dragged) return;
    const p = pointOnPlane(e);
    if (!p) return;
    const now = performance.now();
    const step = p.clone().sub(dragPrev);
    const idle = 1 - ease(clamp((shown - dragged.delay) / (1 - 0.45)));
    dragged.off.addScaledVector(step, 1 / Math.max(0.2, idle));
    // The velocity of the last movement becomes the throw.
    const dt = Math.max(0.008, (now - dragTime) / 1000);
    dragged.vel
      .copy(step)
      .multiplyScalar(1 / dt)
      .clampLength(0, 260);
    dragPrev.copy(p);
    dragTime = now;
  };
  const onUp = (e: PointerEvent) => {
    if (!dragged) return;
    if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
    // The faster the throw, the faster it tumbles.
    const speed = dragged.vel.length();
    dragged.spin.set(
      dragged.vel.y * 0.02 + (Math.random() - 0.5) * speed * 0.01,
      -dragged.vel.x * 0.02,
      (Math.random() - 0.5) * speed * 0.02,
    );
    dragged = null;
    canvas.style.cursor = 'grab';
  };
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onDrag);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onUp);

  const onMove = (e: PointerEvent) => {
    const { x, y } = ndc(e);
    pointer.set(x, y);
    if (e.pointerType === 'touch' || dragged) return;
    raycaster.setFromCamera(new Vector2(x, y), camera);
    const hit = assembled() ? undefined : raycaster.intersectObjects(meshes(), false)[0];
    const next = (hit?.object.userData.piece as Piece | undefined) ?? null;
    if (next !== hovered) {
      hovered = next;
      canvas.style.cursor = next ? (shown > 0.5 ? 'pointer' : 'grab') : '';
      if (!next) o.onHover(null);
    }
    kick();
  };
  const onLeave = () => {
    pointer.set(0, 0);
    hovered = null;
    canvas.style.cursor = '';
    o.onHover(null);
  };
  window.addEventListener('pointermove', onMove, { passive: true });
  canvas.addEventListener('pointerleave', onLeave);

  /* ------------------------------------------------------------ Lifecycle */
  const ro = new ResizeObserver(() => {
    resize();
    kick();
  });
  ro.observe(host);
  const io = new IntersectionObserver(([entry]) => {
    visible = !!entry?.isIntersecting;
    if (visible) kick();
  });
  io.observe(host);
  const onVisibility = () => kick();
  document.addEventListener('visibilitychange', onVisibility);
  const onLost = (e: Event) => {
    e.preventDefault();
    o.onFail();
  };
  canvas.addEventListener('webglcontextlost', onLost);

  resize();
  requestAnimationFrame(() => {
    if (disposed) return;
    kick();
    o.onReady();
  });

  return {
    setProgress(p) {
      progress = clamp(p);
      kick();
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onDrag);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
      polished.dispose();
      (wholeCursor.material as MeshPhysicalMaterial).dispose();
      canvas.removeEventListener('webglcontextlost', onLost);
      document.removeEventListener('visibilitychange', onVisibility);
      for (const piece of pieces) (piece.mesh.material as MeshPhysicalMaterial).dispose();
      for (const g of geometries) g.dispose();
      material.dispose();
      glow.geometry.dispose();
      (glow.material as MeshBasicMaterial).dispose();
      glowTex.dispose();
      env.dispose();
      pmrem.dispose();
      renderer.dispose();
      canvas.remove();
    },
  };
}
