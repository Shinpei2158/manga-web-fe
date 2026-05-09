import axios from "axios";
import type { WorkspaceReport } from "@/lib/report-workspace";
import type { ReportResolutionAction, ReportStatus } from "@/lib/report-workspace";
import type { GroupStatusFilter, WorkspaceTab } from "./types";
import {
  getReportErrorMessage,
  logReportAxiosError,
  normalizeReportStaffRole,
} from "./utils";

export async function fetchReportStaffRole(apiUrl?: string) {
  if (!apiUrl) {
    return {
      error: "Missing NEXT_PUBLIC_API_URL.",
      role: null,
    };
  }

  try {
    const response = await axios.get(`${apiUrl}/api/auth/me`, {
      withCredentials: true,
    });

    return {
      error: null,
      role: normalizeReportStaffRole(
        response.data?.role || response.data?.user?.role,
      ),
    };
  } catch (err: any) {
    return {
      error: getReportErrorMessage(err),
      role: null,
    };
  }
}

export async function fetchReportWorkspaceItems(
  apiUrl: string | undefined,
  params: {
    limit: number;
    page: number;
    searchTerm: string;
    statusFilter: GroupStatusFilter;
    tab: WorkspaceTab;
  },
) {
  if (!apiUrl) {
    return {
      error: "Missing NEXT_PUBLIC_API_URL.",
      items: [] as WorkspaceReport[],
      limit: params.limit,
      page: params.page,
      total: 0,
      totalPages: 1,
    };
  }

  const endpoint = `${apiUrl}/api/reports`;

  try {
    const response = await axios.get(endpoint, {
      withCredentials: true,
      params: {
        limit: params.limit,
        page: params.page,
        q: params.searchTerm.trim() || undefined,
        status:
          params.statusFilter === "all" ? undefined : params.statusFilter,
        targetGroup: params.tab,
      },
    });
    const payload = response.data as any;
    const items = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.items)
        ? payload.items
        : [];
    const limit = Number(payload?.limit ?? params.limit);
    const total = Number(payload?.total ?? items.length);

    return {
      error: null,
      items,
      limit,
      page: Number(payload?.page ?? params.page),
      total,
      totalPages: Math.max(
        1,
        Number(payload?.totalPages ?? Math.ceil(total / Math.max(limit, 1))),
      ),
    };
  } catch (err: any) {
    logReportAxiosError("[Admin Reports]", endpoint, err);
    return {
      error: getReportErrorMessage(err),
      items: [] as WorkspaceReport[],
      limit: params.limit,
      page: params.page,
      total: 0,
      totalPages: 1,
    };
  }
}

export async function moderateReport(
  apiUrl: string,
  reportId: string,
  payload: Record<string, unknown>,
  currentStatus?: string,
) {
  const endpoint = `${apiUrl}/api/reports/${reportId}/moderate`;
  const finalStatus = String(payload.status || "");
  const shouldCloseFromNew =
    finalStatus === "resolved" || finalStatus === "rejected";

  if (currentStatus === "new" && shouldCloseFromNew) {
    await axios.put(endpoint, { status: "in-progress" }, { withCredentials: true });
  }

  const response = await axios.put(endpoint, payload, {
    withCredentials: true,
  });

  return response.data as WorkspaceReport;
}

export function buildReportMutationPayload({
  status,
  note,
  resolutionAction,
}: {
  status?: ReportStatus;
  note?: string;
  resolutionAction?: ReportResolutionAction;
}) {
  const normalizedNote = note?.trim();
  const payload: Record<string, unknown> = {};

  if (status) payload.status = status;
  if (normalizedNote) payload.resolution_note = normalizedNote;
  if (resolutionAction) {
    payload.resolution_action = resolutionAction;
    payload.status = "resolved";
  }

  return {
    normalizedNote,
    payload,
  };
}
