import Link from "next/link";
import { ArrowRight, Camera, Play, Video } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { homepageGalleryItems, galleryNotice } from "@/data/gallery";

export default function GalleryPreview() {
  return (
    <section className="py-14 sm:py-20 lg:py-24 bg-warm-bg border-b border-border-subtle">
      <PageContainer>
        <SectionHeading
          overline="Visual Tour"
          title="A Closer Look at Our Bhatta"
          description="A glimpse of daily operations at Village Kalwa: clay preparation, shaded curing hacks, continuous kiln firing, and transport loading."
          align="split"
          action={
            <Button href="/gallery" variant="outline" iconRight={ArrowRight}>
              View Full Gallery
            </Button>
          }
          className="mb-10 sm:mb-12"
        />

        {/* Asymmetric Media Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6">
          {/* Main Large Feature Slot (Left 7 cols) */}
          <div className="md:col-span-7 border border-border-subtle bg-white p-4 sm:p-5 flex flex-col justify-between shadow-2xs group">
            <div className="relative aspect-16/10 w-full bg-[#E6E0D4] border border-border-subtle flex flex-col justify-between p-5 overflow-hidden group-hover:bg-[#DFD8CB] transition-colors">
              <div className="flex items-center justify-between">
                <Badge variant="terracotta" size="sm">
                  {homepageGalleryItems[0].badge}
                </Badge>
                <span className="text-[10px] text-secondary-text bg-white/80 px-2 py-0.5">
                  Featured Media Slot
                </span>
              </div>

              <div className="my-auto text-center py-6">
                <div className="w-12 h-12 mx-auto mb-2 bg-white border border-border-subtle flex items-center justify-center text-terracotta">
                  <Camera className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-base sm:text-lg text-charcoal">
                  {homepageGalleryItems[0].title}
                </h3>
                <p className="text-xs text-secondary-text mt-1 max-w-sm mx-auto">
                  {homepageGalleryItems[0].caption}
                </p>
              </div>

              <div className="text-[10px] text-secondary-text flex items-center justify-between border-t border-border-subtle pt-1">
                <span>Location: Kalwa, Pillukhera</span>
                <span className="text-terracotta">Configurable Field Photo</span>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between text-xs">
              <span className="font-heading font-bold text-charcoal">
                {homepageGalleryItems[0].title}
              </span>
              <span className="text-secondary-text text-[11px]">Continuous Firing</span>
            </div>
          </div>

          {/* Right Column (5 cols with stacked items, including video thumbnail) */}
          <div className="md:col-span-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-5">
            {/* Video Thumbnail Slot */}
            <div className="border border-border-subtle bg-white p-4 flex flex-col justify-between shadow-2xs group">
              <div className="relative aspect-16/9 w-full bg-[#252321] text-white border border-charcoal flex flex-col justify-between p-4 overflow-hidden">
                <div className="flex items-center justify-between">
                  <Badge variant="sandstone" size="sm">
                    {homepageGalleryItems[2].badge}
                  </Badge>
                  {homepageGalleryItems[2].duration && (
                    <span className="text-[10px] bg-charcoal/80 text-warm-bg px-2 py-0.5 border border-white/20">
                      {homepageGalleryItems[2].duration}
                    </span>
                  )}
                </div>

                <div className="my-auto text-center py-2">
                  <div className="w-10 h-10 mx-auto mb-1 bg-terracotta text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>
                  <p className="font-heading font-bold text-xs sm:text-sm text-white">
                    {homepageGalleryItems[2].title}
                  </p>
                </div>

                <div className="text-[10px] text-warm-bg/70 flex items-center justify-between border-t border-white/10 pt-1">
                  <span>Video Footage Slot</span>
                  <span className="text-sandstone">Village Kalwa</span>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between text-xs">
                <span className="font-heading font-semibold text-charcoal">
                  {homepageGalleryItems[2].title}
                </span>
                <span className="text-terracotta font-medium text-[11px]">Watch Tour</span>
              </div>
            </div>

            {/* Third Slot: Drying Hacks / Stacking */}
            <div className="border border-border-subtle bg-white p-4 flex flex-col justify-between shadow-2xs group">
              <div className="relative aspect-16/9 w-full bg-[#EDE6D9] border border-border-subtle flex flex-col justify-between p-4 overflow-hidden group-hover:bg-[#E5DEC7] transition-colors">
                <div className="flex items-center justify-between">
                  <Badge variant="subtle" size="sm">
                    {homepageGalleryItems[1].badge}
                  </Badge>
                  <span className="text-[10px] text-secondary-text">Kiln Yard</span>
                </div>

                <div className="my-auto text-center py-2">
                  <div className="w-9 h-9 mx-auto mb-1 bg-white border border-border-subtle flex items-center justify-center text-terracotta">
                    <Camera className="w-4 h-4" />
                  </div>
                  <p className="font-heading font-bold text-xs sm:text-sm text-charcoal">
                    {homepageGalleryItems[1].title}
                  </p>
                </div>

                <div className="text-[10px] text-secondary-text flex items-center justify-between border-t border-border-subtle pt-1">
                  <span>Sun Curing Process</span>
                  <span>Field Photo</span>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between text-xs">
                <span className="font-heading font-semibold text-charcoal">
                  {homepageGalleryItems[1].title}
                </span>
                <span className="text-secondary-text text-[11px]">Shaded Hacks</span>
              </div>
            </div>
          </div>
        </div>

        {/* View Full Gallery Center Button */}
        <div className="mt-10 text-center">
          <Button href="/gallery" variant="outline" size="md" iconRight={ArrowRight}>
            View Full Gallery
          </Button>
        </div>
      </PageContainer>
    </section>
  );
}
