import axios from "axios";
import { ShieldAlert } from "lucide-react";
import { getLatestRejectReason } from "@/lib/story-rights";
import type {
  DetailTab,
  EnforcementStatus,
  LicenseStatus,
  MangaDetail,
  MangaListItem,
  PublicationStatus,
  SecondaryMangaAction,
  StoryStatus,
  SortField,
  SortOrder,
} from "./types";

export function getMangaErrorMessage(
  error: unknown,
  fallback = "Something went wrong",
) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (Array.isArray(data?.message)) return data.message.join(", ");
    if (typeof data?.message === "string") return data.message;
  }
  return fallback;
}

export function formatMangaDate(value?: string | null) {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}

export function truncateMangaText(text?: string | null, max = 60) {
  if (!text) return "";
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}...`;
}

export function getLicenseStatusColor(status: LicenseStatus) {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "approved":
      return "bg-green-100 text-green-800 border-green-200";
    case "rejected":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

export function getPublicationStatusColor(status: PublicationStatus) {
  switch (status) {
    case "published":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "draft":
      return "bg-purple-100 text-purple-800 border-purple-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

export function getEnforcementStatusColor(status: EnforcementStatus) {
  switch (status) {
    case "suspended":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "banned":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-green-100 text-green-800 border-green-200";
  }
}

export function getStoryStatusColor(status: StoryStatus) {
  switch (status) {
    case "ongoing":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "completed":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "hiatus":
      return "bg-amber-50 text-amber-700 border-amber-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

export function getReviewLaneLabel(manga: {
  licenseStatus: LicenseStatus;
  publicationStatus: PublicationStatus;
  enforcementStatus: EnforcementStatus;
}) {
  if (manga.enforcementStatus !== "normal") return "Enforcement follow-up";
  if (manga.licenseStatus === "pending") return "License pending";
  if (
    manga.publicationStatus !== "published" &&
    manga.licenseStatus === "approved"
  ) {
    return "Publish ready";
  }
  if (manga.publicationStatus === "published") return "Live on platform";
  return "Catalog draft";
}

export function getReviewLaneColor(manga: {
  licenseStatus: LicenseStatus;
  publicationStatus: PublicationStatus;
  enforcementStatus: EnforcementStatus;
}) {
  if (manga.enforcementStatus !== "normal") {
    return "border-red-200 bg-red-50 text-red-700";
  }
  if (manga.licenseStatus === "pending") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }
  if (
    manga.publicationStatus !== "published" &&
    manga.licenseStatus === "approved"
  ) {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }
  if (manga.publicationStatus === "published") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }
  return "border-slate-200 bg-slate-100 text-slate-700";
}

export function getMangaListSignal(manga: MangaListItem) {
  if (manga.enforcementStatus !== "normal") {
    return manga.enforcementReason
      ? `Restriction note: ${truncateMangaText(manga.enforcementReason, 110)}`
      : `This story is currently marked as ${manga.enforcementStatus} and needs moderation follow-up.`;
  }
  if (manga.licenseStatus === "pending") {
    return `License was submitted ${formatMangaDate(manga.licenseSubmittedAt)} and is waiting for moderator review.`;
  }
  if (manga.licenseStatus === "rejected") {
    return "License was rejected. Re-check the submission before any publication action.";
  }
  if (
    manga.publicationStatus !== "published" &&
    manga.licenseStatus === "approved"
  ) {
    return "Approved license is in place. This story is ready for publication review.";
  }
  return (
    truncateMangaText(manga.summary, 140) ||
    "No summary provided yet for this story."
  );
}

export function getMangaDetailSignal(manga: MangaDetail) {
  if (manga.enforcementStatus !== "normal") {
    return manga.enforcementReason
      ? truncateMangaText(manga.enforcementReason, 180)
      : "This story has an active moderation restriction and should be reviewed carefully before any follow-up action.";
  }
  if (manga.licenseStatus === "pending") {
    return `License is still pending. Submitted ${formatMangaDate(
      manga.licenseSubmittedAt,
    )}.`;
  }
  if (manga.licenseStatus === "rejected") {
    const latestRejectReason = getLatestRejectReason(manga);
    return latestRejectReason
      ? truncateMangaText(latestRejectReason, 180)
      : "The last license submission was rejected. Check the supporting note and files before proceeding.";
  }
  if (
    manga.publicationStatus !== "published" &&
    manga.licenseStatus === "approved"
  ) {
    return "Rights review is approved and enforcement is normal. This story is ready for publication review.";
  }
  return manga.summary
    ? truncateMangaText(manga.summary, 180)
    : "No summary provided for this story.";
}

export function getSecondaryMangaAction(
  manga: MangaListItem,
): SecondaryMangaAction | null {
  if (manga.enforcementStatus !== "normal") {
    return {
      className:
        "border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800",
      icon: ShieldAlert,
      label: "Enforcement",
      tab: "enforcement" satisfies DetailTab,
    };
  }

  return null;
}

export function resolveMangaAssetUrl(apiUrl: string, file?: string | null) {
  if (!file) return "";
  const normalized = file.replace(/\\/g, "/");
  if (normalized.startsWith("http")) return normalized;
  return `${apiUrl}${normalized.startsWith("/") ? normalized : `/${normalized}`}`;
}

export function getActiveQuickFilter({
  enforcementFilter,
  licenseFilter,
  publicationFilter,
}: {
  enforcementFilter: string;
  licenseFilter: string;
  publicationFilter: string;
}) {
  if (
    licenseFilter === "all" &&
    publicationFilter === "all" &&
    enforcementFilter === "all"
  ) {
    return "all";
  }
  if (
    licenseFilter === "pending" &&
    publicationFilter === "all" &&
    enforcementFilter === "all"
  ) {
    return "pendingLicense";
  }
  if (
    licenseFilter === "all" &&
    publicationFilter === "published" &&
    enforcementFilter === "all"
  ) {
    return "published";
  }
  if (
    licenseFilter === "all" &&
    publicationFilter === "all" &&
    enforcementFilter === "suspended"
  ) {
    return "suspended";
  }
  if (
    licenseFilter === "all" &&
    publicationFilter === "all" &&
    enforcementFilter === "banned"
  ) {
    return "banned";
  }
  return null;
}

export function getMangaSortLabel(sortBy: SortField, sortOrder: SortOrder) {
  const fieldLabels: Record<SortField, string> = {
    chaptersCount: "Chapters",
    enforcementStatus: "Enforcement",
    licenseStatus: "License",
    publicationStatus: "Publication",
    title: "Story",
    updatedAt: "Updated",
  };

  return `${fieldLabels[sortBy]} / ${
    sortOrder === "asc" ? "ascending" : "descending"
  }`;
}
