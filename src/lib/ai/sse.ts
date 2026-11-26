/** Reads server-sent events from a byte stream: `event:` and one or more `data:` lines, ended by a blank line. No imports. */
export type ServerEvent = { event: string; data: string };

export const SSE_EVENT_MAX = 256_000;

/** Yields each complete event. Throws when one grows past the limit; a half event at the end is dropped. */
export async function* readEvents(reader: ReadableStreamDefaultReader<Uint8Array>): AsyncGenerator<ServerEvent> {
  const decoder = new TextDecoder();
  let buffer = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) return;
    buffer += decoder.decode(value, { stream: true });
    for (let end = buffer.indexOf("\n\n"); end >= 0; end = buffer.indexOf("\n\n")) {
      const lines = buffer.slice(0, end).split("\n");
      buffer = buffer.slice(end + 2);
      const event = lines.find((l) => l.startsWith("event: "))?.slice(7) ?? "";
      const data = lines.filter((l) => l.startsWith("data: ")).map((l) => l.slice(6)).join("\n");
      if (event || data) yield { event, data };
    }
    if (buffer.length > SSE_EVENT_MAX) throw new Error("event too large");
  }
}
