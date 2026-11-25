"use client";

import { useEffect, useRef } from "react";

/**
 * The footer's living background: a soft mesh gradient in the brand pastels
 * (lavender, indigo, peach, sky) that drifts slowly, bends toward the
 * pointer and ripples out from a click or tap. One small WebGL fragment
 * shader, no library.
 *
 *  · Renders at half resolution (the gradient is soft, nobody can tell) and
 *    only while the footer is on screen and the tab is visible.
 *  · Reduced motion: one still frame, no pointer play.
 *  · No WebGL: the same colours as layered CSS gradients.
 *
 * The pointer is read from `target` (the whole footer), so it plays under the
 * links too; the canvas itself never takes the pointer.
 */
const COLORS = ["#f6f4f1", "#cfc8ff", "#ffcfb2", "#c3e1ff", "#ae9fff"];
/** night scene (owner, 25 Nov 2026): deep indigo, violet and a little plum, same motion */
const NIGHT = ["#14122e", "#2a2468", "#35264f", "#1b2a5c", "#3b3392"];

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;
const FRAG = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uHover;
uniform vec3 uRipple;
uniform vec3 uC0;uniform vec3 uC1;uniform vec3 uC2;uniform vec3 uC3;uniform vec3 uC4;
uniform float uLift;

float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){
  vec2 i=floor(p);vec2 f=fract(p);
  vec2 u=f*f*f*(f*(f*6.-15.)+10.);
  float a=hash(i),b=hash(i+vec2(1.,0.)),c=hash(i+vec2(0.,1.)),d=hash(i+vec2(1.,1.));
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
}

void main(){
  vec2 uv=gl_FragCoord.xy/uRes;
  float asp=uRes.x/uRes.y;
  vec2 p=vec2(uv.x*asp,uv.y);
  vec2 m=vec2(uMouse.x*asp,uMouse.y);

  // the pointer gently pulls the colours toward it
  vec2 d=p-m;
  float pull=exp(-dot(d,d)*3.5)*uHover;
  p-=d*pull*0.45;

  // a click sends one soft ring outward
  float rt=uTime-uRipple.z;
  if(rt>0.&&rt<3.){
    vec2 rd=p-vec2(uRipple.x*asp,uRipple.y);
    float r=length(rd);
    float w=sin(r*22.-rt*7.)*exp(-r*2.5)*exp(-rt*1.4);
    p+=rd/(r+1e-4)*w*0.045;
  }

  float t=uTime*0.045;
  vec2 q=vec2(noise(p*1.1+vec2(0.,t)),noise(p*1.1+vec2(5.2,1.3)-t));
  vec2 r=vec2(noise(p*1.3+2.2*q+vec2(1.7,9.2)+t*1.2),noise(p*1.3+2.2*q+vec2(8.3,2.8)-t));
  float f=noise(p*0.9+2.0*r);

  vec3 col=uC0;
  col=mix(col,uC1,smoothstep(0.25,0.85,q.x));
  col=mix(col,uC2,smoothstep(0.35,0.95,r.y)*0.9);
  col=mix(col,uC3,smoothstep(0.4,0.95,f)*0.85);
  col=mix(col,uC4,smoothstep(0.6,1.0,r.x*q.y*1.8)*0.7);
  col=mix(col,vec3(1.),uLift);
  // a whisper of grain so the gradient never bands
  col+=(hash(gl_FragCoord.xy+fract(uTime))-0.5)*0.018;
  gl_FragColor=vec4(col,1.);
}`;

const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255) as [number, number, number];

const fallback = (C: string[]) =>
  `radial-gradient(50% 60% at 15% 35%, ${C[1]}, transparent 70%), radial-gradient(45% 55% at 85% 30%, ${C[3]}, transparent 70%), radial-gradient(55% 60% at 60% 95%, ${C[2]}, transparent 70%), radial-gradient(40% 50% at 40% 70%, ${C[4]}88, transparent 70%), ${C[0]}`;

export default function MeshGradient({ target, className = "", night = false }: { target: React.RefObject<HTMLElement | null>; className?: string; night?: boolean }) {
  const palette = night ? NIGHT : COLORS;
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = target.current;
    const wrap = box.current;
    if (!host || !wrap) return;
    // a new canvas each run: a context that was released can't be used again
    const cv = document.createElement("canvas");
    cv.className = "absolute inset-0 h-full w-full";
    const gl = cv.getContext("webgl", { antialias: false, premultipliedAlpha: false, preserveDrawingBuffer: false });
    if (!gl) return; // the CSS gradient underneath stays

    const shader = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    };
    const vs = shader(gl.VERTEX_SHADER, VERT);
    const fs = shader(gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram()!;
    if (!vs || !fs) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    wrap.appendChild(cv);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = (n: string) => gl.getUniformLocation(prog, n);
    const uRes = u("uRes"), uTime = u("uTime"), uMouse = u("uMouse"), uHover = u("uHover"), uRipple = u("uRipple");
    palette.forEach((c, i) => gl.uniform3fv(u(`uC${i}`), rgb(c)));
    gl.uniform1f(u("uLift"), night ? 0 : 0.12);

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const SCALE = 0.5;
    const resize = () => {
      const w = Math.max(1, Math.round(cv.clientWidth * SCALE));
      const h = Math.max(1, Math.round(cv.clientHeight * SCALE));
      if (cv.width !== w || cv.height !== h) {
        cv.width = w;
        cv.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(uRes, w, h);
    };

    // pointer: eased toward the target, hover strength fades in and out
    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, h: 0, th: 0 };
    const start = performance.now();
    const now = () => (performance.now() - start) / 1000 + 40; // start mid-drift, not at the noise origin
    const ripple = [0.5, 0.5, -10];

    const toUv = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      return [(e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height];
    };
    const onMove = (e: PointerEvent) => {
      const [x, y] = toUv(e);
      mouse.tx = x;
      mouse.ty = y;
      mouse.th = 1;
      kick();
    };
    const onLeave = () => {
      mouse.th = 0;
      kick();
    };
    const onDown = (e: PointerEvent) => {
      const [x, y] = toUv(e);
      ripple[0] = x;
      ripple[1] = y;
      ripple[2] = now();
      kick();
    };

    let raf = 0;
    let visible = false;
    const frame = () => {
      raf = 0;
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;
      mouse.h += (mouse.th - mouse.h) * 0.04;
      gl.uniform1f(uTime, now());
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uHover, mouse.h);
      gl.uniform3f(uRipple, ripple[0], ripple[1], ripple[2]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduced && visible && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (!raf && visible) raf = requestAnimationFrame(frame);
    };

    resize();
    frame(); // first paint, also the still frame under reduced motion
    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) frame();
      else kick();
    });
    ro.observe(cv);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) kick();
    });
    io.observe(cv);
    const onVis = () => !document.hidden && kick();
    document.addEventListener("visibilitychange", onVis);
    if (!reduced) {
      host.addEventListener("pointermove", onMove, { passive: true });
      host.addEventListener("pointerleave", onLeave);
      host.addEventListener("pointerdown", onDown, { passive: true });
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointerdown", onDown);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      cv.remove();
    };
  }, [target, night, palette]);

  return (
    <div ref={box} aria-hidden className={`pointer-events-none absolute inset-0 ${className}`} style={{ background: fallback(palette) }} />
  );
}
