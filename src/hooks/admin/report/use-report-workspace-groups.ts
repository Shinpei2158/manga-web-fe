"use client";

import { useEffect, useMemo } from "react";
import {
  buildContentReportGroups,
  buildCommunityReportGroups,
  isCommunityReport,
  isContentReport,
  type WorkspaceReport,
} from "@/lib/report-workspace";
import { GROUPS_PER_PAGE } from "@/lib/admin-report/constants";
import type { WorkspaceTab, WorkspaceViewState } from "@/lib/admin-report/types";

export function useReportWorkspaceGroups({
  activeTab,
  patchView,
  reports,
  views,
}: {
  activeTab: WorkspaceTab;
  patchView: (tab: WorkspaceTab, patch: Partial<WorkspaceViewState>) => void;
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

  const filteredContentGroups = useMemo(() => {
    const normalizedTerm = views.content.searchTerm.trim().toLowerCase();

    return contentGroups.filter((group) => {
      const matchesSearch =
        !normalizedTerm ||
        group.meta.name.toLowerCase().includes(normalizedTerm) ||
        String(group.meta.email || "").toLowerCase().includes(normalizedTerm) ||
        group.mangaBuckets.some((manga) =>
          manga.mangaTitle.toLowerCase().includes(normalizedTerm),
        );
      const matchesStatus =
        views.content.statusFilter === "all"
          ? true
          : views.content.statusFilter === "done"
            ? group.doneCount === group.totalCount && group.totalCount > 0
            : group.doneCount < group.totalCount;

      return matchesSearch && matchesStatus;
    });
  }, [contentGroups, views.content.searchTerm, views.content.statusFilter]);

  const filteredCommunityGroups = useMemo(() => {
    const normalizedTerm = views.community.searchTerm.trim().toLowerCase();

    return communityGroups.filter((group) => {
      const matchesSearch =
        !normalizedTerm ||
        group.meta.name.toLowerCase().includes(normalizedTerm) ||
        String(group.meta.email || "").toLowerCase().includes(normalizedTerm) ||
        group.sections.some((section) =>
          section.targetBuckets.some(
            (target) =>
              target.label.toLowerCase().includes(normalizedTerm) ||
              target.excerpt.toLowerCase().includes(normalizedTerm),
          ),
        );
      const matchesStatus =
        views.community.statusFilter === "all"
          ? true
          : views.community.statusFilter === "done"
            ? group.doneCount === group.totalCount && group.totalCount > 0
            : group.doneCount < group.totalCount;

      return matchesSearch && matchesStatus;
    });
  }, [communityGroups, views.community.searchTerm, views.community.statusFilter]);

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
    const totalPages = Math.max(
      1,
      Math.ceil(filteredContentGroups.length / GROUPS_PER_PAGE),
    );
    if (views.content.currentPage > totalPages) {
      patchView("content", { currentPage: totalPages });
    }
  }, [filteredContentGroups.length, patchView, views.content.currentPage]);

  useEffect(() => {
    const totalPages = Math.max(
      1,
      Math.ceil(filteredCommunityGroups.length / GROUPS_PER_PAGE),
    );
    if (views.community.currentPage > totalPages) {
      patchView("community", { currentPage: totalPages });
    }
  }, [filteredCommunityGroups.length, patchView, views.community.currentPage]);

  const currentView = views[activeTab];
  const currentGroups =
    activeTab === "content" ? filteredContentGroups : filteredCommunityGroups;
  const totalPages = Math.max(
    1,
    Math.ceil(currentGroups.length / GROUPS_PER_PAGE),
  );
  const currentPageGroups = currentGroups.slice(
    (currentView.currentPage - 1) * GROUPS_PER_PAGE,
    currentView.currentPage * GROUPS_PER_PAGE,
  );
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
