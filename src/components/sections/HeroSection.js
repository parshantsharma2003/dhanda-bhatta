import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Phone, MapPin, Layers, Camera } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import Button from "@/components/ui/Button";
import { siteConfig } from "@/config/site";

export default function HeroSection({ cmsData = null }) {
  const tagline = cmsData?.heroTagline || "BRICK MANUFACTURER | KALWA, JIND";
  const headline = cmsData?.heroHeadline;
  const description =
    cmsData?.heroDescription ||
    "Quality clay bricks for homes, commercial buildings and construction projects.";
  const primaryText = cmsData?.primaryCtaText || "Explore Our Bricks";
  const primaryHref = cmsData?.primaryCtaLink || "/products";
  const secondaryText = cmsData?.secondaryCtaText || "Contact Our Team";
  const secondaryHref = cmsData?.secondaryCtaLink || "/contact";
  const bannerImage = cmsData?.bannerImageUrl || null;
  return (
    <section className="relative bg-charcoal text-white overflow-hidden border-b border-charcoal-muted">
      {/* Subtle architectural grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#F6F3ED 1px, transparent 1px), linear-gradient(to right, #F6F3ED 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden="true"
      />

      {/* Warm sunlight gradient accent in background */}
      <div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#963D32]/20 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <PageContainer className="relative py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Text Content Column */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2">
              <span className="w-5 h-px bg-sandstone inline-block" />
              <p className="font-heading text-xs sm:text-sm uppercase tracking-widest font-semibold text-sandstone">
                {tagline}
              </p>
            </div>

            {/* Main Heading */}
            {headline ? (
              <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] uppercase">
                {headline}
              </h1>
            ) : (
              <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
                Building Stronger <br className="hidden sm:inline" />
                <span className="text-sandstone-light">Foundations.</span>
              </h1>
            )}

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-warm-bg/85 max-w-xl leading-relaxed">
              {description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2 sm:pt-4">
              <Button
                href={primaryHref}
                variant="primary"
                size="lg"
                iconRight={ArrowRight}
                className="justify-center"
              >
                {primaryText}
              </Button>
              <Button
                href={secondaryHref}
                variant="outline"
                size="lg"
                className="justify-center border-sandstone/50 text-warm-bg hover:bg-white/10 hover:border-sandstone hover:text-white"
              >
                {secondaryText}
              </Button>
            </div>

            {/* Verified Location & Delivery Note */}
            <div className="pt-4 border-t border-charcoal-muted/70 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-warm-bg/70">
              <span className="inline-flex items-center gap-1.5 text-sandstone">
                <MapPin className="w-3.5 h-3.5" />
                <span>Village Kalwa, Pillukhera (Jind)</span>
              </span>
              <span className="text-charcoal-muted hidden sm:inline">•</span>
              <span>Delivery available in nearby areas</span>
            </div>
          </div>

          {/* Authentic Bhatta Photographic Showcase / Configurable Placeholder */}
          <div className="lg:col-span-5">
            <div className="relative border border-sandstone/30 bg-[#1D1B19] p-4 sm:p-5 shadow-2xl">
              {/* Corner Tag */}
              <div className="absolute top-3 right-3 z-10 bg-charcoal/90 border border-sandstone/40 px-2.5 py-1 text-[10px] uppercase font-heading tracking-widest text-sandstone">
                Kiln Facility
              </div>

              {/* Visual Framing */}
              <div className="relative aspect-4/3 w-full bg-gradient-to-br from-[#2D2926] via-[#24211F] to-[#1A1817] border border-border-subtle/10 flex flex-col justify-between p-5 overflow-hidden">
                {bannerImage ? (
                  <>
                    <Image
                      src={bannerImage}
                      alt="Dhanda Bhatta Company brick kiln facility at Village Kalwa, Pillukhera, Jind"
                      priority
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-black/20 pointer-events-none"
                      aria-hidden="true"
                    />
                  </>
                ) : (
                  <>
                    {/* Sunlight & Terracotta Glow overlay */}
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-[#963D32]/15 pointer-events-none"
                      aria-hidden="true"
                    />

                    {/* Architectural Brick Stacking Line Graphic */}
                    <div className="relative z-10 flex items-center justify-between text-xs text-warm-bg/60">
                      <span className="font-heading uppercase tracking-wider text-[11px] text-sandstone">
                        Dhanda Bhatta Co.
                      </span>
                      <span className="text-[10px] text-warm-bg/50">Kalwa, Haryana</span>
                    </div>

                    {/* Center Kiln Icon / Composition */}
                    <div className="relative z-10 my-auto text-center py-4">
                      <div className="w-14 h-14 mx-auto mb-3 rounded-none bg-terracotta/20 border border-terracotta/40 flex items-center justify-center text-sandstone shadow-inner">
                        <Layers className="w-7 h-7 text-sandstone" />
                      </div>
                      <p className="font-heading font-bold text-sm sm:text-base text-white tracking-wide">
                        Authentic Brick Kiln Media
                      </p>
                      <p className="text-xs text-warm-bg/70 mt-1 max-w-xs mx-auto">
                        Village Kalwa continuous kiln firing &amp; stockyard
                      </p>
                    </div>

                    {/* Bottom Configurable Note */}
                    <div className="relative z-10 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-warm-bg/60">
                      <span className="inline-flex items-center gap-1">
                        <Camera className="w-3 h-3 text-sandstone" />
                        <span>Configurable Field Photo</span>
                      </span>
                      <span className="text-sandstone-light">Ref: {siteConfig.media.hero.src}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Caption below frame */}
              <div className="pt-3 text-xs text-warm-bg/70 flex items-center justify-between">
                <span>Traditional clay brick manufacturing</span>
                <span className="text-sandstone font-medium">Kalwa, Pillukhera</span>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
