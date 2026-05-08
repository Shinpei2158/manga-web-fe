"use client";

import { Card } from "@/components/ui/card";
import type { ModerationQueueController } from "@/hooks/admin-moderation/use-moderation-queue-controller";
import { ModerationQueuePagination } from "./queue-pagination";
import { QueueFilters } from "./queue-filters";
import { QueueTable } from "./queue-table";

export function ModerationQueueView({
  controller: c,
}: {
  controller: ModerationQueueController;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Admin</span>
        <span>/</span>
        <span>Moderation</span>
        <span>/</span>
        <span className="text-foreground">Queue</span>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Moderation Queue</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {c.loading
              ? "Loading queue..."
              : c.totalItems > 0
                ? `${c.totalItems} chapters match the current queue filters`
                : "No chapters match the current queue filters"}
          </p>
          {c.err && <p className="mt-2 text-sm text-red-600">{c.err}</p>}
        </div>

        <Card className="rounded-xl bg-muted/40 px-3 py-2 text-right shadow-none">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Queue order
          </p>
          <p className="text-sm font-medium">Pending review first</p>
          <p className="text-xs text-muted-foreground">
            Default order follows the moderation queue. Click sortable columns
            to override it on this page.
          </p>
        </Card>
      </div>

      <QueueFilters onFiltersChange={c.handleFiltersChange} />

      <QueueTable
        items={c.paginatedItems}
        loading={c.loading}
        sorting={c.sorting}
        onSortingChange={c.setSorting}
      />

      {!c.loading && c.totalItems > 0 ? (
        <ModerationQueuePagination
          page={c.currentPage}
          totalPages={c.totalPages}
          pageSize={c.pageSize}
          totalItems={c.totalItems}
          visibleCount={c.paginatedItems.length}
          onPageChange={c.setPage}
          onPageSizeChange={c.setPageSize}
        />
      ) : null}
    </div>
  );
}
