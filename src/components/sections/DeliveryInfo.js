import Link from "next/link";
import { Truck, MapPin, Clock, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { primaryDeliveryZones, fleetVehicles } from "@/data/deliveryZones";

export default function DeliveryInfo() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-warm-bg border-b border-border-subtle">
      <PageContainer>
        <SectionHeading
          overline="Logistics & Fleet"
          title="Direct Kiln Dispatch Across Haryana"
          description="We operate dedicated transportation options to ensure timely delivery directly to your building plot, farmhouse, or commercial site."
          align="split"
          action={
            <Button href="/delivery" variant="outline" iconRight={ArrowRight}>
              Delivery Zones &amp; Policies
            </Button>
          }
          className="mb-12"
        />

        {/* 3 Delivery Zones Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {primaryDeliveryZones.map((zone) => (
            <Card
              key={zone.zone}
              surface="white"
              hover
              className="flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
                  <span className="text-[11px] font-heading uppercase tracking-widest font-bold text-terracotta">
                    {zone.tag}
                  </span>
                  <span className="text-xs text-secondary-text flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-sandstone" />
                    {zone.transitTime}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-lg text-charcoal">
                  {zone.zone.split(":")[0]}
                </h3>

                <div>
                  <p className="text-[11px] font-heading uppercase tracking-wider text-secondary-text font-semibold mb-2">
                    Key Coverage Towns:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {zone.towns.map((town) => (
                      <span
                        key={town}
                        className="text-xs bg-warm-bg border border-border-subtle px-2 py-1 text-charcoal"
                      >
                        {town}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 text-xs text-secondary-text">
                  <p>
                    <strong className="text-charcoal font-medium">Min. Order:</strong> {zone.minOrder}
                  </p>
                  <p className="line-clamp-2">{zone.notes}</p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-border-subtle">
                <Link
                  href="/order"
                  className="text-xs font-heading font-bold text-terracotta hover:underline inline-flex items-center gap-1"
                >
                  <span>Book Delivery To This Zone</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {/* Vehicle Comparison Strip */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 sm:p-8 bg-white border border-border-subtle">
          {fleetVehicles.map((vehicle) => (
            <div key={vehicle.name} className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-terracotta text-white flex items-center justify-center">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-base text-charcoal">
                    {vehicle.name}
                  </h4>
                  <p className="text-xs text-terracotta font-semibold">
                    Capacity: {vehicle.capacity}
                  </p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-secondary-text leading-relaxed">
                {vehicle.bestFor}
              </p>
              <div className="text-xs text-charcoal space-y-1 bg-warm-bg p-3 border border-border-subtle">
                <p>
                  <strong>Unloading:</strong> {vehicle.unloading}
                </p>
                <p>
                  <strong>Site Access:</strong> {vehicle.accessibility}
                </p>
              </div>
            </div>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
