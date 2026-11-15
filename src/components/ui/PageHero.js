import PageContainer from "@/components/layout/PageContainer";
import Breadcrumbs from "./Breadcrumbs";
import Badge from "./Badge";
import { cn } from "@/lib/utils";

/**
 * Editorial Page Hero / Header for Public Sub-pages
 */
export default function PageHero({
  badge,
  title,
  description,
  breadcrumbs = [],
  action,
  className = "",
}) {
  return (
    <section
      className={cn(
        "relative bg-warm-bg border-b border-border-subtle pt-6 pb-12 sm:pt-8 sm:pb-16 lg:pt-10 lg:pb-20 overflow-hidden",
        className
      )}
    >
      <PageContainer className="relative space-y-4 sm:space-y-6">
        {/* Breadcrumb Navigation */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="pb-1">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-5xl">
          <div className="space-y-3 sm:space-y-4">
            {badge && (
              <Badge variant="terracotta" size="md">
                {badge}
              </Badge>
            )}

            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-charcoal tracking-tight leading-[1.12]">
              {title}
            </h1>

            {description && (
              <p className="text-base sm:text-lg text-secondary-text leading-relaxed max-w-3xl pt-1">
                {description}
              </p>
            )}
          </div>

          {action && <div className="shrink-0">{action}</div>}
        </div>
      </PageContainer>
    </section>
  );
}
