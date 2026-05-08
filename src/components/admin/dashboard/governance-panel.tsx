"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { surfaceCardClass } from "@/lib/admin-dashboard/constants";
import type { GovernanceMetric } from "@/lib/admin-dashboard/types";
import { DataStateMessage } from "./data-state";

type GovernancePanelProps = {
  title: string;
  description: string;
  metrics: GovernanceMetric[];
  loading: boolean;
  error?: string;
  isEmpty: boolean;
  emptyTitle: string;
  emptyDescription: string;
};

export function GovernancePanel({
  title,
  description,
  metrics,
  loading,
  error,
  isEmpty,
  emptyTitle,
  emptyDescription,
}: GovernancePanelProps) {
  return (
    <Card className={surfaceCardClass}>
      <CardHeader className="space-y-2">
        <CardTitle className="text-base text-slate-950 dark:text-slate-50">
          {title}
        </CardTitle>
        <CardDescription className="text-sm leading-6 text-slate-600 dark:text-slate-300">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <GovernanceSkeleton title={title} />
        ) : error ? (
          <DataStateMessage
            title="Unable to load this section"
            description={error}
            tone="danger"
          />
        ) : isEmpty ? (
          <DataStateMessage
            title={emptyTitle}
            description={emptyDescription}
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className={cn("rounded-xl border p-4", toneClass(metric.tone))}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-80">
                  {metric.label}
                </p>
                <p className="mt-3 text-3xl font-semibold tracking-tight">
                  {metric.value}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function GovernanceSkeleton({ title }: { title: string }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={`${title}-skeleton-${index}`}
          className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/60"
        >
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-4 h-8 w-16" />
        </div>
      ))}
    </div>
  );
}

function toneClass(tone?: GovernanceMetric["tone"]) {
  switch (tone) {
    case "good":
      return "border-emerald-200/80 bg-emerald-50/70 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200";
    case "warn":
      return "border-amber-200/80 bg-amber-50/75 text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200";
    case "danger":
      return "border-red-200/80 bg-red-50/75 text-red-800 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200";
    default:
      return "border-slate-200/80 bg-slate-50/80 text-slate-800 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200";
  }
}
