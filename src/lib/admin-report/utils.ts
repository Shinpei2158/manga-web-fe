import type { MergedReportItem } from "@/lib/report-workspace";
import { isDoneStatus } from "@/lib/report-workspace";
import type { StaffRole } from "./types";

export function normalizeReportStaffRole(value: unknown): StaffRole {
  const normalized = String(value || "").toLowerCase().trim();
  if (
    normalized === "admin" ||
    normalized === "content_moderator" ||
    normalized === "community_manager"
  ) {
    return normalized;
  }
  return null;
}

export function logReportAxiosError(
  tag: string,
  endpoint: string,
  err: any,
  extra?: any,
) {
  const status = err?.response?.status;
  const data = err?.response?.data;
  const message = err?.message;

  console.group(`${tag} ERROR FULL`);
  console.log("url:", endpoint);
  console.log("status:", status);
  console.log("data:", data);
  console.log("data (stringify):", JSON.stringify(data, null, 2));
  console.log("message:", message);
  if (!err?.response) console.log("err.request:", err?.request);
  if (extra) console.log("extra:", extra);
  console.groupEnd();
}

export function getReportErrorMessage(err: any) {
  return (
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    "Unable to load reports."
  );
}

export function getReportGroupStatusMeta(group: {
  doneCount: number;
  totalCount: number;
}) {
  if (group.doneCount === group.totalCount && group.totalCount > 0) {
    return {
      className: "border-emerald-200 bg-emerald-50 text-emerald-700",
      label: "Done",
    };
  }

  return {
    className: "border-amber-200 bg-amber-50 text-amber-700",
    label: "In progress",
  };
}

export function getEditableItemReportIds(
  item: MergedReportItem,
  mode: "note" | "status",
) {
  const unresolved = item.reports
    .filter((report) => !isDoneStatus(report.status))
    .map((report) => report._id);

  if (unresolved.length > 0) return unresolved;
  if (mode === "note" && item.reports[0]?._id) return [item.reports[0]._id];
  return [];
}
