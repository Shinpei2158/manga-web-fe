import type { ConfirmActionType } from "@/components/admin/users/user-management.types";

export function buildNotificationBody(displayName: string) {
  return `Hello ${displayName},

This is a notification from the administration team.

[Write your message here]

Best regards,
Manga Platform Team`;
}

export function resolveActionEndpoint(
  apiUrl: string,
  action: ConfirmActionType | null,
) {
  switch (action) {
    case "change-role":
      return `${apiUrl}/api/user/admin/set-role`;
    case "change-staff-status":
      return `${apiUrl}/api/user/update-status`;
    case "reset-user-author":
      return `${apiUrl}/api/user/admin/reset-user-status`;
    case "ban-user-author":
      return `${apiUrl}/api/user/moderation/ban`;
    case "mute-user-author":
      return `${apiUrl}/api/user/moderation/mute`;
    default:
      return "";
  }
}
