"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { UserRow } from "@/components/admin/users/user-management.types";
import { canBulkSelectUser, isTargetUserOrAuthor } from "@/lib/admin-users/user-selection";

export function useUserSelectionState({
  actorRole,
  users,
}: {
  actorRole: string;
  users: UserRow[];
}) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

  const selectableUsers = useMemo(
    () => users.filter((user) => canBulkSelectUser(user, actorRole)),
    [users, actorRole],
  );

  const selectableIds = useMemo(
    () => new Set(selectableUsers.map((user) => user.id)),
    [selectableUsers],
  );

  const selectedUsers = useMemo(
    () => users.filter((user) => selectedIds.has(user.id)),
    [users, selectedIds],
  );

  const bulkResetCandidates = useMemo(
    () =>
      selectedUsers.filter(
        (user) => isTargetUserOrAuthor(user) && user.status !== "Normal",
      ),
    [selectedUsers],
  );

  const bulkBanCandidates = useMemo(
    () =>
      selectedUsers.filter(
        (user) => isTargetUserOrAuthor(user) && user.status === "Normal",
      ),
    [selectedUsers],
  );

  const bulkMuteCandidates = useMemo(
    () =>
      selectedUsers.filter(
        (user) => isTargetUserOrAuthor(user) && user.status === "Normal",
      ),
    [selectedUsers],
  );

  const allVisibleSelected =
    selectableUsers.length > 0 &&
    selectableUsers.every((user) => selectedIds.has(user.id));
  const someVisibleSelected =
    !allVisibleSelected && selectableUsers.some((user) => selectedIds.has(user.id));

  useEffect(() => {
    setSelectedIds((prev) => {
      let changed = false;
      const next = new Set<string>();

      prev.forEach((id) => {
        if (selectableIds.has(id)) next.add(id);
        else changed = true;
      });

      return changed ? next : prev;
    });
  }, [selectableIds]);

  const toggleSelect = useCallback(
    (userId: string) => {
      if (!selectableIds.has(userId)) return;

      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (next.has(userId)) next.delete(userId);
        else next.add(userId);
        return next;
      });
    },
    [selectableIds],
  );

  const toggleSelectAllVisible = useCallback(
    (checked: boolean) => {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        selectableUsers.forEach((user) => {
          if (checked) next.add(user.id);
          else next.delete(user.id);
        });
        return next;
      });
    },
    [selectableUsers],
  );

  return {
    allVisibleSelected,
    bulkBanCandidates,
    bulkMuteCandidates,
    bulkResetCandidates,
    clearSelection,
    selectableIds,
    selectedIds,
    selectedUsers,
    someVisibleSelected,
    toggleSelect,
    toggleSelectAllVisible,
  };
}

export type UserSelectionState = ReturnType<typeof useUserSelectionState>;
