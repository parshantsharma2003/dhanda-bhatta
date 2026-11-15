import Link from "next/link";
import Image from "next/image";
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
    "Learn about Dhanda Bhatta Company, our brick manufacturing facility in Village Kalwa, near Dharoli Gausala, Pillukhera, Jind, Haryana, and our focus on product quality and direct delivery.",
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

  const qualityPillars = [
    {
      icon: Layers,
      title: "Quality Clay Preparation",
      description:
        "Selecting suitable regional clay conditioned to mould cleanly, ensuring uniform density and sound structural integrity.",
    },
    {
      icon: Flame,
      title: "Controlled Kiln Firing",
      description:
        "Thorough kiln firing hardens clay units into durable, weather-resistant masonry bricks with dependable compressive strength.",
    },
    {
      icon: Hammer,
      title: "Batch Sorting & Inspection",
      description:
        "Each batch is sorted at the kiln yard to ensure consistent dimensional accuracy, clean edges, and proper ringing sound.",
    },
    {
      icon: ShieldCheck,
      title: "Direct Kiln Relationship",
      description:
        "Direct communication with builders, homeowners, and contractors for transparent pricing and reliable delivery coordination.",
    },
  ];

  const workingStages = [
    {
      stage: "01",
      title: "Clay Preparation & Pugging",
      description:
        "Preparing quality regional soil with water to achieve optimal plasticity for uniform brick shaping.",
    },
    {
      stage: "02",
      title: "Moulding & Shaping",
      description:
        "Forming green bricks using true rectangular moulds for sharp corners and standard construction dimensions.",
    },
    {
      stage: "03",
      title: "Natural Air Drying",
      description:
        "Stacking green bricks in open-air drying hacks to steadily remove moisture before kiln loading.",
    },
    {
      stage: "04",
      title: "Kiln Firing & Batch Dispatch",
      description:
        "Firing bricks in the kiln to full hardness, followed by sorting in the stockyard for direct site delivery.",
    },
  ];

  const contactReasons = [
    "Check live brick batch availability directly at the kiln gate.",
    "Discuss brick requirements for residential homes, commercial buildings, and boundary walls.",
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
        description="Dhanda Bhatta Company is an established brick manufacturing and supply business located in Village Kalwa, near Pillukhera in District Jind, Haryana."
        breadcrumbs={[{ label: "About Our Bhatta" }]}
      />

      {/* 2 & 3. About Business & Manufacturing Overview */}
      <section className="py-14 sm:py-20 bg-white border-b border-border-subtle">
        <PageContainer>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-7 space-y-5">
              <SectionHeading
                overline="Our Business"
                title="Traditional Brickmaking in Jind, Haryana"
                description="Rooted in Village Kalwa, our bhatta operates on straightforward principles: quality raw material, controlled firing, and dependable customer service."
              />

              <div className="space-y-4 text-sm sm:text-base text-secondary-text leading-relaxed">
                {aboutCms?.heritageStory ? (
                  <p className="whitespace-pre-wrap">{aboutCms.heritageStory}</p>
                ) : (
                  <>
                    <p>
                      Dhanda Bhatta Company supplies quality red clay bricks to builders, contractors,
                      and homeowners constructing durable structures across Kalwa, Pillukhera, Jind,
                      and surrounding areas.
                    </p>
                    <p>
                      Kiln-fired clay bricks remain the preferred foundation and structural material across
                      northern India, offering natural thermal insulation, weather resilience, and lasting strength.
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

            {/* Right: Large Genuine Bhatta Photograph */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] w-full overflow-hidden border border-border-subtle shadow-sm bg-warm-bg">
                <Image
                  src="/images/facility/kiln-hero.jpg"
                  alt="Dhanda Bhatta Company brick kiln chimney and loading yard at Village Kalwa, Jind"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent pointer-events-none"
                  aria-hidden="true"
                />
                <div className="absolute bottom-3 left-3 right-3 text-[11px] text-white/90 bg-charcoal/85 backdrop-blur-xs px-3 py-1.5 flex items-center justify-between border border-white/10">
                  <span className="font-heading font-medium tracking-wide">Kiln Operations</span>
                  <span className="text-sandstone-light">Village Kalwa, Pillukhera</span>
                </div>
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
            description="We focus on essential brickmaking standards to ensure every delivered batch meets durable construction requirements."
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
                      Standard 0{idx + 1}
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
            title="Operational Workflow"
            description="Our primary stages from clay preparation to finished batch dispatch."
            className="mb-12"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                description="Whether you are beginning foundation work for a home or managing a commercial contract, we are available to assist with your brick supply."
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
