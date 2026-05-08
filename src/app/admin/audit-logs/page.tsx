"use client";

import AdminLayout from "@/app/admin/adminLayout/page";
import { AuditLogsView } from "@/components/admin/audit-logs/audit-logs-view";
import { useAuditLogsController } from "@/hooks/admin-audit-logs/use-audit-logs-controller";

export default function AuditLogsPage() {
  const controller = useAuditLogsController();

  return (
    <AdminLayout>
      <AuditLogsView controller={controller} />
    </AdminLayout>
  );
}
