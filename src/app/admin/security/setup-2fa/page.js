"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import QRCode from "qrcode";
import {
  ShieldAlert,
  ShieldCheck,
  QrCode,
  Copy,
  Check,
  KeyRound,
  ArrowRight,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { twoFactor } from "@/lib/auth-client";

export default function SetupTwoFactorPage() {
  const router = useRouter();

  // Wizard steps: "PASSWORD_CONFIRM" -> "SCAN_AND_VERIFY" -> "BACKUP_CODES_DISPLAY"
  const [step, setStep] = useState("PASSWORD_CONFIRM");
  const [password, setPassword] = useState("");
  const [totpUri, setTotpUri] = useState("");
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const [manualKey, setManualKey] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [backupCodes, setBackupCodes] = useState([]);
  const [hasConfirmedSaved, setHasConfirmedSaved] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedCodes, setCopiedCodes] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Step 1: Start 2FA enrollment with master password
  const handleInitiateEnrollment = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const res = await twoFactor.enable({
        password,
      });

      if (res.error) {
        setErrorMessage(res.error.message || "Failed to initialize 2FA. Verify your password.");
        setIsLoading(false);
        return;
      }

      const uri = res.data?.totpURI;
      if (!uri) {
        throw new Error("Did not receive TOTP configuration URI from authentication server.");
      }

      setTotpUri(uri);

      // Extract secret parameter for manual key entry
      try {
        const parsedUrl = new URL(uri);
        const secretParam = parsedUrl.searchParams.get("secret");
        setManualKey(secretParam || "");
      } catch {
        setManualKey("");
      }

      // Generate visual QR code
      const qrData = await QRCode.toDataURL(uri, {
        margin: 2,
        width: 256,
        color: {
          dark: "#252321",
          light: "#FFFFFF",
        },
      });
      setQrCodeDataUrl(qrData);

      // Save returned backup codes for display after code verification
      if (res.data?.backupCodes) {
        setBackupCodes(res.data.backupCodes);
      }

      setStep("SCAN_AND_VERIFY");
      setIsLoading(false);
    } catch (err) {
      console.error("[Setup2FA] Enrollment error:", err);
      setErrorMessage(err.message || "Could not initialize two-factor enrollment.");
      setIsLoading(false);
    }
  };

  // Step 2: Verify the 6-digit code
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const cleanCode = verificationCode.replace(/\s+/g, "").trim();
    if (cleanCode.length !== 6) {
      setErrorMessage("Please enter the complete 6-digit code from your authenticator app.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await twoFactor.verifyTotp({
        code: cleanCode,
      });

      if (res.error) {
        setErrorMessage(
          res.error.message || "Invalid authenticator code. Check that your clock is synchronized."
        );
        setIsLoading(false);
        return;
      }

      // Success! Proceed to backup codes display
      setStep("BACKUP_CODES_DISPLAY");
      setIsLoading(false);
    } catch (err) {
      console.error("[Setup2FA] Verification error:", err);
      setErrorMessage("Verification failed. Please try again.");
      setIsLoading(false);
    }
  };

  const handleCopyKey = () => {
    if (manualKey) {
      navigator.clipboard.writeText(manualKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  const handleCopyBackupCodes = () => {
    if (backupCodes.length > 0) {
      navigator.clipboard.writeText(backupCodes.join("\n"));
      setCopiedCodes(true);
      setTimeout(() => setCopiedCodes(false), 2000);
    }
  };

  const handleFinish = () => {
    router.push("/admin/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-warm-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-border-subtle text-xs font-mono font-semibold tracking-wider text-charcoal uppercase">
            <ShieldAlert className="w-3.5 h-3.5 text-terracotta" />
            <span>Mandatory Security Configuration</span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl tracking-tight text-charcoal">
            Enroll Two-Factor Authentication
          </h1>
          <p className="text-xs text-secondary-text">
            All Dhanda Bhatta Company administrators must configure TOTP before accessing the management dashboard.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 border border-border-subtle shadow-sm">
          {errorMessage && (
            <div
              className="mb-6 p-4 bg-[#FFEBEE] border-l-4 border-terracotta flex items-start gap-3 text-xs text-charcoal"
              role="alert"
            >
              <AlertTriangle className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block">Configuration Error</strong>
                <p className="text-secondary-text">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* STEP 1: PASSWORD CONFIRMATION */}
          {step === "PASSWORD_CONFIRM" && (
            <form onSubmit={handleInitiateEnrollment} className="space-y-5">
              <div className="p-4 bg-warm-bg border-l-4 border-sandstone text-xs text-secondary-text space-y-1">
                <strong className="text-charcoal font-semibold block">Security Step 1 of 3:</strong>
                <p>
                  To prevent unauthorized changes, please re-enter your administrator password to generate
                  your authenticator key.
                </p>
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-xs font-heading font-bold uppercase tracking-wider text-charcoal mb-1.5"
                >
                  Master Password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  required
                  autoFocus
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your current password"
                  className="w-full px-3 py-2.5 bg-warm-bg border border-border-subtle text-charcoal text-sm focus:bg-white focus:outline-none focus:border-terracotta"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !password}
                className="w-full py-3 px-4 bg-terracotta hover:bg-[#833329] text-white font-heading font-bold text-sm tracking-wide uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating Security Key...</span>
                  </>
                ) : (
                  <>
                    <span>Generate Authenticator Key</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: SCAN QR CODE & ENTER FIRST CODE */}
          {step === "SCAN_AND_VERIFY" && (
            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div className="text-center space-y-4">
                <p className="text-xs text-secondary-text">
                  Scan this QR code with <strong>Google Authenticator</strong> or <strong>Microsoft Authenticator</strong>:
                </p>

                {qrCodeDataUrl && (
                  <div className="flex justify-center">
                    <div className="p-3 bg-white border-2 border-border-subtle inline-block shadow-2xs">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={qrCodeDataUrl}
                        alt="TOTP Enrollment QR Code"
                        width={200}
                        height={200}
                        className="w-48 h-48 block"
                      />
                    </div>
                  </div>
                )}

                {/* Manual Setup Key Alternative */}
                {manualKey && (
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[11px] text-secondary-text uppercase font-semibold tracking-wider block">
                      Manual Secret Key (If cannot scan):
                    </span>
                    <div className="flex items-center justify-center gap-2 max-w-sm mx-auto">
                      <code className="px-2 py-1 bg-warm-bg border border-border-subtle font-mono text-xs text-charcoal select-all">
                        {manualKey}
                      </code>
                      <button
                        type="button"
                        onClick={handleCopyKey}
                        className="px-2 py-1 text-xs border border-border-subtle bg-white hover:bg-warm-bg text-secondary-text cursor-pointer flex items-center gap-1"
                        title="Copy Key"
                      >
                        {copiedKey ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedKey ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Code Verification Field */}
              <div className="pt-4 border-t border-border-subtle">
                <label
                  htmlFor="verify-code"
                  className="block text-xs font-heading font-bold uppercase tracking-wider text-charcoal mb-2 text-center"
                >
                  Enter the 6-Digit Code Shown in Your App:
                </label>
                <div className="flex justify-center">
                  <input
                    id="verify-code"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    autoFocus
                    required
                    disabled={isLoading}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="000000"
                    className="w-44 text-center tracking-[0.4em] font-mono text-2xl font-bold py-2.5 bg-warm-bg border-2 border-border-subtle text-charcoal focus:bg-white focus:outline-none focus:border-terracotta"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || verificationCode.trim().length !== 6}
                className="w-full py-3 px-4 bg-terracotta hover:bg-[#833329] text-white font-heading font-bold text-sm tracking-wide uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <span>Verify Code & Enable 2FA</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 3: BACKUP RECOVERY CODES DISPLAY */}
          {step === "BACKUP_CODES_DISPLAY" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 p-4 bg-[#E8F5E9] border-l-4 border-[#2E7D32]">
                <ShieldCheck className="w-6 h-6 text-[#2E7D32] shrink-0" />
                <div>
                  <h3 className="font-heading font-bold text-sm text-[#2E7D32]">
                    Two-Factor Authentication Active!
                  </h3>
                  <p className="text-xs text-secondary-text">
                    Your account is now protected with TOTP second-factor security.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-heading font-bold uppercase tracking-wider text-charcoal">
                    Emergency Backup Recovery Codes:
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyBackupCodes}
                    className="inline-flex items-center gap-1 text-xs text-terracotta hover:underline cursor-pointer font-semibold"
                  >
                    {copiedCodes ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCodes ? "Codes Copied" : "Copy All Codes"}</span>
                  </button>
                </div>

                <div className="p-4 bg-warm-bg border border-border-subtle font-mono text-xs text-charcoal grid grid-cols-2 gap-2 select-all">
                  {backupCodes.map((code, idx) => (
                    <div key={idx} className="p-1 bg-white border border-border-subtle text-center">
                      {code}
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-[#FFF9C4] border-l-4 border-[#FBC02D] text-xs text-charcoal space-y-1">
                  <strong className="block font-semibold">Important Privacy & Access Warning:</strong>
                  <p>
                    These recovery codes are single-use emergency backup tokens. Store them securely in an
                    offline password manager. They will <strong>not</strong> be displayed again.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-2.5 text-xs text-charcoal cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={hasConfirmedSaved}
                    onChange={(e) => setHasConfirmedSaved(e.target.checked)}
                    className="w-4 h-4 mt-0.5 text-terracotta border-border-subtle rounded-none cursor-pointer"
                  />
                  <span>
                    I confirm that I have copied and securely stored my emergency backup recovery codes in an
                    offline location.
                  </span>
                </label>
              </div>

              <button
                type="button"
                onClick={handleFinish}
                disabled={!hasConfirmedSaved}
                className="w-full py-3 px-4 bg-charcoal hover:bg-black text-white font-heading font-bold text-sm tracking-wide uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>Proceed to Admin Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
