"use client";

import { useEffect, useMemo, useState } from "react";
import type { SortingState } from "@tanstack/react-table";
import { fetchQueue } from "@/lib/moderation";
import type {
  AIStatus,
  ModerationResolutionStatus,
  QueueItem,
} from "@/lib/typesLogs";

const DEFAULT_PAGE_SIZE = 10;

export type ModerationQueueFilters = {
  search: string;
  status: AIStatus | null;
  resolutionStatus: ModerationResolutionStatus | null;
  riskRange: [number, number];
};

function compareText(a: string, b: string) {
  return a.localeCompare(b, undefined, { sensitivity: "base" });
}

export function useModerationQueueController() {
  const [filters, setFilters] = useState<ModerationQueueFilters>({
    search: "",
    status: null,
    resolutionStatus: null,
    riskRange: [0, 100],
  });
  const [data, setData] = useState<QueueItem[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [serverTotalItems, setServerTotalItems] = useState(0);
  const [usesServerPagination, setUsesServerPagination] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr(null);

      try {
        const activeSort = sorting[0];
        const response = await fetchQueue({
          limit: pageSize,
          page,
          resolutionStatus: filters.resolutionStatus,
          riskMax: filters.riskRange[1],
          riskMin: filters.riskRange[0],
          search: filters.search.trim() || undefined,
          sortBy: activeSort?.id as
            | "title"
            | "mangaTitle"
            | "author"
            | "risk_score"
            | "updatedAt"
            | undefined,
          sortDir: activeSort ? (activeSort.desc ? "desc" : "asc") : undefined,
          status: filters.status,
        });

        setUsesServerPagination(response.serverPaginated);
        setServerTotalItems(response.total);
        setData(response.items);
      } catch (e: any) {
        setErr(e?.message || "Load queue failed");
        setData([]);
        setServerTotalItems(0);
      } finally {
        setLoading(false);
      }
    })();
  }, [filters, page, pageSize, sorting]);

  const filteredItems = useMemo(() => {
    if (usesServerPagination) {
      return data;
    }

    const search = filters.search.trim().toLowerCase();

    return data.filter((item) => {
      const title = item.title?.toLowerCase?.() || "";
      const mangaTitle = item.mangaTitle?.toLowerCase?.() || "";
      const author = item.author?.toLowerCase?.() || "";
      const chapterId = item.chapterId?.toLowerCase?.() || "";

      const matchesSearch =
        !search ||
        title.includes(search) ||
        mangaTitle.includes(search) ||
        author.includes(search) ||
        chapterId.includes(search);
      const matchesRisk =
        item.risk_score >= filters.riskRange[0] &&
        item.risk_score <= filters.riskRange[1];
      const matchesResolution =
        !filters.resolutionStatus ||
        item.resolution_status === filters.resolutionStatus;

      return matchesSearch && matchesRisk && matchesResolution;
    });
  }, [data, filters, usesServerPagination]);

  const sortedItems = useMemo(() => {
    if (usesServerPagination) {
      return filteredItems;
    }

    const activeSort = sorting[0];
    if (!activeSort) return filteredItems;

    const sorted = [...filteredItems];

    sorted.sort((left, right) => {
      let comparison = 0;

      switch (activeSort.id) {
        case "title":
          comparison = compareText(left.title, right.title);
          break;
        case "mangaTitle":
          comparison = compareText(left.mangaTitle, right.mangaTitle);
          break;
        case "author":
          comparison = compareText(left.author, right.author);
          break;
        case "risk_score":
          comparison = left.risk_score - right.risk_score;
          break;
        case "updatedAt":
          comparison =
            new Date(left.updatedAt).getTime() -
            new Date(right.updatedAt).getTime();
          break;
        default:
          comparison = 0;
      }

      return activeSort.desc ? comparison * -1 : comparison;
    });

    return sorted;
  }, [filteredItems, sorting, usesServerPagination]);

  const totalItems = usesServerPagination
    ? serverTotalItems
    : sortedItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = usesServerPagination ? page : Math.min(page, totalPages);
  const paginatedItems = useMemo(() => {
    if (usesServerPagination) {
      return sortedItems;
    }

    const start = (currentPage - 1) * pageSize;
    return sortedItems.slice(start, start + pageSize);
  }, [currentPage, pageSize, sortedItems, usesServerPagination]);

  useEffect(() => {
    setPage(1);
  }, [
    filters.search,
    filters.status,
    filters.resolutionStatus,
    filters.riskRange,
    pageSize,
    sorting,
  ]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const handleFiltersChange = (nextFilters: ModerationQueueFilters) => {
    setFilters(nextFilters);
    setPage(1);
  };

  return {
    currentPage,
    err,
    filters,
    handleFiltersChange,
    loading,
    pageSize,
    paginatedItems,
    setPage,
    setPageSize,
    setSorting,
    sorting,
    totalItems,
    totalPages,
  };
}

export type ModerationQueueController = ReturnType<
  typeof useModerationQueueController
>;
