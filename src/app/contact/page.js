import { MapPin, Phone, MessageSquare, Clock, Navigation, Mail, ExternalLink, ShieldCheck } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import PageHero from "@/components/ui/PageHero";
import ContactInformation from "@/components/ui/ContactInformation";
import SocialMediaLinks from "@/components/ui/SocialMediaLinks";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ContactCTA from "@/components/sections/ContactCTA";
import { siteConfig } from "@/config/site";
import { generatePageMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Contact Kiln & Directions | Kalwa, Jind",
  description:
    "Contact Dhanda Bhatta Company in Village Kalwa, near Dharoli Gausala, Pillukhera, Jind, Haryana. Direct phone, WhatsApp, driving directions, and batch enquiry.",
  path: "/contact",
  keywords: [
    "contact Dhanda Bhatta Company",
    "bhatta Kalwa phone number",
    "brick kiln Pillukhera location",
    "directions to Dhanda Bhatta Kalwa",
  ],
});

export default function ContactPage() {
  const breadcrumbLd = generateBreadcrumbSchema([{ name: "Contact", url: "/contact" }]);
  const whatsappUrl = `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(
    "Hello Dhanda Bhatta Company, I would like to enquire about brick availability and delivery."
  )}`;

  return (
    <div>
      {/* Schema.org Breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {/* Page Hero */}
      <PageHero
        badge="Direct Kiln Access"
        title="Contact Kiln &amp; Dispatch Desk"
        description="Reach out directly to our management team in Village Kalwa for brick availability, bulk quotes, and delivery scheduling."
        breadcrumbs={[{ label: "Contact" }]}
      />

      <section className="py-12 sm:py-16 bg-white border-b border-border-subtle">
        <PageContainer>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {/* Left Column: Reusable Contact Channels & Verified Details */}
            <div className="lg:col-span-7 space-y-8">
              <ContactInformation />

              {/* Verified Social Media Links (Rendered only if actual URLs are available) */}
              {siteConfig.socialLinks && siteConfig.socialLinks.length > 0 && (
                <div className="p-4 bg-warm-bg border border-border-subtle space-y-2">
                  <span className="text-xs font-heading uppercase tracking-wider text-charcoal font-bold">
                    Official Social Profiles:
                  </span>
                  <SocialMediaLinks />
                </div>
              )}
            </div>

            {/* Right Column: Embedded Map Area & Driving Landmark Directions */}
            <div className="lg:col-span-5 space-y-6">
              {/* Map Container */}
              <div className="border border-border-strong bg-warm-bg p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
                  <span className="text-xs font-heading uppercase tracking-widest text-terracotta font-bold">
                    Location Map
                  </span>
                  <span className="text-[11px] text-secondary-text">Kalwa, Pillukhera</span>
                </div>

                {/* Embedded Map Area (When verified embed URL is supplied) or Visual Map Placeholder */}
                {siteConfig.location.embedMapUrl ? (
                  <div className="relative aspect-4/3 w-full border border-border-subtle overflow-hidden">
                    <iframe
                      src={siteConfig.location.embedMapUrl}
                      title="Dhanda Bhatta Company Location Map"
                      className="w-full h-full border-0"
                      loading="lazy"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="relative aspect-4/3 w-full bg-[#EDE7DD] border border-border-subtle flex flex-col justify-between p-5 text-center">
                    <div className="text-[10px] text-secondary-text text-left">
                      GPS Navigation Target
                    </div>

                    <div className="my-auto space-y-2">
                      <div className="w-10 h-10 mx-auto bg-white border border-border-subtle flex items-center justify-center text-terracotta shadow-xs">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <h2 className="font-heading font-bold text-sm text-charcoal">
                        Village Kalwa, Pillukhera
                      </h2>
                      <p className="text-xs text-secondary-text max-w-xs mx-auto">
                        Tehsil Pillukhera, District Jind, Haryana - 126113
                      </p>
                    </div>

                    <Button
                      href={siteConfig.location.directionsUrl}
                      variant="primary"
                      size="sm"
                      className="w-full justify-center"
                      iconRight={ExternalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open in Google Maps
                    </Button>
                  </div>
                )}

                {/* Driving Landmarks */}
                <div className="pt-2 space-y-2 text-xs text-secondary-text">
                  <strong className="text-charcoal block">Driving Route Guide:</strong>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Located along the Pillukhera - Kalwa Link Road</li>
                    <li>Approximately 4 km from Pillukhera Grain Market (Anaaj Mandi)</li>
                    <li>Easily accessible from Jind - Gohana corridor via Pillukhera turn</li>
                  </ul>
                </div>
              </div>

              {/* In-Person Visit Advisory */}
              <Card surface="white" className="space-y-3 p-5 sm:p-6">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-terracotta shrink-0" />
                  <h4 className="font-heading font-bold text-sm sm:text-base text-charcoal">
                    Facility Batch Inspection
                  </h4>
                </div>
                <p className="text-xs text-secondary-text leading-relaxed">
                  Contractors and home builders are welcome to inspect brick stacks firsthand at our Kalwa
                  facility before delivery dispatch.
                </p>
                <div className="pt-2 text-xs text-charcoal space-y-1">
                  <p>
                    <strong>Recommended Inspection Hours:</strong> 7:00 AM to 6:00 PM daily
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Enquiry CTA */}
      <ContactCTA />
    </div>
  );
}
