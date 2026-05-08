import axios from "axios";
import type { WorkspaceReport } from "@/lib/report-workspace";
import type { ReportResolutionAction, ReportStatus } from "@/lib/report-workspace";
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
  searchTerm: string,
) {
  if (!apiUrl) {
    return {
      error: "Missing NEXT_PUBLIC_API_URL.",
      items: [] as WorkspaceReport[],
    };
  }

  const endpoint = `${apiUrl}/api/reports`;

  try {
    const response = await axios.get(endpoint, {
      withCredentials: true,
      params: {
        limit: 300,
        page: 1,
        q: searchTerm.trim() || undefined,
      },
    });

    return {
      error: null,
      items: Array.isArray(response.data)
        ? response.data
        : Array.isArray((response.data as any)?.items)
          ? (response.data as any).items
          : [],
    };
  } catch (err: any) {
    logReportAxiosError("[Admin Reports]", endpoint, err);
    return {
      error: getReportErrorMessage(err),
      items: [] as WorkspaceReport[],
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
