"use client";

import type { ReactNode } from "react";
import { Clock3, Eye, EyeOff } from "lucide-react";
import type { AdminCommentsController } from "@/hooks/admin/comments/use-admin-comments-controller";

export function AdminCommentsQuickFilters({
  controller: c,
}: {
  controller: AdminCommentsController;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="mb-3 text-sm font-medium text-slate-600">Quick Filters</p>

      <div className="flex flex-wrap gap-2">
        <QuickFilterButton
          active={
            !c.filters.manga &&
            !c.filters.chapter &&
            !c.filters.status &&
            !c.filters.search &&
            !c.onlyNewest24h
          }
          label="All"
          count={c.comments.length}
          onClick={c.handleResetFilters}
        />
        <QuickFilterButton
          active={c.filters.status === "visible" && !c.onlyNewest24h}
          label="Visible"
          count={c.visibleCount}
          icon={<Eye className="h-4 w-4" />}
          onClick={() => c.applyStatusQuickFilter("visible")}
        />
        <QuickFilterButton
          active={c.filters.status === "hidden" && !c.onlyNewest24h}
          label="Hidden"
          count={c.hiddenCount}
          icon={<EyeOff className="h-4 w-4" />}
          onClick={() => c.applyStatusQuickFilter("hidden")}
        />
        <QuickFilterButton
          active={c.onlyNewest24h}
          label="Newest 24h"
          count={c.newest24hCount}
          icon={<Clock3 className="h-4 w-4" />}
          onClick={() => c.setOnlyNewest24h((current) => !current)}
        />
        {c.quickMangaChips.map((manga) => (
          <QuickFilterButton
            key={manga.id}
            active={c.filters.manga === manga.id}
            label={manga.title}
            count={manga.count}
            onClick={() => c.applyMangaQuickFilter(manga.id)}
          />
        ))}
      </div>
    </div>
  );
}

function QuickFilterButton({
  active,
  count,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  count: number;
  icon?: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "border-sky-200 bg-sky-50 text-sky-700"
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      {icon ? <span className="shrink-0">{icon}</span> : null}
      <span>{label}</span>
      <span
        className={`rounded-full px-2 py-0.5 text-xs ${
          active ? "bg-white text-sky-700" : "bg-slate-100 text-slate-500"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

