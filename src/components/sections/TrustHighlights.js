import { Layers, ShieldCheck, Truck } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";

export default function TrustHighlights() {
  const highlights = [
    {
      icon: Layers,
      title: "Brick Manufacturing",
      description: "Traditional red clay brick manufacturing facility based in Village Kalwa, Pillukhera.",
    },
    {
      icon: ShieldCheck,
      title: "Quality-focused Production",
      description: "Carefully selected alluvial clay, disciplined sun-curing, and continuous kiln firing.",
    },
    {
      icon: Truck,
      title: "Nearby Area Delivery",
      description: "Direct transport arrangements to building sites across Jind and surrounding areas.",
    },
  ];

  return (
    <section className="bg-white border-b border-border-subtle py-8 sm:py-10">
      <PageContainer>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border-subtle">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`flex items-start gap-4 ${
                  index === 0
                    ? "pb-6 md:pb-0 md:pr-6"
                    : index === 1
                    ? "py-6 md:py-0 md:px-6"
                    : "pt-6 md:pt-0 md:pl-6"
                }`}
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 border border-sandstone/50 bg-warm-bg flex items-center justify-center text-terracotta shrink-0">
                  <Icon className="w-5 h-5" strokeWidth={1.75} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-heading font-bold text-sm sm:text-base text-charcoal">
                    {item.title}
                  </h3>
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
