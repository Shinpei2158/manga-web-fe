"use client";

import type { AuditLogDetailsController } from "@/hooks/admin-audit-logs/use-audit-log-details";
import { AuditLogChangeDetails } from "./audit-log-change-details";
import { AuditLogCommentPreview } from "./audit-log-comment-preview";
import { AuditLogDetailError, AuditLogDetailSkeleton } from "./audit-log-detail-states";
import { AuditLogDetailHeader } from "./audit-log-detail-header";
import { AuditLogReviewCard } from "./audit-log-review-card";

export function AuditLogDetailsView({
  controller,
}: {
  controller: AuditLogDetailsController;
}) {
  if (!controller.log && !controller.error) {
    return <AuditLogDetailSkeleton />;
  }

  if (controller.error) {
    return <AuditLogDetailError controller={controller} />;
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 bg-gradient-to-br from-amber-50/20 via-white to-sky-50/25 px-2 py-2">
      <AuditLogDetailHeader controller={controller} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          {controller.isCommentLikeRecord ? (
            <AuditLogCommentPreview controller={controller} />
          ) : null}
          <AuditLogChangeDetails controller={controller} />
        </div>

        <AuditLogReviewCard controller={controller} />
      </div>
    </div>
  );
}

