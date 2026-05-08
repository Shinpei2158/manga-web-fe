"use client";

import { ArrowLeft, Copy, ShieldAlert, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { AuditLogDetailsController } from "@/hooks/admin-audit-logs/use-audit-log-details";
import { auditDetailSurfaceClass } from "@/lib/admin-audit-logs/constants";
import {
  getApprovalTone,
  getRiskTone,
  getSeenTone,
} from "@/lib/admin-audit-logs/utils";
import { buildHumanMessage, prettyAction, prettyRole } from "@/lib/audit-ui";

export function AuditLogDetailHeader({
  controller: c,
}: {
  controller: AuditLogDetailsController;
}) {
  const log = c.log!;

  return (
    <Card className={`${auditDetailSurfaceClass} bg-gradient-to-br from-white via-white to-amber-50/55`}>
      <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-slate-700">
              Audit review
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span>{prettyAction(log.action)}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={getRiskTone(log.risk ?? "low")}>
              {log.risk === "high" ? (
                <ShieldAlert className="mr-1 h-3.5 w-3.5" />
              ) : (
                <ShieldCheck className="mr-1 h-3.5 w-3.5" />
              )}
              {log.risk ?? "low"}
            </Badge>
            <Badge variant="outline" className={getSeenTone(log.seen)}>
              {log.seen ? "Seen" : "Unseen"}
            </Badge>
            <Badge variant="outline" className={getApprovalTone(log.approval)}>
              {String(log.approval ?? "pending")}
            </Badge>
          </div>

          <p className="max-w-3xl text-sm leading-6 text-slate-700">
            {buildHumanMessage(log)}
          </p>

          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            {c.reportCode !== "--" ? (
              <>
                <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-slate-700">
                  {c.reportCode}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                  onClick={() => c.copyText(c.reportCode)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </>
            ) : null}

            <span className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-slate-600">
              {c.timeText}
            </span>

            {c.canOpenReport ? (
              <Button
                size="sm"
                variant="outline"
                className="rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                onClick={c.openReportWorkspace}
              >
                Open report workspace
              </Button>
            ) : null}
          </div>

          {c.meError ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50/80 px-3 py-2 text-xs leading-5 text-amber-800">
              Role verification is temporarily unavailable. Backend will still
              validate any action you submit.
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-xs leading-5 text-slate-600">
              Reviewing as{" "}
              <b className="font-semibold text-slate-900">
                {prettyRole(c.roleNormalized || "unknown")}
              </b>
              .
            </div>
          )}
        </div>

        <Button
          variant="outline"
          onClick={c.goBack}
          className="gap-2 rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </CardContent>
    </Card>
  );
}

