"use client";

import { CheckCircle2, Eye, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  formatReportDateTime,
  getInitial,
  resolveAvatarUrl,
  type CommunityReportAgainstGroup,
  type ReportAgainstGroup,
} from "@/lib/report-workspace";
import { getReportGroupStatusMeta } from "@/lib/admin-report/utils";

function ReportAgainstCell({
  avatar,
  email,
  name,
}: {
  avatar?: string;
  email?: string | null;
  name: string;
}) {
  return (
    <TableCell>
      <div className="flex items-start gap-3">
        <Avatar className="h-11 w-11 border border-slate-200">
          <AvatarImage src={avatar} alt={name} referrerPolicy="no-referrer" />
          <AvatarFallback>{getInitial(name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <div className="font-semibold text-slate-900">{name}</div>
          <div className="truncate text-xs text-slate-500">
            {email || "No email"}
          </div>
        </div>
      </div>
    </TableCell>
  );
}

function ActionCell({
  busy,
  disabled,
  onDone,
  onView,
}: {
  busy: boolean;
  disabled: boolean;
  onDone: () => void;
  onView: () => void;
}) {
  return (
    <TableCell>
      <div className="mx-auto grid w-[190px] grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-9 rounded-xl border-sky-200 bg-sky-50 text-sky-700 hover:border-sky-300 hover:bg-sky-100 hover:text-sky-800"
          onClick={onView}
        >
          <Eye className="h-4 w-4" />
          View
        </Button>
        <Button
          variant="success"
          size="sm"
          className="h-9 rounded-xl"
          disabled={busy || disabled}
          onClick={onDone}
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle2 className="h-4 w-4" />
          )}
          Done
        </Button>
      </div>
    </TableCell>
  );
}

export function ContentReportGroupRow({
  apiUrl,
  busy,
  group,
  isActive,
  onDone,
  onView,
}: {
  apiUrl?: string;
  busy: boolean;
  group: ReportAgainstGroup;
  isActive: boolean;
  onDone: () => void;
  onView: () => void;
}) {
  const statusMeta = getReportGroupStatusMeta(group);

  return (
    <TableRow key={group.key} className={isActive ? "bg-sky-50/60" : undefined}>
      <ReportAgainstCell
        avatar={resolveAvatarUrl(group.meta.avatar, apiUrl)}
        email={group.meta.email}
        name={group.meta.name}
      />
      <TableCell>
        <Badge variant="secondary" className={`border ${statusMeta.className}`}>
          {statusMeta.label}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <div className="font-semibold text-slate-900">{group.mangaCount}</div>
          <div className="text-xs text-slate-500">
            manga currently in this queue
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <div className="font-semibold text-slate-900">
            {group.doneCount}/{group.totalCount}
          </div>
          <div className="text-xs text-slate-500">grouped cases done</div>
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm text-slate-700">
          {formatReportDateTime(group.latestActivityAt)}
        </div>
      </TableCell>
      <ActionCell
        busy={busy}
        disabled={group.doneCount === group.totalCount}
        onDone={onDone}
        onView={onView}
      />
    </TableRow>
  );
}

export function CommunityReportGroupRow({
  apiUrl,
  busy,
  group,
  isActive,
  onDone,
  onView,
}: {
  apiUrl?: string;
  busy: boolean;
  group: CommunityReportAgainstGroup;
  isActive: boolean;
  onDone: () => void;
  onView: () => void;
}) {
  const statusMeta = getReportGroupStatusMeta(group);

  return (
    <TableRow key={group.key} className={isActive ? "bg-sky-50/60" : undefined}>
      <ReportAgainstCell
        avatar={resolveAvatarUrl(group.meta.avatar, apiUrl)}
        email={group.meta.email}
        name={group.meta.name}
      />
      <TableCell>
        <Badge variant="secondary" className={`border ${statusMeta.className}`}>
          {statusMeta.label}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <div className="font-semibold text-slate-900">{group.targetCount}</div>
          <div className="text-xs text-slate-500">
            {group.commentCount} comments, {group.replyCount} replies
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <div className="font-semibold text-slate-900">
            {group.doneCount}/{group.totalCount}
          </div>
          <div className="text-xs text-slate-500">grouped cases done</div>
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm text-slate-700">
          {formatReportDateTime(group.latestActivityAt)}
        </div>
      </TableCell>
      <ActionCell
        busy={busy}
        disabled={group.doneCount === group.totalCount}
        onDone={onDone}
        onView={onView}
      />
    </TableRow>
  );
}
