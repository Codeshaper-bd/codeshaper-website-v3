import { ArrowUpRight, CalendarClock, LifeBuoy, Mail, Phone } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import CopyButton from "./CopyButton";
import { contactChannels } from "@/lib/publishedContact";

/**
 * "Reach us directly" on the contact page (owner, 24 Nov 2026): every direct
 * way in, one card each, so a visitor who would rather not fill a form still
 * has a clear next step. Values come from CMS › Settings › Contact, else the
 * details published on codeshaper.net (same source as the footer).
 */
const digits = (v: string) => v.replace(/[^+\d]/g, "");

function WhatsApp(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.64-2.05-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35ZM12.04 21.5a9.4 9.4 0 0 1-4.8-1.31l-.34-.2-3.56.93.95-3.47-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.23-9.42 9.43-9.42 2.52 0 4.88.98 6.66 2.76a9.36 9.36 0 0 1 2.76 6.67c0 5.2-4.23 9.42-9.43 9.42Zm8.02-17.45A11.3 11.3 0 0 0 12.04.75C5.79.75.7 5.83.7 12.08c0 2 .52 3.95 1.52 5.67L.6 23.25l5.63-1.48a11.3 11.3 0 0 0 5.8 1.48c6.25 0 11.34-5.09 11.34-11.34 0-3.03-1.18-5.88-3.32-8.02Z" />
    </svg>
  );
}

type Channel = { icon: ComponentType<{ size?: number; className?: string }>; label: string; value: string; note: string; href: string; action: string; tone: string; copy?: boolean; external?: boolean; booking?: boolean };

export default function ContactChannels() {
  const c = contactChannels();
  const channels: Channel[] = [
    { icon: Mail, label: "Projects & partnerships", value: c.email, note: "New projects, quotes and collaborations", href: `mailto:${c.email}`, action: "Send an email", tone: "bg-[#4f46e5]/10 text-[#4f46e5]", copy: true },
    { icon: LifeBuoy, label: "Support", value: c.support, note: "Help with something we built for you", href: `mailto:${c.support}`, action: "Email support", tone: "bg-[#0369a1]/10 text-[#0369a1]", copy: true },
    { icon: ({ size, className }) => <WhatsApp width={size} height={size} className={className} />, label: "WhatsApp", value: c.whatsapp, note: "Quick questions and quick replies", href: `https://wa.me/${digits(c.whatsapp).replace("+", "")}`, action: "Start a chat", tone: "bg-[#25d366]/12 text-[#128c4a]", external: true },
    { icon: Phone, label: "Phone", value: c.phone, note: "Our Dhaka office line", href: `tel:${digits(c.phone)}`, action: "Call us", tone: "bg-[#b45309]/10 text-[#b45309]", copy: true },
  ];

  return (
    <section aria-labelledby="channels-heading" className="theme-light bg-light-surface py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-3 flex w-fit items-center gap-2.5 font-urbanist text-[11px] font-medium uppercase tracking-[0.28em] text-ink-dim">
              <span className="h-1.5 w-1.5 rounded-full bg-aurora-amber" />
              Reach us directly
            </p>
            <h2 id="channels-heading" className="max-w-xl font-urbanist text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
              Rather talk to a person? Pick the way that suits you.
            </h2>
          </div>
          <a
            href="/contact"
            data-booking
            className="group inline-flex items-center gap-2 rounded-full bg-[#0b0f19] py-3 pl-5 pr-4 font-urbanist text-[14px] font-semibold text-white transition-colors hover:bg-[#1f2433]"
          >
            <CalendarClock size={16} aria-hidden />
            Book a free 30-minute call
          </a>
        </div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {channels.map((ch) => (
            <li key={ch.label} className="group relative flex flex-col rounded-[24px] border border-[#0b0f19]/[0.07] bg-white p-6 shadow-[0_1px_2px_rgba(11,15,25,0.04)] transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_48px_-28px_rgba(11,15,25,0.3)]">
              <span className={`grid h-11 w-11 place-items-center rounded-[14px] ${ch.tone}`}>
                <ch.icon size={20} />
              </span>
              <p className="mt-5 font-urbanist text-[12.5px] font-semibold uppercase tracking-[0.12em] text-ink-faint">{ch.label}</p>
              <p className="mt-1.5 break-all font-urbanist text-[17px] font-bold text-ink">{ch.value}</p>
              <p className="mt-1.5 font-urbanist text-[13.5px] leading-snug text-ink-dim">{ch.note}</p>
              <div className="mt-auto flex items-center justify-between gap-2 pt-6">
                {/* the whole card's main action */}
                <a
                  href={ch.href}
                  target={ch.external ? "_blank" : undefined}
                  rel={ch.external ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center gap-1.5 font-urbanist text-[14px] font-semibold text-ink after:absolute after:inset-0 after:rounded-[24px] after:content-['']"
                >
                  {ch.action}
                  <ArrowUpRight size={15} aria-hidden className="transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
                </a>
                {ch.copy && <CopyButton value={ch.value} label={`Copy ${ch.label.toLowerCase()}`} />}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
