"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";
import { signOut } from "@/lib/auth-client";

export default function SignOutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("[SignOutButton] Error during logout:", err);
      router.push("/admin/login");
      router.refresh();
    }
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={isLoggingOut}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-warm-bg hover:bg-[#FFEBEE] hover:text-terracotta border border-border-subtle text-xs font-heading font-semibold text-charcoal transition-colors cursor-pointer disabled:opacity-50"
      title="Securely invalidate admin session"
    >
      {isLoggingOut ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <LogOut className="w-3.5 h-3.5" />
      )}
      <span>{isLoggingOut ? "Signing Out..." : "Sign Out"}</span>
    </button>
  );
}
