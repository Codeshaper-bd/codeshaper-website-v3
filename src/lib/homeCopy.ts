import DEFAULTS from "./home-defaults.json";

/**
 * The homepage's words. The CMS (Pages, Home) sends changes; anything it
 * leaves empty keeps the original text from home-defaults.json.
 */
export type HomeCopy = typeof DEFAULTS;
export type CopyKey = keyof HomeCopy;
export type CopyOf<K extends CopyKey> = Partial<HomeCopy[K]>;

const filled = (v: unknown) => (Array.isArray(v) ? v.length > 0 : typeof v === "string" ? v.trim() !== "" : v != null);

export function homeCopy<K extends CopyKey>(key: K, over?: CopyOf<K>): HomeCopy[K] {
  const out = { ...DEFAULTS[key] } as Record<string, unknown>;
  for (const [k, v] of Object.entries(over ?? {})) if (k in out && filled(v)) out[k] = v;
  return out as HomeCopy[K];
}
