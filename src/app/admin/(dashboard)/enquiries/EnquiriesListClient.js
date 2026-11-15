"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Search,
  Filter,
  Download,
  Phone,
  Mail,
  Calendar,
  ExternalLink,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";

export default function EnquiriesListClient({ initialEnquiries = [], initialPagination = {} }) {
  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [pagination, setPagination] = useState(initialPagination);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [enquiryType, setEnquiryType] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchEnquiries = async (page = 1) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (status) params.set("status", status);
      if (enquiryType) params.set("enquiryType", enquiryType);
      params.set("page", page.toString());
      params.set("limit", "15");

      const res = await fetch(`/api/admin/enquiries?${params.toString()}`);
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to load enquiries");
      }
      setEnquiries(json.data.enquiries);
      setPagination(json.data.pagination);
    } catch (err) {
      console.error("[EnquiriesListClient] Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEnquiries(1);
  };

  const handleExportCsv = () => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (search.trim()) params.set("search", search.trim());
    window.open(`/api/admin/enquiries/export?${params.toString()}`, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border-subtle">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-sandstone uppercase block mb-1">
            CRM & Lead Management
          </span>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-charcoal tracking-tight">
            Customer Enquiries Inbox
          </h1>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 px-3.5 py-2 border border-border-subtle bg-white hover:bg-warm-bg text-charcoal text-xs font-heading font-bold uppercase tracking-wider transition-colors shadow-2xs cursor-pointer"
            title="Download CSV export"
          >
            <Download className="w-3.5 h-3.5 text-sandstone" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-border-subtle p-4 shadow-2xs space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-secondary-text absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by customer name, phone, enquiry reference or message..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-warm-bg border border-border-subtle text-xs text-charcoal focus:bg-white focus:outline-none focus:border-terracotta"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="py-2 px-3 bg-warm-bg border border-border-subtle text-xs text-charcoal focus:bg-white focus:outline-none focus:border-terracotta cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="new">New (Unread)</option>
            <option value="contacted">Contacted</option>
            <option value="quoted">Quoted</option>
            <option value="closed">Closed</option>
            <option value="spam">Spam</option>
          </select>

          <select
            value={enquiryType}
            onChange={(e) => setEnquiryType(e.target.value)}
            className="py-2 px-3 bg-warm-bg border border-border-subtle text-xs text-charcoal focus:bg-white focus:outline-none focus:border-terracotta cursor-pointer"
          >
            <option value="">All Query Types</option>
            <option value="Product Pricing">Product Pricing</option>
            <option value="Delivery Logistics">Delivery Logistics</option>
            <option value="Quality & Testing">Quality & Testing</option>
            <option value="Kiln Visit">Kiln Visit</option>
            <option value="General">General Enquiry</option>
          </select>

          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-charcoal hover:bg-black text-white text-xs font-heading font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Filter className="w-3.5 h-3.5 text-sandstone" />
            <span>Search</span>
          </button>

          {(search || status || enquiryType) && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatus("");
                setEnquiryType("");
                setTimeout(() => fetchEnquiries(1), 0);
              }}
              className="px-3 py-2 border border-border-subtle bg-warm-bg hover:bg-white text-xs text-secondary-text hover:text-charcoal cursor-pointer"
            >
              Reset
            </button>
          )}
        </form>
      </div>

      {/* Enquiries Table */}
      <div className="bg-white border border-border-subtle shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-warm-bg border-b border-border-subtle text-[10px] font-mono uppercase tracking-wider text-secondary-text">
              <tr>
                <th className="py-3 px-4 font-semibold">Reference / Date</th>
                <th className="py-3 px-4 font-semibold">Customer</th>
                <th className="py-3 px-4 font-semibold">Contact</th>
                <th className="py-3 px-4 font-semibold">Interested Item</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {enquiries.length > 0 ? (
                enquiries.map((enq) => {
                  const dateStr = new Date(enq.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  });
                  return (
                    <tr key={enq._id} className="hover:bg-warm-bg/40 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-charcoal block">
                          {enq.enquiryReference}
                        </span>
                        <span className="text-[11px] text-secondary-text">{dateStr}</span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-heading font-bold text-sm text-charcoal">
                          {enq.fullName}
                        </div>
                        {enq.deliveryLocation && (
                          <div className="text-[11px] text-secondary-text truncate max-w-[150px]">
                            Loc: {enq.deliveryLocation}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4 text-secondary-text">
                        <div className="flex items-center gap-1 text-charcoal font-medium">
                          <Phone className="w-3 h-3 text-sandstone" />
                          <span>{enq.phone}</span>
                        </div>
                        {enq.email && (
                          <div className="text-[11px] text-secondary-text truncate max-w-[160px]">
                            {enq.email}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="text-charcoal font-medium">
                          {enq.interestedProduct || "General Inquiry"}
                        </div>
                        <div className="text-[11px] text-secondary-text">{enq.enquiryType}</div>
                      </td>

                      <td className="py-3 px-4">
                        <StatusBadge status={enq.status} />
                      </td>

                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/admin/enquiries/${enq._id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-warm-bg hover:bg-terracotta hover:text-white border border-border-subtle text-charcoal font-heading font-bold text-xs uppercase transition-colors"
                        >
                          <span>Manage</span>
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-secondary-text">
                    No customer enquiries found matching the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-border-subtle bg-warm-bg flex items-center justify-between text-xs">
            <span className="text-secondary-text">
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} total enquiries)
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fetchEnquiries(pagination.page - 1)}
                disabled={pagination.page <= 1 || isLoading}
                className="px-3 py-1 bg-white border border-border-subtle text-charcoal disabled:opacity-40 cursor-pointer"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => fetchEnquiries(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages || isLoading}
                className="px-3 py-1 bg-white border border-border-subtle text-charcoal disabled:opacity-40 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
