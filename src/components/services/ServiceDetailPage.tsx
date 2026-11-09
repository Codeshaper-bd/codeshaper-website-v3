import SiteShell from "@/components/system/SiteShell";
import Reveal from "@/components/system/Reveal";
import { getGroup, relatedServices, servicePath, type Service } from "@/data/services";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import {
  ServicesHero,
  ServicesSection,
  ServiceCardGrid,
  BookCallCta,
  JsonLd,
  breadcrumbJsonLd,
} from "./ServicePageParts";

/**
 * The one reusable template behind every /services/<service-slug> page.
 *
 * TODO(content): the five sections below render as placeholders until
 * per-service content exists. Each is marked with `data-todo` in the DOM
 * and a `TODO(content)` comment here. When content lands, add the
 * matching optional field to the Service type in src/data/services.ts and
 * render it in place of <PlaceholderBody />.
 */
const PLACEHOLDER_SECTIONS: { key: string; label: string; title: (s: Service) => string; todo: string }[] = [
  {
    key: "deliver",
    label: "What We Deliver",
    title: (s) => `What you get with ${s.menuLabel}.`,
    todo: "TODO(content): 4–6 concrete deliverables for this service.",
  },
  {
    key: "process",
    label: "How It Works",
    title: () => "How the engagement runs, step by step.",
    todo: "TODO(content): 4–5 process steps, including where human review, testing and monitoring happen.",
  },
  {
    key: "stack",
    label: "Tech Stack",
    title: () => "Tools and platforms we use.",
    todo: "TODO(content): tech stack grouped by category.",
  },
  {
    key: "case-studies",
    label: "Related Case Studies",
    title: () => "Proof in real builds.",
    todo: "TODO(content): link 1–3 case studies from lib/caseStudies.ts that used this service.",
  },
  {
    key: "faq",
    label: "FAQ",
    title: (s) => `${s.menuLabel} questions, answered.`,
    todo: "TODO(content): 4–6 FAQs; also emit FAQPage JSON-LD once real.",
  },
];

function PlaceholderBody({ todo }: { todo: string }) {
  return (
    <Reveal delay={80}>
      <div
        data-todo={todo}
        className="mt-8 rounded-2xl border border-dashed border-hairline-light bg-light-raised px-6 py-8 text-center font-urbanist text-[13.5px] text-ink-faint"
      >
        Detailed content for this section is coming soon.
      </div>
    </Reveal>
  );
}

export default function ServiceDetailPage({ service }: { service: Service }) {
  const group = getGroup(service.groupSlug)!;
  const path = servicePath(service.slug);
  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: group.name, href: servicePath(group.slug) },
    { label: service.menuLabel, href: path },
  ];

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    serviceType: service.title,
    description: service.metaDescription,
    category: group.name,
    url: `${SITE_URL}${path}`,
    provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };

  return (
    <SiteShell>
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={breadcrumbJsonLd(crumbs)} />

      <div className="theme-light">
        <ServicesHero
          id="service-hero-heading"
          breadcrumbs={[crumbs[0], crumbs[1], crumbs[2], { label: service.menuLabel }]}
          icon={service.icon}
          eyebrow={group.name}
          title={service.title}
          intro={service.summary}
          primary={{ label: "Book a Call", href: "/contact" }}
          secondary={{ label: `All ${group.name} services`, href: servicePath(group.slug) }}
        />

        {PLACEHOLDER_SECTIONS.map((section, i) => {
          const id = `service-${section.key}-heading`;
          return (
            <ServicesSection key={section.key} id={id} first={i === 0} label={section.label} title={section.title(service)}>
              {/* TODO(content): replace with real section content — see PLACEHOLDER_SECTIONS above */}
              <PlaceholderBody todo={section.todo} />
            </ServicesSection>
          );
        })}

        <ServicesSection id="service-related-heading" label="Related Services" title={`More in ${group.name}.`}>
          <ServiceCardGrid services={relatedServices(service)} />
        </ServicesSection>

        <BookCallCta
          title={`Talk to us about ${service.menuLabel}.`}
          description="Tell us what you're working on. We'll scope it with you, including where human review, testing and monitoring fit."
          secondary={{ label: `All ${group.name} services`, href: servicePath(group.slug) }}
        />
      </div>
    </SiteShell>
  );
}
