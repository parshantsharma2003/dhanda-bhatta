"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, Layers } from "lucide-react";
import Badge from "./Badge";
import { cn } from "@/lib/utils";

/**
 * ProductImageGallery
 * Features a large primary image view and clickable thumbnail selector.
 */
export default function ProductImageGallery({ images = [], productName = "Brick Grade" }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const displayImages =
    images && images.length > 0
      ? images
      : [
          {
            src: "/images/products/placeholder.webp",
            alt: `${productName} Sample View`,
            caption: `${productName} Field Photography`,
            isPlaceholder: true,
          },
        ];

  const currentImage = displayImages[activeIndex] || displayImages[0];

  const isRealPhoto =
    currentImage.src &&
    !currentImage.isPlaceholder &&
    (currentImage.src.startsWith("http") || currentImage.src.startsWith("/images/"));

  return (
    <div className="space-y-4">
      {/* Featured Primary Image Frame */}
      <div className="relative aspect-4/3 w-full bg-[#EDE7DD] border border-border-strong overflow-hidden flex flex-col justify-between p-5 sm:p-6 shadow-sm">
        {isRealPhoto ? (
          <>
            <Image
              src={currentImage.src}
              alt={currentImage.alt || `${productName} sample view at Dhanda Bhatta Company`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent pointer-events-none" />
            <div className="relative z-10 mt-auto text-white p-2">
              <p className="font-heading font-semibold text-sm">{productName}</p>
              {currentImage.caption && (
                <p className="text-xs text-white/80">{currentImage.caption}</p>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Top Badges */}
            <div className="flex items-center justify-between text-xs z-10">
              <Badge variant="subtle" size="sm" className="bg-white/90">
                Field Media Frame
              </Badge>

              {currentImage.isPlaceholder && (
                <span className="text-[10px] font-heading uppercase tracking-wider text-secondary-text bg-white/90 px-2 py-0.5 border border-border-subtle">
                  Placeholder Slot
                </span>
              )}
            </div>

            {/* Center Graphic */}
            <div className="my-auto text-center py-6">
              <div className="w-14 h-14 mx-auto mb-3 bg-white border border-border-subtle flex items-center justify-center text-terracotta shadow-xs">
                <Layers className="w-7 h-7" />
              </div>
              <h2 className="font-heading font-bold text-base sm:text-lg text-charcoal">
                {productName}
              </h2>
              {currentImage.caption && (
                <p className="text-xs text-secondary-text mt-1 max-w-sm mx-auto">
                  {currentImage.caption}
                </p>
              )}
            </div>

            {/* Bottom Attribution */}
            <div className="pt-2 border-t border-border-subtle/80 flex items-center justify-between text-[11px] text-secondary-text">
              <span>Village Kalwa, Pillukhera</span>
              <span className="text-terracotta font-medium">Kiln-Fired Clay Brick</span>
            </div>
          </>
        )}
      </div>

      {/* Thumbnails (Rendered only if multiple images exist) */}
      {displayImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1" role="tablist" aria-label="Product thumbnails">
          {displayImages.map((img, idx) => (
            <button
              key={img.src || idx}
              type="button"
              role="tab"
              aria-selected={activeIndex === idx}
              onClick={() => setActiveIndex(idx)}
              className={cn(
                "relative aspect-4/3 w-20 sm:w-24 bg-[#EAE4D9] border p-1 text-center shrink-0 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-terracotta",
                activeIndex === idx
                  ? "border-terracotta ring-1 ring-terracotta shadow-xs"
                  : "border-border-subtle hover:border-sandstone opacity-75 hover:opacity-100"
              )}
              aria-label={`View ${img.alt || `Image ${idx + 1}`}`}
            >
              <div className="h-full flex flex-col items-center justify-center text-[10px] text-secondary-text">
                <Camera className="w-3.5 h-3.5 text-terracotta mb-0.5" />
                <span className="truncate max-w-[70px]">View 0{idx + 1}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
