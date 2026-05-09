"use client";

import { useEffect, useMemo } from "react";
import {
  buildContentReportGroups,
  buildCommunityReportGroups,
  isCommunityReport,
  isContentReport,
  type WorkspaceReport,
} from "@/lib/report-workspace";
import type {
  ReportWorkspacePage,
  WorkspaceTab,
  WorkspaceViewState,
} from "@/lib/admin-report/types";

export function useReportWorkspaceGroups({
  activeTab,
  patchView,
  reportPage,
  reports,
  views,
}: {
  activeTab: WorkspaceTab;
  patchView: (tab: WorkspaceTab, patch: Partial<WorkspaceViewState>) => void;
  reportPage: ReportWorkspacePage;
  reports: WorkspaceReport[];
  views: Record<WorkspaceTab, WorkspaceViewState>;
}) {
  const contentReports = useMemo(
    () => reports.filter((report) => isContentReport(report)),
    [reports],
  );
  const communityReports = useMemo(
    () => reports.filter((report) => isCommunityReport(report)),
    [reports],
  );
  const contentGroups = useMemo(
    () => buildContentReportGroups(contentReports),
    [contentReports],
  );
  const communityGroups = useMemo(
    () => buildCommunityReportGroups(communityReports),
    [communityReports],
  );

  const filteredContentGroups = contentGroups;
  const filteredCommunityGroups = communityGroups;

  const contentSelectedGroup =
    views.content.selectedGroupKey
      ? contentGroups.find((group) => group.key === views.content.selectedGroupKey) ||
        null
      : null;
  const communitySelectedGroup =
    views.community.selectedGroupKey
      ? communityGroups.find(
          (group) => group.key === views.community.selectedGroupKey,
        ) || null
      : null;
  const contentConfirmGroup =
    views.content.confirmGroupKey
      ? contentGroups.find((group) => group.key === views.content.confirmGroupKey) ||
        null
      : null;
  const communityConfirmGroup =
    views.community.confirmGroupKey
      ? communityGroups.find(
          (group) => group.key === views.community.confirmGroupKey,
        ) || null
      : null;

  useEffect(() => {
    if (!views.content.selectedGroupKey) return;
    if (contentGroups.some((group) => group.key === views.content.selectedGroupKey)) {
      return;
    }
    patchView("content", {
      focusReportId: null,
      isModalOpen: false,
      selectedGroupKey: null,
    });
  }, [contentGroups, patchView, views.content.selectedGroupKey]);

  useEffect(() => {
    if (!views.community.selectedGroupKey) return;
    if (
      communityGroups.some((group) => group.key === views.community.selectedGroupKey)
    ) {
      return;
    }
    patchView("community", {
      focusReportId: null,
      isModalOpen: false,
      selectedGroupKey: null,
    });
  }, [communityGroups, patchView, views.community.selectedGroupKey]);

  useEffect(() => {
    if (activeTab !== "content") return;
    if (views.content.currentPage > reportPage.totalPages) {
      patchView("content", { currentPage: reportPage.totalPages });
    }
  }, [
    activeTab,
    patchView,
    reportPage.totalPages,
    views.content.currentPage,
  ]);

  useEffect(() => {
    if (activeTab !== "community") return;
    if (views.community.currentPage > reportPage.totalPages) {
      patchView("community", { currentPage: reportPage.totalPages });
    }
  }, [
    activeTab,
    patchView,
    reportPage.totalPages,
    views.community.currentPage,
  ]);

  const currentView = views[activeTab];
  const currentGroups =
    activeTab === "content" ? filteredContentGroups : filteredCommunityGroups;
  const totalPages = reportPage.totalPages;
  const currentPageGroups = currentGroups;
  const sourceGroups = activeTab === "content" ? contentGroups : communityGroups;
  const totalMergedCases = sourceGroups.reduce(
    (total, group) => total + group.totalCount,
    0,
  );
  const doneMergedCases = sourceGroups.reduce(
    (total, group) => total + group.doneCount,
    0,
  );

  return {
    activeConfirmGroup:
      activeTab === "content" ? contentConfirmGroup : communityConfirmGroup,
    communityGroups,
    communitySelectedGroup,
    contentGroups,
    contentSelectedGroup,
    currentGroups,
    currentPageTotalItems: reportPage.total,
    currentPageGroups,
    currentStats: {
      doneMergedCases,
      openMergedCases: totalMergedCases - doneMergedCases,
      reportAgainstCount: sourceGroups.length,
      totalMergedCases,
    },
    currentView,
    filteredCommunityGroups,
    filteredContentGroups,
    totalPages,
  };
}
