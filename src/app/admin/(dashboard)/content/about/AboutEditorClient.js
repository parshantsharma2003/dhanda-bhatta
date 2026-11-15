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
  Plus,
  Trash2,
  BookOpen,
} from "lucide-react";

export default function AboutEditorClient({ initialContent }) {
  const currentData = initialContent?.draftData || initialContent?.publishedData || {};

  const [formData, setFormData] = useState({
    heritageHeading:
      currentData.heritageHeading ||
      "Three Decades of Kiln Craft in the Heart of Haryana",
    heritageStory:
      currentData.heritageStory ||
      "Established in Village Kalwa, Pillukhera (District Jind, Haryana), Dhanda Bhatta Company was founded on an uncompromised commitment to producing true red clay masonry bricks. Over twenty-five years, we have supplied essential materials for rural homesteads, commercial complexes, and municipal infrastructure across the regional belt.",
    manufacturingPhilosophy:
      currentData.manufacturingPhilosophy ||
      "We rely on authentic local alluvium clay enriched with optimal sand and silt ratios. Every green brick is hand-moulded, sun-cured over expansive drying beds, and fired inside our fixed-chimney Bull's Trench Kiln under controlled coal stoking cycles reaching 1000°C.",
    // Core Values Array
    values: currentData.values || [
      {
        title: "Soil Purity & Silt Balance",
        description:
          "Carefully tested agricultural silt blended for optimum clay cohesion without efflorescence or thermal fracturing.",
      },
      {
        title: "Uniform High-Temp Firing",
        description:
          "Continuous flame progression in Bull's Trench Kiln ensures even density and authentic metallic ring on impact.",
      },
      {
        title: "Responsible Regional Supply",
        description:
          "Direct tractor trolley and vehicle logistics serving Jind, Safidon, Pillukhera, and neighboring development belts.",
      },
    ],
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [status, setStatus] = useState(initialContent?.status || "published");

  const handleAddValue = () => {
    setFormData((prev) => ({
      ...prev,
      values: [...prev.values, { title: "", description: "" }],
    }));
  };

  const handleUpdateValue = (idx, field, val) => {
    setFormData((prev) => {
      const updated = [...prev.values];
      updated[idx] = { ...updated[idx], [field]: val };
      return { ...prev, values: updated };
    });
  };

  const handleRemoveValue = (idx) => {
    setFormData((prev) => ({
      ...prev,
      values: prev.values.filter((_, i) => i !== idx),
    }));
  };

  const handleSave = async (publish = false) => {
    if (publish) setIsPublishing(true);
    else setIsSaving(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await fetch("/api/admin/content/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: formData,
          publish,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to update about page content");
      }

      setStatus(publish ? "published" : "draft");
      setMessage({
        text: publish
          ? "About page content published live to the public website!"
          : "Draft saved. Changes will not be visible on the public site until published.",
        type: "success",
      });
    } catch (err) {
      console.error("[AboutEditor] Save error:", err);
      setMessage({ text: err.message || "Error saving about content", type: "error" });
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
            About Us & Values Editor
          </h1>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <Link
            href="/about"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-border-subtle bg-white hover:bg-warm-bg text-charcoal text-xs font-heading font-bold transition-colors"
          >
            <span>Live Page</span>
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

      {/* Editor Form */}
      <div className="space-y-6">
        {/* Heritage Story */}
        <div className="bg-white border border-border-subtle p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border-subtle">
            <BookOpen className="w-4 h-4 text-terracotta" />
            <h2 className="font-heading font-black text-sm uppercase tracking-wider text-charcoal">
              1. Heritage & Origin Story
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                Heritage Headline
              </label>
              <input
                type="text"
                value={formData.heritageHeading}
                onChange={(e) => setFormData({ ...formData, heritageHeading: e.target.value })}
                className="w-full px-3 py-2 bg-warm-bg border border-border-subtle text-xs text-charcoal font-medium focus:bg-white focus:outline-none focus:border-terracotta"
              />
            </div>

            <div>
              <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                Founding Narrative & History
              </label>
              <textarea
                rows={5}
                value={formData.heritageStory}
                onChange={(e) => setFormData({ ...formData, heritageStory: e.target.value })}
                className="w-full px-3 py-2 bg-warm-bg border border-border-subtle text-xs text-charcoal leading-relaxed focus:bg-white focus:outline-none focus:border-terracotta"
              />
            </div>

            <div>
              <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                Manufacturing Philosophy & Kiln Firing
              </label>
              <textarea
                rows={4}
                value={formData.manufacturingPhilosophy}
                onChange={(e) =>
                  setFormData({ ...formData, manufacturingPhilosophy: e.target.value })
                }
                className="w-full px-3 py-2 bg-warm-bg border border-border-subtle text-xs text-charcoal leading-relaxed focus:bg-white focus:outline-none focus:border-terracotta"
              />
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="bg-white border border-border-subtle p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
            <h2 className="font-heading font-black text-sm uppercase tracking-wider text-charcoal">
              2. Core Manufacturing Values & Pillars
            </h2>
            <button
              type="button"
              onClick={handleAddValue}
              className="inline-flex items-center gap-1 text-xs text-terracotta hover:underline font-semibold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Value Card</span>
            </button>
          </div>

          <div className="space-y-3">
            {formData.values.map((v, idx) => (
              <div key={idx} className="p-4 bg-warm-bg border border-border-subtle space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-bold text-xs uppercase text-charcoal">
                    Pillar #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveValue(idx)}
                    className="text-secondary-text hover:text-terracotta p-1 cursor-pointer"
                    title="Remove Pillar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="block font-semibold text-charcoal mb-1">Pillar Title</label>
                  <input
                    type="text"
                    value={v.title}
                    onChange={(e) => handleUpdateValue(idx, "title", e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-border-subtle text-xs text-charcoal focus:outline-none focus:border-terracotta"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-charcoal mb-1">Pillar Description</label>
                  <textarea
                    rows={2}
                    value={v.description}
                    onChange={(e) => handleUpdateValue(idx, "description", e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-border-subtle text-xs text-charcoal leading-relaxed focus:outline-none focus:border-terracotta"
                  />
                </div>
              </div>
            ))}
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
