"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AuditLogsController } from "@/hooks/admin/audit-logs/use-audit-logs-controller";

export function AuditPagination({
  controller: c,
}: {
  controller: AuditLogsController;
}) {
  return (
    <div className="flex items-center justify-between border-t border-slate-200/70 p-4">
      <div className="text-sm text-slate-600">
        Page {c.currentPage} / {c.totalPages} - Total {c.totalRows} logs
      </div>

      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="rounded-xl border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          disabled={c.currentPage === 1 || c.loading}
          onClick={() => c.setCurrentPage(Math.max(1, c.currentPage - 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button
          size="sm"
          variant="outline"
          className="rounded-xl border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          disabled={c.currentPage === c.totalPages || c.loading}
          onClick={() =>
            c.setCurrentPage(Math.min(c.totalPages, c.currentPage + 1))
          }
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
