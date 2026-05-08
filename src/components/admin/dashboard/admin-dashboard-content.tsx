"use client";

import { Bell, BookOpen, FileText, ShieldCheck, TrendingUp, Users } from "lucide-react";
import type { AttentionValues, GovernanceValues, OperationalValues } from "@/lib/admin-dashboard/dashboard-values";
import { buildDashboardValues } from "@/lib/admin-dashboard/dashboard-values";
import type { DashboardViewModel } from "@/lib/admin-dashboard/types";
import { formatDelta } from "@/lib/admin-dashboard/utils";
import { AttentionCard, SnapshotCard } from "./dashboard-cards";
import { DashboardCharts } from "./dashboard-charts";
import { DashboardTables } from "./dashboard-tables";
import { GovernancePanel } from "./governance-panel";
import { QuickActionsSection } from "./quick-actions";
export function AdminDashboardContent({
  auditSummary,
  error,
  loading,
  mangaSummary,
  notiStats,
  policySummary,
  recentAuditLogs,
  recentUsers,
  storiesGrowthChartData,
  summary,
  weeklyNewChartData,
}: DashboardViewModel) {
  const values = buildDashboardValues({
    auditSummary,
    loading,
    mangaSummary,
    notiStats,
    policySummary,
    summary,
  });

  return (
    <div className="space-y-8">
      <AttentionSection
        activePolicies={values.activePolicies}
        draftPolicies={values.draftPolicies}
        highRiskAuditLogs={values.highRiskAuditLogs}
        loading={loading}
        pendingAuditApprovals={values.pendingAuditApprovals}
        readNotifications={values.readNotifications}
        totalPolicies={values.totalPolicies}
        unreadNotifications={values.unreadNotifications}
        unseenAuditLogs={values.unseenAuditLogs}
        error={error}
      />

      <OperationalSnapshotSection
        loading={loading}
        mangaSummary={mangaSummary}
        publishedStories={values.publishedStories}
        summary={summary}
        totalStories={values.totalStories}
        totalUsers={values.totalUsers}
        unpublishedStories={values.unpublishedStories}
        error={error}
      />

      <DashboardCharts
        loadingWeekly={loading.weekly}
        weeklyError={error.weekly}
        weeklyData={weeklyNewChartData}
        loadingGrowth={loading.mangaGrowth}
        growthError={error.mangaGrowth}
        growthData={storiesGrowthChartData}
      />

      <GovernanceSnapshotSection
        activePolicies={values.activePolicies}
        archivedPolicies={values.archivedPolicies}
        auditSummary={auditSummary}
        draftPolicies={values.draftPolicies}
        error={error}
        highRiskAuditLogs={values.highRiskAuditLogs}
        loading={loading}
        pendingAuditApprovals={values.pendingAuditApprovals}
        policySummary={policySummary}
        recentAuditLogs={recentAuditLogs}
        totalAuditLogs={values.totalAuditLogs}
        totalPolicies={values.totalPolicies}
        unseenAuditLogs={values.unseenAuditLogs}
      />

      <DashboardTables
        loadingRecent={loading.recent}
        recentError={error.recent}
        recentUsers={recentUsers}
        loadingAudit={loading.audit}
        auditError={error.audit}
        recentAuditLogs={recentAuditLogs}
      />

      <QuickActionsSection />
    </div>
  );
}

function AttentionSection({
  activePolicies,
  draftPolicies,
  error,
  highRiskAuditLogs,
  loading,
  pendingAuditApprovals,
  readNotifications,
  totalPolicies,
  unreadNotifications,
  unseenAuditLogs,
}: AttentionValues & Pick<DashboardViewModel, "error" | "loading">) {
  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
          Needs Attention Now
        </p>
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
            Start with governance, audit visibility, and admin follow-up
          </h2>
          <p className="max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            This dashboard keeps policy upkeep, audit oversight, and notification
            follow-up aligned with what administrators can actually access.
          </p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <AttentionCard
          title="Policy library"
          subtitle="Track the current policy set and review drafts before they go live."
          value={totalPolicies}
          detail={`${activePolicies} active, ${draftPolicies} draft`}
          href="/admin/policies"
          actionLabel="Open policy library"
          icon={FileText}
          tone="info"
          loading={loading.policies}
          error={error.policies}
        />
        <AttentionCard
          title="Audit review"
          subtitle="Keep recent admin-visible activity and compliance follow-up in view."
          value={unseenAuditLogs}
          detail={`${pendingAuditApprovals} pending approval, ${highRiskAuditLogs} high risk`}
          href="/admin/audit-logs"
          actionLabel="Open audit logs"
          icon={ShieldCheck}
          tone="danger"
          loading={loading.audit}
          error={error.audit}
        />
        <AttentionCard
          title="Unread notifications"
          subtitle="Messages and announcements that still need attention."
          value={unreadNotifications}
          detail={`${readNotifications} already marked as read`}
          href="/admin/notifications"
          actionLabel="Open notifications center"
          icon={Bell}
          tone="amber"
          loading={loading.notiStats}
          error={error.notiStats}
        />
      </div>
    </section>
  );
}

