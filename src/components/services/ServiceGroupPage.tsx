import SiteShell from "@/components/system/SiteShell";
import { groupSections, servicePath, type ServiceGroup } from "@/data/services";
import {
  ServicesHero,
  ServicesSection,
  ServiceCardGrid,
  BookCallCta,
  JsonLd,
  breadcrumbJsonLd,
} from "./ServicePageParts";

/**
 * Group page template (/services/<group-slug>): hero with the group name
 * and focus line, a grid of the group's services, and a Book a Call CTA.
 * Groups with subgroups (Websites & Commerce) get one section per
 * subgroup. The flagship AI Agents & Automation group has its own richer
 * page (app/services/ai-agents-automation) built from the same parts.
 */
export default function ServiceGroupPage({ group }: { group: ServiceGroup }) {
  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: group.name, href: servicePath(group.slug) },
  ];

  return (
    <SiteShell>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />

      <div className="theme-light">
        <ServicesHero
          id="group-hero-heading"
          breadcrumbs={[crumbs[0], crumbs[1], { label: group.name }]}
          icon={group.icon}
          eyebrow="Services"
          title={group.name}
          intro={group.focus}
          primary={{ label: "Book a Call", href: "/contact" }}
          secondary={{ label: "See all services", href: "/services" }}
        />

        {groupSections(group).map((section, i) => {
          const id = `group-section-${i}-heading`;
          return (
            <ServicesSection
              key={id}
              id={id}
              first={i === 0}
              label={section.name ?? "What's included"}
              title={`${section.name ?? group.name} services`}
            >
              <ServiceCardGrid services={section.services} />
            </ServicesSection>
          );
        })}

        <BookCallCta
          title={`Ready to talk about ${group.name}?`}
          description="Tell us what you're building. We'll recommend the right services and engagement model, and the next steps."
        />
      </div>
    </SiteShell>
  );
}
