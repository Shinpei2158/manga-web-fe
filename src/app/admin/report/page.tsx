"use client";

import AdminLayout from "../adminLayout/page";
import { ReportWorkspaceView } from "@/components/admin/report/report-workspace-view";
import { useReportWorkspaceController } from "@/hooks/admin-report/use-report-workspace-controller";

export default function ReportsPage() {
  const controller = useReportWorkspaceController();

  return (
    <AdminLayout>
      <ReportWorkspaceView controller={controller} />
    </AdminLayout>
  );
}
