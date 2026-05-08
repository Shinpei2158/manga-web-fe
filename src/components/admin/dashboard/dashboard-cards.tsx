"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import type { AttentionCardProps, SnapshotCardProps } from "@/lib/admin-dashboard/types";

export function AttentionCard({
  title,
  subtitle,
  value,
  detail,
  href,
  actionLabel,
  icon: Icon,
  tone,
  loading,
  error,
}: AttentionCardProps) {
  const toneStyles = {
    danger: {
      card:
        "border-red-200/80 bg-red-50/75 dark:border-red-900/50 dark:bg-red-950/20",
      icon:
        "border-red-200/80 bg-white text-red-500 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-300",
      label: "text-red-600 dark:text-red-300",
    },
    info: {
      card:
        "border-blue-200/80 bg-blue-50/70 dark:border-blue-900/50 dark:bg-blue-950/20",
      icon:
        "border-blue-200/80 bg-white text-blue-500 dark:border-blue-900/50 dark:bg-blue-950/50 dark:text-blue-300",
      label: "text-blue-600 dark:text-blue-300",
    },
    amber: {
      card:
        "border-amber-200/80 bg-amber-50/75 dark:border-amber-900/50 dark:bg-amber-950/20",
      icon:
        "border-amber-200/80 bg-white text-amber-500 dark:border-amber-900/50 dark:bg-amber-950/50 dark:text-amber-300",
      label: "text-amber-700 dark:text-amber-300",
    },
  }[tone];

  return (
    <Card className={cn(surfaceCardClass, toneStyles.card)}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-base text-slate-950 dark:text-slate-50">
              {title}
            </CardTitle>
            <CardDescription className="text-sm leading-6 text-slate-600 dark:text-slate-300">
              {subtitle}
            </CardDescription>
          </div>

          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border",
              toneStyles.icon,
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-4 w-40" />
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200/80 bg-white/70 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-slate-950/40 dark:text-red-200">
            Unable to load this panel right now.
          </div>
        ) : (
          <div className="space-y-1">
            <div className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
              {value}
            </div>
            <p className={cn("text-sm font-medium", toneStyles.label)}>
              {detail}
            </p>
          </div>
        )}

        <Button
          asChild
          variant="outline"
          className="h-10 w-full justify-between rounded-xl border-white/70 bg-white/75 px-3 text-slate-900 hover:bg-white dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-100 dark:hover:bg-slate-950/80"
        >
          <Link href={href}>
            {actionLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export function SnapshotCard({
  title,
  value,
  detail,
  icon: Icon,
  loading,
  error,
}: SnapshotCardProps) {
  return (
    <Card className={surfaceCardClass}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div>
          <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-200">
            {title}
          </CardTitle>
          <CardDescription className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
            Snapshot for the current dashboard context
          </CardDescription>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-4 w-36" />
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200/80 bg-red-50/80 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-200">
            Unable to load this metric.
          </div>
        ) : (
          <>
            <div className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
              {value}
            </div>
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
              {detail}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
