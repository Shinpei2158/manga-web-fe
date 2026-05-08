import type { AuditDashboardSummary, DashboardLoadingState } from "./types";

export const surfaceCardClass =
  "rounded-2xl border border-slate-200/80 bg-white/90 shadow-[0_1px_3px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-950/85";

export const initialLoading: DashboardLoadingState = {
  summary: true,
  weekly: true,
  recent: true,
  policies: true,
  audit: true,
  mangaSummary: true,
  mangaGrowth: true,
  notiStats: true,
};

export const emptyAuditSummary: AuditDashboardSummary = {
  total: 0,
  unseen: 0,
  pendingApproval: 0,
  highRisk: 0,
};
