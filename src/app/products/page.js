import { Info, ShieldCheck, Truck, Phone } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import PageHero from "@/components/ui/PageHero";
import ProductGrid from "@/components/ui/ProductGrid";
import Button from "@/components/ui/Button";
import ContactCTA from "@/components/sections/ContactCTA";
import { getCategories, productNotice } from "@/data/products";
import { getPublishedProducts } from "@/services/productService";
import { generatePageMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Red Clay Bricks Catalogue | Brick Supplier in Jind, Haryana",
  description:
    "Explore red clay brick varieties produced by Dhanda Bhatta Company in Village Kalwa, Pillukhera, Jind. Quality construction bricks with nearby batch delivery.",
  path: "/products",
  keywords: [
    "red clay bricks in Jind",
    "building bricks supplier",
    "First Class bricks Jind",
    "foundation soling bricks Haryana",
  ],
});

export default async function ProductsPage() {
  const { products } = await getPublishedProducts();
  const categories = getCategories();
  const breadcrumbLd = generateBreadcrumbSchema([{ name: "Products", url: "/products" }]);

  return (
    <div>
      {/* Schema.org Breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* Page Hero */}
      <PageHero
        badge="Brick Catalogue"
        title="Bricks for Every Construction Need"
        description="Red clay bricks manufactured for residential, commercial, and foundation works. Direct kiln supply across Jind and nearby areas."
        breadcrumbs={[{ label: "Products" }]}
      />

      <section className="py-12 sm:py-16 bg-white border-b border-border-subtle">
        <PageContainer>
          {/* Commercial Supply & Batch Availability Note */}
          <div className="mb-8 p-4 sm:p-5 bg-warm-bg border-l-4 border-terracotta border-y border-r border-border-subtle flex items-start gap-3.5 text-xs sm:text-sm text-secondary-text">
            <Info className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="text-charcoal font-semibold block">
                Batch Availability &amp; Delivery:
              </strong>
              <p>
                All brick varieties are manufactured directly at our kiln in Village Kalwa. Batch sizes
                from tractor trolley loads to multi-axle truck dispatches are coordinated across Jind
                and surrounding areas.
              </p>
            </div>
          </div>

          {/* Product Grid with Live Search & Category Filtering */}
          <ProductGrid
            products={products}
            categories={categories}
            initialCategory="All Products"
          />

          {/* Ordering Information Strip */}
          <div className="mt-16 p-6 sm:p-8 bg-warm-bg border border-border-subtle grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <span className="font-heading font-bold text-xs uppercase tracking-wider text-terracotta">
                Direct Kiln Supply
              </span>
              <h4 className="font-heading font-bold text-base text-charcoal">
                Factory Gate Rates
              </h4>
              <p className="text-xs text-secondary-text leading-relaxed">
                Bricks are supplied directly from our facility in Village Kalwa, ensuring transparent pricing and clear batch sorting.
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="font-heading font-bold text-xs uppercase tracking-wider text-sandstone">
                Nearby Area Delivery
              </span>
              <h4 className="font-heading font-bold text-base text-charcoal">
                Direct Site Haulage
              </h4>
              <p className="text-xs text-secondary-text leading-relaxed">
                We coordinate transportation to building sites across Jind and surrounding areas according to project timelines.
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="font-heading font-bold text-xs uppercase tracking-wider text-charcoal">
                Batch Coordination
              </span>
              <h4 className="font-heading font-bold text-base text-charcoal">
                Commercial Enquiries
              </h4>
              <p className="text-xs text-secondary-text leading-relaxed">
                Contractors and developers can discuss staged supply schedules to keep active masonry projects moving without interruption.
              </p>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Contact CTA */}
      <ContactCTA />
    </div>
  );
}
