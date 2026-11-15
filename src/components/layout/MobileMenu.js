"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Phone, MessageSquare, MapPin, ArrowRight } from "lucide-react";
import { navigationConfig } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";

export default function MobileMenu({ isOpen, onClose }) {
  const pathname = usePathname();

  // Close when pathname changes
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [pathname, isOpen, onClose]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  // Handle ESC key to dismiss
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
    <div
      className="fixed inset-0 z-50 lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
    >
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-charcoal/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out drawer with safe-area padding */}
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-warm-bg border-l border-border-subtle shadow-2xl flex flex-col pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)] overflow-y-auto">
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border-subtle bg-white">
          <div className="flex items-center gap-2.5">
            {/* Brick-inspired geometric symbol */}
            <div className="w-8 h-8 bg-terracotta text-white flex flex-col justify-center items-center p-1 shadow-xs">
              <div className="w-5 h-2 bg-white/90 mb-0.5" />
              <div className="flex gap-0.5 w-5">
                <div className="w-2.5 h-2 bg-white/90" />
                <div className="w-2.5 h-2 bg-white/90" />
              </div>
            </div>
            <div>
              <p className="font-heading font-extrabold text-xs sm:text-sm tracking-tight text-charcoal leading-tight">
                DHANDA BHATTA CO.
              </p>
              <p className="text-[10px] text-secondary-text tracking-wide">
                Village Kalwa, Pillukhera (Jind)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="touch-target p-2 text-charcoal hover:text-terracotta transition-colors"
            aria-label="Close navigation menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="p-4 flex-1">
          <p className="text-[10px] uppercase tracking-widest text-secondary-text font-bold px-3 py-2">
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
                    "flex items-center justify-between px-3.5 py-3 text-sm sm:text-base font-medium transition-colors min-h-[48px]",
                    isActive
                      ? "bg-white text-terracotta font-semibold border-l-4 border-terracotta shadow-xs"
                      : "text-charcoal hover:bg-white/80 hover:text-terracotta"
                  )}
                >
                  <span>{item.label}</span>
                  <ArrowRight
                    className={cn(
                      "w-4 h-4 transition-transform",
                      isActive ? "text-terracotta translate-x-0.5" : "text-border-strong"
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Quick Action CTA */}
          <div className="mt-6 pt-5 border-t border-border-subtle space-y-2.5">
            <Button
              href="/enquiry"
              variant="primary"
              className="w-full justify-center"
              onClick={onClose}
            >
              Enquire About Bricks
            </Button>
            <Button
              href="/contact"
              variant="outline"
              className="w-full justify-center"
              onClick={onClose}
            >
              Contact Our Team
            </Button>
          </div>

          {/* Verified Business Information Card */}
          <div className="mt-6 p-4 bg-white border border-border-subtle space-y-3 text-xs text-secondary-text">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-charcoal">Location</p>
                <p>{siteConfig.location.displayAddress}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-terracotta shrink-0" />
              <div>
                <p className="font-semibold text-charcoal">Contact</p>
                <a
                  href={`tel:${siteConfig.contact.primaryPhone}`}
                  className="text-terracotta font-medium hover:underline inline-block py-0.5"
                >
                  {siteConfig.contact.primaryPhoneDisplay}
                </a>
              </div>
            </div>

            <div className="pt-1 text-[11px] text-secondary-text">
              <p>• Delivery available in nearby areas</p>
            </div>
          </div>
        </div>

        {/* Footer in Drawer */}
        <div className="p-4 border-t border-border-subtle bg-white text-center text-[11px] text-secondary-text">
          <p>© {new Date().getFullYear()} {siteConfig.name}</p>
        </div>
      </div>
    </div>
  );
}
