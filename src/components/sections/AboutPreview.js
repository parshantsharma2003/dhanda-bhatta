import Link from "next/link";
import { ArrowRight, MapPin, Camera } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import Button from "@/components/ui/Button";
import { siteConfig } from "@/config/site";

export default function AboutPreview() {
  return (
    <section className="py-14 sm:py-20 lg:py-24 bg-warm-bg border-b border-border-subtle">
      <PageContainer>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left: Large Image Area for actual bhatta photography */}
          <div className="lg:col-span-6">
            <div className="border border-border-strong bg-white p-3 sm:p-4 shadow-sm relative">
              {/* Photo Frame / Configurable Media Slot */}
              <div className="relative aspect-4/3 sm:aspect-16/10 w-full bg-[#E8E2D6] border border-border-subtle flex flex-col justify-between p-5 overflow-hidden">
                {/* Subtle texture/stamp */}
                <div className="flex items-center justify-between text-xs text-secondary-text">
                  <span className="font-heading font-semibold text-terracotta uppercase tracking-wider text-[11px]">
                    Kalwa Bhatta Yard
                  </span>
                  <span className="text-[10px] bg-white/80 border border-border-subtle px-2 py-0.5">
                    Field Media Slot
                  </span>
                </div>

                <div className="my-auto text-center py-6">
                  <div className="w-12 h-12 mx-auto mb-2 bg-white border border-border-strong flex items-center justify-center text-terracotta">
                    <Camera className="w-6 h-6" />
                  </div>
                  <p className="font-heading font-bold text-sm sm:text-base text-charcoal">
                    Bhatta Facility &amp; Kiln Operations
                  </p>
                  <p className="text-xs text-secondary-text mt-1 max-w-xs mx-auto">
                    Authentic kiln overview photograph from Village Kalwa, Pillukhera
                  </p>
                </div>

                <div className="pt-2 border-t border-border-subtle text-[11px] text-secondary-text flex items-center justify-between">
                  <span>Dhanda Bhatta Company</span>
                  <span className="text-terracotta font-medium">Configurable in siteConfig.media.about</span>
                </div>
              </div>

              {/* Caption */}
              <p className="pt-3 text-xs text-secondary-text flex items-center justify-between px-1">
                <span>Traditional clay brick manufacturing</span>
                <span className="text-charcoal font-medium">Jind, Haryana</span>
              </p>
            </div>
          </div>

          {/* Right: Editorial Narrative */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <p className="font-heading text-xs uppercase tracking-widest font-bold text-terracotta inline-flex items-center gap-2">
                <span className="w-4 h-px bg-terracotta inline-block" />
                ABOUT OUR BHATTA
              </p>
              <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold text-charcoal tracking-tight leading-tight">
                Building with Quality. <br />
                Delivering with Trust.
              </h2>
            </div>

            <div className="space-y-4 text-sm sm:text-base text-secondary-text leading-relaxed">
              <p>
                Dhanda Bhatta Company is an established brick manufacturing and supply business located in
                Village Kalwa, near Pillukhera in District Jind, Haryana. We specialize in producing quality
                red clay bricks engineered to support durable residential, commercial, and agricultural
                structures.
              </p>
              <p>
                Our production follows traditional brickmaking principles: utilizing suitable regional clay,
                careful drying, and thorough kiln firing to achieve solid structural integrity. With dedicated
                transport coordination, we ensure reliable delivery of brick batches directly to construction
                sites in nearby areas.
              </p>
            </div>

            {/* Quick Location Badge */}
            <div className="p-3.5 bg-white border border-border-subtle text-xs sm:text-sm text-charcoal flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-terracotta shrink-0" />
              <span>
                <strong>Bhatta Location:</strong> Village Kalwa, Tehsil Pillukhera, District Jind, Haryana
              </span>
            </div>

            <div className="pt-2">
              <Button
                href="/about"
                variant="outline"
                size="md"
                iconRight={ArrowRight}
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
