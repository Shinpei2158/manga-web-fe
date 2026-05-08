import { BookOpen, Eye, FileCheck, ShieldAlert } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { MangaStats } from "@/lib/admin-manga/types";

export function MangaStatsCards({ stats }: { stats: MangaStats }) {
  const cards = [
    {
      accent: "border-slate-200/80 bg-white text-slate-900",
      description: "Full moderation queue",
      icon: BookOpen,
      iconClass: "bg-slate-100 text-slate-600",
      label: "Total stories",
      value: stats.total,
    },
    {
      accent: "border-amber-200/80 bg-amber-50/60 text-amber-800",
      description: "Waiting for review",
      icon: FileCheck,
      iconClass: "bg-white/90 text-amber-700",
      label: "Pending license",
      value: stats.pendingLicense,
    },
    {
      accent: "border-blue-200/80 bg-blue-50/60 text-blue-800",
      description: "Visible on platform",
      icon: Eye,
      iconClass: "bg-white/90 text-blue-700",
      label: "Published",
      value: stats.published,
    },
    {
      accent: "border-red-200/80 bg-red-50/70 text-red-800",
      description: "Suspended or banned",
      icon: ShieldAlert,
      iconClass: "bg-white/90 text-red-700",
      label: "Restricted",
      value: stats.enforcementIssues,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card key={card.label} className={`rounded-3xl shadow-sm ${card.accent}`}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
              <div>
                <CardTitle className="text-sm font-medium">
                  {card.label}
                </CardTitle>
                <CardDescription className="mt-1 text-xs">
                  {card.description}
                </CardDescription>
              </div>
              <div className={`rounded-2xl p-2 shadow-sm ${card.iconClass}`}>
                <Icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
