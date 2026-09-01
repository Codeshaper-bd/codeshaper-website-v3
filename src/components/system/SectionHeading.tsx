import { forwardRef, type ReactNode } from "react";

/**
 * Canonical section-header typography — extracted after the audit found
 * nine sections each hand-rolling the same eyebrow/heading/description
 * with slightly different arbitrary sizes (text-[11px] vs text-sm,
 * tracking-[0.28em] vs [0.25em], text-[13.5px] vs [14px] vs [15px]...).
 * These three primitives are the single source of truth for that shared
 * typography; layout (max-width, margins, flex placement) stays local to
 * each section since that genuinely varies by composition.
 */
export function SectionEyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p
      // `flex` (block-level), not `inline-flex` — every centered usage
      // sitewide passes `mx-auto w-fit` expecting margin-auto centering,
      // but auto margins only center block-level boxes per spec; on an
      // inline-level box (inline-flex) they're a no-op. That silently left
      // ~16 "centered" eyebrows sitting flush left instead, one row above
      // a genuinely centered heading. `flex` + `w-fit` still shrinks to
      // content width, so left-aligned usages (the majority, with no
      // override) render pixel-identical to before — flex-start is the
      // default justify-content either way.
      className={`mb-3 flex w-fit items-center gap-2.5 font-urbanist text-[11px] font-medium uppercase tracking-[0.28em] text-ink-dim ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-aurora-amber" />
      {children}
    </p>
  );
}

export const SectionTitle = forwardRef<
  HTMLHeadingElement,
  { children: ReactNode; id?: string; size?: "md" | "lg"; className?: string; as?: "h1" | "h2" }
>(function SectionTitle({ children, id, size = "md", className = "", as: Tag = "h2" }, ref) {
  const sizeCls = size === "lg" ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl";
  return (
    <Tag
      ref={ref}
      id={id}
      className={`font-urbanist font-bold leading-tight tracking-tight text-ink ${sizeCls} ${className}`}
    >
      {children}
    </Tag>
  );
});

export function SectionDescription({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`font-urbanist text-[15px] leading-relaxed text-ink-dim ${className}`}>{children}</p>;
}
