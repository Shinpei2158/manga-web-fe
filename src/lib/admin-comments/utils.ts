import type {
  Comment,
  CommentSortColumn,
  SortDirection,
} from "@/components/comment/comment-table";

export function isAbsoluteUrl(value: string) {
  return /^(?:[a-z]+:)?\/\//i.test(value) || value.startsWith("data:");
}

export function resolveAvatarUrl(rawAvatar?: string, apiUrl?: string) {
  if (!rawAvatar) return undefined;
  if (isAbsoluteUrl(rawAvatar)) return rawAvatar;
  if (!apiUrl) return undefined;

  const normalizedApi = apiUrl.replace(/\/+$/, "");
  const normalizedAvatar = rawAvatar.replace(/^\/+/, "");
  return `${normalizedApi}/assets/avatars/${normalizedAvatar}`;
}

export function extractPlainText(content: string) {
  return String(content || "")
    .replace(/<div><br\s*\/?><\/div>/gi, " ")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/div>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function compareStrings(a?: string | null, b?: string | null) {
  return String(a || "").localeCompare(String(b || ""), undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

export function compareDates(a?: string | null, b?: string | null) {
  const first = a ? new Date(a).getTime() : 0;
  const second = b ? new Date(b).getTime() : 0;
  return first - second;
}

export function nextSortDirection(
  activeColumn: CommentSortColumn,
  currentColumn: CommentSortColumn,
  currentDirection: SortDirection,
): SortDirection {
  if (activeColumn !== currentColumn) return "asc";
  return currentDirection === "asc" ? "desc" : "asc";
}

export function mapCommentRow(comment: any, apiUrl?: string): Comment {
  return {
    id: comment._id,
    commentId: comment._id?.slice(-6)?.toUpperCase?.() ?? "N/A",
    username: comment.user_id?.username || "Unknown",
    userEmail: comment.user_id?.email || "",
    userRole: comment.user_id?.role || "",
    userAvatar: resolveAvatarUrl(comment.user_id?.avatar, apiUrl),
    storyTitle: comment.chapter_id?.manga_id?.title || "Unknown",
    storyId: comment.chapter_id?.manga_id?._id || "",
    chapter: comment.chapter_id?.title || "N/A",
    chapterId: comment.chapter_id?._id || "",
    content: comment.content ?? "",
    plainContent: extractPlainText(comment.content ?? ""),
    createdAt: comment.createdAt,
    date: formatCommentDate(comment.createdAt),
    status: comment.is_delete ? "hidden" : "visible",
    replyCount: Number(comment.replyCount ?? 0),
    replyUsernames: Array.isArray(comment.replyUsernames)
      ? comment.replyUsernames
      : [],
  };
}

export function mapMangaOption(manga: any) {
  return {
    id: manga._id,
    title: manga.title,
  };
}

export function mapChapterOption(chapter: any) {
  return {
    id: chapter._id?.toString?.() ?? chapter._id,
    title: chapter.title,
  };
}

export function formatCommentDate(value?: string) {
  const date = new Date(value || "");
  return Number.isNaN(date.getTime())
    ? "N/A"
    : date.toLocaleString("vi-VN", { hour12: false });
}

export function isNewest24h(comment: Comment) {
  const createdAt = comment.createdAt ? new Date(comment.createdAt).getTime() : 0;
  return createdAt > 0 && Date.now() - createdAt <= 24 * 60 * 60 * 1000;
}

export function sortComments(
  comments: Comment[],
  sortColumn: CommentSortColumn,
  sortDirection: SortDirection,
) {
  const sorted = [...comments];

  sorted.sort((first, second) => {
    let result = 0;

    switch (sortColumn) {
      case "commentId":
        result = compareStrings(first.commentId, second.commentId);
        break;
      case "user":
        result = compareStrings(first.username, second.username);
        break;
      case "manga":
        result = compareStrings(first.storyTitle, second.storyTitle);
        break;
      case "chapter":
        result = compareStrings(first.chapter, second.chapter);
        break;
      case "date":
        result = compareDates(first.createdAt, second.createdAt);
        break;
      default:
        result = 0;
    }

    return sortDirection === "asc" ? result : -result;
  });

  return sorted;
}

