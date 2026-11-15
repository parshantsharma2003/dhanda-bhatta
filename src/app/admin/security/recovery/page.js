"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { KeyRound, ArrowLeft, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { twoFactor } from "@/lib/auth-client";

export default function SecurityRecoveryPage() {
  const router = useRouter();
  const [backupCode, setBackupCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const cleanCode = backupCode.trim();
    if (!cleanCode) {
      setErrorMessage("Please enter an emergency backup recovery code.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await twoFactor.verifyBackupCode({
        code: cleanCode,
      });

      if (res.error) {
        setErrorMessage(
          res.error.message || "Invalid or previously consumed backup code. Each recovery code can only be used once."
        );
        setIsLoading(false);
        return;
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch (err) {
      console.error("[SecurityRecovery] Error:", err);
      setErrorMessage("Verification failed. Please verify the code and try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-border-subtle text-xs font-mono font-semibold tracking-wider text-charcoal uppercase">
            <KeyRound className="w-3.5 h-3.5 text-terracotta" />
            <span>Emergency Access Recovery</span>
          </div>
          <h1 className="font-heading font-black text-2xl tracking-tight text-charcoal">
            Use Backup Recovery Code
          </h1>
          <p className="text-xs text-secondary-text">
            Enter one of your 10 single-use emergency backup tokens saved during 2FA enrollment.
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
                <strong className="font-semibold block">Recovery Failed</strong>
                <p className="text-secondary-text">{errorMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-6" noValidate>
            <div>
              <label
                htmlFor="backup-code"
                className="block text-xs font-heading font-bold uppercase tracking-wider text-charcoal mb-2 text-center"
              >
                Emergency Backup Code
              </label>
              <input
                id="backup-code"
                type="text"
                autoComplete="off"
                autoFocus
                required
                disabled={isLoading}
                value={backupCode}
                onChange={(e) => setBackupCode(e.target.value)}
                placeholder="e.g. A1B2-C3D4 or 12345678"
                className="w-full text-center font-mono text-base font-semibold py-2.5 bg-warm-bg border-2 border-border-subtle text-charcoal focus:bg-white focus:outline-none focus:border-terracotta"
              />
              <p className="text-[11px] text-secondary-text text-center mt-2">
                Note: Each backup recovery code is consumed immediately upon successful verification.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || !backupCode.trim()}
              className="w-full py-3 px-4 bg-terracotta hover:bg-[#833329] text-white font-heading font-bold text-sm tracking-wide uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Backup Code...</span>
                </>
              ) : (
                <>
                  <span>Verify Code & Enter</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border-subtle text-center">
            <Link
              href="/admin/verify-2fa"
              className="inline-flex items-center gap-1.5 text-xs text-secondary-text hover:text-charcoal font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Authenticator App code entry</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
