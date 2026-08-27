import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/system/Reveal";
import { Icon } from "@/lib/icons";
import { ENGAGEMENT_MODELS } from "@/lib/navigation";
import { SectionEyebrow, SectionTitle, SectionDescription } from "@/components/system/SectionHeading";

export default function DeliveryModelsStrip() {
  return (
    <div className="bg-light-surface p-3 sm:p-4">
      <section className="theme-light relative overflow-hidden rounded-[32px] bg-canvas py-14 lg:py-20" aria-labelledby="models-heading">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <SectionEyebrow>How we work</SectionEyebrow>
                <SectionTitle id="models-heading">Delivered through proven working models</SectionTitle>
                <SectionDescription className="mt-3 max-w-md">
                  Every case study above is tied to one of these delivery systems — choose how you want to work.
                </SectionDescription>
              </div>
              <Link
                href="/engagement"
                className="inline-flex w-fit items-center gap-2 rounded-full bg-aurora-violet px-6 py-3 font-urbanist text-sm font-semibold text-white transition-[background-color,transform] duration-300 hover:scale-[1.02] hover:bg-aurora-violet-dark"
              >
                Explore How We Work
                <ArrowRight size={15} strokeWidth={1.75} />
              </Link>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {ENGAGEMENT_MODELS.map((m, i) => (
              <Reveal key={m.href} delay={i * 60}>
                <Link
                  href={m.href}
                  className="group flex h-full flex-col rounded-2xl border border-hairline-light bg-light-raised p-5 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-aurora-violet/30 hover:shadow-[0_16px_36px_rgba(11,15,25,0.08)]"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-hairline-light text-aurora-indigo transition-colors duration-300 group-hover:text-aurora-violet">
                    <Icon name={m.icon} size={17} />
                  </span>
                  <h3 className="mt-4 font-urbanist text-[15px] font-bold text-ink">{m.label}</h3>
                  <p className="mt-1.5 flex-1 font-urbanist text-[12.5px] leading-relaxed text-ink-dim">{m.desc}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
