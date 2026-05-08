"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import {
  isDoneStatus,
  type CommunityReportAgainstGroup,
  type MergedReportItem,
  type ReportAgainstGroup,
  type ReportResolutionAction,
  type ReportStatus,
  type WorkspaceReport,
} from "@/lib/report-workspace";
import {
  buildReportMutationPayload,
  moderateReport,
} from "@/lib/admin-report/api";
import { GROUPS_PER_PAGE } from "@/lib/admin-report/constants";
import type {
  ApplyReportMutationParams,
  ReportGroup,
  WorkspaceTab,
  WorkspaceViewState,
} from "@/lib/admin-report/types";
import {
  getEditableItemReportIds,
  getReportErrorMessage,
  logReportAxiosError,
} from "@/lib/admin-report/utils";

export function useReportWorkspaceActions({
  apiUrl,
  filteredCommunityGroups,
  filteredContentGroups,
  patchView,
  reports,
  setBusyKey,
  setReports,
}: {
  apiUrl?: string;
  filteredCommunityGroups: CommunityReportAgainstGroup[];
  filteredContentGroups: ReportAgainstGroup[];
  patchView: (tab: WorkspaceTab, patch: Partial<WorkspaceViewState>) => void;
  reports: WorkspaceReport[];
  setBusyKey: (key: string | null) => void;
  setReports: React.Dispatch<React.SetStateAction<WorkspaceReport[]>>;
}) {
  const applyReportMutation = useCallback(
    async ({
      reportIds,
      status,
      note,
      resolutionAction,
      mutationKey,
      successMessage,
    }: ApplyReportMutationParams) => {
      if (!apiUrl) {
        toast.error("Missing NEXT_PUBLIC_API_URL.");
        return;
      }

      const { normalizedNote, payload } = buildReportMutationPayload({
        note,
        resolutionAction,
        status,
      });

      if (!status && !resolutionAction && !normalizedNote) {
        toast.error("Write a note before saving.");
        return;
      }
      if (
        (status === "resolved" || status === "rejected" || resolutionAction) &&
        !normalizedNote
      ) {
        toast.error("Add a closing note before resolving or rejecting.");
        return;
      }
      if (!reportIds.length) {
        toast.success("Nothing new to update.");
        return;
      }

      setBusyKey(mutationKey);

      try {
        const reportLookup = new Map(
          reports.map((report) => [report._id, report]),
        );
        const results = await Promise.allSettled(
          reportIds.map((reportId) =>
            moderateReport(
              apiUrl,
              reportId,
              payload,
              reportLookup.get(reportId)?.status,
            ),
          ),
        );
        const succeededReports = results.flatMap((result) =>
          result.status === "fulfilled" ? [result.value] : [],
        );

        if (succeededReports.length > 0) {
          const updates = new Map(
            succeededReports.map((report) => [report._id, report]),
          );
          setReports((previous) =>
            previous.map((report) => updates.get(report._id) ?? report),
          );
        }

        if (succeededReports.length === reportIds.length) {
          toast.success(successMessage);
          return;
        }

        const rejected = results.find(
          (result) => result.status === "rejected",
        ) as PromiseRejectedResult | undefined;

        toast.error(
          succeededReports.length > 0
            ? `Only updated ${succeededReports.length}/${reportIds.length} reports.`
            : getReportErrorMessage(rejected?.reason),
        );
      } catch (err: any) {
        logReportAxiosError("[Admin Reports Update]", `${apiUrl}/api/reports`, err, {
          note: normalizedNote,
          reportIds,
          resolutionAction,
          status,
        });
        toast.error(getReportErrorMessage(err));
      } finally {
        setBusyKey(null);
      }
    },
    [apiUrl, reports, setBusyKey, setReports],
  );

  const handleOpenContentGroup = (
    group: ReportAgainstGroup,
    reportId?: string | null,
  ) => {
    const visibleIndex = filteredContentGroups.findIndex(
      (candidate) => candidate.key === group.key,
    );

    patchView("content", {
      currentPage:
        visibleIndex >= 0 ? Math.floor(visibleIndex / GROUPS_PER_PAGE) + 1 : 1,
      focusReportId: reportId || null,
      isModalOpen: true,
      selectedGroupKey: group.key,
    });
  };

  const handleOpenCommunityGroup = (
    group: CommunityReportAgainstGroup,
    reportId?: string | null,
  ) => {
    const visibleIndex = filteredCommunityGroups.findIndex(
      (candidate) => candidate.key === group.key,
    );

    patchView("community", {
      currentPage:
        visibleIndex >= 0 ? Math.floor(visibleIndex / GROUPS_PER_PAGE) + 1 : 1,
      focusReportId: reportId || null,
      isModalOpen: true,
      selectedGroupKey: group.key,
    });
  };

  const handleResolveGroup = useCallback(
    async (tab: WorkspaceTab, group: ReportGroup) => {
      const unresolvedReportIds = group.reports
        .filter((report) => !isDoneStatus(report.status))
        .map((report) => report._id);

      await applyReportMutation({
        mutationKey: `group:${tab}:${group.key}`,
        note:
          tab === "content"
            ? "Bulk resolved from content report workspace."
            : "Bulk resolved from community report workspace.",
        reportIds: unresolvedReportIds,
        status: "resolved",
        successMessage: `Marked ${group.meta.name} cases as done.`,
      });

      patchView(tab, { confirmGroupKey: null });
    },
    [applyReportMutation, patchView],
  );

  const handleSubmitItemAction = useCallback(
    async (
      tab: WorkspaceTab,
      item: MergedReportItem,
      action: {
        status?: ReportStatus;
        note?: string;
        resolutionAction?: ReportResolutionAction;
      },
    ) => {
      const reportIds =
        action.status || action.resolutionAction
          ? getEditableItemReportIds(item, "status")
          : getEditableItemReportIds(item, "note");

      await applyReportMutation({
        mutationKey: `item:${tab}:${item.key}`,
        note: action.note,
        reportIds,
        resolutionAction: action.resolutionAction,
        status: action.status,
        successMessage: action.resolutionAction
          ? "Resolved grouped case with moderation action."
          : action.status
            ? action.status === "resolved"
              ? "Marked grouped case as done."
              : action.status === "rejected"
                ? "Rejected grouped case."
                : "Marked grouped case in progress."
            : "Saved grouped case note.",
      });
    },
    [applyReportMutation],
  );

  return {
    handleOpenCommunityGroup,
    handleOpenContentGroup,
    handleResolveGroup,
    handleSubmitItemAction,
  };
}
