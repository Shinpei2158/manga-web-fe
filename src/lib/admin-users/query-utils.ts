import type { SortingState } from "@tanstack/react-table";
import type {
  UserListPreset,
  UserStatus,
} from "@/components/admin/users/user-management.types";
import { DEFAULT_PAGE_SIZE, DEFAULT_SORTING } from "@/lib/admin-users/constants";
import type { UserRoleFilter, UserStatusFilter } from "@/lib/admin-users/types";

export function parsePageNumber(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function parsePageSize(value: string | null, fallback: number) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed)) return fallback;
  if (![20, 50, 100].includes(parsed)) return fallback;
  return parsed;
}

export function parsePreset(value: string | null): UserListPreset {
  if (value === "staff" || value === "new-7d") return value;
  return "all";
}

export function parseStatus(value: string | null): UserStatusFilter {
  const normalized = String(value || "")
    .trim()
    .toLowerCase();

  switch (normalized) {
    case "normal":
      return "Normal";
    case "muted":
    case "mute":
      return "Muted";
    case "banned":
    case "ban":
      return "Banned";
    default:
      return "all";
  }
}

export function parseRole(value: string | null): UserRoleFilter {
  const normalized = String(value || "").trim();
  const validRoles = new Set<UserRoleFilter>([
    "all",
    "user",
    "author",
    "content_moderator",
    "community_manager",
    "financial_manager",
    "admin",
  ]);

  return validRoles.has(normalized as UserRoleFilter)
    ? (normalized as UserRoleFilter)
    : "all";
}

export function parseSorting(
  sortBy: string | null,
  sortDir: string | null,
): SortingState {
  const validSorts = new Set([
    "name",
    "email",
    "role",
    "status",
    "joinDate",
    "lastActivityAt",
  ]);

  if (!sortBy || !validSorts.has(sortBy)) {
    return DEFAULT_SORTING;
  }

  return [{ id: sortBy, desc: sortDir === "desc" }];
}

export function isSameSorting(a: SortingState, b: SortingState) {
  const first = a[0];
  const second = b[0];

  return (
    first?.id === second?.id && Boolean(first?.desc) === Boolean(second?.desc)
  );
}

export function readFiltersFromParams(
  searchParams: URLSearchParams,
  fallbackPageSize = DEFAULT_PAGE_SIZE,
) {
  return {
    searchTerm: searchParams.get("search") ?? "",
    filterRole: parseRole(searchParams.get("role")),
    filterStatus: parseStatus(searchParams.get("status")),
    filterPreset: parsePreset(searchParams.get("preset")),
    sorting: parseSorting(searchParams.get("sortBy"), searchParams.get("sortDir")),
    page: parsePageNumber(searchParams.get("page"), 1),
    pageSize: parsePageSize(searchParams.get("limit"), fallbackPageSize),
  };
}
