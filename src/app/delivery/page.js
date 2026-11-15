import Image from "next/image";
import { Phone, ArrowRight, MapPin, Truck } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import DeliveryInformation from "@/components/ui/DeliveryInformation";
import ContactCTA from "@/components/sections/ContactCTA";
import { siteConfig } from "@/config/site";
import { generatePageMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Brick Delivery & Service Locations | Jind & Nearby Areas",
  description:
    "Direct kiln delivery available for red clay bricks from Village Kalwa, Pillukhera across nearby areas in Jind and surrounding regions. Coordinated transport for building sites.",
  path: "/delivery",
  keywords: [
    "brick delivery Jind",
    "tractor trolley brick delivery Pillukhera",
    "red clay bricks delivery Haryana",
    "brick supplier Kalwa",
  ],
});

export default function DeliveryPage() {
  const breadcrumbLd = generateBreadcrumbSchema([{ name: "Delivery", url: "/delivery" }]);

  const deliverySteps = [
    {
      step: "01",
      title: "Share Your Brick Requirements",
      description:
        "Contact our team with your required brick grade, estimated quantity, and construction site location in nearby areas.",
    },
    {
      step: "02",
      title: "Confirm Availability & Site Location",
      description:
        "We verify kiln batch readiness and check road accessibility and clearance for delivery vehicles entering your building plot.",
    },
    {
      step: "03",
      title: "Coordinate Pricing & Transport",
      description:
        "We finalize dispatch timing and transparent transport haulage directly to your construction site gate.",
    },
  ];

  return (
    <div>
      {/* Schema.org Breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* 1. Page Hero */}
      <PageHero
        badge="Nearby Area Delivery"
        title="Bricks Delivered for Your Construction Needs"
        description="Dhanda Bhatta Company coordinates direct transportation for brick orders to construction sites across Jind and nearby areas. Delivery is planned to match your site access and project schedule."
        breadcrumbs={[{ label: "Delivery" }]}
      />

      {/* 2. Main Delivery Overview & Photo Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white border-b border-border-subtle">
        <PageContainer>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center mb-16">
            {/* Left: Clear Hierarchy & Process */}
            <div className="lg:col-span-7 space-y-5">
              <div className="space-y-2">
                <p className="font-heading text-xs uppercase tracking-widest font-bold text-terracotta inline-flex items-center gap-2">
                  <span className="w-4 h-px bg-terracotta inline-block" />
                  NEARBY AREA DELIVERY
                </p>
                <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold text-charcoal tracking-tight leading-tight">
                  Bricks Delivered for Your Construction Needs
                </h2>
              </div>

              <p className="text-sm sm:text-base text-secondary-text leading-relaxed">
                We deliver kiln-fired red clay bricks directly to building sites, residential plots,
                and commercial projects across Jind and surrounding areas. Our dispatch coordination
                ensures your brick order arrives when your masonry crew is ready.
              </p>

              {/* Verified Location Note */}
              <div className="pt-1 flex items-start gap-2.5 text-xs sm:text-sm text-charcoal">
                <MapPin className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
                <div>
                  <span className="font-heading font-semibold text-charcoal">Dispatch Hub: </span>
                  <span className="text-secondary-text">Village Kalwa, near Dharoli Gausala, Pillukhera (Jind)</span>
                </div>
              </div>

              {/* Single Prominent CTA */}
              <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Button href="/enquiry?topic=delivery" variant="primary" size="lg" className="min-h-[48px] px-6">
                  Enquire About Delivery
                </Button>
                <Button
                  href={`tel:${siteConfig.contact.primaryPhone}`}
                  variant="outline"
                  size="lg"
                  className="min-h-[48px]"
                  iconLeft={Phone}
                >
                  Call Dispatch Desk
                </Button>
              </div>
            </div>

            {/* Right: Wide Authentic Kiln Yard & Loading Photograph */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden border border-border-subtle shadow-sm bg-[#EAE4D9]">
                <Image
                  src="/images/facility/kiln-hero.jpg"
                  alt="Dhanda Bhatta Company brick kiln chimney, loading area, and blue tractor trolley at Village Kalwa"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-charcoal/50 via-transparent to-transparent pointer-events-none"
                  aria-hidden="true"
                />
                <div className="absolute bottom-3 left-3 right-3 text-[11px] text-white/95 bg-charcoal/85 backdrop-blur-xs px-3 py-1.5 flex items-center justify-between border border-white/10">
                  <span className="font-heading font-medium tracking-wide">Kiln Yard Loading</span>
                  <span className="text-sandstone-light">Village Kalwa, Pillukhera</span>
                </div>
              </div>
              <p className="text-xs text-secondary-text mt-2 text-center sm:text-left">
                Direct vehicle transport and tractor haulage coordinated from our Kalwa stockyard.
              </p>
            </div>
          </div>

          {/* 3-Step Simple Process */}
          <div className="space-y-8 pt-4 border-t border-border-subtle">
            <SectionHeading
              overline="Simple Process"
              title="How to Arrange Delivery"
              description="A direct, practical 3-step process to receive bricks at your site."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {deliverySteps.map((item) => (
                <div
                  key={item.step}
                  className="bg-warm-bg/50 border border-border-subtle p-6 flex flex-col justify-between space-y-4 shadow-2xs hover:border-sandstone hover:bg-white transition-all"
                >
                  <div className="space-y-2">
                    <span className="font-heading font-extrabold text-2xl text-sandstone">
                      {item.step}
                    </span>
                    <h3 className="font-heading font-bold text-base text-charcoal">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-secondary-text leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 3. Dispatch Facility & Site Preparation Section */}
      <section className="py-12 sm:py-16 bg-warm-bg border-b border-border-subtle">
        <PageContainer>
          <div className="max-w-3xl space-y-3 mb-10">
            <p className="font-heading text-xs uppercase tracking-widest font-bold text-terracotta inline-flex items-center gap-2">
              <span className="w-4 h-px bg-terracotta inline-block" />
              SITE READINESS
            </p>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">
              Direct Kiln Gate Transport
            </h2>
            <p className="text-sm sm:text-base text-secondary-text leading-relaxed">
              Bricks are dispatched directly from our facility in Village Kalwa. To ensure smooth
              unloading at your building plot, please keep these practical guidelines in mind:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-border-subtle p-6 space-y-3 shadow-2xs">
              <span className="text-xs font-heading font-bold uppercase tracking-wider text-sandstone block">
                Guideline 01
              </span>
              <h3 className="font-heading font-bold text-base text-charcoal">
                Approach Road Access
              </h3>
              <p className="text-xs sm:text-sm text-secondary-text leading-relaxed">
                Ensure the road to your building plot has sufficient width and clear ground for delivery vehicles to enter safely without obstruction.
              </p>
            </div>

            <div className="bg-white border border-border-subtle p-6 space-y-3 shadow-2xs">
              <span className="text-xs font-heading font-bold uppercase tracking-wider text-sandstone block">
                Guideline 02
              </span>
              <h3 className="font-heading font-bold text-base text-charcoal">
                Designated Unloading Area
              </h3>
              <p className="text-xs sm:text-sm text-secondary-text leading-relaxed">
                Keep a level, firm staging area ready near your active masonry work area to prevent double-handling of brick stacks.
              </p>
            </div>

            <div className="bg-white border border-border-subtle p-6 space-y-3 shadow-2xs">
              <span className="text-xs font-heading font-bold uppercase tracking-wider text-sandstone block">
                Guideline 03
              </span>
              <h3 className="font-heading font-bold text-base text-charcoal">
                On-Site Batch Inspection
              </h3>
              <p className="text-xs sm:text-sm text-secondary-text leading-relaxed">
                Verify the delivered brick count and visual quality directly at your plot gate upon vehicle arrival with the driver.
              </p>
            </div>
          </div>

          {/* Delivery Enquiry Strip */}
          <div className="mt-12 p-6 sm:p-8 bg-white border border-border-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <h3 className="font-heading font-bold text-base sm:text-lg text-charcoal">
                Need delivery to your specific village or construction site?
              </h3>
              <p className="text-xs sm:text-sm text-secondary-text">
                Speak directly with our transport desk or submit your site location online.
              </p>
            </div>

            <Button href="/enquiry?topic=delivery" variant="primary" size="md" className="shrink-0 min-h-[44px]">
              Enquire About Delivery
            </Button>
          </div>
        </PageContainer>
      </section>

      {/* 4. Unified Contact CTA */}
      <ContactCTA />
    </div>
  );
}
