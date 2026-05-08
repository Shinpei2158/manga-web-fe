import { User2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AdminMangaController } from "@/hooks/admin/manga/use-admin-manga-controller";
import type { MangaDetail } from "@/lib/admin-manga/types";
import {
  getEnforcementStatusColor,
  getMangaDetailSignal,
  getPublicationStatusColor,
  getReviewLaneColor,
  getReviewLaneLabel,
  getStoryStatusColor,
} from "@/lib/admin-manga/utils";

export function MangaDetailHeader({
  controller: c,
  manga,
}: {
  controller: AdminMangaController;
  manga: MangaDetail;
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm xl:p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 flex-1">
          <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
            Review workspace
          </div>
          <h2 className="mt-3 break-words text-xl font-bold leading-tight text-slate-900 xl:text-[22px]">
            {manga.title}
          </h2>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700">
              <User2 className="h-4 w-4 text-slate-500" />
              {manga.author?.username || "Unknown author"}
            </div>
            <span
              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${getReviewLaneColor(manga)}`}
            >
              {getReviewLaneLabel(manga)}
            </span>
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            {getMangaDetailSignal(manga)}
          </p>
        </div>

        <div className="flex flex-wrap items-start gap-2 xl:max-w-sm xl:justify-end">
          <StatusBadge label="Story" className={getStoryStatusColor(manga.status)} value={manga.status} />
          <StatusBadge
            label="Publication"
            className={getPublicationStatusColor(manga.publicationStatus)}
            value={manga.publicationStatus}
          />
          <StatusBadge
            label="Enforcement"
            className={getEnforcementStatusColor(manga.enforcementStatus)}
            value={manga.enforcementStatus}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 lg:flex-row lg:items-center lg:justify-between">
        <TabsList className="grid h-10 w-full max-w-[18rem] grid-cols-2 rounded-[18px] border border-slate-200 bg-slate-50 p-1 shadow-sm">
          <TabsTrigger value="overview" className="rounded-[14px] text-sm font-medium">
            Overview
          </TabsTrigger>
          <TabsTrigger value="enforcement" className="rounded-[14px] text-sm font-medium">
            Enforcement
          </TabsTrigger>
        </TabsList>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <p className="text-xs font-medium text-slate-500">
            {c.reviewPositionLabel}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full"
              disabled={!c.hasPreviousReview || c.loadingDetail}
              onClick={() => c.handleReviewSequence(-1)}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full"
              disabled={!c.hasNextReview || c.loadingDetail}
              onClick={() => c.handleReviewSequence(1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({
  className,
  label,
  value,
}: {
  className: string;
  label: string;
  value: string;
}) {
  return (
    <Badge
      variant="outline"
      className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${className}`}
    >
      {label}: {value}
    </Badge>
  );
}
