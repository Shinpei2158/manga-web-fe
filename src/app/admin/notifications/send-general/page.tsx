"use client";

import AdminLayout from "@/app/admin/adminLayout/page";
import { SendGeneralNotificationView } from "@/components/admin/notifications/send-general-notification-view";
import { useSendGeneralNotificationController } from "@/hooks/admin/notifications/use-send-general-notification-controller";

export default function SendGeneralNotificationPage() {
  const controller = useSendGeneralNotificationController();

  return (
    <AdminLayout>
      <SendGeneralNotificationView controller={controller} />
    </AdminLayout>
  );
}
