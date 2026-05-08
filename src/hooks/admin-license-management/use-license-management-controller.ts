"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  getLatestRejectReason,
  normalizeRejectReasonHistory,
} from "@/lib/story-rights";
import {
  deriveLicenseReviewContext,
  getLicenseCaseGuide,
} from "@/lib/admin-license-management/license-knowledge.utils";
import type {
  ActionFeedback,
  ActionState,
  FetchQueueOptions,
  LicenseDetail,
  LicenseQueueResponse,
  MangaLicenseStatus,
  QueueItem,
} from "@/lib/admin-license-management/license-management.types";
import { getAssetCandidates } from "@/lib/admin-license-management/license-management.utils";

export function useLicenseManagementController() {
  const [items, setItems] = useState<QueueItem[]>([]);
  const [selected, setSelected] = useState<LicenseDetail | null>(null);
  const [statusFilter, setStatusFilter] = useState<MangaLicenseStatus | "all">(
    "pending",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<Record<string, number>>({
    approved: 0,
    none: 0,
    pending: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionState, setActionState] = useState<ActionState>(null);
  const [actionFeedback, setActionFeedback] =
    useState<ActionFeedback | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);

  const apiBase = useMemo(
    () => (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, ""),
    [],
  );
  const api = useMemo(
    () =>
      axios.create({
        baseURL: `${apiBase}/api`,
        withCredentials: true,
      }),
    [apiBase],
  );

  const getFileUrl = (filePath?: string) =>
    getAssetCandidates(apiBase, filePath, "assets/licenses")[0];
  const getCoverUrl = (coverImage?: string) =>
    getAssetCandidates(apiBase, coverImage, "assets/coverImages")[0];

  const fetchDetail = async (mangaId: string) => {
    try {
      setDetailLoading(true);
      setActionFeedback(null);

      const res = await api.get<LicenseDetail>(`/license/${mangaId}`);
      setSelected(res.data);
      setSelectedFileIndex(0);
      setRejectionReason("");
      setError(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load story detail.");
    } finally {
      setDetailLoading(false);
    }
  };

  const fetchQueue = async (
    nextPage = page,
    options: FetchQueueOptions = {},
  ) => {
    try {
      setLoading(true);

      const res = await api.get<LicenseQueueResponse>("/license/queue", {
        params: {
          limit,
          page: nextPage,
          q: searchQuery.trim(),
          status: statusFilter,
        },
      });

      if (res.data.data.length === 0 && res.data.total > 0 && nextPage > 1) {
        await fetchQueue(nextPage - 1, options);
        return;
      }

      setItems(res.data.data);
      setStats(res.data.stats);
      setPage(res.data.page);
      setTotal(res.data.total);
      setError(null);

      const preferredSelectedId =
        options.preferredSelectedId === undefined
          ? (selected?._id ?? null)
          : options.preferredSelectedId;
      const nextSelectedId =
        preferredSelectedId &&
        res.data.data.some((item) => item._id === preferredSelectedId)
          ? preferredSelectedId
          : (res.data.data[0]?._id ?? null);

      if (!nextSelectedId) {
        setSelected(null);
        return;
      }

      if (
        !selected ||
        selected._id !== nextSelectedId ||
        options.forceDetailRefresh
      ) {
        await fetchDetail(nextSelectedId);
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Failed to load moderation queue.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchQueue(1);
    }, 300);

    return () => clearTimeout(timer);
    // This effect intentionally reacts only to search/filter changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, searchQuery]);

  const currentFile =
    selected &&
    selected.licenseFiles &&
    selected.licenseFiles.length > 0 &&
    selectedFileIndex < selected.licenseFiles.length
      ? selected.licenseFiles[selectedFileIndex]
      : undefined;
  const currentFileUrl = currentFile ? getFileUrl(currentFile) : undefined;
  const currentFileIsPdf =
    typeof currentFile === "string" && currentFile.toLowerCase().endsWith(".pdf");
  const selectedRejectReasonHistory = useMemo(
    () => normalizeRejectReasonHistory(selected),
    [selected],
  );
  const selectedLatestRejectReason = useMemo(
    () => getLatestRejectReason(selected),
    [selected],
  );
  const previousSelectedRejectReasons = useMemo(
    () =>
      selectedRejectReasonHistory.length > 1
        ? selectedRejectReasonHistory
            .slice(0, selectedRejectReasonHistory.length - 1)
            .reverse()
        : [],
    [selectedRejectReasonHistory],
  );
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const queueStart = items.length === 0 ? 0 : (page - 1) * limit + 1;
  const queueEnd = items.length === 0 ? 0 : queueStart + items.length - 1;
  const selectedProofCount = selected?.licenseFiles?.length || 0;
  const isActionBusy = actionState !== null;
  const isReviewBusy = actionState === "approve" || actionState === "reject";
  const derivedContext = useMemo(
    () => deriveLicenseReviewContext(selected),
    [selected],
  );
  const caseGuide = useMemo(
    () => getLicenseCaseGuide(derivedContext),
    [derivedContext],
  );

  const handleReview = async (status: "approved" | "rejected") => {
    if (!selected) return;

    if (status === "rejected" && !rejectionReason.trim()) {
      setActionFeedback({
        message:
          "Explain what proof is missing, inconsistent, or still unclear before rejecting the submission.",
        title: "Reject reason required",
        tone: "error",
      });
      return;
    }

    try {
      setActionState(status === "approved" ? "approve" : "reject");
      setActionFeedback(null);
      setError(null);

      await api.patch(`/license/${selected._id}/review`, {
        rejectReason: status === "rejected" ? rejectionReason.trim() : "",
        status,
      });

      await fetchQueue(page, {
        forceDetailRefresh: true,
        preferredSelectedId: selected._id,
      });

      setActionFeedback({
        message:
          statusFilter === "pending"
            ? "Queue refreshed. The next pending story is ready for review."
            : "The moderation result was saved and the detail panel was refreshed.",
        title:
          status === "approved" ? "Submission approved" : "Submission rejected",
        tone: "success",
      });
    } catch (err: any) {
      setActionFeedback({
        message:
          err?.response?.data?.message || "Failed to save moderation result.",
        title: "Review failed",
        tone: "error",
      });
    } finally {
      setActionState(null);
    }
  };

  return {
    actionFeedback,
    actionState,
    caseGuide,
    currentFile,
    currentFileIsPdf,
    currentFileUrl,
    derivedContext,
    detailLoading,
    error,
    fetchDetail,
    fetchQueue,
    getCoverUrl,
    handleReview,
    isActionBusy,
    isReviewBusy,
    items,
    loading,
    page,
    previousSelectedRejectReasons,
    queueEnd,
    queueStart,
    rejectionReason,
    searchQuery,
    selected,
    selectedFileIndex,
    selectedLatestRejectReason,
    selectedProofCount,
    setActionFeedback,
    setRejectionReason,
    setSearchQuery,
    setSelectedFileIndex,
    setStatusFilter,
    stats,
    statusFilter,
    total,
    totalPages,
  };
}

export type LicenseManagementController = ReturnType<
  typeof useLicenseManagementController
>;
