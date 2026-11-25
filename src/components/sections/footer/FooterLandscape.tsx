"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bug as BugIcon, Play, RotateCcw, Trophy, X } from "lucide-react";

/**
 * The footer's last strip (owner, 24 Nov 2026: "hills, a village, and a
 * Dino-style game in it"): a quiet pastel landscape across the full width,
 * far mountains, hills, a village, drifting clouds, and a little builder who
 * is putting up a CodeShaper house. It walks over and hammers it on its own.
 * "Play" turns the strip into a runner: the layers scroll at their own speeds
 * (parallax), software bugs crawl in, Space / ↑ / a tap jumps. Best score
 * stays in this browser.
 *
 * One requestAnimationFrame loop, transforms only, paused while the strip is
 * off screen. Reduced motion: no idle walking or cloud drift; the game still
 * runs if the visitor starts it.
 */
const H = 260; // scenery height
/** the strip ends right at the path line (owner, 25 Nov 2026: no empty ground under it) */
const SHOWN = 178;
const GROUND = 176; // the path's top, px from the strip top
const TILE = 1200; // scenery tile width
const BOT_W = 34;
const BOT_H = 40;
const GRAVITY = 2600;
const JUMP = 760; // about 110 px high
const HINT_MS = 2600; // the controls hint shows when a game starts, then fades
type Bug = { x: number; el: HTMLSpanElement; passed: boolean };

