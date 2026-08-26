import { Sparkles } from "lucide-react";

export default function AiSummary({ points }: { points: string[] }) {
  if (points.length === 0) return null;
  return (
    <div className="rounded-2xl border border-aurora-violet/20 bg-aurora-violet/[0.04] p-6">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-aurora-violet/15 text-aurora-violet">
          <Sparkles size={14} strokeWidth={1.75} />
        </span>
        <p className="font-urbanist text-[13px] font-bold text-ink">AI Summary</p>
      </div>
      <ul className="mt-4 space-y-2.5">
        {points.map((point) => (
          <li key={point} className="flex items-start gap-2.5 font-urbanist text-[14px] leading-relaxed text-ink-dim">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-aurora-violet" />
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}
