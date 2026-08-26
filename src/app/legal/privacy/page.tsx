import type { Metadata } from "next";
import SiteShell from "@/components/system/SiteShell";
import LegalDoc from "@/components/system/LegalDoc";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How CodeShaper collects, uses, and protects information from visitors and clients.",
  alternates: { canonical: "/legal/privacy" },
  robots: { index: false, follow: true },
};

export default function PrivacyPolicyPage() {
  return (
    <SiteShell>
      <LegalDoc
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Legal" }, { label: "Privacy Policy" }]}
        title="Privacy Policy"
      >
        <section>
          <h2>1. Who this applies to</h2>
          <p>
            This policy covers information collected through {SITE_NAME}&apos;s website and through the course of a
            client engagement (project inquiries, contracts, and communication). It applies to visitors, prospective
            clients, and active clients.
          </p>
        </section>

        <section>
          <h2>2. Information we collect</h2>
          <ul>
            <li>Contact details you submit through the contact form (name, email, company, project details).</li>
            <li>Standard technical data collected by any web server (IP address, browser type, pages visited).</li>
            <li>Information shared during a project engagement (briefs, credentials, and assets you provide us).</li>
          </ul>
        </section>

        <section>
          <h2>3. How we use it</h2>
          <ul>
            <li>To respond to project inquiries and scope proposed work.</li>
            <li>To deliver, support, and invoice active engagements.</li>
            <li>To maintain and improve the website itself.</li>
          </ul>
          <p className="mt-2">We do not sell visitor or client data to third parties.</p>
        </section>

        <section>
          <h2>4. Cookies and analytics</h2>
          <p>
            [TBD — list the specific analytics/cookie tools actually in use once one is chosen, e.g. a privacy-friendly
            analytics provider, and whether a cookie-consent banner is required for your target markets.]
          </p>
        </section>

        <section>
          <h2>5. Third-party services</h2>
          <p>
            Project delivery may involve third-party tools (hosting, payment processing, project management). [TBD —
            list the specific vendors once your stack for client operations is finalized.]
          </p>
        </section>

        <section>
          <h2>6. Data retention</h2>
          <p>
            We retain contact-form submissions and project records for as long as needed to respond to inquiries,
            deliver engagements, and meet [TBD — applicable financial/legal record-keeping requirements for your
            jurisdiction].
          </p>
        </section>

        <section>
          <h2>7. Your rights</h2>
          <p>
            You can request a copy of, correction to, or deletion of information we hold about you by contacting us
            (see below). [TBD — add specific regional rights language, e.g. GDPR/CCPA, if you serve those markets.]
          </p>
        </section>

        <section>
          <h2>8. Contact</h2>
          <p>Questions about this policy: [Email — TBD]. See also our <a href="/contact" className="text-ink underline underline-offset-2">contact page</a>.</p>
        </section>

        <section>
          <h2>9. Changes to this policy</h2>
          <p>We may update this policy as the business evolves. Material changes will update the date below.</p>
          <p className="mt-2 text-[13px] text-ink-faint">Last updated: [TBD — effective date once reviewed].</p>
        </section>
      </LegalDoc>
    </SiteShell>
  );
}
