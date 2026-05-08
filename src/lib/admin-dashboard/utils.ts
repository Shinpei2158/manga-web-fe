import { buildHumanMessage, prettyAction } from "@/lib/audit-ui";
import type {
  AuditLogApiRow,
  PolicyDashboardSummary,
  PolicyRecord,
  RecentAuditItem,
} from "./types";

export function formatMonthTick(value: string) {
  if (!value) return "Unknown";
  const parsed = /^\d{4}-\d{2}$/.test(value) ? `${value}-01T00:00:00` : value;
  const date = new Date(parsed);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", { month: "short" }).format(date);
}

export function formatReadableDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatReadableDateTime(value?: string) {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function formatDelta(value: number) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

export function formatRoleLabel(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export function clipText(value: string, limit = 120) {
  const safeValue = String(value || "").trim();
  if (!safeValue) return "-";
  return safeValue.length > limit
    ? `${safeValue.slice(0, limit - 1).trimEnd()}...`
    : safeValue;
}

export function roleBadgeClass(role: string) {
  const normalized = role.toLowerCase();

  if (normalized === "admin") {
    return "border-slate-300 bg-slate-100 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100";
  }

  if (normalized === "author") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200";
  }

  if (normalized.includes("moderator") || normalized.includes("manager")) {
    return "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-200";
  }

  return "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200";
}

export function summarizePolicies(
  policies: PolicyRecord[],
): PolicyDashboardSummary {
  return policies.reduce<PolicyDashboardSummary>(
    (accumulator, policy) => {
      accumulator.total += 1;
      if (policy.status === "Active") accumulator.active += 1;
      if (policy.status === "Draft") accumulator.draft += 1;
      if (policy.status === "Archived") accumulator.archived += 1;
      return accumulator;
    },
    { total: 0, active: 0, draft: 0, archived: 0 },
  );
}

export function mapRecentAuditRows(rows: AuditLogApiRow[]) {
  return rows.map<RecentAuditItem>((row, index) => ({
    id: String(row._id || row.id || `audit-row-${index}`),
    time: formatReadableDateTime(row.createdAt),
    actorName:
      row.actor_id?.username || row.actor_name || row.actor_email || "System",
    actorRole: String(row.actor_role || row.actor_id?.role || "system"),
    actionLabel: prettyAction(row.action),
    summary: clipText(buildHumanMessage(row)),
  }));
}
