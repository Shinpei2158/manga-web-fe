"use client";

import { useEffect, useState } from "react";
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

  const totalItems = serverTotalItems;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = page;
  const paginatedItems = data;

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
