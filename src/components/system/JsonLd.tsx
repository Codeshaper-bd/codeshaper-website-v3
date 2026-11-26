import { serializeJsonLd } from "@/lib/jsonLd";

/** The only way to put JSON-LD on a page (tests/jsonLd.test.mjs checks that). */
export default function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />;
}
