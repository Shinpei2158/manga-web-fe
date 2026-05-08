import { RotateCcw, UserX, VolumeX } from "lucide-react";
import { formatRoleLabel } from "@/components/admin/users/user-management.utils";
import type { ConfirmActionType, UserRow } from "@/components/admin/users/user-management.types";
import type { BulkActionMeta, BulkActionType } from "@/lib/admin-users/types";

export function getConfirmCopy({
  banReason,
  confirmAction,
  draftRole,
  draftStaffStatus,
  muteReason,
  resetReason,
  selectedUser,
}: {
  banReason: string;
  confirmAction: ConfirmActionType | null;
  draftRole: string;
  draftStaffStatus: string;
  muteReason: string;
  resetReason: string;
  selectedUser: UserRow | null;
}) {
  if (!selectedUser || !confirmAction) {
    return {
      title: "Confirm action",
      description: "Are you sure you want to continue?",
      actionLabel: "Confirm",
      destructive: false,
    };
  }

  switch (confirmAction) {
    case "change-role":
      return {
        title: "Confirm role change",
        description: `You are about to change ${selectedUser.name} from ${formatRoleLabel(
          selectedUser.role,
        )} to ${formatRoleLabel(draftRole)}.`,
        actionLabel: "Change role",
        destructive: true,
      };
    case "change-staff-status":
      return {
        title: "Confirm staff status change",
        description: `You are about to change ${selectedUser.name} from ${selectedUser.status} to ${draftStaffStatus}.`,
        actionLabel: "Update status",
        destructive: true,
      };
    case "reset-user-author":
      return {
        title: "Confirm reset to Normal",
        description: `You are about to restore ${
          selectedUser.name
        } to Normal.${resetReason.trim() ? ` Reason: ${resetReason.trim()}` : ""}`,
        actionLabel: "Reset to Normal",
        destructive: true,
      };
    case "ban-user-author":
      return {
        title: "Confirm ban",
        description: `You are about to ban ${
          selectedUser.name
        }. Reason: ${banReason.trim()}`,
        actionLabel: "Ban user",
        destructive: true,
      };
    case "mute-user-author":
      return {
        title: "Confirm mute",
        description: `You are about to mute ${
          selectedUser.name
        }. Reason: ${muteReason.trim()}`,
        actionLabel: "Mute user",
        destructive: true,
      };
    default:
      return {
        title: "Confirm action",
        description: "Are you sure you want to continue?",
        actionLabel: "Confirm",
        destructive: false,
      };
  }
}

export function getBulkActionMeta({
  actorRole,
  banCount,
  muteCount,
  resetCount,
}: {
  actorRole: string;
  banCount: number;
  muteCount: number;
  resetCount: number;
}): BulkActionMeta | null {
  switch (actorRole) {
    case "admin":
      return {
        label: "Reset selected",
        helper:
          "Only moderated User/Author accounts on this page can be reset in bulk.",
        actionableCount: resetCount,
        Icon: RotateCcw,
      };
    case "content_moderator":
      return {
        label: "Ban selected",
        helper:
          "Only Normal User/Author accounts on this page can be banned in bulk.",
        actionableCount: banCount,
        Icon: UserX,
      };
    case "community_manager":
      return {
        label: "Mute selected",
        helper:
          "Only Normal User/Author accounts on this page can be muted in bulk.",
        actionableCount: muteCount,
        Icon: VolumeX,
      };
    default:
      return null;
  }
}

export function getBulkConfirmCopy({
  action,
  banCount,
  muteCount,
  resetCount,
}: {
  action: BulkActionType | null;
  banCount: number;
  muteCount: number;
  resetCount: number;
}) {
  switch (action) {
    case "bulk-reset-user-author":
      return {
        title: "Confirm bulk reset",
        description: `You are about to restore ${resetCount} selected User/Author account${
          resetCount === 1 ? "" : "s"
        } to Normal.`,
        actionLabel: "Reset selected",
        reasonLabel: "Reset reason",
        reasonPlaceholder:
          "Optional context for why these accounts are being restored",
        requiresReason: false,
      };
    case "bulk-ban-user-author":
      return {
        title: "Confirm bulk ban",
        description: `You are about to ban ${banCount} selected User/Author account${
          banCount === 1 ? "" : "s"
        }.`,
        actionLabel: "Ban selected",
        reasonLabel: "Ban reason",
        reasonPlaceholder:
          "Required. This reason will be used in moderation history.",
        requiresReason: true,
      };
    case "bulk-mute-user-author":
      return {
        title: "Confirm bulk mute",
        description: `You are about to mute ${muteCount} selected User/Author account${
          muteCount === 1 ? "" : "s"
        }.`,
        actionLabel: "Mute selected",
        reasonLabel: "Mute reason",
        reasonPlaceholder:
          "Required. This reason will be used in moderation history.",
        requiresReason: true,
      };
    default:
      return {
        title: "Confirm bulk action",
        description: "Are you sure you want to continue?",
        actionLabel: "Confirm",
        reasonLabel: "Reason",
        reasonPlaceholder: "",
        requiresReason: false,
      };
  }
}
