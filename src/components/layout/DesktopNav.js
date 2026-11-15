"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationConfig } from "@/config/navigation";
import { cn } from "@/lib/utils";

export default function DesktopNav({ className = "" }) {
  const pathname = usePathname();

  return (
    <nav className={cn("hidden lg:flex items-center space-x-1", className)} aria-label="Main Navigation">
      {navigationConfig.mainNav.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative px-3.5 py-2 text-sm font-medium transition-colors duration-150 min-h-[44px] inline-flex items-center",
              isActive
                ? "text-terracotta font-semibold"
                : "text-charcoal hover:text-terracotta"
            )}
          >
            {item.label}
            {isActive && (
              <span
                className="absolute bottom-0 left-3 right-3 h-0.5 bg-terracotta"
                aria-hidden="true"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
