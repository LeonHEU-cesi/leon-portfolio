import type { Metadata } from "next";

import { AdminDashboardView } from "@/components/admin/AdminDashboardView";
import { auth } from "@/auth";
import { getAdminStats } from "@/lib/admin-stats";

import { logout } from "./actions";

export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [session, stats] = await Promise.all([auth(), getAdminStats()]);
  return (
    <AdminDashboardView
      stats={stats}
      userName={session?.user?.name ?? session?.user?.email}
      logoutAction={logout}
    />
  );
}
