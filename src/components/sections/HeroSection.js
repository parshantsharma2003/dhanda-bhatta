import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin, Phone } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import Button from "@/components/ui/Button";
import { siteConfig } from "@/config/site";

export default function HeroSection({ cmsData = null }) {
  const tagline = cmsData?.heroTagline || "BRICK MANUFACTURER | JIND, HARYANA";
  const headline = cmsData?.heroHeadline || "Bricks made for stronger foundations.";
  const description =
    cmsData?.heroDescription ||
    "Quality red clay bricks manufactured in Village Kalwa, Pillukhera. Direct kiln supply and batch delivery across nearby areas.";
  const primaryText = cmsData?.primaryCtaText || "Explore Our Bricks";
  const primaryHref = cmsData?.primaryCtaLink || "/products";
  const secondaryText = cmsData?.secondaryCtaText || "Contact Our Team";
  const secondaryHref = cmsData?.secondaryCtaLink || "/contact";
  const bannerImage = cmsData?.bannerImageUrl || "/images/facility/kiln-hero.jpg";

  return (
    <section className="relative bg-charcoal text-white overflow-hidden border-b border-charcoal-muted">
      {/* 1. Large Genuine Brick-Kiln Photograph Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src={bannerImage}
          alt="Dhanda Bhatta Company brick kiln chimney and facility at Village Kalwa, Pillukhera, Jind"
          priority
          fetchPriority="high"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
          className="object-cover object-[center_30%] md:object-[center_25%]"
        />

        {/* 2. Carefully Designed Dark Gradient Overlay for Maximum Readability */}
        {/* Mobile: Strong gradient from solid charcoal at bottom to dark veil at top */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/95 via-50% to-charcoal/75 lg:hidden"
          aria-hidden="true"
        />

        {/* Desktop: Horizontal directional gradient preserving kiln imagery on right */}
        <div
          className="hidden lg:block absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/92 via-45% to-charcoal/25"
          aria-hidden="true"
        />
        <div
          className="hidden lg:block absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-black/20"
          aria-hidden="true"
        />
      </div>

      {/* 3. Hero Content Container */}
      <PageContainer className="relative z-10 py-16 sm:py-20 md:py-24 lg:py-32 flex flex-col justify-end min-h-[580px] sm:min-h-[640px] lg:min-h-[680px]">
        <div className="max-w-2xl space-y-6 sm:space-y-7">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2.5">
            <span className="w-5 h-px bg-sandstone inline-block shrink-0" />
            <p className="font-heading text-xs sm:text-sm uppercase tracking-widest font-semibold text-sandstone">
              {tagline}
            </p>
          </div>

          {/* Refined Headline - Sentence Case, Responsive Scaling */}
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
            {headline}
          </h1>

          {/* Concise Supporting Copy */}
          <p className="text-base sm:text-lg text-warm-bg/90 leading-relaxed font-normal max-w-xl">
            {description}
          </p>

          {/* Action Buttons: 1 Prominent Terracotta CTA + 1 Restrained Secondary CTA */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 sm:pt-4">
            <Button
              href={primaryHref}
              variant="primary"
              size="lg"
              iconRight={ArrowRight}
              className="justify-center shadow-md min-h-[48px]"
            >
              {primaryText}
            </Button>
            <Button
              href={secondaryHref}
              variant="outline"
              size="lg"
              className="justify-center border-sandstone/60 text-warm-bg hover:bg-white/10 hover:border-sandstone hover:text-white min-h-[48px]"
            >
              {secondaryText}
            </Button>
          </div>

          {/* Verified Location & Delivery Note */}
          <div className="pt-4 border-t border-white/20 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-warm-bg/90">
            <span className="inline-flex items-center gap-1.5 text-sandstone">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>Village Kalwa, Pillukhera (Jind)</span>
            </span>
            <span className="text-white/60 hidden sm:inline">•</span>
            <span>Delivery available in nearby areas</span>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
