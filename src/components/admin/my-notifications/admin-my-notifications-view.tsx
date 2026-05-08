"use client";

import type { AdminMyNotificationsController } from "@/hooks/admin/my-notifications/use-admin-my-notifications-controller";
import { AdminMyNotificationsHeader } from "./admin-my-notifications-header";
import { AdminMyNotificationsList } from "./admin-my-notifications-list";
import { AdminMyNotificationsStats } from "./admin-my-notifications-stats";
import { AdminMyNotificationsToolbar } from "./admin-my-notifications-toolbar";

export function AdminMyNotificationsView({
  controller,
}: {
  controller: AdminMyNotificationsController;
}) {
  return (
    <div className="space-y-6">
      <AdminMyNotificationsHeader controller={controller} />
      <AdminMyNotificationsStats overview={controller.overview} />
      <AdminMyNotificationsToolbar controller={controller} />
      <AdminMyNotificationsList controller={controller} />
    </div>
  );
}
