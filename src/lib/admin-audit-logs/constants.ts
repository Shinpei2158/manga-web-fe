import { AlertTriangle, Clock, EyeOff, FileText } from "lucide-react";
import type { AuditSummary } from "./types";

export const AUDIT_ITEMS_PER_PAGE = 10;

export const auditSurfaceClass =
  "rounded-2xl border border-slate-200/80 bg-white/90 shadow-[0_1px_3px_rgba(15,23,42,0.04)] backdrop-blur";

export const auditDetailSurfaceClass =
  "rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-white to-slate-50/80 shadow-[0_1px_3px_rgba(15,23,42,0.04)] backdrop-blur";

export const auditInsetSurfaceClass =
  "rounded-xl border border-slate-200/70 bg-slate-50/80";

export const auditDetailInsetSurfaceClass =
  "rounded-xl border border-slate-200/70 bg-gradient-to-br from-white to-slate-50/85";

export const emptyAuditSummary: AuditSummary = {
  total: 0,
  unseen: 0,
  pendingApproval: 0,
  highRisk: 0,
};

export const auditActionOptions = [
  { value: "report_status_new", label: "Report - Status set to New" },
  { value: "report_status_in-progress", label: "Report - Status set to In Progress" },
  { value: "report_status_resolved", label: "Report - Resolved" },
  { value: "report_status_rejected", label: "Report - Rejected" },
  { value: "report_update", label: "Report - Updated" },
  { value: "comment_hidden", label: "Comment - Hidden" },
  { value: "comment_restored", label: "Comment - Restored" },
  { value: "reply_hidden", label: "Reply - Hidden" },
  { value: "reply_restored", label: "Reply - Restored" },
  { value: "mute_user", label: "User - Muted" },
  { value: "ban_user", label: "User - Banned" },
  { value: "admin_reset_user_status", label: "User - Reset Status" },
  { value: "admin_update_staff_status", label: "Staff - Status Updated" },
  { value: "admin_set_role", label: "User - Role Updated" },
];

export function buildAuditSummaryCards(summary: AuditSummary) {
  return [
    {
      title: "Total logs",
      value: summary.total,
      helper: "Matching filters",
      icon: FileText,
      iconClass: "bg-slate-100 text-slate-700",
    },
    {
      title: "Unseen logs",
      value: summary.unseen,
      helper: "Matching filters",
      icon: EyeOff,
      iconClass: "bg-orange-100 text-orange-700",
    },
    {
      title: "Pending approval",
      value: summary.pendingApproval,
      helper: "Matching filters",
      icon: Clock,
      iconClass: "bg-violet-100 text-violet-700",
    },
    {
      title: "High risk",
      value: summary.highRisk,
      helper: "Matching filters",
      icon: AlertTriangle,
      iconClass: "bg-rose-100 text-rose-700",
    },
  ];
}

