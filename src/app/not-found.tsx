import type { Metadata } from "next";
import Link from "next/link";
import SiteShell from "@/components/system/SiteShell";
import { SectionDescription, SectionTitle } from "@/components/system/SectionHeading";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <SiteShell>
      <div className="theme-light bg-light-surface p-3 sm:p-4">
        <section className="flex min-h-[70svh] flex-col items-center justify-center rounded-[32px] bg-canvas px-6 py-32 text-center">
          <p className="font-urbanist text-sm font-semibold text-aurora-violet">404</p>
          <SectionTitle as="h1" size="lg">This page does not exist.</SectionTitle>
          <SectionDescription className="mt-4 max-w-md">It may have moved. These are good places to continue.</SectionDescription>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/" className="rounded-full bg-ink px-7 py-3.5 font-urbanist text-sm font-semibold text-canvas">Home</Link>
            <Link href="/services" className="rounded-full border border-hairline-light px-7 py-3.5 font-urbanist text-sm font-semibold text-ink">Services</Link>
            <Link href="/contact" className="rounded-full border border-hairline-light px-7 py-3.5 font-urbanist text-sm font-semibold text-ink">Contact</Link>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
