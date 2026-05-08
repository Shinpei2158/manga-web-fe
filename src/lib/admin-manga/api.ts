import axios from "axios";
import type {
  ActionDialogType,
  ManagementListResponse,
  MangaDetail,
  SortField,
  SortOrder,
} from "./types";

type ListParams = {
  apiUrl: string;
  authorFilter: string;
  enforcementFilter: string;
  licenseFilter: string;
  limit: string;
  page: number;
  publicationFilter: string;
  searchQuery: string;
  sortBy: SortField;
  sortOrder: SortOrder;
};

export async function fetchMangaManagementList(params: ListParams) {
  const res = await axios.get<ManagementListResponse>(
    `${params.apiUrl}/api/manga/admin/management`,
    {
      params: {
        authorId:
          params.authorFilter !== "all" ? params.authorFilter : undefined,
        enforcementStatus:
          params.enforcementFilter !== "all"
            ? params.enforcementFilter
            : undefined,
        licenseStatus:
          params.licenseFilter !== "all" ? params.licenseFilter : undefined,
        limit: Number(params.limit),
        page: params.page,
        publicationStatus:
          params.publicationFilter !== "all"
            ? params.publicationFilter
            : undefined,
        q: params.searchQuery || undefined,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
      },
      withCredentials: true,
    },
  );

  return res.data;
}

export async function fetchMangaManagementDetail(apiUrl: string, mangaId: string) {
  const res = await axios.get<MangaDetail>(
    `${apiUrl}/api/manga/admin/management/${mangaId}`,
    { withCredentials: true },
  );

  return res.data;
}

export async function updateMangaPublication({
  apiUrl,
  isPublish,
  mangaId,
}: {
  apiUrl: string;
  isPublish: boolean;
  mangaId: string;
}) {
  await axios.patch(
    `${apiUrl}/api/manga/admin/story/${mangaId}/publish`,
    { isPublish },
    { withCredentials: true },
  );
}

export async function updateMangaEnforcement({
  apiUrl,
  mangaId,
  reason,
  status,
}: {
  apiUrl: string;
  mangaId: string;
  reason?: string;
  status: "normal" | "suspended" | "banned";
}) {
  await axios.patch(
    `${apiUrl}/api/manga/admin/story/${mangaId}/enforcement`,
    reason ? { reason, status } : { status },
    { withCredentials: true },
  );
}

export function getActionSuccessCopy(actionDialog: ActionDialogType) {
  if (actionDialog === "publish") {
    return {
      description: "This story is now visible on the platform.",
      title: "Manga published",
    };
  }
  if (actionDialog === "unpublish") {
    return {
      description: "This story has been hidden from public view.",
      title: "Manga unpublished",
    };
  }
  if (actionDialog === "suspend") {
    return {
      description: "The story has been suspended successfully.",
      title: "Manga suspended",
    };
  }
  if (actionDialog === "ban") {
    return {
      description: "The story has been banned successfully.",
      title: "Manga banned",
      variant: "destructive" as const,
    };
  }
  return {
    description: "The story has returned to normal status.",
    title: "Restriction removed",
  };
}
