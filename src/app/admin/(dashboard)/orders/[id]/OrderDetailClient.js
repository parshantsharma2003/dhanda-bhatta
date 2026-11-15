"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Truck,
  Calculator,
  Save,
  CheckCircle,
  AlertCircle,
  Archive,
  Loader2,
  Package,
} from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import ConfirmationModal from "@/components/admin/ConfirmationModal";

export default function OrderDetailClient({ initialOrder }) {
  const router = useRouter();
  const [order, setOrder] = useState(initialOrder);
  const [status, setStatus] = useState(initialOrder.status || "pending");

  // Quotation State
  const [unitRate, setUnitRate] = useState(initialOrder.quotation?.unitRate || "");
  const [vehicleHaulageRate, setVehicleHaulageRate] = useState(
    initialOrder.quotation?.vehicleHaulageRate || ""
  );
  const [quotationNotes, setQuotationNotes] = useState(initialOrder.quotation?.notes || "");

  // Internal Notes State
  const [newNote, setNewNote] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Archival modal state
  const [archiveModalOpen, setArchiveModalOpen] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);

  // Auto-calculated total
  const numQuantity = Number(order.quantity) || 0;
  const numUnitRate = Number(unitRate) || 0;
  const numHaulage = Number(vehicleHaulageRate) || 0;
  const computedTotal = numUnitRate > 0 ? numQuantity * numUnitRate + numHaulage : 0;

  // Phone for WhatsApp
  const rawDigits = (order.phone || "").replace(/\D/g, "");
  const waNumber = rawDigits.length === 10 ? `91${rawDigits}` : rawDigits;

  const handleSave = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage({ text: "", type: "" });

    try {
      const quotationPayload = {
        unitRate: numUnitRate > 0 ? numUnitRate : undefined,
        vehicleHaulageRate: numHaulage > 0 ? numHaulage : undefined,
        estimatedTotal: computedTotal > 0 ? computedTotal : undefined,
        notes: quotationNotes.trim() || undefined,
      };

      const res = await fetch(`/api/admin/orders/${order._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          quotation: quotationPayload,
          note: newNote.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to update order");
      }

      setOrder(json.data.order);
      setNewNote("");
      setMessage({ text: "Order request, quotation and notes saved successfully.", type: "success" });
    } catch (err) {
      console.error("[OrderDetail] Update error:", err);
      setMessage({ text: err.message || "Error saving order details", type: "error" });
    } finally {
      setIsUpdating(false);
    }
  };

  const confirmArchive = async () => {
    setIsArchiving(true);
    try {
      const res = await fetch(`/api/admin/orders/${order._id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to archive order");
      }
      router.push("/admin/orders");
      router.refresh();
    } catch (err) {
      console.error("[OrderDetail] Archive error:", err);
      setMessage({ text: err.message || "Error archiving order", type: "error" });
      setIsArchiving(false);
    }
  };

  const locationText = order.deliveryLocation
    ? typeof order.deliveryLocation === "object"
      ? `${order.deliveryLocation.villageOrCity || ""}, ${order.deliveryLocation.district || ""}, ${
          order.deliveryLocation.state || "Haryana"
        } ${order.deliveryLocation.pincode ? `(${order.deliveryLocation.pincode})` : ""}`
      : order.deliveryLocation
    : "Not specified";

  const waQuoteText = computedTotal > 0
    ? `Hello ${order.customerName}, regarding your bulk order request ${order.orderReference} for ${order.quantity?.toLocaleString("en-IN")} bricks at Dhanda Bhatta Company: Our quotation is ₹${numUnitRate}/brick + ₹${numHaulage} haulage, total ₹${computedTotal.toLocaleString("en-IN")}. Please let us know to confirm dispatch schedule.`
    : `Hello ${order.customerName}, thank you for your bulk order request ${order.orderReference} with Dhanda Bhatta Company. We would like to confirm your site delivery requirements.`;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-border-subtle">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="p-2 border border-border-subtle bg-white hover:bg-warm-bg text-secondary-text hover:text-charcoal transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-xs text-sandstone uppercase">
                {order.orderReference}
              </span>
              <StatusBadge status={order.status} type="order" />
            </div>
            <h1 className="font-heading font-black text-2xl text-charcoal tracking-tight">
              Order Request: {order.customerName}
            </h1>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setArchiveModalOpen(true)}
          className="p-2 border border-border-subtle bg-warm-bg hover:bg-white text-secondary-text hover:text-terracotta text-xs font-heading font-bold uppercase transition-colors self-start sm:self-auto flex items-center gap-1.5 cursor-pointer"
        >
          <Archive className="w-3.5 h-3.5" />
          <span>Archive Order</span>
        </button>
      </div>

      {message.text && (
        <div
          className={`p-3 border-l-4 flex items-center gap-2 text-xs ${
            message.type === "success"
              ? "bg-[#E8F5E9] border-[#2E7D32] text-[#2E7D32]"
              : "bg-[#FFEBEE] border-terracotta text-charcoal"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-terracotta" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Main Form & Layout */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Order Details, Delivery Site, Quotation */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order & Customer Summary Card */}
          <div className="bg-white border border-border-subtle p-6 shadow-2xs space-y-4">
            <h2 className="font-heading font-black text-sm uppercase tracking-wider text-charcoal pb-2 border-b border-border-subtle">
              Customer & Volume Requirement
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-secondary-text block mb-1">Customer Name:</span>
                <span className="font-heading font-bold text-sm text-charcoal">{order.customerName}</span>
              </div>

              <div>
                <span className="text-secondary-text block mb-1">Primary Phone:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-charcoal">{order.phone}</span>
                </div>
              </div>

              {order.email && (
                <div>
                  <span className="text-secondary-text block mb-1">Email Address:</span>
                  <span className="text-charcoal">{order.email}</span>
                </div>
              )}

              <div>
                <span className="text-secondary-text block mb-1">Selected Brick Variety:</span>
                <span className="font-heading font-bold text-sm text-charcoal">
                  {order.selectedProduct}
                </span>
              </div>

              <div>
                <span className="text-secondary-text block mb-1">Requested Brick Quantity:</span>
                <span className="font-heading font-black text-base text-terracotta">
                  {order.quantity?.toLocaleString("en-IN")} Bricks
                </span>
              </div>

              <div>
                <span className="text-secondary-text block mb-1">Urgency / Timeline:</span>
                <span className="text-charcoal font-semibold">{order.urgency || "Standard Batch"}</span>
              </div>
            </div>

            {/* Quick Action Contact Buttons */}
            <div className="pt-4 border-t border-border-subtle flex flex-wrap items-center gap-3">
              <a
                href={`tel:${order.phone}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-charcoal hover:bg-black text-white text-xs font-heading font-bold uppercase tracking-wider transition-colors shadow-2xs"
              >
                <Phone className="w-3.5 h-3.5 text-sandstone" />
                <span>Call Customer</span>
              </a>

              {waNumber && (
                <a
                  href={`https://wa.me/${waNumber}?text=${encodeURIComponent(waQuoteText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs font-heading font-bold uppercase tracking-wider transition-colors shadow-2xs"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                  <span>Send Quotation on WhatsApp</span>
                </a>
              )}
            </div>
          </div>

          {/* Delivery Site Logistics */}
          <div className="bg-white border border-border-subtle p-6 shadow-2xs space-y-4">
            <h2 className="font-heading font-black text-sm uppercase tracking-wider text-charcoal pb-2 border-b border-border-subtle flex items-center gap-2">
              <Truck className="w-4 h-4 text-sandstone" />
              <span>Site Logistics & Unloading Feasibility</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-secondary-text block mb-1">Destination Village / City:</span>
                <span className="font-heading font-bold text-charcoal">{locationText}</span>
              </div>

              <div>
                <span className="text-secondary-text block mb-1">Unloading Site Access:</span>
                <span className="font-semibold text-charcoal">
                  {order.unloadingSiteType
                    ? order.unloadingSiteType.replace(/_/g, " ").toUpperCase()
                    : "Standard Road Access"}
                </span>
              </div>

              {order.siteAddress && (
                <div className="sm:col-span-2">
                  <span className="text-secondary-text block mb-1">Exact Site Address:</span>
                  <p className="text-charcoal bg-warm-bg p-2.5 border border-border-subtle font-sans">
                    {order.siteAddress}
                  </p>
                </div>
              )}

              {order.landmark && (
                <div>
                  <span className="text-secondary-text block mb-1">Notable Landmark:</span>
                  <span className="text-charcoal font-medium">{order.landmark}</span>
                </div>
              )}

              {order.productInstructions && (
                <div className="sm:col-span-2">
                  <span className="text-secondary-text block mb-1">Customer Handling Instructions:</span>
                  <p className="text-charcoal bg-warm-bg p-2.5 border border-border-subtle font-sans">
                    {order.productInstructions}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quotation Calculator Card */}
          <div className="bg-white border-2 border-sandstone/60 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-terracotta" />
                <h2 className="font-heading font-black text-base text-charcoal">
                  Official Dispatch Quotation Calculator
                </h2>
              </div>
              {order.quotation?.quotedAt && (
                <span className="text-[10px] font-mono text-secondary-text">
                  Quoted: {new Date(order.quotation.quotedAt).toLocaleDateString("en-IN")}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                  Rate per Brick (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    placeholder="e.g. 7.50"
                    value={unitRate}
                    onChange={(e) => setUnitRate(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-warm-bg border border-border-subtle text-xs font-mono font-bold text-charcoal focus:bg-white focus:outline-none focus:border-terracotta"
                  />
                </div>
                <span className="text-[10px] text-secondary-text mt-1 block">
                  Ex-kiln base brick manufacturing price
                </span>
              </div>

              <div>
                <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                  Vehicle Haulage / Freight (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    step="50"
                    min="0"
                    placeholder="e.g. 2500"
                    value={vehicleHaulageRate}
                    onChange={(e) => setVehicleHaulageRate(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-warm-bg border border-border-subtle text-xs font-mono font-bold text-charcoal focus:bg-white focus:outline-none focus:border-terracotta"
                  />
                </div>
                <span className="text-[10px] text-secondary-text mt-1 block">
                  Tractor trolley / vehicle trip freight to destination
                </span>
              </div>
            </div>

            {/* Calculated Total Display */}
            <div className="p-4 bg-warm-bg border border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-secondary-text block">
                  Calculated Grand Quotation Total:
                </span>
                <span className="text-[11px] text-secondary-text">
                  ({numQuantity.toLocaleString("en-IN")} pcs &times; ₹{numUnitRate.toFixed(2)}) + ₹{numHaulage} haulage
                </span>
              </div>
              <div className="font-heading font-black text-2xl sm:text-3xl text-terracotta">
                ₹{computedTotal.toLocaleString("en-IN")}
              </div>
            </div>

            <div>
              <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1 text-xs">
                Quotation Remarks / Terms (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Validity 7 days. Unloading included within 10 meters of trolley stop."
                value={quotationNotes}
                onChange={(e) => setQuotationNotes(e.target.value)}
                className="w-full px-3 py-2 bg-warm-bg border border-border-subtle text-xs text-charcoal focus:bg-white focus:outline-none focus:border-terracotta"
              />
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white border border-border-subtle p-6 shadow-2xs space-y-4">
            <h2 className="font-heading font-black text-sm uppercase tracking-wider text-charcoal pb-2 border-b border-border-subtle">
              Order Timeline & Activity
            </h2>

            {order.timeline?.length > 0 ? (
              <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border-subtle">
                {order.timeline.map((event, idx) => (
                  <div key={idx} className="relative pl-8 text-xs space-y-1">
                    <div className="absolute left-2 top-1 w-3.5 h-3.5 rounded-full bg-sandstone border-2 border-white" />
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-charcoal">
                        {event.action.replace(/_/g, " ")}
                      </span>
                      <span className="text-[11px] text-secondary-text">
                        {new Date(event.timestamp).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </span>
                    </div>
                    {event.newStatus && (
                      <div className="text-[11px] text-secondary-text">
                        Status updated to: <strong className="text-charcoal uppercase">{event.newStatus}</strong>
                      </div>
                    )}
                    {event.note && (
                      <p className="p-2 bg-warm-bg border border-border-subtle text-charcoal text-[11px] mt-1">
                        &quot;{event.note}&quot;
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-secondary-text">
                No history recorded yet. Updates and status changes will appear here.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Status & Internal Notes */}
        <div className="space-y-6">
          <div className="bg-white border border-border-subtle p-6 shadow-2xs space-y-4">
            <h2 className="font-heading font-black text-sm uppercase tracking-wider text-charcoal pb-2 border-b border-border-subtle">
              Order Pipeline State
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                  Operational Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-warm-bg border border-border-subtle text-xs text-charcoal focus:bg-white focus:outline-none focus:border-terracotta cursor-pointer font-medium"
                >
                  <option value="pending">Pending Review</option>
                  <option value="contacted">Customer Contacted</option>
                  <option value="quoted">Quotation Provided</option>
                  <option value="confirmed">Order Confirmed</option>
                  <option value="dispatched">Dispatched from Kiln</option>
                  <option value="delivered">Delivered to Site</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                  Add Internal Staff Note
                </label>
                <textarea
                  rows={4}
                  placeholder="Record vehicle driver details, gate entry pass, or advance payment status..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full px-3 py-2 bg-warm-bg border border-border-subtle text-xs text-charcoal focus:bg-white focus:outline-none focus:border-terracotta"
                />
              </div>

              <button
                type="submit"
                disabled={isUpdating}
                className="w-full py-2.5 px-4 bg-terracotta hover:bg-[#833329] text-white text-xs font-heading font-bold uppercase tracking-wider transition-colors shadow-2xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>Save Quotation & Order</span>
              </button>
            </div>
          </div>

          {/* Internal Notes History */}
          <div className="bg-white border border-border-subtle p-6 shadow-2xs space-y-3">
            <h3 className="font-heading font-black text-xs uppercase tracking-wider text-charcoal pb-2 border-b border-border-subtle">
              Internal Team Notes ({order.internalNotes?.length || 0})
            </h3>

            {order.internalNotes?.length > 0 ? (
              <div className="space-y-3">
                {order.internalNotes.map((n, idx) => (
                  <div key={idx} className="p-3 bg-warm-bg border border-border-subtle text-xs space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-secondary-text">
                      <span className="font-bold text-charcoal">{n.adminName || "Admin"}</span>
                      <span>
                        {new Date(n.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-charcoal leading-relaxed">{n.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-secondary-text">
                No internal notes recorded yet for this order request.
              </p>
            )}
          </div>
        </div>
      </form>

      {/* Confirmation Modal for Archiving */}
      <ConfirmationModal
        isOpen={archiveModalOpen}
        title="Archive Order Request?"
        message={`Are you sure you want to archive order ${order.orderReference}? The order record will be preserved for financial auditing and reporting, but archived from active order lists.`}
        confirmLabel="Archive Order"
        isDestructive={true}
        isLoading={isArchiving}
        onConfirm={confirmArchive}
        onClose={() => setArchiveModalOpen(false)}
      />
    </div>
  );
}
