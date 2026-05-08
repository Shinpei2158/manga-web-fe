"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  getLatestRejectReason,
  normalizeRejectReasonHistory,
} from "@/lib/story-rights";
import {
  buildQuickFilterButtons,
  DEFAULT_MANGA_STATS,
} from "@/lib/admin-manga/constants";
import type {
  DetailTab,
  MangaDetail,
  MangaListItem,
  QuickFilterKey,
  SortField,
  SortOrder,
} from "@/lib/admin-manga/types";
import {
  fetchMangaManagementDetail,
  fetchMangaManagementList,
} from "@/lib/admin-manga/api";
import {
  getActiveQuickFilter,
  getMangaErrorMessage,
  getMangaSortLabel,
  truncateMangaText,
} from "@/lib/admin-manga/utils";
import { useAdminMangaActions } from "./use-admin-manga-actions";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export function useAdminMangaController() {
  const { toast } = useToast();
  const [mangaList, setMangaList] = useState<MangaListItem[]>([]);
  const [stats, setStats] = useState(DEFAULT_MANGA_STATS);
  const [total, setTotal] = useState(0);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [licenseFilter, setLicenseFilter] = useState("all");
  const [publicationFilter, setPublicationFilter] = useState("all");
  const [enforcementFilter, setEnforcementFilter] = useState("all");
  const [authorFilter, setAuthorFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortField>("updatedAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState("5");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedMangaId, setSelectedMangaId] = useState<string | null>(null);
  const [selectedManga, setSelectedManga] = useState<MangaDetail | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>("overview");

  const totalPages = Math.max(1, Math.ceil(total / Number(limit || 5)));
  const authorOptions = useMemo(() => {
    const map = new Map<string, string>();
    mangaList.forEach((item) => {
      if (item.authorId) map.set(item.authorId, item.author);
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [mangaList]);

  const activeQuickFilter = useMemo<QuickFilterKey | null>(
    () =>
      getActiveQuickFilter({
        enforcementFilter,
        licenseFilter,
        publicationFilter,
      }),
    [licenseFilter, publicationFilter, enforcementFilter],
  );

  const quickFilterButtons = useMemo(
    () => buildQuickFilterButtons(stats),
    [stats],
  );

  const currentSortLabel = useMemo(
    () => getMangaSortLabel(sortBy, sortOrder),
    [sortBy, sortOrder],
  );

  const fetchManagementList = useCallback(async () => {
    try {
      setLoadingList(true);
      const data = await fetchMangaManagementList({
        apiUrl: API_URL,
        authorFilter,
        enforcementFilter,
        licenseFilter,
        limit,
        page,
        publicationFilter,
        searchQuery,
        sortBy,
        sortOrder,
      });

      setMangaList(data.data || []);
      setStats(data.stats || DEFAULT_MANGA_STATS);
      setTotal(data.total || 0);
    } catch (error) {
      toast({
        description: getMangaErrorMessage(
          error,
          "Could not fetch manga management data.",
        ),
        title: "Failed to load manga list",
        variant: "destructive",
      });
    } finally {
      setLoadingList(false);
    }
  }, [
    authorFilter,
    enforcementFilter,
    licenseFilter,
    limit,
    page,
    publicationFilter,
    searchQuery,
    sortBy,
    sortOrder,
    toast,
  ]);

  const fetchManagementDetail = useCallback(
    async (mangaId: string) => {
      try {
        setLoadingDetail(true);
        setSelectedManga(await fetchMangaManagementDetail(API_URL, mangaId));
      } catch (error) {
        toast({
          description: getMangaErrorMessage(error, "Could not fetch manga detail."),
          title: "Failed to load details",
          variant: "destructive",
        });
      } finally {
        setLoadingDetail(false);
      }
    },
    [toast],
  );

  useEffect(() => {
    void fetchManagementList();
  }, [fetchManagementList]);

  const applyQuickFilter = (key: QuickFilterKey) => {
    setPage(1);
    setLicenseFilter(key === "pendingLicense" ? "pending" : "all");
    setPublicationFilter(key === "published" ? "published" : "all");
    setEnforcementFilter(
      key === "suspended" || key === "banned" ? key : "all",
    );
  };

  const resetFilters = () => {
    setSearchQuery("");
    setLicenseFilter("all");
    setPublicationFilter("all");
    setEnforcementFilter("all");
    setAuthorFilter("all");
    setSortBy("updatedAt");
    setSortOrder("desc");
    setPage(1);
    setLimit("5");
  };

  const handleSortChange = (field: SortField) => {
    setPage(1);
    if (sortBy === field) {
      setSortOrder((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }
    setSortBy(field);
    setSortOrder(field === "updatedAt" ? "desc" : "asc");
  };

  const openDetail = async (mangaId: string, initialTab: DetailTab = "overview") => {
    setSelectedMangaId(mangaId);
    setSelectedManga(null);
    setDetailTab(initialTab);
    setDetailsOpen(true);
    await fetchManagementDetail(mangaId);
  };

  const closeDetail = () => {
    setDetailsOpen(false);
    setSelectedManga(null);
    setSelectedMangaId(null);
    setDetailTab("overview");
  };

  const refreshAfterMutation = async (mangaId: string) => {
    await Promise.all([fetchManagementList(), fetchManagementDetail(mangaId)]);
  };
  const actions = useAdminMangaActions({
    apiUrl: API_URL,
    refreshAfterMutation,
    selectedManga,
  });

  const selectedRejectReasonHistory = useMemo(
    () => normalizeRejectReasonHistory(selectedManga),
    [selectedManga],
  );
  const selectedLatestRejectReason = useMemo(
    () => getLatestRejectReason(selectedManga),
    [selectedManga],
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
  const selectedMangaIndex = selectedMangaId
    ? mangaList.findIndex((item) => item.id === selectedMangaId)
    : -1;
  const hasPreviousReview = selectedMangaIndex > 0;
  const hasNextReview =
    selectedMangaIndex >= 0 && selectedMangaIndex < mangaList.length - 1;
  const reviewPositionLabel =
    selectedMangaIndex >= 0
      ? `Story ${selectedMangaIndex + 1} of ${mangaList.length}`
      : "No story selected";
  const dialogStoryTitle = truncateMangaText(selectedManga?.title, 55);

  const handleReviewSequence = async (direction: -1 | 1) => {
    if (selectedMangaIndex < 0) return;
    const nextManga = mangaList[selectedMangaIndex + direction];
    if (!nextManga) return;
    setSelectedMangaId(nextManga.id);
    await fetchManagementDetail(nextManga.id);
  };

  return {
    actionDialog: actions.actionDialog,
    actionLoading: actions.actionLoading,
    activeQuickFilter,
    apiUrl: API_URL,
    applyQuickFilter,
    authorFilter,
    authorOptions,
    closeActionDialog: actions.closeActionDialog,
    closeDetail,
    currentSortLabel,
    detailTab,
    detailsOpen,
    dialogStoryTitle,
    enforcementFilter,
    enforcementReason: actions.enforcementReason,
    handleConfirmAction: actions.handleConfirmAction,
    handleReviewSequence,
    handleSortChange,
    hasNextReview,
    hasPreviousReview,
    licenseFilter,
    limit,
    loadingDetail,
    loadingList,
    mangaList,
    openDetail,
    page,
    previousSelectedRejectReasons,
    publicationFilter,
    quickFilterButtons,
    resetFilters,
    reviewPositionLabel,
    searchQuery,
    selectedLatestRejectReason,
    selectedManga,
    selectedMangaId,
    setActionDialog: actions.setActionDialog,
    setAuthorFilter,
    setDetailTab,
    setEnforcementFilter,
    setEnforcementReason: actions.setEnforcementReason,
    setLicenseFilter,
    setLimit,
    setPage,
    setPublicationFilter,
    setSearchQuery,
    sortBy,
    sortOrder,
    stats,
    totalPages,
  };
}

export type AdminMangaController = ReturnType<typeof useAdminMangaController>;
