import { buildHumanMessage } from "@/lib/audit-ui";
import type { AuditLogUI, AuditListParams } from "./types";

export function formatAuditTime(iso?: string) {
  if (!iso) return "--";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return String(iso);
  return date.toLocaleString("vi-VN", { hour12: false });
}

export function formatDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getDefaultAuditDateRange() {
  return {
    customTo: formatDateInput(new Date()),
    customFrom: formatDateInput(
      new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    ),
  };
}

export function mapAuditRowToUI(row: any): AuditLogUI {
  const actorUsername =
    row?.actor_id?.username || row?.actor_name || row?.actorUsername || "Unknown";
  const actorEmail =
    row?.actor_id?.email || row?.actor_email || row?.actorEmail || "No email";
  const actorRole = row?.actor_role || row?.actor_id?.role || "system";

  return {
    id: String(row?._id ?? row?.id ?? ""),
    time: formatAuditTime(row?.createdAt),
    actor: {
      name: actorUsername,
      email: actorEmail,
      role: String(actorRole),
      avatar: row?.actor_id?.avatar || row?.actor_avatar || row?.actorAvatar,
    },
    action: String(row?.action ?? "unknown"),
    summary: buildHumanMessage(row),
    risk: row?.risk ?? "low",
    seen: Boolean(row?.seen),
    approval: row?.approval ?? "pending",
    targetType: row?.target_type ? String(row.target_type) : undefined,
    targetId: row?.target_id ? String(row.target_id) : undefined,
    before: row?.before,
    after: row?.after,
    note: row?.note,
    evidenceImages: row?.evidenceImages ?? [],
    adminNote: row?.adminNote,
  };
}

export function buildAuditListParams({
  actionFilter,
  customFrom,
  customTo,
  dateFilter,
  debouncedSearch,
  highRiskOnly,
  roleFilter,
  statusFilter,
}: {
  actionFilter: string;
  customFrom: string;
  customTo: string;
  dateFilter: string;
  debouncedSearch: string;
  highRiskOnly: boolean;
  roleFilter: string;
  statusFilter: string;
}): AuditListParams {
  const hasCustomRange = dateFilter === "custom";

  return {
    search: debouncedSearch || undefined,
    role: roleFilter !== "all" ? roleFilter : undefined,
    action: actionFilter !== "all" ? actionFilter : undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    risk: highRiskOnly ? "high" : undefined,
    dateRange:
      dateFilter !== "all" && dateFilter !== "custom" ? dateFilter : undefined,
    from: hasCustomRange && customFrom ? customFrom : undefined,
    to: hasCustomRange && customTo ? customTo : undefined,
  };
}

export async function readBlobErrorMessage(error: any) {
  const fallback =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Unable to export audit logs.";

  const blob = error?.response?.data;
  if (!(blob instanceof Blob)) return fallback;

  try {
    const text = await blob.text();
    const parsed = JSON.parse(text);
    return parsed?.message || parsed?.error || fallback;
  } catch {
    return fallback;
  }
}

export function getRoleColor(role: string) {
  switch (String(role || "").toLowerCase()) {
    case "system":
      return "border-slate-200 bg-slate-100 text-slate-700";
    case "content_moderator":
      return "border-blue-200 bg-blue-100 text-blue-800";
    case "community_manager":
      return "border-purple-200 bg-purple-100 text-purple-800";
    case "admin":
      return "border-emerald-200 bg-emerald-100 text-emerald-800";
    default:
      return "border-slate-200 bg-slate-100 text-slate-700";
  }
}

export function getActionTone(action: string) {
  switch (action) {
    case "approve":
    case "report_status_resolved":
    case "comment_restored":
    case "reply_restored":
    case "admin_reset_user_status":
      return "border border-emerald-200 bg-emerald-50 text-emerald-700";
    case "reject":
    case "request_changes":
    case "report_status_rejected":
    case "delete_comment":
    case "ban_user":
    case "auto_reject":
      return "border border-rose-200 bg-rose-50 text-rose-700";
    case "hide_content":
    case "comment_hidden":
    case "reply_hidden":
      return "border border-orange-200 bg-orange-50 text-orange-700";
    case "warn_user":
      return "border border-amber-200 bg-amber-50 text-amber-700";
    case "mute_user":
      return "border border-blue-200 bg-blue-50 text-blue-700";
    case "admin_update_staff_status":
      return "border border-indigo-200 bg-indigo-50 text-indigo-700";
    case "admin_set_role":
      return "border border-violet-200 bg-violet-50 text-violet-700";
    default:
      return "border border-slate-200 bg-slate-100 text-slate-700";
  }
}

export function getRiskTone(risk: string) {
  switch (risk) {
    case "low":
      return "bg-green-50 text-green-700 border border-green-200";
    case "medium":
      return "bg-yellow-50 text-yellow-700 border border-yellow-200";
    case "high":
      return "bg-red-50 text-red-700 border border-red-200";
    default:
      return "bg-gray-50 text-gray-700";
  }
}

export function getApprovalTone(approval?: string) {
  return approval === "approved"
    ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
    : "border border-amber-200 bg-amber-50 text-amber-700";
}

export function getSeenTone(seen?: boolean) {
  return seen
    ? "border border-slate-200 bg-slate-100 text-slate-700"
    : "border border-orange-200 bg-orange-50 text-orange-700";
}

