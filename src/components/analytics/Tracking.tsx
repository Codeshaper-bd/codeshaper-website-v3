"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE } from "@/lib/siteSettings";

/**
 * Analytics and ad tags from CMS › Settings › Analytics and tracking
 * (owner, 25 Nov 2026): Google Analytics 4, Google Tag Manager, Meta Pixel,
 * LinkedIn Insight and Microsoft Clarity. The CMS stores IDs only (checked
 * there and again in the content sync); the code below writes each tag
 * itself, so nothing from the CMS runs as code.
 *
 * Consent: unless the CMS turns it off, nothing loads until the visitor
 * presses Accept on a small notice (EU/UK rules). The choice is kept in this
 * browser and can be changed from "Cookie settings" in the footer, which
 * dispatches `cs-cookie-settings`.
 */
const T = SITE.tracking ?? {};
const ANY = Boolean(T.ga4 || T.gtm || T.metaPixel || T.linkedin || T.clarity);
const ASK = T.consent !== false;
const KEY = "cs-consent";
export const COOKIE_SETTINGS_EVENT = "cs-cookie-settings";
/** true when the footer should offer "Cookie settings" */
export const HAS_COOKIE_CHOICE = ANY && ASK;

type Choice = "granted" | "denied" | null;
const js = (v: string) => JSON.stringify(v);

export default function Tracking() {
  const [choice, setChoice] = useState<Choice>(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!ANY) return;
    let saved: Choice = null;
    try {
      const v = localStorage.getItem(KEY);
      saved = v === "granted" || v === "denied" ? v : null;
    } catch {
      /* storage blocked: ask every visit */
    }
    setChoice(saved);
    setOpen(ASK && !saved);
    setReady(true);
    const reopen = () => setOpen(true);
    window.addEventListener(COOKIE_SETTINGS_EVENT, reopen);
    return () => window.removeEventListener(COOKIE_SETTINGS_EVENT, reopen);
  }, []);

  const decide = (v: "granted" | "denied") => {
    const was = choice;
    try {
      localStorage.setItem(KEY, v);
    } catch {
      /* storage blocked */
    }
    setChoice(v);
    setOpen(false);
    // tags that already ran can't be unloaded: a fresh page drops them
    if (was === "granted" && v === "denied") window.location.reload();
  };

  if (!ANY || !ready) return null;
  const load = !ASK || choice === "granted";

  return (
    <>
      {load && <Tags />}
      {ASK && open && (
        <div
          role="dialog"
          aria-label="Cookies"
          className="theme-light fixed inset-x-3 bottom-[88px] z-[70] rounded-2xl bg-white/95 p-4 font-urbanist shadow-[0_18px_40px_-18px_rgba(11,15,25,0.35)] ring-1 ring-[#0b0f19]/[0.06] backdrop-blur-md sm:inset-x-auto sm:bottom-4 sm:left-4 sm:w-[360px]"
        >
          <p className="text-[13px] leading-relaxed text-[#374151]">
            We use cookies to see how the site is used and to measure our ads. Nothing loads until you say yes.{" "}
            <Link href="/legal/privacy" className="font-semibold text-[#0b0f19] underline underline-offset-2">
              Privacy policy
            </Link>
          </p>
          <div className="mt-3 flex gap-2">
            <button type="button" onClick={() => decide("granted")} className="rounded-full bg-[#0b0f19] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#1f2433]">
              Accept
            </button>
            <button type="button" onClick={() => decide("denied")} className="rounded-full px-4 py-2 text-[13px] font-semibold text-[#0b0f19] ring-1 ring-[#0b0f19]/15 transition-colors hover:bg-[#0b0f19]/[0.04]">
              Decline
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/** The tags themselves, each only when its ID is set. */
function Tags() {
  const path = usePathname();
  const first = useRef(true);
  // Meta Pixel counts page views itself only on full loads; GA4 and Clarity follow client navigation on their own
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const w = window as unknown as { fbq?: (...a: unknown[]) => void };
    if (T.metaPixel) w.fbq?.("track", "PageView");
  }, [path]);

  return (
    <>
      {T.gtm && (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',${js(T.gtm)});`}
        </Script>
      )}
      {T.ga4 && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(T.ga4)}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config',${js(T.ga4)});`}
          </Script>
        </>
      )}
      {T.metaPixel && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init',${js(T.metaPixel)});fbq('track','PageView');`}
        </Script>
      )}
      {T.linkedin && (
        <Script id="linkedin-insight" strategy="afterInteractive">
          {`window._linkedin_partner_id=${js(T.linkedin)};window._linkedin_data_partner_ids=window._linkedin_data_partner_ids||[];window._linkedin_data_partner_ids.push(window._linkedin_partner_id);(function(l){if(!l){window.lintrk=function(a,b){window.lintrk.q.push([a,b])};window.lintrk.q=[]}var s=document.getElementsByTagName('script')[0];var b=document.createElement('script');b.type='text/javascript';b.async=true;b.src='https://snap.licdn.com/li.lms-analytics/insight.min.js';s.parentNode.insertBefore(b,s);})(window.lintrk);`}
        </Script>
      )}
      {T.clarity && (
        <Script id="clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,'clarity','script',${js(T.clarity)});`}
        </Script>
      )}
    </>
  );
}
