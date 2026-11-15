import { Truck, MapPin, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import Card from "./Card";
import Badge from "./Badge";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Reusable DeliveryInformation component
 * Used across Delivery page, About page, and relevant sections.
 */
export default function DeliveryInformation({ className = "" }) {
  const steps = [
    {
      step: "01",
      title: "Contact Kiln Sales",
      description: "Call or send a message stating required brick quantities and your construction site location.",
    },
    {
      step: "02",
      title: "Batch & Transport Scheduling",
      description: "Our dispatch coordinator confirms current kiln batch availability and agrees on vehicle scheduling.",
    },
    {
      step: "03",
      title: "Direct Site Unloading",
      description: "Bricks are transported directly from the Kalwa bhatta to your building plot for on-site verification.",
    },
  ];

  return (
    <div className={cn("space-y-8", className)}>
      {/* 3 Step Process Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((item) => (
          <Card key={item.step} surface="white" className="space-y-3 p-5 sm:p-6">
            <span className="font-heading font-extrabold text-2xl text-sandstone">
              {item.step}
            </span>
            <h3 className="font-heading font-bold text-base text-charcoal">
              {item.title}
            </h3>
            <p className="text-xs sm:text-sm text-secondary-text leading-relaxed">
              {item.description}
            </p>
          </Card>
        ))}
      </div>

      {/* Advisory & Terms Card */}
      <div className="p-6 bg-white border border-border-subtle space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-border-subtle">
          <Truck className="w-5 h-5 text-terracotta" />
          <h4 className="font-heading font-bold text-sm sm:text-base text-charcoal">
            Bulk Order &amp; Site Access Advisory
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-secondary-text leading-relaxed">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
            <div>
              <strong className="text-charcoal block">Nearby Area Reach:</strong>
              Delivery is available to residential plots, agricultural structures, and commercial sites in nearby areas across Jind and adjoining regions.
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
            <div>
              <strong className="text-charcoal block">Approach Road Clearance:</strong>
              Ensure the site approach path has sufficient width and overhead clearance for standard brick transport vehicles.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