function OperationalSnapshotSection({
  error,
  loading,
  mangaSummary,
  publishedStories,
  summary,
  totalStories,
  totalUsers,
  unpublishedStories,
}: OperationalValues &
  Pick<DashboardViewModel, "error" | "loading" | "mangaSummary" | "summary">) {
  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
          Operational Snapshot
        </p>
        <h3 className="text-lg font-semibold tracking-tight text-slate-950 dark:text-slate-50">
          Core totals for people, stories, and publication status
        </h3>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SnapshotCard
          title="Total users"
          value={totalUsers}
          detail={
            loading.summary
              ? "Loading user totals..."
              : `${formatDelta(summary?.deltaPctMoM ?? 0)} from last month`
          }
          icon={Users}
          loading={loading.summary}
          error={error.summary}
        />
        <SnapshotCard
          title="Total stories"
          value={totalStories}
          detail={
            loading.mangaSummary
              ? "Loading story totals..."
              : `${formatDelta(mangaSummary?.deltaPctMoM ?? 0)} from last month`
          }
          icon={BookOpen}
          loading={loading.mangaSummary}
          error={error.mangaSummary}
        />
        <SnapshotCard
          title="Outside publish"
          value={loading.mangaSummary ? "0" : unpublishedStories.toLocaleString()}
          detail={
            loading.mangaSummary
              ? "Loading publication split..."
              : `${publishedStories} already published`
          }
          icon={TrendingUp}
          loading={loading.mangaSummary}
          error={error.mangaSummary}
        />
      </div>
    </section>
  );
}

function GovernanceSnapshotSection({
  activePolicies,
  archivedPolicies,
  auditSummary,
  draftPolicies,
  error,
  highRiskAuditLogs,
  loading,
  pendingAuditApprovals,
  policySummary,
  recentAuditLogs,
  totalAuditLogs,
  totalPolicies,
  unseenAuditLogs,
}: GovernanceValues &
  Pick<
    DashboardViewModel,
    "auditSummary" | "error" | "loading" | "policySummary" | "recentAuditLogs"
  >) {
  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
          Governance Snapshot
        </p>
        <h3 className="text-lg font-semibold tracking-tight text-slate-950 dark:text-slate-50">
          Policy lifecycle and audit log health
        </h3>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <GovernancePanel
          title="Policy lifecycle"
          description="See how many policy records are active, still in draft, or already archived."
          metrics={[
            { label: "Total", value: totalPolicies },
            { label: "Active", value: activePolicies, tone: "good" },
            { label: "Draft", value: draftPolicies, tone: "warn" },
            { label: "Archived", value: archivedPolicies, tone: "danger" },
          ]}
          loading={loading.policies}
          error={error.policies}
          isEmpty={
            !loading.policies && !error.policies && policySummary.total === 0
          }
          emptyTitle="No policies yet"
          emptyDescription="Policy counts will appear here once the policy library has records."
        />
        <GovernancePanel
          title="Audit log health"
          description="Keep admin-visible log volume, unseen entries, and approval follow-up in one place."
          metrics={[
            { label: "Total", value: totalAuditLogs },
            { label: "Unseen", value: unseenAuditLogs, tone: "warn" },
            {
              label: "Pending Approval",
              value: pendingAuditApprovals,
              tone: "warn",
            },
            { label: "High Risk", value: highRiskAuditLogs, tone: "danger" },
          ]}
          loading={loading.audit}
          error={error.audit}
          isEmpty={
            !loading.audit &&
            !error.audit &&
            auditSummary.total === 0 &&
            recentAuditLogs.length === 0
          }
          emptyTitle="No audit activity yet"
          emptyDescription="Recent audit summaries will appear here once audit log data is available."
        />
      </div>
    </section>
  );
}
