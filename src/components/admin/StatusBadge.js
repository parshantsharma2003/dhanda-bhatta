export default function StatusBadge({ status, type = "enquiry" }) {
  const normStatus = (status || "").toLowerCase().trim();

  // Color mapping configuration
  const CONFIG = {
    // New / Pending states (Yellow/Amber)
    new: { bg: "bg-[#FFF8E1]", text: "text-[#B78103]", border: "border-[#FFE082]", label: "New" },
    pending: { bg: "bg-[#FFF8E1]", text: "text-[#B78103]", border: "border-[#FFE082]", label: "Pending" },

    // In communication / Contacted / In progress (Blue)
    contacted: { bg: "bg-[#E3F2FD]", text: "text-[#1565C0]", border: "border-[#90CAF9]", label: "Contacted" },
    in_progress: { bg: "bg-[#E1F5FE]", text: "text-[#0277BD]", border: "border-[#81D4FA]", label: "In Progress" },

    // Quoted (Purple/Indigo)
    quoted: { bg: "bg-[#EDE7F6]", text: "text-[#5E35B1]", border: "border-[#D1C4E9]", label: "Quoted" },

    // Confirmed / Resolved / Active / Published (Green)
    confirmed: { bg: "bg-[#E8F5E9]", text: "text-[#2E7D32]", border: "border-[#A5D6A7]", label: "Confirmed" },
    resolved: { bg: "bg-[#E8F5E9]", text: "text-[#2E7D32]", border: "border-[#A5D6A7]", label: "Resolved" },
    active: { bg: "bg-[#E8F5E9]", text: "text-[#2E7D32]", border: "border-[#A5D6A7]", label: "Active" },
    published: { bg: "bg-[#E8F5E9]", text: "text-[#2E7D32]", border: "border-[#A5D6A7]", label: "Published" },

    // Dispatched / In Transit (Teal/Cyan)
    dispatched: { bg: "bg-[#E0F2F1]", text: "text-[#00695C]", border: "border-[#80CBC4]", label: "Dispatched" },

    // Delivered / Closed (Dark Slate / Charcoal accent)
    delivered: { bg: "bg-[#EFEBE9]", text: "text-[#4E342E]", border: "border-[#BCAAA4]", label: "Delivered" },
    closed: { bg: "bg-[#ECEFF1]", text: "text-[#37474F]", border: "border-[#B0BEC5]", label: "Closed" },

    // Cancelled / Spam / Rejected (Red/Terracotta)
    cancelled: { bg: "bg-[#FFEBEE]", text: "text-[#C62828]", border: "border-[#EF9A9A]", label: "Cancelled" },
    spam: { bg: "bg-[#FFEBEE]", text: "text-[#C62828]", border: "border-[#EF9A9A]", label: "Spam" },

    // Draft (Sandstone/Warm Grey)
    draft: { bg: "bg-warm-bg", text: "text-secondary-text", border: "border-border-subtle", label: "Draft" },

    // Archived (Neutral Grey)
    archived: { bg: "bg-[#ECEFF1]", text: "text-[#78909C]", border: "border-[#CFD8DC]", label: "Archived" },
  };

  const current = CONFIG[normStatus] || {
    bg: "bg-warm-bg",
    text: "text-secondary-text",
    border: "border-border-subtle",
    label: status || "Unknown",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider border ${current.bg} ${current.text} ${current.border}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70" />
      {current.label}
    </span>
  );
}
