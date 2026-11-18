import type { ReactNode } from "react";
import { Bot, Check, Database, FileText, Building2, Users, Sparkles, MousePointer2, Search, Lock } from "lucide-react";

/**
 * Product-style mockups for the services bento (Stripe pattern: each card
 * shows the kind of thing we ship, not an icon). Pure markup and CSS, no
 * images, no client JS; every mockup is decorative (the card's text and the
 * detail dialog carry the information), so callers wrap them in aria-hidden.
 *
 * Sample data is generic product UI (order numbers, plan names, scores),
 * not claims about Codeshaper's results.
 */

function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-[14px] border border-[#0b0f19]/[0.07] bg-white shadow-[0_1px_2px_rgba(11,15,25,0.04),0_18px_40px_-18px_rgba(11,15,25,0.28)] ${className}`}
    >
      {children}
    </div>
  );
}

function WindowBar({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-1.5 border-b border-[#0b0f19]/[0.06] px-3 py-2">
      <span className="h-1.5 w-1.5 rounded-full bg-[#0b0f19]/15" />
      <span className="h-1.5 w-1.5 rounded-full bg-[#0b0f19]/15" />
      <span className="h-1.5 w-1.5 rounded-full bg-[#0b0f19]/15" />
      <span className="ml-2 truncate text-[10px] font-medium text-[#6b7180]">{label}</span>
    </div>
  );
}

/* 1 · AI Agents & Automation: a support conversation + the agent's run log with a human approval step */
export function AgentsVisual() {
  const steps = [
    { label: "Read ticket from helpdesk", time: "0.4s" },
    { label: "Found order #4821 in store", time: "1.1s" },
    { label: "Checked refund policy", time: "0.3s" },
  ];
  return (
    <div className="relative h-full w-full">
      <Panel className="absolute left-[4%] top-[4%] hidden w-[300px] sm:block lg:left-[7%]">
        <WindowBar label="Support inbox" />
        <div className="space-y-2.5 p-3.5">
          <div className="max-w-[86%] rounded-[12px] rounded-tl-[4px] bg-[#f2f3f6] px-3 py-2 text-[11px] leading-snug text-[#1f2433]">
            My order #4821 arrived damaged. Can I get a refund?
          </div>
          <div className="ml-auto max-w-[88%] rounded-[12px] rounded-tr-[4px] bg-[#efeaff] px-3 py-2 text-[11px] leading-snug text-[#2a2470]">
            Sorry about that! A $48.00 refund is ready and a teammate is approving it now.
          </div>
          <p className="flex items-center justify-end gap-1 text-[9.5px] text-[#8a90a0]">
            <Sparkles size={9} /> Drafted by AI · checked by your team
          </p>
          <div className="h-7 rounded-lg border border-[#0b0f19]/[0.07] bg-[#fafbfc]" />
        </div>
      </Panel>

      <Panel className="absolute bottom-[-18px] left-1/2 w-[min(300px,88%)] -translate-x-1/2 sm:left-auto sm:right-[4%] sm:translate-x-0 lg:right-[7%]">
        <div className="flex items-center gap-2 border-b border-[#0b0f19]/[0.06] px-3.5 py-2.5">
          <span className="grid h-6 w-6 place-items-center rounded-md bg-[#0b0f19] text-white">
            <Bot size={13} strokeWidth={2} />
          </span>
          <span className="text-[11.5px] font-semibold text-[#0b0f19]">Refund agent</span>
          <span className="ml-auto flex items-center gap-1 text-[10px] font-medium text-[#16a34a]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" /> Live
          </span>
        </div>
        <ul className="space-y-1.5 px-3.5 py-3">
          {steps.map((s) => (
            <li key={s.label} className="flex items-center gap-2 text-[11px] text-[#383f50]">
              <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-[#dcfce7] text-[#16a34a]">
                <Check size={10} strokeWidth={3} />
              </span>
              {s.label}
              <span className="ml-auto text-[10px] tabular-nums text-[#8a90a0]">{s.time}</span>
            </li>
          ))}
        </ul>
        <div className="mx-3.5 mb-3.5 rounded-[10px] border border-[#f5b85b]/50 bg-[#fff8eb] p-2.5">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold text-[#7a4a06]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#f59e0b]" />
            Refund $48.00 · needs approval
          </p>
          <div className="mt-2 flex gap-1.5">
            <span className="rounded-md bg-[#0b0f19] px-2.5 py-1 text-[10px] font-semibold text-white">Approve</span>
            <span className="rounded-md border border-[#0b0f19]/10 bg-white px-2.5 py-1 text-[10px] font-semibold text-[#383f50]">
              Edit
            </span>
          </div>
        </div>
        <p className="border-t border-[#0b0f19]/[0.06] px-3.5 py-2 text-[9.5px] text-[#8a90a0]">Every step logged · tested · monitored</p>
      </Panel>
    </div>
  );
}

/* 2 · AI & Software Development: SaaS plan card + product analytics */
const BARS = [22, 30, 26, 38, 34, 44, 40, 52, 46, 58, 50, 62, 70, 64, 76, 68, 82, 74, 88, 80, 92, 86, 96, 90, 100];

export function SoftwareVisual() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-end gap-3 px-5 pb-0">
      <Panel className="w-full max-w-[290px] p-3.5">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#efeaff] text-[#5b4fd6]">
            <Sparkles size={15} />
          </span>
          <div>
            <p className="text-[12px] font-semibold text-[#0b0f19]">Pro plan</p>
            <p className="text-[10px] text-[#8a90a0]">Billed monthly · 24 seats</p>
          </div>
          <span className="ml-auto rounded-full bg-[#dcfce7] px-2 py-0.5 text-[9.5px] font-semibold text-[#15803d]">Active</span>
        </div>
        <p className="mt-3 text-[10px] font-medium text-[#6b7180]">AI credits this month</p>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#eef0f4]">
          <div className="h-full w-[68%] rounded-full bg-[linear-gradient(90deg,#4f6bff,#c08aff,#ff8fbf)]" />
        </div>
      </Panel>
      <Panel className="mb-[-18px] w-full max-w-[290px] p-3.5 pb-6">
        <p className="text-[10px] font-medium text-[#6b7180]">Active users · last 30 days</p>
        <p className="mt-0.5 flex items-baseline gap-2">
          <span className="text-[19px] font-semibold tabular-nums tracking-tight text-[#0b0f19]">12,480</span>
          <span className="text-[10px] font-semibold text-[#16a34a]">+18.4%</span>
        </p>
        <div className="mt-3 flex h-[64px] items-end gap-[3px]">
          {BARS.map((h, i) => (
            <span
              key={i}
              className="flex-1 rounded-t-[2px] bg-[#7c6cff]"
              style={{ height: `${h}%`, opacity: 0.35 + (i / BARS.length) * 0.65 }}
            />
          ))}
        </div>
      </Panel>
    </div>
  );
}

/* 3 · AI Integration & Infrastructure: systems wired into one AI layer + a cited answer */
const NODES = [
  { label: "CRM", icon: Users, x: 17, y: 16 },
  { label: "ERP", icon: Building2, x: 83, y: 16 },
  { label: "Docs", icon: FileText, x: 15, y: 66 },
  { label: "Warehouse", icon: Database, x: 79, y: 66 },
];

export function IntegrationVisual() {
  return (
    <div className="relative mx-auto h-full w-full max-w-[340px]">
      <div className="absolute inset-x-3 top-1 h-[200px]">
        <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
          {NODES.map((n) => (
            <path
              key={n.label}
              d={`M ${n.x} ${n.y} C ${(n.x + 50) / 2} ${n.y}, ${(n.x + 50) / 2} 44, 50 44`}
              fill="none"
              stroke="#6f6bd8"
              strokeOpacity="0.45"
              strokeWidth="1.2"
              strokeDasharray="3 3"
              vectorEffect="non-scaling-stroke"
              className="svc-flow"
            />
          ))}
        </svg>
        <div className="absolute left-1/2 top-[44%] grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[14px] bg-[#0b0f19] text-white shadow-[0_10px_24px_-8px_rgba(11,15,25,0.5)] ring-4 ring-white/70">
          <Sparkles size={20} />
        </div>
        {NODES.map((n) => (
          <span
            key={n.label}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border border-[#0b0f19]/[0.07] bg-white py-1 pl-1 pr-2.5 text-[10.5px] font-semibold text-[#1f2433] shadow-[0_6px_16px_-8px_rgba(11,15,25,0.3)]"
            style={{ left: `${n.x}%`, top: `${n.y}%` }}
          >
            <span className="grid h-5 w-5 place-items-center rounded-full bg-[#eef3fd] text-[#1b78cc]">
              <n.icon size={11} />
            </span>
            {n.label}
          </span>
        ))}
      </div>
      <Panel className="absolute inset-x-3 bottom-[-18px] p-3 pb-6">
        <div className="flex items-center gap-1.5 text-[10px] font-medium text-[#6b7180]">
          <Lock size={10} /> Private model · answers from your data
        </div>
        <p className="mt-1.5 text-[11px] leading-snug text-[#1f2433]">Refunds over $500 need a manager sign-off within 24 hours.</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {["Refund policy.pdf", "CRM · Case 1182"].map((s, i) => (
            <span key={s} className="rounded-md bg-[#eef3fd] px-1.5 py-0.5 text-[9.5px] font-medium text-[#1b5fa8]">
              [{i + 1}] {s}
            </span>
          ))}
        </div>
      </Panel>
    </div>
  );
}

/* 4 · UI/UX & Product Design: a tilted app screen mid-edit, with a selection and tokens */
export function DesignVisual() {
  return (
    <div className="relative grid h-full w-full place-items-center">
      <div className="relative w-[210px] -rotate-[7deg] rounded-[26px] border border-white/70 bg-white/90 p-2 shadow-[0_30px_60px_-24px_rgba(90,40,120,0.45)] backdrop-blur-sm">
        <div className="rounded-[20px] bg-white p-4">
          <p className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-[#8a90a0]">Step 2 of 3</p>
          <p className="mt-1 text-[14px] font-semibold leading-tight text-[#0b0f19]">Set up your workspace</p>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-[#f1eef8]">
            <div className="h-full w-2/3 rounded-full bg-[#e96aa8]" />
          </div>
          <p className="mt-3.5 text-[9.5px] font-medium text-[#6b7180]">Workspace name</p>
          <div className="mt-1 flex h-8 items-center rounded-lg border border-[#e96aa8]/60 px-2.5 text-[11px] text-[#0b0f19] shadow-[0_0_0_3px_rgba(233,106,168,0.14)]">
            Northwind<span className="ml-px h-3.5 w-px animate-pulse bg-[#0b0f19]" />
          </div>
          <div className="relative mt-3.5">
            <div className="grid h-8 place-items-center rounded-lg bg-[#0b0f19] text-[11px] font-semibold text-white">Continue</div>
            {/* design-tool selection */}
            <span className="pointer-events-none absolute -inset-1 rounded-[10px] border border-[#5b8cff]" />
            {[
              "-left-[6px] -top-[6px]",
              "-right-[6px] -top-[6px]",
              "-bottom-[6px] -left-[6px]",
              "-bottom-[6px] -right-[6px]",
            ].map((p) => (
              <span key={p} className={`absolute h-[7px] w-[7px] border border-[#5b8cff] bg-white ${p}`} />
            ))}
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#5b8cff] px-1.5 py-0.5 text-[9px] font-semibold text-white">
              Button / Primary · 32
            </span>
          </div>
          <div className="mt-9 flex items-center gap-1.5">
            {["#0b0f19", "#e96aa8", "#ffa98a", "#c08aff", "#f1eef8"].map((c) => (
              <span key={c} className="h-4 w-4 rounded-full border border-black/5" style={{ background: c }} />
            ))}
            <span className="ml-auto text-[13px] font-semibold text-[#0b0f19]">Aa</span>
          </div>
        </div>
      </div>
      <span className="absolute right-[16%] top-[54%] flex items-start">
        <MousePointer2 size={18} className="fill-[#e96aa8] text-white drop-shadow" />
        <span className="ml-0.5 mt-3 rounded-full bg-[#e96aa8] px-2 py-0.5 text-[9.5px] font-semibold text-white">Designer</span>
      </span>
    </div>
  );
}

/* 5 · Websites & Commerce: a storefront, its speed score, and an AI search citation */
export function WebVisual() {
  const score = 98;
  const r = 20;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative h-full w-full">
      <Panel className="absolute bottom-[-18px] left-1/2 w-[min(300px,90%)] -translate-x-1/2 overflow-hidden">
        <div className="flex items-center gap-2 border-b border-[#0b0f19]/[0.06] px-3 py-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#0b0f19]/15" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#0b0f19]/15" />
          <span className="flex-1 truncate rounded-md bg-[#f2f3f6] px-2 py-0.5 text-center text-[9.5px] text-[#6b7180]">yourstore.com</span>
        </div>
        <div className="p-3 pb-7">
          <div className="rounded-lg bg-[linear-gradient(120deg,#ffe3ba,#ffc4a8_45%,#f7b2d4)] p-3">
            <p className="text-[12px] font-semibold leading-tight text-[#3d1f0d]">Summer collection</p>
            <span className="mt-2 inline-block rounded-md bg-[#0b0f19] px-2 py-0.5 text-[9px] font-semibold text-white">Shop now</span>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-1.5">
            {["#f6efe6", "#eef1f6", "#f7ebef"].map((bg, i) => (
              <div key={bg} className="rounded-md p-1.5" style={{ background: bg }}>
                <div className="h-8 rounded bg-white/70" />
                <div className="mt-1 h-1 w-3/4 rounded-full bg-[#0b0f19]/15" />
                <p className="mt-1 text-[9px] font-semibold tabular-nums text-[#1f2433]">${[48, 64, 32][i]}</p>
              </div>
            ))}
          </div>
        </div>
      </Panel>

      <Panel className="absolute left-[6%] top-[4%] flex items-center gap-2.5 p-2.5 pr-3.5">
        <span className="relative grid h-12 w-12 place-items-center">
          <svg viewBox="0 0 48 48" className="absolute inset-0 -rotate-90">
            <circle cx="24" cy="24" r={r} fill="none" stroke="#dcfce7" strokeWidth="4" />
            <circle
              cx="24"
              cy="24"
              r={r}
              fill="none"
              stroke="#22c55e"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={c * (1 - score / 100)}
            />
          </svg>
          <span className="text-[12px] font-bold tabular-nums text-[#15803d]">{score}</span>
        </span>
        <span>
          <span className="block text-[11px] font-semibold text-[#0b0f19]">Performance</span>
          <span className="block text-[9.5px] text-[#8a90a0]">Core Web Vitals pass</span>
        </span>
      </Panel>

      <Panel className="absolute right-[5%] top-[30%] w-[168px] p-2.5">
        <p className="flex items-center gap-1 text-[9.5px] font-medium text-[#6b7180]">
          <Search size={10} /> AI search answer
        </p>
        <div className="mt-1.5 space-y-1">
          <div className="h-1 w-full rounded-full bg-[#0b0f19]/10" />
          <div className="h-1 w-4/5 rounded-full bg-[#0b0f19]/10" />
        </div>
        <span className="mt-2 inline-flex items-center gap-1 rounded-md bg-[#fff1e6] px-1.5 py-0.5 text-[9.5px] font-semibold text-[#b4500f]">
          Source: yourstore.com
        </span>
      </Panel>
    </div>
  );
}
