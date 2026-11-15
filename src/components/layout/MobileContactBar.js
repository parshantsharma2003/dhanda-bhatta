"use client";

import { Phone, MessageSquare, Navigation } from "lucide-react";
import { siteConfig } from "@/config/site";
import { analyticsEvents } from "@/lib/analytics";

/**
 * Mobile Contact Bar & Desktop Floating Actions
 * Mobile: Fixed bottom bar with Call, WhatsApp, Directions.
 * - Height: 66px + safe-area-inset-bottom
 * - Icons: 21px (within 20–22px guideline)
 * - Text: 12.5px (within 12–13px guideline)
 * - Equal widths (3 columns) with >44px touch targets
 * - Guaranteed zero overlap with document pb-[calc(4.75rem+env(safe-area-inset-bottom,0px))]
 */
export default function MobileContactBar() {
  const whatsappUrl = `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(
    "Hello Dhanda Bhatta Company, I would like to enquire about brick availability and delivery."
  )}`;

  return (
    <>
      {/* 1. Mobile Fixed Bottom Contact Bar (< 1024px) */}
      <aside
        className="fixed bottom-0 inset-x-0 z-30 lg:hidden bg-white/98 backdrop-blur-md border-t border-border-strong shadow-[0_-4px_16px_rgba(37,35,33,0.08)] pb-[env(safe-area-inset-bottom,0px)] box-content"
        aria-label="Quick Contact Bar"
      >
        <div className="grid grid-cols-3 divide-x divide-border-subtle w-full max-w-md mx-auto h-[66px]">
          {/* Action 1: Call */}
          <a
            href={`tel:${siteConfig.contact.primaryPhone}`}
            onClick={() => analyticsEvents.phoneClick("mobile_bottom_bar")}
            className="flex flex-col items-center justify-center h-full px-1 text-charcoal hover:bg-warm-bg active:bg-[#963D32]/10 transition-colors focus-visible:outline-2 focus-visible:outline-terracotta select-none"
            aria-label={`Call Dhanda Bhatta Company at ${siteConfig.contact.primaryPhoneDisplay}`}
          >
            <Phone className="w-[21px] h-[21px] text-terracotta mb-1" strokeWidth={2} />
            <span className="text-[12.5px] font-heading font-semibold tracking-tight text-charcoal">Call</span>
          </a>

          {/* Action 2: WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => analyticsEvents.whatsappClick("mobile_bottom_bar")}
            className="flex flex-col items-center justify-center h-full px-1 text-charcoal hover:bg-warm-bg active:bg-[#2E7D32]/10 transition-colors focus-visible:outline-2 focus-visible:outline-terracotta select-none"
            aria-label="Chat with Dhanda Bhatta Company on WhatsApp"
          >
            <MessageSquare className="w-[21px] h-[21px] text-[#2E7D32] mb-1" strokeWidth={2} />
            <span className="text-[12.5px] font-heading font-semibold tracking-tight text-charcoal">WhatsApp</span>
          </a>

          {/* Action 3: Directions */}
          <a
            href={siteConfig.location.directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => analyticsEvents.directionsClick()}
            className="flex flex-col items-center justify-center h-full px-1 text-charcoal hover:bg-warm-bg active:bg-sandstone/15 transition-colors focus-visible:outline-2 focus-visible:outline-terracotta select-none"
            aria-label="Get driving directions to Village Kalwa, Pillukhera"
          >
            <Navigation className="w-[21px] h-[21px] text-terracotta mb-1" strokeWidth={2} />
            <span className="text-[12.5px] font-heading font-semibold tracking-tight text-charcoal">Directions</span>
          </a>
        </div>
      </aside>

      {/* 2. Desktop Compact Floating Contact Dock (>= 1024px) */}
      <aside
        className="hidden lg:flex fixed bottom-6 right-6 z-40 bg-white/95 backdrop-blur-md border border-border-strong shadow-lg p-1.5 items-center gap-1.5"
        aria-label="Desktop Quick Contacts"
      >
        <span className="text-[10px] font-heading uppercase tracking-widest text-secondary-text font-bold px-2 py-1 select-none">
          Contact Kiln
        </span>

        {/* Desktop Call */}
        <a
          href={`tel:${siteConfig.contact.primaryPhone}`}
          onClick={() => analyticsEvents.phoneClick("desktop_dock")}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-warm-bg hover:bg-terracotta hover:text-white text-charcoal text-xs font-heading font-semibold transition-colors border border-border-subtle"
          title={`Call ${siteConfig.contact.primaryPhoneDisplay}`}
        >
          <Phone className="w-3.5 h-3.5 text-terracotta group-hover:text-white" />
          <span>Call</span>
        </a>

        {/* Desktop WhatsApp */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => analyticsEvents.whatsappClick("desktop_dock")}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-warm-bg hover:bg-[#2E7D32] hover:text-white text-charcoal text-xs font-heading font-semibold transition-colors border border-border-subtle"
          title="Chat on WhatsApp"
        >
          <MessageSquare className="w-3.5 h-3.5 text-[#2E7D32]" />
          <span>WhatsApp</span>
        </a>

        {/* Desktop Directions */}
        <a
          href={siteConfig.location.directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => analyticsEvents.directionsClick()}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-warm-bg hover:bg-sandstone hover:text-white text-charcoal text-xs font-heading font-semibold transition-colors border border-border-subtle"
          title="Get Directions on Google Maps"
        >
          <Navigation className="w-3.5 h-3.5 text-terracotta group-hover:text-white" />
          <span>Directions</span>
        </a>
      </aside>
    </>
  );
}
