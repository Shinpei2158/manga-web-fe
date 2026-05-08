"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import type {
  StaffInboxFilter,
  StaffNotificationItem,
  StaffNotificationMe,
} from "@/lib/admin-my-notifications/types";
import {
  buildStaffNotificationOverview,
  filterStaffNotifications,
  sortStaffNotifications,
} from "@/lib/admin-my-notifications/utils";

export function useAdminMyNotificationsController() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [me, setMe] = useState<StaffNotificationMe | null>(null);
  const [notifications, setNotifications] = useState<StaffNotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<StaffInboxFilter>("all");
  const [busyAction, setBusyAction] = useState<string | null>(null);

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

        const response = await axios.get<StaffNotificationItem[]>(
          `${apiUrl}/api/notification/get-all-noti-for-user/${me.user_id}`,
          { withCredentials: true },
        );

        setNotifications(sortStaffNotifications(response.data ?? []));
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
  }, [apiUrl, me?.user_id]);

  const overview = useMemo(
    () => buildStaffNotificationOverview(notifications),
    [notifications],
  );
  const filteredNotifications = useMemo(
    () =>
      filterStaffNotifications({
        activeFilter,
        notifications,
        search,
      }),
    [activeFilter, notifications, search],
  );

  const markAsRead = async (notificationId: string) => {
    if (!apiUrl) return;

    try {
      setBusyAction(`read:${notificationId}`);
      await axios.patch(
        `${apiUrl}/api/notification/mark-noti-as-read/${notificationId}`,
        {},
        { withCredentials: true },
      );

      setNotifications((current) =>
        current.map((item) =>
          item._id === notificationId ? { ...item, is_read: true } : item,
        ),
      );
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

      setNotifications((current) =>
        current.map((item) => ({ ...item, is_read: true })),
      );
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

      setNotifications((current) =>
        current.map((item) =>
          item._id === notificationId
            ? { ...item, is_save: !item.is_save, is_read: true }
            : item,
        ),
      );
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

      setNotifications((current) =>
        current.filter((item) => item._id !== notificationId),
      );
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
    deleteNotification,
    error,
    filteredNotifications,
    loading,
    markAllAsRead,
    markAsRead,
    me,
    notifications,
    overview,
    search,
    setActiveFilter,
    setSearch,
    toggleSave,
  };
}

export type AdminMyNotificationsController = ReturnType<
  typeof useAdminMyNotificationsController
>;
