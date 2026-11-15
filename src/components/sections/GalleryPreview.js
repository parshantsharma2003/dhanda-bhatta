import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Camera, Play } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { homepageGalleryItems } from "@/data/gallery";

export default function GalleryPreview() {
  return (
    <section className="py-14 sm:py-20 lg:py-24 bg-warm-bg border-b border-border-subtle">
      <PageContainer>
        <SectionHeading
          overline="Visual Tour"
          title="A Closer Look at Our Bhatta"
          description="A glimpse of daily operations at Village Kalwa: brick molding, kiln firing, stockyard storage, and transport loading."
          align="split"
          action={
            <Button href="/gallery" variant="outline" iconRight={ArrowRight}>
              View Full Gallery
            </Button>
          }
          className="mb-8 sm:mb-12"
        />

        {/* Asymmetric Media Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6">
          {/* Main Large Feature Slot (Left 7 cols) - Uses genuine kiln photo */}
          <div className="md:col-span-7 border border-border-subtle bg-white p-3 sm:p-4 flex flex-col justify-between shadow-2xs group">
            <div className="relative aspect-[16/10] w-full overflow-hidden border border-border-subtle bg-[#1D1B19]">
              <Image
                src="/images/facility/kiln-hero.jpg"
                alt="Dhanda Bhatta Company brick kiln chimney and loading yard at Village Kalwa"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-300"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent pointer-events-none"
                aria-hidden="true"
              />
              <div className="absolute top-3 left-3">
                <Badge variant="terracotta" size="sm">
                  {homepageGalleryItems[0]?.badge || "Facility Overview"}
                </Badge>
              </div>
              <div className="absolute bottom-3 left-3 right-3 text-white text-xs">
                <p className="font-heading font-bold text-sm text-white">
                  {homepageGalleryItems[0]?.title || "Kiln Chimney & Loading Yard"}
                </p>
                <p className="text-[11px] text-warm-bg/80 mt-0.5">
                  Village Kalwa, Pillukhera (Jind)
                </p>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between text-xs px-1">
              <span className="font-heading font-bold text-charcoal">
                {homepageGalleryItems[0]?.title || "Bhatta Facility & Kiln Operations"}
              </span>
              <span className="text-secondary-text text-[11px]">Kiln Operations</span>
            </div>
          </div>

          {/* Right Column (5 cols with stacked visual cards) */}
          <div className="md:col-span-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-5">
            {/* Slot 2: Kiln Operations / Video Showcase */}
            <Link
              href="/gallery"
              className="border border-border-subtle bg-white p-3 sm:p-4 flex flex-col justify-between shadow-2xs group hover:border-sandstone transition-colors"
            >
              <div className="relative aspect-[16/9] w-full bg-[#252321] text-white flex flex-col justify-between p-4 overflow-hidden">
                <div className="flex items-center justify-between">
                  <Badge variant="sandstone" size="sm">
                    {homepageGalleryItems[2]?.badge || "Video Tour"}
                  </Badge>
                  {homepageGalleryItems[2]?.duration && (
                    <span className="text-[10px] bg-charcoal/80 text-warm-bg px-2 py-0.5 border border-white/20">
                      {homepageGalleryItems[2].duration}
                    </span>
                  )}
                </div>

                <div className="my-auto text-center py-2">
                  <div className="w-10 h-10 mx-auto mb-1.5 bg-terracotta text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                  </div>
                  <p className="font-heading font-bold text-xs sm:text-sm text-white">
                    {homepageGalleryItems[2]?.title || "Kiln Operation Overview"}
                  </p>
                </div>

                <div className="text-[10px] text-warm-bg/70 flex items-center justify-between border-t border-white/10 pt-1">
                  <span>Operations Walkthrough</span>
                  <span className="text-sandstone">Village Kalwa</span>
                </div>
              </div>

              <div className="pt-2.5 flex items-center justify-between text-xs px-1">
                <span className="font-heading font-semibold text-charcoal">
                  {homepageGalleryItems[2]?.title || "Kiln Operation Overview"}
                </span>
                <span className="text-terracotta font-medium text-[11px]">Explore &rarr;</span>
              </div>
            </Link>

            {/* Slot 3: Stacking & Stockyard */}
            <Link
              href="/gallery"
              className="border border-border-subtle bg-white p-3 sm:p-4 flex flex-col justify-between shadow-2xs group hover:border-sandstone transition-colors"
            >
              <div className="relative aspect-[16/9] w-full bg-[#F0EBE1] border border-border-subtle flex flex-col justify-between p-4 overflow-hidden group-hover:bg-[#EAE4D8] transition-colors">
                <div className="flex items-center justify-between">
                  <Badge variant="subtle" size="sm">
                    {homepageGalleryItems[1]?.badge || "Stockyard"}
                  </Badge>
                  <span className="text-[10px] text-secondary-text font-medium">Kiln Yard</span>
                </div>

                <div className="my-auto text-center py-2">
                  <div className="w-9 h-9 mx-auto mb-1.5 bg-white border border-border-subtle flex items-center justify-center text-terracotta shadow-2xs">
                    <Camera className="w-4 h-4" />
                  </div>
                  <p className="font-heading font-bold text-xs sm:text-sm text-charcoal">
                    {homepageGalleryItems[1]?.title || "Brick Curing & Stacking Yard"}
                  </p>
                </div>

                <div className="text-[10px] text-secondary-text flex items-center justify-between border-t border-border-subtle pt-1">
                  <span>Stacking & Sorting</span>
                  <span>Village Kalwa</span>
                </div>
              </div>

              <div className="pt-2.5 flex items-center justify-between text-xs px-1">
                <span className="font-heading font-semibold text-charcoal">
                  {homepageGalleryItems[1]?.title || "Brick Curing & Stacking Yard"}
                </span>
                <span className="text-secondary-text text-[11px]">View Photo &rarr;</span>
              </div>
            </Link>
          </div>
        </div>

        {/* View Full Gallery Button on Mobile */}
        <div className="mt-8 text-center sm:hidden">
          <Button href="/gallery" variant="outline" size="md" iconRight={ArrowRight} className="w-full justify-center">
            View Full Gallery
          </Button>
        </div>
      </PageContainer>
    </section>
  );
}
