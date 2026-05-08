"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { prettyRole } from "@/lib/audit-ui";
import { cn } from "@/lib/utils";
import { surfaceCardClass } from "@/lib/admin-dashboard/constants";
import type { RecentAuditItem, RecentUserRow } from "@/lib/admin-dashboard/types";
import {
  clipText,
  formatReadableDate,
  formatRoleLabel,
  roleBadgeClass,
} from "@/lib/admin-dashboard/utils";
import { TableStateRow } from "./data-state";

type DashboardTablesProps = {
  loadingRecent: boolean;
  recentError?: string;
  recentUsers: RecentUserRow[];
  loadingAudit: boolean;
  auditError?: string;
  recentAuditLogs: RecentAuditItem[];
};

export function DashboardTables({
  loadingRecent,
  recentError,
  recentUsers,
  loadingAudit,
  auditError,
  recentAuditLogs,
}: DashboardTablesProps) {
  return (
    <section className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
      <RecentUsersTable
        error={recentError}
        loading={loadingRecent}
        recentUsers={recentUsers}
      />
      <RecentAuditTable
        auditLogs={recentAuditLogs}
        error={auditError}
        loading={loadingAudit}
      />
    </section>
  );
}

function RecentUsersTable({
  error,
  loading,
  recentUsers,
}: {
  error?: string;
  loading: boolean;
  recentUsers: RecentUserRow[];
}) {
  return (
    <Card className={surfaceCardClass}>
      <TableCardHeader
        description="The latest five accounts created on the platform."
        href="/admin/user"
        title="Recently registered users"
        viewLabel="View all users"
      />
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Join date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && <RecentUserSkeletonRows />}

            {!loading && error && (
              <TableStateRow
                colSpan={4}
                title="Unable to load recent users"
                description={error}
                tone="danger"
              />
            )}

            {!loading && !error && recentUsers.length === 0 && (
              <TableStateRow
                colSpan={4}
                title="No recent users yet"
                description="Newly created accounts will appear here once the API returns results."
              />
            )}

            {!loading &&
              !error &&
              recentUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium text-slate-900 dark:text-slate-100">
                    {user.name}
                  </TableCell>
                  <TableCell className="text-sm text-slate-600 dark:text-slate-300">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <RoleBadge role={user.role} label={formatRoleLabel(user.role)} />
                  </TableCell>
                  <TableCell className="text-sm text-slate-600 dark:text-slate-300">
                    {formatReadableDate(user.joinDate)}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function RecentAuditTable({
  auditLogs,
  error,
  loading,
}: {
  auditLogs: RecentAuditItem[];
  error?: string;
  loading: boolean;
}) {
  return (
    <Card className={surfaceCardClass}>
      <TableCardHeader
        description="The latest admin-visible audit entries captured by the compliance trail."
        href="/admin/audit-logs"
        title="Recent audit activity"
        viewLabel="View audit logs"
      />
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Summary</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && <RecentAuditSkeletonRows />}

            {!loading && error && (
              <TableStateRow
                colSpan={4}
                title="Unable to load recent audit activity"
                description={error}
                tone="danger"
              />
            )}

            {!loading && !error && auditLogs.length === 0 && (
              <TableStateRow
                colSpan={4}
                title="No audit activity yet"
                description="Recent audit entries will appear here once audit log data is available."
              />
            )}

            {!loading &&
              !error &&
              auditLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-sm text-slate-600 dark:text-slate-300">
                    {log.time}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {log.actorName}
                      </p>
                      <RoleBadge role={log.actorRole} label={prettyRole(log.actorRole)} />
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {clipText(log.actionLabel, 40)}
                  </TableCell>
                  <TableCell className="text-sm text-slate-600 dark:text-slate-300">
                    {log.summary}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function TableCardHeader({
  description,
  href,
  title,
  viewLabel,
}: {
  description: string;
  href: string;
  title: string;
  viewLabel: string;
}) {
  return (
    <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-2">
        <CardTitle className="text-base text-slate-950 dark:text-slate-50">
          {title}
        </CardTitle>
        <CardDescription className="text-sm leading-6 text-slate-600 dark:text-slate-300">
          {description}
        </CardDescription>
      </div>
      <Button asChild variant="outline" size="sm" className="rounded-xl">
        <Link href={href}>
          <Eye className="mr-2 h-4 w-4" />
          {viewLabel}
        </Link>
      </Button>
    </CardHeader>
  );
}

function RoleBadge({ label, role }: { label: string; role: string }) {
  return (
    <Badge
      className={cn(
        "rounded-full border px-2.5 py-1 text-[11px] font-medium",
        roleBadgeClass(role),
      )}
    >
      {label}
    </Badge>
  );
}

function RecentUserSkeletonRows() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <TableRow key={`recent-skeleton-${index}`}>
          <TableCell>
            <Skeleton className="h-4 w-28 rounded-md" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-40 rounded-md" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-24 rounded-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-24 rounded-md" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

function RecentAuditSkeletonRows() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <TableRow key={`audit-skeleton-${index}`}>
          <TableCell>
            <Skeleton className="h-4 w-20 rounded-md" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-24 rounded-md" />
            <Skeleton className="mt-2 h-6 w-20 rounded-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-28 rounded-md" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-full rounded-md" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
