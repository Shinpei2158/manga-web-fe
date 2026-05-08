"use client";

import type { ReactNode } from "react";
import { Eye, EyeOff, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function AdminCommentsStats({
  hiddenCount,
  totalCount,
  visibleCount,
}: {
  hiddenCount: number;
  totalCount: number;
  visibleCount: number;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <StatsCard
        title="Total Comments"
        value={totalCount}
        hint="All comments currently available in the system"
        accent="bg-sky-100 text-sky-700"
        icon={<MessageSquare className="h-5 w-5" />}
      />
      <StatsCard
        title="Visible Comments"
        value={visibleCount}
        hint="Comments that readers can currently see"
        accent="bg-emerald-100 text-emerald-700"
        icon={<Eye className="h-5 w-5" />}
      />
      <StatsCard
        title="Hidden Comments"
        value={hiddenCount}
        hint="Comments currently hidden during moderation"
        accent="bg-amber-100 text-amber-700"
        icon={<EyeOff className="h-5 w-5" />}
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

