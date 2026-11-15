import { MapPin, Phone, MessageSquare, Clock, Navigation, Mail } from "lucide-react";
import Button from "./Button";
import Card from "./Card";
import Badge from "./Badge";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Reusable ContactInformation Component
 * Used on the Contact page, Footer, and Contact sections.
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
        <Card surface="white" className="space-y-3 p-5 sm:p-6">
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
              className="text-sm font-heading font-bold text-terracotta hover:underline block"
            >
              {siteConfig.contact.primaryPhoneDisplay}
            </a>
            {siteConfig.contact.isPlaceholder && (
              <span className="text-[10px] text-secondary-text block mt-0.5">
                (Primary Kiln Dispatch Desk)
              </span>
            )}
          </div>
        </Card>

        {/* WhatsApp Channel */}
        <Card surface="white" className="space-y-3 p-5 sm:p-6">
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
              className="text-sm font-heading font-bold text-[#2E7D32] hover:underline block"
            >
              Chat on WhatsApp ({siteConfig.contact.whatsappDisplay})
            </a>
          </div>
        </Card>
      </div>

      {/* Business Location & Driving Directions */}
      <Card surface="white" className="space-y-5 p-6 sm:p-8 border-2 border-border-subtle">
        <div className="border-b border-border-subtle pb-4">
          <Badge variant="terracotta" size="sm">
            Manufacturing Facility
          </Badge>
          <h3 className="font-heading font-bold text-xl text-charcoal mt-1.5">
            {siteConfig.name}
          </h3>
          <p className="text-xs text-secondary-text mt-0.5">
            Village Kalwa, Tehsil Pillukhera, District Jind, Haryana - 126113
          </p>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-secondary-text">
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
              <strong className="text-charcoal block">Email:</strong>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="text-terracotta hover:underline"
              >
                {siteConfig.contact.email}
              </a>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-border-subtle flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <span className="text-xs text-secondary-text">
            Visiting the facility? Get road directions:
          </span>
          <Button
            href={siteConfig.location.directionsUrl}
            variant="primary"
            size="sm"
            iconRight={Navigation}
            target="_blank"
            rel="noopener noreferrer"
          >
            Get Driving Directions
          </Button>
        </div>
      </Card>
    </div>
  );
}
