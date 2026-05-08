"use client";

import AdminLayout from "@/app/admin/adminLayout/page";
import { AuditLogDetailsView } from "@/components/admin/audit-logs/audit-log-details-view";
import { useAuditLogDetails } from "@/hooks/admin/audit-logs/use-audit-log-details";

export default function AuditLogDetailsPage() {
  const controller = useAuditLogDetails();

  return (
    <AdminLayout>
      <AuditLogDetailsView controller={controller} />
    </AdminLayout>
  );
}
