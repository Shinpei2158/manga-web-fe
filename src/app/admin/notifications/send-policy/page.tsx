"use client";

import AdminLayout from "@/app/admin/adminLayout/page";
import { SendPolicyNotificationView } from "@/components/admin/notifications/send-policy-notification-view";
import { useSendPolicyNotificationController } from "@/hooks/admin-notifications/use-send-policy-notification-controller";

export default function SendPolicyNotificationPage() {
  const controller = useSendPolicyNotificationController();

  return (
    <AdminLayout>
      <SendPolicyNotificationView controller={controller} />
    </AdminLayout>
  );
}
