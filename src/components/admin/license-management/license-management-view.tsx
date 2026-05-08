"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { LicenseManagementController } from "@/hooks/admin-license-management/use-license-management-controller";
import { CaseGuideCard } from "./case-guide-card";
import { LicenseDetailCard } from "./license-detail-card";
import { LicenseExamplesCard } from "./license-examples-card";
import { ModerationQueueCard } from "./moderation-queue-card";
import { QueueMetricCard } from "./queue-metric-card";

export function LicenseManagementView({
  controller: c,
}: {
  controller: LicenseManagementController;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Story Rights Moderation</h1>
          <p className="text-sm text-gray-600">
            Review proof documents and moderate story rights submissions with a
            simpler review flow.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {(["pending", "approved", "rejected", "none"] as const).map((key) => (
            <QueueMetricCard key={key} label={key} value={c.stats[key] || 0} />
          ))}
        </div>
      </div>

      {c.error ? (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>{c.error}</AlertDescription>
        </Alert>
      ) : null}

      {c.loading ? (
        <div className="flex h-96 items-center justify-center">
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading moderation queue...
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[350px_minmax(0,1fr)]">
          <div className="space-y-6">
            <ModerationQueueCard
              items={c.items}
              total={c.total}
              queueStart={c.queueStart}
              queueEnd={c.queueEnd}
              page={c.page}
              totalPages={c.totalPages}
              selectedId={c.selected?._id ?? null}
              statusFilter={c.statusFilter}
              searchQuery={c.searchQuery}
              loading={c.loading}
              onStatusFilterChange={(value) => {
                c.setStatusFilter(value);
                c.setActionFeedback(null);
              }}
              onSearchQueryChange={(value) => {
                c.setSearchQuery(value);
                c.setActionFeedback(null);
              }}
              onSelectItem={c.fetchDetail}
              onPreviousPage={() =>
                c.fetchQueue(c.page - 1, {
                  preferredSelectedId: c.selected?._id ?? null,
                })
              }
              onNextPage={() =>
                c.fetchQueue(c.page + 1, {
                  preferredSelectedId: c.selected?._id ?? null,
                })
              }
              getCoverUrl={c.getCoverUrl}
            />

            <CaseGuideCard context={c.derivedContext} guide={c.caseGuide} />
            <LicenseExamplesCard />
          </div>

          <LicenseDetailCard
            selected={c.selected}
            detailLoading={c.detailLoading}
            selectedLatestRejectReason={c.selectedLatestRejectReason}
            previousSelectedRejectReasons={c.previousSelectedRejectReasons}
            selectedProofCount={c.selectedProofCount}
            currentFile={c.currentFile}
            currentFileUrl={c.currentFileUrl}
            currentFileIsPdf={c.currentFileIsPdf}
            selectedFileIndex={c.selectedFileIndex}
            actionFeedback={c.actionFeedback}
            rejectionReason={c.rejectionReason}
            actionState={c.actionState}
            isActionBusy={c.isActionBusy}
            isReviewBusy={c.isReviewBusy}
            onSelectFileIndex={c.setSelectedFileIndex}
            onRejectionReasonChange={c.setRejectionReason}
            onApprove={() => c.handleReview("approved")}
            onReject={() => c.handleReview("rejected")}
            getCoverUrl={c.getCoverUrl}
          />
        </div>
      )}
    </div>
  );
}
