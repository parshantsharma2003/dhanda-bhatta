import ProductCard from "./ProductCard";
import SectionHeading from "./SectionHeading";

/**
 * RelatedProducts component for product detail page
 */
export default function RelatedProducts({ relatedProducts = [] }) {
  if (!relatedProducts || relatedProducts.length === 0) return null;

  return (
    <section className="pt-12 sm:pt-16 border-t border-border-subtle space-y-8">
      <SectionHeading
        overline="Related Categories"
        title="Explore Other Brick Grades"
        description="Browse alternative clay brick specifications available from our Kalwa kiln."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
