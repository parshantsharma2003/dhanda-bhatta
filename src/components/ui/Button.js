import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Premium Industrial Button Component
 * Guarantees minimum 44px touch target on interactive screen spaces.
 */
export default function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  iconLeft: IconLeft,
  iconRight: IconRight,
  type = "button",
  onClick,
  target,
  rel,
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-200 select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta disabled:opacity-50 disabled:pointer-events-none cursor-pointer tracking-wide";

  const variants = {
    primary:
      "bg-terracotta text-white hover:bg-terracotta-hover active:bg-terracotta-dark shadow-xs",
    secondary:
      "bg-charcoal text-white hover:bg-charcoal-muted active:bg-black",
    outline:
      "border border-border-strong bg-transparent text-charcoal hover:bg-warm-bg hover:border-terracotta hover:text-terracotta",
    sandstone:
      "bg-sandstone text-charcoal font-semibold hover:bg-sandstone-light active:bg-sandstone",
    ghost:
      "bg-transparent text-charcoal hover:bg-black/5 hover:text-terracotta",
    subtle:
      "bg-terracotta-tint text-terracotta border border-terracotta/20 hover:bg-terracotta hover:text-white",
  };

  const sizes = {
    sm: "min-h-[44px] px-4 py-2 text-xs uppercase tracking-wider",
    md: "min-h-[44px] px-6 py-2.5 text-sm",
    lg: "min-h-[48px] px-8 py-3.5 text-base font-semibold",
    icon: "min-h-[44px] min-w-[44px] p-2",
  };

  const combinedClasses = cn(
    baseStyles,
    variants[variant] || variants.primary,
    sizes[size] || sizes.md,
    className
  );

  const content = (
    <>
      {IconLeft && (
        <IconLeft className="mr-2 h-4 w-4 shrink-0 transition-transform" aria-hidden="true" />
      )}
      <span>{children}</span>
      {IconRight && (
        <IconRight className="ml-2 h-4 w-4 shrink-0 transition-transform" aria-hidden="true" />
      )}
    </>
  );

  if (href) {
    const isExternal = href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:");
    if (isExternal) {
      return (
        <a
          href={href}
          className={combinedClasses}
          target={target || (href.startsWith("http") ? "_blank" : undefined)}
          rel={rel || (href.startsWith("http") ? "noopener noreferrer" : undefined)}
          {...props}
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={combinedClasses} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={combinedClasses}
      onClick={onClick}
      {...props}
    >
      {content}
    </button>
  );
}
