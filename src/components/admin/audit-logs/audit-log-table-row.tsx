"use client";

import { AlertTriangle, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { AuditLogsController } from "@/hooks/admin/audit-logs/use-audit-logs-controller";
import type { AuditLogUI } from "@/lib/admin-audit-logs/types";
import {
  getActionTone,
  getRiskTone,
  getRoleColor,
} from "@/lib/admin-audit-logs/utils";
import {
  prettyAction,
  prettyRole,
  resolveAuditActorAvatar,
} from "@/lib/audit-ui";

export function AuditTableRow({
  controller: c,
  log,
}: {
  controller: AuditLogsController;
  log: AuditLogUI;
}) {
  return (
    <TableRow
      className={`transition-colors hover:bg-slate-50/70 ${
        !log.seen ? "bg-blue-50/40" : ""
      } ${log.risk === "high" ? "border-l-4 border-l-rose-500" : ""}`}
    >
      <TableCell className="whitespace-nowrap text-xs text-slate-500">
        {log.time}
      </TableCell>
      <TableCell className="min-w-[280px]">
        <AuditActorCell apiUrl={c.apiUrl} log={log} />
      </TableCell>
      <TableCell>
        <Badge
          variant="outline"
          className={`pointer-events-none text-xs ${getActionTone(log.action)}`}
        >
          {prettyAction(log.action)}
        </Badge>
      </TableCell>
      <TableCell className="max-w-xs text-xs text-slate-600">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="block truncate">{log.summary}</span>
            </TooltipTrigger>
            <TooltipContent>{log.summary}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className={`text-xs ${getRiskTone(log.risk)}`}>
          {log.risk === "high" ? <AlertTriangle className="mr-1 h-3 w-3" /> : null}
          {log.risk}
        </Badge>
      </TableCell>
      <TableCell>
        {!log.seen ? (
          <Badge
            variant="outline"
            className="border border-orange-200 bg-orange-50 text-orange-700"
          >
            NEW
          </Badge>
        ) : (
          <span className="text-xs text-slate-500">Seen</span>
        )}
      </TableCell>
      <TableCell>
        <Badge
          variant="outline"
          className={`text-xs ${
            log.approval === "approved"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border border-amber-200 bg-amber-50 text-amber-700"
          }`}
        >
          {log.approval}
        </Badge>
      </TableCell>
      <TableCell className="text-center">
        <AuditRowActions controller={c} log={log} />
      </TableCell>
    </TableRow>
  );
}

function AuditActorCell({
  apiUrl,
  log,
}: {
  apiUrl?: string;
  log: AuditLogUI;
}) {
  return (
    <div className="flex items-start gap-3">
      <Avatar className="h-10 w-10 border border-slate-200">
        <AvatarImage
          src={resolveAuditActorAvatar(log.actor.avatar, apiUrl)}
          alt={log.actor.name}
          referrerPolicy="no-referrer"
        />
        <AvatarFallback className="bg-slate-100 text-[11px] font-semibold text-slate-700">
          {log.actor.name
            .split(" ")
            .filter(Boolean)
            .map((namePart) => namePart[0])
            .join("")}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0">
        <p className="truncate font-medium text-slate-900">{log.actor.name}</p>
        <p className="truncate text-sm text-slate-500">{log.actor.email}</p>
        <Badge
          variant="secondary"
          className={`mt-1.5 border ${getRoleColor(log.actor.role)}`}
        >
          {prettyRole(log.actor.role)}
        </Badge>
      </div>
    </div>
  );
}

function AuditRowActions({
  controller: c,
  log,
}: {
  controller: AuditLogsController;
  log: AuditLogUI;
}) {
  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        size="sm"
        variant="outline"
        className="rounded-xl border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 hover:text-sky-800"
        onClick={() => c.openLogDetails(log.id)}
        title="Open details"
      >
        <Eye className="h-4 w-4" />
      </Button>

      {!log.seen ? (
        <Button
          size="sm"
          variant="outline"
          className="rounded-xl border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800"
          onClick={() => c.handleMarkSeen(log.id)}
          disabled={c.loading || !c.canAttemptAdminActions}
          title={!c.canAttemptAdminActions ? "Admin only" : "Mark as seen"}
        >
          <EyeOff className="h-4 w-4" />
        </Button>
      ) : null}

      {log.approval === "pending" ? (
        <Button
          size="sm"
          variant="outline"
          className="rounded-xl border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800"
          onClick={() => c.handleApprove(log.id)}
          disabled={c.loading || !c.canAttemptAdminActions}
          title={!c.canAttemptAdminActions ? "Admin only" : "Approve record"}
        >
          <CheckCircle2 className="h-4 w-4" />
        </Button>
      ) : null}
    </div>
  );
}

