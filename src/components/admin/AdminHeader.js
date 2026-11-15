"use client";

import Link from "next/link";
import { ShieldCheck, ExternalLink, User } from "lucide-react";
import SignOutButton from "./SignOutButton";

export default function AdminHeader({ user = {} }) {
  const roleLabel = (user.role || "ADMIN").toUpperCase().replace("_", " ");

  return (
    <header className="bg-white border-b border-border-subtle px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-2xs">
      {/* Left: User Identity Details */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 bg-terracotta text-white font-heading font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
          {user.name ? user.name[0].toUpperCase() : <User className="w-4 h-4" />}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-heading font-bold text-sm text-charcoal truncate">
              {user.name || "Administrator"}
            </span>
            <span className="inline-flex items-center px-1.5 py-0.5 text-[9px] font-mono uppercase font-bold tracking-wider bg-[#E8F5E9] text-[#2E7D32] border border-[#2E7D32]/20">
              {roleLabel}
            </span>
          </div>
          <p className="text-[11px] text-secondary-text truncate hidden sm:block">
            {user.email || "admin@dhandabhatta.com"}
          </p>
        </div>
      </div>

      {/* Right: Security Status & Actions */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 bg-warm-bg border border-border-subtle text-xs text-[#2E7D32] font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32]" />
          <span>TOTP 2FA Active</span>
        </div>

        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center gap-1 text-xs text-secondary-text hover:text-charcoal px-2.5 py-1 border border-border-subtle bg-warm-bg hover:bg-white transition-colors"
          title="Open Public Website in new tab"
        >
          <span>Live Site</span>
          <ExternalLink className="w-3 h-3 text-secondary-text" />
        </Link>

        <SignOutButton />
      </div>
    </header>
  );
}
