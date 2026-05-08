import type {
  CommunityReportAgainstGroup,
  MergedReportItem,
  ReportAgainstGroup,
  ReportResolutionAction,
  ReportStatus,
} from "@/lib/report-workspace";

export type StaffRole =
  | "admin"
  | "content_moderator"
  | "community_manager"
  | null;
export type WorkspaceTab = "content" | "community";
export type GroupStatusFilter = "all" | "needs-review" | "done";

export type WorkspaceViewState = {
  searchTerm: string;
  statusFilter: GroupStatusFilter;
  currentPage: number;
  selectedGroupKey: string | null;
  focusReportId: string | null;
  isModalOpen: boolean;
  confirmGroupKey: string | null;
};

export type ReportGroup =
  | ReportAgainstGroup
  | CommunityReportAgainstGroup;

export type ReportItemAction = {
  status?: ReportStatus;
  note?: string;
  resolutionAction?: ReportResolutionAction;
};

export type ApplyReportMutationParams = {
  reportIds: string[];
  status?: ReportStatus;
  note?: string;
  resolutionAction?: ReportResolutionAction;
  mutationKey: string;
  successMessage: string;
};

export type ReportWorkspaceSubmitItemAction = (
  tab: WorkspaceTab,
  item: MergedReportItem,
  action: ReportItemAction,
) => Promise<void>;
