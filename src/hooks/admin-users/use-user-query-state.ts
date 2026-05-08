"use client";

import { useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { SortingState } from "@tanstack/react-table";
import type {
  UserListPreset,
  UserStatus,
} from "@/components/admin/users/user-management.types";
import { formatRoleLabel } from "@/components/admin/users/user-management.utils";
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORTING,
  PRESET_LABEL,
} from "@/lib/admin-users/constants";
import {
  isSameSorting,
  parsePageNumber,
  parsePageSize,
  parsePreset,
  parseRole,
  parseSorting,
  parseStatus,
} from "@/lib/admin-users/query-utils";
import type { UserRoleFilter, UserStatusFilter } from "@/lib/admin-users/types";

export function useUserQueryState({
  onClearSelection,
}: {
  onClearSelection: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsSnapshot = searchParams.toString();

  const [searchTerm, setSearchTerm] = useState(
    () => searchParams.get("search") ?? "",
  );
  const [filterRole, setFilterRole] = useState<UserRoleFilter>(() =>
    parseRole(searchParams.get("role")),
  );
  const [filterStatus, setFilterStatus] = useState<UserStatusFilter>(() =>
    parseStatus(searchParams.get("status")),
  );
  const [filterPreset, setFilterPreset] = useState<UserListPreset>(() =>
    parsePreset(searchParams.get("preset")),
  );
  const [sorting, setSorting] = useState<SortingState>(() =>
    parseSorting(searchParams.get("sortBy"), searchParams.get("sortDir")),
  );
  const [page, setPage] = useState(() =>
    parsePageNumber(searchParams.get("page"), 1),
  );
  const [pageSize, setPageSize] = useState(() =>
    parsePageSize(searchParams.get("limit"), DEFAULT_PAGE_SIZE),
  );
  const deferredSearchTerm = useDeferredValue(searchTerm);

  const handleFilterStatusChange = useCallback((value: string) => {
    setFilterStatus(parseStatus(value));
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setFilterRole("all");
    setFilterStatus("all");
    setFilterPreset("all");
    setSorting(DEFAULT_SORTING);
    setPage(1);
    setPageSize(DEFAULT_PAGE_SIZE);
    onClearSelection();
  }, [onClearSelection]);

  useEffect(() => {
    const params = new URLSearchParams(searchParamsSnapshot);
    const nextSearch = params.get("search") ?? "";
    const nextRole = parseRole(params.get("role"));
    const nextStatus = parseStatus(params.get("status"));
    const nextPreset = parsePreset(params.get("preset"));
    const nextSorting = parseSorting(
      params.get("sortBy"),
      params.get("sortDir"),
    );
    const nextPage = parsePageNumber(params.get("page"), 1);
    const nextLimit = parsePageSize(params.get("limit"), DEFAULT_PAGE_SIZE);

    setSearchTerm((current) => (current === nextSearch ? current : nextSearch));
    setFilterRole((current) => (current === nextRole ? current : nextRole));
    setFilterStatus((current) =>
      current === nextStatus ? current : nextStatus,
    );
    setFilterPreset((current) =>
      current === nextPreset ? current : nextPreset,
    );
    setSorting((current) =>
      isSameSorting(nextSorting, current) ? current : nextSorting,
    );
    setPage((current) => (current === nextPage ? current : nextPage));
    setPageSize((current) => (current === nextLimit ? current : nextLimit));
  }, [searchParamsSnapshot]);

  useEffect(() => {
    const activeSort = sorting[0];
    const params = new URLSearchParams();

    if (searchTerm.trim()) params.set("search", searchTerm.trim());
    if (filterRole !== "all") params.set("role", filterRole);
    if (filterStatus !== "all") params.set("status", filterStatus);
    if (filterPreset !== "all") params.set("preset", filterPreset);

    if (
      activeSort?.id &&
      (activeSort.id !== DEFAULT_SORTING[0]?.id ||
        Boolean(activeSort.desc) !== Boolean(DEFAULT_SORTING[0]?.desc))
    ) {
      params.set("sortBy", String(activeSort.id));
    }
    if (activeSort?.desc) params.set("sortDir", "desc");
    if (page !== 1) params.set("page", String(page));
    if (pageSize !== DEFAULT_PAGE_SIZE) params.set("limit", String(pageSize));

    const nextQuery = params.toString();
    if (nextQuery !== searchParamsSnapshot) {
      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
        scroll: false,
      });
    }
  }, [
    pathname,
    router,
    searchParamsSnapshot,
    searchTerm,
    filterRole,
    filterStatus,
    filterPreset,
    sorting,
    page,
    pageSize,
  ]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, filterRole, filterStatus, filterPreset, pageSize, sorting]);

  useEffect(() => {
    onClearSelection();
  }, [
    onClearSelection,
    searchTerm,
    filterRole,
    filterStatus,
    filterPreset,
    page,
    pageSize,
    sorting,
  ]);

  const isFilterDirty =
    searchTerm.trim().length > 0 ||
    filterRole !== "all" ||
    filterStatus !== "all" ||
    filterPreset !== "all";

  const activeFilterChips = useMemo(() => {
    const chips: string[] = [];

    if (searchTerm.trim()) chips.push(`Search: "${searchTerm.trim()}"`);
    if (filterPreset !== "all") chips.push(`Preset: ${PRESET_LABEL[filterPreset]}`);
    if (filterRole !== "all") chips.push(`Role: ${formatRoleLabel(filterRole)}`);
    if (filterStatus !== "all") chips.push(`Status: ${filterStatus}`);

    return chips;
  }, [searchTerm, filterPreset, filterRole, filterStatus]);

  return {
    activeFilterChips,
    clearFilters,
    deferredSearchTerm,
    filterPreset,
    filterRole,
    filterStatus,
    handleFilterStatusChange,
    isFilterDirty,
    page,
    pageSize,
    searchTerm,
    setFilterPreset,
    setFilterRole,
    setFilterStatus: setFilterStatus as (value: "all" | UserStatus) => void,
    setPage,
    setPageSize,
    setSearchTerm,
    setSorting,
    sorting,
  };
}

export type UserQueryState = ReturnType<typeof useUserQueryState>;
