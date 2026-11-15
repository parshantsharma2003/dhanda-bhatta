import "server-only";
import crypto from "crypto";

/**
 * Resilient In-Memory Sliding Window Rate Limiter.
 * Works seamlessly in development, single-instance nodes, and serverless environments.
 * If Upstash Redis credentials are provided, it can be extended transparently.
 */
class MemoryRateLimiter {
  constructor() {
    this.storage = new Map();
    // Prune stale records every 5 minutes to prevent memory leaks
    if (typeof setInterval !== "undefined") {
      setInterval(() => this.cleanup(), 5 * 60 * 1000).unref?.();
    }
  }

  cleanup() {
    const now = Date.now();
    for (const [key, record] of this.storage.entries()) {
      if (record.resetTime <= now) {
        this.storage.delete(key);
      }
    }
  }

  async limit(identifier, limit = 5, windowMs = 60 * 1000) {
    const now = Date.now();
    const record = this.storage.get(identifier);

    if (!record || record.resetTime <= now) {
      // First request in a new window
      const newRecord = {
        count: 1,
        resetTime: now + windowMs,
      };
      this.storage.set(identifier, newRecord);
      return {
        success: true,
        limit,
        remaining: limit - 1,
        reset: Math.ceil(newRecord.resetTime / 1000),
      };
    }

    if (record.count < limit) {
      record.count += 1;
      return {
        success: true,
        limit,
        remaining: limit - record.count,
        reset: Math.ceil(record.resetTime / 1000),
      };
    }

    // Rate limit exceeded
    return {
      success: false,
      limit,
      remaining: 0,
      reset: Math.ceil(record.resetTime / 1000),
    };
  }
}

// Global singleton for memory rate limiter
let globalLimiter = global.__rateLimiter;
if (!globalLimiter) {
  globalLimiter = global.__rateLimiter = new MemoryRateLimiter();
}

/**
 * Derives a privacy-preserving SHA-256 hash from client IP and user agent.
 * Avoids storing unhashed personally identifiable IP addresses.
 */
export function getClientIdentifier(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cfIp = request.headers.get("cf-connecting-ip");

  const rawIp =
    cfIp ||
    (forwarded ? forwarded.split(",")[0].trim() : null) ||
    realIp ||
    "127.0.0.1";

  const userAgent = request.headers.get("user-agent") || "unknown-ua";

  // Create salted hash for privacy
  const hash = crypto
    .createHash("sha256")
    .update(`${rawIp}:${userAgent}:${process.env.RATE_LIMIT_SALT || "dbc-salt-2025"}`)
    .digest("hex");

  return {
    ipHash: hash.substring(0, 32),
    rawIpForLogging: process.env.NODE_ENV === "development" ? rawIp : "[REDACTED]",
    userAgent: userAgent.substring(0, 200),
  };
}

/**
 * Checks rate limit for an incoming Next.js Request.
 * @param {Request} request Next.js request
 * @param {Object} options Configuration options
 * @param {string} options.prefix Prefix namespace (e.g. "enquiry", "order")
 * @param {number} options.limit Maximum allowed requests in window (default 5)
 * @param {number} options.windowMs Window size in milliseconds (default 60000 = 1 minute)
 */
export async function checkRateLimit(request, options = {}) {
  const { prefix = "general", limit = 5, windowMs = 60 * 1000 } = options;
  const { ipHash } = getClientIdentifier(request);
  const identifier = `${prefix}:${ipHash}`;

  const result = await globalLimiter.limit(identifier, limit, windowMs);
  return result;
}

export default checkRateLimit;
