"use client";

import { useState } from "react";
import {
  Search,
  Save,
  CheckCircle,
  AlertCircle,
  Loader2,
  Globe,
  AlertTriangle,
} from "lucide-react";
import CloudinaryUploader from "@/components/admin/CloudinaryUploader";

export default function SeoSettingsClient({ initialSettings }) {
  const currentSeo = initialSettings?.seo || {};

  const [formData, setFormData] = useState({
    defaultTitle:
      currentSeo.defaultTitle ||
      "Dhanda Bhatta Company | Premium Red Clay Bricks | Kalwa, Jind",
    defaultDescription:
      currentSeo.defaultDescription ||
      "Dhanda Bhatta Company manufactures premium red clay bricks in Village Kalwa, Pillukhera, Jind, Haryana. Reliable brick supply with delivery across nearby areas.",
    defaultOgImage: currentSeo.defaultOgImage || "/images/hero.jpg",
    robotsIndexing: currentSeo.robotsIndexing ?? true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ text: "", type: "" });

    try {
      const payload = {
        seo: formData,
      };

      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to update SEO settings");
      }

      setMessage({ text: "SEO metadata and search indexation settings saved.", type: "success" });
    } catch (err) {
      console.error("[SeoSettings] Save error:", err);
      setMessage({ text: err.message || "Error saving SEO settings", type: "error" });
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
            SEO & Search Engine Indexation
          </h1>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-terracotta hover:bg-[#833329] text-white text-xs font-heading font-bold uppercase tracking-wider transition-colors shadow-2xs cursor-pointer disabled:opacity-50 self-start sm:self-auto"
        >
          {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          <span>Save SEO Settings</span>
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

      {/* Meta Information Card */}
      <div className="bg-white border border-border-subtle p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-border-subtle">
          <Globe className="w-4 h-4 text-terracotta" />
          <h2 className="font-heading font-black text-sm uppercase tracking-wider text-charcoal">
            Default Search Metadata
          </h2>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
              Global Default Meta Title (Google Search) *
            </label>
            <input
              type="text"
              required
              value={formData.defaultTitle}
              onChange={(e) => setFormData({ ...formData, defaultTitle: e.target.value })}
              className="w-full px-3 py-2 bg-warm-bg border border-border-subtle text-xs text-charcoal focus:bg-white focus:outline-none focus:border-terracotta"
            />
            <span className="text-[10px] text-secondary-text mt-1 block">
              Recommended: 50–60 characters. Appears as the clickable title in search results.
            </span>
          </div>

          <div>
            <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
              Global Default Meta Description *
            </label>
            <textarea
              rows={3}
              required
              value={formData.defaultDescription}
              onChange={(e) => setFormData({ ...formData, defaultDescription: e.target.value })}
              className="w-full px-3 py-2 bg-warm-bg border border-border-subtle text-xs text-charcoal focus:bg-white focus:outline-none focus:border-terracotta leading-relaxed"
            />
            <span className="text-[10px] text-secondary-text mt-1 block">
              Recommended: 140–160 characters. Summarizes the company for search snippets.
            </span>
          </div>

          {/* OG Image */}
          <div className="pt-2 border-t border-border-subtle">
            <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-2">
              Default Social Sharing Image (Open Graph / WhatsApp / Facebook Preview)
            </label>
            <div className="flex items-center gap-4">
              <CloudinaryUploader
                folder="dbc/seo"
                resourceType="image"
                onUploadSuccess={(file) => setFormData({ ...formData, defaultOgImage: file.url })}
                buttonLabel="Upload Share Image"
              />
              {formData.defaultOgImage && (
                <span className="text-[11px] font-mono text-charcoal truncate max-w-xs">
                  {formData.defaultOgImage}
                </span>
              )}
            </div>
            {formData.defaultOgImage && (
              <div className="mt-2 w-48 h-28 bg-charcoal/10 border border-border-subtle overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={formData.defaultOgImage}
                  alt="OG Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Engine Robots Indexing Toggle */}
      <div className="bg-white border border-border-subtle p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-border-subtle">
          <Search className="w-4 h-4 text-sandstone" />
          <h2 className="font-heading font-black text-sm uppercase tracking-wider text-charcoal">
            Search Engine Crawler Policy
          </h2>
        </div>

        <div className="space-y-3 text-xs">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.robotsIndexing}
              onChange={(e) => setFormData({ ...formData, robotsIndexing: e.target.checked })}
              className="w-4 h-4 mt-0.5 text-terracotta border-border-subtle rounded-none cursor-pointer"
            />
            <div>
              <span className="font-heading font-bold text-charcoal block">
                Allow Search Engines to Index Public Website (robots.txt index, follow)
              </span>
              <p className="text-secondary-text text-[11px] leading-relaxed mt-0.5">
                When enabled, Google, Bing, and other search engines are permitted to discover, index, and rank public pages.
              </p>
            </div>
          </label>

          {!formData.robotsIndexing && (
            <div className="p-3 bg-[#FFF8E1] border-l-4 border-[#B78103] text-charcoal flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-[#B78103] shrink-0 mt-0.5" />
              <p className="text-[11px]">
                Warning: Search indexing is currently <strong>disabled</strong>. Crawlers will receive noindex instructions. Admin routes are permanently protected from indexing regardless of this setting.
              </p>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
