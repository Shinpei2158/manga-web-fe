"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import type { FilterState } from "@/components/comment/comment-filters";
import type {
  Comment,
  CommentSortColumn,
  SortDirection,
} from "@/components/comment/comment-table";
import {
  COMMENT_ALL,
  COMMENTS_ITEMS_PER_PAGE,
  emptyCommentFilters,
} from "@/lib/admin-comments/constants";
import type { CommentMe, CommentOption } from "@/lib/admin-comments/types";
import {
  mapChapterOption,
  mapCommentRow,
  mapMangaOption,
  nextSortDirection,
} from "@/lib/admin-comments/utils";

export function useAdminCommentsController() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [me, setMe] = useState<CommentMe | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [mangas, setMangas] = useState<CommentOption[]>([]);
  const [mangaSearch, setMangaSearch] = useState("");
  const [mangaOptionsLoading, setMangaOptionsLoading] = useState(false);
  const [chapters, setChapters] = useState<CommentOption[]>([]);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [sortColumn, setSortColumn] = useState<CommentSortColumn>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [filters, setFilters] = useState<FilterState>(emptyCommentFilters);
  const [onlyNewest24h, setOnlyNewest24h] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [stats, setStats] = useState({
    visibleCount: 0,
    hiddenCount: 0,
    newest24hCount: 0,
    topMangas: [] as Array<{ id: string; title: string; count: number }>,
  });

  const roleNormalized = useMemo(
    () => String(me?.role || "").toLowerCase(),
    [me?.role],
  );

  useEffect(() => {
    if (!apiUrl) return;

    axios
      .get(`${apiUrl}/api/auth/me`, { withCredentials: true })
      .then((response) => setMe(response.data))
      .catch(() => setMe(null));
  }, [apiUrl]);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      if (!apiUrl) return;
      try {
        setMangaOptionsLoading(true);
        const mangaResponse = await axios.get(`${apiUrl}/api/manga/options`, {
          withCredentials: true,
          signal: controller.signal,
          params: {
            limit: 20,
            q: mangaSearch.trim() || undefined,
          },
        });
        setMangas((mangaResponse.data || []).map(mapMangaOption));
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error("[Admin Comments] Load mangas error:", error);
        }
      } finally {
        setMangaOptionsLoading(false);
      }
    })();
    return () => controller.abort();
  }, [apiUrl, mangaSearch]);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      if (!apiUrl) return;

      if (!filters.manga || filters.manga === COMMENT_ALL.MANGA) {
        setChapters([]);
        return;
      }

      try {
        const response = await axios.get(
          `${apiUrl}/api/chapter/by-manga/${filters.manga}`,
          {
            withCredentials: true,
            signal: controller.signal,
          },
        );

        setChapters((response.data || []).map(mapChapterOption));
      } catch (error) {
        console.error("[Admin Comments] Load chapters error:", error);
        setChapters([]);
      }
    })();

    return () => controller.abort();
  }, [apiUrl, filters.manga]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortColumn, sortDirection, onlyNewest24h]);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      if (!apiUrl) {
        setError("Missing NEXT_PUBLIC_API_URL");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${apiUrl}/api/comment/all`, {
          withCredentials: true,
          signal: controller.signal,
          params: {
            page: currentPage,
            limit: COMMENTS_ITEMS_PER_PAGE,
            storyId: filters.manga || undefined,
            chapterId: filters.chapter || undefined,
            status: filters.status || undefined,
            user: filters.user?.trim() || undefined,
            search: filters.search?.trim() || undefined,
            sortBy: sortColumn,
            sortDir: sortDirection,
            onlyNewest24h,
          },
        });

        const payload = response.data || {};
        const rows = Array.isArray(payload.data) ? payload.data : [];
        setComments(rows.map((row: any) => mapCommentRow(row, apiUrl)));
        setTotalItems(Number(payload.total || 0));
        setTotalPages(Number(payload.totalPages || 1));
        setStats({
          visibleCount: Number(payload?.stats?.visibleCount || 0),
          hiddenCount: Number(payload?.stats?.hiddenCount || 0),
          newest24hCount: Number(payload?.stats?.newest24hCount || 0),
          topMangas: Array.isArray(payload?.stats?.topMangas)
            ? payload.stats.topMangas
            : [],
        });
      } catch (error: any) {
        if (axios.isCancel(error)) return;
        console.error(
          "[Admin Comments] Load error:",
          error.response?.status,
          error.response?.data || error.message,
        );
        setError(`Unable to load comments. ${error.response?.status || ""} ${error.message}`);
        setComments([]);
        setTotalItems(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [
    apiUrl,
    currentPage,
    filters.chapter,
    filters.manga,
    filters.search,
    filters.status,
    filters.user,
    onlyNewest24h,
    sortColumn,
    sortDirection,
  ]);

  const handleFiltersChange = (nextFilters: FilterState) => {
    if (!nextFilters.manga || nextFilters.manga === COMMENT_ALL.MANGA) {
      nextFilters = { ...nextFilters, chapter: COMMENT_ALL.CHAPTER };
    }

    setFilters(nextFilters);
  };

  const handleResetFilters = () => {
    setFilters(emptyCommentFilters);
    setOnlyNewest24h(false);
  };

  const sortedComments = useMemo(() => comments, [comments]);

  useEffect(() => {
    if (!selectedComment) return;

    const updatedSelected = sortedComments.find(
      (comment) => comment.id === selectedComment.id,
    );

    if (!updatedSelected) {
      setSelectedComment(null);
      setPanelOpen(false);
      return;
    }

    if (updatedSelected !== selectedComment) {
      setSelectedComment(updatedSelected);
    }
  }, [selectedComment, sortedComments]);

  const paginatedComments = sortedComments;

  const handleSort = (column: CommentSortColumn) => {
    setSortDirection((currentDirection) =>
      nextSortDirection(column, sortColumn, currentDirection),
    );
    setSortColumn(column);
  };

  const handleViewDetails = (comment: Comment) => {
    setSelectedComment(comment);
    setPanelOpen(true);
  };

  const handleToggleVisibility = async (id: string, currentStatus: string) => {
    try {
      if (!apiUrl) return;
      setActionLoading(id);

      await axios.patch(`${apiUrl}/api/comment/toggle/${id}`, {}, {
        withCredentials: true,
      });
      setComments((previous) =>
        previous.map((comment) =>
          comment.id === id
            ? { ...comment, status: currentStatus === "visible" ? "hidden" : "visible" }
            : comment,
        ),
      );

      toast.success("Comment status updated successfully.");
    } catch (error) {
      console.error("[Admin Comments] Toggle error:", error);
      toast.error("Could not update comment status.");
    } finally {
      setActionLoading(null);
    }
  };

  const visibleCount = stats.visibleCount || comments.filter((comment) => comment.status === "visible").length;
  const hiddenCount = stats.hiddenCount || comments.filter((comment) => comment.status === "hidden").length;
  const newest24hCount = stats.newest24hCount;
  const quickMangaChips = useMemo(
    () => stats.topMangas.map((item) => ({ id: item.id, title: item.title, count: item.count })),
    [stats.topMangas],
  );
  const selectedCommentIndex = selectedComment
    ? sortedComments.findIndex((comment) => comment.id === selectedComment.id)
    : -1;

  const applyStatusQuickFilter = (status: "visible" | "hidden") => {
    setOnlyNewest24h(false);
    handleFiltersChange({ ...filters, status });
  };

  const applyMangaQuickFilter = (mangaId: string) => {
    setOnlyNewest24h(false);
    handleFiltersChange({
      ...filters,
      manga: mangaId,
      chapter: COMMENT_ALL.CHAPTER,
    });
  };

  const closePanel = () => {
    setPanelOpen(false);
    setSelectedComment(null);
  };

  return {
    actionLoading,
    applyMangaQuickFilter,
    applyStatusQuickFilter,
    chapters,
    closePanel,
    comments,
    currentPage,
    error,
    filters,
    handleFiltersChange,
    handleResetFilters,
    handleSort,
    handleToggleVisibility,
    handleViewDetails,
    hiddenCount,
    loading,
    mangaOptionsLoading,
    mangaSearch,
    mangas,
    me,
    newest24hCount,
    onlyNewest24h,
    paginatedComments,
    panelOpen,
    quickMangaChips,
    roleNormalized,
    selectedComment,
    selectedCommentIndex,
    setCurrentPage,
    setMangaSearch,
    setOnlyNewest24h,
    setSelectedComment,
    sortColumn,
    sortDirection,
    sortedComments,
    totalItems,
    totalPages,
    visibleCount,
  };
}

export type AdminCommentsController = ReturnType<typeof useAdminCommentsController>;

