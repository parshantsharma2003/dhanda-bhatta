import "server-only";
import crypto from "crypto";
import connectToDatabase from "@/lib/db";
import SecurityAuditLog from "@/models/SecurityAuditLog";

/**
 * Derives a privacy-preserving SHA-256 hash from incoming request or headers.
 */
function deriveIpHash(headers) {
  if (!headers) return "unknown-ip";

  const getHeader = (name) => {
    if (typeof headers.get === "function") return headers.get(name);
    return headers[name] || headers[name.toLowerCase()] || null;
  };

  const rawIp =
    getHeader("cf-connecting-ip") ||
    getHeader("x-forwarded-for")?.split(",")[0]?.trim() ||
    getHeader("x-real-ip") ||
    "127.0.0.1";

  const userAgent = getHeader("user-agent") || "unknown-ua";
  const salt = process.env.RATE_LIMIT_SALT || "dbc-audit-salt-2025";

  return crypto
    .createHash("sha256")
    .update(`${rawIp}:${userAgent}:${salt}`)
    .digest("hex")
    .substring(0, 32);
}

/**
 * Strips any sensitive properties from detail objects.
 * Prevents accidental logging of passwords, tokens, OTPs, or recovery codes.
 */
function sanitizeDetails(details = {}) {
  if (!details || typeof details !== "object") return {};

  const sanitized = { ...details };
  const sensitiveKeys = [
    "password",
    "pass",
    "token",
    "otp",
    "code",
    "secret",
    "backupCodes",
    "recoveryCode",
    "key",
    "authorization",
  ];

  for (const key of Object.keys(sanitized)) {
    if (sensitiveKeys.some((s) => key.toLowerCase().includes(s.toLowerCase()))) {
      sanitized[key] = "[REDACTED]";
    }
  }

  return sanitized;
}

/**
 * Logs an administrative security event to the audit trail.
 */
export async function logSecurityEvent(params) {
  const {
    eventType,
    adminId = null,
    adminEmail = null,
    outcome,
    headers = null,
    details = {},
  } = params;

  const ipHash = deriveIpHash(headers);
  const userAgent = headers
    ? (typeof headers.get === "function" ? headers.get("user-agent") : headers["user-agent"]) || "unknown"
    : "unknown";

  const sanitizedMeta = sanitizeDetails(details);

  if (process.env.NODE_ENV === "development") {
    console.log(
      `[SECURITY AUDIT] ${eventType} | Outcome: ${outcome} | Admin: ${adminEmail || adminId || "Anonymous"} | IP: ${ipHash.slice(0, 8)}...`
    );
  }

  if (process.env.MONGODB_URI) {
    try {
      await connectToDatabase();
      await SecurityAuditLog.create({
        eventType,
        adminId,
        adminEmail: adminEmail ? adminEmail.toLowerCase().trim() : null,
        outcome,
        ipHash,
        userAgent: userAgent.slice(0, 250),
        details: sanitizedMeta,
      });
    } catch (err) {
      console.warn("[auditLogger] Failed to write security event to database:", err.message);
    }
  }
}
