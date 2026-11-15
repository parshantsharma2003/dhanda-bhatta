"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone } from "lucide-react";
import MobileMenu from "./MobileMenu";
import PageContainer from "./PageContainer";
import Button from "@/components/ui/Button";
import { siteConfig } from "@/config/site";
import { navigationConfig } from "@/config/navigation";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-200 bg-white/95 backdrop-blur-md border-b",
          scrolled
            ? "border-border-strong shadow-xs py-2 sm:py-2.5"
            : "border-border-subtle py-2.5 sm:py-3.5"
        )}
      >
        <PageContainer className="flex items-center justify-between gap-3">
          {/* Brand Wordmark & Refined Brick Architectural Mark */}
          <Link
            href="/"
            className="flex items-center gap-2.5 sm:gap-3 group focus-visible:outline-2 focus-visible:outline-terracotta min-w-0"
            aria-label={`${siteConfig.name} - Home`}
          >
            {/* Custom Precision Brick Architectural Mark */}
            <div
              className="w-9 h-9 sm:w-10 sm:h-10 bg-terracotta text-white flex flex-col justify-center items-center p-1.5 shadow-2xs transition-transform group-hover:scale-[1.02] shrink-0"
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
              >
                {/* Top header course */}
                <rect x="2" y="3" width="24" height="6" fill="#FFFFFF" fillOpacity="0.95" />
                {/* Middle stretcher course (staggered) */}
                <rect x="2" y="11" width="11" height="6" fill="#FFFFFF" fillOpacity="0.95" />
                <rect x="15" y="11" width="11" height="6" fill="#FFFFFF" fillOpacity="0.95" />
                {/* Bottom header course */}
                <rect x="2" y="19" width="24" height="6" fill="#FFFFFF" fillOpacity="0.95" />
                {/* Mortar line accents */}
                <line x1="2" y1="10" x2="26" y2="10" stroke="#963D32" strokeWidth="1.5" />
                <line x1="2" y1="18" x2="26" y2="18" stroke="#963D32" strokeWidth="1.5" />
                <line x1="14" y1="11" x2="14" y2="17" stroke="#963D32" strokeWidth="1.5" />
              </svg>
            </div>

            {/* Wordmark with Strict Proportions & Wrap Prevention */}
            <div className="flex flex-col min-w-0">
              <span className="font-heading font-black text-[13px] sm:text-base md:text-lg tracking-tight text-charcoal group-hover:text-terracotta transition-colors leading-tight truncate">
                DHANDA BHATTA CO.
              </span>
              <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-secondary-text font-semibold pt-0.5 truncate">
                Kalwa, Pillukhera (Jind)
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            className="hidden lg:flex items-center space-x-1"
            aria-label="Desktop Navigation"
          >
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
                    "relative px-3.5 py-2 text-sm font-medium transition-colors min-h-[44px] inline-flex items-center",
                    isActive
                      ? "text-terracotta font-semibold"
                      : "text-charcoal hover:text-terracotta"
                  )}
                >
                  {item.label}
                  {isActive && (
                    <span
                      className="absolute bottom-1 left-3.5 right-3.5 h-0.5 bg-terracotta"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right CTA: Enquiry */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              href="/enquiry"
              variant="primary"
              size="sm"
              className="shadow-2xs"
            >
              Enquire Now
            </Button>
          </div>

          {/* Mobile Right Controls: Compact Call + Menu Toggle (Aligned with proper margins) */}
          <div className="flex items-center gap-1.5 lg:hidden shrink-0">
            <a
              href={`tel:${siteConfig.contact.primaryPhone}`}
              className="w-10 h-10 flex items-center justify-center text-terracotta hover:bg-warm-bg border border-border-subtle transition-colors focus-visible:outline-2 focus-visible:outline-terracotta"
              aria-label="Call Kiln directly"
            >
              <Phone className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="w-10 h-10 flex items-center justify-center text-charcoal hover:text-terracotta hover:bg-warm-bg border border-border-subtle transition-colors focus-visible:outline-2 focus-visible:outline-terracotta"
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </PageContainer>
      </header>

      {/* Accessible Mobile Menu Drawer */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}
