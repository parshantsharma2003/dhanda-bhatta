import { Layers, ShieldCheck, Truck } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";

export default function TrustHighlights() {
  const highlights = [
    {
      icon: Layers,
      title: "Brick Manufacturing",
      description:
        "Red clay brick manufacturing facility established in Village Kalwa, near Dharoli Gausala, Pillukhera.",
    },
    {
      icon: ShieldCheck,
      title: "Quality-focused Production",
      description:
        "Consistent batch firing, sharp dimensional edges, and thorough inspection for structural strength.",
    },
    {
      icon: Truck,
      title: "Nearby Area Delivery",
      description:
        "Direct vehicle transport arrangements to residential and commercial sites across Jind and nearby areas.",
    },
  ];

  return (
    <section className="bg-white border-b border-border-subtle py-6 sm:py-8">
      <PageContainer>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border-subtle">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`flex items-start gap-3.5 ${
                  index === 0
                    ? "pb-5 md:pb-0 md:pr-6"
                    : index === 1
                    ? "py-5 md:py-0 md:px-6"
                    : "pt-5 md:pt-0 md:pl-6"
                }`}
              >
                <div className="w-9 h-9 border border-sandstone/50 bg-warm-bg flex items-center justify-center text-terracotta shrink-0">
                  <Icon className="w-4 h-4" strokeWidth={1.75} />
                </div>
                <div className="space-y-0.5">
                  <h2 className="font-heading font-bold text-sm sm:text-base text-charcoal tracking-tight">
                    {item.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-secondary-text leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </PageContainer>
    </section>
  );
}
