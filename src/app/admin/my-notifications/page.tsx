"use client";

import AdminLayout from "../adminLayout/page";
import { AdminMyNotificationsView } from "@/components/admin/my-notifications/admin-my-notifications-view";
import { useAdminMyNotificationsController } from "@/hooks/admin/my-notifications/use-admin-my-notifications-controller";

export default function AdminMyNotificationsPage() {
  const controller = useAdminMyNotificationsController();

  return (
    <AdminLayout>
      <AdminMyNotificationsView controller={controller} />
    </AdminLayout>
  );
}
