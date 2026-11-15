import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductCard from "@/components/ui/ProductCard";
import Button from "@/components/ui/Button";
import { sampleProducts } from "@/data/products";
import { getPublishedProducts } from "@/services/productService";

export default async function ProductShowcase() {
  const { products } = await getPublishedProducts({ limit: 3 });
  const displayProducts = products && products.length > 0 ? products : sampleProducts;

  return (
    <section className="py-14 sm:py-20 lg:py-24 bg-white border-b border-border-subtle">
      <PageContainer>
        {/* Section Heading */}
        <SectionHeading
          overline="Product Catalogue"
          title="Bricks for Every Construction Need"
          description="Explore our brick products and contact us for current availability, specifications and bulk-order enquiries."
          align="split"
          action={
            <Button href="/products" variant="outline" iconRight={ArrowRight}>
              View All Products
            </Button>
          }
          className="mb-8 sm:mb-12"
        />

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayProducts.map((product) => (
            <ProductCard key={product.id || product.slug} product={product} />
          ))}
        </div>

        {/* Bottom Project Enquiries Strip */}
        <div className="mt-10 sm:mt-12 p-6 bg-warm-bg border border-border-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-heading font-bold text-sm sm:text-base text-charcoal">
              Planning a construction project in Jind or nearby areas?
            </h4>
            <p className="text-xs text-secondary-text">
              Get in touch with our team to discuss delivery schedules, site access and volume requirements.
            </p>
          </div>
          <Button href="/enquiry" variant="primary" size="sm" className="shrink-0 min-h-[40px]">
            Submit Product Enquiry
          </Button>
        </div>
      </PageContainer>
    </section>
  );
}
