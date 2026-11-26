/** The page an enquiry came from, without anything personal: only campaign tags survive from the query. */
const KEEP = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

export function cleanPageUrl(value: string | null | undefined): string {
  let url: URL;
  try {
    url = new URL(value ?? "");
  } catch {
    return "";
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return "";
  const query = new URLSearchParams();
  for (const key of KEEP) {
    const v = url.searchParams.get(key);
    if (v) query.set(key, v);
  }
  const q = query.toString();
  return `${url.origin}${url.pathname}${q ? `?${q}` : ""}`.slice(0, 500);
}
