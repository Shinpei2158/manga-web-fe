"use client";

import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { WorkspaceTab } from "@/lib/admin-report/types";

export function ReportWorkspaceHeader({
  activeTab,
  availableTabs,
  communityCount,
  contentCount,
  roleError,
  onTabChange,
}: {
  activeTab: WorkspaceTab;
  availableTabs: WorkspaceTab[];
  communityCount: number;
  contentCount: number;
  roleError?: string | null;
  onTabChange: (tab: WorkspaceTab) => void;
}) {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm text-gray-500">Admin / Report Review</p>
        <h1 className="text-3xl font-bold text-gray-900">Report Review</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          {activeTab === "content"
            ? "Review manga and chapter reports by reported account, then resolve grouped cases from one content-focused queue."
            : "Review comment and reply reports by reported account, then resolve grouped cases from one community-focused queue."}
        </p>
      </div>

      {availableTabs.length > 1 ? (
        <Tabs
          value={activeTab}
          onValueChange={(value) => onTabChange(value as WorkspaceTab)}
        >
          <TabsList className="h-10 rounded-xl border border-slate-200 bg-white p-1">
            <TabsTrigger value="content" className="rounded-lg px-4">
              Content
              <Badge
                variant="secondary"
                className="ml-1 border border-slate-200 bg-slate-50 text-slate-700"
              >
                {contentCount}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="community" className="rounded-lg px-4">
              Community
              <Badge
                variant="secondary"
                className="ml-1 border border-slate-200 bg-slate-50 text-slate-700"
              >
                {communityCount}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      ) : null}

      {roleError ? (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Role verification issue</AlertTitle>
          <AlertDescription>{roleError}</AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}
