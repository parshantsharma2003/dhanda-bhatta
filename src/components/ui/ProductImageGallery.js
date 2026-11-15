"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * ProductImageGallery
 * Premium Architectural Presentation:
 * - High-resolution image viewport with consistent 4:3 ratio
 * - Clean, deliberate architectural fallback when grade-specific photographs are awaiting owner upload
 * - Zero generic placeholder icons or configuration debug strings
 */
export default function ProductImageGallery({ images = [], productName = "Brick Grade" }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const displayImages = images && images.length > 0 ? images : [];
  const currentImage = displayImages[activeIndex] || displayImages[0];

  const isRealPhoto = Boolean(
    currentImage?.src &&
      !currentImage.isPlaceholder &&
      (currentImage.src.startsWith("http://") ||
        currentImage.src.startsWith("https://") ||
        currentImage.src.startsWith("/images/facility/") ||
        currentImage.src.startsWith("/images/products/") ||
        currentImage.src.startsWith("/images/delivery/") ||
        currentImage.src.startsWith("/images/gallery/"))
  );

  return (
    <div className="space-y-4">
      {/* Featured Primary Image Frame */}
      <div className="relative aspect-4/3 w-full bg-[#F6F3EE] border border-border-strong overflow-hidden flex flex-col justify-between p-5 sm:p-6 shadow-xs">
        {isRealPhoto ? (
          <>
            <Image
              src={currentImage.src}
              alt={currentImage.alt || `${productName} at Dhanda Bhatta Company`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent pointer-events-none" />
            <div className="relative z-10 mt-auto text-white p-2">
              <p className="font-heading font-semibold text-sm sm:text-base">{productName}</p>
              {currentImage.caption && (
                <p className="text-xs text-white/80">{currentImage.caption}</p>
              )}
            </div>
          </>
        ) : (
          /* Deliberate Clean Architectural Fallback */
          <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-6 select-none bg-gradient-to-br from-[#F8F5EE] via-[#EFE9DF] to-[#E5DDD0]">
            {/* Top Meta Badges */}
            <div className="flex items-center justify-between text-xs z-10">
              <span className="text-[11px] font-heading uppercase tracking-wider font-semibold text-secondary-text bg-white/95 px-3 py-1 border border-border-subtle shadow-2xs">
                Clay Masonry Unit
              </span>

              <span className="text-[11px] font-heading uppercase tracking-wider font-semibold text-terracotta bg-white/95 px-3 py-1 border border-border-subtle shadow-2xs">
                Village Kalwa
              </span>
            </div>

            {/* Center Architectural Drafting Graphic */}
            <div className="my-auto text-center py-4">
              <svg
                className="w-20 h-12 mx-auto text-sandstone/80 mb-3"
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
              <h2 className="font-heading font-bold text-lg sm:text-xl text-charcoal">
                {productName}
              </h2>
              <p className="text-xs text-secondary-text mt-1 max-w-sm mx-auto">
                Kiln batch production &middot; Direct supply from Village Kalwa, Pillukhera
              </p>
            </div>

            {/* Bottom Origin Specification */}
            <div className="pt-2.5 border-t border-border-subtle/80 flex items-center justify-between text-xs text-secondary-text">
              <span>Origin: Tehsil Pillukhera, Jind</span>
              <span className="text-charcoal font-medium">Standard Brick Format</span>
            </div>
          </div>
        )}
      </div>

      {/* Thumbnails (Rendered only if multiple real images exist) */}
      {displayImages.length > 1 && isRealPhoto && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1" role="tablist" aria-label="Product thumbnails">
          {displayImages.map((img, idx) => (
            <button
              key={img.src || idx}
              type="button"
              role="tab"
              aria-selected={activeIndex === idx}
              onClick={() => setActiveIndex(idx)}
              className={cn(
                "relative aspect-4/3 w-20 sm:w-24 shrink-0 border overflow-hidden cursor-pointer focus-visible:outline-2 focus-visible:outline-terracotta",
                activeIndex === idx
                  ? "border-terracotta ring-1 ring-terracotta"
                  : "border-border-subtle opacity-70 hover:opacity-100"
              )}
            >
              <Image
                src={img.src}
                alt={img.alt || `${productName} view ${idx + 1}`}
                fill
                sizes="96px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
