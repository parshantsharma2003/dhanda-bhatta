"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from "recharts";

const PIE_COLORS = ["#963D32", "#C5A477", "#252321", "#655D55", "#4CAF50", "#2196F3", "#9C27B0"];

export default function AnalyticsCharts({ charts = {} }) {
  const {
    enquiriesOverTime = [],
    ordersOverTime = [],
    enquiryStatusDistribution = [],
    orderStatusDistribution = [],
    topEnquiredProducts = [],
  } = charts;

  // Merge enquiries and orders by date for time-series chart
  const combinedTimeline = useMemo(() => {
    const map = new Map();

    enquiriesOverTime.forEach((item) => {
      map.set(item.date, { date: item.date, enquiries: item.count, orders: 0 });
    });

    ordersOverTime.forEach((item) => {
      if (map.has(item.date)) {
        map.get(item.date).orders = item.count;
      } else {
        map.set(item.date, { date: item.date, enquiries: 0, orders: item.count });
      }
    });

    const list = Array.from(map.values());
    list.sort((a, b) => (a.date > b.date ? 1 : -1));
    return list;
  }, [enquiriesOverTime, ordersOverTime]);

  const hasTimelineData = combinedTimeline.length > 0;
  const hasEnquiryStatusData = enquiryStatusDistribution.length > 0;
  const hasOrderStatusData = orderStatusDistribution.length > 0;
  const hasTopProductsData = topEnquiredProducts.length > 0;

  return (
    <div className="space-y-6">
      {/* 1. Main Time Series Activity Area Chart */}
      <div className="bg-white border border-border-subtle p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border-subtle mb-4 gap-2">
          <div>
            <h3 className="font-heading font-black text-base text-charcoal">
              Operational Traffic Timeline
            </h3>
            <p className="text-xs text-secondary-text">
              Daily customer enquiries vs bulk order requests
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-terracotta inline-block" />
              <span className="text-charcoal font-semibold">Enquiries</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-sandstone inline-block" />
              <span className="text-charcoal font-semibold">Orders</span>
            </span>
          </div>
        </div>

        {hasTimelineData ? (
          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={combinedTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEnquiries" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#963D32" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#963D32" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C5A477" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#C5A477" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E6DFD4" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "#655D55" }}
                  tickFormatter={(val) => {
                    const parts = val.split("-");
                    return parts.length === 3 ? `${parts[1]}/${parts[2]}` : val;
                  }}
                  stroke="#E6DFD4"
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "#655D55" }}
                  stroke="#E6DFD4"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#252321",
                    border: "none",
                    borderRadius: "0px",
                    color: "#FFFFFF",
                    fontSize: "12px",
                  }}
                  labelStyle={{ fontWeight: "bold", color: "#C5A477" }}
                />
                <Area
                  type="monotone"
                  dataKey="enquiries"
                  name="Enquiries"
                  stroke="#963D32"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorEnquiries)"
                />
                <Area
                  type="monotone"
                  dataKey="orders"
                  name="Orders"
                  stroke="#C5A477"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorOrders)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-56 flex flex-col items-center justify-center text-center p-6 bg-warm-bg border border-border-subtle">
            <span className="text-xs font-mono font-bold text-sandstone uppercase tracking-wider mb-1">
              Zero Activity
            </span>
            <p className="text-xs text-secondary-text max-w-sm">
              No enquiry or order activity recorded during the selected date window. Traffic will dynamically appear as submissions occur.
            </p>
          </div>
        )}
      </div>

      {/* 2. Secondary Row: Status Distributions & Top Enquired Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enquiry Status Distribution */}
        <div className="bg-white border border-border-subtle p-5 sm:p-6 shadow-2xs">
          <div className="pb-3 border-b border-border-subtle mb-4">
            <h3 className="font-heading font-black text-sm text-charcoal">
              Enquiry Status Breakdown
            </h3>
            <p className="text-xs text-secondary-text">Current volume grouped by pipeline state</p>
          </div>

          {hasEnquiryStatusData ? (
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={enquiryStatusDistribution} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E6DFD4" />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: "#655D55" }} />
                  <YAxis type="category" dataKey="status" tick={{ fontSize: 11, fill: "#252321", textTransform: "capitalize" }} width={80} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#252321",
                      border: "none",
                      color: "#FFFFFF",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="count" name="Total Enquiries" fill="#963D32" barSize={16}>
                    {enquiryStatusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-44 flex items-center justify-center text-center text-xs text-secondary-text bg-warm-bg border border-border-subtle p-4">
              No customer enquiry records in database.
            </div>
          )}
        </div>

        {/* Top Demanded Products Bar / List */}
        <div className="bg-white border border-border-subtle p-5 sm:p-6 shadow-2xs">
          <div className="pb-3 border-b border-border-subtle mb-4">
            <h3 className="font-heading font-black text-sm text-charcoal">
              Top Customer-Interested Products
            </h3>
            <p className="text-xs text-secondary-text">Most enquired brick varieties by customer mentions</p>
          </div>

          {hasTopProductsData ? (
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topEnquiredProducts} layout="vertical" margin={{ top: 5, right: 30, left: 30, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E6DFD4" />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: "#655D55" }} />
                  <YAxis type="category" dataKey="product" tick={{ fontSize: 10, fill: "#252321" }} width={120} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#252321",
                      border: "none",
                      color: "#FFFFFF",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="count" name="Enquiry Count" fill="#C5A477" barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-44 flex items-center justify-center text-center text-xs text-secondary-text bg-warm-bg border border-border-subtle p-4">
              No product-specific customer enquiries recorded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
