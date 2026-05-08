import type { FilterState } from "@/components/comment/comment-filters";

export const COMMENTS_ITEMS_PER_PAGE = 10;

export const COMMENT_ALL = {
  MANGA: "",
  CHAPTER: "",
  STATUS: "",
} as const;

export const emptyCommentFilters: FilterState = {
  manga: COMMENT_ALL.MANGA,
  chapter: COMMENT_ALL.CHAPTER,
  user: "",
  status: COMMENT_ALL.STATUS,
  search: "",
};

