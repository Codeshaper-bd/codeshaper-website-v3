/** Runs once when the website's server starts: enquiries left waiting before a restart are sent. */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs" && process.env.NEXT_PHASE !== "phase-production-build") {
    const { delivery } = await import("./lib/delivery");
    delivery().start();
  }
}
