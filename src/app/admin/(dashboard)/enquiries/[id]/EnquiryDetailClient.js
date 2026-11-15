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
  Calendar,
  Clock,
  Shield,
  Save,
  CheckCircle,
  AlertCircle,
  Archive,
  Loader2,
  FileText,
} from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import ConfirmationModal from "@/components/admin/ConfirmationModal";

export default function EnquiryDetailClient({ initialEnquiry }) {
  const router = useRouter();
  const [enquiry, setEnquiry] = useState(initialEnquiry);
  const [status, setStatus] = useState(initialEnquiry.status || "new");
  const [newNote, setNewNote] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const [archiveModalOpen, setArchiveModalOpen] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);

  // Normalize phone for WhatsApp URL (strip + or non-digits, add 91 if 10 digits)
  const rawDigits = (enquiry.phone || "").replace(/\D/g, "");
  const waNumber = rawDigits.length === 10 ? `91${rawDigits}` : rawDigits;

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await fetch(`/api/admin/enquiries/${enquiry._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          note: newNote.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to update enquiry");
      }

      setEnquiry(json.data.enquiry);
      setNewNote("");
      setMessage({ text: "Enquiry status and notes saved successfully.", type: "success" });
    } catch (err) {
      console.error("[EnquiryDetail] Update error:", err);
      setMessage({ text: err.message || "Error updating enquiry", type: "error" });
    } finally {
      setIsUpdating(false);
    }
  };

  const confirmArchive = async () => {
    setIsArchiving(true);
    try {
      const res = await fetch(`/api/admin/enquiries/${enquiry._id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to archive enquiry");
      }
      router.push("/admin/enquiries");
      router.refresh();
    } catch (err) {
      console.error("[EnquiryDetail] Archive error:", err);
      setMessage({ text: err.message || "Error archiving enquiry", type: "error" });
      setIsArchiving(false);
    }
  };

  const createdDate = new Date(enquiry.createdAt).toLocaleString("en-IN", {
    dateStyle: "full",
    timeStyle: "short",
  });

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-border-subtle">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/enquiries"
            className="p-2 border border-border-subtle bg-white hover:bg-warm-bg text-secondary-text hover:text-charcoal transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-xs text-sandstone uppercase">
                {enquiry.enquiryReference}
              </span>
              <StatusBadge status={enquiry.status} />
            </div>
            <h1 className="font-heading font-black text-2xl text-charcoal tracking-tight">
              Enquiry from {enquiry.fullName}
            </h1>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setArchiveModalOpen(true)}
          className="p-2 border border-border-subtle bg-warm-bg hover:bg-white text-secondary-text hover:text-terracotta text-xs font-heading font-bold uppercase transition-colors self-start sm:self-auto flex items-center gap-1.5 cursor-pointer"
        >
          <Archive className="w-3.5 h-3.5" />
          <span>Archive Record</span>
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

      {/* Main Grid: Details (Left) + Actions/Notes (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Customer & Message Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Card */}
          <div className="bg-white border border-border-subtle p-6 shadow-2xs space-y-4">
            <h2 className="font-heading font-black text-sm uppercase tracking-wider text-charcoal pb-2 border-b border-border-subtle">
              Customer Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-secondary-text block mb-1">Full Name:</span>
                <span className="font-heading font-bold text-sm text-charcoal">{enquiry.fullName}</span>
              </div>

              <div>
                <span className="text-secondary-text block mb-1">Phone Number:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-charcoal">{enquiry.phone}</span>
                </div>
              </div>

              {enquiry.email && (
                <div>
                  <span className="text-secondary-text block mb-1">Email Address:</span>
                  <span className="text-charcoal">{enquiry.email}</span>
                </div>
              )}

              <div>
                <span className="text-secondary-text block mb-1">Delivery / Project Site:</span>
                <span className="text-charcoal font-medium">
                  {enquiry.deliveryLocation || "Not specified (Inquiry only)"}
                </span>
              </div>

              <div>
                <span className="text-secondary-text block mb-1">Inquiry Purpose:</span>
                <span className="text-charcoal font-medium">{enquiry.enquiryType}</span>
              </div>

              <div>
                <span className="text-secondary-text block mb-1">Product of Interest:</span>
                <span className="text-charcoal font-bold">{enquiry.interestedProduct || "General Inquiry"}</span>
              </div>

              <div>
                <span className="text-secondary-text block mb-1">Preferred Contact Mode:</span>
                <span className="text-charcoal capitalize">{enquiry.preferredContactMethod || "Phone Call"}</span>
              </div>

              <div>
                <span className="text-secondary-text block mb-1">Submission Date:</span>
                <span className="text-secondary-text">{createdDate}</span>
              </div>
            </div>

            {/* Quick Action Buttons Bar */}
            <div className="pt-4 border-t border-border-subtle flex flex-wrap items-center gap-3">
              <a
                href={`tel:${enquiry.phone}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-charcoal hover:bg-black text-white text-xs font-heading font-bold uppercase tracking-wider transition-colors shadow-2xs"
              >
                <Phone className="w-3.5 h-3.5 text-sandstone" />
                <span>Call Customer</span>
              </a>

              {waNumber && (
                <a
                  href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                    `Hello ${enquiry.fullName}, thank you for contacting Dhanda Bhatta Company regarding your enquiry ${enquiry.enquiryReference}. How can we assist you today?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs font-heading font-bold uppercase tracking-wider transition-colors shadow-2xs"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                  <span>WhatsApp Message</span>
                </a>
              )}

              {enquiry.email && (
                <a
                  href={`mailto:${enquiry.email}?subject=${encodeURIComponent(
                    `Dhanda Bhatta Company - Regarding your enquiry ${enquiry.enquiryReference}`
                  )}`}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-border-subtle bg-warm-bg hover:bg-white text-charcoal text-xs font-heading font-bold uppercase tracking-wider transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-secondary-text" />
                  <span>Send Email</span>
                </a>
              )}
            </div>
          </div>

          {/* Customer Message Body */}
          <div className="bg-white border border-border-subtle p-6 shadow-2xs space-y-3">
            <h2 className="font-heading font-black text-sm uppercase tracking-wider text-charcoal pb-2 border-b border-border-subtle">
              Customer Message
            </h2>
            <div className="p-4 bg-warm-bg border border-border-subtle text-xs sm:text-sm text-charcoal leading-relaxed whitespace-pre-wrap font-sans">
              {enquiry.message}
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white border border-border-subtle p-6 shadow-2xs space-y-4">
            <h2 className="font-heading font-black text-sm uppercase tracking-wider text-charcoal pb-2 border-b border-border-subtle">
              Enquiry Timeline & History
            </h2>

            {enquiry.timeline?.length > 0 ? (
              <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border-subtle">
                {enquiry.timeline.map((event, idx) => (
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
                        Status transitioned to: <strong className="text-charcoal uppercase">{event.newStatus}</strong>
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
                No past timeline events. Status changes and internal notes will appear here.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Status Transition & Internal Notes */}
        <div className="space-y-6">
          <div className="bg-white border border-border-subtle p-6 shadow-2xs space-y-4">
            <h2 className="font-heading font-black text-sm uppercase tracking-wider text-charcoal pb-2 border-b border-border-subtle">
              Update Pipeline State
            </h2>

            <form onSubmit={handleUpdate} className="space-y-4 text-xs">
              <div>
                <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                  Enquiry Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-warm-bg border border-border-subtle text-xs text-charcoal focus:bg-white focus:outline-none focus:border-terracotta cursor-pointer font-medium"
                >
                  <option value="new">New (Awaiting Review)</option>
                  <option value="contacted">Contacted (In Discussion)</option>
                  <option value="quoted">Quoted (Price Provided)</option>
                  <option value="closed">Closed (Completed)</option>
                  <option value="spam">Spam / Junk</option>
                </select>
              </div>

              <div>
                <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                  Add Internal Staff Note
                </label>
                <textarea
                  rows={4}
                  placeholder="Record call outcome, brick rate quoted, or next follow-up action..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full px-3 py-2 bg-warm-bg border border-border-subtle text-xs text-charcoal focus:bg-white focus:outline-none focus:border-terracotta"
                />
                <p className="text-[11px] text-secondary-text mt-1">
                  Notes are strictly internal and never visible to customers.
                </p>
              </div>

              <button
                type="submit"
                disabled={isUpdating}
                className="w-full py-2.5 px-4 bg-terracotta hover:bg-[#833329] text-white text-xs font-heading font-bold uppercase tracking-wider transition-colors shadow-2xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>Save Status & Note</span>
              </button>
            </form>
          </div>

          {/* Existing Internal Notes List */}
          <div className="bg-white border border-border-subtle p-6 shadow-2xs space-y-3">
            <h3 className="font-heading font-black text-xs uppercase tracking-wider text-charcoal pb-2 border-b border-border-subtle">
              Internal Team Notes ({enquiry.internalNotes?.length || 0})
            </h3>

            {enquiry.internalNotes?.length > 0 ? (
              <div className="space-y-3">
                {enquiry.internalNotes.map((note, idx) => (
                  <div key={idx} className="p-3 bg-warm-bg border border-border-subtle text-xs space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-secondary-text">
                      <span className="font-bold text-charcoal">{note.adminName || "Admin"}</span>
                      <span>
                        {new Date(note.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-charcoal leading-relaxed">{note.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-secondary-text">
                No internal notes recorded yet for this enquiry.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Archiving */}
      <ConfirmationModal
        isOpen={archiveModalOpen}
        title="Archive Customer Enquiry?"
        message={`Are you sure you want to archive enquiry ${enquiry.enquiryReference}? The record will be preserved in database storage but hidden from active CRM inboxes.`}
        confirmLabel="Archive Record"
        isDestructive={true}
        isLoading={isArchiving}
        onConfirm={confirmArchive}
        onClose={() => setArchiveModalOpen(false)}
      />
    </div>
  );
}
