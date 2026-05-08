"use client";

import { useEffect } from "react";
import { WORKSPACE_COPY } from "@/lib/admin-users/constants";
import { parseRole } from "@/lib/admin-users/query-utils";
import { useBulkUserActions } from "./use-bulk-user-actions";
import { useUserDataLoader } from "./use-user-data-loader";
import { useUserDialogActions } from "./use-user-dialog-actions";
import { useUserQueryState } from "./use-user-query-state";
import { useUserSelectionState } from "./use-user-selection-state";

export function useUserManagementController() {
  const query = useUserQueryState({
    onClearSelection: () => undefined,
  });
  const data = useUserDataLoader({
    deferredSearchTerm: query.deferredSearchTerm,
    filterPreset: query.filterPreset,
    filterRole: query.filterRole,
    filterStatus: query.filterStatus,
    page: query.page,
    pageSize: query.pageSize,
    sorting: query.sorting,
  });
  const selection = useUserSelectionState({
    actorRole: data.actorRole,
    users: data.users,
  });
  const dialog = useUserDialogActions({
    actorRole: data.actorRole,
    apiUrl: data.apiUrl,
    loadUsers: data.loadUsers,
    updateUserState: data.updateUserState,
  });
  const bulk = useBulkUserActions({
    actorRole: data.actorRole,
    apiUrl: data.apiUrl,
    banCandidates: selection.bulkBanCandidates,
    clearSelection: selection.clearSelection,
    loadUsers: data.loadUsers,
    muteCandidates: selection.bulkMuteCandidates,
    resetCandidates: selection.bulkResetCandidates,
    selectedUser: dialog.selectedUser,
    setDraftStaffStatus: dialog.setDraftStaffStatus,
    updateSelectedUser: (patch) => {
      dialog.setSelectedUser((current) =>
        current ? { ...current, ...patch } : current,
      );
    },
    updateUserState: data.updateUserState,
  });
  const clearSelection = selection.clearSelection;
  const pageOverride = data.pageOverride;
  const setPage = query.setPage;
  const setPageOverride = data.setPageOverride;

  useEffect(() => {
    if (pageOverride) {
      setPage(pageOverride);
      setPageOverride(null);
    }
  }, [pageOverride, setPage, setPageOverride]);

  useEffect(() => {
    clearSelection();
  }, [
    clearSelection,
    query.searchTerm,
    query.filterRole,
    query.filterStatus,
    query.filterPreset,
    query.page,
    query.pageSize,
    query.sorting,
  ]);

  const resetErrorState = () => {
    data.resetErrorState();
    query.clearFilters();
    clearSelection();
  };
  const clearFilters = () => {
    query.clearFilters();
    clearSelection();
  };
  const setFilterRole = (value: string) => {
    query.setFilterRole(parseRole(value));
  };

  return {
    ...query,
    ...data,
    ...selection,
    ...dialog,
    ...bulk,
    clearFilters,
    resetErrorState,
    setFilterRole,
    workspaceCopy:
      WORKSPACE_COPY[data.actorRole] ?? WORKSPACE_COPY.default,
  };
}

export type UserManagementController = ReturnType<
  typeof useUserManagementController
>;
