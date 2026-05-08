"use client";

import { getPageNumbers } from "@/lib/report-workspace";
import type { ReportWorkspaceController } from "@/hooks/admin/report/use-report-workspace-controller";
import { ReportQueueCard } from "./report-queue-card";
import { ReportStatsCards } from "./report-stats-cards";
import { ReportWorkspaceDialogs } from "./report-workspace-dialogs";
import { ReportWorkspaceHeader } from "./report-workspace-header";

export function ReportWorkspaceView({
  controller,
}: {
  controller: ReportWorkspaceController;
}) {
  const pageNumbers = getPageNumbers(
    controller.totalPages,
    controller.currentView.currentPage,
  );

  return (
    <div className="space-y-6">
      <ReportWorkspaceHeader
        activeTab={controller.activeTab}
        availableTabs={controller.availableTabs}
        communityCount={controller.communityGroups.length}
        contentCount={controller.contentGroups.length}
        roleError={controller.roleError}
        onTabChange={controller.handleTabChange}
      />

      <ReportStatsCards
        activeTab={controller.activeTab}
        stats={controller.currentStats}
      />

      <ReportQueueCard controller={controller} pageNumbers={pageNumbers} />
      <ReportWorkspaceDialogs controller={controller} />
    </div>
  );
}
