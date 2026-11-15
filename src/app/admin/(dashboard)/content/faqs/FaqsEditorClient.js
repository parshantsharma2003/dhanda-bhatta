"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Save,
  Send,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Loader2,
  HelpCircle,
  X,
} from "lucide-react";
import ConfirmationModal from "@/components/admin/ConfirmationModal";

const FAQ_CATEGORIES = [
  "Pricing & Bulk Orders",
  "Product Quality & Specifications",
  "Site Delivery & Logistics",
  "Kiln Firing & Manufacturing",
  "General Inquiries",
];

export default function FaqsEditorClient({ initialContent }) {
  const currentData = initialContent?.draftData || initialContent?.publishedData || {};
  const [faqs, setFaqs] = useState(
    currentData.faqs || [
      {
        question: "What is the minimum bulk order quantity for red clay bricks?",
        answer:
          "Our standard minimum batch delivery is typically 3,000 bricks per tractor trolley load within our primary delivery radius in Haryana. Direct kiln yard pick-ups can be arranged for smaller custom counts.",
        category: "Pricing & Bulk Orders",
        isActive: true,
      },
      {
        question: "How do you test and ensure compressive strength?",
        answer:
          "Every production cycle undergoes randomized batch sampling for compressive crushing load and water absorption tests adhering to Indian Standard IS 1077 guidelines.",
        category: "Product Quality & Specifications",
        isActive: true,
      },
      {
        question: "Which areas do you provide direct delivery to?",
        answer:
          "We operate our own fleet of tractor trolleys and multi-axle trucks delivering directly across Village Kalwa, Pillukhera, Jind, Safidon, Panipat, and surrounding construction hubs in Haryana.",
        category: "Site Delivery & Logistics",
        isActive: true,
      },
    ]
  );

  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [status, setStatus] = useState(initialContent?.status || "published");

  // Modal State for adding/editing FAQ
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIdx, setEditingIdx] = useState(null);
  const [currentFaq, setCurrentFaq] = useState({
    question: "",
    answer: "",
    category: "Pricing & Bulk Orders",
    isActive: true,
  });

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [faqToDeleteIdx, setFaqToDeleteIdx] = useState(null);

  const handleOpenNewModal = () => {
    setEditingIdx(null);
    setCurrentFaq({
      question: "",
      answer: "",
      category: "Pricing & Bulk Orders",
      isActive: true,
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (idx) => {
    setEditingIdx(idx);
    setCurrentFaq({ ...faqs[idx] });
    setModalOpen(true);
  };

  const handleSaveModalFaq = (e) => {
    e.preventDefault();
    if (!currentFaq.question.trim() || !currentFaq.answer.trim()) return;

    if (editingIdx !== null) {
      const updated = [...faqs];
      updated[editingIdx] = currentFaq;
      setFaqs(updated);
    } else {
      setFaqs([...faqs, currentFaq]);
    }

    setModalOpen(false);
    setMessage({ text: "FAQ list updated. Remember to Publish or Save Draft to persist.", type: "success" });
  };

  const confirmDeleteFaq = () => {
    if (faqToDeleteIdx !== null) {
      setFaqs(faqs.filter((_, i) => i !== faqToDeleteIdx));
      setDeleteModalOpen(false);
      setFaqToDeleteIdx(null);
      setMessage({ text: "FAQ removed from staging list.", type: "success" });
    }
  };

  const handleSave = async (publish = false) => {
    if (publish) setIsPublishing(true);
    else setIsSaving(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await fetch("/api/admin/content/faqs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: { faqs },
          publish,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to save FAQs");
      }

      setStatus(publish ? "published" : "draft");
      setMessage({
        text: publish
          ? "FAQs published live to the public website!"
          : "Draft saved. Changes will not be visible on the public site until published.",
        type: "success",
      });
    } catch (err) {
      console.error("[FaqsEditor] Save error:", err);
      setMessage({ text: err.message || "Error saving FAQs", type: "error" });
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
            Frequently Asked Questions (FAQs)
          </h1>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={handleOpenNewModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-charcoal hover:bg-black text-white text-xs font-heading font-bold uppercase tracking-wider transition-colors shadow-2xs cursor-pointer"
          >
            <Plus className="w-4 h-4 text-sandstone" />
            <span>Add FAQ</span>
          </button>

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

      {/* FAQs List */}
      <div className="space-y-3">
        {faqs.length > 0 ? (
          faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white border border-border-subtle p-5 shadow-2xs space-y-2 hover:border-sandstone transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-warm-bg border border-border-subtle text-[10px] font-mono uppercase text-secondary-text">
                      {faq.category}
                    </span>
                    {!faq.isActive && (
                      <span className="px-2 py-0.5 bg-[#FFEBEE] text-terracotta text-[10px] font-mono uppercase font-bold">
                        Hidden
                      </span>
                    )}
                  </div>
                  <h3 className="font-heading font-black text-sm text-charcoal">
                    {faq.question}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(idx)}
                    className="p-1.5 border border-border-subtle bg-warm-bg hover:bg-white text-charcoal transition-colors cursor-pointer"
                    title="Edit FAQ"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFaqToDeleteIdx(idx);
                      setDeleteModalOpen(true);
                    }}
                    className="p-1.5 border border-border-subtle bg-warm-bg hover:bg-white text-secondary-text hover:text-terracotta transition-colors cursor-pointer"
                    title="Delete FAQ"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-secondary-text leading-relaxed whitespace-pre-wrap">
                {faq.answer}
              </p>
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-xs text-secondary-text bg-white border border-border-subtle">
            No FAQ entries present. Click &quot;Add FAQ&quot; above to create customer questions.
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-border-subtle shadow-xl w-full max-w-lg p-6 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <h3 className="font-heading font-black text-base text-charcoal">
                {editingIdx !== null ? "Edit FAQ Item" : "Create New FAQ"}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-secondary-text hover:text-charcoal p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModalFaq} className="space-y-4 text-xs">
              <div>
                <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                  Category
                </label>
                <select
                  value={currentFaq.category}
                  onChange={(e) => setCurrentFaq({ ...currentFaq, category: e.target.value })}
                  className="w-full px-3 py-2 bg-warm-bg border border-border-subtle text-xs text-charcoal focus:outline-none"
                >
                  {FAQ_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                  Customer Question *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Can I inspect bricks in person at Village Kalwa?"
                  value={currentFaq.question}
                  onChange={(e) => setCurrentFaq({ ...currentFaq, question: e.target.value })}
                  className="w-full px-3 py-2 bg-warm-bg border border-border-subtle text-xs text-charcoal focus:bg-white focus:outline-none focus:border-terracotta"
                />
              </div>

              <div>
                <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                  Verified Answer *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Clear, professional explanation..."
                  value={currentFaq.answer}
                  onChange={(e) => setCurrentFaq({ ...currentFaq, answer: e.target.value })}
                  className="w-full px-3 py-2 bg-warm-bg border border-border-subtle text-xs text-charcoal leading-relaxed focus:bg-white focus:outline-none focus:border-terracotta"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentFaq.isActive}
                    onChange={(e) => setCurrentFaq({ ...currentFaq, isActive: e.target.checked })}
                    className="w-4 h-4 text-terracotta"
                  />
                  <span className="font-semibold text-charcoal">Active (Display publicly)</span>
                </label>
              </div>

              <div className="pt-3 border-t border-border-subtle flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-border-subtle bg-warm-bg hover:bg-white text-charcoal text-xs font-heading font-bold uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-terracotta hover:bg-[#833329] text-white text-xs font-heading font-bold uppercase tracking-wider cursor-pointer"
                >
                  Save to List
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        title="Delete FAQ Item?"
        message="Are you sure you want to remove this FAQ item? You must click Publish Live to remove it from the public website."
        confirmLabel="Remove FAQ"
        isDestructive={true}
        onConfirm={confirmDeleteFaq}
        onClose={() => setDeleteModalOpen(false)}
      />
    </div>
  );
}
