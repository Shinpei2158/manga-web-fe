"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  AUDIT_ITEMS_PER_PAGE,
  emptyAuditSummary,
} from "@/lib/admin-audit-logs/constants";
import type {
  AuditLogFilters,
  AuditLogUI,
  AuditMe,
  AuditSummary,
} from "@/lib/admin-audit-logs/types";
import {
  buildAuditListParams,
  getDefaultAuditDateRange,
  mapAuditRowToUI,
} from "@/lib/admin-audit-logs/utils";
import { useAuditLogListActions } from "./use-audit-log-list-actions";

export function useAuditLogsController() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const defaultRange = useMemo(() => getDefaultAuditDateRange(), []);

  const [me, setMe] = useState<AuditMe | null>(null);
  const [meError, setMeError] = useState<string | null>(null);
  const [logs, setLogs] = useState<AuditLogUI[]>([]);
  const [summary, setSummary] = useState<AuditSummary>(emptyAuditSummary);
  const [loading, setLoading] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("7days");
  const [customFrom, setCustomFrom] = useState(defaultRange.customFrom);
  const [customTo, setCustomTo] = useState(defaultRange.customTo);
  const [highRiskOnly, setHighRiskOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRows, setTotalRows] = useState(0);

  const roleNormalized = useMemo(
    () => String(me?.role || "").toLowerCase(),
    [me?.role],
  );
  const isAdmin = roleNormalized === "admin";
  const canAttemptAdminActions = isAdmin || Boolean(meError);
  const hasCustomRange = dateFilter === "custom";
  const isCustomRangeInvalid =
    hasCustomRange &&
    Boolean(customFrom) &&
    Boolean(customTo) &&
    customFrom > customTo;

  const filters: AuditLogFilters = {
    actionFilter,
    customFrom,
    customTo,
    dateFilter,
    highRiskOnly,
    roleFilter,
    search,
    statusFilter,
  };

  const buildListParams = () =>
    buildAuditListParams({
      actionFilter,
      customFrom,
      customTo,
      dateFilter,
      debouncedSearch,
      highRiskOnly,
      roleFilter,
      statusFilter,
    });

  useEffect(() => {
    if (!apiUrl) return;

    axios
      .get(`${apiUrl}/api/auth/me`, { withCredentials: true })
      .then((response) => {
        setMe(response.data);
        setMeError(null);
      })
      .catch((error: any) => {
        const message =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Unable to verify current role.";
        setMe(null);
        setMeError(message);
      });
  }, [apiUrl]);

  const resetList = () => {
    setLogs([]);
    setSummary(emptyAuditSummary);
    setTotalPages(1);
    setTotalRows(0);
  };

  const fetchLogs = async () => {
    if (!apiUrl) {
      setListError("Missing NEXT_PUBLIC_API_URL.");
      resetList();
      return;
    }

    if (isCustomRangeInvalid) {
      setListError("Start date must be on or before end date.");
      resetList();
      return;
    }

    const endpoint = `${apiUrl}/api/audit-logs`;
    const params = {
      page: currentPage,
      limit: AUDIT_ITEMS_PER_PAGE,
      ...buildListParams(),
    };

    setLoading(true);
    try {
      const response = await axios.get(endpoint, {
        params,
        withCredentials: true,
      });
      const rows = Array.isArray(response.data?.rows) ? response.data.rows : [];
      const nextSummary = response.data?.summary ?? emptyAuditSummary;

      setListError(null);
      setLogs(rows.map(mapAuditRowToUI));
      setSummary({
        total: Number(nextSummary.total ?? 0),
        unseen: Number(nextSummary.unseen ?? 0),
        pendingApproval: Number(nextSummary.pendingApproval ?? 0),
        highRisk: Number(nextSummary.highRisk ?? 0),
      });
      setTotalPages(response.data?.totalPages ?? 1);
      setTotalRows(
        Number(response.data?.total ?? nextSummary.total ?? rows.length),
      );
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Unable to load audit logs.";
      console.error("[AuditLogs] FETCH ERROR", error?.response?.data || error?.message);
      setListError(message);
      resetList();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    apiUrl,
    currentPage,
    roleFilter,
    actionFilter,
    statusFilter,
    highRiskOnly,
    dateFilter,
    customFrom,
    customTo,
    debouncedSearch,
  ]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentPage(1);
      setDebouncedSearch(search.trim());
    }, 350);
    return () => clearTimeout(timeout);
  }, [search]);

  const actions = useAuditLogListActions({
    apiUrl,
    buildListParams,
    canAttemptAdminActions,
    fetchLogs,
    isCustomRangeInvalid,
    setLoading,
    summary,
  });

  const updateFilter = (key: keyof AuditLogFilters, value: string | boolean) => {
    setCurrentPage(1);
    switch (key) {
      case "roleFilter":
        setRoleFilter(String(value));
        break;
      case "actionFilter":
        setActionFilter(String(value));
        break;
      case "statusFilter":
        setStatusFilter(String(value));
        break;
      case "dateFilter":
        setDateFilter(String(value));
        break;
      case "customFrom":
        setCustomFrom(String(value));
        break;
      case "customTo":
        setCustomTo(String(value));
        break;
      case "highRiskOnly":
        setHighRiskOnly(Boolean(value));
        break;
      case "search":
        setSearch(String(value));
        break;
    }
  };

  return {
    apiUrl,
    canAttemptAdminActions,
    currentPage,
    fetchLogs,
    filters,
    ...actions,
    hasCustomRange,
    isAdmin,
    isCustomRangeInvalid,
    listError,
    loading,
    logs,
    me,
    meError,
    openLogDetails: (logId: string) =>
      router.push(`/admin/audit-logs/log-details/${logId}`),
    setCurrentPage,
    summary,
    totalPages,
    totalRows,
    updateFilter,
  };
}

export type AuditLogsController = ReturnType<typeof useAuditLogsController>;