export default function FooterLandscape() {
  const stage = useRef<HTMLDivElement>(null);
  const layers = useRef<(HTMLDivElement | null)[]>([]);
  const site = useRef<HTMLDivElement>(null);
  const bot = useRef<HTMLButtonElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const fx = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"idle" | "play" | "over">("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [touch, setTouch] = useState(false);
  const [hint, setHint] = useState(false);
  const hintTimer = useRef(0);

  const s = useRef({
    mode: "idle" as "idle" | "play" | "over",
    x: 120,
    dir: 1,
    goal: -1,
    hammer: 0,
    wait: 1.2,
    y: 0,
    vy: 0,
    offset: 0,
    speed: 300,
    nextBug: 1,
    bugs: [] as Bug[],
    score: 0,
  });

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setTouch(window.matchMedia("(pointer: coarse)").matches);
    try {
      setBest(Number(localStorage.getItem("cs-bugdodge-best") ?? 0) || 0);
    } catch {
      /* storage blocked */
    }
  }, []);

  const siteX = () => (stage.current?.clientWidth ?? 1200) * 0.64;

  const sparks = (x: number, y: number) => {
    const layer = fx.current;
    if (!layer) return;
    for (let k = 0; k < 6; k++) {
      const p = document.createElement("span");
      p.className = "builder-spark";
      p.style.left = `${x}px`;
      p.style.top = `${y}px`;
      p.style.setProperty("--dx", `${(Math.random() - 0.5) * 50}px`);
      p.style.setProperty("--dy", `${-14 - Math.random() * 28}px`);
      layer.appendChild(p);
      window.setTimeout(() => p.remove(), 600);
    }
  };

  const clearBugs = () => {
    s.current.bugs.forEach((b) => b.el.remove());
    s.current.bugs = [];
  };

  const start = useCallback(() => {
    clearBugs();
    const w = stage.current?.clientWidth ?? 1200;
    Object.assign(s.current, { mode: "play", y: 0, vy: 0, speed: 320, nextBug: 1.1, score: 0, x: Math.max(40, w * 0.14), dir: 1, hammer: 0 });
    setScore(0);
    setMode("play");
    setHint(true);
    window.clearTimeout(hintTimer.current);
    hintTimer.current = window.setTimeout(() => setHint(false), HINT_MS);
  }, []);

  const stop = useCallback(() => {
    clearBugs();
    Object.assign(s.current, { mode: "idle", y: 0, vy: 0, goal: -1, wait: 1.5 });
    setMode("idle");
    setHint(false);
    window.clearTimeout(hintTimer.current);
  }, []);

  const jump = useCallback(() => {
    const st = s.current;
    if (st.mode === "play" && st.y <= 0.5) st.vy = JUMP;
    else if (st.mode === "over") start();
  }, [start]);

  // keyboard while a game is on
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (s.current.mode === "idle") return;
      if (e.key === " " || e.key === "ArrowUp") {
        e.preventDefault();
        jump();
      } else if (e.key === "Escape") stop();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [jump, stop]);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: "100px" });
    if (stage.current) io.observe(stage.current);
    const SPEEDS = [0.08, 0.22, 0.5, 1];

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!visible) return;
      const st = s.current;
      const w = stage.current?.clientWidth ?? 1200;

      if (st.mode === "idle" && !reduced) {
        if (st.hammer > 0) {
          st.hammer -= dt;
        } else if ((st.wait -= dt) <= 0) {
          // alternate: off to the build site, then somewhere along the path
          if (st.goal < 0) st.goal = Math.random() < 0.6 ? siteX() - BOT_W - 4 : 40 + Math.random() * (w - 120);
          const d = st.goal - st.x;
          if (Math.abs(d) < 2) {
            const atSite = Math.abs(st.goal - (siteX() - BOT_W - 4)) < 3;
            st.goal = -1;
            st.dir = atSite ? 1 : st.dir;
            if (atSite) {
              st.hammer = 1.4;
              [250, 620, 990].forEach((t) => window.setTimeout(() => {
                sparks(siteX() + 6, GROUND - 22);
                site.current?.animate([{ transform: "translateY(0)" }, { transform: "translateY(2px)" }, { transform: "translateY(0)" }], { duration: 160 });
              }, t));
            }
            st.wait = atSite ? 1.6 : 0.8 + Math.random() * 1.6;
          } else {
            st.dir = Math.sign(d);
            st.x += st.dir * Math.min(Math.abs(d), 64 * dt);
          }
        }
      }

      if (st.mode === "play") {
        st.vy -= GRAVITY * dt;
        st.y = Math.max(0, st.y + st.vy * dt);
        if (st.y === 0) st.vy = Math.max(0, st.vy);
        st.speed = Math.min(700, st.speed + 10 * dt);
        st.offset += st.speed * dt;
        st.nextBug -= dt;
        if (st.nextBug <= 0 && fx.current) {
          const el = document.createElement("span");
          el.className = "builder-bug";
          el.innerHTML = BUG_SVG;
          fx.current.appendChild(el);
          st.bugs.push({ x: w + 20, el, passed: false });
          st.nextBug = 0.8 + Math.random() * 1.2 * (420 / st.speed);
        }
        for (const b of st.bugs) {
          b.x -= st.speed * dt;
          b.el.style.transform = `translate(${b.x}px, ${GROUND - 18}px)`;
          if (b.x < st.x + BOT_W - 9 && b.x + 20 > st.x + 9 && st.y < 15) {
            st.mode = "over";
            setMode("over");
            setHint(false);
            setBest((prev) => {
              const nb = Math.max(prev, st.score);
              try {
                localStorage.setItem("cs-bugdodge-best", String(nb));
              } catch {
                /* storage blocked */
              }
              return nb;
            });
          }
          if (!b.passed && b.x + 20 < st.x) {
            b.passed = true;
            st.score += 1;
            setScore(st.score);
          }
        }
        st.bugs = st.bugs.filter((b) => (b.x < -40 ? (b.el.remove(), false) : true));
      }

      // scenery: in a game every layer slides at its own speed; otherwise it rests
      layers.current.forEach((el, i) => {
        if (el) el.style.transform = `translateX(${-((st.offset * SPEEDS[i]) % TILE)}px)`;
      });
      if (site.current) site.current.style.transform = `translateX(${st.mode === "idle" ? 0 : -st.offset}px)`;

      const b = bot.current;
      if (b) {
        const walking = (st.mode === "idle" && st.goal >= 0 && st.wait <= 0 && st.hammer <= 0 && !reduced) || st.mode === "play";
        b.style.transform = `translate(${st.x}px, ${GROUND - BOT_H - st.y}px)`;
        b.dataset.walk = walking && st.y === 0 ? "1" : "0";
        b.dataset.hammer = st.hammer > 0 ? "1" : "0";
        b.dataset.air = st.y > 0 ? "1" : "0";
        if (body.current) body.current.style.transform = `scaleX(${st.mode === "idle" ? st.dir : 1})`;
      }
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.clearTimeout(hintTimer.current);
    };
  }, [reduced]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={stage}
      className={`landscape relative w-full select-none overflow-clip${mode !== "idle" ? "cursor-pointer" : ""}`}
      style={{ height: SHOWN }}
      onPointerDown={(e) => {
        if (s.current.mode !== "idle" && !(e.target as HTMLElement).closest("button")) jump();
      }}
      aria-label="A little builder putting up a CodeShaper house. Press the builder to play a small game."
      role="group"
    >
      {/* clouds */}
      <div aria-hidden className={`landscape-clouds absolute inset-x-0 top-0 h-24 ${reduced ? "[animation:none]" : ""}`}>
        <Cloud className="left-[6%] top-6 w-28" />
        <Cloud className="left-[38%] top-12 w-20 opacity-80" />
        <Cloud className="left-[71%] top-4 w-32" />
      </div>

      {/* scenery layers, back to front */}
      {[FarMountains, Hills, Village, Path].map((Layer, i) => (
        <div key={i} aria-hidden ref={(el) => void (layers.current[i] = el)} className="absolute left-0 top-0 flex will-change-transform" style={{ width: TILE * 4 }}>
          {[0, 1, 2, 3].map((k) => (
            <svg key={k} viewBox={`0 0 ${TILE} ${H}`} width={TILE} height={H} className="shrink-0" preserveAspectRatio="none">
              <Layer />
            </svg>
          ))}
        </div>
      ))}

      {/* the CodeShaper house the builder is putting up */}
      <div ref={site} aria-hidden className="absolute left-0 top-0 h-full w-full will-change-transform">
        <div className="absolute" style={{ left: "64%", top: GROUND - 92 }}>
          <BuildSite />
        </div>
      </div>

      <div ref={fx} aria-hidden className="pointer-events-none absolute inset-0" />

      {/* the builder */}
      <button
        ref={bot}
        type="button"
        onClick={() => mode === "idle" && start()}
        tabIndex={mode === "idle" ? 0 : -1}
        aria-hidden={mode !== "idle"}
        aria-label="Play a small game: dodge the bugs"
        className={`builder-bot group absolute left-0 top-0 z-10 rounded-full after:absolute after:-inset-3 after:content-[''] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4f46e5] ${mode === "idle" ? "cursor-pointer" : "pointer-events-none"}`}
        style={{ width: BOT_W, height: BOT_H }}
      >
        <div ref={body} className="h-full w-full">
          <BotSvg />
        </div>
        {mode === "idle" && (
          <Tip className="opacity-70 group-hover:opacity-100 group-focus-visible:opacity-100">
            <Play size={9} aria-hidden className="fill-current" /> Play
          </Tip>
        )}
        {mode === "play" && (
          <Tip className={hint ? "opacity-100" : "opacity-0"}>
            {touch ? (
              "Tap to jump"
            ) : (
              <>
                <Kbd>↑</Kbd> jump <span className="text-ink-dim">·</span> <Kbd>Esc</Kbd> stop
              </>
            )}
          </Tip>
        )}
      </button>

      {/* game HUD: icons, not sentences (owner, 25 Nov 2026) */}
      {mode !== "idle" && (
        <div className="absolute right-4 top-4 z-10 flex items-center gap-1.5 font-urbanist text-[12px] sm:right-8">
          <span className="inline-flex h-7 items-center gap-2.5 rounded-full bg-white/75 px-2.5 font-semibold tabular-nums text-ink backdrop-blur-md">
            <span className="inline-flex items-center gap-1" title="Bugs dodged">
              <BugIcon size={13} aria-hidden className={mode === "over" ? "text-[#e5484d]" : "text-ink-dim"} />
              {score}
            </span>
            {best > 0 && (
              <span className="inline-flex items-center gap-1 font-medium text-ink-dim" title="Best">
                <Trophy size={12} aria-hidden />
                {best}
              </span>
            )}
          </span>
          {mode === "over" && (
            <button type="button" onClick={start} aria-label="Play again" title="Play again" className="grid h-7 w-7 place-items-center rounded-full bg-[#0b0f19] text-white">
              <RotateCcw size={13} aria-hidden />
            </button>
          )}
          <button type="button" onClick={stop} aria-label="Stop the game" title="Stop" className="grid h-7 w-7 place-items-center rounded-full bg-white/75 text-ink backdrop-blur-md">
            <X size={13} aria-hidden />
          </button>
        </div>
      )}
      <p aria-live="polite" className="sr-only">
        {mode === "over" ? `A bug got you. ${score} dodged${best > 0 ? `, best ${best}` : ""}.` : ""}
      </p>
    </div>
  );
}

