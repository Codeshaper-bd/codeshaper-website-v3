import { RiClaudeFill, RiGeminiFill, RiGrokAiFill, RiOpenaiFill, RiPerplexityFill } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import type { IconType } from "react-icons";
import { Tip } from "@/components/sections/footer/AskAI";

/**
 * "Ask AI about this article": the same assistants as the footer (ChatGPT,
 * Claude, Perplexity, Google AI Mode, Grok), each opening in a new tab with
 * a ready question about this page (summary, key points, how it applies to
 * the reader's team), and Ask Google (a search with the same question).
 * Links as in the footer (footer/AskAI.tsx): `?q=` prefill; Google AI Mode
 * is search with `udm=50` (Gemini has no reliable prefill link).
 */
export default function ArticleAskAI({ url, title }: { url: string; title: string }) {
  const q = encodeURIComponent(`Read ${url} ("${title}" by CodeShaper). Summarize it in 5 bullet points, then tell me how it applies to a product team like mine.`);
  const ais: { key: string; label: string; href: string; icon: IconType; color?: string }[] = [
    { key: "chatgpt", label: "Ask ChatGPT", href: `https://chatgpt.com/?q=${q}`, icon: RiOpenaiFill, color: "#0b0f19" },
    { key: "claude", label: "Ask Claude", href: `https://claude.ai/new?q=${q}`, icon: RiClaudeFill, color: "#D97757" },
    { key: "perplexity", label: "Ask Perplexity", href: `https://www.perplexity.ai/search?q=${q}`, icon: RiPerplexityFill, color: "#1F8A8C" },
    { key: "google-ai", label: "Ask Google AI Mode", href: `https://www.google.com/search?udm=50&q=${q}`, icon: RiGeminiFill, color: "#4F7BF7" },
    { key: "grok", label: "Ask Grok", href: `https://grok.com/?q=${q}`, icon: RiGrokAiFill, color: "#0b0f19" },
    { key: "google", label: "Ask Google", href: `https://www.google.com/search?q=${q}`, icon: FcGoogle },
  ];
  return (
    <div>
      <p className="mb-3 font-urbanist text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-faint">Ask AI about this article</p>
      <ul className="flex flex-wrap gap-2">
        {ais.map((a) => (
          <li key={a.key}>
            <a
              href={a.href}
              target="_blank"
              rel="noopener noreferrer"
              data-ask-ai={`article-${a.key}`}
              aria-label={`${a.label} about this article (opens in a new tab)`}
              style={a.color ? { ["--brand" as string]: a.color } : undefined}
              className="group/tip relative grid h-9 w-9 place-items-center rounded-full border border-hairline-light bg-white text-ink-dim transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-[#0b0f19]/[0.2]"
            >
              <a.icon size={16} aria-hidden className={a.color ? "transition-colors duration-300 group-hover/tip:text-[var(--brand)]" : undefined} />
              <Tip>{a.label}</Tip>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
