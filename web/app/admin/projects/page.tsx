import type { Metadata } from "next";

import { AdminProjectsTable } from "@/components/admin/AdminProjectsTable";
import { listAdminProjects } from "@/lib/admin-projects";

export const metadata: Metadata = {
  title: "Admin · Projets",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q = "", status = "" } = await searchParams;
  const rows = await listAdminProjects({ q, status });
  return <AdminProjectsTable rows={rows} q={q} status={status} />;
}
