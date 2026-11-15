"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  Truck,
  Image as ImageIcon,
  FileText,
  HelpCircle,
  Settings,
  Share2,
  MapPin,
  Search,
  ShieldCheck,
  History,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

const NAV_SECTIONS = [
  {
    title: "Main",
    items: [
      { label: "Dashboard Overview", icon: LayoutDashboard, href: "/admin/dashboard" },
    ],
  },
  {
    title: "Operations & CRM",
    items: [
      { label: "Customer Enquiries", icon: MessageSquare, href: "/admin/enquiries" },
      { label: "Bulk Order Requests", icon: Truck, href: "/admin/orders" },
    ],
  },
  {
    title: "Catalogue & Media",
    items: [
      { label: "Products Catalogue", icon: Package, href: "/admin/products" },
      { label: "Bhatta Gallery", icon: ImageIcon, href: "/admin/gallery" },
    ],
  },
  {
    title: "Content Management",
    items: [
      { label: "Homepage Editor", icon: FileText, href: "/admin/content/homepage" },
      { label: "About Page & Values", icon: FileText, href: "/admin/content/about" },
      { label: "FAQs Management", icon: HelpCircle, href: "/admin/content/faqs" },
    ],
  },
  {
    title: "Settings & SEO",
    items: [
      { label: "Business Information", icon: Settings, href: "/admin/settings/business" },
      { label: "Social Media Links", icon: Share2, href: "/admin/settings/social" },
      { label: "Delivery Logistics", icon: MapPin, href: "/admin/settings/delivery" },
      { label: "SEO & Search Engine", icon: Search, href: "/admin/settings/seo" },
    ],
  },
  {
    title: "Security & Logs",
    items: [
      { label: "Activity Audit Logs", icon: History, href: "/admin/activity" },
      { label: "Security & 2FA Setup", icon: ShieldCheck, href: "/admin/security" },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isActive = (href) => {
    if (href === "/admin/dashboard") {
      return pathname === "/admin/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Top Navbar Bar with Toggle */}
      <div className="md:hidden bg-charcoal text-white px-4 py-3 flex items-center justify-between border-b border-[#38332E] sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-1.5 text-white hover:bg-[#38332E] rounded cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-sandstone uppercase block">
              Dhanda Bhatta
            </span>
            <span className="font-heading font-black text-xs text-white uppercase tracking-wider">
              Admin Portal
            </span>
          </div>
        </div>
        <Link
          href="/"
          target="_blank"
          className="text-xs text-sandstone hover:underline flex items-center gap-1"
        >
          <span>Site</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {/* Mobile Overlay Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 md:hidden animate-fadeIn"
        />
      )}

      {/* Main Sidebar (Desktop fixed, Mobile sliding drawer) */}
      <aside
        className={`fixed md:sticky top-0 bottom-0 left-0 w-64 bg-charcoal text-white shrink-0 flex flex-col justify-between border-r border-[#38332E] z-50 transition-transform duration-200 ease-in-out md:translate-x-0 overflow-y-auto ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Brand Wordmark Header */}
          <div className="p-5 border-b border-[#38332E]">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-sandstone uppercase block mb-1">
                  Kiln Admin Portal
                </span>
                <h2 className="font-heading font-black text-lg text-white tracking-wide">
                  DHANDA BHATTA
                </h2>
                <p className="text-[11px] text-[#A89F91]">Village Kalwa, Haryana</p>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                className="md:hidden text-[#A89F91] hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Menu by Sections */}
          <nav className="p-3 space-y-4">
            {NAV_SECTIONS.map((section) => (
              <div key={section.title} className="space-y-1">
                <span className="px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-[#8A8275] block">
                  {section.title}
                </span>
                {section.items.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 text-xs font-heading font-medium transition-colors ${
                        active
                          ? "bg-terracotta text-white font-bold shadow-xs"
                          : "text-[#D5CDBD] hover:bg-[#34302C] hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </div>
                      {active && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Public Site Link Footer */}
        <div className="p-4 border-t border-[#38332E]">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between text-xs text-[#A89F91] hover:text-white transition-colors py-1"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>
    </>
  );
}
