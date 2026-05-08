"use client";

import AdminLayout from "../adminLayout/page";
import { AdminNotificationsView } from "@/components/admin/notifications/admin-notifications-view";
import { useAdminNotificationsController } from "@/hooks/admin-notifications/use-admin-notifications-controller";

export default function AdminNotificationsPage() {
  const controller = useAdminNotificationsController();

  return (
    <AdminLayout>
      <AdminNotificationsView controller={controller} />
    </AdminLayout>
  );
}
