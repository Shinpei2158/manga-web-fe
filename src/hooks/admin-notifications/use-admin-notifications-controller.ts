"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type {
  NotificationOverview,
  NotificationVM,
} from "@/types/notification";
import {
  ADMIN_NOTIFICATIONS_PAGE_SIZE,
  DEFAULT_NOTIFICATION_FILTERS,
} from "@/lib/admin-notifications/constants";
import type { AdminNotificationFilters } from "@/lib/admin-notifications/types";
import {
  fetchAdminNotificationOverview,
  fetchAdminNotifications,
  logNotificationFetchError,
  sendAdminNotification,
} from "@/lib/admin-notifications/api";

const API = process.env.NEXT_PUBLIC_API_URL!;

export function useAdminNotificationsController() {
  const [notifications, setNotifications] = useState<NotificationVM[]>([]);
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationVM | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<NotificationVM | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filters, setFilters] = useState<AdminNotificationFilters>({
    ...DEFAULT_NOTIFICATION_FILTERS,
  });
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [overview, setOverview] = useState<NotificationOverview>({
    read: 0,
    saved: 0,
    total: 0,
    unread: 0,
  });
  const [usersMap, setUsersMap] = useState<Record<string, string>>({});
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOverview = useCallback(async () => {
    try {
      setOverview(await fetchAdminNotificationOverview(API));
    } catch (error) {
      console.error("[Admin Noti Overview] Network error:", error);
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchAdminNotifications({
        apiUrl: API,
        search: filters.search,
        status: filters.status,
        saved: filters.saved,
        sort: filters.sort,
        page: currentPage,
        limit: ADMIN_NOTIFICATIONS_PAGE_SIZE,
      });
      setNotifications(response.items);
      setTotalItems(response.total);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load notifications (network error).",
      );
      setNotifications([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters.saved, filters.search, filters.sort, filters.status]);

  useEffect(() => {
    setUsersMap({});
    void fetchOverview();
  }, [fetchOverview]);

  useEffect(() => {
    void fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => {
        const nextSearch = searchInput.trim();
        if (prev.search === nextSearch) return prev;
        return { ...prev, search: nextSearch };
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters.status, filters.saved, filters.search, filters.sort]);

  const paginatedNotifications = useMemo(() => notifications, [notifications]);

  const handleViewDetail = (notification: NotificationVM) => {
    setSelectedNotification(notification);
    setIsModalOpen(true);
  };

  const handleMarkAsRead = async (id: string, receiverId?: string) => {
    const current = notifications.find((item) => item._id === id);
    if (!current || current.status === "Read") return;

    try {
      setBusyId(id);
      const url = `${API}/api/admin/notifications/${id}/mark-as-read`;
      const resp = await fetch(url, {
        body: JSON.stringify({ receiver_id: receiverId }),
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
      });

      if (!resp.ok) {
        const data = await logNotificationFetchError(
          "[Admin Mark Noti As Read]",
          url,
          resp,
        );
        toast.error(data?.message ?? "Failed to update notification status.");
        return;
      }

      updateNotification(id, { status: "Read" });
      setOverview((prev) => ({
        ...prev,
        read: prev.read + 1,
        unread: Math.max(prev.unread - 1, 0),
      }));
      toast.success("Notification marked as read.");
    } catch (error) {
      console.error("Failed to update notification:", error);
      toast.error("Failed to update notification (network error).");
    } finally {
      setBusyId(null);
    }
  };

  const updateNotification = (id: string, values: Partial<NotificationVM>) => {
    setNotifications((prev) =>
      prev.map((item) => (item._id === id ? { ...item, ...values } : item)),
    );
    setSelectedNotification((prev) =>
      prev && prev._id === id ? { ...prev, ...values } : prev,
    );
  };

  const handleResend = async (notification: NotificationVM) => {
    try {
      setBusyId(notification._id);
      await sendAdminNotification({
        apiUrl: API,
        body: notification.body,
        receiverId: notification.receiver_id,
        title: notification.title,
      });

      toast.success("Notification resent successfully.");
      await Promise.all([fetchNotifications(), fetchOverview()]);
    } catch (error) {
      console.error("Failed to resend notification:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to resend notification (network error).",
      );
    } finally {
      setBusyId(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    const { _id, receiver_id, status, is_save } = deleteTarget;
    const url = `${API}/api/admin/notifications/${_id}`;

    try {
      setBusyId(_id);
      const resp = await fetch(url, {
        body: JSON.stringify({ receiver_id }),
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        method: "DELETE",
      });

      if (!resp.ok) {
        const data = await logNotificationFetchError(
          "[Admin Delete Notification]",
          url,
          resp,
        );
        toast.error(data?.message ?? "Failed to delete notification.");
        return;
      }

      setNotifications((prev) => prev.filter((item) => item._id !== _id));
      setOverview((prev) => ({
        read: status === "Read" ? Math.max(prev.read - 1, 0) : prev.read,
        saved: is_save ? Math.max(prev.saved - 1, 0) : prev.saved,
        total: Math.max(prev.total - 1, 0),
        unread:
          status === "Unread" ? Math.max(prev.unread - 1, 0) : prev.unread,
      }));

      if (selectedNotification?._id === _id) {
        setSelectedNotification(null);
        setIsModalOpen(false);
      }

      setDeleteTarget(null);
      toast.success("Notification deleted.");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete notification (network error).");
    } finally {
      setBusyId(null);
    }
  };

  const handleToggleSave = async (id: string, receiverId: string) => {
    const current = notifications.find((item) => item._id === id);
    if (!current) return;

    const url = `${API}/api/admin/notifications/${id}/toggle-save`;

    try {
      setBusyId(id);
      const resp = await fetch(url, {
        body: JSON.stringify({ receiver_id: receiverId }),
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
      });

      if (!resp.ok) {
        const data = await logNotificationFetchError(
          "[Admin Toggle Save Noti]",
          url,
          resp,
        );
        toast.error(data?.message ?? "Failed to toggle saved state.");
        return;
      }

      updateNotification(id, { is_save: !current.is_save });
      setOverview((prev) => ({
        ...prev,
        saved: current.is_save ? Math.max(prev.saved - 1, 0) : prev.saved + 1,
      }));
      toast.success(
        current.is_save ? "Removed from saved." : "Saved successfully.",
      );
    } catch (error) {
      console.error("Toggle save failed:", error);
      toast.error("Failed to toggle saved state (network error).");
    } finally {
      setBusyId(null);
    }
  };

  const handleResetFilters = () => {
    setSearchInput("");
    setFilters({ ...DEFAULT_NOTIFICATION_FILTERS });
    setCurrentPage(1);
  };

  return {
    busyId,
    confirmDelete,
    currentPage,
    deleteTarget,
    filters,
    handleMarkAsRead,
    handleResetFilters,
    handleResend,
    handleToggleSave,
    handleViewDetail,
    isModalOpen,
    loading,
    overview,
    paginatedNotifications,
    searchInput,
    selectedNotification,
    setCurrentPage,
    setDeleteTarget,
    setFilters,
    setIsModalOpen,
    setSearchInput,
    totalItems,
    totalPages,
    usersMap,
  };
}

export type AdminNotificationsController = ReturnType<
  typeof useAdminNotificationsController
>;
