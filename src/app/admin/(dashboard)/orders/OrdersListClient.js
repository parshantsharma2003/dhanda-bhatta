"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Truck,
  Search,
  Filter,
  Download,
  Phone,
  MapPin,
  Calendar,
  ChevronRight,
  Package,
} from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";

export default function OrdersListClient({ initialOrders = [], initialPagination = {} }) {
  const [orders, setOrders] = useState(initialOrders);
  const [pagination, setPagination] = useState(initialPagination);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchOrders = async (page = 1) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (status) params.set("status", status);
      params.set("page", page.toString());
      params.set("limit", "15");

      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to load orders");
      }
      setOrders(json.data.orders);
      setPagination(json.data.pagination);
    } catch (err) {
      console.error("[OrdersListClient] Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOrders(1);
  };

  const handleExportCsv = () => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (search.trim()) params.set("search", search.trim());
    window.open(`/api/admin/orders/export?${params.toString()}`, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border-subtle">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-sandstone uppercase block mb-1">
            Dispatch & Logistics CRM
          </span>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-charcoal tracking-tight">
            Bulk Order Requests
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
              placeholder="Search by customer, phone, reference, village or product..."
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
            <option value="pending">Pending Review</option>
            <option value="contacted">Contacted</option>
            <option value="quoted">Quoted</option>
            <option value="confirmed">Confirmed</option>
            <option value="dispatched">Dispatched</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-charcoal hover:bg-black text-white text-xs font-heading font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Filter className="w-3.5 h-3.5 text-sandstone" />
            <span>Filter</span>
          </button>

          {(search || status) && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatus("");
                setTimeout(() => fetchOrders(1), 0);
              }}
              className="px-3 py-2 border border-border-subtle bg-warm-bg hover:bg-white text-xs text-secondary-text hover:text-charcoal cursor-pointer"
            >
              Reset
            </button>
          )}
        </form>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-border-subtle shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-warm-bg border-b border-border-subtle text-[10px] font-mono uppercase tracking-wider text-secondary-text">
              <tr>
                <th className="py-3 px-4 font-semibold">Reference / Date</th>
                <th className="py-3 px-4 font-semibold">Customer</th>
                <th className="py-3 px-4 font-semibold">Product / Volume</th>
                <th className="py-3 px-4 font-semibold">Destination</th>
                <th className="py-3 px-4 font-semibold">Quotation</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {orders.length > 0 ? (
                orders.map((ord) => {
                  const dateStr = new Date(ord.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  });
                  const locationText = ord.deliveryLocation
                    ? typeof ord.deliveryLocation === "object"
                      ? `${ord.deliveryLocation.villageOrCity || ""}, ${ord.deliveryLocation.district || ""}`
                      : ord.deliveryLocation
                    : "Not specified";

                  return (
                    <tr key={ord._id} className="hover:bg-warm-bg/40 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-charcoal block">
                          {ord.orderReference}
                        </span>
                        <span className="text-[11px] text-secondary-text">{dateStr}</span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-heading font-bold text-sm text-charcoal">
                          {ord.customerName}
                        </div>
                        <div className="text-[11px] text-secondary-text flex items-center gap-1">
                          <Phone className="w-2.5 h-2.5 text-sandstone" />
                          <span>{ord.phone}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-charcoal">
                          {ord.quantity ? `${ord.quantity.toLocaleString("en-IN")} Bricks` : "-"}
                        </div>
                        <div className="text-[11px] text-secondary-text truncate max-w-[160px]">
                          {ord.selectedProduct}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-secondary-text">
                        <div className="flex items-center gap-1 text-charcoal">
                          <MapPin className="w-3 h-3 text-terracotta shrink-0" />
                          <span className="truncate max-w-[140px]">{locationText}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        {ord.quotation?.estimatedTotal ? (
                          <div className="font-mono font-bold text-charcoal">
                            ₹{ord.quotation.estimatedTotal.toLocaleString("en-IN")}
                          </div>
                        ) : (
                          <span className="text-[11px] text-secondary-text italic">Pending quote</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <StatusBadge status={ord.status} type="order" />
                      </td>

                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/admin/orders/${ord._id}`}
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
                  <td colSpan={7} className="py-12 text-center text-xs text-secondary-text">
                    No bulk order requests found matching the current filters.
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
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} total orders)
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fetchOrders(pagination.page - 1)}
                disabled={pagination.page <= 1 || isLoading}
                className="px-3 py-1 bg-white border border-border-subtle text-charcoal disabled:opacity-40 cursor-pointer"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => fetchOrders(pagination.page + 1)}
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
