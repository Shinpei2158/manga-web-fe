import Image from "next/image";
import { Loader2, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LICENSE_STATUS_META } from "@/lib/story-rights";

import {
  type ActionFeedback,
  type ActionState,
  type LicenseDetail,
} from "@/lib/admin-license-management/license-management.types";
import { LicenseProofFilesPanel } from "./license-proof-files-panel";
import { LicenseReviewActionsCard } from "./license-review-actions-card";
import { TheoryLookupCard } from "./theory-lookup-card";

type LicenseDetailCardProps = {
  selected: LicenseDetail | null;
  detailLoading: boolean;
  selectedLatestRejectReason?: string | null;
  previousSelectedRejectReasons: string[];
  selectedProofCount: number;
  currentFile?: string;
  currentFileUrl?: string;
  currentFileIsPdf: boolean;
  selectedFileIndex: number;
  actionFeedback: ActionFeedback | null;
  rejectionReason: string;
  actionState: ActionState;
  isActionBusy: boolean;
  isReviewBusy: boolean;
  onSelectFileIndex: (index: number) => void;
  onRejectionReasonChange: (value: string) => void;
  onApprove: () => void;
  onReject: () => void;
  getCoverUrl: (coverImage?: string) => string | undefined;
};

export function LicenseDetailCard({
  selected,
  detailLoading,
  selectedLatestRejectReason,
  previousSelectedRejectReasons,
  selectedProofCount,
  currentFile,
  currentFileUrl,
  currentFileIsPdf,
  selectedFileIndex,
  actionFeedback,
  rejectionReason,
  actionState,
  isActionBusy,
  isReviewBusy,
  onSelectFileIndex,
  onRejectionReasonChange,
  onApprove,
  onReject,
  getCoverUrl,
}: LicenseDetailCardProps) {
  if (detailLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Story Rights Detail</CardTitle>
          <CardDescription>
            Review proof files and moderate the current submission.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex h-80 items-center justify-center">
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading detail...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!selected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Story Rights Detail</CardTitle>
          <CardDescription>
            Review proof files and moderate the current submission.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="rounded-xl border border-dashed p-8 text-center text-sm text-gray-500">
            Select a story from the queue.
          </div>
        </CardContent>
      </Card>
    );
  }

  const coverUrl = getCoverUrl(selected.coverImage);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Story Rights Detail</CardTitle>
        <CardDescription>
          Review proof files and moderate the current submission.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="relative h-48 w-36 shrink-0 overflow-hidden rounded-xl border bg-gray-100">
              {coverUrl ? (
                <Image
                  src={coverUrl}
                  alt={selected.title}
                  fill
                  unoptimized
                  sizes="144px"
                  className="object-cover"
                />
              ) : null}
            </div>

            <div className="min-w-0 flex-1 space-y-4">
              <div>
                <h2 className="text-2xl font-semibold">{selected.title}</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Author: {selected.authorId?.username || "Unknown"}{" "}
                  {selected.authorId?.email ? `(${selected.authorId.email})` : ""}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge
                  className={`border ${LICENSE_STATUS_META[selected.licenseStatus].className}`}
                >
                  License: {LICENSE_STATUS_META[selected.licenseStatus].label}
                </Badge>
                {/* <Badge
                  className={`border ${RIGHTS_STATUS_META[selected.rightsStatus].className}`}
                >
                  Rights: {RIGHTS_STATUS_META[selected.rightsStatus].label}
                </Badge> */}
                <Badge
                  className={`border ${
                    selected.isPublish
                      ? "border-blue-200 bg-blue-50 text-blue-700"
                      : "border-gray-200 bg-gray-100 text-gray-700"
                  }`}
                >
                  {selected.isPublish ? "Published" : "Draft"}
                </Badge>
                {selected.verifiedBadge ? (
                  <Badge className="border border-green-200 bg-green-50 text-green-700">
                    <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                    Verified
                  </Badge>
                ) : null}
              </div>
            </div>
          </div>

          <Separator />

          {selectedLatestRejectReason ||
          previousSelectedRejectReasons.length > 0 ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <p className="font-medium">
                {selected.licenseStatus === "rejected"
                  ? "Latest reject reason"
                  : "Reject history"}
              </p>
              {selectedLatestRejectReason ? (
                <p className="mt-1">{selectedLatestRejectReason}</p>
              ) : null}
              {previousSelectedRejectReasons.length > 0 ? (
                <div className="mt-3 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-red-700/80">
                    Earlier review notes
                  </p>
                  <div className="space-y-2">
                    {previousSelectedRejectReasons.map((reason, index) => (
                      <div
                        key={`${reason}-${index}`}
                        className="rounded-lg border border-red-200/80 bg-white/70 px-3 py-2"
                      >
                        {reason}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          <LicenseProofFilesPanel
            selected={selected}
            selectedProofCount={selectedProofCount}
            currentFile={currentFile}
            currentFileUrl={currentFileUrl}
            currentFileIsPdf={currentFileIsPdf}
            selectedFileIndex={selectedFileIndex}
            onSelectFileIndex={onSelectFileIndex}
          />

          <Separator />

          <div className="grid gap-6 xl:grid-cols-2 xl:items-start">
            <TheoryLookupCard />

            <LicenseReviewActionsCard
              actionFeedback={actionFeedback}
              actionState={actionState}
              isActionBusy={isActionBusy}
              isReviewBusy={isReviewBusy}
              rejectionReason={rejectionReason}
              onApprove={onApprove}
              onReject={onReject}
              onRejectionReasonChange={onRejectionReasonChange}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
