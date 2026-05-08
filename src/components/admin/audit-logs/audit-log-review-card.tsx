"use client";

import { CheckCircle2, EyeOff, RefreshCcw } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { AuditLogDetailsController } from "@/hooks/admin/audit-logs/use-audit-log-details";
import {
  auditDetailInsetSurfaceClass,
  auditDetailSurfaceClass,
} from "@/lib/admin-audit-logs/constants";
import { prettyRole, resolveAuditActorAvatar } from "@/lib/audit-ui";

export function AuditLogReviewCard({
  controller: c,
}: {
  controller: AuditLogDetailsController;
}) {
  const log = c.log!;

  return (
    <Card className={`${auditDetailSurfaceClass} lg:sticky lg:top-4 lg:self-start`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold text-slate-950">
          Review actions
        </CardTitle>
        <p className="text-sm leading-6 text-slate-500">
          Confirm the actor, add an admin note if needed, then complete the
          review action.
        </p>
      </CardHeader>

      <CardContent className="space-y-5">
        <ActorSummary controller={c} />
        <Separator className="bg-slate-200/80" />

        <div className="space-y-2.5">
          <p className="text-sm font-semibold text-slate-900">Admin note</p>
          <Textarea
            value={c.adminNote}
            onChange={(event) => c.setAdminNote(event.target.value)}
            disabled={c.loading || !c.canEditAdminNote}
            className="min-h-[132px] rounded-xl border-slate-200 bg-white/80 text-sm text-slate-700"
            placeholder={
              !c.canAttemptAdminActions
                ? "Admin only"
                : log?.approval === "approved"
                  ? "This log is already approved."
                  : "Write admin note before approving..."
            }
          />
          <p className="text-xs leading-5 text-slate-500">
            {log?.approval === "approved"
              ? "This note is locked after approval."
              : "This note is submitted together with Approve."}
          </p>
        </div>

        <Separator className="bg-slate-200/80" />

        <div className="space-y-4">
          <div className="space-y-2">
            {!log.seen ? (
              <Button
                variant="outline"
                className="w-full rounded-xl border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800"
                onClick={c.handleMarkSeen}
                disabled={c.loading || !c.canAttemptAdminActions}
                title={!c.canAttemptAdminActions ? "Admin only" : ""}
              >
                <EyeOff className="mr-2 h-4 w-4" />
                Mark seen
              </Button>
            ) : null}

            {log.approval === "pending" ? (
              <Button
                className="w-full rounded-xl bg-slate-900 text-white hover:bg-slate-800"
                onClick={c.handleApprove}
                disabled={c.loading || !c.canAttemptAdminActions}
                title={!c.canAttemptAdminActions ? "Admin only" : ""}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Approve
              </Button>
            ) : null}
          </div>

          <div className="space-y-2 border-t border-slate-200/80 pt-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Utilities
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              onClick={c.fetchLog}
              disabled={c.loading}
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh record
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ActorSummary({
  controller: c,
}: {
  controller: AuditLogDetailsController;
}) {
  return (
    <div className={`${auditDetailInsetSurfaceClass} flex items-center gap-3 p-3`}>
      <Avatar className="h-11 w-11 border border-slate-200">
        <AvatarImage
          src={resolveAuditActorAvatar(c.actor.avatar, c.apiUrl)}
          alt={c.actor.name}
          referrerPolicy="no-referrer"
        />
        <AvatarFallback className="bg-slate-100 text-xs font-semibold text-slate-700">
          {String(c.actor.name)
            .split(" ")
            .filter(Boolean)
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-900">
          {c.actor.name}
        </p>
        <p className="truncate text-xs text-slate-500">{c.actor.email}</p>
        <Badge
          variant="outline"
          className="mt-2 border-slate-200 bg-white text-slate-700"
        >
          {prettyRole(c.actor.role)}
        </Badge>
      </div>
    </div>
  );
}

