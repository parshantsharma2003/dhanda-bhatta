"use client";

import { useState } from "react";
import {
  Building2,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Save,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";
import CloudinaryUploader from "@/components/admin/CloudinaryUploader";

export default function BusinessSettingsClient({ initialSettings }) {
  const currentBusiness = initialSettings?.business || {};

  const [formData, setFormData] = useState({
    name: currentBusiness.name || "Dhanda Bhatta Company",
    description:
      currentBusiness.description ||
      "Leading brick manufacturing and supply facility based in Village Kalwa, Jind, Haryana.",
    address:
      currentBusiness.address ||
      "Village Kalwa, near Dharoli Gausala, Pillukhera, Jind, Haryana 126113",
    phone: currentBusiness.phone || "+919996669463",
    phoneDisplay: currentBusiness.phoneDisplay || "+91 99966-69463",
    whatsappNumber: currentBusiness.whatsappNumber || "918295669463",
    email: currentBusiness.email || "contact@dhandabhatta.com",
    googleMapsUrl:
      currentBusiness.googleMapsUrl ||
      "https://share.google/60pwtYCEIZ6sF7aGz",
    embeddedMapUrl: currentBusiness.embeddedMapUrl || "",
    logoUrl: currentBusiness.logoUrl || "",
    openingHours: currentBusiness.openingHours || "Mon - Sat: 7:00 AM - 7:00 PM (IST)",
    deliveryAvailabilityMessage:
      currentBusiness.deliveryAvailabilityMessage ||
      "Delivery available across Jind, Safidon, Panipat, Assandh, and nearby Haryana districts.",
    serviceableLocations:
      currentBusiness.serviceableLocations?.length > 0
        ? currentBusiness.serviceableLocations.join(", ")
        : "Jind, Pillukhera, Safidon, Panipat, Assandh, Gohana, Rohtak, Kaithal",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ text: "", type: "" });

    try {
      const locationsArray = formData.serviceableLocations
        .split(",")
        .map((loc) => loc.trim())
        .filter(Boolean);

      const payload = {
        business: {
          ...formData,
          serviceableLocations: locationsArray,
        },
      };

      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to save settings");
      }

      setMessage({ text: "Business details and contact settings saved successfully.", type: "success" });
    } catch (err) {
      console.error("[BusinessSettings] Save error:", err);
      setMessage({ text: err.message || "Error saving business details", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-border-subtle">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-sandstone uppercase block mb-1">
            Global Configuration
          </span>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-charcoal tracking-tight">
            Business Details & Contact Info
          </h1>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-terracotta hover:bg-[#833329] text-white text-xs font-heading font-bold uppercase tracking-wider transition-colors shadow-2xs cursor-pointer disabled:opacity-50 self-start sm:self-auto"
        >
          {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          <span>Save Changes</span>
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

      {/* Section 1: Business Identity */}
      <div className="bg-white border border-border-subtle p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-border-subtle">
          <Building2 className="w-4 h-4 text-terracotta" />
          <h2 className="font-heading font-black text-sm uppercase tracking-wider text-charcoal">
            1. Business Identity
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
              Company Legal / Trading Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-warm-bg border border-border-subtle text-xs text-charcoal focus:bg-white focus:outline-none focus:border-terracotta"
            />
          </div>

          <div>
            <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
              Opening / Working Hours
            </label>
            <input
              type="text"
              value={formData.openingHours}
              onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
              className="w-full px-3 py-2 bg-warm-bg border border-border-subtle text-xs text-charcoal focus:bg-white focus:outline-none focus:border-terracotta"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
              Business Tagline / Summary
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-warm-bg border border-border-subtle text-xs text-charcoal focus:bg-white focus:outline-none focus:border-terracotta"
            />
          </div>

          {/* Logo Upload via Cloudinary */}
          <div className="sm:col-span-2 pt-2 border-t border-border-subtle">
            <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-2">
              Official Company Wordmark / Logo
            </label>
            <div className="flex items-center gap-4">
              <CloudinaryUploader
                folder="dbc/branding"
                resourceType="image"
                onUploadSuccess={(file) => setFormData({ ...formData, logoUrl: file.url })}
                buttonLabel="Upload Logo Image"
              />
              {formData.logoUrl && (
                <div className="h-10 px-3 py-1 bg-charcoal flex items-center justify-center border border-border-subtle">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={formData.logoUrl} alt="Logo" className="h-full object-contain" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Contact Points & Numbers */}
      <div className="bg-white border border-border-subtle p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-border-subtle">
          <Phone className="w-4 h-4 text-sandstone" />
          <h2 className="font-heading font-black text-sm uppercase tracking-wider text-charcoal">
            2. Customer Communication Points
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
              Primary Phone (E.164 dial string) *
            </label>
            <input
              type="text"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+919996669463"
              className="w-full px-3 py-2 bg-warm-bg border border-border-subtle font-mono text-xs text-charcoal focus:bg-white focus:outline-none focus:border-terracotta"
            />
          </div>

          <div>
            <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
              Phone Display Format (Public Website) *
            </label>
            <input
              type="text"
              required
              value={formData.phoneDisplay}
              onChange={(e) => setFormData({ ...formData, phoneDisplay: e.target.value })}
              placeholder="+91 99966-69463"
              className="w-full px-3 py-2 bg-warm-bg border border-border-subtle text-xs text-charcoal focus:bg-white focus:outline-none focus:border-terracotta"
            />
          </div>

          <div>
            <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
              WhatsApp Direct Number (Digits only, including country code) *
            </label>
            <input
              type="text"
              required
              value={formData.whatsappNumber}
              onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
              placeholder="918295669463"
              className="w-full px-3 py-2 bg-warm-bg border border-border-subtle font-mono text-xs text-charcoal focus:bg-white focus:outline-none focus:border-terracotta"
            />
          </div>

          <div>
            <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
              Official Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="contact@dhandabhatta.com"
              className="w-full px-3 py-2 bg-warm-bg border border-border-subtle text-xs text-charcoal focus:bg-white focus:outline-none focus:border-terracotta"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Physical Address & Map */}
      <div className="bg-white border border-border-subtle p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-border-subtle">
          <MapPin className="w-4 h-4 text-terracotta" />
          <h2 className="font-heading font-black text-sm uppercase tracking-wider text-charcoal">
            3. Kiln Facility Location & Navigation
          </h2>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
              Physical Kiln Yard Address *
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 bg-warm-bg border border-border-subtle text-xs text-charcoal focus:bg-white focus:outline-none focus:border-terracotta"
            />
          </div>

          <div>
            <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
              Google Maps Location Link (for directions)
            </label>
            <input
              type="url"
              value={formData.googleMapsUrl}
              onChange={(e) => setFormData({ ...formData, googleMapsUrl: e.target.value })}
              placeholder="https://maps.google.com/?q=..."
              className="w-full px-3 py-2 bg-warm-bg border border-border-subtle text-xs font-mono text-charcoal focus:bg-white focus:outline-none focus:border-terracotta"
            />
          </div>

          <div>
            <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
              Serviceable Towns & Regions (Comma-separated)
            </label>
            <input
              type="text"
              value={formData.serviceableLocations}
              onChange={(e) => setFormData({ ...formData, serviceableLocations: e.target.value })}
              className="w-full px-3 py-2 bg-warm-bg border border-border-subtle text-xs text-charcoal focus:bg-white focus:outline-none focus:border-terracotta"
            />
          </div>
        </div>
      </div>

      {/* Bottom Save Bar */}
      <div className="flex items-center justify-end pt-3">
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2.5 bg-terracotta hover:bg-[#833329] text-white text-xs font-heading font-bold uppercase tracking-wider transition-colors shadow-2xs cursor-pointer disabled:opacity-50 flex items-center gap-2"
        >
          {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          <span>Save Business Settings</span>
        </button>
      </div>
    </form>
  );
}
