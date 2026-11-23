/** Stripe-style "expand" mark: two corner brackets that spread apart when the parent `group/card` is hovered. */
export default function ExpandIcon({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9.5 3.5h3v3" className="transition-transform duration-300 ease-out group-hover/card:translate-x-[1.5px] group-hover/card:-translate-y-[1.5px]" />
      <path d="M6.5 12.5h-3v-3" className="transition-transform duration-300 ease-out group-hover/card:-translate-x-[1.5px] group-hover/card:translate-y-[1.5px]" />
    </svg>
  );
}
