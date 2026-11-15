import Link from "next/link";
import { ArrowRight, Layers, CheckCircle2, AlertCircle } from "lucide-react";
import Button from "./Button";
import Badge from "./Badge";
import { cn } from "@/lib/utils";

/**
 * Reusable Product Card
 * Complies with Task 2 & Task 7 requirements:
 * - Product photography / configurable placeholder
 * - Product name
 * - Short description
 * - View Details link (/products/[slug])
 * - Enquire button (/enquiry?product=[slug])
 * - Availability indicator when known
 */
export default function ProductCard({ product, className = "" }) {
  if (!product) return null;

  const detailUrl = `/products/${product.slug}`;
  const enquiryUrl = `/enquiry?product=${encodeURIComponent(product.slug)}`;

  return (
    <article
      className={cn(
        "border border-border-subtle bg-white flex flex-col justify-between p-5 sm:p-6 shadow-2xs hover:border-sandstone transition-colors group",
        className
      )}
    >
      <div>
        {/* Product Image Frame / Configurable Media Slot */}
        <Link
          href={detailUrl}
          className="block relative aspect-4/3 w-full bg-[#EDE7DD] border border-border-subtle overflow-hidden mb-4 group-hover:bg-[#E5DFD4] transition-colors focus-visible:outline-2 focus-visible:outline-terracotta"
          tabIndex={-1}
          aria-hidden="true"
        >
          {/* Top badges inside frame */}
          <div className="absolute top-3 inset-x-3 flex items-center justify-between text-[10px] z-10">
            <span className="font-heading uppercase tracking-wider text-secondary-text font-bold bg-white/90 px-2 py-0.5 border border-border-subtle">
              {product.category || "Clay Brick"}
            </span>

            {product.isSample && (
              <Badge variant="sandstone" size="sm">
                Sample
              </Badge>
            )}
          </div>

          {/* Graphic Icon and Title in Placeholder Frame */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            <div className="w-10 h-10 mb-2 bg-white border border-border-subtle flex items-center justify-center text-terracotta shadow-2xs group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <p className="font-heading font-semibold text-xs text-charcoal px-2">
              {product.name}
            </p>
          </div>

          {/* Bottom attribution */}
          <div className="absolute bottom-2 inset-x-3 text-[10px] text-secondary-text flex items-center justify-between border-t border-border-subtle/60 pt-1">
            <span>DBC Kiln Kalwa</span>
            <span>Image Configurable</span>
          </div>
        </Link>

        {/* Availability Indicator when known */}
        {product.availability && (
          <div className="flex items-center gap-1.5 text-[11px] text-[#2E7D32] font-medium mb-2">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>{product.availability}</span>
          </div>
        )}

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
      </div>

      {/* Card Actions: View Details link & Enquire button */}
      <div className="pt-5 mt-5 border-t border-border-subtle flex items-center justify-between gap-3">
        <Link
          href={detailUrl}
          className="text-xs font-heading font-bold text-charcoal hover:text-terracotta transition-colors inline-flex items-center gap-1 min-h-[44px] py-2 focus-visible:outline-2 focus-visible:outline-terracotta"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        <Button
          href={enquiryUrl}
          variant="primary"
          size="sm"
        >
          Enquire
        </Button>
      </div>
    </article>
  );
}
