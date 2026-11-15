import { Truck, CheckCircle2, Phone, ArrowRight } from "lucide-react";
import Button from "./Button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Reusable DeliveryInformation component
 * Clear 3-step delivery process and honest site access advisory.
 * No invented logistics claims or technical dashboard panels.
 */
export default function DeliveryInformation({ className = "" }) {
  const steps = [
    {
      step: "01",
      title: "Share Your Brick Requirements",
      description:
        "Contact our team with the brick grade, required quantity, and your construction site location in nearby areas.",
    },
    {
      step: "02",
      title: "Confirm Availability & Site Location",
      description:
        "We verify current kiln batch readiness and check vehicle approach access to your building plot.",
    },
    {
      step: "03",
      title: "Coordinate Pricing & Transport",
      description:
        "We arrange delivery timing and transparent haulage arrangements directly to your plot gate.",
    },
  ];

  return (
    <div className={cn("space-y-8", className)}>
      {/* 3 Step Process Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((item) => (
          <div
            key={item.step}
            className="bg-white border border-border-subtle p-6 flex flex-col justify-between space-y-4 shadow-2xs hover:border-sandstone transition-colors"
          >
            <div className="space-y-2">
              <span className="font-heading font-extrabold text-2xl text-sandstone">
                {item.step}
              </span>
              <h3 className="font-heading font-bold text-base text-charcoal">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-secondary-text leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Dispatch & Site Access Advisory */}
      <div className="p-6 bg-white border border-border-subtle space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border-subtle">
          <Truck className="w-5 h-5 text-terracotta shrink-0" />
          <h4 className="font-heading font-bold text-sm sm:text-base text-charcoal">
            Site Delivery &amp; Unloading Guidelines
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-secondary-text leading-relaxed">
          <div className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-terracotta shrink-0 mt-2" />
            <div>
              <strong className="text-charcoal block font-semibold">Approach Road Clearance:</strong>
              Ensure the access road to your building plot has sufficient width and firm ground for delivery vehicles.
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sandstone shrink-0 mt-2" />
            <div>
              <strong className="text-charcoal block font-semibold">Designated Staging Area:</strong>
              Keep a level and clear space ready adjacent to your masonry work area for direct plot unloading.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
