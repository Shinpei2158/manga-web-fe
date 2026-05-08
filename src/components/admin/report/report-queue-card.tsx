"use client";

import { AlertTriangle, Loader2, Search } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  type CommunityReportAgainstGroup,
  type ReportAgainstGroup,
} from "@/lib/report-workspace";
import type { ReportWorkspaceController } from "@/hooks/admin-report/use-report-workspace-controller";
import type { GroupStatusFilter } from "@/lib/admin-report/types";
import {
  CommunityReportGroupRow,
  ContentReportGroupRow,
} from "./report-group-rows";
import { ReportQueuePagination } from "./report-queue-pagination";

export function ReportQueueCard({
  controller: c,
  pageNumbers,
}: {
  controller: ReportWorkspaceController;
  pageNumbers: number[];
}) {
  return (
    <Card className="rounded-3xl border-slate-200/80 shadow-sm">
      <CardHeader className="space-y-4 pb-4">
        <CardTitle className="text-lg font-semibold text-slate-900">
          Report Against Queue
        </CardTitle>

        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder={
                c.activeTab === "content"
                  ? "Search by reported account or manga title..."
                  : "Search by reported account or comment text..."
              }
              className="pl-9"
              value={c.currentView.searchTerm}
              onChange={(event) =>
                c.patchView(c.activeTab, {
                  currentPage: 1,
                  searchTerm: event.target.value,
                })
              }
            />
          </div>

          <div className="w-full lg:w-[220px]">
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Queue Status
            </label>
            <Select
              value={c.currentView.statusFilter}
              onValueChange={(value) =>
                c.patchView(c.activeTab, {
                  currentPage: 1,
                  statusFilter: value as GroupStatusFilter,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All rows" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All rows</SelectItem>
                <SelectItem value="needs-review">Needs review</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <ReportListWarning controller={c} />
        <ReportQueueTable controller={c} />
        <ReportQueuePagination controller={c} pageNumbers={pageNumbers} />
      </CardContent>
    </Card>
  );
}

function ReportListWarning({ controller: c }: { controller: ReportWorkspaceController }) {
  if (!c.listError || c.reports.length === 0) return null;

  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Some report data may be stale</AlertTitle>
      <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span>{c.listError}</span>
        <Button
          variant="outline"
          size="sm"
          className="w-fit border-white/60 bg-white/10 text-white hover:bg-white/20"
          onClick={c.fetchReports}
        >
          Retry
        </Button>
      </AlertDescription>
    </Alert>
  );
}

function ReportQueueTable({ controller: c }: { controller: ReportWorkspaceController }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Report Against</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>
              {c.activeTab === "content" ? "Manga with report" : "Targets with report"}
            </TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Latest activity</TableHead>
            <TableHead className="w-[220px] text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <ReportQueueTableBody controller={c} />
        </TableBody>
      </Table>
    </div>
  );
}

function ReportQueueTableBody({
  controller: c,
}: {
  controller: ReportWorkspaceController;
}) {
  if (c.loadingReports) {
    return (
      <ReportMessageRow>
        <div className="inline-flex items-center gap-2 text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          {c.activeTab === "content"
            ? "Loading content reports..."
            : "Loading community reports..."}
        </div>
      </ReportMessageRow>
    );
  }

  if (c.listError && c.reports.length === 0) {
    return (
      <ReportMessageRow>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-semibold text-rose-700">
              Unable to load reports
            </p>
            <p className="mt-1 text-sm text-slate-500">{c.listError}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl border-slate-200"
            onClick={c.fetchReports}
          >
            Retry
          </Button>
        </div>
      </ReportMessageRow>
    );
  }

  if (c.currentPageGroups.length === 0) {
    return (
      <ReportMessageRow>
        {c.activeTab === "content"
          ? "No content report groups found."
          : "No community report groups found."}
      </ReportMessageRow>
    );
  }

  if (c.activeTab === "content") {
    return c.currentPageGroups.map((group) => {
      const contentGroup = group as ReportAgainstGroup;
      return (
        <ContentReportGroupRow
          key={contentGroup.key}
          apiUrl={c.apiUrl}
          busy={c.busyKey === `group:content:${contentGroup.key}`}
          group={contentGroup}
          isActive={
            c.views.content.selectedGroupKey === contentGroup.key &&
            c.views.content.isModalOpen
          }
          onDone={() =>
            c.patchView("content", { confirmGroupKey: contentGroup.key })
          }
          onView={() => c.handleOpenContentGroup(contentGroup)}
        />
      );
    });
  }

  return c.currentPageGroups.map((group) => {
    const communityGroup = group as CommunityReportAgainstGroup;
    return (
      <CommunityReportGroupRow
        key={communityGroup.key}
        apiUrl={c.apiUrl}
        busy={c.busyKey === `group:community:${communityGroup.key}`}
        group={communityGroup}
        isActive={
          c.views.community.selectedGroupKey === communityGroup.key &&
          c.views.community.isModalOpen
        }
        onDone={() =>
          c.patchView("community", { confirmGroupKey: communityGroup.key })
        }
        onView={() => c.handleOpenCommunityGroup(communityGroup)}
      />
    );
  });
}

function ReportMessageRow({ children }: { children: React.ReactNode }) {
  return (
    <TableRow>
      <TableCell colSpan={6} className="py-8 text-center">
        {children}
      </TableCell>
    </TableRow>
  );
}
