import Link from "next/link";
import { MapPin, ShieldCheck, CheckCircle2, ArrowRight, Layers, Flame, Hammer } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import DeliveryInformation from "@/components/ui/DeliveryInformation";
import ContactCTA from "@/components/sections/ContactCTA";
import { siteConfig } from "@/config/site";
import { getCmsContent } from "@/lib/server/getCmsContent";
import { generatePageMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = generatePageMetadata({
  title: "About Our Bhatta | Brick Manufacturing in Kalwa, Jind",
  description:
    "Learn about Dhanda Bhatta Company, our clay brick manufacturing facility in Village Kalwa, near Dharoli Gausala, Pillukhera, Jind, Haryana, and our focus on product quality and direct delivery.",
  path: "/about",
  keywords: [
    "Dhanda Bhatta Company Kalwa",
    "bhatta in Pillukhera",
    "brick kiln Jind Haryana",
    "red clay brick manufacturing",
  ],
});

export default async function AboutPage() {
  const aboutCms = await getCmsContent("about");
  const breadcrumbLd = generateBreadcrumbSchema([{ name: "About Us", url: "/about" }]);

  const qualityPillars = aboutCms?.values?.length
    ? aboutCms.values.map((v) => ({
        icon: ShieldCheck,
        title: v.title,
        description: v.description,
      }))
    : [
        {
          icon: Layers,
          title: "Regional Alluvial Clay Selection",
          description:
            "We source regional alluvial soil from the Kalwa agricultural basin, allowing the clay to weather naturally so it moulds cleanly with minimal internal voids.",
        },
        {
          icon: Flame,
          title: "Disciplined Kiln Firing",
          description:
            "Bricks are fired through continuous trench kiln cycles, sintering the clay into durable, weather-resilient terracotta masonry units.",
        },
        {
          icon: Hammer,
          title: "Batch Sorting & Ring Inspection",
          description:
            "Every batch drawn from our chambers is sorted for true shape, uniform color, and the resonant metallic ringing sound of well-burnt clay.",
        },
        {
          icon: ShieldCheck,
          title: "Direct Kiln Relationship",
          description:
            "We deal directly with home builders, civil contractors, and project managers from our facility gate without third-party dealer markups.",
        },
      ];

  const workingStages = [
    {
      stage: "01",
      title: "Soil Sourcing & Weathering",
      description:
        "Selecting suitable agrarian clay and exposing it to ambient conditions to break down clods and condition the soil for pugging.",
    },
    {
      stage: "02",
      title: "Kneading & Moulding",
      description:
        "Mixing tempered soil with water in mechanical pugging mills to achieve uniform plasticity before shaping bricks into true rectangular moulds.",
    },
    {
      stage: "03",
      title: "Open-Air Shade Curing",
      description:
        "Stacking green bricks into elongated shaded drying hacks so moisture evaporates steadily, preventing premature drying fissures.",
    },
    {
      stage: "04",
      title: "Continuous Kiln Firing & Cooling",
      description:
        "Arranging cured bricks inside the continuous kiln circuit where regulated thermal currents fire and slowly cool each chamber.",
    },
    {
      stage: "05",
      title: "Yard Stacking & Site Dispatch",
      description:
        "Carefully organizing finished bricks into segregated piles in the stockyard, ready for vehicle loading and transport to nearby building plots.",
    },
  ];

  const contactReasons = [
    "Check live brick batch availability directly at the kiln gate.",
    "Discuss brick requirements for residential homes, commercial plazas, and agricultural boundaries.",
    "Coordinate direct vehicle dispatch and scheduling to your building plot in nearby areas.",
    "Visit the facility in Village Kalwa to inspect currently stacked batches in person.",
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
        badge="About Dhanda Bhatta Company"
        title="Building with Quality. Delivering with Trust."
        description="Dhanda Bhatta Company is a dedicated brick manufacturing and supply business located in Village Kalwa, near Pillukhera in District Jind, Haryana."
        breadcrumbs={[{ label: "About Our Bhatta" }]}
      />

      {/* 2 & 3. About Business & Manufacturing Overview */}
      <section className="py-14 sm:py-20 bg-white border-b border-border-subtle">
        <PageContainer>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-7 space-y-5">
              <SectionHeading
                overline="Our Business"
                title="Traditional Brickmaking in the Heart of Haryana"
                description="Rooted in the agrarian plains of Jind, our bhatta operates on straightforward principles: solid raw clay, disciplined continuous firing, and dependable customer service."
              />

              <div className="space-y-4 text-sm sm:text-base text-secondary-text leading-relaxed">
                {aboutCms?.heritageStory ? (
                  <p className="whitespace-pre-wrap">{aboutCms.heritageStory}</p>
                ) : (
                  <>
                    <p>
                      Dhanda Bhatta Company was established to supply quality red clay bricks to builders,
                      contractors, and families constructing homes across Kalwa, Pillukhera, Jind, and
                      surrounding regions.
                    </p>
                    <p>
                      Clay bricks remain one of the most reliable and enduring building materials in northern
                      India. Their natural thermal mass keeps interiors comfortable through harsh summer heat and
                      winter cold, while their mineral durability resists weathering decade after decade.
                    </p>
                  </>
                )}
              </div>

              {/* Physical Location Box */}
              <div className="p-4 bg-warm-bg border-l-4 border-terracotta border-y border-r border-border-subtle text-xs sm:text-sm text-charcoal space-y-1">
                <div className="flex items-center gap-2 font-heading font-bold">
                  <MapPin className="w-4 h-4 text-terracotta shrink-0" />
                  <span>Manufacturing Facility Location:</span>
                </div>
                <p className="text-secondary-text">
                  Village Kalwa, Tehsil Pillukhera, District Jind, Haryana - 126113.
                </p>
              </div>
            </div>

            {/* Right Media Area for Actual Bhatta Photography */}
            <div className="lg:col-span-5">
              <div className="border border-border-strong bg-warm-bg p-4 sm:p-5 shadow-xs relative">
                <div className="aspect-4/3 w-full bg-[#E5DEC7] border border-border-subtle flex flex-col justify-between p-5 overflow-hidden">
                  <div className="flex items-center justify-between text-[11px] text-secondary-text">
                    <Badge variant="terracotta" size="sm">
                      Bhatta Facility
                    </Badge>
                    <span>Village Kalwa</span>
                  </div>

                  <div className="my-auto text-center py-4">
                    <div className="w-12 h-12 mx-auto mb-2 bg-white border border-border-subtle flex items-center justify-center text-terracotta shadow-2xs">
                      <Layers className="w-6 h-6" />
                    </div>
                    <h2 className="font-heading font-bold text-sm sm:text-base text-charcoal">
                      Continuous Kiln Operations
                    </h2>
                    <p className="text-xs text-secondary-text mt-1 max-w-xs mx-auto">
                      Field media placeholder ready for confirmed facility photographs
                    </p>
                  </div>

                  <div className="text-[10px] text-secondary-text border-t border-border-subtle pt-1 flex justify-between">
                    <span>Dhanda Bhatta Company</span>
                    <span className="text-terracotta font-medium">Kalwa, Pillukhera</span>
                  </div>
                </div>

                <p className="pt-3 text-xs text-secondary-text text-center">
                  Kiln yard and dispatch area in Village Kalwa, Jind
                </p>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 4. Our Approach to Product Quality */}
      <section className="py-14 sm:py-20 bg-warm-bg border-b border-border-subtle">
        <PageContainer>
          <SectionHeading
            overline="Quality Focus"
            title="Our Approach to Product Quality"
            description="We focus on four fundamental aspects of clay brick manufacturing to ensure every batch delivered is sound and dependable."
            className="mb-12"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {qualityPillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <Card key={pillar.title} surface="white" hover className="space-y-3 p-6 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="w-10 h-10 border border-sandstone/50 bg-warm-bg flex items-center justify-center text-terracotta">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-heading font-bold text-sandstone uppercase tracking-widest block">
                      Pillar 0{idx + 1}
                    </span>
                    <h3 className="font-heading font-bold text-base text-charcoal">
                      {pillar.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-secondary-text leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </PageContainer>
      </section>

      {/* 5. Our Facilities & Working Process */}
      <section className="py-14 sm:py-20 bg-white border-b border-border-subtle">
        <PageContainer>
          <SectionHeading
            overline="Process &amp; Operations"
            title="Our Facilities and Working Process"
            description="The step-by-step brickmaking journey from raw clay pugging to cooling chamber sorting."
            className="mb-12"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workingStages.map((stage) => (
              <div
                key={stage.stage}
                className="p-6 bg-warm-bg border border-border-subtle space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <span className="font-heading font-extrabold text-2xl text-sandstone">
                    {stage.stage}
                  </span>
                  <h3 className="font-heading font-bold text-base text-charcoal">
                    {stage.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-secondary-text leading-relaxed">
                    {stage.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* 6. Why Customers Can Contact Us */}
      <section className="py-14 sm:py-20 bg-warm-bg border-b border-border-subtle">
        <PageContainer>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-5">
              <SectionHeading
                overline="Customer Service"
                title="Why Customers Can Contact Us"
                description="Whether you are beginning foundation work for a private home or managing a commercial building contract, we are available to help you plan your brick requirements."
              />

              <div className="space-y-3 pt-2">
                {contactReasons.map((reason) => (
                  <div key={reason} className="flex items-start gap-3 text-xs sm:text-sm text-secondary-text">
                    <CheckCircle2 className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
                    <span>{reason}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3">
                <Button href="/contact" variant="primary" size="md">
                  Contact Our Team
                </Button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <Card surface="white" className="p-6 sm:p-8 space-y-4 border-2 border-border-subtle">
                <span className="text-[10px] font-heading uppercase tracking-widest text-terracotta font-bold">
                  Kiln Gate Notice
                </span>
                <h3 className="font-heading font-bold text-lg text-charcoal">
                  Facility Site Visits Welcome
                </h3>
                <p className="text-xs sm:text-sm text-secondary-text leading-relaxed">
                  We welcome contractors and builders to visit our kiln grounds in Village Kalwa. Visiting in
                  person allows you to examine current brick batches, review sorting quality, and coordinate
                  haulage directly.
                </p>
                <div className="pt-2 text-xs text-charcoal space-y-1">
                  <p>
                    <strong>Working Hours:</strong> {siteConfig.hours.display}
                  </p>
                  <p>
                    <strong>Address:</strong> {siteConfig.location.displayAddress}
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 7. Delivery Information Preview */}
      <section className="py-14 sm:py-20 bg-white border-b border-border-subtle">
        <PageContainer>
          <SectionHeading
            overline="Transport &amp; Dispatch"
            title="Nearby Area Delivery Preview"
            description="We coordinate direct delivery to construction plots across Jind and nearby surrounding areas."
            className="mb-10"
          />

          <DeliveryInformation />
        </PageContainer>
      </section>

      {/* 8. Contact CTA */}
      <ContactCTA />
    </div>
  );
}
