import { Truck, MapPin, CheckCircle2, Phone, MessageSquare, ArrowRight, Clock, ShieldCheck } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import DeliveryInformation from "@/components/ui/DeliveryInformation";
import ContactCTA from "@/components/sections/ContactCTA";
import { siteConfig } from "@/config/site";
import { generatePageMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Brick Delivery & Service Locations | Jind & Nearby Areas",
  description:
    "Direct kiln delivery available for red clay bricks from Village Kalwa, Pillukhera across nearby areas including Safidon, Jind, Assandh, Panipat, and Gohana.",
  path: "/delivery",
  keywords: [
    "brick delivery Jind",
    "tractor trolley brick delivery Pillukhera",
    "truck load bricks Safidon",
    "bulk brick supplier Haryana",
  ],
});

export default function DeliveryPage() {
  const breadcrumbLd = generateBreadcrumbSchema([{ name: "Delivery", url: "/delivery" }]);
  const deliveryFeatures = [
    {
      title: "Nearby Area Availability",
      description:
        "Delivery is coordinated to construction plots, residential foundations, and commercial sites in nearby areas surrounding our kiln in Village Kalwa.",
    },
    {
      title: "Direct Gate Loading",
      description:
        "Vehicles are loaded directly from sorted stockyard chambers at our bhatta facility, minimizing handling stress and protecting brick arrises.",
    },
    {
      title: "Flexible Batch Supply",
      description:
        "We coordinate batch transport to match your building schedule—whether you require delivery for a single foundation phase or recurring phased supplies.",
    },
  ];

  const bulkGuidelines = [
    {
      title: "Approach Road Preparation",
      description:
        "Ensure that the access road to your building plot has adequate clearance and firm ground for delivery vehicles to enter safely without obstruction.",
    },
    {
      title: "Designated Unloading Area",
      description:
        "Keep a clear, level, and dry staging ground ready adjacent to your masonry work area to prevent repetitive double-handling on site.",
    },
    {
      title: "On-Site Delivery Verification",
      description:
        "Our driver delivers bricks directly to your plot gate where you can verify the batch upon arrival.",
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
        badge="Logistics & Dispatch"
        title="Bricks Delivered to Your Location."
        description="Dhanda Bhatta Company coordinates direct transportation for brick orders to construction sites in nearby areas across Jind and surrounding regions."
        breadcrumbs={[{ label: "Delivery" }]}
      />

      {/* 2 & 3. Nearby-Area Delivery & How Customers Can Request Delivery */}
      <section className="py-12 sm:py-16 bg-white border-b border-border-subtle">
        <PageContainer>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center mb-16">
            <div className="lg:col-span-7 space-y-5">
              <SectionHeading
                overline="Direct Transport"
                title="Reliable Haulage from Our Kiln Gate to Your Plot"
                description="We take care of transportation coordination so you can focus on building with confidence."
              />

              <div className="space-y-3.5 text-sm sm:text-base text-secondary-text leading-relaxed">
                <p>
                  All brick deliveries originate directly from our manufacturing bhatta in Village Kalwa,
                  near Pillukhera. By dispatching straight from our stockyards, we ensure fresh batch sorting,
                  punctual scheduling, and direct communication.
                </p>
                <p>
                  Delivery is available across nearby areas in District Jind and neighboring corridors.
                  Because construction sites have varying access roads and space constraints, our dispatch
                  coordinator confirms your site location prior to vehicle assignment.
                </p>
              </div>

              {/* Verified Origin Badge */}
              <div className="p-4 bg-warm-bg border border-border-subtle flex items-start gap-3 text-xs sm:text-sm text-charcoal">
                <MapPin className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-heading font-bold">Dispatch Hub Origin:</strong>
                  <span>{siteConfig.location.displayAddress}</span>
                </div>
              </div>
            </div>

            {/* Right Overview Card */}
            <div className="lg:col-span-5">
              <Card surface="warm" className="p-6 sm:p-8 space-y-5 border-2 border-border-subtle">
                <div className="border-b border-border-subtle pb-3">
                  <span className="text-[10px] font-heading uppercase tracking-widest text-terracotta font-bold">
                    Dispatch Terms
                  </span>
                  <h3 className="font-heading font-bold text-lg text-charcoal mt-1">
                    Direct Kiln Dispatch
                  </h3>
                </div>

                <div className="space-y-3 text-xs sm:text-sm text-secondary-text">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
                    <span>Delivery arranged for nearby construction sites.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
                    <span>Direct coordination with transport drivers.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
                    <span>Operating daily during daytime dispatch hours.</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-border-subtle flex flex-col gap-2.5">
                  <Button href="/enquiry" variant="primary" size="md" className="w-full justify-center">
                    Enquire About Delivery
                  </Button>
                  <Button
                    href={`tel:${siteConfig.contact.primaryPhone}`}
                    variant="outline"
                    size="sm"
                    className="w-full justify-center"
                    iconLeft={Phone}
                  >
                    Call Transport Coordinator
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          {/* How Customers Request Delivery - 3 Step Flow */}
          <div className="space-y-8">
            <SectionHeading
              overline="Simple Process"
              title="How Customers Can Request Delivery"
              description="A clear, direct 3-step process to receive bricks at your site."
            />

            <DeliveryInformation />
          </div>
        </PageContainer>
      </section>

      {/* 4. Bulk Order Information & Site Guidelines */}
      <section className="py-12 sm:py-16 bg-warm-bg border-b border-border-subtle">
        <PageContainer>
          <div className="max-w-3xl space-y-4 mb-10">
            <span className="text-xs font-heading font-bold uppercase tracking-widest text-terracotta">
              Site Readiness
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">
              Bulk Order Coordination &amp; Site Readiness
            </h2>
            <p className="text-sm sm:text-base text-secondary-text leading-relaxed">
              To ensure smooth delivery and unloading at your plot, please review these essential site preparation tips:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bulkGuidelines.map((item, idx) => (
              <Card key={item.title} surface="white" className="space-y-3 p-6 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="font-heading font-extrabold text-xl text-sandstone">
                    Guideline 0{idx + 1}
                  </span>
                  <h3 className="font-heading font-bold text-base text-charcoal">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-secondary-text leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          {/* Delivery Enquiry Banner */}
          <div className="mt-12 p-6 sm:p-8 bg-white border border-border-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <h3 className="font-heading font-bold text-lg text-charcoal">
                Need to verify delivery availability for your specific location?
              </h3>
              <p className="text-xs sm:text-sm text-secondary-text">
                Speak directly with our transport coordinator or send your site requirements online.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Button href="/enquiry" variant="primary" size="md">
                Enquire About Delivery
              </Button>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 5 & 6. Delivery Enquiry CTA & Contact Details */}
      <ContactCTA />
    </div>
  );
}
