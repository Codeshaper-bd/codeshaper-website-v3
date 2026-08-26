"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";

// Same hand-authored icon paths as Footer.tsx's SOCIAL_LINKS (this project
// doesn't pull brand icons from react-icons for these two — LinkedIn's mark
// isn't in react-icons/si at all, and X's is kept consistent with Footer's).
const LINKEDIN_PATH =
  "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V21h-4V9Z";
const X_PATH = "M3 3h4.6l4 5.8L16.2 3H21l-6.9 8.9L21.4 21h-4.6l-4.4-6.3L6.6 21H2l7.3-9.3L3 3Z";

export default function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable — no-op, button just won't confirm
    }
  };

  const linkedInHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  const xHref = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;

  return (
    <div>
      <p className="mb-3 font-urbanist text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint">Share</p>
      <div className="flex items-center gap-2">
        <a
          href={linkedInHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on LinkedIn"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline-light text-ink-dim transition-colors hover:border-ink-faint hover:text-ink"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d={LINKEDIN_PATH} />
          </svg>
        </a>
        <a
          href={xHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on X"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline-light text-ink-dim transition-colors hover:border-ink-faint hover:text-ink"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d={X_PATH} />
          </svg>
        </a>
        <button
          type="button"
          onClick={copyLink}
          aria-label="Copy link"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline-light text-ink-dim transition-colors hover:border-ink-faint hover:text-ink"
        >
          {copied ? <Check size={15} className="text-aurora-violet" /> : <Link2 size={15} />}
        </button>
      </div>
    </div>
  );
}
