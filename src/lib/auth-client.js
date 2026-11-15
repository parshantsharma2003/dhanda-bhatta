import { createAuthClient } from "better-auth/react";
import { adminClient, twoFactorClient } from "better-auth/client/plugins";

const getBaseURL = () => {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
};

/**
 * Better Auth Client Instance with Admin & Two-Factor Plugins
 */
export const authClient = createAuthClient({
  baseURL: getBaseURL(),
  plugins: [
    adminClient(),
    twoFactorClient(),
  ],
});

export const {
  signIn,
  signOut,
  signUp,
  useSession,
  twoFactor,
} = authClient;
