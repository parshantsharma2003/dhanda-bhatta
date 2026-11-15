import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Accessible Breadcrumbs Component
 * Props:
 * - items: Array of { label: string, href?: string }
 */
export default function Breadcrumbs({ items = [], className = "" }) {
  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center text-xs text-secondary-text", className)}
    >
      <ol className="flex items-center flex-wrap gap-1.5" role="list">
        <li>
          <Link
            href="/"
            className="hover:text-terracotta transition-colors flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-terracotta"
            aria-label="Home"
          >
            <Home className="w-3.5 h-3.5 text-secondary-text" />
            <span className="sr-only sm:not-sr-only">Home</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label || index} className="flex items-center gap-1.5">
              <ChevronRight
                className="w-3 h-3 text-border-strong shrink-0"
                aria-hidden="true"
              />
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-terracotta transition-colors focus-visible:outline-2 focus-visible:outline-terracotta"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    "font-medium truncate max-w-[200px] sm:max-w-none",
                    isLast ? "text-charcoal font-semibold" : "text-secondary-text"
                  )}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
