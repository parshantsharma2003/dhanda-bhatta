"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, MapPin, Phone, Truck, ArrowRight, ShieldCheck } from "lucide-react";
import { navigationConfig } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";

export default function MobileNav({ isOpen, onClose }) {
  const pathname = usePathname();

  // Close on route change
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [pathname, isOpen, onClose]);

  // Prevent body scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Mobile Menu">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal/70 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-warm-bg shadow-xl flex flex-col border-l border-border-subtle overflow-y-auto">
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-5 border-b border-border-subtle bg-white">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-terracotta flex items-center justify-center text-white font-heading font-black text-xs">
              DBC
            </div>
            <div>
              <p className="font-heading font-bold text-sm tracking-tight text-charcoal">
                DHANDA BHATTA CO.
              </p>
              <p className="text-[11px] text-secondary-text">Kalwa, Pillukhera, Jind</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="touch-target p-2 text-charcoal hover:text-terracotta hover:bg-warm-bg transition-colors"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="p-4 flex-1">
          <p className="text-[11px] uppercase tracking-widest text-secondary-text font-semibold px-3 py-2">
            Navigation
          </p>
          <nav className="space-y-1">
            {navigationConfig.mainNav.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center justify-between px-3.5 py-3 text-base font-medium transition-colors min-h-[48px]",
                    isActive
                      ? "bg-white text-terracotta font-semibold border-l-4 border-terracotta shadow-xs"
                      : "text-charcoal hover:bg-white/80 hover:text-terracotta"
                  )}
                >
                  <span>{item.label}</span>
                  <ArrowRight
                    className={cn(
                      "w-4 h-4 transition-transform",
                      isActive ? "text-terracotta translate-x-1" : "text-secondary-text/40"
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Quick Actions */}
          <div className="mt-6 pt-6 border-t border-border-subtle space-y-2.5">
            <p className="text-[11px] uppercase tracking-widest text-secondary-text font-semibold px-3">
              Direct Kiln Supply
            </p>
            <Button
              href="/order"
              variant="primary"
              className="w-full justify-center"
              iconRight={Truck}
              onClick={onClose}
            >
              Order Bricks / Request Rates
            </Button>
            <Button
              href="/enquiry"
              variant="outline"
              className="w-full justify-center"
              onClick={onClose}
            >
              Contractor & Bulk Enquiry
            </Button>
          </div>

          {/* Physical Location & Contact Info */}
          <div className="mt-6 p-4 bg-white border border-border-subtle space-y-3 text-xs text-secondary-text">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-charcoal">Kiln Location</p>
                <p>Village Kalwa, Pillukhera, Jind, Haryana - 126113</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-terracotta shrink-0" />
              <div>
                <p className="font-semibold text-charcoal">Direct Dispatch Line</p>
                <a
                  href={`tel:${siteConfig.contact.primaryPhone}`}
                  className="text-terracotta font-medium hover:underline inline-block py-1"
                >
                  {siteConfig.contact.primaryPhoneDisplay}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2.5 pt-1 text-[11px] text-secondary-text">
              <ShieldCheck className="w-3.5 h-3.5 text-sandstone shrink-0" />
              <span>Direct Kiln Supply • No Middlemen</span>
            </div>
          </div>
        </div>

        {/* Footer in Drawer */}
        <div className="p-4 border-t border-border-subtle bg-white text-center text-xs text-secondary-text">
          <p>© {new Date().getFullYear()} {siteConfig.name}</p>
        </div>
      </div>
    </div>
  );
}
