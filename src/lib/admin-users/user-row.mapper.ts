import type {
  ModerationHistoryItem,
  UserProvider,
  UserRow,
  UserStatus,
} from "@/components/admin/users/user-management.types";
import { toUiStatus } from "@/components/admin/users/user-management.utils";

export function firstNonEmptyString(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

export function normalizeMetricValue(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  if (Array.isArray(value)) return value.length;
  return null;
}

export function extractUserList(payload: any): any[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.users)) return payload.users;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.rows)) return payload.rows;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
}

export function mapUserRow(rawUser: any, apiUrl?: string): UserRow {
  const moderationHistory = resolveModerationHistory(rawUser);
  const latestModeration = moderationHistory[0];
  const lastLoginAt = resolveLastLogin(rawUser);
  const lastActivityAt = resolveLastActivity(rawUser) || lastLoginAt;

  return {
    id: String(rawUser?._id ?? rawUser?.id ?? crypto.randomUUID()),
    name: firstNonEmptyString(
      rawUser?.username,
      rawUser?.name,
      rawUser?.displayName,
      rawUser?.fullName,
      "Unknown user",
    ),
    email: firstNonEmptyString(rawUser?.email, rawUser?.mail),
    role: firstNonEmptyString(rawUser?.role, "user"),
    status: toUiStatus(
      firstNonEmptyString(
        rawUser?.status,
        rawUser?.accountStatus,
        rawUser?.userStatus,
        "normal",
      ),
    ),
    joinDate: resolveDate(
      rawUser,
      "createdAt",
      "joinDate",
      "joinedAt",
      "registeredAt",
      "created_at",
    ),
    avatar: resolveAvatarUrl(rawUser, apiUrl),
    provider: resolveProvider(rawUser),
    isEmailVerified: resolveVerification(rawUser),
    lastLoginAt,
    lastActivityAt,
    reportCount: normalizeMetricValue(rawUser?.reportCount),
    storyCount: normalizeMetricValue(rawUser?.storyCount),
    chapterCount: normalizeMetricValue(rawUser?.chapterCount),
    lastModerationAction: firstNonEmptyString(
      rawUser?.lastModerationAction,
      rawUser?.latestModerationAction,
      latestModeration?.action,
    ),
    lastModerationReason: firstNonEmptyString(
      rawUser?.lastModerationReason,
      rawUser?.latestModerationReason,
      latestModeration?.reason,
    ),
    moderationHistory,
  };
}

export function buildModerationPatch(
  currentUser: UserRow,
  action: string,
  status: UserStatus,
  reason: string,
  actorRole: string,
): Partial<UserRow> {
  const historyItem: ModerationHistoryItem = {
    id: `${currentUser.id}-${Date.now()}`,
    action,
    actorRole: actorRole || undefined,
    reason: reason.trim() || undefined,
    createdAt: new Date().toISOString(),
    statusAfter: status,
  };

  return {
    status,
    lastModerationAction: action,
    lastModerationReason: reason.trim() || currentUser.lastModerationReason,
    moderationHistory: [historyItem, ...(currentUser.moderationHistory || [])],
  };
}

function isAbsoluteUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

function resolveAvatarUrl(rawUser: any, apiUrl?: string) {
  const rawAvatar = firstNonEmptyString(
    rawUser?.avatar,
    rawUser?.avatarUrl,
    rawUser?.photoURL,
    rawUser?.photoUrl,
    rawUser?.picture,
    rawUser?.image,
    rawUser?.profileImage,
    rawUser?.profile_image,
  );

  if (!rawAvatar) return undefined;
  if (isAbsoluteUrl(rawAvatar)) return rawAvatar;

  const normalized = rawAvatar.startsWith("/") ? rawAvatar : `/${rawAvatar}`;
  if (normalized.startsWith("/uploads/")) {
    return apiUrl ? `${apiUrl}${normalized}` : normalized;
  }

  return apiUrl ? `${apiUrl}/uploads${normalized}` : normalized;
}

function resolveProvider(rawUser: any): UserProvider {
  const provider = String(
    rawUser?.provider ??
      rawUser?.authProvider ??
      rawUser?.loginProvider ??
      rawUser?.accountProvider ??
      "",
  )
    .trim()
    .toLowerCase();

  if (provider === "google") return "google";
  if (provider === "local" || provider === "email" || provider === "password") {
    return "local";
  }
  if (rawUser?.googleId || rawUser?.google_id) return "google";

  return "unknown";
}

function resolveVerification(rawUser: any) {
  const value =
    rawUser?.isEmailVerified ??
    rawUser?.emailVerified ??
    rawUser?.isVerified ??
    rawUser?.verified ??
    rawUser?.email_verified;

  return Boolean(value);
}

function resolveDate(rawUser: any, ...keys: string[]) {
  for (const key of keys) {
    const value = rawUser?.[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return "";
}

function resolveLastLogin(rawUser: any) {
  return resolveDate(rawUser, "lastLoginAt", "lastLogin", "last_logged_in");
}

function resolveLastActivity(rawUser: any) {
  return resolveDate(rawUser, "lastActivityAt", "lastSeenAt");
}

function resolveModerationHistory(rawUser: any): ModerationHistoryItem[] {
  const rawHistory =
    rawUser?.moderationHistory ??
    rawUser?.moderation_history ??
    rawUser?.statusHistory ??
    rawUser?.status_history ??
    rawUser?.history ??
    [];

  if (!Array.isArray(rawHistory)) return [];

  return rawHistory.map((item: any, index: number) => ({
    id: String(
      item?._id ??
        item?.id ??
        `${rawUser?._id ?? rawUser?.id ?? "user"}-moderation-${index}`,
    ),
    action: String(
      item?.action ??
        item?.type ??
        item?.event ??
        item?.statusAfter ??
        item?.status ??
        "updated",
    ),
    actorName: firstNonEmptyString(
      item?.actorName,
      item?.actor_name,
      item?.actor_id?.username,
      item?.updatedByName,
      item?.moderatedByName,
    ),
    actorRole: firstNonEmptyString(
      item?.actorRole,
      item?.actor_role,
      item?.actor_id?.role,
      item?.updatedByRole,
      item?.moderatedByRole,
    ),
    reason: firstNonEmptyString(
      item?.reason,
      item?.note,
      item?.adminNote,
      item?.summary,
      item?.description,
      item?.comment,
    ),
    createdAt: firstNonEmptyString(
      item?.createdAt,
      item?.updatedAt,
      item?.timestamp,
      item?.date,
    ),
    statusAfter: firstNonEmptyString(
      item?.statusAfter,
      item?.status_after,
      item?.after?.status,
      item?.status,
    ),
  }));
}
