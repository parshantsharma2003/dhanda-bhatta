"use client";

import { useState } from "react";
import { Camera, Eye } from "lucide-react";
import Badge from "./Badge";
import GalleryLightbox from "./GalleryLightbox";
import VideoThumbnail from "./VideoThumbnail";
import { cn } from "@/lib/utils";

/**
 * Responsive GalleryGrid with category filter tabs and interactive lightbox modal.
 */
export default function GalleryGrid({
  items = [],
  categories = [
    { id: "all", label: "All Media" },
    { id: "bhatta", label: "Bhatta & Kiln" },
    { id: "manufacturing", label: "Manufacturing" },
    { id: "bricks", label: "Bricks & Stock" },
    { id: "delivery", label: "Delivery & Dispatch" },
  ],
}) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeLightboxIndex, setActiveLightboxIndex] = useState(0);

  const filteredItems =
    activeCategory === "all"
      ? items
      : items.filter((item) => item.category === activeCategory);

  const openLightboxAt = (index) => {
    setActiveLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleNext = () => {
    setActiveLightboxIndex((prev) => (prev + 1) % filteredItems.length);
  };

  const handlePrev = () => {
    setActiveLightboxIndex(
      (prev) => (prev - 1 + filteredItems.length) % filteredItems.length
    );
  };

  return (
    <div className="space-y-8">
      {/* Category Filter Tabs */}
      <div
        className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-border-subtle"
        role="tablist"
        aria-label="Gallery filter categories"
      >
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            role="tab"
            aria-selected={activeCategory === cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "touch-target px-4 py-2 text-xs font-heading uppercase tracking-wider font-semibold transition-colors shrink-0 whitespace-nowrap cursor-pointer",
              activeCategory === cat.id
                ? "bg-terracotta text-white"
                : "bg-white text-charcoal border border-border-subtle hover:bg-warm-bg"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Gallery Grid (Asymmetric & Responsive) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredItems.map((item, idx) => {
          if (item.type === "video") {
            return (
              <VideoThumbnail
                key={item.id}
                title={item.title}
                caption={item.caption}
                duration={item.duration}
                badge={item.badge}
              />
            );
          }

          return (
            <div
              key={item.id}
              className="border border-border-subtle bg-white flex flex-col justify-between overflow-hidden shadow-2xs hover:border-sandstone transition-colors group cursor-pointer"
              onClick={() => openLightboxAt(idx)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openLightboxAt(idx);
                }
              }}
              aria-label={`Open photo preview: ${item.title}`}
            >
              {/* Image Frame */}
              <div
                className={cn(
                  "relative w-full bg-[#ECE6DC] flex flex-col justify-between p-4 overflow-hidden group-hover:bg-[#E4DDCF] transition-colors",
                  item.aspect === "16/9" ? "aspect-16/9" : "aspect-4/3"
                )}
              >
                <div className="flex items-center justify-between z-10">
                  <Badge variant="subtle" size="sm" className="bg-white/90">
                    {item.badge || item.categoryLabel}
                  </Badge>
                  <span className="text-[10px] text-secondary-text bg-white/80 px-2 py-0.5">
                    Field Media
                  </span>
                </div>

                <div className="my-auto text-center py-4">
                  <div className="w-10 h-10 mx-auto mb-2 bg-white/90 border border-border-subtle flex items-center justify-center text-terracotta group-hover:scale-105 transition-transform">
                    <Camera className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-bold text-xs sm:text-sm text-charcoal px-2">
                    {item.title}
                  </h3>
                </div>

                <div className="text-[10px] text-secondary-text flex items-center justify-between border-t border-border-subtle/70 pt-1">
                  <span>Village Kalwa</span>
                  <span className="text-terracotta inline-flex items-center gap-1 font-medium">
                    <Eye className="w-3 h-3" />
                    Preview
                  </span>
                </div>
              </div>

              {/* Caption Card Body */}
              <div className="p-4 space-y-2 bg-white">
                <p className="text-xs text-secondary-text leading-relaxed">
                  {item.caption}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      <GalleryLightbox
        items={filteredItems}
        currentIndex={activeLightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </div>
  );
}
