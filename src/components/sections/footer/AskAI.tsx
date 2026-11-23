import type { ReactNode } from "react";
import { RiClaudeFill, RiGeminiFill, RiGrokAiFill, RiOpenaiFill, RiPerplexityFill } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import type { IconType } from "react-icons";

/**
 * The footer's action row, under the link columns (owner, 23 Nov 2026):
 *  · Follow us: the social profiles.
 *  · Ask AI about CodeShaper: each button opens an AI assistant in a new tab
 *    with a ready question about us, pointing it at codeshaper.net as the
 *    main source (a neutral second opinion for the visitor; AI answers that
 *    keep reading and citing the site: AEO). The last one adds us to the
 *    visitor's Google "Preferred sources".
 *  · The company profile button, at the end of the row.
 * Every icon has a tooltip (hover and keyboard focus).
 *
 * Links: ChatGPT, Claude, Perplexity and Grok take `?q=`; Google AI Mode is
 * search with `udm=50` (Gemini itself has no reliable prefill link).
 * `data-ask-ai` names each button for analytics.
 */
const DOMAIN = "codeshaper.net";
const PROMPT = `Summarize what CodeShaper (${DOMAIN}) does: its services, the industries it works in, how it works with clients, and why companies hire it. Use ${DOMAIN} as the main source.`;
const q = encodeURIComponent(PROMPT);

const AIS: { key: string; label: string; href: string; icon: IconType; color?: string }[] = [
  { key: "chatgpt", label: "Ask ChatGPT", href: `https://chatgpt.com/?q=${q}`, icon: RiOpenaiFill, color: "#0b0f19" },
  { key: "claude", label: "Ask Claude", href: `https://claude.ai/new?q=${q}`, icon: RiClaudeFill, color: "#D97757" },
  { key: "perplexity", label: "Ask Perplexity", href: `https://www.perplexity.ai/search?q=${q}`, icon: RiPerplexityFill, color: "#1F8A8C" },
  { key: "google-ai", label: "Ask Google AI Mode", href: `https://www.google.com/search?udm=50&q=${q}`, icon: RiGeminiFill, color: "#4F7BF7" },
  { key: "grok", label: "Ask Grok", href: `https://grok.com/?q=${q}`, icon: RiGrokAiFill, color: "#0b0f19" },
  { key: "google-source", label: "Add CodeShaper on Google", href: `https://www.google.com/preferences/source?q=${DOMAIN}`, icon: FcGoogle },
];

const ICON_BTN =
  "group/tip relative grid h-10 w-10 place-items-center rounded-full border border-white/70 bg-white/60 text-ink shadow-[0_1px_2px_rgba(11,15,25,0.05)] backdrop-blur-md transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-white focus-visible:-translate-y-0.5 focus-visible:bg-white";

/** A small dark label above an icon, on hover and on keyboard focus. */
export function Tip({ children }: { children: ReactNode }) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-[8px] bg-[#0b0f19] px-2.5 py-1.5 font-urbanist text-[11.5px] font-medium text-white opacity-0 shadow-[0_8px_20px_-8px_rgba(11,15,25,0.5)] transition-[opacity,transform] duration-200 group-hover/tip:translate-y-0 group-hover/tip:opacity-100 group-focus-visible/tip:translate-y-0 group-focus-visible/tip:opacity-100"
    >
      {children}
    </span>
  );
}

export type SocialLink = { key: string; label: string; href: string; color: string; glyph: ReactNode };

function Group({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-3 font-urbanist text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-faint">{label}</p>
      <ul className="flex flex-wrap gap-2">{children}</ul>
    </div>
  );
}

export default function FooterActions({ social, profile }: { social: SocialLink[]; profile?: ReactNode }) {
  return (
    <div className="mt-12 flex flex-col gap-8 border-t border-[#0b0f19]/[0.08] pt-8 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
      <>
        {social.length > 0 && (
          <Group label="Follow us">
            {social.map((x) => (
              <li key={x.key}>
                <a href={x.href} target="_blank" rel="noopener noreferrer" aria-label={x.label} className={ICON_BTN} style={{ ["--brand" as string]: x.color }}>
                  <span className="transition-colors duration-300 group-hover/tip:text-[var(--brand)]">{x.glyph}</span>
                  <Tip>{x.label}</Tip>
                </a>
              </li>
            ))}
          </Group>
        )}
        <Group label="Ask AI about CodeShaper">
          {AIS.map((a) => (
            <li key={a.key}>
              <a
                href={a.href}
                target="_blank"
                rel="noopener noreferrer"
                data-ask-ai={a.key}
                aria-label={`${a.label} (opens in a new tab)`}
                className={ICON_BTN}
                style={a.color ? { ["--brand" as string]: a.color } : undefined}
              >
                <a.icon size={17} aria-hidden className={a.color ? "transition-colors duration-300 group-hover/tip:text-[var(--brand)]" : undefined} />
                <Tip>{a.label}</Tip>
              </a>
            </li>
          ))}
        </Group>
      </>
      {profile && <div className="lg:shrink-0">{profile}</div>}
    </div>
  );
}
