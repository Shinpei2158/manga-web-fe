"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { normalizeDiff, resolveAuditTarget } from "@/lib/audit-ui";
import {
  extractCommentPlainText,
  firstNonEmpty,
  getAuditCommentHtml,
  getAuditCommentPreviewSource,
  sanitizeAuditCommentHtml,
} from "@/lib/admin-audit-logs/comment-utils";
import type { AuditDetailRecord, AuditMe } from "@/lib/admin-audit-logs/types";

export function useAuditLogDetails() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [log, setLog] = useState<AuditDetailRecord | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [renderedCommentHtml, setRenderedCommentHtml] = useState("");
  const [me, setMe] = useState<AuditMe | null>(null);
  const [meError, setMeError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const roleNormalized = useMemo(
    () => String(me?.role || "").toLowerCase(),
    [me?.role],
  );
  const isAdmin = roleNormalized === "admin";
  const canAttemptAdminActions = isAdmin || Boolean(meError);
  const targetType = String(log?.target_type || "").toLowerCase();
  const isCommentLikeRecord =
    targetType === "comment" ||
    targetType === "reply" ||
    String(log?.action || "").startsWith("comment_") ||
    String(log?.action || "").startsWith("reply_");
  const commentPreviewSource = useMemo(
    () => getAuditCommentPreviewSource(log),
    [log],
  );
  const commentRenderSource = useMemo(
    () => firstNonEmpty(getAuditCommentHtml(log), commentPreviewSource),
    [commentPreviewSource, log],
  );
  const commentPlainText = useMemo(
    () => extractCommentPlainText(commentPreviewSource),
    [commentPreviewSource],
  );
  const commentFallbackText =
    targetType === "reply"
      ? "This reply contains media or formatting only."
      : "This comment contains media or formatting only.";
  const targetIdentity = resolveAuditTarget(log);
  const beforeObj = normalizeDiff(log, log?.before || {});
  const afterObj = normalizeDiff(log, log?.after || {});
  const hasDiff = Object.keys(beforeObj).length > 0 || Object.keys(afterObj).length > 0;
  const evidenceImages = Array.isArray(log?.evidenceImages) ? log.evidenceImages : [];
  const hasEvidence = evidenceImages.length > 0;
  const reportCode = log?.reportCode ? String(log.reportCode) : "--";
  const canOpenReport =
    String(log?.target_type || "").toLowerCase() === "report" && Boolean(log?.target_id);
  const canEditAdminNote = canAttemptAdminActions && log?.approval !== "approved";
  const timeText = log?.createdAt
    ? new Date(log.createdAt).toLocaleString("vi-VN", { hour12: false })
    : "--";
  const actor = {
    name: log?.actor_id?.username || log?.actor_name || "System",
    email: log?.actor_id?.email || log?.actor_email || "--",
    role: log?.actor_role || log?.actor_id?.role || "system",
    avatar: log?.actor_id?.avatar || log?.actor_avatar || log?.actorAvatar,
  };

  const fetchMe = async () => {
    if (!apiUrl) return;

    try {
      setMeError(null);
      const response = await axios.get(`${apiUrl}/api/auth/me`, {
        withCredentials: true,
      });
      setMe(response.data);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Cannot fetch /me";
      console.error("[ME] FETCH ERROR:", error?.response?.data || error?.message);
      setMe(null);
      setMeError(message);
    }
  };

  const fetchLog = async () => {
    if (!apiUrl || !id) return;

    try {
      setError(null);
      const response = await axios.get(`${apiUrl}/api/audit-logs/${id}`, {
        withCredentials: true,
      });
      setLog(response.data);
      setAdminNote(response.data?.adminNote ?? "");
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error?.message || "Fetch failed";
      setError(message);
      console.error(
        "[AuditLogDetails] FETCH ERROR",
        error?.response?.data || error?.message,
      );
    }
  };

  useEffect(() => {
    void fetchMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiUrl]);

  useEffect(() => {
    void fetchLog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiUrl, id]);

  useEffect(() => {
    if (!isCommentLikeRecord || !commentRenderSource) {
      setRenderedCommentHtml("");
      return;
    }

    try {
      setRenderedCommentHtml(sanitizeAuditCommentHtml(commentRenderSource, apiUrl));
    } catch {
      setRenderedCommentHtml("");
    }
  }, [apiUrl, commentRenderSource, isCommentLikeRecord]);

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied");
    } catch {
      toast.error("Copy failed");
    }
  };

  const handleApprove = async () => {
    if (!apiUrl || !id) return;
    if (!canAttemptAdminActions) {
      toast.error("Admin only");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.patch(
        `${apiUrl}/api/audit-logs/${id}/approve`,
        { adminNote },
        { withCredentials: true },
      );
      setLog(response.data);
      setAdminNote(response.data?.adminNote ?? adminNote);
      toast.success("Approved");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Approve failed";
      toast.error(message);
      console.error(
        "[AuditLogDetails] APPROVE ERROR",
        error?.response?.data || error?.message,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMarkSeen = async () => {
    if (!apiUrl || !id) return;
    if (!canAttemptAdminActions) {
      toast.error("Admin only");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.patch(
        `${apiUrl}/api/audit-logs/${id}/seen`,
        {},
        { withCredentials: true },
      );
      setLog(response.data);
      toast.success("Marked as seen");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Mark seen failed";
      toast.error(message);
      console.error(
        "[AuditLogDetails] SEEN ERROR",
        error?.response?.data || error?.message,
      );
    } finally {
      setLoading(false);
    }
  };

  const openReportWorkspace = () => {
    const params = new URLSearchParams();
    const reportId = String(log?.target_id || "").trim();
    const reportCodeValue = String(log?.reportCode || "").trim();

    if (reportId) params.set("reportId", reportId);
    if (reportCodeValue) params.set("reportCode", reportCodeValue);

    router.push(`/admin/report${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return {
    actor,
    adminNote,
    afterObj,
    apiUrl,
    beforeObj,
    canAttemptAdminActions,
    canEditAdminNote,
    canOpenReport,
    commentFallbackText,
    commentPlainText,
    copyText,
    error,
    evidenceImages,
    fetchLog,
    goBack: () => router.back(),
    handleApprove,
    handleMarkSeen,
    hasDiff,
    hasEvidence,
    isCommentLikeRecord,
    loading,
    log,
    meError,
    openReportWorkspace,
    renderedCommentHtml,
    reportCode,
    roleNormalized,
    setAdminNote,
    targetIdentity,
    targetType,
    timeText,
  };
}

export type AuditLogDetailsController = ReturnType<typeof useAuditLogDetails>;

