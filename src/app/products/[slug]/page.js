import { notFound } from "next/navigation";
import Link from "next/link";
import { MessageSquare, ArrowRight } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ProductImageGallery from "@/components/ui/ProductImageGallery";
import RelatedProducts from "@/components/ui/RelatedProducts";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import ContactCTA from "@/components/sections/ContactCTA";
import { getRelatedProducts } from "@/data/products";
import { getProductBySlug, getPublishedProducts } from "@/services/productService";
import { siteConfig } from "@/config/site";
import {
  generatePageMetadata,
  generateProductSchema,
  generateBreadcrumbSchema,
} from "@/lib/seo";

// Enable Incremental Static Regeneration (ISR) with 5-minute background refresh
export const revalidate = 300;

export async function generateStaticParams() {
  const { products } = await getPublishedProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const result = await getProductBySlug(slug);
  const product = result?.product;

  if (!product) {
    return {
      title: "Product Not Found | Dhanda Bhatta Company",
      description: "The requested brick product could not be found.",
    };
  }

  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.src ||
    product.images?.[0]?.src ||
    "/images/facility/kiln-hero.jpg";

  return generatePageMetadata({
    title: `${product.name} | Red Clay Bricks`,
    description:
      product.seo?.description ||
      product.shortDescription ||
      `${product.name} manufactured by Dhanda Bhatta Company in Village Kalwa, Pillukhera, Jind. Quality construction masonry units with batch delivery.`,
    path: `/products/${product.slug}`,
    keywords: [
      product.name,
      `${product.name} Jind`,
      `${product.category} Haryana`,
      "red clay bricks Pillukhera",
    ],
    ogImage: primaryImage,
    ogType: "article",
  });
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const result = await getProductBySlug(slug);
  const product = result?.product;

  if (!product) {
    notFound();
  }

  const productLd = generateProductSchema(product);
  const breadcrumbLd = generateBreadcrumbSchema([
    { name: "Products", url: "/products" },
    { name: product.name, url: `/products/${product.slug}` },
  ]);

  const relatedProducts = getRelatedProducts(product.slug, 3);

  const whatsappMessage = `Hello Dhanda Bhatta Company, I would like to enquire about availability and rates for ${product.name}.`;
  const whatsappUrl = `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  const enquiryUrl = `/enquiry?product=${encodeURIComponent(product.slug)}`;

  return (
    <div>
      {/* Schema.org Structured Data */}
      {productLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* Product Header / Breadcrumb Strip */}
      <section className="bg-warm-bg border-b border-border-subtle py-4 sm:py-5">
        <PageContainer>
          <Breadcrumbs
            items={[
              { label: "Products", href: "/products" },
              { label: product.name },
            ]}
          />
        </PageContainer>
      </section>

      {/* Main Product Showcase Section */}
      <section className="py-10 sm:py-16 bg-white border-b border-border-subtle">
        <PageContainer>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {/* Left Column: Image Gallery */}
            <div className="lg:col-span-6">
              <ProductImageGallery
                images={product.images}
                productName={product.name}
              />
            </div>

            {/* Right Column: Title, Details & Actions */}
            <div className="lg:col-span-6 space-y-6">
              {/* Category & Availability Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="terracotta" size="md">
                  {product.category}
                </Badge>

                {product.availability && (
                  <Badge variant="subtle" size="md" className="border-sandstone/60 text-charcoal">
                    <span className="w-1.5 h-1.5 rounded-full bg-sandstone mr-1.5 shrink-0" />
                    {product.availability}
                  </Badge>
                )}
              </div>

              {/* Title */}
              <div>
                <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold text-charcoal tracking-tight">
                  {product.name}
                </h1>
                <p className="text-xs text-secondary-text mt-1">
                  Kiln Origin: Village Kalwa, Pillukhera (Jind, Haryana)
                </p>
              </div>

              {/* Description */}
              <div className="space-y-3 text-sm sm:text-base text-secondary-text leading-relaxed border-t border-border-subtle pt-4">
                <p>{product.description}</p>
                {product.shortDescription && product.shortDescription !== product.description && (
                  <p className="text-xs sm:text-sm text-charcoal">{product.shortDescription}</p>
                )}
              </div>

              {/* Verified Applications List */}
              {product.applications && product.applications.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-border-subtle">
                  <h2 className="font-heading text-xs uppercase tracking-wider font-bold text-charcoal">
                    Recommended Masonry Applications:
                  </h2>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-secondary-text">
                    {product.applications.map((app) => (
                      <li key={app} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-terracotta shrink-0 mt-2" />
                        <span>{app}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Verified Specifications Table */}
              {product.specifications && product.specifications.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-border-subtle">
                  <div className="flex items-center justify-between">
                    <h2 className="font-heading text-xs uppercase tracking-wider font-bold text-charcoal">
                      Verified Product Details
                    </h2>
                    <span className="text-[11px] text-secondary-text">Facility Standard</span>
                  </div>

                  <div className="bg-warm-bg border border-border-subtle divide-y divide-border-subtle text-xs">
                    {product.specifications.map((spec) => (
                      <div
                        key={spec.label}
                        className="flex flex-col sm:flex-row sm:justify-between p-2.5 sm:px-3 gap-0.5 sm:gap-2"
                      >
                        <span className="text-secondary-text font-medium">{spec.label}</span>
                        <span className="text-charcoal font-semibold sm:text-right">
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons: Bulk Enquiry CTA & WhatsApp Enquiry */}
              <div className="pt-4 border-t border-border-subtle space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    href={enquiryUrl}
                    variant="primary"
                    size="lg"
                    className="justify-center flex-1 min-h-[48px]"
                    iconRight={ArrowRight}
                  >
                    Enquire Now
                  </Button>

                  <Button
                    href={whatsappUrl}
                    variant="outline"
                    size="lg"
                    className="justify-center border-sandstone/60 text-charcoal hover:bg-warm-bg hover:border-terracotta hover:text-terracotta min-h-[48px]"
                    target="_blank"
                    rel="noopener noreferrer"
                    iconLeft={MessageSquare}
                  >
                    WhatsApp Enquiry
                  </Button>
                </div>

                <div className="flex items-center justify-between text-xs text-secondary-text pt-1">
                  <span>Direct phone line available:</span>
                  <a
                    href={`tel:${siteConfig.contact.primaryPhone}`}
                    className="text-terracotta font-semibold hover:underline"
                  >
                    {siteConfig.contact.primaryPhoneDisplay}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          <RelatedProducts relatedProducts={relatedProducts} />
        </PageContainer>
      </section>

      {/* Contact CTA */}
      <ContactCTA />
    </div>
  );
}
