import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Clock,
  KeyRound,
  UserCheck,
  AlertTriangle,
  ArrowRight,
  Shield,
  FileCheck,
} from "lucide-react";
import { requireAdmin } from "@/lib/server/requireAdmin";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Security & Authorization Architecture | Kiln Admin | Dhanda Bhatta Company",
  description: "Enterprise security architecture, two-factor authentication policy, and role access matrix.",
};

export default async function SecurityDashboardPage() {
  const { user } = await requireAdmin();

  const roleMatrix = [
    {
      role: "Super Admin",
      scope: "Owner Level",
      permissions: "Full unrestricted administrative access, staff credentials, system configuration, audit logs.",
    },
    {
      role: "Admin",
      scope: "General Management",
      permissions: "Catalogue CRUD, orders, enquiries, media gallery, content editors.",
    },
    {
      role: "Order Manager",
      scope: "Logistics & Dispatch",
      permissions: "Enquiries CRM, order requests, dispatch quotations, customer notes.",
    },
    {
      role: "Content Manager",
      scope: "Marketing & Media",
      permissions: "Product catalogue editor, gallery photos/videos, CMS pages, FAQ management.",
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Header */}
      <div className="pb-3 border-b border-border-subtle">
        <span className="text-[10px] font-mono font-bold tracking-widest text-sandstone uppercase block mb-1">
          Cryptographic Access Controls
        </span>
        <h1 className="font-heading font-black text-2xl sm:text-3xl text-charcoal tracking-tight">
          Security & Access Policy
        </h1>
      </div>

      {/* Security Architecture Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: 2FA */}
        <div className="bg-white p-5 border border-border-subtle shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-secondary-text">
              Two-Factor Policy
            </span>
            <ShieldCheck className="w-5 h-5 text-[#2E7D32]" />
          </div>
          <div className="text-base font-heading font-bold text-charcoal">
            Mandatory TOTP Active
          </div>
          <p className="text-xs text-secondary-text leading-relaxed">
            RFC 6238 standard authenticator app verification enforced on every sign-in. Single-use emergency backup tokens supported.
          </p>
          <div className="pt-2">
            <Link
              href="/admin/security/setup-2fa"
              className="inline-flex items-center gap-1 text-xs text-terracotta hover:underline font-semibold"
            >
              <span>Re-enroll 2FA Authenticator</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Card 2: Password Cryptography */}
        <div className="bg-white p-5 border border-border-subtle shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-secondary-text">
              Credential Cryptography
            </span>
            <Lock className="w-5 h-5 text-terracotta" />
          </div>
          <div className="text-base font-heading font-bold text-charcoal">
            Argon2id Algorithm
          </div>
          <p className="text-xs text-secondary-text leading-relaxed">
            OWASP-recommended adaptive password hashing (64MB memory, 3 iterations) configured via Better Auth and @node-rs/argon2.
          </p>
          <div className="pt-2">
            <span className="text-[11px] font-mono text-[#2E7D32] font-semibold">
              ✓ Compliant with OWASP ASVS 4.0
            </span>
          </div>
        </div>

        {/* Card 3: Session Security */}
        <div className="bg-white p-5 border border-border-subtle shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-secondary-text">
              Session Lifetime
            </span>
            <Clock className="w-5 h-5 text-sandstone" />
          </div>
          <div className="text-base font-heading font-bold text-charcoal">
            8-Hour Strict Expiry
          </div>
          <p className="text-xs text-secondary-text leading-relaxed">
            Sessions expire after 8 hours. Cookies utilize HttpOnly, SameSite=Lax, and Secure flags in production. Public registration is locked.
          </p>
          <div className="pt-2">
            <span className="text-[11px] font-mono text-charcoal font-semibold">
              Public Self-Registration: Strictly Disabled
            </span>
          </div>
        </div>
      </div>

      {/* Role Hierarchy Matrix */}
      <div className="bg-white border border-border-subtle shadow-2xs p-6 space-y-4">
        <div className="pb-3 border-b border-border-subtle">
          <h2 className="font-heading font-black text-base text-charcoal">
            Role-Based Access Control (RBAC) Matrix
          </h2>
          <p className="text-xs text-secondary-text">
            Configured administrative tiers for operational delegation
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-warm-bg border-b border-border-subtle text-[10px] font-mono uppercase tracking-wider text-secondary-text">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Role Tier</th>
                <th className="py-2.5 px-4 font-semibold">Operational Scope</th>
                <th className="py-2.5 px-4 font-semibold">Assigned Permissions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {roleMatrix.map((item) => (
                <tr key={item.role} className="hover:bg-warm-bg/40 transition-colors">
                  <td className="py-3 px-4 font-heading font-bold text-charcoal">
                    {item.role}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-terracotta">
                    {item.scope}
                  </td>
                  <td className="py-3 px-4 text-secondary-text leading-relaxed">
                    {item.permissions}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active Session Verification Card */}
      <div className="p-5 bg-warm-bg border-l-4 border-sandstone border-y border-r border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-sandstone" />
            <strong className="text-charcoal font-semibold">Currently Active Session:</strong>
          </div>
          <p className="text-secondary-text">
            Signed in as <strong>{user.email}</strong> with role <strong className="uppercase">{user.role}</strong>. Session protected by cryptographic Better Auth token.
          </p>
        </div>
        <Link
          href="/admin/activity"
          className="px-4 py-2 bg-charcoal hover:bg-black text-white text-xs font-heading font-bold uppercase tracking-wider transition-colors shrink-0"
        >
          View Full Audit Log Stream
        </Link>
      </div>
    </div>
  );
}
