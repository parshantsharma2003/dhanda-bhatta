import { requireAdmin } from "@/lib/server/requireAdmin";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminBreadcrumbs from "@/components/admin/AdminBreadcrumbs";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Portal | Dhanda Bhatta Company",
  description: "Kiln operations and administrative management portal.",
  robots: "noindex, nofollow",
};

export default async function AdminDashboardLayout({ children }) {
  const { user } = await requireAdmin();

  return (
    <div className="min-h-screen bg-warm-bg flex flex-col md:flex-row text-charcoal">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader user={user} />
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          <AdminBreadcrumbs />
          {children}
        </main>
      </div>
    </div>
  );
}
