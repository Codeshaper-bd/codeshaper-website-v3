"use client";
import { homeCopy, type CopyOf } from "@/lib/homeCopy";
import { SectionEyebrow, SectionTitle } from "@/components/system/SectionHeading";
import PhotoCloud from "./PhotoCloud";
import styles from "./PhotoCloud.module.css";

/**
 * Homepage › life at CodeShaper: the team photo wall (PhotoCloud) under its
 * heading, nothing else (owner, 23 Nov 2026: the figures moved to "Our
 * journey", the country chips were dropped). The words come from the CMS
 * (Pages › Home › Team photos).
 */
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
      </PhotoCloud>
    </div>
  );
}
