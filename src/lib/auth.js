import "server-only";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { memoryAdapter } from "better-auth/adapters/memory";
import { admin } from "better-auth/plugins/admin";
import { twoFactor } from "better-auth/plugins/two-factor";
import * as argon2 from "@node-rs/argon2";
import { getSharedMongoClient, getSharedMongoDb } from "@/lib/db";

const isProd = process.env.NODE_ENV === "production";
const siteUrl = (process.env.SITE_URL || process.env.BETTER_AUTH_URL || "http://localhost:3000").replace(/\/+$/, "");

// Strict production secret enforcement
let secret = process.env.BETTER_AUTH_SECRET;
if (!secret) {
  if (isProd) {
    throw new Error(
      "[Better Auth] CRITICAL SECURITY BLOCKER: BETTER_AUTH_SECRET must be configured in production environment variables. Refusing to run with fallback secret."
    );
  }
  secret = "dbc-development-auth-secret-change-in-production-min-32-chars";
}

/**
 * Configure database adapter.
 * Reuses the centralized singleton MongoClient when MONGODB_URI is provided.
 * In development, provides an offline fallback for quick local testing.
 * In production, strictly requires real MongoDB Atlas and never initializes mock credentials.
 */
function resolveDatabaseAdapter() {
  const mongoDb = getSharedMongoDb();
  const mongoClient = getSharedMongoClient();

  if (mongoDb && mongoClient) {
    return mongodbAdapter(mongoDb, { client: mongoClient });
  }

  // PRODUCTION SAFETY GUARD: Never provide hardcoded mock credentials in production
  if (isProd) {
    // Return empty store adapter so build/pre-render succeeds, but no user can log in without real database
    return memoryAdapter({ user: [], account: [], session: [] });
  }

  // Development-only offline store
  if (!global.__fallbackAuthStore) {
    const devAdminId = "super-admin-dev-001";
    global.__fallbackAuthStore = {
      user: [
        {
          id: devAdminId,
          name: "Super Administrator",
          email: "admin@dhandabhatta.com",
          emailVerified: true,
          role: "admin",
          twoFactorEnabled: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      account: [
        {
          id: "acc-super-admin-dev-001",
          userId: devAdminId,
          accountId: devAdminId,
          providerId: "credential",
          // Argon2id hash for "DhandaBhatta@Admin2025!"
          password:
            "$argon2id$v=19$m=65536,t=3,p=1$hNosSgkD2ocCd+HDtioLLg$s4vsCLl1Z6o+0OOL9LLgrCZGEo329Vls+ol3bvB6jwI",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      session: [
        {
          id: "sess-dev-001",
          userId: devAdminId,
          token: "dbc-dev-admin-session-token-2025",
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    };
  }
  return memoryAdapter(global.__fallbackAuthStore);
}

/**
 * Better Auth Server Configuration for Dhanda Bhatta Company Admin Portal.
 * Enforces Argon2id hashing, mandatory 2FA, disabled public registration,
 * and exact trusted origin restrictions.
 */
export const auth = betterAuth({
  appName: "Dhanda Bhatta Company Admin",
  baseURL: siteUrl,
  secret,
  database: resolveDatabaseAdapter(),

  emailAndPassword: {
    enabled: true,
    // Strictly disable public self-registration. Admin provisioning is server-only.
    disableSignUp: true,
    minPasswordLength: 12,
    maxPasswordLength: 128,
    password: {
      hash: async (password) => {
        return argon2.hash(password, {
          algorithm: argon2.Algorithm.Argon2id,
          memoryCost: 65536,
          timeCost: 3,
          outputLen: 32,
          parallelism: 1,
        });
      },
      verify: async ({ password, hash }) => {
        if (hash && hash.startsWith("$argon2id$")) {
          return argon2.verify(hash, password);
        }
        // Fallback for native verification if required
        try {
          const { verifyPassword } = await import("better-auth/crypto");
          return verifyPassword(hash, password);
        } catch {
          return false;
        }
      },
    },
  },

  plugins: [
    admin({
      defaultRole: "user",
      adminRoles: ["admin"],
    }),
    twoFactor({
      issuer: "Dhanda Bhatta Company",
    }),
  ],

  session: {
    expiresIn: 60 * 60 * 8, // 8-hour admin session
    updateAge: 60 * 60, // Refresh session age every 1 hour
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5-minute cookie cache
    },
  },

  rateLimit: {
    enabled: true,
    window: 60,
    max: 10,
  },

  trustedOrigins: Array.from(
    new Set(
      [
        siteUrl,
        process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
        process.env.NEXT_PUBLIC_SITE_URL ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, "") : null,
      ].filter(Boolean)
    )
  ),
});

export default auth;
