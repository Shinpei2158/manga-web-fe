"use client";

import { Button } from "@/components/ui/button";

export function TaxonomyPagination({
  loading,
  onPageChange,
  page,
  pageCount,
  total,
}: {
  loading: boolean;
  onPageChange: (page: number) => void;
  page: number;
  pageCount: number;
  total: number;
}) {
  if (loading || total === 0) return null;

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-muted-foreground">
        Page <span className="font-medium text-foreground">{page}</span> of{" "}
        <span className="font-medium text-foreground">{pageCount}</span> .{" "}
        <span className="font-medium text-foreground">{total}</span> total
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          disabled={page <= 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
        >
          <span className="sr-only">Previous page</span>
          <span aria-hidden="true">{"<"}</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          disabled={page >= pageCount}
          onClick={() => onPageChange(Math.min(pageCount, page + 1))}
        >
          <span className="sr-only">Next page</span>
          <span aria-hidden="true">{">"}</span>
        </Button>
      </div>
    </div>
  );
}
