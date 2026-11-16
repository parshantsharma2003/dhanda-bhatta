import { Info, Camera, MapPin } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import PageHero from "@/components/ui/PageHero";
import GalleryGrid from "@/components/ui/GalleryGrid";
import Button from "@/components/ui/Button";
import ContactCTA from "@/components/sections/ContactCTA";
import { galleryCategories, galleryNotice } from "@/data/gallery";
import { getPublishedGalleryAssets } from "@/services/galleryService";
import { generatePageMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Bhatta Operations & Kiln Gallery",
  description:
    "Authentic photography and visual tour of brickmaking operations at Dhanda Bhatta Company in Village Kalwa, Pillukhera, Jind. Kiln firing, shaded drying hacks, and stockyard sorting.",
  path: "/gallery",
  keywords: [
    "bhatta gallery Jind",
    "brick kiln photos Kalwa",
    "Pillukhera brick making photos",
    "brick stockyard Haryana",
  ],
});

// Incremental Static Regeneration (ISR) with 5-minute background refresh
export const revalidate = 300;

export default async function GalleryPage() {
  const { items } = await getPublishedGalleryAssets();
  const breadcrumbLd = generateBreadcrumbSchema([{ name: "Gallery", url: "/gallery" }]);

  return (
    <div>
      {/* Schema.org Breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* Page Hero */}
      <PageHero
        badge="Visual Field Tour"
        title="A Closer Look at Our Bhatta"
        description="Visual documentation of brickmaking discipline at Village Kalwa: clay preparation, shaded curing hacks, continuous kiln firing, and transport loading."
        breadcrumbs={[{ label: "Gallery" }]}
      />

      <section className="py-12 sm:py-16 bg-white border-b border-border-subtle">
        <PageContainer>
          {/* Authentic Photography Notice */}
          <div className="mb-8 p-4 sm:p-5 bg-warm-bg border-l-4 border-sandstone border-y border-r border-border-subtle flex items-start gap-3.5 text-xs sm:text-sm text-secondary-text">
            <Info className="w-5 h-5 text-sandstone shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="text-charcoal font-semibold block">
                Authentic Media Policy:
              </strong>
              <p>
                In alignment with our industrial craftsmanship principles, we avoid synthetic stock imagery.
                The media frames below represent verified operational stages photographed directly at our
                Kalwa facility in Jind, Haryana.
              </p>
            </div>
          </div>

          {/* Interactive Gallery Grid with Category Filtering & Lightbox */}
          <GalleryGrid
            items={items}
            categories={galleryCategories}
          />

          {/* In-Person Visit Invitation Strip */}
          <div className="mt-16 p-6 sm:p-8 bg-warm-bg border border-border-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-terracotta">
                On-Site Experience
              </span>
              <h3 className="font-heading font-bold text-lg sm:text-xl text-charcoal">
                Want to observe continuous kiln firing in person?
              </h3>
              <p className="text-xs sm:text-sm text-secondary-text max-w-xl">
                We welcome builders, contractors, and civil engineers to visit our kiln grounds in Village Kalwa,
                Pillukhera to inspect currently stacked batches.
              </p>
            </div>

            <Button href="/contact" variant="primary" size="md" className="shrink-0">
              Plan Facility Visit
            </Button>
          </div>
        </PageContainer>
      </section>

      {/* Contact CTA */}
      <ContactCTA />
    </div>
  );
}
