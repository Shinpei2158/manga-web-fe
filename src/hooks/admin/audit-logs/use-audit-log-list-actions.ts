"use client";

import axios from "axios";
import { toast } from "sonner";
import type { AuditSummary, AuditListParams } from "@/lib/admin-audit-logs/types";
import { readBlobErrorMessage } from "@/lib/admin-audit-logs/utils";

export function useAuditLogListActions({
  apiUrl,
  buildListParams,
  canAttemptAdminActions,
  fetchLogs,
  isCustomRangeInvalid,
  setLoading,
  summary,
}: {
  apiUrl?: string;
  buildListParams: () => AuditListParams;
  canAttemptAdminActions: boolean;
  fetchLogs: () => Promise<void>;
  isCustomRangeInvalid: boolean;
  setLoading: (loading: boolean) => void;
  summary: AuditSummary;
}) {
  const handleMarkAllSeen = async () => {
    if (!apiUrl) return;
    if (!canAttemptAdminActions) {
      toast.error("Admin only");
      return;
    }
    if (isCustomRangeInvalid) {
      toast.error("Start date must be on or before end date.");
      return;
    }
    if (summary.unseen === 0) {
      toast.error("No unseen logs match the current filters.");
      return;
    }

    const endpoint = `${apiUrl}/api/audit-logs/seen-all`;
    try {
      setLoading(true);
      const response = await axios.patch(endpoint, {}, {
        params: buildListParams(),
        withCredentials: true,
      });
      await fetchLogs();
      const updatedCount = Number(response.data?.updated ?? 0);
      toast.success(
        updatedCount > 0
          ? `Marked ${updatedCount} matching log(s) as seen.`
          : "No unseen logs matched the current filters.",
      );
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Unable to mark all logs as seen.";
      console.error("[AuditLogs] markAllSeen error", error?.response?.data || error?.message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkSeen = async (logId: string) => {
    if (!apiUrl) return;
    if (!canAttemptAdminActions) {
      toast.error("Admin only");
      return;
    }

    try {
      setLoading(true);
      await axios.patch(`${apiUrl}/api/audit-logs/${logId}/seen`, {}, {
        withCredentials: true,
      });
      await fetchLogs();
      toast.success("Log marked as seen.");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Unable to mark this log as seen.";
      console.error("[AuditLogs] markSeen error", error?.response?.data || error?.message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (logId: string) => {
    if (!apiUrl) return;
    if (!canAttemptAdminActions) {
      toast.error("Admin only");
      return;
    }

    try {
      setLoading(true);
      await axios.patch(
        `${apiUrl}/api/audit-logs/${logId}/approve`,
        { adminNote: "" },
        { withCredentials: true },
      );
      await fetchLogs();
      toast.success("Log approved.");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Unable to approve this log.";
      console.error("[AuditLogs] approve error", error?.response?.data || error?.message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    if (!apiUrl) return;
    if (isCustomRangeInvalid) {
      toast.error("Start date must be on or before end date.");
      return;
    }
    if (summary.total === 0) {
      toast.error("No logs match the current filters.");
      return;
    }

    try {
      const response = await axios.get(`${apiUrl}/api/audit-logs/export`, {
        params: buildListParams(),
        withCredentials: true,
        responseType: "blob",
      });

      const disposition = String(response.headers["content-disposition"] || "");
      const filenameMatch = disposition.match(/filename=\"?([^\"]+)\"?/i);
      const filename = filenameMatch?.[1] || "audit-logs-filtered.csv";
      const blob =
        response.data instanceof Blob
          ? response.data
          : new Blob([response.data], { type: "text/csv" });

      if (blob.size === 0) {
        toast.error("No logs match the current filters.");
        return;
      }

      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      anchor.click();
      window.URL.revokeObjectURL(url);
      toast.success("Filtered audit logs exported to CSV.");
    } catch (error: any) {
      const message = await readBlobErrorMessage(error);
      toast.error(message);
    }
  };

  return {
    handleApprove,
    handleExportCSV,
    handleMarkAllSeen,
    handleMarkSeen,
  };
}

