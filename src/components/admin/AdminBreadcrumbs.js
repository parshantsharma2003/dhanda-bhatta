"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

// Human-friendly mapping for admin route segments
const SEGMENT_LABELS = {
  admin: "Admin",
  dashboard: "Overview",
  enquiries: "Customer Enquiries",
  orders: "Bulk Order Requests",
  products: "Product Catalogue",
  new: "Create New",
  edit: "Edit",
  gallery: "Bhatta Media Gallery",
  content: "Content Management",
  homepage: "Homepage Editor",
  about: "About Page & Values",
  faqs: "FAQs Manager",
  settings: "Settings",
  business: "Business Details",
  social: "Social Channels",
  delivery: "Delivery Logistics",
  seo: "Search Engine Optimization",
  activity: "Audit Logs",
  security: "Security & 2FA",
};

export default function AdminBreadcrumbs({ customTitle = null }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  // If we are at root /admin or /admin/dashboard, simple breadcrumb
  if (segments.length <= 2 && segments[1] === "dashboard") {
    return (
      <div className="flex items-center gap-1.5 text-xs text-secondary-text mb-4">
        <Home className="w-3.5 h-3.5 text-sandstone" />
        <span>Admin Dashboard</span>
        <ChevronRight className="w-3 h-3 text-border-subtle" />
        <span className="font-semibold text-charcoal">Overview</span>
      </div>
    );
  }

  // Build breadcrumb items cleanly and purely
  const breadcrumbList = segments.map((seg, idx) => {
    const href = "/" + segments.slice(0, idx + 1).join("/");
    const isLast = idx === segments.length - 1;
    let label = SEGMENT_LABELS[seg] || seg;

    // Check if it's an ID (like a MongoDB ObjectId or reference code)
    if (seg.length === 24 || seg.startsWith("ENQ-") || seg.startsWith("ORD-")) {
      label = customTitle || (seg.length === 24 ? `Record #${seg.slice(-6)}` : seg);
    }

    return {
      href,
      label,
      isLast,
    };
  });

  return (
    <nav aria-label="Admin Breadcrumbs" className="flex items-center gap-1.5 text-xs text-secondary-text mb-4 overflow-x-auto whitespace-nowrap py-0.5">
      <Link href="/admin/dashboard" className="text-secondary-text hover:text-charcoal flex items-center gap-1 shrink-0">
        <Home className="w-3.5 h-3.5 text-sandstone" />
        <span>Admin</span>
      </Link>
      {breadcrumbList.slice(1).map((crumb, i) => (
        <span key={crumb.href || i} className="flex items-center gap-1.5 shrink-0">
          <ChevronRight className="w-3 h-3 text-secondary-text/50" />
          {crumb.isLast ? (
            <span className="font-semibold text-charcoal capitalize" aria-current="page">
              {crumb.label}
            </span>
          ) : (
            <Link href={crumb.href} className="text-secondary-text hover:text-charcoal capitalize">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
