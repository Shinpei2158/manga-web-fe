import Link from "next/link";
import { Bell, BellDot, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminNotificationsHeader() {
  return (
    <>
      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <span>Admin</span>
        <span>/</span>
        <span>Notifications</span>
        <span>/</span>
        <span className="font-medium text-slate-900">Sent Notifications</span>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-500" />

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              <BellDot className="h-3.5 w-3.5" />
              Admin delivery management
            </div>

            <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-slate-900">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-sm">
                <Bell className="h-6 w-6" />
              </span>
              Sent Notifications
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Review delivery activity, monitor unread notifications, quickly
              resend important messages, and keep high-priority items saved for
              follow-up.
            </p>
          </div>

          <Link href="/admin/notifications/send-general">
            <Button className="h-11 rounded-xl bg-blue-600 px-5 font-medium shadow-sm hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Send Notification
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
