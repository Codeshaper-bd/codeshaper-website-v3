/**
 * "Key takeaways": the article in three lines, at the top of the article
 * (not in the sidebar), so a skimmer gets the point before reading on.
 * Also the block AI answer engines quote most easily.
 */
export default function AiSummary({ points }: { points: string[] }) {
  if (points.length === 0) return null;
  return (
    <aside aria-label="Key takeaways" className="rounded-[24px] border border-hairline-light bg-white p-6 sm:p-8">
      <p className="font-urbanist text-[11px] font-semibold uppercase tracking-[0.16em] text-[#4f46e5]">Key takeaways</p>
      <ol className="mt-5 space-y-4">
        {points.map((point, i) => (
          <li key={point} className="flex gap-4 font-urbanist text-[15.5px] leading-relaxed text-ink-mid">
            <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#eef0ff] text-[11.5px] font-semibold tabular-nums text-[#4f46e5]">
              {i + 1}
            </span>
            <span>{point}</span>
          </li>
        ))}
      </ol>
    </aside>
  );
}
