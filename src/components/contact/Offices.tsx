import Image from "next/image";
import OfficeRow, { type OfficeRowData } from "./OfficeRow";
import { OFFICE_LIST, mapsEmbed, mapsLink, withStandIn } from "@/lib/offices";

/**
 * "Where we work" on the contact page (owner, 24 Nov 2026: white, lighter, a
 * better image). Left: the heading and a real photo of the team at work in the
 * Dhaka studio, held in view while the list scrolls. Right: all six offices as
 * quiet rows (address, phone, live local time, map on demand, Google Maps).
 * TEMP: the four without an address yet use Dhaka's (see lib/offices.ts).
 */
export default function Offices() {
  const rows: OfficeRowData[] = OFFICE_LIST.map(withStandIn).map((o) => ({
    key: o.key,
    role: o.title.split(" · ")[0],
    name: o.city.length <= 3 ? o.country : o.city,
    place: o.city.length <= 3 || o.city === o.country ? undefined : o.country,
    address: (o.lines ?? []).map((l) => l.replace(/,$/, "")).join(", "),
    tel: o.tel,
    zone: o.zone,
    embed: mapsEmbed(o),
    link: mapsLink(o),
  }));

  return (
    // the homepage pattern: a framed white section with rounded corners and space on both sides
    <div className="theme-light bg-page p-frame sm:p-frame-lg">
    <section aria-labelledby="offices-heading" className="rounded-section bg-white py-16 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20 lg:px-10">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="mb-3 flex w-fit items-center gap-2.5 font-urbanist text-[11px] font-medium uppercase tracking-[0.28em] text-ink-dim">
            <span className="h-1.5 w-1.5 rounded-full bg-aurora-amber" />
            Where we work
          </p>
          <h2 id="offices-heading" className="font-urbanist text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
            Six offices, one team.
          </h2>
          <p className="mt-4 max-w-md font-urbanist text-[16px] leading-relaxed text-ink-dim">
            Our engineers work together from the Dhaka studio. The other offices keep us close to clients, in their own time zones.
          </p>
          {/* a real photo of the team at work in the Dhaka studio */}
          <figure className="mt-8">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-[#e6e5ea]">
              <Image src="/media/studio/studio-lunch.webp" alt="The CodeShaper team at work in the Dhaka studio" fill sizes="(min-width: 1024px) 440px, 100vw" className="object-cover object-[50%_45%]" />
            </div>
            <figcaption className="mt-3 font-urbanist text-[13px] text-ink-faint">A working day at our Dhaka studio</figcaption>
          </figure>
        </div>

        <ul>
          {rows.map((o) => (
            <OfficeRow key={o.key} o={o} />
          ))}
        </ul>
      </div>
    </section>
    </div>
  );
}
