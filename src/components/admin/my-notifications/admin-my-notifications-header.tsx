"use client";

import { BellDot, CheckCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AdminMyNotificationsController } from "@/hooks/admin/my-notifications/use-admin-my-notifications-controller";

export function AdminMyNotificationsHeader({
  controller: c,
}: {
  controller: AdminMyNotificationsController;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-sky-400 to-cyan-400" />

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
            <BellDot className="h-3.5 w-3.5" />
            Personal staff notifications
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Inbox for {c.me?.username || "your staff account"}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Review admin updates sent directly to you, keep important items saved,
            and clear unread work before it stacks up.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            className="h-11 rounded-xl border-slate-200 px-5"
            disabled={c.busyAction === "mark-all" || c.overview.unread === 0}
            onClick={c.markAllAsRead}
          >
            {c.busyAction === "mark-all" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CheckCheck className="mr-2 h-4 w-4" />
            )}
            Mark all as read
          </Button>
        </div>
      </div>
    </div>
  );
}
