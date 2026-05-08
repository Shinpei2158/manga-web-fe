"use client";

import AdminLayout from "@/app/admin/adminLayout/page";
import { ModerationQueueView } from "@/components/admin/moderation/moderation-queue-view";
import { useModerationQueueController } from "@/hooks/admin-moderation/use-moderation-queue-controller";

export default function ModerationQueuePage() {
  const controller = useModerationQueueController();

  return (
    <AdminLayout>
      <ModerationQueueView controller={controller} />
    </AdminLayout>
  );
}