/** a small, light tooltip above the builder's head */
function Tip({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute bottom-full left-1/2 mb-2 inline-flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full bg-white/80 px-2 py-0.5 font-urbanist text-[11px] font-medium text-ink-mid shadow-[0_2px_8px_-4px_rgba(11,15,25,0.25)] backdrop-blur-md transition-opacity duration-500 ${className}`}
    >
      {children}
      <span className="absolute left-1/2 top-full -translate-x-1/2 border-x-4 border-t-4 border-x-transparent border-t-white/80" />
    </span>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return <kbd className="rounded border border-ink/15 bg-white px-1 font-sans text-[10px] leading-[14px] text-ink">{children}</kbd>;
}

/* ------------------------------------------------------------------ scenery */

function Cloud({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 44" className={`absolute ${className}`} aria-hidden>
      <path d="M18 40h86a14 14 0 0 0 0-28 22 22 0 0 0-41-6 17 17 0 0 0-30 9A13 13 0 0 0 18 40Z" fill="#ffffff" fillOpacity=".7" />
    </svg>
  );
}

function FarMountains() {
  return (
    <path
      d="M0 196 70 132 128 164 214 84 300 150 360 118 440 170 520 98 610 156 690 112 760 160 850 74 940 150 1010 120 1090 168 1150 128 1200 150V260H0Z"
      fill="#d9d4fb"
      fillOpacity=".75"
    />
  );
}

function Hills() {
  return <path d="M0 190C120 150 230 146 360 168S600 128 760 156 1040 150 1200 176V260H0Z" fill="#c9c2f6" fillOpacity=".8" />;
}

const HOUSES = [
  { x: 80, w: 46, h: 30, roof: "#f3b69c" },
  { x: 150, w: 34, h: 24, roof: "#8f8cff" },
  { x: 420, w: 52, h: 32, roof: "#8f8cff" },
  { x: 880, w: 44, h: 28, roof: "#f3b69c" },
  { x: 940, w: 30, h: 22, roof: "#c9a0f0" },
];
const TREES = [40, 210, 250, 380, 520, 600, 820, 1010, 1060, 1140];

function Village() {
  return (
    <>
      <path d="M0 186C200 170 360 176 560 182S960 168 1200 184V260H0Z" fill="#e5e0fd" />
      {TREES.map((x, i) => (
        <g key={x}>
          <rect x={x - 1.5} y={164} width={3} height={14} fill="#8a84b8" />
          <circle cx={x} cy={160 - (i % 3) * 3} r={9 + (i % 3) * 2} fill={i % 2 ? "#b9dcc6" : "#a5cfb6"} />
        </g>
      ))}
      {HOUSES.map((h) => (
        <g key={h.x}>
          <rect x={h.x} y={178 - h.h} width={h.w} height={h.h} rx={2} fill="#ffffff" />
          <path d={`M${h.x - 4} ${178 - h.h + 2}L${h.x + h.w / 2} ${178 - h.h - h.w * 0.42}L${h.x + h.w + 4} ${178 - h.h + 2}Z`} fill={h.roof} />
          <rect x={h.x + h.w * 0.2} y={178 - h.h * 0.62} width={h.w * 0.2} height={h.h * 0.3} rx={1} fill="#c9c2f6" />
          <rect x={h.x + h.w * 0.58} y={178 - h.h * 0.55} width={h.w * 0.22} height={h.h * 0.55} rx={1} fill="#8f8cff" fillOpacity=".55" />
        </g>
      ))}
    </>
  );
}

function Path() {
  return (
    <>
      <rect x="0" y={GROUND} width={TILE} height={H - GROUND} fill="#f7f5ff" />
      <path d={`M0 ${GROUND}H${TILE}`} stroke="#0b0f19" strokeOpacity=".12" strokeWidth="1.5" />
      {/* stones and grass, so the ground visibly moves in a game */}
      {[60, 190, 330, 470, 560, 700, 820, 960, 1080].map((x, i) => (
        <g key={x}>
          {i % 2 ? (
            <ellipse cx={x} cy={GROUND + 14 + (i % 3) * 9} rx={5} ry={2.5} fill="#0b0f19" fillOpacity=".08" />
          ) : (
            <path d={`M${x} ${GROUND}l3-7 2 7 3-5 2 5`} stroke="#8fc2a3" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          )}
          <path d={`M${x + 30} ${GROUND + 30 + (i % 4) * 6}h${14 + (i % 3) * 8}`} stroke="#0b0f19" strokeOpacity=".06" strokeWidth="2" strokeLinecap="round" />
        </g>
      ))}
    </>
  );
}

/** a small house going up: scaffolding, half the bricks, a crane and the CodeShaper flag */
function BuildSite() {
  return (
    <svg width="132" height="94" viewBox="0 0 132 94" fill="none">
      {/* crane */}
      <path d="M108 92V8M108 8H58M108 8l14 10M66 8v16" stroke="#6b7183" strokeWidth="2" strokeLinecap="round" />
      <rect x="60" y="24" width="12" height="7" rx="1.5" fill="#f5b700" />
      {/* the house so far */}
      <rect x="14" y="50" width="70" height="42" rx="2" fill="#ffffff" />
      {[0, 1, 2, 3].map((r) => (
        <path key={r} d={`M14 ${58 + r * 9}H84`} stroke="#e5e0fd" strokeWidth="1.2" />
      ))}
      <rect x="40" y="66" width="16" height="26" rx="2" fill="#8f8cff" fillOpacity=".6" />
      {/* roof frame (not finished) */}
      <path d="M10 52 49 26 88 52" stroke="#4f46e5" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M30 39v13M49 26v26M68 39v13" stroke="#4f46e5" strokeOpacity=".5" strokeWidth="1.6" />
      {/* scaffold */}
      <path d="M2 92V44M26 92V44M2 56h24M2 72h24" stroke="#6b7183" strokeOpacity=".7" strokeWidth="1.6" />
      {/* the flag: the CodeShaper mark */}
      <path d="M49 26V6" stroke="#0b0f19" strokeWidth="1.6" />
      <path d="M49 6h20l-4 5 4 5H49Z" fill="#4f46e5" />
      <path d="M54.5 9.2 57 11l-2.5 1.8" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const BUG_SVG = `<svg width="22" height="18" viewBox="0 0 22 18" fill="none"><path d="M4 9H1M21 9h-3M5 4 2.5 2M17 4l2.5-2M5 14l-2.5 2M17 14l2.5 2" stroke="#0b0f19" stroke-width="1.6" stroke-linecap="round"/><ellipse cx="11" cy="10" rx="6.5" ry="6.5" fill="#e5484d"/><path d="M11 4v12.5" stroke="#0b0f19" stroke-opacity=".35" stroke-width="1.2"/><circle cx="11" cy="3.6" r="2.4" fill="#0b0f19"/></svg>`;

/** the builder: hard hat, visor face in the brand indigo, a hammer */
function BotSvg() {
  return (
    <svg viewBox="0 0 34 40" width="34" height="40" fill="none" className="overflow-visible">
      <g className="builder-arm" style={{ transformOrigin: "24px 22px" }}>
        <path d="M24 22l7-6" stroke="#0b0f19" strokeWidth="2.4" strokeLinecap="round" />
        <rect x="27.5" y="10.5" width="8" height="5" rx="1.2" transform="rotate(-40 31.5 13)" fill="#6b7183" />
      </g>
      <rect x="8" y="20" width="17" height="12" rx="4" fill="#4f46e5" />
      <rect x="11" y="23" width="11" height="2.2" rx="1.1" fill="#fff" fillOpacity=".55" />
      <rect className="builder-leg-a" x="10" y="31" width="4.5" height="8" rx="2" fill="#0b0f19" />
      <rect className="builder-leg-b" x="18.5" y="31" width="4.5" height="8" rx="2" fill="#0b0f19" />
      <rect x="7" y="6" width="19" height="15" rx="6" fill="#ffffff" stroke="#0b0f19" strokeOpacity=".12" />
      <rect x="10" y="10.5" width="13" height="6.5" rx="3.25" fill="#0b0f19" />
      <circle cx="14" cy="13.75" r="1.4" fill="#8f8cff" />
      <circle cx="19.5" cy="13.75" r="1.4" fill="#8f8cff" />
      <path d="M6 7.5C6 3.6 10.4 1 16.5 1S27 3.6 27 7.5" fill="#f5b700" />
      <rect x="4.5" y="6.5" width="24" height="3" rx="1.5" fill="#f5b700" />
      <rect x="15" y="1.4" width="3" height="5.4" rx="1.2" fill="#ffffff" fillOpacity=".55" />
    </svg>
  );
}
