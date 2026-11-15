import "server-only";
import { headers as nextHeaders } from "next/headers";
import { auth } from "@/lib/auth";

/**
 * Retrieves the currently authenticated administrator.
 * Verifies the actual server-managed session and the 'admin' role.
 *
 * @param {Headers|Object} customHeaders Optional headers object
 * @returns {Promise<{user: Object, session: Object}|null>}
 */
export async function getCurrentAdmin(customHeaders = null) {
  try {
    const resolvedHeaders = customHeaders || (await nextHeaders());
    const sessionData = await auth.api.getSession({
      headers: resolvedHeaders,
    });

    if (!sessionData || !sessionData.user || !sessionData.session) {
      return null;
    }

    const { user, session } = sessionData;

    // Strict role check: Must possess the administrator role
    if (user.role !== "admin") {
      return null;
    }

    return { user, session };
  } catch (error) {
    console.warn("[authorization] Failed to resolve admin session:", error.message);
    return null;
  }
}

/**
 * Enforces recent authentication for highly sensitive security operations (e.g. 2FA reset).
 *
 * @param {Object} session Active Better Auth session
 * @param {number} maxAgeSeconds Maximum permitted session age in seconds (default: 30 minutes)
 * @returns {boolean}
 */
export function isRecentAuthentication(session, maxAgeSeconds = 1800) {
  if (!session || !session.createdAt) return false;
  const sessionCreatedAt = new Date(session.createdAt).getTime();
  const now = Date.now();
  return (now - sessionCreatedAt) <= maxAgeSeconds * 1000;
}
