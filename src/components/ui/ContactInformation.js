import { MapPin, Phone, MessageSquare, Clock, Navigation, Mail } from "lucide-react";
import Button from "./Button";
import Card from "./Card";
import Badge from "./Badge";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Reusable ContactInformation Component
 * Verified contact channels, physical kiln address, and dispatch hours.
 */
export default function ContactInformation({ className = "" }) {
  const whatsappUrl = `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(
    "Hello Dhanda Bhatta Company, I would like to enquire about brick availability and delivery."
  )}`;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Primary Contact Channels Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Phone Contact */}
        <Card surface="white" className="space-y-3 p-5 sm:p-6 shadow-2xs">
          <div className="w-10 h-10 bg-terracotta-tint border border-terracotta/20 flex items-center justify-center text-terracotta">
            <Phone className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-base text-charcoal">
            Phone Inquiries
          </h3>
          <p className="text-xs text-secondary-text">
            Call our dispatch desk for live batch availability and quotes:
          </p>
          <div className="pt-2">
            <a
              href={`tel:${siteConfig.contact.primaryPhone}`}
              className="text-base font-heading font-bold text-terracotta hover:underline block"
            >
              {siteConfig.contact.primaryPhoneDisplay}
            </a>
            <span className="text-[11px] text-secondary-text block mt-0.5">
              Direct Kiln Dispatch Line
            </span>
          </div>
        </Card>

        {/* WhatsApp Channel */}
        <Card surface="white" className="space-y-3 p-5 sm:p-6 shadow-2xs">
          <div className="w-10 h-10 bg-[#E8F5E9] border border-[#2E7D32]/20 flex items-center justify-center text-[#2E7D32]">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-base text-charcoal">
            WhatsApp Inquiries
          </h3>
          <p className="text-xs text-secondary-text">
            Send your site location or required quantity directly:
          </p>
          <div className="pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-heading font-bold text-[#2E7D32] hover:underline block"
            >
              Chat on WhatsApp ({siteConfig.contact.whatsappDisplay})
            </a>
            <span className="text-[11px] text-secondary-text block mt-0.5">
              Fast Location &amp; Quotation Response
            </span>
          </div>
        </Card>
      </div>

      {/* Business Location & Driving Directions */}
      <Card surface="white" className="space-y-5 p-6 sm:p-8 border border-border-subtle shadow-2xs">
        <div className="border-b border-border-subtle pb-4">
          <span className="text-[10px] font-heading uppercase tracking-wider font-semibold text-terracotta bg-white px-2.5 py-0.5 border border-border-subtle">
            Manufacturing Facility
          </span>
          <h3 className="font-heading font-bold text-xl text-charcoal mt-2">
            {siteConfig.name}
          </h3>
          <p className="text-xs text-secondary-text mt-0.5">
            Village Kalwa, Tehsil Pillukhera, District Jind, Haryana - 126113
          </p>
        </div>

        <div className="space-y-3.5 text-xs sm:text-sm text-secondary-text">
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
            <div>
              <strong className="text-charcoal block">Full Address:</strong>
              <span>{siteConfig.location.displayAddress}</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="w-4 h-4 text-sandstone shrink-0 mt-0.5" />
            <div>
              <strong className="text-charcoal block">Operating Hours:</strong>
              <span>{siteConfig.hours.display}</span>
              <p className="text-[11px] text-secondary-text mt-0.5">
                {siteConfig.hours.availabilityNote}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mail className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
            <div>
              <strong className="text-charcoal block">Email Address:</strong>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="text-charcoal hover:text-terracotta hover:underline"
              >
                {siteConfig.contact.email}
              </a>
            </div>
          </div>
        </div>

        {/* Action Button: Get Directions */}
        <div className="pt-2 border-t border-border-subtle flex flex-col sm:flex-row gap-3">
          <Button
            href={siteConfig.location.directionsUrl}
            variant="outline"
            size="md"
            iconLeft={Navigation}
            target="_blank"
            rel="noopener noreferrer"
            className="border-sandstone/60 text-charcoal hover:bg-warm-bg"
          >
            Get Driving Directions
          </Button>

          <Button
            href="/order"
            variant="primary"
            size="md"
          >
            Submit Bulk Order Request
          </Button>
        </div>
      </Card>
    </div>
  );
}
