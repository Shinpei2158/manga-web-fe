"use client";

import AdminLayout from "@/app/admin/adminLayout/page";
import { ModerationWorkspaceView } from "@/components/admin/moderation/workspace/moderation-workspace-view";
import { useModerationWorkspaceController } from "@/hooks/admin/moderation/use-moderation-workspace-controller";

export default function ModerationWorkspacePage() {
  const controller = useModerationWorkspaceController();

  return (
    <AdminLayout>
      <ModerationWorkspaceView controller={controller} />
    </AdminLayout>
  );
}
