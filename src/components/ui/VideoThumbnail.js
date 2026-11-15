"use client";

import { useState } from "react";
import { Play, X, Video } from "lucide-react";
import Badge from "./Badge";
import Button from "./Button";
import { cn } from "@/lib/utils";

/**
 * VideoThumbnail Component
 * Features play icon, duration badge, and video modal preview.
 */
export default function VideoThumbnail({
  title = "Bhatta Video Tour",
  caption = "Video walkthrough of cured brick stacks",
  duration = "0:45",
  badge = "Video Tour",
  videoSrc = null,
  className = "",
}) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div
        className={cn(
          "border border-border-subtle bg-white p-4 flex flex-col justify-between shadow-2xs group cursor-pointer",
          className
        )}
        onClick={() => setModalOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setModalOpen(true);
          }
        }}
        aria-label={`Play video: ${title}`}
      >
        <div className="relative aspect-16/9 w-full bg-[#252321] text-white border border-charcoal flex flex-col justify-between p-4 overflow-hidden">
          {/* Top badges */}
          <div className="flex items-center justify-between z-10">
            <Badge variant="sandstone" size="sm">
              {badge}
            </Badge>
            {duration && (
              <span className="text-[10px] bg-charcoal/85 text-warm-bg px-2 py-0.5 border border-white/20 font-mono">
                {duration}
              </span>
            )}
          </div>

          {/* Center Play Button */}
          <div className="my-auto text-center py-2 z-10">
            <div className="w-12 h-12 mx-auto mb-2 bg-terracotta text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
              <Play className="w-5 h-5 fill-white ml-0.5" />
            </div>
            <p className="font-heading font-bold text-xs sm:text-sm text-white">
              {title}
            </p>
          </div>

          {/* Bottom strip */}
          <div className="text-[10px] text-warm-bg/70 flex items-center justify-between border-t border-white/10 pt-1 z-10">
            <span>Video Footage Slot</span>
            <span className="text-sandstone">Village Kalwa</span>
          </div>
        </div>

        <div className="pt-3 flex items-center justify-between text-xs">
          <span className="font-heading font-semibold text-charcoal">{title}</span>
          <span className="text-terracotta font-medium text-[11px] group-hover:underline">
            Watch Tour →
          </span>
        </div>
      </div>

      {/* Video Modal Player */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/80 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label={title}
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl bg-[#1C1A18] border border-charcoal-muted p-5 sm:p-6 text-white shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-charcoal-muted pb-3">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-terracotta" />
                <h3 className="font-heading font-bold text-sm sm:text-base">{title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="touch-target p-2 text-warm-bg/70 hover:text-white"
                aria-label="Close video player"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Display Area */}
            <div className="relative aspect-16/9 bg-charcoal flex flex-col items-center justify-center p-6 text-center border border-white/10">
              {videoSrc ? (
                <video
                  src={videoSrc}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="space-y-3">
                  <div className="w-12 h-12 mx-auto bg-terracotta/20 border border-terracotta/40 flex items-center justify-center text-sandstone">
                    <Video className="w-6 h-6" />
                  </div>
                  <p className="font-heading font-bold text-sm sm:text-base text-white">
                    Video Media Placeholder
                  </p>
                  <p className="text-xs text-warm-bg/70 max-w-md mx-auto">
                    {caption}. Actual on-site 4K video walkthrough will be embedded once provided by the facility management.
                  </p>
                  <p className="text-[11px] text-sandstone font-mono">
                    Duration: {duration} • Location: Village Kalwa, Pillukhera
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={() => setModalOpen(false)} variant="outline" size="sm">
                Close Video
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
