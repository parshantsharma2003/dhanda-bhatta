import { cn } from "@/lib/utils";

/**
 * Editorial Badge / Tag Component
 */
export default function Badge({
  children,
  variant = "subtle",
  size = "md",
  className = "",
}) {
  const variants = {
    subtle: "bg-warm-bg text-charcoal border border-border-subtle",
    terracotta: "bg-terracotta-tint text-terracotta border border-terracotta/30",
    charcoal: "bg-charcoal text-white border border-charcoal",
    sandstone: "bg-sandstone-tint text-charcoal border border-sandstone/40",
    solidTerracotta: "bg-terracotta text-white font-medium",
  };

  const sizes = {
    sm: "text-[11px] px-2 py-0.5 tracking-wider uppercase",
    md: "text-xs px-2.5 py-1 tracking-wide font-medium",
    lg: "text-sm px-3 py-1.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-heading rounded-none select-none",
        variants[variant] || variants.subtle,
        sizes[size] || sizes.md,
        className
      )}
    >
      {children}
    </span>
  );
}
