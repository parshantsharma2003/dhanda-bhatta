import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Accessible FormField container with label, required marker, optional marker,
 * help text, and error alert.
 */
export default function FormField({
  id,
  label,
  required = false,
  optional = false,
  error,
  helpText,
  children,
  className = "",
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="text-xs font-heading uppercase tracking-wider font-semibold text-charcoal select-none"
        >
          {label} {required && <span className="text-terracotta" aria-hidden="true">*</span>}
        </label>

        {optional && (
          <span className="text-[11px] text-secondary-text">
            (Optional)
          </span>
        )}
      </div>

      {children}

      {helpText && !error && (
        <p id={`${id}-help`} className="text-[11px] text-secondary-text">
          {helpText}
        </p>
      )}

      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-xs text-red-700 font-medium flex items-center gap-1.5 pt-0.5 animate-fadeIn"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-600" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
