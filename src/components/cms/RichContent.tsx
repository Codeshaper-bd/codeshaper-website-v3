import "@/app/content.css";

/**
 * Blocks designed in the CMS. The HTML is written by the CMS from a fixed list
 * of blocks (codeshaper-cms: app/Support/Doc.php); editors cannot put their own
 * HTML or scripts in it.
 */
export default function RichContent({ html, className = "", narrow = false }: { html?: string; className?: string; narrow?: boolean }) {
  if (!html) return null;
  return <div className={`pb ${narrow ? "pb-narrow" : ""} ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
}
