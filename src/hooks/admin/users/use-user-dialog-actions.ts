"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import {
  ADMIN_ROLE_ASSIGNMENT_VALUES,
  type ConfirmActionType,
  type UserRow,
  type UserStatus,
} from "@/components/admin/users/user-management.types";
import { logAxiosError, toBackendStatus } from "@/components/admin/users/user-management.utils";
import { getConfirmCopy } from "@/lib/admin-users/action-copy";
import {
  buildNotificationBody,
  resolveActionEndpoint,
} from "@/lib/admin-users/dialog-action-utils";
import { buildModerationPatch } from "@/lib/admin-users/user-row.mapper";

export function useUserDialogActions({
  actorRole,
  apiUrl,
  loadUsers,
  updateUserState,
}: {
  actorRole: string;
  apiUrl?: string;
  loadUsers: () => Promise<void>;
  updateUserState: (userId: string, patch: Partial<UserRow>) => void;
}) {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [draftRole, setDraftRole] = useState("");
  const [draftStaffStatus, setDraftStaffStatus] =
    useState<UserStatus>("Normal");
  const [resetReason, setResetReason] = useState("");
  const [banReason, setBanReason] = useState("");
  const [muteReason, setMuteReason] = useState("");
  const [confirmAction, setConfirmAction] = useState<ConfirmActionType | null>(
    null,
  );
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
    };
  }, []);

  const resetDialogDrafts = useCallback(() => {
    setResetReason("");
    setBanReason("");
    setMuteReason("");
    setConfirmAction(null);
  }, []);

  const closeEditDialog = useCallback(() => {
    setIsEditDialogOpen(false);
    setSelectedUser(null);
    setDraftRole("");
    setDraftStaffStatus("Normal");
    resetDialogDrafts();
  }, [resetDialogDrafts]);

  const handleOpenEdit = useCallback(
    (user: UserRow) => {
      setSelectedUser(user);
      setDraftRole(user.role);
      setDraftStaffStatus(user.status);
      resetDialogDrafts();
      setIsEditDialogOpen(true);
    },
    [resetDialogDrafts],
  );

  const handleDialogOpenChange = (open: boolean) => {
    if (isSubmittingAction) return;
    if (!open) {
      closeEditDialog();
      return;
    }
    setIsEditDialogOpen(true);
  };

  const handleOpenNotifications = useCallback(
    (user: UserRow) => {
      if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
      if (!user.email) {
        toast.error("This user does not have an email.");
        return;
      }

      const displayName = user.name || user.email || "User";
      const params = new URLSearchParams({
        receiverId: user.id,
        receiverEmail: user.email,
        title: `[Account Notice] ${displayName}`,
        body: buildNotificationBody(displayName),
      });

      setHighlightId(user.id);
      highlightTimerRef.current = setTimeout(() => {
        router.push(`/admin/notifications/send-general?${params.toString()}`);
      }, 350);
    },
    [router],
  );

  const requestRoleUpdate = () => {
    if (!selectedUser || draftRole === selectedUser.role) return;
    const canChangeSelectedRole = ADMIN_ROLE_ASSIGNMENT_VALUES.includes(
      selectedUser.role as (typeof ADMIN_ROLE_ASSIGNMENT_VALUES)[number],
    );
    const canAssignDraftRole = ADMIN_ROLE_ASSIGNMENT_VALUES.includes(
      draftRole as (typeof ADMIN_ROLE_ASSIGNMENT_VALUES)[number],
    );

    if (!canChangeSelectedRole || !canAssignDraftRole) {
      toast.error(
        "Admin can only switch User and staff roles between User, Content Moderator, Community Manager, and Financial Manager.",
      );
      return;
    }

    setConfirmAction("change-role");
  };

  const requestStaffStatusUpdate = () => {
    if (!selectedUser || draftStaffStatus === selectedUser.status) return;
    setConfirmAction("change-staff-status");
  };

  const requestResetToNormal = () => {
    if (!selectedUser || selectedUser.status === "Normal") return;
    setConfirmAction("reset-user-author");
  };

  const requestBanUser = () => {
    if (!selectedUser) return;
    if (!banReason.trim()) {
      toast.error("Please enter a ban reason.");
      return;
    }
    setConfirmAction("ban-user-author");
  };

  const requestMuteUser = () => {
    if (!selectedUser) return;
    if (!muteReason.trim()) {
      toast.error("Please enter a mute reason.");
      return;
    }
    setConfirmAction("mute-user-author");
  };

  const confirmCopy = useMemo(
    () =>
      getConfirmCopy({
        banReason,
        confirmAction,
        draftRole,
        draftStaffStatus,
        muteReason,
        resetReason,
        selectedUser,
      }),
    [
      banReason,
      confirmAction,
      draftRole,
      draftStaffStatus,
      muteReason,
      resetReason,
      selectedUser,
    ],
  );

  const executeConfirmedAction = async () => {
    if (!selectedUser || !apiUrl || !confirmAction) return;

    setIsSubmittingAction(true);
    let shouldReloadUsers = false;

    try {
      const patch = await runConfirmedAction();
      if (patch) {
        updateUserState(selectedUser.id, patch);
        setSelectedUser((current) =>
          current && current.id === selectedUser.id
            ? { ...current, ...patch }
            : current,
        );
      }

      shouldReloadUsers = true;
      setConfirmAction(null);
      closeEditDialog();
      if (shouldReloadUsers) await loadUsers();
    } catch (error: any) {
      logAxiosError("[User Action]", resolveActionEndpoint(apiUrl, confirmAction), error, {
        confirmAction,
      });
      const message = error?.response?.data?.message;
      toast.error(
        Array.isArray(message) ? message.join(", ") : message ?? "Action failed.",
      );
      setConfirmAction(null);
    } finally {
      setIsSubmittingAction(false);
    }
  };

  async function runConfirmedAction() {
    if (!selectedUser || !apiUrl || !confirmAction) return null;

    switch (confirmAction) {
      case "change-role":
        await axios.patch(
          `${apiUrl}/api/user/admin/set-role`,
          { userId: selectedUser.id, role: draftRole },
          { withCredentials: true },
        );
        toast.success("Role updated successfully.");
        return { role: draftRole };
      case "change-staff-status":
        await axios.post(
          `${apiUrl}/api/user/update-status`,
          { userId: selectedUser.id, status: toBackendStatus(draftStaffStatus) },
          { withCredentials: true },
        );
        toast.success("Staff status updated successfully.");
        return { status: draftStaffStatus };
      case "reset-user-author":
        await axios.patch(
          `${apiUrl}/api/user/admin/reset-user-status`,
          { userId: selectedUser.id, reason: resetReason.trim() || undefined },
          { withCredentials: true },
        );
        setDraftStaffStatus("Normal");
        setResetReason("");
        toast.success("User restored to Normal.");
        return buildModerationPatch(
          selectedUser,
          "reset_to_normal",
          "Normal",
          resetReason,
          actorRole,
        );
      case "ban-user-author":
        await axios.patch(
          `${apiUrl}/api/user/moderation/ban`,
          { userId: selectedUser.id, reason: banReason.trim() },
          { withCredentials: true },
        );
        setDraftStaffStatus("Banned");
        setBanReason("");
        toast.success("User banned successfully.");
        return buildModerationPatch(
          selectedUser,
          "ban",
          "Banned",
          banReason,
          actorRole,
        );
      case "mute-user-author":
        await axios.patch(
          `${apiUrl}/api/user/moderation/mute`,
          { userId: selectedUser.id, reason: muteReason.trim() },
          { withCredentials: true },
        );
        setDraftStaffStatus("Muted");
        setMuteReason("");
        toast.success("User muted successfully.");
        return buildModerationPatch(
          selectedUser,
          "mute",
          "Muted",
          muteReason,
          actorRole,
        );
      default:
        return null;
    }
  }

  return {
    banReason,
    confirmAction,
    confirmCopy,
    draftRole,
    draftStaffStatus,
    executeConfirmedAction,
    handleDialogOpenChange,
    handleOpenEdit,
    handleOpenNotifications,
    handleOpenUser: handleOpenEdit,
    highlightId,
    isEditDialogOpen,
    isSubmittingAction,
    muteReason,
    requestBanUser,
    requestMuteUser,
    requestResetToNormal,
    requestRoleUpdate,
    requestStaffStatusUpdate,
    resetReason,
    selectedUser,
    setBanReason,
    setConfirmAction,
    setDraftRole,
    setDraftStaffStatus,
    setMuteReason,
    setResetReason,
    setSelectedUser,
  };
}

export type UserDialogActions = ReturnType<typeof useUserDialogActions>;
