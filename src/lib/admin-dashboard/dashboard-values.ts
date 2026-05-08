import type { DashboardViewModel } from "./types";

export type DashboardValues = ReturnType<typeof buildDashboardValues>;
export type AttentionValues = Pick<
  DashboardValues,
  | "activePolicies"
  | "draftPolicies"
  | "highRiskAuditLogs"
  | "pendingAuditApprovals"
  | "readNotifications"
  | "totalPolicies"
  | "unreadNotifications"
  | "unseenAuditLogs"
>;
export type OperationalValues = Pick<
  DashboardValues,
  | "publishedStories"
  | "totalStories"
  | "totalUsers"
  | "unpublishedStories"
>;
export type GovernanceValues = Pick<
  DashboardValues,
  | "activePolicies"
  | "archivedPolicies"
  | "draftPolicies"
  | "highRiskAuditLogs"
  | "pendingAuditApprovals"
  | "totalAuditLogs"
  | "totalPolicies"
  | "unseenAuditLogs"
>;

export function buildDashboardValues({
  auditSummary,
  loading,
  mangaSummary,
  notiStats,
  policySummary,
  summary,
}: Pick<
  DashboardViewModel,
  | "auditSummary"
  | "loading"
  | "mangaSummary"
  | "notiStats"
  | "policySummary"
  | "summary"
>) {
  const unpublishedStories = Math.max(
    0,
    (mangaSummary?.total ?? 0) - (mangaSummary?.published ?? 0),
  );

  return {
    activePolicies: loading.policies
      ? "0"
      : policySummary.active.toLocaleString(),
    archivedPolicies: loading.policies
      ? "0"
      : policySummary.archived.toLocaleString(),
    draftPolicies: loading.policies
      ? "0"
      : policySummary.draft.toLocaleString(),
    highRiskAuditLogs: loading.audit
      ? "0"
      : auditSummary.highRisk.toLocaleString(),
    pendingAuditApprovals: loading.audit
      ? "0"
      : auditSummary.pendingApproval.toLocaleString(),
    publishedStories: loading.mangaSummary
      ? "0"
      : (mangaSummary?.published ?? 0).toLocaleString(),
    readNotifications: loading.notiStats
      ? "0"
      : (notiStats?.read ?? 0).toString(),
    totalAuditLogs: loading.audit ? "0" : auditSummary.total.toLocaleString(),
    totalPolicies: loading.policies
      ? "0"
      : policySummary.total.toLocaleString(),
    totalStories: loading.mangaSummary
      ? "0"
      : (mangaSummary?.total ?? 0).toLocaleString(),
    totalUsers: loading.summary ? "0" : (summary?.total ?? 0).toLocaleString(),
    unreadNotifications: loading.notiStats
      ? "0"
      : (notiStats?.unread ?? 0).toString(),
    unseenAuditLogs: loading.audit
      ? "0"
      : auditSummary.unseen.toLocaleString(),
    unpublishedStories,
  };
}
