import type { LucideIcon } from "lucide-react";
import type { SortingState } from "@tanstack/react-table";
import type {
  ConfirmActionType,
  UserListPreset,
  UserManagementSummary,
  UserRow,
  UserStatus,
} from "@/components/admin/users/user-management.types";

export type BulkActionType =
  | "bulk-reset-user-author"
  | "bulk-ban-user-author"
  | "bulk-mute-user-author";

export type UserRoleFilter =
  | "all"
  | "user"
  | "author"
  | "content_moderator"
  | "community_manager"
  | "financial_manager"
  | "admin";

export type UserStatusFilter = "all" | UserStatus;

export type ConfirmCopy = {
  title: string;
  description: string;
  actionLabel: string;
  destructive: boolean;
};

export type BulkConfirmCopy = {
  title: string;
  description: string;
  actionLabel: string;
  reasonLabel: string;
  reasonPlaceholder: string;
  requiresReason: boolean;
};

export type BulkActionMeta = {
  label: string;
  helper: string;
  actionableCount: number;
  Icon: LucideIcon;
};

export type UserManagementFiltersState = {
  searchTerm: string;
  filterRole: UserRoleFilter;
  filterStatus: UserStatusFilter;
  filterPreset: UserListPreset;
  sorting: SortingState;
  page: number;
  pageSize: number;
};

export type UserManagementDataState = {
  users: UserRow[];
  summary: UserManagementSummary;
  totalItems: number;
  totalPages: number;
  isLoading: boolean;
  loadError: string | null;
  actorRole: string;
};

export type UserDialogState = {
  selectedUser: UserRow | null;
  isEditDialogOpen: boolean;
  draftRole: string;
  draftStaffStatus: UserStatus;
  resetReason: string;
  banReason: string;
  muteReason: string;
  confirmAction: ConfirmActionType | null;
  isSubmittingAction: boolean;
};
