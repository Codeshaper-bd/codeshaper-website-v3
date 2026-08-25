import type { SVGProps } from "react";

/**
 * Hand-drawn landmark line icons for Locations — musemind.agency's
 * reference uses small per-city illustrations rather than generic pins;
 * this is this site's own take, simplified to a single-stroke silhouette
 * per country so it matches the rest of the icon system (lucide-style,
 * 24x24, `currentColor`) instead of importing a full icon pack.
 *
 * Deliberately generic/iconic rather than a specific named building where
 * a country has no one obvious landmark (e.g. Bangladesh, New Zealand) —
 * a recognizable silhouette, not a claim about a specific structure.
 */
type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** USA — Statue of Liberty */
export function StatueOfLibertyIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M18 3.2c.9.6 1.4 1.4 1.4 2.3 0 1.1-.8 2-1.4 2s-1.4-.9-1.4-2c0-.9.5-1.7 1.4-2.3Z" />
      <path d="M18 7.5v2.7M18 10.2l-2.6 2.6" />
      <path d="M9.7 6.3c0-1.4 1-2.6 2.3-2.6s2.3 1.2 2.3 2.6" />
      <path d="M8.7 4l.6 1.8M12 3v1.9M15.3 4l-.6 1.8" />
      <path d="M9 9.3c0-1.7 1.3-2.6 3-2.6s3 .9 3 2.6l1 8.7H8l1-8.7Z" />
      <path d="M6 21h12M7.2 19h9.6" />
    </svg>
  );
}

/** UK — clock tower (Big Ben) */
export function ClockTowerIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M8.5 21V11c0-2 1.6-3.6 3.5-3.6s3.5 1.6 3.5 3.6v10" />
      <path d="M8 21h8" />
      <circle cx="12" cy="9.6" r="1.9" />
      <path d="M12 8.7v.9l.6.6" />
      <path d="M9.3 7.4 12 3.4l2.7 4" />
      <path d="M12 3.4V2" />
    </svg>
  );
}

/** Bangladesh — mosque silhouette (dome + twin minarets) */
export function MosqueIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5.2 21v-7.3c0-3.7 3-6.7 6.8-6.7s6.8 3 6.8 6.7V21" />
      <path d="M4 21h16" />
      <path d="M12 6.6V3.4" />
      <path d="M11 3.4h2" />
      <path d="M4 21v-5.6c0-1 .8-1.8 1.8-1.8s1.8.8 1.8 1.8V21" />
      <path d="M16.4 21v-5.6c0-1 .8-1.8 1.8-1.8s1.8.8 1.8 1.8V21" />
    </svg>
  );
}

/** Japan — five-tier pagoda */
export function PagodaIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 2.2v1.4" />
      <path d="M9.6 5 12 3.6 14.4 5" />
      <path d="M9 7.6h6" />
      <path d="M8.3 7.6 12 5.4l3.7 2.2" />
      <path d="M8.6 10.6h6.8" />
      <path d="M7.7 10.6 12 8l4.3 2.6" />
      <path d="M7 14h10" />
      <path d="M6 14l6-3 6 3" />
      <path d="M9.4 21V14M14.6 21V14" />
      <path d="M9 21h6" />
    </svg>
  );
}

/** Australia — Sydney Opera House sails */
export function OperaHouseIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 21c0-4.4 1.7-8.6 3.6-8.6" />
      <path d="M7.8 21c0-6 2.7-11.6 4.4-11.6" />
      <path d="M12.6 21c0-5.3 2.2-10 3.6-10" />
      <path d="M16.6 21c0-3.7 1.3-6.8 2.6-6.8" />
      <path d="M3 21h18" />
    </svg>
  );
}

/** New Zealand — silver fern */
export function FernIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 21V4.4" />
      <path d="M12 5.4 8.6 3.6M12 5.4l3.4-1.8" />
      <path d="M12 8.6 7.7 6.7M12 8.6l4.3-1.9" />
      <path d="M12 11.8 7 10.2M12 11.8l5-1.6" />
      <path d="M12 15 7.5 13.9M12 15l4.5 1.1" />
      <path d="M12 18.2 8.4 17.5M12 18.2l3.6.7" />
    </svg>
  );
}
