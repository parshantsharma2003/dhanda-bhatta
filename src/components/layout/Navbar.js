"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone, ArrowRight } from "lucide-react";
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
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-200 bg-warm-bg/95 backdrop-blur-md border-b",
          scrolled
            ? "border-border-strong shadow-xs py-2.5 sm:py-3"
            : "border-border-subtle py-3 sm:py-4"
        )}
      >
        <PageContainer className="flex items-center justify-between gap-4">
          {/* Brand Wordmark & Brick-inspired Symbol */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus-visible:outline-2 focus-visible:outline-terracotta"
            aria-label={`${siteConfig.name} - Home`}
          >
            {/* Custom Brick Symbol */}
            <div
              className="w-8 h-8 sm:w-9 sm:h-9 bg-terracotta text-white flex flex-col justify-center items-center p-1.5 shadow-xs transition-colors group-hover:bg-terracotta-hover shrink-0"
              aria-hidden="true"
            >
              {/* Top course of brick */}
              <div className="w-5 h-2 bg-white/95 mb-0.5" />
              {/* Staggered bottom course */}
              <div className="flex gap-0.5 w-5">
                <div className="w-2.5 h-2 bg-white/95" />
                <div className="w-2.5 h-2 bg-white/95" />
              </div>
            </div>

            {/* Wordmark */}
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-sm sm:text-base md:text-lg tracking-tight text-charcoal group-hover:text-terracotta transition-colors leading-none">
                DHANDA BHATTA COMPANY
              </span>
              <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-secondary-text font-medium pt-1">
                Village Kalwa, Pillukhera (Jind)
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
            >
              Enquire
            </Button>
          </div>

          {/* Mobile Right Controls: Compact Call + Hamburger Menu Toggle */}
          <div className="flex items-center gap-1.5 lg:hidden">
            <a
              href={`tel:${siteConfig.contact.primaryPhone}`}
              className="touch-target p-2 text-terracotta hover:bg-white rounded-none border border-border-subtle"
              aria-label="Call Kiln directly"
            >
              <Phone className="w-5 h-5" />
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="touch-target p-2 text-charcoal hover:text-terracotta hover:bg-white rounded-none border border-border-subtle"
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
