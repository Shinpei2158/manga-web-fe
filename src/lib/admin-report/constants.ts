import type { WorkspaceViewState } from "./types";

export const GROUPS_PER_PAGE = 10;

export const INITIAL_VIEW_STATE: WorkspaceViewState = {
  searchTerm: "",
  statusFilter: "all",
  currentPage: 1,
  selectedGroupKey: null,
  focusReportId: null,
  isModalOpen: false,
  confirmGroupKey: null,
};
