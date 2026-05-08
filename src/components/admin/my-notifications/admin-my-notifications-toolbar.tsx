"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { AdminMyNotificationsController } from "@/hooks/admin-my-notifications/use-admin-my-notifications-controller";
import type { StaffInboxFilter } from "@/lib/admin-my-notifications/types";

export function AdminMyNotificationsToolbar({
  controller: c,
}: {
  controller: AdminMyNotificationsController;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          <FilterChip
            active={c.activeFilter === "all"}
            label="All"
            count={c.overview.total}
            onClick={() => c.setActiveFilter("all")}
          />
          <FilterChip
            active={c.activeFilter === "unread"}
            label="Unread"
            count={c.overview.unread}
            onClick={() => c.setActiveFilter("unread")}
          />
          <FilterChip
            active={c.activeFilter === "saved"}
            label="Saved"
            count={c.overview.saved}
            onClick={() => c.setActiveFilter("saved")}
          />
        </div>

        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={c.search}
            onChange={(event) => c.setSearch(event.target.value)}
            placeholder="Search title or message..."
            className="h-11 rounded-xl border-slate-200 pl-9"
          />
        </div>
      </div>
    </div>
  );
}
function FilterChip({
  active,
  count,
  label,
  onClick,
}: {
  active: boolean;
  count: number;
  label: StaffInboxFilter extends never ? never : string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "border-blue-200 bg-blue-50 text-blue-700"
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      <span>{label}</span>
      <span
        className={`rounded-full px-2 py-0.5 text-xs ${
          active ? "bg-white text-blue-700" : "bg-slate-100 text-slate-500"
        }`}
      >
        {count}
      </span>
    </button>
  );
}
