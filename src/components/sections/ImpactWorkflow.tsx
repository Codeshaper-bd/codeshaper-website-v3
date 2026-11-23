"use client";
import { homeCopy, type CopyOf } from "@/lib/homeCopy";
import { SectionEyebrow, SectionTitle } from "@/components/system/SectionHeading";
import PhotoCloud from "./PhotoCloud";
import styles from "./PhotoCloud.module.css";

/**
 * Homepage › life at CodeShaper: the team photo wall (PhotoCloud) under a
 * heading and the places the team works from. The company figures moved to
 * "At a glance" near the top (owner's plan, 23 Nov 2026), so this section is
 * about the people only. Hubs as stated across the site (delivery hub in
 * Bangladesh; collaboration hubs in the US, UK, Japan, Australia and New
 * Zealand). The words come from the CMS (Pages › Home › Team photos).
 */
const HUBS = ["United States", "United Kingdom", "Japan", "Australia", "New Zealand"];

export default function ImpactWorkflow({ copy }: { copy?: CopyOf<"impactWorkflow"> }) {
  const c = homeCopy("impactWorkflow", copy);
  return (
    <div className="bg-light-surface p-3 sm:p-4">
      <PhotoCloud>
        <div className={styles.heading}>
          <SectionEyebrow className="mx-auto">{c.eyebrow}</SectionEyebrow>
          <SectionTitle id="impact-heading" className="mx-auto max-w-[22ch] text-balance">
            {c.title}
          </SectionTitle>
        </div>
        <div className={`${styles.stats} flex items-start justify-center`}>
          <ul className="flex max-w-5xl flex-wrap items-center justify-center gap-2 font-urbanist text-[12.5px] sm:text-[13px]">
            <li className="inline-flex items-center gap-2 rounded-full bg-[#0b0f19] px-3.5 py-1.5 font-semibold text-white">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#a5b4fc]" />
              Delivery hub · Dhaka, Bangladesh
            </li>
            {HUBS.map((h) => (
              <li key={h} className="rounded-full border border-[#0b0f19]/[0.08] bg-white/80 px-3.5 py-1.5 font-medium text-ink backdrop-blur-sm">
                {h}
              </li>
            ))}
          </ul>
        </div>
      </PhotoCloud>
    </div>
  );
}
