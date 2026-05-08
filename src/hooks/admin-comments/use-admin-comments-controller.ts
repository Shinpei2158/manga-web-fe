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
  isNewest24h,
  mapChapterOption,
  mapCommentRow,
  mapMangaOption,
  nextSortDirection,
  sortComments,
} from "@/lib/admin-comments/utils";

export function useAdminCommentsController() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [me, setMe] = useState<CommentMe | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [mangas, setMangas] = useState<CommentOption[]>([]);
  const [chapters, setChapters] = useState<CommentOption[]>([]);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<CommentSortColumn>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [filters, setFilters] = useState<FilterState>(emptyCommentFilters);
  const [onlyNewest24h, setOnlyNewest24h] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

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
      if (!apiUrl) {
        setError("Missing NEXT_PUBLIC_API_URL");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const [commentResponse, mangaResponse] = await Promise.all([
          axios.get(`${apiUrl}/api/comment/all`, {
            withCredentials: true,
            signal: controller.signal,
          }),
          axios.get(`${apiUrl}/api/manga`, {
            withCredentials: true,
            signal: controller.signal,
          }),
        ]);

        setComments((commentResponse.data || []).map((row: any) => mapCommentRow(row, apiUrl)));
        setMangas((mangaResponse.data || []).map(mapMangaOption));
      } catch (error: any) {
        if (axios.isCancel(error)) return;

        console.error(
          "[Admin Comments] Load error:",
          error.response?.status,
          error.response?.data || error.message,
        );
        setError(
          `Unable to load comments. ${error.response?.status || ""} ${error.message}`,
        );
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [apiUrl]);

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

  const filteredComments = useMemo(
    () =>
      comments.filter((comment) => {
        if (filters.manga !== COMMENT_ALL.MANGA && comment.storyId !== filters.manga) {
          return false;
        }
        if (filters.chapter !== COMMENT_ALL.CHAPTER && comment.chapterId !== filters.chapter) {
          return false;
        }
        if (filters.status !== COMMENT_ALL.STATUS && comment.status !== filters.status) {
          return false;
        }
        if (filters.user && !comment.username.toLowerCase().includes(filters.user.toLowerCase())) {
          return false;
        }
        if (filters.search && !commentMatchesSearch(comment, filters.search)) {
          return false;
        }
        if (onlyNewest24h && !isNewest24h(comment)) {
          return false;
        }
        return true;
      }),
    [comments, filters, onlyNewest24h],
  );

  const sortedComments = useMemo(
    () => sortComments(filteredComments, sortColumn, sortDirection),
    [filteredComments, sortColumn, sortDirection],
  );

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

  const totalPages = Math.max(
    1,
    Math.ceil(sortedComments.length / COMMENTS_ITEMS_PER_PAGE),
  );
  const paginatedComments = sortedComments.slice(
    (currentPage - 1) * COMMENTS_ITEMS_PER_PAGE,
    currentPage * COMMENTS_ITEMS_PER_PAGE,
  );

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
            ? {
                ...comment,
                status: currentStatus === "visible" ? "hidden" : "visible",
              }
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

  const visibleCount = comments.filter((comment) => comment.status === "visible").length;
  const hiddenCount = comments.filter((comment) => comment.status === "hidden").length;
  const newest24hCount = comments.filter(isNewest24h).length;
  const quickMangaChips = useMemo(() => buildQuickMangaChips(comments), [comments]);
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
    setOnlyNewest24h,
    setSelectedComment,
    sortColumn,
    sortDirection,
    sortedComments,
    totalPages,
    visibleCount,
  };
}

function commentMatchesSearch(comment: Comment, search: string) {
  const query = search.toLowerCase();
  const searchableValues = [
    comment.plainContent,
    comment.username,
    comment.userEmail,
    comment.storyTitle,
    comment.chapter,
    comment.commentId,
  ]
    .join(" ")
    .toLowerCase();

  return searchableValues.includes(query);
}

function buildQuickMangaChips(comments: Comment[]) {
  const counts = new Map<string, { title: string; count: number }>();

  comments.forEach((comment) => {
    if (!comment.storyId) return;

    const current = counts.get(comment.storyId);
    counts.set(comment.storyId, {
      title: comment.storyTitle,
      count: (current?.count || 0) + 1,
    });
  });

  return Array.from(counts.entries())
    .map(([id, value]) => ({ id, ...value }))
    .sort((first, second) => second.count - first.count)
    .slice(0, 3);
}

export type AdminCommentsController = ReturnType<typeof useAdminCommentsController>;

