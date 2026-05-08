"use client";

import { useCallback, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import type { UserRow, UserStatus } from "@/components/admin/users/user-management.types";
import { logAxiosError } from "@/components/admin/users/user-management.utils";
import { getBulkActionMeta, getBulkConfirmCopy } from "@/lib/admin-users/action-copy";
import type { BulkActionType } from "@/lib/admin-users/types";
import { buildModerationPatch } from "@/lib/admin-users/user-row.mapper";

export function useBulkUserActions({
  actorRole,
  apiUrl,
  banCandidates,
  clearSelection,
  loadUsers,
  muteCandidates,
  resetCandidates,
  selectedUser,
  setDraftStaffStatus,
  updateSelectedUser,
  updateUserState,
}: {
  actorRole: string;
  apiUrl?: string;
  banCandidates: UserRow[];
  clearSelection: () => void;
  loadUsers: () => Promise<void>;
  muteCandidates: UserRow[];
  resetCandidates: UserRow[];
  selectedUser: UserRow | null;
  setDraftStaffStatus: (status: UserStatus) => void;
  updateSelectedUser: (patch: Partial<UserRow>) => void;
  updateUserState: (userId: string, patch: Partial<UserRow>) => void;
}) {
  const [bulkConfirmAction, setBulkConfirmAction] =
    useState<BulkActionType | null>(null);
  const [bulkReason, setBulkReason] = useState("");
  const [isSubmittingBulkAction, setIsSubmittingBulkAction] = useState(false);

  const bulkActionMeta = useMemo(
    () =>
      getBulkActionMeta({
        actorRole,
        banCount: banCandidates.length,
        muteCount: muteCandidates.length,
        resetCount: resetCandidates.length,
      }),
    [actorRole, banCandidates.length, muteCandidates.length, resetCandidates.length],
  );

  const bulkConfirmCopy = useMemo(
    () =>
      getBulkConfirmCopy({
        action: bulkConfirmAction,
        banCount: banCandidates.length,
        muteCount: muteCandidates.length,
        resetCount: resetCandidates.length,
      }),
    [bulkConfirmAction, banCandidates.length, muteCandidates.length, resetCandidates.length],
  );

  const requestBulkReset = useCallback(() => {
    if (resetCandidates.length === 0) {
      toast.error("Select at least one moderated User or Author account.");
      return;
    }
    setBulkReason("");
    setBulkConfirmAction("bulk-reset-user-author");
  }, [resetCandidates.length]);

  const requestBulkBan = useCallback(() => {
    if (banCandidates.length === 0) {
      toast.error("Select at least one Normal User or Author account.");
      return;
    }
    setBulkReason("");
    setBulkConfirmAction("bulk-ban-user-author");
  }, [banCandidates.length]);

  const requestBulkMute = useCallback(() => {
    if (muteCandidates.length === 0) {
      toast.error("Select at least one Normal User or Author account.");
      return;
    }
    setBulkReason("");
    setBulkConfirmAction("bulk-mute-user-author");
  }, [muteCandidates.length]);

  const executeBulkAction = async () => {
    if (!apiUrl || !bulkConfirmAction) return;

    const request = resolveBulkRequest({
      action: bulkConfirmAction,
      apiUrl,
      banCandidates,
      muteCandidates,
      resetCandidates,
    });

    if (request.candidateUsers.length === 0) {
      toast.error("No eligible accounts are selected for this action.");
      setBulkConfirmAction(null);
      return;
    }

    if (bulkConfirmCopy.requiresReason && !bulkReason.trim()) {
      toast.error(`Please enter a ${bulkConfirmCopy.reasonLabel.toLowerCase()}.`);
      return;
    }

    setIsSubmittingBulkAction(true);

    try {
      const response = await axios.patch(
        request.endpoint,
        {
          userIds: request.candidateUsers.map((user) => user.id),
          reason: bulkReason.trim() || undefined,
        },
        { withCredentials: true },
      );

      const succeededIds = Array.isArray(response.data?.succeededIds)
        ? response.data.succeededIds.map((id: unknown) => String(id))
        : [];
      const failures = Array.isArray(response.data?.failures)
        ? response.data.failures
        : [];

      request.candidateUsers.forEach((user) => {
        if (!succeededIds.includes(user.id)) return;
        const patch = buildModerationPatch(
          user,
          request.historyAction,
          request.statusAfter,
          bulkReason,
          actorRole,
        );
        updateUserState(user.id, patch);
        if (selectedUser?.id === user.id) updateSelectedUser(patch);
      });

      if (selectedUser && succeededIds.includes(selectedUser.id)) {
        setDraftStaffStatus(request.statusAfter);
      }

      setBulkConfirmAction(null);
      setBulkReason("");
      clearSelection();
      await loadUsers();

      if (succeededIds.length > 0) {
        toast.success(
          `${succeededIds.length} account${
            succeededIds.length === 1 ? "" : "s"
          } ${request.actionLabel} successfully.`,
        );
      }

      if (failures.length > 0) {
        const firstFailure = String(
          failures[0]?.message || "One or more accounts could not be updated.",
        );
        toast.error(
          failures.length === request.candidateUsers.length
            ? firstFailure
            : `${failures.length} account${
                failures.length === 1 ? "" : "s"
              } could not be updated. ${firstFailure}`,
        );
      }
    } catch (error: any) {
      logAxiosError("[Bulk User Action]", request.endpoint, error, {
        bulkConfirmAction,
        userIds: request.candidateUsers.map((user) => user.id),
      });
      const message = error?.response?.data?.message;
      toast.error(
        Array.isArray(message)
          ? message.join(", ")
          : message ?? "Bulk action failed.",
      );
    } finally {
      setIsSubmittingBulkAction(false);
    }
  };

  return {
    bulkActionMeta,
    bulkConfirmAction,
    bulkConfirmCopy,
    bulkReason,
    executeBulkAction,
    isSubmittingBulkAction,
    requestBulkBan,
    requestBulkMute,
    requestBulkReset,
    setBulkConfirmAction,
    setBulkReason,
  };
}

function resolveBulkRequest({
  action,
  apiUrl,
  banCandidates,
  muteCandidates,
  resetCandidates,
}: {
  action: BulkActionType;
  apiUrl: string;
  banCandidates: UserRow[];
  muteCandidates: UserRow[];
  resetCandidates: UserRow[];
}) {
  switch (action) {
    case "bulk-reset-user-author":
      return {
        endpoint: `${apiUrl}/api/user/admin/reset-user-status/bulk`,
        candidateUsers: resetCandidates,
        actionLabel: "reset",
        statusAfter: "Normal" as UserStatus,
        historyAction: "reset_to_normal",
      };
    case "bulk-ban-user-author":
      return {
        endpoint: `${apiUrl}/api/user/moderation/ban/bulk`,
        candidateUsers: banCandidates,
        actionLabel: "banned",
        statusAfter: "Banned" as UserStatus,
        historyAction: "ban",
      };
    case "bulk-mute-user-author":
      return {
        endpoint: `${apiUrl}/api/user/moderation/mute/bulk`,
        candidateUsers: muteCandidates,
        actionLabel: "muted",
        statusAfter: "Muted" as UserStatus,
        historyAction: "mute",
      };
  }
}

export type BulkUserActions = ReturnType<typeof useBulkUserActions>;
