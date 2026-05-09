"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { WorkspaceReport } from "@/lib/report-workspace";
import {
  fetchReportStaffRole,
  fetchReportWorkspaceItems,
} from "@/lib/admin-report/api";
import { GROUPS_PER_PAGE, INITIAL_VIEW_STATE } from "@/lib/admin-report/constants";
import type {
  ReportWorkspacePage,
  StaffRole,
  WorkspaceTab,
  WorkspaceViewState,
} from "@/lib/admin-report/types";
import { useReportWorkspaceActions } from "./use-report-workspace-actions";
import { useReportWorkspaceDeepLink } from "./use-report-workspace-deep-link";
import { useReportWorkspaceGroups } from "./use-report-workspace-groups";

export function useReportWorkspaceController() {
  const searchParams = useSearchParams();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const linkedReportId = searchParams.get("reportId")?.trim() || "";
  const linkedReportCode = searchParams.get("reportCode")?.trim() || "";
  const linkedTab = searchParams.get("tab")?.trim().toLowerCase() || "";

  const [role, setRole] = useState<StaffRole>(null);
  const [roleError, setRoleError] = useState<string | null>(null);
  const [reports, setReports] = useState<WorkspaceReport[]>([]);
  const [reportPage, setReportPage] = useState<ReportWorkspacePage>({
    limit: GROUPS_PER_PAGE,
    page: 1,
    total: 0,
    totalPages: 1,
  });
  const [loadingReports, setLoadingReports] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("content");
  const [views, setViews] = useState<Record<WorkspaceTab, WorkspaceViewState>>({
    content: { ...INITIAL_VIEW_STATE },
    community: { ...INITIAL_VIEW_STATE },
  });

  const patchView = useCallback(
    (tab: WorkspaceTab, patch: Partial<WorkspaceViewState>) => {
      setViews((previous) => ({
        ...previous,
        [tab]: {
          ...previous[tab],
          ...patch,
        },
      }));
    },
    [],
  );

  const fetchRole = useCallback(async () => {
    const response = await fetchReportStaffRole(apiUrl);
    setRole(response.role);
    setRoleError(response.error);
  }, [apiUrl]);

  const activePage = views[activeTab].currentPage;
  const activeSearchTerm = views[activeTab].searchTerm;
  const activeStatusFilter = views[activeTab].statusFilter;

  const fetchReports = useCallback(async () => {
    setLoadingReports(true);
    setListError(null);

    const response = await fetchReportWorkspaceItems(apiUrl, {
      limit: GROUPS_PER_PAGE,
      page: activePage,
      searchTerm: activeSearchTerm,
      statusFilter: activeStatusFilter,
      tab: activeTab,
    });

    setReports(response.items);
    setReportPage({
      limit: response.limit,
      page: response.page,
      total: response.total,
      totalPages: response.totalPages,
    });
    setListError(response.error);
    setLoadingReports(false);
  }, [
    activeTab,
    activePage,
    activeSearchTerm,
    activeStatusFilter,
    apiUrl,
  ]);

  useEffect(() => {
    void fetchRole();
    void fetchReports();
  }, [fetchReports, fetchRole]);

  const availableTabs = useMemo<WorkspaceTab[]>(() => {
    if (role === "content_moderator") return ["content"];
    if (role === "community_manager") return ["community"];
    return ["content", "community"];
  }, [role]);

  useEffect(() => {
    if (!availableTabs.includes(activeTab)) {
      setActiveTab(availableTabs[0] || "content");
    }
  }, [activeTab, availableTabs]);

  const groups = useReportWorkspaceGroups({
    activeTab,
    patchView,
    reports,
    reportPage,
    views,
  });

  useReportWorkspaceDeepLink({
    availableTabs,
    communityGroups: groups.communityGroups,
    contentGroups: groups.contentGroups,
    linkedReportCode,
    linkedReportId,
    linkedTab,
    loadingReports,
    patchView,
    reports,
    setActiveTab,
  });

  const actions = useReportWorkspaceActions({
    apiUrl,
    patchView,
    reports,
    setBusyKey,
    setReports,
  });

  const handleTabChange = (nextTab: WorkspaceTab) => {
    setActiveTab(nextTab);
    setViews((previous) => ({
      content: {
        ...previous.content,
        confirmGroupKey: null,
        focusReportId: null,
        isModalOpen: false,
      },
      community: {
        ...previous.community,
        confirmGroupKey: null,
        focusReportId: null,
        isModalOpen: false,
      },
    }));
  };

  return {
    ...groups,
    ...actions,
    activeTab,
    apiUrl,
    availableTabs,
    busyKey,
    fetchReports,
    handleTabChange,
    listError,
    loadingReports,
    patchView,
    reports,
    roleError,
    views,
  };
}

export type ReportWorkspaceController = ReturnType<
  typeof useReportWorkspaceController
>;
