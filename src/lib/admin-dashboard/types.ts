import type { LucideIcon } from "lucide-react";

export type UserSummary = { total: number; deltaPctMoM: number };
export type UsersWeeklyPoint = { week: string; new: number };
export type RecentUserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  joinDate: string;
};

export type MangaSummary = {
  total: number;
  deltaPctMoM: number;
  published: number;
  byStatus: Record<string, number>;
};
export type MangaGrowthPoint = { month: string; stories: number };

export type PolicyStatus = "Draft" | "Active" | "Archived";
export type PolicyRecord = {
  _id: string;
  title: string;
  slug: string;
  status: PolicyStatus;
  isPublic: boolean;
  updatedAt: string;
};

export type PolicyDashboardSummary = {
  total: number;
  active: number;
  draft: number;
  archived: number;
};

export type NotiStats = { total: number; unread: number; read: number };

export type AuditDashboardSummary = {
  total: number;
  unseen: number;
  pendingApproval: number;
  highRisk: number;
};

export type AuditLogApiRow = {
  _id?: string;
  id?: string;
  createdAt?: string;
  actor_id?: { username?: string; email?: string; role?: string };
  actor_name?: string;
  actor_email?: string;
  actor_role?: string;
  action?: string;
  summary?: string;
  target_id?: string;
  target_type?: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
};

export type AuditLogsResponse = {
  rows?: AuditLogApiRow[];
  summary?: Partial<AuditDashboardSummary>;
};

export type RecentAuditItem = {
  id: string;
  time: string;
  actorName: string;
  actorRole: string;
  actionLabel: string;
  summary: string;
};

export type DashboardLoadingState = {
  summary: boolean;
  weekly: boolean;
  recent: boolean;
  policies: boolean;
  audit: boolean;
  mangaSummary: boolean;
  mangaGrowth: boolean;
  notiStats: boolean;
};

export type DashboardErrorState = {
  summary?: string;
  weekly?: string;
  recent?: string;
  policies?: string;
  audit?: string;
  mangaSummary?: string;
  mangaGrowth?: string;
  notiStats?: string;
};

export type DataMessageTone = "default" | "danger";
export type AttentionCardTone = "danger" | "info" | "amber";

export type AttentionCardProps = {
  title: string;
  subtitle: string;
  value: string;
  detail: string;
  href: string;
  actionLabel: string;
  icon: LucideIcon;
  tone: AttentionCardTone;
  loading: boolean;
  error?: string;
};

export type SnapshotCardProps = {
  title: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  loading: boolean;
  error?: string;
};

export type GovernanceMetric = {
  label: string;
  value: string;
  tone?: "default" | "good" | "warn" | "danger";
};

export type DashboardViewModel = {
  summary: UserSummary | null;
  weeklyNewChartData: { label: string; newUsers: number }[];
  recentUsers: RecentUserRow[];
  policySummary: PolicyDashboardSummary;
  auditSummary: AuditDashboardSummary;
  recentAuditLogs: RecentAuditItem[];
  mangaSummary: MangaSummary | null;
  storiesGrowthChartData: { label: string; stories: number }[];
  notiStats: NotiStats | null;
  loading: DashboardLoadingState;
  error: DashboardErrorState;
};
