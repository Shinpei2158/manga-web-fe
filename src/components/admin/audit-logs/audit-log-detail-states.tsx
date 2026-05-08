"use client";

import { AlertTriangle, ArrowLeft, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { AuditLogDetailsController } from "@/hooks/admin/audit-logs/use-audit-log-details";
import { auditDetailSurfaceClass } from "@/lib/admin-audit-logs/constants";

export function AuditLogDetailSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-2 py-2">
      <Skeleton className="h-32 rounded-2xl" />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Skeleton className="h-[560px] rounded-2xl" />
        <Skeleton className="h-[560px] rounded-2xl" />
      </div>
    </div>
  );
}

export function AuditLogDetailError({
  controller: c,
}: {
  controller: AuditLogDetailsController;
}) {
  return (
    <div className="mx-auto max-w-3xl px-2 py-2">
      <Card className={auditDetailSurfaceClass}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-rose-700">
            <AlertTriangle className="h-5 w-5" />
            Cannot load audit log
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-slate-600">{String(c.error)}</p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              onClick={c.goBack}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button
              className="rounded-xl bg-slate-900 text-white hover:bg-slate-800"
              onClick={c.fetchLog}
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

