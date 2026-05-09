"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import type {
  StaffInboxFilter,
  StaffNotificationItem,
  StaffNotificationMe,
  StaffNotificationOverview,
} from "@/lib/admin-my-notifications/types";

const STAFF_NOTIFICATION_PAGE_SIZE = 10;

export function useAdminMyNotificationsController() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [me, setMe] = useState<StaffNotificationMe | null>(null);
  const [notifications, setNotifications] = useState<StaffNotificationItem[]>([]);
  const [overview, setOverview] = useState<StaffNotificationOverview>({
    read: 0,
    saved: 0,
    total: 0,
    unread: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<StaffInboxFilter>("all");
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const raw = Cookies.get("user_normal_info");
    if (!raw) {
      setMe(null);
      setLoading(false);
      setError("Unable to identify the current staff account.");
      return;
    }

    try {
      const decoded = decodeURIComponent(raw);
      setMe(JSON.parse(decoded));
    } catch {
      setMe(null);
      setLoading(false);
      setError("Unable to read current staff information.");
    }
  }, []);

  useEffect(() => {
    if (!apiUrl || !me?.user_id) return;

    const fetchNotifications = async () => {
      try {
        setLoading(true);
        setError(null);

        const [overviewResponse, listResponse] = await Promise.all([
          axios.get<StaffNotificationOverview>(
            `${apiUrl}/api/notification/me/stats`,
            { withCredentials: true },
          ),
          axios.get<{
            items?: StaffNotificationItem[];
            limit?: number;
            page?: number;
            total?: number;
            totalPages?: number;
          }>(`${apiUrl}/api/notification/get-all-noti-for-user/${me.user_id}`, {
            params: {
              limit: STAFF_NOTIFICATION_PAGE_SIZE,
              page: currentPage,
              q: search.trim() || undefined,
              saved: activeFilter === "saved" ? "Saved" : undefined,
              status: activeFilter === "unread" ? "Unread" : undefined,
            },
            withCredentials: true,
          }),
        ]);

        const rows = Array.isArray(listResponse.data)
          ? listResponse.data
          : Array.isArray(listResponse.data?.items)
            ? listResponse.data.items
            : [];

        setOverview({
          read: Number(overviewResponse.data?.read ?? 0),
          saved: Number(overviewResponse.data?.saved ?? 0),
          total: Number(overviewResponse.data?.total ?? 0),
          unread: Number(overviewResponse.data?.unread ?? 0),
        });
        setNotifications(rows);
        setTotalItems(Number(listResponse.data?.total ?? rows.length));
        setTotalPages(Number(listResponse.data?.totalPages ?? 1));
        setCurrentPage(Number(listResponse.data?.page ?? currentPage));
      } catch (error: any) {
        const message =
          error?.response?.data?.message || "Failed to load notifications.";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    void fetchNotifications();
  }, [activeFilter, apiUrl, currentPage, me?.user_id, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, search]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const refreshNotifications = async () => {
    if (!apiUrl || !me?.user_id) return;

    try {
      const [overviewResponse, listResponse] = await Promise.all([
        axios.get<StaffNotificationOverview>(`${apiUrl}/api/notification/me/stats`, {
          withCredentials: true,
        }),
        axios.get<{
          items?: StaffNotificationItem[];
          page?: number;
          total?: number;
          totalPages?: number;
        }>(`${apiUrl}/api/notification/get-all-noti-for-user/${me.user_id}`, {
          params: {
            limit: STAFF_NOTIFICATION_PAGE_SIZE,
            page: currentPage,
            q: search.trim() || undefined,
            saved: activeFilter === "saved" ? "Saved" : undefined,
            status: activeFilter === "unread" ? "Unread" : undefined,
          },
          withCredentials: true,
        }),
      ]);
      const rows = Array.isArray(listResponse.data)
        ? listResponse.data
        : Array.isArray(listResponse.data?.items)
          ? listResponse.data.items
          : [];

      setOverview({
        read: Number(overviewResponse.data?.read ?? 0),
        saved: Number(overviewResponse.data?.saved ?? 0),
        total: Number(overviewResponse.data?.total ?? 0),
        unread: Number(overviewResponse.data?.unread ?? 0),
      });
      setNotifications(rows);
      setTotalItems(Number(listResponse.data?.total ?? rows.length));
      setTotalPages(Number(listResponse.data?.totalPages ?? 1));
      setCurrentPage(Number(listResponse.data?.page ?? currentPage));
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Failed to refresh notifications.";
      setError(message);
      toast.error(message);
    }
  };
  const markAsRead = async (notificationId: string) => {
    if (!apiUrl) return;

    try {
      setBusyAction(`read:${notificationId}`);
      await axios.patch(
        `${apiUrl}/api/notification/mark-noti-as-read/${notificationId}`,
        {},
        { withCredentials: true },
      );
      await refreshNotifications();
    } catch {
      toast.error("Failed to mark notification as read.");
    } finally {
      setBusyAction(null);
    }
  };

  const markAllAsRead = async () => {
    if (!apiUrl || overview.unread === 0) return;

    try {
      setBusyAction("mark-all");
      await axios.patch(
        `${apiUrl}/api/notification/mark-all-noti-as-read/`,
        {},
        { withCredentials: true },
      );
      await refreshNotifications();
      toast.success("All notifications marked as read.");
    } catch {
      toast.error("Failed to mark all notifications as read.");
    } finally {
      setBusyAction(null);
    }
  };

  const toggleSave = async (notificationId: string) => {
    if (!apiUrl) return;

    try {
      setBusyAction(`save:${notificationId}`);
      await axios.patch(
        `${apiUrl}/api/notification/save-noti/${notificationId}`,
        {},
        { withCredentials: true },
      );
      await refreshNotifications();
    } catch {
      toast.error("Failed to update saved state.");
    } finally {
      setBusyAction(null);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    if (!apiUrl) return;

    try {
      setBusyAction(`delete:${notificationId}`);
      await axios.delete(
        `${apiUrl}/api/notification/delete-noti/${notificationId}`,
        { withCredentials: true },
      );
      await refreshNotifications();
      toast.success("Notification deleted.");
    } catch {
      toast.error("Failed to delete notification.");
    } finally {
      setBusyAction(null);
    }
  };

  return {
    activeFilter,
    busyAction,
    currentPage,
    deleteNotification,
    error,
    loading,
    markAllAsRead,
    markAsRead,
    me,
    notifications,
    overview,
    search,
    setActiveFilter,
    setCurrentPage,
    setSearch,
    totalItems,
    totalPages,
    toggleSave,
  };
}

export type AdminMyNotificationsController = ReturnType<
  typeof useAdminMyNotificationsController
>;
