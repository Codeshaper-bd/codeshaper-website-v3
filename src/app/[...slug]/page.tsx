import Link from "next/link";

/**
 * Catch-all stub so every nav/footer link resolves during development.
 * Replace with real service/industry/company pages as they're built.
 */
export default async function StubPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const title = slug[slug.length - 1]
    ?.split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-canvas px-6 text-center">
      <p className="mb-3 font-body text-sm uppercase tracking-[0.25em] text-ink-faint">
        Page stub
      </p>
      <h1 className="font-display text-4xl font-medium tracking-tight text-ink">{title}</h1>
      <p className="mt-4 max-w-md font-body text-ink-dim">
        This page is scaffolded but not built yet — part of the homepage-first pass.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full border border-hairline-strong px-6 py-3 font-display text-sm text-ink transition-colors hover:border-ink/60"
      >
        ← Back to home
      </Link>
    </main>
  );
}
