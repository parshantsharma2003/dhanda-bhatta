"use client";

import { useState } from "react";
import {
  History,
  ShieldCheck,
  ShieldAlert,
  Filter,
  RefreshCw,
  Search,
  Eye,
  X,
  Clock,
  Terminal,
} from "lucide-react";

export default function ActivityLogsClient({ initialLogs = [], initialPagination = {} }) {
  const [logs, setLogs] = useState(initialLogs);
  const [pagination, setPagination] = useState(initialPagination);
  const [eventType, setEventType] = useState("all");
  const [outcome, setOutcome] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [inspectedLog, setInspectedLog] = useState(null);

  const fetchLogs = async (page = 1) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (eventType !== "all") params.set("eventType", eventType);
      if (outcome !== "all") params.set("outcome", outcome);
      params.set("page", page.toString());
      params.set("limit", "20");

      const res = await fetch(`/api/admin/activity?${params.toString()}`);
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message);

      setLogs(json.data);
      setPagination(json.pagination);
    } catch (err) {
      console.error("[ActivityLogs] Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilter = (e) => {
    e.preventDefault();
    fetchLogs(1);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border-subtle">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-sandstone uppercase block mb-1">
            Security & Compliance
          </span>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-charcoal tracking-tight">
            Administrative Audit Trail
          </h1>
        </div>

        <button
          type="button"
          onClick={() => fetchLogs(pagination.page || 1)}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3 py-2 border border-border-subtle bg-white hover:bg-warm-bg text-charcoal text-xs font-heading font-bold uppercase tracking-wider transition-colors shadow-2xs cursor-pointer disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-terracotta" : "text-sandstone"}`} />
          <span>Refresh Stream</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-border-subtle p-4 shadow-2xs space-y-3">
        <form onSubmit={handleFilter} className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-secondary-text">Outcome:</span>
            <select
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              className="py-1.5 px-2.5 bg-warm-bg border border-border-subtle text-xs text-charcoal focus:outline-none"
            >
              <option value="all">All Outcomes</option>
              <option value="SUCCESS">SUCCESS</option>
              <option value="BLOCKED">BLOCKED</option>
              <option value="FAILURE">FAILURE</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-secondary-text">Event Type:</span>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="py-1.5 px-2.5 bg-warm-bg border border-border-subtle text-xs text-charcoal focus:outline-none"
            >
              <option value="all">All Event Types</option>
              <option value="LOGIN">LOGIN</option>
              <option value="LOGIN_2FA_VERIFY">LOGIN_2FA_VERIFY</option>
              <option value="UPDATE_PRODUCT">UPDATE_PRODUCT</option>
              <option value="ARCHIVE_PRODUCT">ARCHIVE_PRODUCT</option>
              <option value="CREATE_PRODUCT">CREATE_PRODUCT</option>
              <option value="UPDATE_ORDER">UPDATE_ORDER</option>
              <option value="ARCHIVE_ORDER">ARCHIVE_ORDER</option>
              <option value="UPDATE_ENQUIRY">UPDATE_ENQUIRY</option>
              <option value="UPDATE_SETTINGS">UPDATE_SETTINGS</option>
              <option value="UNAUTHORIZED_ADMIN_ACCESS">UNAUTHORIZED_ADMIN_ACCESS</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-1.5 bg-charcoal hover:bg-black text-white text-xs font-heading font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Filter className="w-3 h-3 text-sandstone" />
            <span>Apply</span>
          </button>
        </form>
      </div>

      {/* Logs Table */}
      <div className="bg-white border border-border-subtle shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-warm-bg border-b border-border-subtle text-[10px] font-mono uppercase tracking-wider text-secondary-text">
              <tr>
                <th className="py-3 px-4 font-semibold">Timestamp</th>
                <th className="py-3 px-4 font-semibold">Event Type</th>
                <th className="py-3 px-4 font-semibold">Actor / Admin</th>
                <th className="py-3 px-4 font-semibold">Outcome</th>
                <th className="py-3 px-4 font-semibold">IP Address</th>
                <th className="py-3 px-4 font-semibold text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle font-mono text-[11px]">
              {logs.length > 0 ? (
                logs.map((log) => {
                  const dateStr = new Date(log.createdAt).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  });
                  const isSuccess = log.outcome === "SUCCESS";
                  const isBlocked = log.outcome === "BLOCKED";

                  return (
                    <tr key={log._id} className="hover:bg-warm-bg/40 transition-colors">
                      <td className="py-3 px-4 text-secondary-text whitespace-nowrap">
                        {dateStr}
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-bold text-charcoal">
                          {log.eventType}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-secondary-text font-sans">
                        {log.actorEmail || log.actorId || "Anonymous / System"}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider border ${
                            isSuccess
                              ? "bg-[#E8F5E9] text-[#2E7D32] border-[#A5D6A7]"
                              : isBlocked
                              ? "bg-[#FFF8E1] text-[#B78103] border-[#FFE082]"
                              : "bg-[#FFEBEE] text-terracotta border-terracotta/30"
                          }`}
                        >
                          {log.outcome}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-secondary-text">
                        {log.ipAddress || "127.0.0.1"}
                      </td>

                      <td className="py-3 px-4 text-right font-sans">
                        <button
                          type="button"
                          onClick={() => setInspectedLog(log)}
                          className="p-1.5 text-secondary-text hover:text-charcoal border border-border-subtle bg-warm-bg hover:bg-white transition-colors cursor-pointer"
                          title="Inspect raw log entry"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-secondary-text font-sans">
                    No security events logged matching the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-border-subtle bg-warm-bg flex items-center justify-between text-xs">
            <span className="text-secondary-text font-sans">
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} audit events)
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fetchLogs(pagination.page - 1)}
                disabled={pagination.page <= 1 || isLoading}
                className="px-3 py-1 bg-white border border-border-subtle text-charcoal disabled:opacity-40 cursor-pointer"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => fetchLogs(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages || isLoading}
                className="px-3 py-1 bg-white border border-border-subtle text-charcoal disabled:opacity-40 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Raw Log Inspection Modal */}
      {inspectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-border-subtle shadow-xl w-full max-w-xl p-6 space-y-4 animate-scaleUp max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-terracotta" />
                <h3 className="font-heading font-black text-sm text-charcoal uppercase tracking-wider">
                  Audit Entry: {inspectedLog.eventType}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectedLog(null)}
                className="text-secondary-text hover:text-charcoal p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 p-3 bg-warm-bg border border-border-subtle">
                <div>
                  <span className="text-secondary-text block">Timestamp:</span>
                  <span className="font-mono font-bold text-charcoal">
                    {new Date(inspectedLog.createdAt).toISOString()}
                  </span>
                </div>
                <div>
                  <span className="text-secondary-text block">Outcome:</span>
                  <span className="font-mono font-bold text-charcoal">{inspectedLog.outcome}</span>
                </div>
                <div>
                  <span className="text-secondary-text block">Actor:</span>
                  <span className="font-mono text-charcoal truncate block">
                    {inspectedLog.actorEmail || inspectedLog.actorId || "System"}
                  </span>
                </div>
                <div>
                  <span className="text-secondary-text block">Client IP:</span>
                  <span className="font-mono text-charcoal">{inspectedLog.ipAddress || "127.0.0.1"}</span>
                </div>
              </div>

              <div>
                <span className="font-heading font-bold text-xs uppercase tracking-wider text-charcoal block mb-1">
                  Event Metadata Payload:
                </span>
                <pre className="p-3 bg-charcoal text-white font-mono text-[11px] overflow-x-auto leading-relaxed max-h-60">
                  {JSON.stringify(inspectedLog.details || {}, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
