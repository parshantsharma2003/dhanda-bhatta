import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { productGrades } from "@/data/products";

export default function ProductsPreview() {
  // Show top 3-4 products for the homepage preview
  const previewProducts = productGrades.slice(0, 3);

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-warm-bg border-b border-border-subtle">
      <PageContainer>
        <SectionHeading
          overline="Manufacturing Catalog"
          title="Brick Grades for Every Structural Need"
          description="From high-load multi-storey framing to exposed architectural facades and underground foundations, our kiln produces strictly graded red clay bricks."
          align="split"
          action={
            <Button href="/products" variant="outline" iconRight={ArrowRight}>
              View All 5 Brick Grades
            </Button>
          }
          className="mb-12"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {previewProducts.map((product) => (
            <Card
              key={product.id}
              surface="white"
              hover
              className="flex flex-col justify-between relative group"
            >
              <div>
                {/* Header Tag / Grade Badge */}
                <div className="flex items-center justify-between mb-4">
                  <Badge
                    variant={product.isPopular ? "terracotta" : "subtle"}
                    size="sm"
                  >
                    {product.gradeCode}
                  </Badge>

                  {product.isPopular && (
                    <span className="text-[10px] font-heading font-semibold uppercase tracking-wider text-terracotta inline-flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      High Demand
                    </span>
                  )}
                </div>

                {/* Product Name */}
                <h3 className="font-heading font-bold text-xl text-charcoal group-hover:text-terracotta transition-colors">
                  {product.name}
                </h3>

                <p className="text-xs sm:text-sm text-secondary-text mt-2 leading-relaxed">
                  {product.shortDescription}
                </p>

                {/* Technical Specifications Highlights */}
                <div className="my-5 p-3.5 bg-warm-bg border border-border-subtle space-y-2 text-xs">
                  {product.specifications.slice(0, 3).map((spec) => (
                    <div key={spec.label} className="flex justify-between">
                      <span className="text-secondary-text">{spec.label}:</span>
                      <span className="font-semibold text-charcoal">{spec.value}</span>
                    </div>
                  ))}
                </div>

                {/* Key Applications */}
                <div className="space-y-1.5 mb-6">
                  <p className="text-[11px] font-heading uppercase tracking-wider text-secondary-text font-semibold">
                    Ideal Applications:
                  </p>
                  <ul className="space-y-1 text-xs text-charcoal">
                    {product.applications.slice(0, 2).map((app) => (
                      <li key={app} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-terracotta shrink-0 mt-0.5" />
                        <span>{app}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-border-subtle flex items-center justify-between gap-3">
                <Button
                  href="/order"
                  variant="primary"
                  size="sm"
                  className="w-full justify-center"
                >
                  Order This Grade
                </Button>
                <Button
                  href={`/products#${product.slug}`}
                  variant="outline"
                  size="sm"
                  className="px-3"
                  aria-label={`View specs for ${product.name}`}
                >
                  Specs
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Wholesale Advisory Note */}
        <div className="mt-10 p-5 bg-[#FAF6EF] border border-sandstone/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <p className="font-heading font-bold text-sm text-charcoal">
              Need custom quantities or contractor project schedules?
            </p>
            <p className="text-xs text-secondary-text">
              We supply direct truckloads (3,000 to 10,000+ bricks) with flexible dispatch schedules for ongoing construction sites in Haryana.
            </p>
          </div>
          <Button href="/enquiry" variant="sandstone" size="sm" className="shrink-0">
            Send Contractor Enquiry
          </Button>
        </div>
      </PageContainer>
    </section>
  );
}
