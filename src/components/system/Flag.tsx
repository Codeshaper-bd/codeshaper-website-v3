import { Globe2 } from "lucide-react";

/** Small SVG flags (emoji flags render as letters on Windows). */
export default function Flag({ market }: { market: string }) {
  const box = "h-[11px] w-[16px] shrink-0 overflow-hidden rounded-[2.5px] shadow-[0_0_0_0.5px_rgba(11,15,25,0.18)]";
  if (market === "Spain")
    return (
      <svg viewBox="0 0 24 16" className={box} aria-hidden>
        <rect width="24" height="16" fill="#c60b1e" />
        <rect y="4" width="24" height="8" fill="#ffc400" />
      </svg>
    );
  if (market === "Canada")
    return (
      <svg viewBox="0 0 24 16" className={box} aria-hidden>
        <rect width="24" height="16" fill="#fff" />
        <rect width="6" height="16" fill="#d52b1e" />
        <rect x="18" width="6" height="16" fill="#d52b1e" />
        <path
          fill="#d52b1e"
          d="M12 3.2l.9 1.7 1-.5-.3 2.4 1.4-1.4.4 1 1.3-.2-.6 1.6.7.4-2.2 1.9.3 1-2.4-.3V13h-1v-2.2l-2.4.3.3-1-2.2-1.9.7-.4-.6-1.6 1.3.2.4-1 1.4 1.4-.3-2.4 1 .5z"
        />
      </svg>
    );
  return <Globe2 size={13} strokeWidth={2} className="shrink-0 text-ink-dim" aria-hidden />;
}
