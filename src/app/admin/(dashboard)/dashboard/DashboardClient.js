"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Truck,
  Package,
  Image as ImageIcon,
  Plus,
  ArrowRight,
  Clock,
  RefreshCw,
  Phone,
  AlertCircle,
} from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import AnalyticsCharts from "@/components/admin/AnalyticsCharts";

export default function DashboardClient({ initialData }) {
  const [data, setData] = useState(initialData);
  const [range, setRange] = useState(initialData?.filter?.range || "30d");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAnalytics = async (selectedRange) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/analytics?range=${selectedRange}`);
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to load dashboard metrics");
      }
      setData(json.data);
      setRange(selectedRange);
    } catch (err) {
      console.error("[Dashboard] Error fetching analytics:", err);
      setError(err.message || "Error loading updated analytics");
    } finally {
      setIsLoading(false);
    }
  };

  const metrics = data?.metrics || {};
  const recentEnquiries = data?.recent?.enquiries || [];
  const recentOrders = data?.recent?.orders || [];

  return (
    <div className="space-y-8">
      {/* Top Banner / Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border-subtle">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-sandstone uppercase block mb-1">
            Real-time Operational Overview
          </span>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-charcoal tracking-tight">
            Kiln Operations & Activity
          </h1>
        </div>

        {/* Range Selector & Refresh */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <div className="inline-flex border border-border-subtle bg-white p-0.5 shadow-2xs">
            {[
              { id: "today", label: "Today" },
              { id: "7d", label: "7 Days" },
              { id: "30d", label: "30 Days" },
              { id: "90d", label: "90 Days" },
              { id: "all", label: "All Time" },
            ].map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => fetchAnalytics(btn.id)}
                disabled={isLoading}
                className={`px-3 py-1 text-xs font-heading font-semibold transition-colors cursor-pointer ${
                  range === btn.id
                    ? "bg-terracotta text-white font-bold"
                    : "text-secondary-text hover:text-charcoal hover:bg-warm-bg"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => fetchAnalytics(range)}
            disabled={isLoading}
            className="p-1.5 border border-border-subtle bg-white hover:bg-warm-bg text-secondary-text hover:text-charcoal cursor-pointer transition-colors"
            title="Refresh analytics data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-terracotta" : ""}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-[#FFEBEE] border-l-4 border-terracotta text-xs text-charcoal flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-terracotta shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Primary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Customer Enquiries */}
        <div className="bg-white border border-border-subtle p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-secondary-text">
              Total Enquiries
            </span>
            <div className="w-8 h-8 bg-terracotta/10 text-terracotta flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="font-heading font-black text-3xl text-charcoal mb-2">
            {metrics.totalEnquiries ?? 0}
          </div>
          <div className="flex items-center justify-between text-xs text-secondary-text pt-2 border-t border-border-subtle">
            <span>Today: <strong className="text-charcoal">{metrics.todayEnquiries ?? 0}</strong></span>
            <span>New: <strong className="text-terracotta">{metrics.pendingEnquiries ?? 0}</strong></span>
          </div>
        </div>

        {/* Metric 2: Bulk Order Requests */}
        <div className="bg-white border border-border-subtle p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-secondary-text">
              Order Requests
            </span>
            <div className="w-8 h-8 bg-sandstone/20 text-charcoal flex items-center justify-center">
              <Truck className="w-4 h-4 text-[#9C794C]" />
            </div>
          </div>
          <div className="font-heading font-black text-3xl text-charcoal mb-2">
            {metrics.totalOrders ?? 0}
          </div>
          <div className="flex items-center justify-between text-xs text-secondary-text pt-2 border-t border-border-subtle">
            <span>Today: <strong className="text-charcoal">{metrics.todayOrders ?? 0}</strong></span>
            <span>Pending: <strong className="text-[#9C794C]">{metrics.pendingOrders ?? 0}</strong></span>
          </div>
        </div>

        {/* Metric 3: Active Products */}
        <div className="bg-white border border-border-subtle p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-secondary-text">
              Active Products
            </span>
            <div className="w-8 h-8 bg-charcoal/10 text-charcoal flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="font-heading font-black text-3xl text-charcoal mb-2">
            {metrics.publishedProductsCount ?? 0}
          </div>
          <div className="flex items-center justify-between text-xs text-secondary-text pt-2 border-t border-border-subtle">
            <span>Catalogue:</span>
            <Link href="/admin/products" className="text-terracotta hover:underline font-semibold">
              Manage items &rarr;
            </Link>
          </div>
        </div>

        {/* Metric 4: Bhatta Media Gallery */}
        <div className="bg-white border border-border-subtle p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-secondary-text">
              Gallery Assets
            </span>
            <div className="w-8 h-8 bg-warm-bg text-secondary-text border border-border-subtle flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="font-heading font-black text-3xl text-charcoal mb-2">
            {metrics.publishedGalleryCount ?? 0}
          </div>
          <div className="flex items-center justify-between text-xs text-secondary-text pt-2 border-t border-border-subtle">
            <span>Media Library:</span>
            <Link href="/admin/gallery" className="text-terracotta hover:underline font-semibold">
              View gallery &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Operational Shortcuts */}
      <div className="bg-white border border-border-subtle p-4 shadow-2xs flex items-center justify-between flex-wrap gap-3">
        <span className="text-xs font-heading font-bold uppercase tracking-wider text-charcoal">
          Quick Actions:
        </span>
        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-terracotta hover:bg-[#833329] text-white text-xs font-heading font-bold uppercase tracking-wider transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Brick Product</span>
          </Link>
          <Link
            href="/admin/gallery"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border-subtle bg-warm-bg hover:bg-white text-charcoal text-xs font-heading font-bold uppercase tracking-wider transition-colors"
          >
            <ImageIcon className="w-3.5 h-3.5 text-secondary-text" />
            <span>Upload Photo</span>
          </Link>
          <Link
            href="/admin/enquiries"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border-subtle bg-warm-bg hover:bg-white text-charcoal text-xs font-heading font-bold uppercase tracking-wider transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-secondary-text" />
            <span>Open Enquiries</span>
          </Link>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border-subtle bg-warm-bg hover:bg-white text-charcoal text-xs font-heading font-bold uppercase tracking-wider transition-colors"
          >
            <Truck className="w-3.5 h-3.5 text-secondary-text" />
            <span>Review Orders</span>
          </Link>
        </div>
      </div>

      {/* Visual Analytics Charts Component */}
      <AnalyticsCharts charts={data?.charts || {}} />

      {/* Recent Submissions Dual Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Enquiries */}
        <div className="bg-white border border-border-subtle shadow-2xs">
          <div className="p-4 sm:p-5 border-b border-border-subtle flex items-center justify-between">
            <div>
              <h3 className="font-heading font-black text-sm text-charcoal">
                Recent Customer Enquiries
              </h3>
              <p className="text-xs text-secondary-text">Latest contact and general queries</p>
            </div>
            <Link
              href="/admin/enquiries"
              className="text-xs text-terracotta hover:underline font-heading font-bold flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            {recentEnquiries.length > 0 ? (
              <table className="w-full text-left text-xs">
                <thead className="bg-warm-bg border-b border-border-subtle text-[10px] font-mono uppercase tracking-wider text-secondary-text">
                  <tr>
                    <th className="py-2.5 px-4 font-semibold">Customer</th>
                    <th className="py-2.5 px-4 font-semibold">Interested In</th>
                    <th className="py-2.5 px-4 font-semibold">Status</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {recentEnquiries.map((enq) => (
                    <tr key={enq._id} className="hover:bg-warm-bg/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-heading font-bold text-charcoal">{enq.fullName}</div>
                        <div className="text-[11px] text-secondary-text flex items-center gap-1">
                          <Phone className="w-2.5 h-2.5" />
                          <span>{enq.phone}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-secondary-text">
                        {enq.interestedProduct || enq.enquiryType || "General"}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={enq.status} />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/admin/enquiries/${enq._id}`}
                          className="text-terracotta hover:underline font-semibold font-mono"
                        >
                          View &rarr;
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-xs text-secondary-text">
                No customer enquiries received yet.
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white border border-border-subtle shadow-2xs">
          <div className="p-4 sm:p-5 border-b border-border-subtle flex items-center justify-between">
            <div>
              <h3 className="font-heading font-black text-sm text-charcoal">
                Recent Bulk Order Requests
              </h3>
              <p className="text-xs text-secondary-text">Latest quotation and delivery requests</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs text-terracotta hover:underline font-heading font-bold flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            {recentOrders.length > 0 ? (
              <table className="w-full text-left text-xs">
                <thead className="bg-warm-bg border-b border-border-subtle text-[10px] font-mono uppercase tracking-wider text-secondary-text">
                  <tr>
                    <th className="py-2.5 px-4 font-semibold">Customer</th>
                    <th className="py-2.5 px-4 font-semibold">Quantity / Item</th>
                    <th className="py-2.5 px-4 font-semibold">Status</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {recentOrders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-warm-bg/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-heading font-bold text-charcoal">{ord.customerName}</div>
                        <div className="text-[11px] text-secondary-text flex items-center gap-1">
                          <Phone className="w-2.5 h-2.5" />
                          <span>{ord.phone}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-secondary-text">
                        <span className="font-bold text-charcoal">{ord.quantity?.toLocaleString("en-IN") || ord.quantity}</span> bricks
                        <div className="text-[10px] text-secondary-text truncate max-w-[120px]">{ord.selectedProduct}</div>
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={ord.status} type="order" />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/admin/orders/${ord._id}`}
                          className="text-terracotta hover:underline font-semibold font-mono"
                        >
                          Quote &rarr;
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-xs text-secondary-text">
                No bulk order requests received yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
