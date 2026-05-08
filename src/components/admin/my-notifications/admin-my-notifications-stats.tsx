"use client";

import type { ReactNode } from "react";
import { Bell, BellDot, BookmarkCheck, CheckCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { StaffNotificationOverview } from "@/lib/admin-my-notifications/types";

export function AdminMyNotificationsStats({
  overview,
}: {
  overview: StaffNotificationOverview;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatsCard
        title="Total Notifications"
        value={overview.total}
        hint="Everything sent to you"
        accent="bg-slate-100 text-slate-700"
        icon={<Bell className="h-5 w-5" />}
      />
      <StatsCard
        title="Unread"
        value={overview.unread}
        hint="Needs your attention"
        accent="bg-blue-50 text-blue-600"
        icon={<BellDot className="h-5 w-5" />}
      />
      <StatsCard
        title="Read"
        value={overview.read}
        hint="Already reviewed"
        accent="bg-emerald-50 text-emerald-600"
        icon={<CheckCheck className="h-5 w-5" />}
      />
      <StatsCard
        title="Saved"
        value={overview.saved}
        hint="Bookmarked for follow-up"
        accent="bg-amber-50 text-amber-600"
        icon={<BookmarkCheck className="h-5 w-5" />}
      />
    </div>
  );
}
function StatsCard({
  accent,
  hint,
  icon,
  title,
  value,
}: {
  accent: string;
  hint: string;
  icon: ReactNode;
  title: string;
  value: number;
}) {
  return (
    <Card className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              {value}
            </p>
            <p className="mt-1 text-xs text-slate-500">{hint}</p>
          </div>

          <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${accent}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
