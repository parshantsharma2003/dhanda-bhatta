"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Camera, Video } from "lucide-react";
import Badge from "./Badge";

/**
 * Accessible Gallery Lightbox
 * Supports keyboard navigation (Escape, ArrowLeft, ArrowRight) and touch controls.
 */
export default function GalleryLightbox({
  items = [],
  currentIndex = 0,
  isOpen = false,
  onClose,
  onPrev,
  onNext,
}) {
  const currentItem = items[currentIndex];

  // Lock body scroll while lightbox is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Handle keyboard events
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        onPrev();
      } else if (e.key === "ArrowRight") {
        onNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onPrev, onNext]);

  if (!isOpen || !currentItem) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/90 backdrop-blur-md p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Lightbox image preview: ${currentItem.title}`}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#1C1A18] border border-charcoal-muted text-white shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Lightbox Header Bar */}
        <div className="flex items-center justify-between p-4 border-b border-charcoal-muted bg-[#151413]">
          <div className="flex items-center gap-3">
            <Badge variant="terracotta" size="sm">
              {currentItem.categoryLabel || currentItem.badge || "Gallery"}
            </Badge>
            <span className="text-xs text-warm-bg/70 font-mono">
              {currentIndex + 1} of {items.length}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="touch-target p-2 text-warm-bg/70 hover:text-white transition-colors"
            aria-label="Close image lightbox"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Media Frame Area */}
        <div className="relative aspect-16/10 sm:aspect-16/9 bg-[#1C1A18] flex flex-col items-center justify-center text-center overflow-hidden">
          {/* Previous Button */}
          <button
            type="button"
            onClick={onPrev}
            className="touch-target p-2 absolute left-3 top-1/2 -translate-y-1/2 z-30 bg-charcoal/80 hover:bg-terracotta text-white border border-white/20 transition-colors"
            aria-label="Previous media item"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Next Button */}
          <button
            type="button"
            onClick={onNext}
            className="touch-target p-2 absolute right-3 top-1/2 -translate-y-1/2 z-30 bg-charcoal/80 hover:bg-terracotta text-white border border-white/20 transition-colors"
            aria-label="Next media item"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Media Content Display */}
          {currentItem.mediaSrc ? (
            <div className="relative w-full h-full">
              <Image
                src={currentItem.mediaSrc}
                alt={currentItem.title}
                fill
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-contain"
                priority
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/95 via-charcoal/70 to-transparent p-4 sm:p-6 text-left z-20">
                <h3 className="font-heading font-bold text-base sm:text-lg text-white">
                  {currentItem.title}
                </h3>
                <p className="text-xs sm:text-sm text-warm-bg/90 mt-1 max-w-2xl leading-relaxed">
                  {currentItem.caption}
                </p>
              </div>
            </div>
          ) : (
            <div className="my-auto max-w-lg space-y-3 px-8 p-6">
              <div className="w-14 h-14 mx-auto bg-terracotta/20 border border-terracotta/40 flex items-center justify-center text-sandstone shadow-inner">
                {currentItem.type === "video" ? (
                  <Video className="w-7 h-7" />
                ) : (
                  <Camera className="w-7 h-7" />
                )}
              </div>

              <h3 className="font-heading font-bold text-lg sm:text-xl text-white">
                {currentItem.title}
              </h3>

              <p className="text-xs sm:text-sm text-warm-bg/80 leading-relaxed">
                {currentItem.caption}
              </p>

              {currentItem.specsRequired && (
                <p className="text-[11px] text-sandstone pt-2 border-t border-white/10">
                  Documentation Standard: {currentItem.specsRequired}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Lightbox Footer Bar */}
        <div className="p-4 border-t border-charcoal-muted bg-[#151413] flex items-center justify-between text-xs text-warm-bg/60">
          <span>Village Kalwa, Pillukhera, Jind</span>
          <span className="hidden sm:inline">Use ← and → arrow keys to navigate</span>
        </div>
      </div>
    </div>
  );
}
