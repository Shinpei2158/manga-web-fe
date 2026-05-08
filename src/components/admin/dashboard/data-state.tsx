"use client";

import type { ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { DataMessageTone } from "@/lib/admin-dashboard/types";

export function DataStateMessage({
  title,
  description,
  tone = "default",
}: {
  title: string;
  description: string;
  tone?: DataMessageTone;
}) {
  const palette =
    tone === "danger"
      ? {
          container:
            "border-red-200/80 bg-red-50/80 text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200",
          icon: "text-red-500 dark:text-red-300",
          title: "text-red-900 dark:text-red-50",
        }
      : {
          container:
            "border-slate-200/80 bg-slate-50/80 text-slate-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300",
          icon: "text-slate-400 dark:text-slate-500",
          title: "text-slate-900 dark:text-slate-100",
        };

  return (
    <div
      className={cn(
        "flex h-full min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed px-6 text-center",
        palette.container,
      )}
    >
      <AlertCircle className={cn("mb-3 h-5 w-5", palette.icon)} />
      <p className={cn("text-sm font-semibold", palette.title)}>{title}</p>
      <p className="mt-1 max-w-sm text-sm leading-6">{description}</p>
    </div>
  );
}

export function TableStateRow({
  colSpan,
  title,
  description,
  tone = "default",
}: {
  colSpan: number;
  title: string;
  description: string;
  tone?: DataMessageTone;
}) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="py-10">
        <DataStateMessage title={title} description={description} tone={tone} />
      </TableCell>
    </TableRow>
  );
}

export function ChartState({
  loading,
  error,
  hasData,
  emptyTitle,
  emptyDescription,
  children,
}: {
  loading: boolean;
  error?: string;
  hasData: boolean;
  emptyTitle: string;
  emptyDescription: string;
  children: ReactNode;
}) {
  if (loading) {
    return (
      <div className="flex h-full flex-col justify-end gap-4 rounded-xl border border-slate-200/80 bg-slate-50/70 px-5 py-4 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="flex items-end gap-3">
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>
        <div className="flex justify-between gap-2">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <DataStateMessage
        title="Unable to load chart"
        description={error}
        tone="danger"
      />
    );
  }

  if (!hasData) {
    return (
      <DataStateMessage title={emptyTitle} description={emptyDescription} />
    );
  }

  return <>{children}</>;
}
