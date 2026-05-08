"use client";

import type { AdminMangaController } from "@/hooks/admin/manga/use-admin-manga-controller";
import type { MangaDetail } from "@/lib/admin-manga/types";
import {
  ClassificationCard,
  MangaOverviewStats,
  RightsSubmissionCard,
  StorySummaryCard,
} from "./manga-overview-summary-cards";
import {
  ReviewContextCard,
  ReviewHistoryCard,
  SupportingFilesCard,
} from "./manga-overview-support-cards";

export function MangaOverviewPanel({
  controller: c,
  manga,
}: {
  controller: AdminMangaController;
  manga: MangaDetail;
}) {
  const canPublish =
    manga.licenseStatus === "approved" && manga.enforcementStatus === "normal";
  const shouldPrioritizeRightsReview =
    manga.licenseStatus === "pending" || manga.licenseStatus === "rejected";
  const hasReviewHistory = Boolean(
    c.selectedLatestRejectReason || c.previousSelectedRejectReasons.length,
  );

  return (
    <div className="space-y-4">
      <MangaOverviewStats manga={manga} />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
        <div className="space-y-4">
          {shouldPrioritizeRightsReview ? <RightsSubmissionCard manga={manga} /> : null}
          <StorySummaryCard manga={manga} />
          <ClassificationCard manga={manga} />
          {!shouldPrioritizeRightsReview ? (
            <SupportingFilesCard apiUrl={c.apiUrl} files={manga.licenseFiles} />
          ) : null}
          {!shouldPrioritizeRightsReview && hasReviewHistory ? (
            <ReviewHistoryCard controller={c} manga={manga} />
          ) : null}
        </div>
        <ReviewContextCard canPublish={canPublish} controller={c} manga={manga} />
      </div>
      {!shouldPrioritizeRightsReview ? <RightsSubmissionCard manga={manga} /> : null}
      {shouldPrioritizeRightsReview ? (
        <SupportingFilesCard apiUrl={c.apiUrl} files={manga.licenseFiles} />
      ) : null}
      {shouldPrioritizeRightsReview && hasReviewHistory ? (
        <ReviewHistoryCard controller={c} manga={manga} />
      ) : null}
    </div>
  );
}
