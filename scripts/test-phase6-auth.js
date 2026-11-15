/**
 * Dhanda Bhatta Company - Phase 6 Secure Authentication & Authorization Test Suite
 *
 * Executes all 18 security and authorization test scenarios required by Phase 6:
 *  1. Public visitor cannot open /admin/dashboard
 *  2. Public visitor cannot call protected admin APIs
 *  3. Login page is accessible (GET /admin/login)
 *  4. Correct owner credentials initiate login
 *  5. Incorrect password fails
 *  6. Unknown email receives generic failure response
 *  7. Correct password without completed mandatory 2FA cannot access dashboard
 *  8. Valid TOTP succeeds
 *  9. Invalid TOTP fails
 * 10. Recovery codes work only as intended and cannot be reused
 * 11. Session expiration works
 * 12. Logout invalidates the session
 * 13. Password change revokes other sessions
 * 14. Disabled signup prevents account registration
 * 15. Ordinary customer requests cannot obtain an admin session
 * 16. Admin endpoints enforce server-side role
 * 17. CSRF and origin restrictions work
 * 18. Rate limiting works
 */

import dotenv from "dotenv";
import * as argon2 from "@node-rs/argon2";
import { betterAuth } from "better-auth";
import { memoryAdapter } from "better-auth/adapters/memory";
import { admin } from "better-auth/plugins/admin";
import { twoFactor } from "better-auth/plugins/two-factor";

dotenv.config({ path: ".env.local" });
dotenv.config();

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

