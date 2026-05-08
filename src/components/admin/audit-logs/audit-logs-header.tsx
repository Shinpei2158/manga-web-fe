"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { AuditLogsController } from "@/hooks/admin/audit-logs/use-audit-logs-controller";
import { auditSurfaceClass } from "@/lib/admin-audit-logs/constants";
import { prettyRole } from "@/lib/audit-ui";

export function AuditLogsHeader({
  controller: c,
}: {
  controller: AuditLogsController;
}) {
  return (
    <Card className={auditSurfaceClass}>
      <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-slate-700">
              Audit operations
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span>{c.totalRows} matching logs</span>
          </div>

          <p className="max-w-2xl text-sm leading-6 text-slate-600">
            Review moderator activity, export the active filter set, and clear
            unseen records without leaving the workspace.
          </p>

          {c.meError ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50/80 px-3 py-2 text-xs leading-5 text-amber-800">
              Role verification from `/api/auth/me` is temporarily unavailable.
              You can still try actions here and let the backend validate
              permission.
            </div>
          ) : !c.isAdmin ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-xs leading-5 text-slate-600">
              Reviewing as{" "}
              <b className="font-semibold text-slate-900">
                {prettyRole(c.me?.role ?? "unknown")}
              </b>
              . Approve and seen actions remain admin-only.
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            onClick={c.handleMarkAllSeen}
            disabled={c.loading || !c.canAttemptAdminActions}
            title={!c.canAttemptAdminActions ? "Admin only" : ""}
          >
            Mark matching as seen
          </Button>

          <Button
            variant="outline"
            className="rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            onClick={c.handleExportCSV}
            disabled={c.loading}
          >
            <Download className="mr-2 h-4 w-4" />
            Export filtered CSV
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

