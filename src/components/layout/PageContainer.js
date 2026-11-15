import { cn } from "@/lib/utils";

/**
 * Responsive Page Container
 * Provides uniform gutters across 360px, 390px, 430px, 768px, 1024px, 1440px.
 */
export default function PageContainer({
  children,
  className = "",
  size = "default", // 'default' | 'narrow' | 'wide' | 'full'
  as: Component = "div",
  ...props
}) {
  const sizeClasses = {
    narrow: "max-w-4xl",
    default: "max-w-7xl",
    wide: "max-w-[1400px]",
    full: "max-w-none",
  };

  return (
    <Component
      className={cn(
        "w-full mx-auto px-5 sm:px-6 lg:px-8",
        sizeClasses[size] || sizeClasses.default,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
