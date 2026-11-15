import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import Button from "@/components/ui/Button";

/**
 * AboutPreview Section
 * Premium Editorial Layout:
 * - Genuine large kiln facility photograph (First on mobile & tablet)
 * - Concise, verified business narrative
 * - Clear location information
 * - "Discover Our Story" CTA
 * - Pure architectural aesthetic, zero unnecessary bordered boxes
 */
export default function AboutPreview() {
  return (
    <section className="py-14 sm:py-20 lg:py-24 bg-warm-bg border-b border-border-subtle">
      <PageContainer>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 items-center">
          {/* 1. Large Genuine Business Photograph (First on mobile & tablet) */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden border border-border-subtle shadow-sm bg-[#EAE4D9]">
              <Image
                src="/images/facility/kiln-hero.jpg"
                alt="Dhanda Bhatta Company brick kiln chimney and yard at Village Kalwa, Pillukhera, Jind"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-charcoal/50 via-transparent to-transparent pointer-events-none"
                aria-hidden="true"
              />
              <div className="absolute bottom-3 left-3 right-3 text-[11px] text-white/95 bg-charcoal/80 backdrop-blur-xs px-3 py-1.5 flex items-center justify-between border border-white/10">
                <span className="font-heading font-medium tracking-wide">Kiln Operations</span>
                <span className="text-sandstone-light">Village Kalwa, Pillukhera</span>
              </div>
            </div>
          </div>

          {/* 2. Editorial Narrative (Below image on mobile) */}
          <div className="lg:col-span-6 space-y-5 sm:space-y-6">
            <div className="space-y-2">
              <p className="font-heading text-xs uppercase tracking-widest font-bold text-terracotta inline-flex items-center gap-2">
                <span className="w-4 h-px bg-terracotta inline-block" />
                ABOUT OUR BHATTA
              </p>
              <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold text-charcoal tracking-tight leading-tight">
                Built on Quality. <br />
                Focused on Trust.
              </h2>
            </div>

            <div className="space-y-4 text-sm sm:text-base text-secondary-text leading-relaxed">
              <p>
                Dhanda Bhatta Company is a brick manufacturing and supply business based in Village
                Kalwa, Pillukhera, District Jind, Haryana.
              </p>
              <p>
                We serve customers looking for bricks for their construction requirements, with
                nearby-area delivery available. Get in touch with us to discuss product availability
                and bulk orders.
              </p>
            </div>

            {/* Verified Location Information */}
            <div className="pt-1 flex items-start gap-2 text-xs sm:text-sm text-charcoal">
              <MapPin className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
              <span>
                <strong>Bhatta Location:</strong> Village Kalwa, Pillukhera, District Jind, Haryana
              </span>
            </div>

            {/* Discover Our Story CTA */}
            <div className="pt-2">
              <Button
                href="/about"
                variant="outline"
                size="md"
                iconRight={ArrowRight}
                className="min-h-[44px]"
              >
                Discover Our Story
              </Button>
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
