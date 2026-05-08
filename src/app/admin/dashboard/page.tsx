"use client";

import AdminLayout from "../adminLayout/page";
import { AdminDashboardContent } from "@/components/admin/dashboard/admin-dashboard-content";
import { useAdminDashboardData } from "@/hooks/dashboard/use-admin-dashboard-data";

export default function AdminDashboard() {
  const dashboard = useAdminDashboardData();

  return (
    <AdminLayout>
      <AdminDashboardContent {...dashboard} />
    </AdminLayout>
  );
}
