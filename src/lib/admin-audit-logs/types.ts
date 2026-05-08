import type { AuditApproval, AuditRisk } from "@/lib/audit-ui";

export type AuditMe = {
  userId?: string;
  email?: string;
  role?: string;
};

export type AuditLogActor = {
  name: string;
  email: string;
  role: string;
  avatar?: string;
};

export type AuditLogUI = {
  id: string;
  time: string;
  actor: AuditLogActor;
  action: string;
  summary: string;
  risk: AuditRisk;
  seen: boolean;
  approval: AuditApproval;
  targetType?: string;
  targetId?: string;
  before?: Record<string, any>;
  after?: Record<string, any>;
  note?: string;
  evidenceImages?: string[];
  adminNote?: string;
};

export type AuditSummary = {
  total: number;
  unseen: number;
  pendingApproval: number;
  highRisk: number;
};

export type AuditLogFilters = {
  search: string;
  roleFilter: string;
  actionFilter: string;
  statusFilter: string;
  dateFilter: string;
  customFrom: string;
  customTo: string;
  highRiskOnly: boolean;
};

export type AuditListParams = {
  search?: string;
  role?: string;
  action?: string;
  status?: string;
  risk?: string;
  dateRange?: string;
  from?: string;
  to?: string;
};

export type AuditDetailRecord = Record<string, any>;

