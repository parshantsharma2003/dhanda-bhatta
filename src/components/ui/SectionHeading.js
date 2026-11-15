import { cn } from "@/lib/utils";

/**
 * Editorial Section Heading Component
 * Uses Archivo for headlines and Inter for supporting text.
 */
export default function SectionHeading({
  overline,
  title,
  description,
  align = "left", // 'left' | 'center' | 'split'
  action,
  className = "",
  titleClassName = "",
  descriptionClassName = "",
  as = "h2",
}) {
  const HeadingTag = as;

  if (align === "split") {
    return (
      <div
        className={cn(
          "flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-6 border-b border-border-subtle",
          className
        )}
      >
        <div className="max-w-2xl space-y-2">
          {overline && (
            <p className="font-heading text-xs uppercase tracking-widest font-semibold text-terracotta">
              {overline}
            </p>
          )}
          <HeadingTag
            className={cn(
              "font-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-charcoal",
              titleClassName
            )}
          >
            {title}
          </HeadingTag>
          {description && (
            <p
              className={cn(
                "text-sm sm:text-base text-secondary-text leading-relaxed pt-1",
                descriptionClassName
              )}
            >
              {description}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    );
  }

  const isCenter = align === "center";

  return (
    <div
      className={cn(
        "space-y-3",
        isCenter ? "text-center max-w-3xl mx-auto" : "max-w-3xl",
        className
      )}
    >
      {overline && (
        <p className="font-heading text-xs uppercase tracking-widest font-semibold text-terracotta inline-flex items-center gap-2">
          <span className="w-4 h-px bg-terracotta inline-block" />
          {overline}
        </p>
      )}
      <HeadingTag
        className={cn(
          "font-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-charcoal",
          titleClassName
        )}
      >
        {title}
      </HeadingTag>
      {description && (
        <p
          className={cn(
            "text-sm sm:text-base text-secondary-text leading-relaxed",
            descriptionClassName
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
