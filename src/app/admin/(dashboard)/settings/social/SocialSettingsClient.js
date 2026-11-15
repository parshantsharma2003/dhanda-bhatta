"use client";

import { useState } from "react";
import {
  Share2,
  Save,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";

export default function SocialSettingsClient({ initialSettings }) {
  const currentSocial = initialSettings?.social || {};

  const [formData, setFormData] = useState({
    facebook: currentSocial.facebook || "https://www.facebook.com/share/1Js74GJbZ8/",
    instagram:
      currentSocial.instagram ||
      "https://www.instagram.com/dhanda.bhatta?srtk=dXBjZmhmdzAwM3U4",
    youtube: currentSocial.youtube || "https://www.youtube.com/@dhandabhattacompany",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ social: formData }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to update social channels");
      }

      setMessage({ text: "Social media links updated successfully.", type: "success" });
    } catch (err) {
      console.error("[SocialSettings] Save error:", err);
      setMessage({ text: err.message || "Error saving social links", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-border-subtle">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-sandstone uppercase block mb-1">
            Global Configuration
          </span>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-charcoal tracking-tight">
            Social Media Profiles
          </h1>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-terracotta hover:bg-[#833329] text-white text-xs font-heading font-bold uppercase tracking-wider transition-colors shadow-2xs cursor-pointer disabled:opacity-50 self-start sm:self-auto"
        >
          {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          <span>Save Social Links</span>
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

      <div className="bg-white border border-border-subtle p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-border-subtle">
          <Share2 className="w-4 h-4 text-terracotta" />
          <h2 className="font-heading font-black text-sm uppercase tracking-wider text-charcoal">
            Official Public Profiles
          </h2>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
              Facebook Page URL
            </label>
            <input
              type="url"
              value={formData.facebook}
              onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
              placeholder="https://facebook.com/..."
              className="w-full px-3 py-2 bg-warm-bg border border-border-subtle font-mono text-xs text-charcoal focus:bg-white focus:outline-none focus:border-terracotta"
            />
          </div>

          <div>
            <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
              Instagram Profile URL
            </label>
            <input
              type="url"
              value={formData.instagram}
              onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
              placeholder="https://instagram.com/..."
              className="w-full px-3 py-2 bg-warm-bg border border-border-subtle font-mono text-xs text-charcoal focus:bg-white focus:outline-none focus:border-terracotta"
            />
          </div>

          <div>
            <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
              YouTube Channel URL
            </label>
            <input
              type="url"
              value={formData.youtube}
              onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
              placeholder="https://youtube.com/@..."
              className="w-full px-3 py-2 bg-warm-bg border border-border-subtle font-mono text-xs text-charcoal focus:bg-white focus:outline-none focus:border-terracotta"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
