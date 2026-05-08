import type { SortingState } from "@tanstack/react-table";
import type {
  UserListPreset,
  UserManagementSummary,
} from "@/components/admin/users/user-management.types";

export const DEFAULT_PAGE_SIZE = 20;

export const PRESET_LABEL: Record<UserListPreset, string> = {
  all: "All",
  staff: "Staff",
  "new-7d": "New this week",
};

export const WORKSPACE_COPY: Record<
  string,
  {
    description: string;
    focus: string;
  }
> = {
  admin: {
    description:
      "Cross-team workspace for account access, recent activity, and moderation controls.",
    focus:
      "Admin can change User/staff roles except Admin and Author, manage staff status, and reset moderated User/Author accounts.",
  },
  content_moderator: {
    description:
      "Content moderation workspace for reviewing account context before banning User/Author accounts.",
    focus:
      "Ban controls are enabled only for User/Author accounts that are currently Normal.",
  },
  community_manager: {
    description:
      "Community moderation workspace for reviewing account context before muting User/Author accounts.",
    focus:
      "Mute controls are enabled only for User/Author accounts that are currently Normal.",
  },
  default: {
    description:
      "Staff workspace for reviewing user accounts, access state, and moderation context.",
    focus: "Only actions allowed for your role are enabled.",
  },
};

export const EMPTY_SUMMARY: UserManagementSummary = {
  totalUsers: 0,
  authors: 0,
  staffUsers: 0,
};

export const DEFAULT_SORTING: SortingState = [{ id: "role", desc: false }];
