import Link from "next/link";
import Image from "next/image";
import { Truck, MapPin, CheckCircle2, ArrowRight } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { siteConfig } from "@/config/site";

export default function DeliverySection() {
  const deliveryPoints = [
    {
      title: "Nearby Area Coverage",
      description:
        "Direct delivery coordinated from our kiln in Village Kalwa to construction sites and plots across nearby areas.",
    },
    {
      title: "Site-Direct Coordination",
      description:
        "Transport arrangements managed directly from the bhatta gate to ensure smooth dispatch and clear site arrival communication.",
    },
    {
      title: "Batch Loading Flexibility",
      description:
        "Vehicles loaded according to project requirements—from single building plot deliveries to ongoing construction phases.",
    },
  ];

  return (
    <section className="py-14 sm:py-20 lg:py-24 bg-white border-b border-border-subtle">
      <PageContainer>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left: Heading & Information */}
          <div className="lg:col-span-6 space-y-6">
            <SectionHeading
              overline="Transport & Logistics"
              title="Bricks Delivered to Your Location."
              description="Dhanda Bhatta Company provides direct delivery services for clay brick orders to construction sites in nearby areas. We coordinate reliable haulage to keep your building work progressing smoothly."
            />

            <div className="space-y-3 pt-2">
              {deliveryPoints.map((point) => (
                <div key={point.title} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <strong className="font-heading font-semibold text-charcoal">
                      {point.title}:
                    </strong>{" "}
                    <span className="text-secondary-text">{point.description}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3">
              <Button
                href="/enquiry"
                variant="primary"
                size="lg"
                iconRight={ArrowRight}
              >
                Enquire About Delivery
              </Button>
            </div>
          </div>

          {/* Right: Architectural Dispatch Highlights Card */}
          <div className="lg:col-span-6">
            <Card surface="warm" padded={false} className="overflow-hidden border-2 border-border-subtle">
              <div className="relative aspect-16/9 w-full bg-[#1D1B19]">
                <Image
                  src="/images/delivery/truck-loading-delivery.png"
                  alt="Brick haulage truck loaded with red clay bricks at Dhanda Bhatta Company, Village Kalwa"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent pointer-events-none"
                  aria-hidden="true"
                />
                <div className="absolute bottom-3 left-3 right-3 text-[11px] text-white/95 bg-charcoal/85 backdrop-blur-xs px-3 py-1.5 flex items-center justify-between border border-white/10">
                  <span className="font-heading font-medium tracking-wide">Kiln Gate Dispatch</span>
                  <span className="text-sandstone-light">Village Kalwa, Pillukhera</span>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div className="border-b border-border-subtle pb-4">
                  <span className="text-[11px] font-heading uppercase tracking-widest text-terracotta font-bold">
                    Bhatta Dispatch Facility
                  </span>
                  <h3 className="font-heading font-bold text-xl text-charcoal mt-1">
                    Direct Kiln Gate Transport
                  </h3>
                  <p className="text-xs text-secondary-text mt-0.5">
                    Village Kalwa, Tehsil Pillukhera (Jind)
                  </p>
                </div>

              <div className="space-y-4 text-xs sm:text-sm text-secondary-text">
                <div className="flex items-start gap-3 p-3.5 bg-white border border-border-subtle">
                  <MapPin className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-charcoal block">Dispatch Origin:</strong>
                    Directly loaded at the kiln yard in Village Kalwa, ensuring single-point handling and reduced transit chipping.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 bg-white border border-border-subtle">
                  <Truck className="w-5 h-5 text-sandstone shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-charcoal block">Site Access Advisory:</strong>
                    Please ensure the approach road to your plot has adequate clearance for standard brick transport vehicles.
                  </div>
                </div>
              </div>

              <div className="pt-2 text-xs text-secondary-text flex items-center justify-between border-t border-border-subtle">
                <span>Direct transport coordination</span>
                <Link
                  href="/delivery"
                  className="font-heading font-semibold text-terracotta hover:underline inline-flex items-center gap-1"
                >
                  <span>Read delivery guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </Card>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
