import Link from "next/link";
import Image from "next/image";
import { MapPin, ShieldCheck, CheckCircle2, ArrowRight, Layers, Flame, Hammer } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import DeliveryInformation from "@/components/ui/DeliveryInformation";
import ContactCTA from "@/components/sections/ContactCTA";
import { siteConfig } from "@/config/site";
import { getCmsContent } from "@/lib/server/getCmsContent";
import { generatePageMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = generatePageMetadata({
  title: "About Our Bhatta | Brick Manufacturing in Kalwa, Jind",
  description:
    "Learn about Dhanda Bhatta Company, our brick manufacturing facility in Village Kalwa, Pillukhera, Jind, Haryana, and our focus on product quality and direct delivery.",
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
      title: "Suitable Local Clay",
      description:
        "Selecting quality regional clay conditioned for clean moulding, ensuring uniform shape and masonry durability.",
    },
    {
      icon: Flame,
      title: "Traditional Kiln Firing",
      description:
        "Careful kiln firing hardens clay units into resilient, weather-resistant masonry bricks with solid compressive performance.",
    },
    {
      icon: Hammer,
      title: "Yard Inspection & Sorting",
      description:
        "Bricks are inspected and sorted at the kiln yard to ensure uniform rectangular dimensions and clean arrises.",
    },
    {
      icon: ShieldCheck,
      title: "Direct Customer Service",
      description:
        "Direct communication with builders, homeowners, and contractors for transparent pricing and reliable delivery coordination.",
    },
  ];

  const workingStages = [
    {
      stage: "01",
      title: "Clay Preparation",
      description:
        "Preparing quality regional soil with water to achieve proper consistency for uniform brick shaping.",
    },
    {
      stage: "02",
      title: "Moulding & Shaping",
      description:
        "Forming green bricks using standard rectangular moulds for sharp corners and standard construction dimensions.",
    },
    {
      stage: "03",
      title: "Sun Drying in Open Yards",
      description:
        "Stacking green bricks in open-air hacks to allow steady moisture evaporation before kiln loading.",
    },
    {
      stage: "04",
      title: "Kiln Firing & Dispatch",
      description:
        "Firing bricks in the kiln to full hardness, followed by sorting in the yard for direct site transport.",
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
        badge="About Dhanda Bhatta Company"
        title="Built on Quality. Focused on Trust."
        description="Dhanda Bhatta Company is a brick manufacturing and supply business based in Village Kalwa, Pillukhera, District Jind, Haryana."
        breadcrumbs={[{ label: "About Our Bhatta" }]}
      />

      {/* 2 & 3. About Business & Manufacturing Overview */}
      <section className="py-14 sm:py-20 bg-white border-b border-border-subtle">
        <PageContainer>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-7 space-y-5">
              <SectionHeading
                overline="Our Business"
                title="Brick Manufacturing in Jind, Haryana"
                description="Rooted in Village Kalwa, our bhatta operates on straightforward principles: quality raw material, controlled firing, and dependable customer service."
              />

              <div className="space-y-4 text-sm sm:text-base text-secondary-text leading-relaxed">
                <p>
                  Dhanda Bhatta Company is a brick manufacturing and supply business based in Village
                  Kalwa, Pillukhera, District Jind, Haryana.
                </p>
                <p>
                  We serve customers looking for bricks for their construction requirements, with
                  nearby-area delivery available. Get in touch with us to discuss product availability
                  and bulk orders.
                </p>
              </div>

              {/* Clean Location Information */}
              <div className="pt-2 flex items-start gap-2.5 text-xs sm:text-sm text-charcoal">
                <MapPin className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
                <div>
                  <span className="font-heading font-semibold text-charcoal">Manufacturing Facility: </span>
                  <span className="text-secondary-text">Village Kalwa, Pillukhera, District Jind, Haryana - 126113</span>
                </div>
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

      {/* 5. Brickmaking Workflow Stages */}
      <section className="py-14 sm:py-20 bg-white border-b border-border-subtle">
        <PageContainer>
          <SectionHeading
            overline="Kiln Workflow"
            title="How Our Bricks Are Manufactured"
            description="From initial clay conditioning to kiln firing, each stage follows time-tested craftsmanship."
            className="mb-12"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workingStages.map((item) => (
              <div
                key={item.stage}
                className="border border-border-subtle p-6 bg-warm-bg/50 hover:bg-white hover:border-sandstone transition-colors flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <span className="font-heading font-bold text-2xl text-sandstone">
                    {item.stage}
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
        </PageContainer>
      </section>

      {/* 6. Delivery Information Module */}
      <section className="py-14 sm:py-20 bg-warm-bg border-b border-border-subtle">
        <PageContainer>
          <SectionHeading
            overline="Logistics"
            title="Direct Delivery Across Jind & Nearby Areas"
            description="We coordinate transportation directly to construction sites, commercial projects, and residential plots."
            className="mb-8"
          />
          <DeliveryInformation />
        </PageContainer>
      </section>

      {/* Contact CTA */}
      <ContactCTA />
    </div>
  );
}
