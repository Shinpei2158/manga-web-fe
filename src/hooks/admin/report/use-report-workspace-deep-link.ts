"use client";

import { useEffect, useRef } from "react";
import {
  findCommunityReportLocation,
  findReportLocation,
  isCommunityReport,
  type CommunityReportAgainstGroup,
  type ReportAgainstGroup,
  type WorkspaceReport,
} from "@/lib/report-workspace";
import { GROUPS_PER_PAGE } from "@/lib/admin-report/constants";
import type { WorkspaceTab, WorkspaceViewState } from "@/lib/admin-report/types";

export function useReportWorkspaceDeepLink({
  availableTabs,
  communityGroups,
  contentGroups,
  linkedReportCode,
  linkedReportId,
  linkedTab,
  loadingReports,
  patchView,
  reports,
  setActiveTab,
}: {
  availableTabs: WorkspaceTab[];
  communityGroups: CommunityReportAgainstGroup[];
  contentGroups: ReportAgainstGroup[];
  linkedReportCode: string;
  linkedReportId: string;
  linkedTab: string;
  loadingReports: boolean;
  patchView: (tab: WorkspaceTab, patch: Partial<WorkspaceViewState>) => void;
  reports: WorkspaceReport[];
  setActiveTab: (tab: WorkspaceTab) => void;
}) {
  const deepLinkHandledRef = useRef(false);

  useEffect(() => {
    if (!linkedReportId && !linkedReportCode && !linkedTab) return;
    deepLinkHandledRef.current = false;
  }, [linkedReportCode, linkedReportId, linkedTab]);

  useEffect(() => {
    if (!linkedTab) return;
    if (linkedReportId || linkedReportCode) return;

    const requestedTab =
      linkedTab === "community"
        ? "community"
        : linkedTab === "content"
          ? "content"
          : null;

    if (requestedTab && availableTabs.includes(requestedTab)) {
      setActiveTab(requestedTab);
    }
  }, [availableTabs, linkedReportCode, linkedReportId, linkedTab, setActiveTab]);

  useEffect(() => {
    if (loadingReports || deepLinkHandledRef.current) return;
    if (!linkedReportId && !linkedReportCode) return;

    const targetReport = reports.find((report) => {
      if (linkedReportId && report._id === linkedReportId) return true;
      return (
        linkedReportCode &&
        String(report.reportCode || "").toLowerCase() ===
          linkedReportCode.toLowerCase()
      );
    });

    if (!targetReport) return;

    const targetTab: WorkspaceTab = isCommunityReport(targetReport)
      ? "community"
      : "content";

    if (!availableTabs.includes(targetTab)) return;

    const groups = targetTab === "content" ? contentGroups : communityGroups;
    if (!groups.length) return;

    const location =
      targetTab === "content"
        ? findReportLocation(contentGroups, targetReport._id)
        : findCommunityReportLocation(communityGroups, targetReport._id);

    if (!location) return;

    deepLinkHandledRef.current = true;
    setActiveTab(targetTab);

    const groupIndex = groups.findIndex(
      (group) => group.key === location.groupKey,
    );

    patchView(targetTab, {
      confirmGroupKey: null,
      currentPage:
        groupIndex >= 0 ? Math.floor(groupIndex / GROUPS_PER_PAGE) + 1 : 1,
      focusReportId: targetReport._id,
      isModalOpen: true,
      selectedGroupKey: location.groupKey,
    });
  }, [
    availableTabs,
    communityGroups,
    contentGroups,
    linkedReportCode,
    linkedReportId,
    loadingReports,
    patchView,
    reports,
    setActiveTab,
  ]);
}
