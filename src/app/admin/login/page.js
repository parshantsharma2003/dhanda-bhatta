"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, ShieldAlert, ArrowRight, Loader2 } from "lucide-react";
import { signIn } from "@/lib/auth-client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const res = await signIn.email({
        email: email.trim().toLowerCase(),
        password,
        rememberMe,
      });

      if (res.error) {
        // OWASP Requirement: Generic error message that does not disclose whether email exists
        setErrorMessage("Invalid email or password. Please verify your credentials.");
        setIsLoading(false);
        return;
      }

      // Check if second-factor authentication is required
      if (res.data?.twoFactorRedirect) {
        router.push("/admin/verify-2fa");
        return;
      }

      // Authenticated session established
      router.push("/admin/dashboard");
      router.refresh();
    } catch (err) {
      console.error("[AdminLogin] Error during sign in:", err);
      setErrorMessage("An unexpected authentication error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Wordmark & Security Badge */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-border-subtle text-xs font-mono font-semibold tracking-wider text-charcoal uppercase">
            <Lock className="w-3.5 h-3.5 text-terracotta" />
            <span>Authorized Personnel Only</span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl tracking-tight text-charcoal">
            DHANDA BHATTA COMPANY
          </h1>
          <p className="text-xs text-secondary-text font-medium uppercase tracking-widest">
            Kiln Operations & Admin Portal
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
              <ShieldAlert className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="font-semibold block">Authentication Failed</strong>
                <p className="text-secondary-text">{errorMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email Field */}
            <div>
              <label
                htmlFor="admin-email"
                className="block text-xs font-heading font-bold uppercase tracking-wider text-charcoal mb-1.5"
              >
                Administrator Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary-text">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  required
                  disabled={isLoading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@dhandabhatta.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-warm-bg border border-border-subtle text-charcoal text-sm placeholder:text-secondary-text/60 focus:bg-white focus:outline-none focus:ring-1 focus:ring-terracotta focus:border-terracotta transition-colors disabled:opacity-60"
                />
              </div>
            </div>

            {/* Password Field with Visibility Toggle */}
            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-heading font-bold uppercase tracking-wider text-charcoal mb-1.5"
              >
                Master Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary-text">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full pl-9 pr-10 py-2.5 bg-warm-bg border border-border-subtle text-charcoal text-sm placeholder:text-secondary-text/60 focus:bg-white focus:outline-none focus:ring-1 focus:ring-terracotta focus:border-terracotta transition-colors disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-secondary-text hover:text-charcoal cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Control (Disabled / unchecked by default for security) */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                  className="w-4 h-4 text-terracotta border-border-subtle rounded-none focus:ring-terracotta cursor-pointer"
                />
                <span className="text-secondary-text">Keep session active (8 hours)</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full mt-2 py-3 px-4 bg-terracotta hover:bg-[#833329] text-white font-heading font-bold text-sm tracking-wide uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security Policy Reminder */}
          <div className="mt-8 pt-6 border-t border-border-subtle text-[11px] text-secondary-text leading-relaxed">
            <p className="font-semibold text-charcoal mb-1">Administrative Security Notice:</p>
            <p>
              This portal is strictly reserved for authorized owners of Dhanda Bhatta Company. Public
              self-registration is disabled. All authentication activity, IP hashes, and session events
              are cryptographically recorded in the security audit logs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
