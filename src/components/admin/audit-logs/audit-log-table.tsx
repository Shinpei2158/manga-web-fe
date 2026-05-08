"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AuditLogsController } from "@/hooks/admin/audit-logs/use-audit-logs-controller";
import { auditSurfaceClass } from "@/lib/admin-audit-logs/constants";
import { AuditPagination } from "./audit-log-table-pagination";
import { AuditTableRow } from "./audit-log-table-row";

export function AuditLogTable({
  controller: c,
}: {
  controller: AuditLogsController;
}) {
  return (
    <Card className={`${auditSurfaceClass} overflow-hidden`}>
      <div className="flex flex-col gap-3 border-b border-slate-200/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-950">
            Activity records
          </p>
          <p className="text-sm leading-6 text-slate-500">
            Newest actions first. Open a record to inspect evidence, notes, and
            approval state.
          </p>
        </div>

        <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {c.loading ? "Refreshing..." : `${c.totalRows} matching logs`}
        </div>
      </div>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80">
                {["Time", "Actor", "Event", "Message", "Risk", "Status", "Approval"].map((label) => (
                  <TableHead
                    key={label}
                    className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500"
                  >
                    {label}
                  </TableHead>
                ))}
                <TableHead className="text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Review
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <AuditTableBody controller={c} />
            </TableBody>
          </Table>
        </div>

        <AuditPagination controller={c} />
      </CardContent>
    </Card>
  );
}

function AuditTableBody({
  controller: c,
}: {
  controller: AuditLogsController;
}) {
  if (c.loading) {
    return <AuditStateRow>Loading...</AuditStateRow>;
  }

  if (c.listError) {
    return (
      <TableRow>
        <TableCell colSpan={8} className="py-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <div>
              <p className="text-sm font-semibold text-rose-700">
                Unable to load audit logs
              </p>
              <p className="mt-1 text-sm text-slate-500">{c.listError}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              onClick={c.fetchLogs}
            >
              Retry
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  if (c.logs.length === 0) {
    return <AuditStateRow>No logs found.</AuditStateRow>;
  }

  return (
    <>
      {c.logs.map((log) => (
        <AuditTableRow key={log.id} controller={c} log={log} />
      ))}
    </>
  );
}

function AuditStateRow({ children }: { children: ReactNode }) {
  return (
    <TableRow>
      <TableCell colSpan={8} className="py-10 text-center text-sm text-slate-500">
        {children}
      </TableCell>
    </TableRow>
  );
}
