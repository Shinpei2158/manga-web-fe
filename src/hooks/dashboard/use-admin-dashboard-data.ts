"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { emptyAuditSummary, initialLoading } from "@/lib/admin-dashboard/constants";
import type {
  AuditDashboardSummary,
  AuditLogsResponse,
  DashboardErrorState,
  DashboardLoadingState,
  DashboardViewModel,
  MangaGrowthPoint,
  MangaSummary,
  NotiStats,
  PolicyRecord,
  RecentAuditItem,
  RecentUserRow,
  UserSummary,
  UsersWeeklyPoint,
} from "@/lib/admin-dashboard/types";
import {
  formatMonthTick,
  formatReadableDate,
  mapRecentAuditRows,
  summarizePolicies,
} from "@/lib/admin-dashboard/utils";

export function useAdminDashboardData(): DashboardViewModel {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [summary, setSummary] = useState<UserSummary | null>(null);
  const [weeklyNew, setWeeklyNew] = useState<UsersWeeklyPoint[]>([]);
  const [recentUsers, setRecentUsers] = useState<RecentUserRow[]>([]);
  const [policies, setPolicies] = useState<PolicyRecord[]>([]);
  const [auditSummary, setAuditSummary] =
    useState<AuditDashboardSummary>(emptyAuditSummary);
  const [recentAuditLogs, setRecentAuditLogs] = useState<RecentAuditItem[]>([]);
  const [mangaSummary, setMangaSummary] = useState<MangaSummary | null>(null);
  const [mangaGrowth, setMangaGrowth] = useState<MangaGrowthPoint[]>([]);
  const [notiStats, setNotiStats] = useState<NotiStats | null>(null);
  const [loading, setLoading] = useState<DashboardLoadingState>(initialLoading);
  const [error, setError] = useState<DashboardErrorState>({});

  useEffect(() => {
    let mounted = true;

    if (!apiUrl) {
      const message = "Missing NEXT_PUBLIC_API_URL.";
      setError({
        summary: message,
        weekly: message,
        recent: message,
        policies: message,
        audit: message,
        mangaSummary: message,
        mangaGrowth: message,
        notiStats: message,
      });
      setLoading({
        summary: false,
        weekly: false,
        recent: false,
        policies: false,
        audit: false,
        mangaSummary: false,
        mangaGrowth: false,
        notiStats: false,
      });
      return () => {
        mounted = false;
      };
    }

    const load = async <T,>(
      key: keyof DashboardLoadingState,
      task: () => Promise<T>,
      onSuccess: (value: T) => void,
    ) => {
      try {
        const result = await task();
        if (mounted) onSuccess(result);
      } catch (caughtError) {
        if (mounted) {
          const message =
            caughtError instanceof Error ? caughtError.message : "Error";
          setError((state) => ({ ...state, [key]: message }));
        }
      } finally {
        if (mounted) {
          setLoading((state) => ({ ...state, [key]: false }));
        }
      }
    };

    load(
      "summary",
      () =>
        axios
          .get<UserSummary>(`${apiUrl}/api/user/admin/summary`, {
            withCredentials: true,
          })
          .then((response) => response.data),
      setSummary,
    );

    load(
      "weekly",
      () =>
        axios
          .get<UsersWeeklyPoint[]>(
            `${apiUrl}/api/user/admin/charts/weekly-new?weeks=4`,
            { withCredentials: true },
          )
          .then((response) => response.data || []),
      setWeeklyNew,
    );

    load(
      "recent",
      () =>
        axios
          .get<RecentUserRow[]>(`${apiUrl}/api/user/admin/recent?limit=5`, {
            withCredentials: true,
          })
          .then((response) => response.data || []),
      setRecentUsers,
    );

    load(
      "policies",
      () =>
        axios
          .get<PolicyRecord[]>(`${apiUrl}/api/policies`, {
            withCredentials: true,
          })
          .then((response) =>
            Array.isArray(response.data) ? response.data : [],
          ),
      setPolicies,
    );

    load(
      "audit",
      () =>
        axios
          .get<AuditLogsResponse>(`${apiUrl}/api/audit-logs`, {
            params: { page: 1, limit: 5 },
            withCredentials: true,
          })
          .then((response) => response.data),
      (data) => {
        const rows = Array.isArray(data?.rows) ? data.rows : [];
        const nextSummary = data?.summary ?? emptyAuditSummary;
        setRecentAuditLogs(mapRecentAuditRows(rows));
        setAuditSummary({
          total: Number(nextSummary.total ?? 0),
          unseen: Number(nextSummary.unseen ?? 0),
          pendingApproval: Number(nextSummary.pendingApproval ?? 0),
          highRisk: Number(nextSummary.highRisk ?? 0),
        });
      },
    );

    load(
      "mangaSummary",
      () =>
        axios
          .get<MangaSummary>(`${apiUrl}/api/manga/admin/summary`, {
            withCredentials: true,
          })
          .then((response) => response.data),
      setMangaSummary,
    );

    load(
      "mangaGrowth",
      () =>
        axios
          .get<MangaGrowthPoint[]>(
            `${apiUrl}/api/manga/admin/charts/monthly-growth?months=6`,
            { withCredentials: true },
          )
          .then((response) => response.data || []),
      setMangaGrowth,
    );

    load(
      "notiStats",
      () =>
        axios
          .get<NotiStats>(`${apiUrl}/api/admin/notifications/stats`, {
            withCredentials: true,
          })
          .then((response) => response.data),
      setNotiStats,
    );

    return () => {
      mounted = false;
    };
  }, [apiUrl]);

  const policySummary = useMemo(() => summarizePolicies(policies), [policies]);
  const weeklyNewChartData = useMemo(
    () =>
      weeklyNew.map((point) => ({
        label: formatReadableDate(`${point.week}T00:00:00`),
        newUsers: point.new,
      })),
    [weeklyNew],
  );
  const storiesGrowthChartData = useMemo(
    () =>
      mangaGrowth.map((point) => ({
        label: formatMonthTick(point.month),
        stories: point.stories,
      })),
    [mangaGrowth],
  );

  return {
    summary,
    weeklyNewChartData,
    recentUsers,
    policySummary,
    auditSummary,
    recentAuditLogs,
    mangaSummary,
    storiesGrowthChartData,
    notiStats,
    loading,
    error,
  };
}
