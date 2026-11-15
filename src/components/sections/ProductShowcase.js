import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductCard from "@/components/ui/ProductCard";
import Button from "@/components/ui/Button";
import { sampleProducts, productNotice } from "@/data/products";
import { getPublishedProducts } from "@/services/productService";

export default async function ProductShowcase() {
  const { products } = await getPublishedProducts({ limit: 3 });
  const displayProducts = products && products.length > 0 ? products : sampleProducts;

  return (
    <section className="py-14 sm:py-20 lg:py-24 bg-white border-b border-border-subtle">
      <PageContainer>
        {/* Section Heading */}
        <SectionHeading
          overline="Product Offerings"
          title="Bricks for Every Construction Need"
          description="Clay bricks manufactured for residential walls, commercial frames, and foundation works. Explore our sample offerings below."
          align="split"
          action={
            <Button href="/products" variant="outline" iconRight={ArrowRight}>
              View All Products
            </Button>
          }
          className="mb-8 sm:mb-12"
        />

        {/* Sample Catalogue Notice Banner */}
        <div className="mb-8 p-3.5 sm:p-4 bg-warm-bg border border-border-subtle flex items-start gap-3 text-xs text-secondary-text">
          <Info className="w-4 h-4 text-sandstone shrink-0 mt-0.5" />
          <div>
            <strong className="text-charcoal font-semibold">Catalogue Notice: </strong>
            {productNotice.disclaimer}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayProducts.map((product) => (
            <ProductCard key={product.id || product.slug} product={product} />
          ))}
        </div>

        {/* Bottom Wholesale CTA */}
        <div className="mt-10 sm:mt-12 p-6 bg-warm-bg border border-border-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-heading font-bold text-sm sm:text-base text-charcoal">
              Have specific brick requirements or bulk volume questions?
            </h4>
            <p className="text-xs text-secondary-text">
              Contact our sales desk to check current kiln batch availability and discuss custom orders.
            </p>
          </div>
          <Button href="/enquiry" variant="primary" size="sm" className="shrink-0">
            Submit Product Enquiry
          </Button>
        </div>
      </PageContainer>
    </section>
  );
}
