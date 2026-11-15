import Link from "next/link";
import { MapPin, Phone, Mail, ArrowUpRight } from "lucide-react";
import PageContainer from "./PageContainer";
import { siteConfig } from "@/config/site";
import { navigationConfig } from "@/config/navigation";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-warm-bg border-t border-charcoal-muted mt-auto">
      {/* Main Footer Content */}
      <div className="py-12 sm:py-16">
        <PageContainer>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
            {/* Brand Column (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 bg-terracotta text-white flex flex-col justify-center items-center p-1 shadow-xs"
                  aria-hidden="true"
                >
                  <div className="w-5 h-2 bg-white/95 mb-0.5" />
                  <div className="flex gap-0.5 w-5">
                    <div className="w-2.5 h-2 bg-white/95" />
                    <div className="w-2.5 h-2 bg-white/95" />
                  </div>
                </div>

                <div>
                  <p className="font-heading font-extrabold text-base sm:text-lg text-white tracking-tight leading-none">
                    DHANDA BHATTA COMPANY
                  </p>
                  <p className="text-[11px] text-sandstone pt-0.5">
                    Village Kalwa, Pillukhera (Jind)
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-warm-bg/75 leading-relaxed max-w-sm">
                Established brick manufacturing and supply business based in Village Kalwa, Pillukhera,
                Jind, Haryana. Supplying quality clay bricks for residential and commercial construction
                with delivery available in nearby areas.
              </p>

              {/* Physical Location & Contact */}
              <div className="space-y-2 pt-2 text-xs text-warm-bg/85">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
                  <span>{siteConfig.location.displayAddress}</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-terracotta shrink-0" />
                  <a
                    href={`tel:${siteConfig.contact.primaryPhone}`}
                    className="hover:text-sandstone transition-colors font-medium"
                  >
                    {siteConfig.contact.primaryPhoneDisplay}
                  </a>
                </div>

                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-terracotta shrink-0" />
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="hover:text-sandstone transition-colors text-warm-bg/80"
                  >
                    {siteConfig.contact.email}
                  </a>
                </div>
              </div>

              {/* Verified Social Media Links */}
              {siteConfig.socialLinks && siteConfig.socialLinks.length > 0 && (
                <div className="pt-3 flex flex-wrap items-center gap-2">
                  {siteConfig.socialLinks.map((item) => (
                    <a
                      key={item.label || item.name}
                      href={item.url || item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-2.5 py-1 bg-charcoal-muted/60 hover:bg-terracotta text-warm-bg hover:text-white transition-colors border border-charcoal-muted"
                      aria-label={`Visit Dhanda Bhatta Company on ${item.label || item.name}`}
                    >
                      {item.label || item.name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Links Column (3 cols) */}
            <div className="lg:col-span-3 space-y-4">
              <p className="font-heading text-xs uppercase tracking-widest font-semibold text-sandstone">
                Navigation
              </p>
              <ul className="space-y-2.5 text-xs sm:text-sm">
                {navigationConfig.mainNav.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-warm-bg/75 hover:text-white transition-colors inline-flex items-center gap-1 group py-0.5"
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-sandstone" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Products & Enquiries (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <p className="font-heading text-xs uppercase tracking-widest font-semibold text-sandstone">
                Products &amp; Orders
              </p>
              <ul className="space-y-2.5 text-xs sm:text-sm text-warm-bg/75">
                <li>
                  <Link
                    href="/products"
                    className="hover:text-white transition-colors block py-0.5"
                  >
                    Brick Catalogue &amp; Products
                  </Link>
                </li>
                <li>
                  <Link
                    href="/delivery"
                    className="hover:text-white transition-colors block py-0.5"
                  >
                    Nearby Area Delivery Information
                  </Link>
                </li>
                <li>
                  <Link
                    href="/gallery"
                    className="hover:text-white transition-colors block py-0.5"
                  >
                    Bhatta &amp; Facility Gallery
                  </Link>
                </li>
                <li>
                  <Link
                    href="/enquiry"
                    className="hover:text-white transition-colors block py-0.5 font-medium text-sandstone"
                  >
                    Request Project Quotation →
                  </Link>
                </li>
              </ul>

              <div className="p-3 bg-[#1D1B19] border border-charcoal-muted text-[11px] text-warm-bg/70 mt-4">
                <p className="font-semibold text-white mb-0.5">Operating Hours:</p>
                <p>{siteConfig.hours.display}</p>
              </div>
            </div>
          </div>
        </PageContainer>
      </div>

      {/* Copyright Strip */}
      <div className="border-t border-charcoal-muted py-6 text-xs text-warm-bg/60 bg-[#191817]">
        <PageContainer className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p>
            © {currentYear} {siteConfig.name}. All rights reserved. Village Kalwa, Pillukhera, Jind, Haryana.
          </p>
          <p className="text-[11px] text-warm-bg/40">
            Brick manufacturing &amp; supply with nearby area delivery
          </p>
        </PageContainer>
      </div>
    </footer>
  );
}
