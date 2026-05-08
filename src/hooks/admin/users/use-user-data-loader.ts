"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import type { SortingState } from "@tanstack/react-table";
import type {
  UserListPreset,
  UserManagementSummary,
  UserRow,
  UserStatus,
} from "@/components/admin/users/user-management.types";
import {
  logAxiosError,
  toBackendStatus,
} from "@/components/admin/users/user-management.utils";
import { EMPTY_SUMMARY } from "@/lib/admin-users/constants";
import type { UserRoleFilter, UserStatusFilter } from "@/lib/admin-users/types";
import { extractUserList, mapUserRow } from "@/lib/admin-users/user-row.mapper";

export function useUserDataLoader({
  deferredSearchTerm,
  filterPreset,
  filterRole,
  filterStatus,
  page,
  pageSize,
  sorting,
}: {
  deferredSearchTerm: string;
  filterPreset: UserListPreset;
  filterRole: UserRoleFilter;
  filterStatus: UserStatusFilter;
  page: number;
  pageSize: number;
  sorting: SortingState;
}) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [users, setUsers] = useState<UserRow[]>([]);
  const [summary, setSummary] = useState<UserManagementSummary>(EMPTY_SUMMARY);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actorRole, setActorRole] = useState("");
  const [pageOverride, setPageOverride] = useState<number | null>(null);

  const loadActorRole = useCallback(async () => {
    if (!apiUrl) return;

    const meEndpoint = `${apiUrl}/api/auth/me`;

    try {
      const response = await axios.get(meEndpoint, { withCredentials: true });
      const role = response.data?.role || response.data?.user?.role;
      setActorRole(String(role || ""));
    } catch (error: any) {
      console.warn("[Fetch Me] failed", error?.response?.data || error?.message);
      setActorRole("");
    }
  }, [apiUrl]);

  useEffect(() => {
    void loadActorRole();
  }, [loadActorRole]);

  const resetUserData = useCallback(() => {
    setUsers([]);
    setSummary(EMPTY_SUMMARY);
    setTotalItems(0);
    setTotalPages(1);
  }, []);

  const handleLoadError = useCallback(
    (error: any, usersEndpoint: string) => {
      logAxiosError("[Fetch Users]", usersEndpoint, error, {
        search: deferredSearchTerm,
        filterRole,
        filterStatus,
        filterPreset,
        page,
        pageSize,
      });
      const message = error?.response?.data?.message ?? error?.message;
      const displayMessage = Array.isArray(message)
        ? message.join(", ")
        : message ?? "Unable to load users.";
      setLoadError(displayMessage);
      resetUserData();
      toast.error(displayMessage);
    },
    [
      deferredSearchTerm,
      filterRole,
      filterStatus,
      filterPreset,
      page,
      pageSize,
      resetUserData,
    ],
  );

  const loadUsers = useCallback(async () => {
    if (!apiUrl) {
      setLoadError("Missing NEXT_PUBLIC_API_URL.");
      setIsLoading(false);
      resetUserData();
      return;
    }

    setIsLoading(true);
    setLoadError(null);

    const usersEndpoint = `${apiUrl}/api/user/management/list`;
    const activeSort = sorting[0];
    const params = new URLSearchParams();

    if (deferredSearchTerm.trim()) params.set("search", deferredSearchTerm.trim());
    if (filterRole !== "all") params.set("role", filterRole);
    if (filterStatus !== "all") {
      params.set("status", toBackendStatus(filterStatus as UserStatus));
    }
    if (filterPreset !== "all") params.set("preset", filterPreset);
    if (activeSort?.id) {
      params.set("sortBy", String(activeSort.id));
      params.set("sortDir", activeSort.desc ? "desc" : "asc");
    }

    params.set("page", String(page));
    params.set("limit", String(pageSize));

    try {
      const response = await axios.get(`${usersEndpoint}?${params.toString()}`, {
        withCredentials: true,
      });
      const nextTotalPages = Math.max(
        1,
        Number(response.data?.totalPages ?? 1),
      );

      if (page > nextTotalPages) {
        setPageOverride(nextTotalPages);
        return;
      }

      const rawUsers = extractUserList(response.data);
      setUsers(rawUsers.map((user: any) => mapUserRow(user, apiUrl)));
      setSummary({
        totalUsers: Number(response.data?.summary?.totalUsers ?? 0),
        authors: Number(response.data?.summary?.authors ?? 0),
        staffUsers: Number(response.data?.summary?.staffUsers ?? 0),
      });
      setTotalItems(Number(response.data?.total ?? 0));
      setTotalPages(nextTotalPages);
    } catch (error: any) {
      handleLoadError(error, usersEndpoint);
    } finally {
      setIsLoading(false);
    }
  }, [
    apiUrl,
    deferredSearchTerm,
    filterRole,
    filterStatus,
    filterPreset,
    sorting,
    page,
    pageSize,
    handleLoadError,
    resetUserData,
  ]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const updateUserState = useCallback((userId: string, patch: Partial<UserRow>) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === userId ? { ...user, ...patch } : user)),
    );
  }, []);

  const resetErrorState = useCallback(() => {
    setLoadError(null);
    resetUserData();
  }, [resetUserData]);

  return {
    actorRole,
    apiUrl,
    isLoading,
    loadError,
    loadUsers,
    pageOverride,
    resetErrorState,
    setPageOverride,
    summary,
    totalItems,
    totalPages,
    updateUserState,
    users,
  };
}

export type UserDataLoader = ReturnType<typeof useUserDataLoader>;
