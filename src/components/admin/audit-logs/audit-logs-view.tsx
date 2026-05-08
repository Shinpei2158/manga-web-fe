"use client";

import type { AuditLogsController } from "@/hooks/admin-audit-logs/use-audit-logs-controller";
import { AuditLogFiltersPanel } from "./audit-log-filters-panel";
import { AuditLogTable } from "./audit-log-table";
import { AuditLogsHeader } from "./audit-logs-header";
import { AuditSummaryCards } from "./audit-summary-cards";

export function AuditLogsView({
  controller,
}: {
  controller: AuditLogsController;
}) {
  return (
    <div className="space-y-5">
      <AuditLogsHeader controller={controller} />
      <AuditSummaryCards summary={controller.summary} />
      <AuditLogFiltersPanel controller={controller} />
      <AuditLogTable controller={controller} />
    </div>
  );
}

