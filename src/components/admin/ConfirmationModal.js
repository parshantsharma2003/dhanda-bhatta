"use client";

import { useEffect, useRef } from "react";
import { AlertTriangle, X, Loader2 } from "lucide-react";

export default function ConfirmationModal({
  isOpen,
  title = "Are you sure?",
  message = "This action will update the system records.",
  confirmLabel = "Confirm Action",
  cancelLabel = "Cancel",
  isDestructive = false,
  isLoading = false,
  onConfirm,
  onClose,
}) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && !isLoading) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/70 backdrop-blur-xs animate-fadeIn"
    >
      <div
        ref={modalRef}
        className="bg-white border border-border-subtle shadow-xl w-full max-w-md p-6 space-y-5 animate-scaleUp"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 flex items-center justify-center shrink-0 ${
                isDestructive ? "bg-[#FFEBEE] text-terracotta" : "bg-[#FFF8E1] text-[#B78103]"
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 id="confirmation-modal-title" className="font-heading font-black text-lg text-charcoal">
                {title}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="text-secondary-text hover:text-charcoal p-1 cursor-pointer disabled:opacity-50"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-secondary-text leading-relaxed">
          {message}
        </p>

        <div className="pt-2 flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto px-4 py-2.5 border border-border-subtle bg-warm-bg hover:bg-white text-charcoal text-xs font-heading font-bold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`w-full sm:w-auto px-4 py-2.5 text-white text-xs font-heading font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${
              isDestructive
                ? "bg-terracotta hover:bg-[#833329]"
                : "bg-charcoal hover:bg-black"
            }`}
          >
            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
