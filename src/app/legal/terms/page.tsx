import type { Metadata } from "next";
import SiteShell from "@/components/system/SiteShell";
import LegalDoc from "@/components/system/LegalDoc";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern use of CodeShaper's website and client engagements.",
  alternates: { canonical: "/legal/terms" },
  robots: { index: false, follow: true },
};

export default function TermsOfServicePage() {
  return (
    <SiteShell>
      <LegalDoc
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Legal" }, { label: "Terms of Service" }]}
        title="Terms of Service"
      >
        <section>
          <h2>1. Acceptance of terms</h2>
          <p>
            By using this website or engaging {SITE_NAME} ([TBD — legal entity name]) for services, you agree to
            these terms. Specific project terms are governed by the signed proposal or contract for that
            engagement, which takes precedence over this general page where the two differ.
          </p>
        </section>

        <section>
          <h2>2. Services described</h2>
          <p>
            {SITE_NAME} provides product design, software engineering, commerce, and AI/automation services as
            described on this site. The exact scope, timeline, and deliverables for any engagement are defined in
            that engagement&apos;s own proposal or statement of work, not by this page.
          </p>
        </section>

        <section>
          <h2>3. Intellectual property</h2>
          <ul>
            <li>Unless otherwise agreed in writing, ownership of custom deliverables transfers to the client upon final payment.</li>
            <li>{SITE_NAME} retains the right to reuse general methods, non-client-specific components, and know-how developed during an engagement.</li>
            <li>Third-party assets (fonts, stock media, licensed libraries) remain subject to their own licenses.</li>
          </ul>
        </section>

        <section>
          <h2>4. Client responsibilities</h2>
          <p>
            Clients are responsible for providing timely feedback, necessary access/credentials, and any content or
            assets required for a project to proceed on schedule. Delays caused by missing client input may shift
            delivery timelines.
          </p>
        </section>

        <section>
          <h2>5. Payment terms</h2>
          <p>
            [TBD — describe your actual payment structure: deposit/milestone/net-terms, currency, late-payment
            policy. This varies by engagement model and shouldn&apos;t be asserted generically here.]
          </p>
        </section>

        <section>
          <h2>6. Limitation of liability</h2>
          <p>
            [TBD — this section defines a liability cap and carve-outs and should be drafted with counsel rather
            than templated; do not treat the current text as a real limitation of liability.]
          </p>
        </section>

        <section>
          <h2>7. Termination</h2>
          <p>
            Either party may terminate an active engagement per the terms of that engagement&apos;s own contract.
            Work completed and accepted up to the termination date remains payable.
          </p>
        </section>

        <section>
          <h2>8. Governing law</h2>
          <p>These terms are governed by the laws of [TBD — governing-law jurisdiction], without regard to conflict-of-law principles.</p>
        </section>

        <section>
          <h2>9. Changes to these terms</h2>
          <p>We may update these terms as the business evolves. Material changes will update the date below.</p>
          <p className="mt-2 text-[13px] text-ink-faint">Last updated: [TBD — effective date once reviewed].</p>
        </section>

        <section>
          <h2>10. Contact</h2>
          <p>Questions about these terms: [Email — TBD]. See also our <a href="/contact" className="text-ink underline underline-offset-2">contact page</a>.</p>
        </section>
      </LegalDoc>
    </SiteShell>
  );
}
