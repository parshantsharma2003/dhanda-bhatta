"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Save,
  Send,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileText,
  Sparkles,
  Layers,
} from "lucide-react";
import CloudinaryUploader from "@/components/admin/CloudinaryUploader";

export default function HomepageEditorClient({ initialContent }) {
  const currentData = initialContent?.draftData || initialContent?.publishedData || {};

  const [formData, setFormData] = useState({
    heroTagline: currentData.heroTagline || "VILLAGE KALWA • JIND • HARYANA",
    heroHeadline: currentData.heroHeadline || "TRADITIONAL RED CLAY BRICKS FIRED FOR LIFETIME INTEGRITY",
    heroDescription:
      currentData.heroDescription ||
      "Direct manufacturer of premium kiln-burnt red clay bricks, engineered for structural resilience, residential foundations, and commercial masonry across Jind and nearby Haryana regions.",
    primaryCtaText: currentData.primaryCtaText || "Request Bulk Quotation",
    primaryCtaLink: currentData.primaryCtaLink || "/order",
    secondaryCtaText: currentData.secondaryCtaText || "Explore Brick Catalogue",
    secondaryCtaLink: currentData.secondaryCtaLink || "/products",
    bannerImageUrl: currentData.bannerImageUrl || "",
    // Key Stats
    statsYears: currentData.statsYears || "25+",
    statsDailyCapacity: currentData.statsDailyCapacity || "50,000+",
    statsDeliveryRadius: currentData.statsDeliveryRadius || "60 KM",
    statsQualityStandard: currentData.statsQualityStandard || "IS 1077",
    // About Excerpt
    aboutTitle: currentData.aboutTitle || "Rooted in the Soil of Kalwa, Firing Bricks of Substance",
    aboutExcerpt:
      currentData.aboutExcerpt ||
      "Dhanda Bhatta Company operates a classic fixed-chimney Bull's Trench Kiln in Village Kalwa, Pillukhera, Haryana. We balance ancestral kiln craftsmanship with rigorous soil preparation to deliver dense, evenly burnt bricks trusted by builders, contractors, and home-makers.",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [status, setStatus] = useState(initialContent?.status || "published");

  const handleSave = async (publish = false) => {
    if (publish) setIsPublishing(true);
    else setIsSaving(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await fetch("/api/admin/content/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: formData,
          publish,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to update homepage content");
      }

      setStatus(publish ? "published" : "draft");
      setMessage({
        text: publish
          ? "Homepage content published live to the public website!"
          : "Draft saved. Changes will not be visible on the public site until published.",
        type: "success",
      });
    } catch (err) {
      console.error("[HomepageEditor] Save error:", err);
      setMessage({ text: err.message || "Error saving content", type: "error" });
    } finally {
      setIsSaving(false);
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-border-subtle">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold tracking-widest text-sandstone uppercase">
              CMS • Content Management
            </span>
            <span
              className={`px-2 py-0.5 text-[9px] font-mono uppercase font-bold tracking-wider border ${
                status === "published"
                  ? "bg-[#E8F5E9] text-[#2E7D32] border-[#2E7D32]/20"
                  : "bg-[#FFF8E1] text-[#B78103] border-[#FFE082]"
              }`}
            >
              {status === "published" ? "Live Published" : "Draft (Unpublished Changes)"}
            </span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-charcoal tracking-tight">
            Homepage Content Editor
          </h1>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-border-subtle bg-white hover:bg-warm-bg text-charcoal text-xs font-heading font-bold transition-colors"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-secondary-text" />
          </Link>

          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={isSaving || isPublishing}
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-border-subtle bg-warm-bg hover:bg-white text-charcoal text-xs font-heading font-bold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={isSaving || isPublishing}
            className="inline-flex items-center gap-1.5 px-5 py-2 bg-terracotta hover:bg-[#833329] text-white text-xs font-heading font-bold uppercase tracking-wider transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
          >
            {isPublishing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>Publish Live</span>
          </button>
        </div>
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

      {/* Editor Form Sections */}
      <div className="space-y-6">
        {/* Section 1: Hero Section */}
        <div className="bg-white border border-border-subtle p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border-subtle">
            <Sparkles className="w-4 h-4 text-terracotta" />
            <h2 className="font-heading font-black text-sm uppercase tracking-wider text-charcoal">
              1. Hero Presentation Section
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                Top Tagline / Location Badge
              </label>
              <input
                type="text"
                value={formData.heroTagline}
                onChange={(e) => setFormData({ ...formData, heroTagline: e.target.value })}
                className="w-full px-3 py-2 bg-warm-bg border border-border-subtle text-xs text-charcoal focus:bg-white focus:outline-none focus:border-terracotta"
              />
            </div>

            <div>
              <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                Main Hero Headline (Archivo Bold)
              </label>
              <textarea
                rows={2}
                value={formData.heroHeadline}
                onChange={(e) => setFormData({ ...formData, heroHeadline: e.target.value })}
                className="w-full px-3 py-2 bg-warm-bg border border-border-subtle text-xs font-heading font-bold text-charcoal focus:bg-white focus:outline-none focus:border-terracotta"
              />
            </div>

            <div>
              <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                Hero Subtitle / Business Description
              </label>
              <textarea
                rows={3}
                value={formData.heroDescription}
                onChange={(e) => setFormData({ ...formData, heroDescription: e.target.value })}
                className="w-full px-3 py-2 bg-warm-bg border border-border-subtle text-xs text-charcoal focus:bg-white focus:outline-none focus:border-terracotta leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                  Primary Call-to-Action Text
                </label>
                <input
                  type="text"
                  value={formData.primaryCtaText}
                  onChange={(e) => setFormData({ ...formData, primaryCtaText: e.target.value })}
                  className="w-full px-3 py-2 bg-warm-bg border border-border-subtle text-xs text-charcoal"
                />
              </div>

              <div>
                <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                  Primary CTA Destination Link
                </label>
                <input
                  type="text"
                  value={formData.primaryCtaLink}
                  onChange={(e) => setFormData({ ...formData, primaryCtaLink: e.target.value })}
                  className="w-full px-3 py-2 bg-warm-bg border border-border-subtle text-xs font-mono text-charcoal"
                />
              </div>

              <div>
                <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                  Secondary Call-to-Action Text
                </label>
                <input
                  type="text"
                  value={formData.secondaryCtaText}
                  onChange={(e) => setFormData({ ...formData, secondaryCtaText: e.target.value })}
                  className="w-full px-3 py-2 bg-warm-bg border border-border-subtle text-xs text-charcoal"
                />
              </div>

              <div>
                <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                  Secondary CTA Destination Link
                </label>
                <input
                  type="text"
                  value={formData.secondaryCtaLink}
                  onChange={(e) => setFormData({ ...formData, secondaryCtaLink: e.target.value })}
                  className="w-full px-3 py-2 bg-warm-bg border border-border-subtle text-xs font-mono text-charcoal"
                />
              </div>
            </div>

            {/* Optional Banner Image via Cloudinary */}
            <div className="pt-3 border-t border-border-subtle">
              <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-2">
                Hero Background Banner Image (Optional)
              </label>
              <div className="flex items-center gap-4">
                <CloudinaryUploader
                  folder="dbc/cms"
                  resourceType="image"
                  onUploadSuccess={(file) => setFormData({ ...formData, bannerImageUrl: file.url })}
                  buttonLabel="Upload Banner Photo"
                />
                {formData.bannerImageUrl && (
                  <span className="text-[11px] font-mono text-[#2E7D32]">Image attached ✓</span>
                )}
              </div>
              {formData.bannerImageUrl && (
                <div className="mt-2 relative w-full h-28 bg-charcoal/10 overflow-hidden border border-border-subtle">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={formData.bannerImageUrl}
                    alt="Hero Banner"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Key Operational Metrics Highlights */}
        <div className="bg-white border border-border-subtle p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border-subtle">
            <Layers className="w-4 h-4 text-sandstone" />
            <h2 className="font-heading font-black text-sm uppercase tracking-wider text-charcoal">
              2. Key Highlight Statistics Bar
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                Kiln Heritage (Years)
              </label>
              <input
                type="text"
                value={formData.statsYears}
                onChange={(e) => setFormData({ ...formData, statsYears: e.target.value })}
                className="w-full px-3 py-2 bg-warm-bg border border-border-subtle font-mono text-xs text-charcoal"
              />
            </div>

            <div>
              <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                Firing Capacity
              </label>
              <input
                type="text"
                value={formData.statsDailyCapacity}
                onChange={(e) => setFormData({ ...formData, statsDailyCapacity: e.target.value })}
                className="w-full px-3 py-2 bg-warm-bg border border-border-subtle font-mono text-xs text-charcoal"
              />
            </div>

            <div>
              <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                Delivery Coverage
              </label>
              <input
                type="text"
                value={formData.statsDeliveryRadius}
                onChange={(e) => setFormData({ ...formData, statsDeliveryRadius: e.target.value })}
                className="w-full px-3 py-2 bg-warm-bg border border-border-subtle font-mono text-xs text-charcoal"
              />
            </div>

            <div>
              <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                Quality Standard
              </label>
              <input
                type="text"
                value={formData.statsQualityStandard}
                onChange={(e) => setFormData({ ...formData, statsQualityStandard: e.target.value })}
                className="w-full px-3 py-2 bg-warm-bg border border-border-subtle font-mono text-xs text-charcoal"
              />
            </div>
          </div>
        </div>

        {/* Section 3: About Teaser */}
        <div className="bg-white border border-border-subtle p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border-subtle">
            <FileText className="w-4 h-4 text-charcoal" />
            <h2 className="font-heading font-black text-sm uppercase tracking-wider text-charcoal">
              3. Homepage About Overview
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                Section Heading
              </label>
              <input
                type="text"
                value={formData.aboutTitle}
                onChange={(e) => setFormData({ ...formData, aboutTitle: e.target.value })}
                className="w-full px-3 py-2 bg-warm-bg border border-border-subtle text-xs text-charcoal font-medium"
              />
            </div>

            <div>
              <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                Summary Paragraph
              </label>
              <textarea
                rows={4}
                value={formData.aboutExcerpt}
                onChange={(e) => setFormData({ ...formData, aboutExcerpt: e.target.value })}
                className="w-full px-3 py-2 bg-warm-bg border border-border-subtle text-xs text-charcoal leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Save Bar Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-subtle">
          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={isSaving || isPublishing}
            className="px-4 py-2 border border-border-subtle bg-warm-bg hover:bg-white text-charcoal text-xs font-heading font-bold uppercase tracking-wider cursor-pointer disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={isSaving || isPublishing}
            className="px-6 py-2 bg-terracotta hover:bg-[#833329] text-white text-xs font-heading font-bold uppercase tracking-wider cursor-pointer disabled:opacity-50 flex items-center gap-2 shadow-2xs"
          >
            {isPublishing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>Publish Live to Website</span>
          </button>
        </div>
      </div>
    </div>
  );
}
