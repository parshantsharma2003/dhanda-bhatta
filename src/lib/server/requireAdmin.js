import "server-only";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "./authorization";
import { logSecurityEvent } from "@/lib/security/auditLogger";

/**
 * Server-side authorization guard.
 * Must be executed on every administrative Page, Server Action, and API Route.
 *
 * @param {Object} options Options for authorization enforcement
 * @param {boolean} options.isApi If true, throws error instead of redirecting
 * @param {boolean} options.allowUnenrolled2fa If true, permits access to /admin/security/setup-2fa
 * @param {Headers|Object} options.headers Explicit headers if available
 * @returns {Promise<{user: Object, session: Object}>}
 */
export async function requireAdmin(options = {}) {
  const {
    isApi = false,
    allowUnenrolled2fa = false,
    headers = null,
  } = options;

  const adminAuth = await getCurrentAdmin(headers);

  if (!adminAuth) {
    await logSecurityEvent({
      eventType: "UNAUTHORIZED_ADMIN_ACCESS",
      outcome: "BLOCKED",
      headers,
      details: { reason: "NO_ACTIVE_ADMIN_SESSION" },
    });

    if (isApi) {
      const error = new Error("Unauthorized administrative access. Valid admin session required.");
      error.status = 401;
      error.code = "UNAUTHORIZED";
      throw error;
    }

    redirect("/admin/login");
  }

  const { user, session } = adminAuth;

  // MANDATORY 2FA ENFORCEMENT:
  // If the admin has not enrolled 2FA yet and the target is not the 2FA setup page,
  // enforce redirection to the 2FA enrollment setup page!
  if (!user.twoFactorEnabled && !allowUnenrolled2fa) {
    if (isApi) {
      const error = new Error("Mandatory two-factor authentication enrollment is required.");
      error.status = 403;
      error.code = "2FA_ENROLLMENT_REQUIRED";
      throw error;
    }

    redirect("/admin/security/setup-2fa");
  }

  return { user, session };
}

/**
 * Ensures the administrator has the super admin role.
 */
export async function requireSuperAdmin(options = {}) {
  return requireAdmin(options);
}
