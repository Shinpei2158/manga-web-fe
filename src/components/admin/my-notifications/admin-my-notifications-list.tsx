"use client";

import { Bell, Bookmark, BookmarkPlus, Check, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { AdminMyNotificationsController } from "@/hooks/admin-my-notifications/use-admin-my-notifications-controller";
import type { StaffNotificationItem } from "@/lib/admin-my-notifications/types";
import { formatStaffNotificationDate } from "@/lib/admin-my-notifications/utils";

export function AdminMyNotificationsList({
  controller: c,
}: {
  controller: AdminMyNotificationsController;
}) {
  if (c.error) {
    return (
      <Card className="rounded-3xl border-red-200 bg-red-50/70 shadow-sm">
        <CardContent className="p-6">
          <p className="text-sm font-medium text-red-700">{c.error}</p>
        </CardContent>
      </Card>
    );
  }

  if (c.loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 text-slate-500">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p>Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-4">
        <p className="text-sm font-medium text-slate-600">
          Showing {c.filteredNotifications.length} notification
          {c.filteredNotifications.length === 1 ? "" : "s"}
        </p>
      </div>

      {c.filteredNotifications.length === 0 ? (
        <EmptyNotificationsState />
      ) : (
        <div className="divide-y divide-slate-200">
          {c.filteredNotifications.map((notification) => (
            <NotificationRow
              key={notification._id}
              controller={c}
              notification={notification}
            />
          ))}
        </div>
      )}
    </div>
  );
}
function EmptyNotificationsState() {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 px-6 py-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
        <Bell className="h-5 w-5" />
      </div>
      <h2 className="text-lg font-semibold text-slate-900">
        No notifications found
      </h2>
      <p className="max-w-md text-sm text-slate-500">
        Try another search term or filter. When new staff alerts arrive, they
        will appear here automatically.
      </p>
    </div>
  );
}

function NotificationRow({
  controller: c,
  notification,
}: {
  controller: AdminMyNotificationsController;
  notification: StaffNotificationItem;
}) {
  const isBusy =
    c.busyAction === `read:${notification._id}` ||
    c.busyAction === `save:${notification._id}` ||
    c.busyAction === `delete:${notification._id}`;

  return (
    <div
      className={`px-6 py-5 transition-colors ${
        notification.is_read ? "bg-white" : "bg-blue-50/40"
      }`}
    >
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {!notification.is_read ? <StatusPill tone="blue">Unread</StatusPill> : null}
            {notification.is_save ? <StatusPill tone="amber">Saved</StatusPill> : null}
            <span className="text-xs text-slate-400">
              {formatStaffNotificationDate(notification.createdAt)}
            </span>
          </div>

          <h2 className="mt-3 text-lg font-semibold text-slate-900">
            {notification.title}
          </h2>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
            {notification.body}
          </p>
        </div>

        <NotificationActions
          controller={c}
          isBusy={isBusy}
          notification={notification}
        />
      </div>
    </div>
  );
}

function StatusPill({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "amber" | "blue";
}) {
  const className =
    tone === "blue"
      ? "border-blue-200 bg-blue-50 text-blue-700"
      : "border-amber-200 bg-amber-50 text-amber-700";

  return (
    <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${className}`}>
      {children}
    </span>
  );
}

function NotificationActions({
  controller: c,
  isBusy,
  notification,
}: {
  controller: AdminMyNotificationsController;
  isBusy: boolean;
  notification: StaffNotificationItem;
}) {
  return (
    <div className="flex flex-wrap gap-2 xl:justify-end">
      {!notification.is_read ? (
        <Button
          variant="outline"
          className="rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
          disabled={isBusy}
          onClick={() => c.markAsRead(notification._id)}
        >
          {c.busyAction === `read:${notification._id}` ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Check className="mr-2 h-4 w-4" />
          )}
          Mark as read
        </Button>
      ) : null}

      <Button
        variant="outline"
        className="rounded-xl border-amber-200 text-amber-700 hover:bg-amber-50 hover:text-amber-800"
        disabled={isBusy}
        onClick={() => c.toggleSave(notification._id)}
      >
        {c.busyAction === `save:${notification._id}` ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : notification.is_save ? (
          <Bookmark className="mr-2 h-4 w-4" />
        ) : (
          <BookmarkPlus className="mr-2 h-4 w-4" />
        )}
        {notification.is_save ? "Saved" : "Save"}
      </Button>

      <Button
        variant="outline"
        className="rounded-xl border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800"
        disabled={isBusy}
        onClick={() => c.deleteNotification(notification._id)}
      >
        {c.busyAction === `delete:${notification._id}` ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="mr-2 h-4 w-4" />
        )}
        Delete
      </Button>
    </div>
  );
}
