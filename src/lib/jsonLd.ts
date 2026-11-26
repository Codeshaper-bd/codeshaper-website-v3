/**
 * Structured data inside a <script> tag. JSON.stringify alone leaves "<" as it is, so text from the
 * CMS containing "</script>" would end the block and run whatever follows. Escaped like this the JSON
 * means exactly the same to search engines.
 */
const ESCAPES: Record<string, string> = { "<": "\\u003c", ">": "\\u003e", "&": "\\u0026", "\u2028": "\\u2028", "\u2029": "\\u2029" };

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/[<>&\u2028\u2029]/g, (c) => ESCAPES[c]);
}
