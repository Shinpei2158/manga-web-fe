import { AlertTriangle, ExternalLink, Eye, EyeOff, FileText, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AdminMangaController } from "@/hooks/admin-manga/use-admin-manga-controller";
import type { MangaDetail } from "@/lib/admin-manga/types";
import {
  formatMangaDate,
  getEnforcementStatusColor,
  getPublicationStatusColor,
  getReviewLaneLabel,
  resolveMangaAssetUrl,
} from "@/lib/admin-manga/utils";

export function ReviewContextCard({
  canPublish,
  controller: c,
  manga,
}: {
  canPublish: boolean;
  controller: AdminMangaController;
  manga: MangaDetail;
}) {
  return (
    <Card className="rounded-[22px] border-slate-200 shadow-sm xl:sticky xl:top-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <ShieldCheck className="h-5 w-5 text-slate-500" />
          Review Context
        </CardTitle>
        <CardDescription className="text-sm">
          Publication readiness and queue status for this story.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-5 pt-0">
        <InfoBox label="Publication">
          <Badge variant="outline" className={`mt-3 capitalize ${getPublicationStatusColor(manga.publicationStatus)}`}>
            {manga.publicationStatus}
          </Badge>
        </InfoBox>
        <InfoBox label="Review Lane">{getReviewLaneLabel(manga)}</InfoBox>
        <InfoBox label="Enforcement">
          <Badge variant="outline" className={`mt-2 capitalize ${getEnforcementStatusColor(manga.enforcementStatus)}`}>
            {manga.enforcementStatus}
          </Badge>
        </InfoBox>
        <InfoBox label="Last Updated">{formatMangaDate(manga.updatedAt)}</InfoBox>
        {manga.publicationStatus === "published" ? (
          <Button variant="outline" className="w-full" onClick={() => c.setActionDialog("unpublish")}>
            <EyeOff className="mr-2 h-4 w-4" />
            Unpublish Manga
          </Button>
        ) : (
          <div className="space-y-2">
            <Button className="w-full" disabled={!canPublish} onClick={() => c.setActionDialog("publish")}>
              <Eye className="mr-2 h-4 w-4" />
              Publish Manga
            </Button>
            {!canPublish ? (
              <p className="text-xs leading-5 text-amber-700">
                Publishing requires an approved license and normal enforcement status.
              </p>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function SupportingFilesCard({ apiUrl, files }: { apiUrl: string; files: string[] }) {
  return (
    <Card className="rounded-[24px] border-slate-200 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="h-5 w-5 text-slate-500" />
          Supporting Files
        </CardTitle>
        <CardDescription className="text-sm">
          Uploaded documents attached to this review.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-5 pt-0">
        {files?.length ? (
          <div className="space-y-3">
            {files.map((file, index) => {
              const fileName = file.split("/").pop() || `license-file-${index + 1}`;
              return (
                <a
                  key={`${file}-${index}`}
                  href={resolveMangaAssetUrl(apiUrl, file)}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-4 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="rounded-xl bg-blue-50 p-2 text-blue-600">
                      <FileText className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-slate-900">{fileName}</span>
                      <span className="block truncate text-xs text-slate-500">Open supporting document</span>
                    </span>
                  </span>
                  <ExternalLink className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:text-slate-700" />
                </a>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center">
            <FileText className="mx-auto h-8 w-8 text-slate-400" />
            <p className="mt-3 text-sm font-medium text-slate-700">No files uploaded</p>
            <p className="mt-1 text-xs text-slate-500">
              This submission does not contain supporting attachments.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function ReviewHistoryCard({
  controller: c,
  manga,
}: {
  controller: AdminMangaController;
  manga: MangaDetail;
}) {
  return (
    <Card className="rounded-[24px] border-red-200 bg-red-50 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg text-red-700">
          <AlertTriangle className="h-5 w-5" />
          {manga.licenseStatus === "rejected" ? "Latest Review Note" : "Review History"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 p-5 pt-0">
        {c.selectedLatestRejectReason ? (
          <p className="break-words text-sm leading-7 text-red-700">
            {c.selectedLatestRejectReason}
          </p>
        ) : null}
        {c.previousSelectedRejectReasons.map((reason, index) => (
          <div key={`${reason}-${index}`} className="rounded-xl border border-red-200/80 bg-white/70 px-3 py-2">
            <p className="break-words text-sm leading-7 text-red-700">{reason}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function InfoBox({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <div className="mt-2 break-words text-sm font-semibold leading-6 text-slate-900">
        {children}
      </div>
    </div>
  );
}
