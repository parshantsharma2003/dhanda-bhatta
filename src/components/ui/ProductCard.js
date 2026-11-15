import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Button from "./Button";
import { cn } from "@/lib/utils";

/**
 * Reusable Product Card
 * Premium Architectural Materials Catalogue Style:
 * - Consistent 4:3 image aspect ratio
 * - Small category label
 * - Clear product name in Archivo font
 * - Concise useful description
 * - "View Details" link & "Enquire Now" action
 * - Verified availability indicator ("Enquire for Availability")
 * - Deliberate clean architectural fallback when physical grade photography is pending
 */
export default function ProductCard({ product, className = "" }) {
  if (!product) return null;

  const detailUrl = `/products/${product.slug}`;
  const enquiryUrl = `/enquiry?product=${encodeURIComponent(product.slug)}`;

  // Determine if a real, verified product photograph is available
  const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];
  const hasRealPhoto = Boolean(
    primaryImage?.src &&
      !primaryImage.isPlaceholder &&
      (primaryImage.src.startsWith("http://") ||
        primaryImage.src.startsWith("https://") ||
        primaryImage.src.startsWith("/images/facility/") ||
        primaryImage.src.startsWith("/images/products/") ||
        primaryImage.src.startsWith("/images/delivery/") ||
        primaryImage.src.startsWith("/images/gallery/"))
  );

  return (
    <article
      className={cn(
        "border border-border-subtle bg-white flex flex-col justify-between p-5 sm:p-6 shadow-2xs hover:border-sandstone transition-all duration-200 group",
        className
      )}
    >
      <div>
        {/* Product Photograph / Deliberate Architectural Fallback Frame */}
        <Link
          href={detailUrl}
          className="block relative aspect-4/3 w-full bg-[#F6F3EE] border border-border-subtle overflow-hidden mb-4 group-hover:border-sandstone transition-colors focus-visible:outline-2 focus-visible:outline-terracotta"
          tabIndex={-1}
          aria-hidden="true"
        >
          {hasRealPhoto ? (
            <Image
              src={primaryImage.src}
              alt={primaryImage.alt || product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-102 transition-transform duration-300"
            />
          ) : (
            /* Deliberate Clean Architectural Fallback */
            <div className="absolute inset-0 flex flex-col justify-between p-3.5 select-none bg-gradient-to-br from-[#F8F5EE] via-[#EFE9DF] to-[#E5DDD0]">
              {/* Top Meta Badges */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-heading uppercase tracking-wider font-semibold text-secondary-text bg-white/95 px-2.5 py-0.5 border border-border-subtle shadow-2xs">
                  {product.category || "Masonry"}
                </span>
                <span className="text-[10px] font-heading uppercase tracking-wider font-semibold text-terracotta bg-white/95 px-2 py-0.5 border border-border-subtle shadow-2xs">
                  Kalwa Kiln
                </span>
              </div>

              {/* Minimalist Architectural Brickwork Geometry */}
              <div className="my-auto flex flex-col items-center justify-center py-2 text-center">
                <svg
                  className="w-16 h-10 text-sandstone/80 group-hover:text-terracotta/80 transition-colors"
                  viewBox="0 0 64 36"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="3" width="28" height="13" rx="0.5" fill="currentColor" fillOpacity="0.08" />
                  <rect x="34" y="3" width="28" height="13" rx="0.5" fill="currentColor" fillOpacity="0.08" />
                  <rect x="2" y="20" width="12" height="13" rx="0.5" fill="currentColor" fillOpacity="0.08" />
                  <rect x="18" y="20" width="28" height="13" rx="0.5" fill="currentColor" fillOpacity="0.08" />
                  <rect x="50" y="20" width="12" height="13" rx="0.5" fill="currentColor" fillOpacity="0.08" />
                </svg>
                <span className="text-[11px] font-heading font-medium tracking-wide text-secondary-text mt-2">
                  Kiln Batch Material
                </span>
              </div>

              {/* Subtle Architectural Origin Line */}
              <div className="text-[10px] text-secondary-text/80 text-center border-t border-border-subtle/70 pt-1">
                <span>Village Kalwa, Pillukhera (Jind)</span>
              </div>
            </div>
          )}
        </Link>

        {/* Product Name */}
        <h3 className="font-heading font-bold text-lg sm:text-xl text-charcoal group-hover:text-terracotta transition-colors leading-snug">
          <Link href={detailUrl} className="focus-visible:outline-2 focus-visible:outline-terracotta">
            {product.name}
          </Link>
        </h3>

        {/* Short Description */}
        <p className="text-xs sm:text-sm text-secondary-text mt-2 leading-relaxed line-clamp-3">
          {product.shortDescription}
        </p>

        {/* Verified Availability Indicator */}
        <div className="flex items-center gap-1.5 text-xs text-secondary-text mt-3 pt-3 border-t border-border-subtle/60">
          <span className="w-1.5 h-1.5 rounded-full bg-sandstone shrink-0" />
          <span className="font-medium text-charcoal">Enquire for Availability</span>
        </div>
      </div>

      {/* Card Actions: View Details link & Enquire Now button */}
      <div className="pt-4 mt-4 border-t border-border-subtle flex items-center justify-between gap-3">
        <Link
          href={detailUrl}
          className="text-xs font-heading font-bold text-charcoal hover:text-terracotta transition-colors inline-flex items-center gap-1.5 min-h-[44px] py-2 focus-visible:outline-2 focus-visible:outline-terracotta"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        <Button
          href={enquiryUrl}
          variant="primary"
          size="sm"
          className="min-h-[40px] text-xs font-semibold px-4"
        >
          Enquire Now
        </Button>
      </div>
    </article>
  );
}