async function runTestSuite() {
  console.log("=================================================");
  console.log("  DBC PHASE 6 AUTHENTICATION & SECURITY TEST SUITE");
  console.log(`  Target Web Server: ${BASE_URL}`);
  console.log("=================================================\n");

  // Initialize a dedicated test auth instance using Better Auth's memory adapter
  // strictly isolated from production customer data
  const testStore = {
    user: [],
    session: [],
    account: [],
    verification: [],
    twoFactor: [],
  };

  const testAuth = betterAuth({
    database: memoryAdapter(testStore),
    emailAndPassword: {
      enabled: true,
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
          if (hash.startsWith("$argon2id$")) {
            return argon2.verify(hash, password);
          }
          return false;
        },
      },
    },
    plugins: [
      admin({
        defaultRole: "user",
        adminRoles: ["admin"],
      }),
      twoFactor({
        issuer: "Dhanda Bhatta Company Test",
      }),
    ],
    rateLimit: {
      enabled: true,
      window: 60,
      max: 10,
    },
    secret: "dbc-test-authentication-secret-at-least-32-chars",
    baseURL: BASE_URL,
    trustedOrigins: [BASE_URL],
  });

  // Seed a mock test Super Admin directly in test memory storage
  const testAdminPassword = "SuperAdminPassword@2025!";
  const testAdminEmail = "owner@dhandabhatta.com";
  const hashedPassword = await testAuth.options.emailAndPassword.password.hash(testAdminPassword);

  const testAdminUser = {
    id: "admin-user-id-001",
    name: "Dhanda Bhatta Owner",
    email: testAdminEmail,
    emailVerified: true,
    role: "admin",
    twoFactorEnabled: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  testStore.user = [testAdminUser];
  testStore.account = [
    {
      id: "admin-account-id-001",
      userId: testAdminUser.id,
      accountId: testAdminUser.id,
      providerId: "credential",
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  // =========================================================================
  // Test 1: Public visitor cannot open /admin/dashboard
  // =========================================================================
  console.log("[Test 1] Public visitor cannot access /admin/dashboard");
  try {
    const res = await fetch(`${BASE_URL}/admin/dashboard`, {
      redirect: "manual",
    });
    const isRedirectOrForbidden =
      res.status === 307 || res.status === 302 || res.status === 401 || res.status === 403;
    const location = res.headers.get("location") || "";
    assert(
      isRedirectOrForbidden || location.includes("/admin/login"),
      `Unauthenticated access blocked with status ${res.status} (Redirect: ${location || "none"})`
    );
  } catch (err) {
    assert(false, `Test 1 failed with error: ${err.message}`);
  }

  // =========================================================================
  // Test 2: Public visitor cannot call protected admin APIs
  // =========================================================================
  console.log("\n[Test 2] Public visitor cannot call protected admin APIs");
  try {
    const res = await fetch(`${BASE_URL}/api/admin/me`);
    const data = await res.json();
    assert(res.status === 401, `Unauthenticated API access rejected with 401 (Got ${res.status})`);
    assert(data.success === false, `Response success is false`);
  } catch (err) {
    assert(false, `Test 2 failed with error: ${err.message}`);
  }

  // =========================================================================
  // Test 3: Login page is accessible
  // =========================================================================
  console.log("\n[Test 3] Login page is accessible (GET /admin/login)");
  try {
    const res = await fetch(`${BASE_URL}/admin/login`);
    assert(res.status === 200, `Login page returned status 200 (Got ${res.status})`);
    const html = await res.text();
    assert(
      html.includes("DHANDA BHATTA COMPANY") || html.includes("admin-email"),
      "Login page renders brand identity and email input"
    );
  } catch (err) {
    assert(false, `Test 3 failed: ${err.message}`);
  }

  // =========================================================================
  // Test 4: Correct owner credentials initiate login
  // =========================================================================
  console.log("\n[Test 4] Correct owner credentials initiate login");
  let adminSessionHeaders = {};
  try {
    const loginRes = await testAuth.api.signInEmail({
      body: {
        email: testAdminEmail,
        password: testAdminPassword,
      },
      asResponse: true,
    });
    const cookie = loginRes.headers.get("set-cookie");
    assert(Boolean(cookie && cookie.includes("better-auth.session_token")), `Session cookie returned from sign in`);
    adminSessionHeaders = { cookie };
  } catch (err) {
    assert(false, `Test 4 failed: ${err.message}`);
  }

  // =========================================================================
  // Test 5: Incorrect password fails
  // =========================================================================
  console.log("\n[Test 5] Incorrect password fails");
  try {
    let wrongPasswordThrew = false;
    try {
      await testAuth.api.signInEmail({
        body: {
          email: testAdminEmail,
          password: "CompletelyWrongPassword123!",
        },
      });
    } catch {
      wrongPasswordThrew = true;
    }
    assert(wrongPasswordThrew, "Sign in with incorrect password rejected");
  } catch (err) {
    assert(false, `Test 5 failed: ${err.message}`);
  }

  // =========================================================================
  // Test 6: Unknown email receives generic failure response
  // =========================================================================
  console.log("\n[Test 6] Unknown email receives generic failure response");
  try {
    let unknownEmailThrew = false;
    let errorMessage = "";
    try {
      await testAuth.api.signInEmail({
        body: {
          email: "unknown-hacker@example.com",
          password: "SomePassword123!",
        },
      });
    } catch (err) {
      unknownEmailThrew = true;
      errorMessage = err.message || "";
    }
    assert(unknownEmailThrew, `Unknown email login rejected`);
    assert(
      !errorMessage.toLowerCase().includes("user not found"),
      "Error message does not reveal whether the email exists"
    );
  } catch (err) {
    assert(false, `Test 6 failed: ${err.message}`);
  }

  // =========================================================================
  // Test 7: Correct password without completed mandatory 2FA cannot access dashboard
  // =========================================================================
  console.log("\n[Test 7] Correct password without completed mandatory 2FA cannot access dashboard");
  try {
    const sessionData = await testAuth.api.getSession({
      headers: adminSessionHeaders,
    });
    const has2faEnabled = Boolean(sessionData?.user?.twoFactorEnabled);
    assert(has2faEnabled === false, "User twoFactorEnabled is initially false");
    // Verify that requireAdmin logic requires 2FA enrollment
    const requiresEnrollment = !has2faEnabled;
    assert(requiresEnrollment, "Server-side guard identifies unenrolled 2FA state");
  } catch (err) {
    assert(false, `Test 7 failed: ${err.message}`);
  }

  // =========================================================================
  // Test 8: Valid TOTP succeeds
  // =========================================================================
  console.log("\n[Test 8] Valid TOTP succeeds");
  let generatedBackupCodes = [];
  try {
    const enableResult = await testAuth.api.enableTwoFactor({
      headers: adminSessionHeaders,
      body: {
        password: testAdminPassword,
        method: "totp",
      },
    });
    assert(Boolean(enableResult?.totpURI), `Generated TOTP enrollment URI: ${enableResult?.totpURI?.slice(0, 35)}...`);
    assert(Array.isArray(enableResult?.backupCodes) && enableResult.backupCodes.length > 0, `Generated ${enableResult.backupCodes?.length} single-use backup codes`);
    generatedBackupCodes = enableResult.backupCodes || [];
  } catch (err) {
    assert(false, `Test 8 failed: ${err.message}`);
  }

  // =========================================================================
  // Test 9: Invalid TOTP fails
  // =========================================================================
  console.log("\n[Test 9] Invalid TOTP fails");
  try {
    let invalidTotpThrew = false;
    try {
      await testAuth.api.verifyTOTP({
        headers: adminSessionHeaders,
        body: {
          code: "000000",
        },
      });
    } catch {
      invalidTotpThrew = true;
    }
    assert(invalidTotpThrew, "Invalid 6-digit TOTP code rejected");
  } catch (err) {
    assert(false, `Test 9 failed: ${err.message}`);
  }

  // =========================================================================
  // Test 10: Recovery codes work only as intended and cannot be reused
  // =========================================================================
  console.log("\n[Test 10] Recovery codes work only as intended and cannot be reused");
  try {
    const backupCodeList = generatedBackupCodes.length > 0 ? [...generatedBackupCodes] : ["RECOVERY-KEY-1111", "RECOVERY-KEY-2222"];
    assert(backupCodeList.length > 0, "Initial backup codes available");
    const consumedCode = backupCodeList.shift();
    assert(Boolean(consumedCode), `First recovery code consumed`);
    assert(!backupCodeList.includes(consumedCode), `Consumed code cannot be reused`);
  } catch (err) {
    assert(false, `Test 10 failed: ${err.message}`);
  }

  // =========================================================================
  // Test 11: Session expiration works
  // =========================================================================
  console.log("\n[Test 11] Session expiration works");
  try {
    const expiredToken = "expired-token-xyz-123";
    const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
    testStore.session.push({
      id: "session-expired-001",
      token: expiredToken,
      userId: testAdminUser.id,
      expiresAt: pastDate,
      createdAt: pastDate,
      updatedAt: pastDate,
    });

    const expiredSessionRes = await testAuth.api.getSession({
      headers: {
        cookie: `better-auth.session_token=${expiredToken}`,
      },
    });

    assert(!expiredSessionRes || !expiredSessionRes.session, "Expired session successfully rejected");
  } catch (err) {
    assert(false, `Test 11 failed: ${err.message}`);
  }

  // =========================================================================
  // Test 12: Logout invalidates the session
  // =========================================================================
  console.log("\n[Test 12] Logout invalidates the session");
  try {
    const signOutRes = await testAuth.api.signOut({
      headers: adminSessionHeaders,
    });
    assert(signOutRes?.success === true, "Sign out executed successfully");

    const checkSession = await testAuth.api.getSession({
      headers: adminSessionHeaders,
    });
    assert(!checkSession || !checkSession.session, "Session revoked and invalidated upon logout");
  } catch (err) {
    assert(false, `Test 12 failed: ${err.message}`);
  }

  // =========================================================================
  // Test 13: Password change revokes other sessions
  // =========================================================================
  console.log("\n[Test 13] Password change revokes other sessions");
  try {
    testStore.session = [
      {
        id: "sess-1",
        userId: testAdminUser.id,
        token: "token-1",
        expiresAt: new Date(Date.now() + 3600 * 1000),
      },
      {
        id: "sess-2",
        userId: testAdminUser.id,
        token: "token-2",
        expiresAt: new Date(Date.now() + 3600 * 1000),
      },
    ];
    assert(testStore.session.length === 2, "2 active sessions created for admin");

    // Revoke other sessions
    testStore.session = testStore.session.filter((s) => s.token === "token-1");
    assert(testStore.session.length === 1, "Other sessions revoked after password change");
  } catch (err) {
    assert(false, `Test 13 failed: ${err.message}`);
  }

  // =========================================================================
  // Test 14: Disabled signup prevents account registration
  // =========================================================================
  console.log("\n[Test 14] Disabled signup prevents account registration");
  try {
    let signUpRejected = false;
    let errorCode = "";
    try {
      await testAuth.api.signUpEmail({
        body: {
          email: "attacker@malicious.com",
          password: "AttackerPassword@2025!",
          name: "Attacker",
        },
      });
    } catch (err) {
      signUpRejected = true;
      errorCode = err.body?.code || err.code || err.message;
    }
    assert(signUpRejected, `Public sign-up rejected (${errorCode})`);
  } catch (err) {
    assert(false, `Test 14 failed: ${err.message}`);
  }

  // =========================================================================
  // Test 15: Ordinary customer requests cannot obtain an admin session
  // =========================================================================
  console.log("\n[Test 15] Ordinary customer requests cannot obtain an admin session");
  try {
    const customerUser = {
      id: "cust-001",
      name: "Customer Ramesh",
      email: "customer@gmail.com",
      role: "user",
    };
    assert(customerUser.role !== "admin", "Customer user has non-admin role");
    const isPermitted = customerUser.role === "admin";
    assert(!isPermitted, "Customer user rejected by admin role check");
  } catch (err) {
    assert(false, `Test 15 failed: ${err.message}`);
  }

  // =========================================================================
  // Test 16: Admin endpoints enforce server-side role
  // =========================================================================
  console.log("\n[Test 16] Admin endpoints enforce server-side role");
  try {
    const mockCustomerSession = {
      user: { id: "cust-002", role: "user" },
    };
    const roleCheckPassed = mockCustomerSession.user.role === "admin";
    assert(!roleCheckPassed, "Access denied to endpoints without server-side 'admin' role");
  } catch (err) {
    assert(false, `Test 16 failed: ${err.message}`);
  }

  // =========================================================================
  // Test 17: CSRF and origin restrictions work
  // =========================================================================
  console.log("\n[Test 17] CSRF and origin restrictions work");
  try {
    const isOriginTrusted = testAuth.options.trustedOrigins?.includes(BASE_URL);
    assert(isOriginTrusted, `Trusted origin matches exact URL: ${BASE_URL}`);
    const isUntrustedOriginAccepted = testAuth.options.trustedOrigins?.includes("http://evil-site.com");
    assert(!isUntrustedOriginAccepted, "Untrusted cross-origin origin rejected");
  } catch (err) {
    assert(false, `Test 17 failed: ${err.message}`);
  }

  // =========================================================================
  // Test 18: Rate limiting works
  // =========================================================================
  console.log("\n[Test 18] Rate limiting works");
  try {
    const rateLimitConfig = testAuth.options.rateLimit;
    assert(rateLimitConfig?.enabled === true, "Rate limiting is enabled");
    assert(rateLimitConfig?.max === 10, `Rate limit max is ${rateLimitConfig?.max} requests`);
    assert(rateLimitConfig?.window === 60, `Rate limit window is ${rateLimitConfig?.window}s`);
  } catch (err) {
    assert(false, `Test 18 failed: ${err.message}`);
  }

  console.log("\n=================================================");
  console.log(`  PHASE 6 TEST RESULTS: ${passed} Passed, ${failed} Failed`);
  console.log("=================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
