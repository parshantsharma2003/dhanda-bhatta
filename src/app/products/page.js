import PageContainer from "@/components/layout/PageContainer";
import PageHero from "@/components/ui/PageHero";
import ProductGrid from "@/components/ui/ProductGrid";
import ContactCTA from "@/components/sections/ContactCTA";
import { getCategories } from "@/data/products";
import { getPublishedProducts } from "@/services/productService";
import { generatePageMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Red Clay Bricks Catalogue | Brick Supplier in Jind, Haryana",
  description:
    "Explore our red clay brick products and contact Dhanda Bhatta Company for current availability, specifications and bulk-order enquiries across Jind and nearby areas.",
  path: "/products",
  keywords: [
    "red clay bricks in Jind",
    "building bricks supplier",
    "First Class bricks Jind",
    "foundation soling bricks Haryana",
  ],
});

// Incremental Static Regeneration (ISR) with 5-minute background refresh
export const revalidate = 300;

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
        description="Explore our brick products and contact us for current availability, specifications and bulk-order enquiries."
        breadcrumbs={[{ label: "Products" }]}
      />

      <section className="py-12 sm:py-16 bg-white border-b border-border-subtle">
        <PageContainer>
          {/* Accessible section heading for product catalog */}
          <h2 className="sr-only">Available Brick Varieties</h2>

          {/* Product Grid with Live Search & Category Filtering */}
          <ProductGrid
            products={products}
            categories={categories}
            initialCategory="All Products"
          />

          {/* Ordering & Logistics Information Strip */}
          <div className="mt-16 p-6 sm:p-8 bg-warm-bg border border-border-subtle grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-terracotta">
                Direct Kiln Supply
              </span>
              <h3 className="font-heading font-bold text-base text-charcoal">
                Factory Gate Rates
              </h3>
              <p className="text-xs text-secondary-text leading-relaxed">
                Bricks are supplied directly from our facility in Village Kalwa, ensuring transparent pricing and straightforward communication.
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-sandstone-text">
                Nearby Area Delivery
              </span>
              <h3 className="font-heading font-bold text-base text-charcoal">
                Direct Site Haulage
              </h3>
              <p className="text-xs text-secondary-text leading-relaxed">
                We coordinate transportation to building sites across Jind and surrounding areas according to your project schedule.
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-charcoal">
                Volume Planning
              </span>
              <h3 className="font-heading font-bold text-base text-charcoal">
                Commercial Enquiries
              </h3>
              <p className="text-xs text-secondary-text leading-relaxed">
                Contractors, builders and homeowners can discuss staged supply schedules to keep active masonry work moving smoothly.
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
