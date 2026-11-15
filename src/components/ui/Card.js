import { cn } from "@/lib/utils";

/**
 * Clean Industrial Card Component
 * Crisp hairline borders, warm background or white surface.
 */
export default function Card({
  children,
  className = "",
  surface = "white", // 'white' | 'warm' | 'subtle' | 'dark'
  hover = false,
  padded = true,
  as: Component = "div",
  ...props
}) {
  const surfaces = {
    white: "bg-white border-border-subtle text-charcoal",
    warm: "bg-warm-bg border-border-subtle text-charcoal",
    subtle: "bg-[#FBF9F5] border-border-subtle text-charcoal",
    dark: "bg-charcoal text-white border-charcoal-muted",
  };

  return (
    <Component
      className={cn(
        "border transition-all duration-200",
        surfaces[surface] || surfaces.white,
        hover && "hover:border-sandstone hover:shadow-xs",
        padded && "p-6 sm:p-8",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
