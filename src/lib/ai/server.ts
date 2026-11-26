import "server-only";
import { createGateway } from "./gateway";

/** One gateway per server process, so its limits are shared by every /api/ai route. */
const globalStore = globalThis as typeof globalThis & { csAiGateway?: ReturnType<typeof createGateway> };

export const aiGateway = () => (globalStore.csAiGateway ??= createGateway());
