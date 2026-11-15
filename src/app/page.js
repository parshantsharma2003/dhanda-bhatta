import HeroSection from "@/components/sections/HeroSection";
import TrustHighlights from "@/components/sections/TrustHighlights";
import AboutPreview from "@/components/sections/AboutPreview";
import ProductShowcase from "@/components/sections/ProductShowcase";
import GalleryPreview from "@/components/sections/GalleryPreview";
import DeliverySection from "@/components/sections/DeliverySection";
import ContactCTA from "@/components/sections/ContactCTA";
import { getCmsContent, getGlobalSiteSettings } from "@/lib/server/getCmsContent";
import {
  generatePageMetadata,
  generateLocalBusinessSchema,
  generateOrganizationSchema,
} from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = generatePageMetadata({
  title: "Dhanda Bhatta Company | Brick Manufacturer in Jind, Haryana",
  description:
    "Dhanda Bhatta Company manufactures high-grade kiln-fired red clay bricks in Village Kalwa, near Dharoli Gausala, Pillukhera, Jind, Haryana. Batch supply and direct tractor trolley & truck delivery across nearby areas.",
  path: "/",
  keywords: [
    "brick manufacturer in Jind",
    "bricks supplier in Jind",
    "bhatta in Pillukhera",
    "brick manufacturer in Pillukhera",
    "red clay bricks in Jind",
    "building bricks supplier",
    "bulk bricks supplier in Haryana",
    "brick manufacturer near Gohana",
    "bricks near me",
  ],
});

export default async function Home() {
  const [homepageCms, siteSettings] = await Promise.all([
    getCmsContent("homepage"),
    getGlobalSiteSettings(),
  ]);

  const localBusinessLd = generateLocalBusinessSchema(siteSettings);
  const organizationLd = generateOrganizationSchema();

  return (
    <>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
      />

      {/* 1. Cinematic Hero Section */}
      <HeroSection cmsData={homepageCms} />

      {/* 2. Trust & Business Highlights */}
      <TrustHighlights />

      {/* 3. About Us Preview */}
      <AboutPreview />

      {/* 4. Products Showcase */}
      <ProductShowcase />

      {/* 5. Bhatta Gallery Preview */}
      <GalleryPreview />

      {/* 6. Delivery Section */}
      <DeliverySection />

      {/* 7. Contact CTA */}
      <ContactCTA />
    </>
  );
}
