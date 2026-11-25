import type { ReactNode } from "react";
import SmoothScroll from "@/components/system/SmoothScroll";
import Navbar from "@/components/nav/Navbar";
import Footer from "@/components/sections/Footer";
import Newsletter from "@/components/sections/footer/Newsletter";
import Reveal from "@/components/system/Reveal";
import LazyHydrate from "@/components/system/LazyHydrate";
import BookingProvider from "@/components/booking/BookingProvider";
import { bothFounders, CALL_MINUTES } from "@/lib/founders";
import { SITE } from "@/lib/siteSettings";
import { contactChannels } from "@/lib/publishedContact";
import Tracking from "@/components/analytics/Tracking";

/**
 * Shared page frame — Lenis smooth scroll, Navbar, Newsletter + Footer.
 * Extracted from the homepage (which used to inline all of this) so any
 * new real page (Contact, Services, Industries, ...) gets the exact same
 * shell without re-copying it. Footer stays a quiet zone: simple
 * fade-in, no cursor effects, same as it always was on the homepage.
 */
export default function SiteShell({ children }: { children: ReactNode }) {
  return (
    <SmoothScroll>
      <Navbar />
      <main>{children}</main>
      {/* newsletter + footer are far below: hydrated on approach (LazyHydrate); the footer's gradient rises out of the newsletter */}
      <LazyHydrate>
        <Newsletter />
        <Reveal distance={0}>
          <Footer />
        </Reveal>
      </LazyHydrate>
      {/* every "Book a call" opens the booking window (CMS › Settings › Contact › Booking calendar) */}
      <BookingProvider calLink={SITE.contact?.booking} founders={bothFounders()} minutes={CALL_MINUTES} channels={contactChannels()} />
      {/* analytics and ad tags behind the cookie notice (CMS › Settings › Analytics and tracking). Here, not in the root
          layout: a client component beside the root layout's children broke hydration in production builds. */}
      <Tracking />
      {/* room for the fixed mobile tab bar (MobileTabBar) below the footer */}
      <div aria-hidden className="h-[calc(61px+env(safe-area-inset-bottom))] bg-light-surface lg:hidden" />
    </SmoothScroll>
  );
}
