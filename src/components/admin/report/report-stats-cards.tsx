"use client";

import { BookOpen, Clock3, MessageSquare, ShieldCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { WorkspaceTab } from "@/lib/admin-report/types";

export function ReportStatsCards({
  activeTab,
  stats,
}: {
  activeTab: WorkspaceTab;
  stats: {
    doneMergedCases: number;
    openMergedCases: number;
    reportAgainstCount: number;
    totalMergedCases: number;
  };
}) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">
            Case Progress
          </CardTitle>
          <ShieldCheck className="h-5 w-5 text-gray-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900">
            {stats.doneMergedCases}/{stats.totalMergedCases}
          </div>
          <p className="mt-1 text-xs text-gray-600">
            Grouped cases already marked done.
          </p>
        </CardContent>
      </Card>

      <Card className="border-amber-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">
            Open Cases
          </CardTitle>
          <Clock3 className="h-5 w-5 text-amber-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-amber-600">
            {stats.openMergedCases}
          </div>
          <p className="mt-1 text-xs text-gray-600">
            {activeTab === "content"
              ? "Still waiting for a final content decision."
              : "Still waiting for a final community decision."}
          </p>
        </CardContent>
      </Card>

      <Card className="border-sky-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">
            Report Against
          </CardTitle>
          {activeTab === "content" ? (
            <BookOpen className="h-5 w-5 text-sky-600" />
          ) : (
            <MessageSquare className="h-5 w-5 text-sky-600" />
          )}
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-sky-600">
            {stats.reportAgainstCount}
          </div>
          <p className="mt-1 text-xs text-gray-600">
            {activeTab === "content"
              ? "Accounts with active or completed content report history."
              : "Accounts with active or completed community report history."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
