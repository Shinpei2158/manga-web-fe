import type { LucideIcon } from "lucide-react";

export type LicenseStatus = "none" | "pending" | "approved" | "rejected";
export type PublicationStatus = "draft" | "published" | "unpublished";
export type EnforcementStatus = "normal" | "suspended" | "banned";
export type StoryStatus = "ongoing" | "completed" | "hiatus";
export type DetailTab = "overview" | "enforcement";
export type SortField =
  | "title"
  | "licenseStatus"
  | "publicationStatus"
  | "enforcementStatus"
  | "chaptersCount"
  | "updatedAt";
export type SortOrder = "asc" | "desc";
export type QuickFilterKey =
  | "all"
  | "pendingLicense"
  | "published"
  | "suspended"
  | "banned";
export type ActionDialogType =
  | null
  | "publish"
  | "unpublish"
  | "suspend"
  | "ban"
  | "clear-enforcement";

export interface MangaListItem {
  id: string;
  title: string;
  author: string;
  authorId?: string;
  summary: string;
  coverImage: string;
  licenseStatus: LicenseStatus;
  publicationStatus: PublicationStatus;
  enforcementStatus: EnforcementStatus;
  enforcementReason?: string;
  status: StoryStatus;
  views: number;
  chaptersCount: number;
  updatedAt: string;
  licenseSubmittedAt?: string;
  isPublish: boolean;
}

export interface MangaStats {
  total: number;
  pendingLicense: number;
  published: number;
  enforcementIssues: number;
}

export interface ManagementListResponse {
  data: MangaListItem[];
  total: number;
  page: number;
  limit: number;
  stats: MangaStats;
}

export interface UserMini {
  _id: string;
  username: string;
  email?: string;
  avatar?: string;
}

export interface TagMini {
  _id: string;
  name: string;
}

export interface MangaDetail {
  id: string;
  title: string;
  summary: string;
  coverImage: string;
  author: UserMini | null;
  styles: TagMini[];
  genres: TagMini[];
  views: number;
  status: StoryStatus;
  chaptersCount: number;
  ratingSummary: {
    avgRating: number;
    count: number;
  };
  updatedAt: string;
  createdAt: string;
  licenseStatus: LicenseStatus;
  licenseFiles: string[];
  licenseNote: string;
  licenseSubmittedAt?: string | null;
  licenseReviewedAt?: string | null;
  licenseReviewedBy?: UserMini | null;
  licenseRejectReason: string;
  licenseRejectReasons?: string[];
  isPublish: boolean;
  publicationStatus: PublicationStatus;
  enforcementStatus: EnforcementStatus;
  enforcementReason: string;
  enforcementUpdatedAt?: string | null;
  enforcementUpdatedBy?: UserMini | null;
}

export type SecondaryMangaAction = {
  label: string;
  tab: DetailTab;
  icon: LucideIcon;
  className: string;
};

export type QuickFilterButton = {
  key: QuickFilterKey;
  label: string;
  icon: LucideIcon;
  count?: number;
};
