"use client";

import { Button } from "@/components/ui/button";
import type { ReportWorkspaceController } from "@/hooks/admin-report/use-report-workspace-controller";

export function ReportQueuePagination({
  controller: c,
  pageNumbers,
}: {
  controller: ReportWorkspaceController;
  pageNumbers: number[];
}) {
  if (c.currentGroups.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        className="rounded-xl border-slate-200"
        disabled={c.currentView.currentPage <= 1}
        onClick={() =>
          c.patchView(c.activeTab, {
            currentPage: Math.max(1, c.currentView.currentPage - 1),
          })
        }
      >
        Prev
      </Button>
      {pageNumbers.map((pageNumber) => (
        <Button
          key={pageNumber}
          variant={
            pageNumber === c.currentView.currentPage ? "default" : "outline"
          }
          size="sm"
          className="rounded-xl"
          onClick={() => c.patchView(c.activeTab, { currentPage: pageNumber })}
        >
          {pageNumber}
        </Button>
      ))}
      <Button
        variant="outline"
        size="sm"
        className="rounded-xl border-slate-200"
        disabled={c.currentView.currentPage >= c.totalPages}
        onClick={() =>
          c.patchView(c.activeTab, {
            currentPage: Math.min(c.totalPages, c.currentView.currentPage + 1),
          })
        }
      >
        Next
      </Button>
    </div>
  );
}
