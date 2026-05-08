import type { UserRow } from "@/components/admin/users/user-management.types";

export function isTargetUserOrAuthor(user: UserRow) {
  return user.role === "user" || user.role === "author";
}

export function canBulkSelectUser(user: UserRow, actorRole: string) {
  if (!isTargetUserOrAuthor(user)) return false;

  switch (actorRole) {
    case "admin":
      return user.status !== "Normal";
    case "content_moderator":
    case "community_manager":
      return user.status === "Normal";
    default:
      return false;
  }
}
