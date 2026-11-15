"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, KeyRound, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { twoFactor } from "@/lib/auth-client";

export default function VerifyTwoFactorPage() {
  const router = useRouter();
  const [totpCode, setTotpCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const cleanCode = totpCode.replace(/\s+/g, "").trim();
    if (cleanCode.length !== 6) {
      setErrorMessage("Please enter the complete 6-digit security code.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await twoFactor.verifyTotp({
        code: cleanCode,
      });

      if (res.error) {
        setErrorMessage(
          res.error.message || "Invalid or expired security code. Please check your authenticator app."
        );
        setIsLoading(false);
        return;
      }

      // 2FA Verified! Navigate to Dashboard
      router.push("/admin/dashboard");
      router.refresh();
    } catch (err) {
      console.error("[Verify2FA] Error:", err);
      setErrorMessage("Verification failed. Ensure your device time is synchronized and try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-border-subtle text-xs font-mono font-semibold tracking-wider text-charcoal uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-terracotta" />
            <span>Two-Factor Authentication</span>
          </div>
          <h1 className="font-heading font-black text-2xl tracking-tight text-charcoal">
            Enter Authenticator Code
          </h1>
          <p className="text-xs text-secondary-text">
            Open Google Authenticator or Microsoft Authenticator on your mobile device.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 border border-border-subtle shadow-sm">
          {errorMessage && (
            <div
              className="mb-6 p-4 bg-[#FFEBEE] border-l-4 border-terracotta flex items-start gap-3 text-xs text-charcoal"
              role="alert"
            >
              <AlertCircle className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block">Verification Failed</strong>
                <p className="text-secondary-text">{errorMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-6" noValidate>
            <div>
              <label
                htmlFor="totp-code"
                className="block text-xs font-heading font-bold uppercase tracking-wider text-charcoal mb-2 text-center"
              >
                6-Digit Security Code
              </label>
              <div className="flex justify-center">
                <input
                  id="totp-code"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="one-time-code"
                  maxLength={6}
                  autoFocus
                  required
                  disabled={isLoading}
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value)}
                  placeholder="000000"
                  className="w-48 text-center tracking-[0.4em] font-mono text-2xl font-bold py-3 bg-warm-bg border-2 border-border-subtle text-charcoal focus:bg-white focus:outline-none focus:border-terracotta transition-colors disabled:opacity-60"
                />
              </div>
              <p className="text-[11px] text-secondary-text text-center mt-2">
                Codes refresh every 30 seconds
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || totpCode.trim().length !== 6}
              className="w-full py-3 px-4 bg-terracotta hover:bg-[#833329] text-white font-heading font-bold text-sm tracking-wide uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <>
                  <span>Verify & Unlock Session</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Fallback to Emergency Backup Recovery Code */}
          <div className="mt-8 pt-6 border-t border-border-subtle text-center space-y-2">
            <span className="text-xs text-secondary-text block">
              Lost access to your authenticator application?
            </span>
            <Link
              href="/admin/security/recovery"
              className="inline-flex items-center gap-1.5 text-xs text-terracotta hover:underline font-semibold"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Authenticate using an emergency backup recovery code</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
