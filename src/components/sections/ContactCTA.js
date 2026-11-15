import { Phone, MessageSquare, MapPin, Navigation, Clock } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import Button from "@/components/ui/Button";
import { siteConfig } from "@/config/site";

export default function ContactCTA() {
  const whatsappUrl = `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(
    "Hello Dhanda Bhatta Company, I would like to enquire about brick availability and delivery."
  )}`;

  return (
    <section className="py-14 sm:py-20 lg:py-24 bg-charcoal text-white relative overflow-hidden border-b border-charcoal-muted">
      <PageContainer className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Main Text Content */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2">
              <span className="w-5 h-px bg-sandstone inline-block" />
              <p className="font-heading text-xs uppercase tracking-widest font-semibold text-sandstone">
                START YOUR BUILD
              </p>
            </div>

            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Planning Your Next Construction Project?
            </h2>

            <p className="text-sm sm:text-base text-warm-bg/85 max-w-xl leading-relaxed">
              Get in touch with Dhanda Bhatta Company for brick availability, bulk orders and delivery
              enquiries.
            </p>

            {/* Three Contact Buttons: Call Us, WhatsApp Us, Get Directions */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 pt-3">
              <Button
                href={`tel:${siteConfig.contact.primaryPhone}`}
                variant="primary"
                size="lg"
                iconLeft={Phone}
                className="justify-center"
              >
                Call Us
              </Button>

              <Button
                href={whatsappUrl}
                variant="outline"
                size="lg"
                iconLeft={MessageSquare}
                className="justify-center border-sandstone/60 text-warm-bg hover:bg-white/10 hover:border-sandstone hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp Us
              </Button>

              <Button
                href={siteConfig.location.directionsUrl}
                variant="outline"
                size="lg"
                iconLeft={Navigation}
                className="justify-center border-white/30 text-warm-bg hover:bg-white/10 hover:border-white hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                Get Directions
              </Button>
            </div>
          </div>

          {/* Right: Quick Location & Operating Hours Information */}
          <div className="lg:col-span-5">
            <div className="bg-[#1C1A18] border border-charcoal-muted p-6 sm:p-7 space-y-5">
              <div className="border-b border-charcoal-muted pb-3">
                <span className="text-[10px] font-heading uppercase tracking-widest text-sandstone font-bold">
                  Bhatta Location &amp; Inquiries
                </span>
                <h3 className="font-heading font-bold text-lg text-white mt-1">
                  Dhanda Bhatta Company
                </h3>
              </div>

              <div className="space-y-3.5 text-xs sm:text-sm text-warm-bg/80">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">Location:</span>
                    <span>{siteConfig.location.displayAddress}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-sandstone shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">Operating Schedule:</span>
                    <span>{siteConfig.hours.display}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">Direct Phone Line:</span>
                    <a
                      href={`tel:${siteConfig.contact.primaryPhone}`}
                      className="text-sandstone hover:underline font-medium"
                    >
                      {siteConfig.contact.primaryPhoneDisplay}
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-warm-bg/50 border-t border-charcoal-muted/60">
                <span>Direct brick supply • Kalwa, Pillukhera, Jind</span>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
