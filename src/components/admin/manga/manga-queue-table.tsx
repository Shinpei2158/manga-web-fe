"use client";

import Image from "next/image";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Eye,
  Loader2,
  User2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AdminMangaController } from "@/hooks/admin-manga/use-admin-manga-controller";
import type { SortField } from "@/lib/admin-manga/types";
import {
  formatMangaDate,
  getEnforcementStatusColor,
  getLicenseStatusColor,
  getMangaListSignal,
  getPublicationStatusColor,
  getReviewLaneColor,
  getReviewLaneLabel,
  getSecondaryMangaAction,
  getStoryStatusColor,
  resolveMangaAssetUrl,
} from "@/lib/admin-manga/utils";

export function MangaQueueTable({
  controller: c,
}: {
  controller: AdminMangaController;
}) {
  return (
    <Card className="rounded-3xl border-slate-200/80 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg text-slate-900">
              Manga review queue
            </CardTitle>
            <CardDescription className="max-w-2xl text-sm leading-6">
              Scan rights readiness, publication state, and moderation pressure
              before opening the full workspace.
            </CardDescription>
          </div>
          <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
            Sorted by {c.currentSortLabel}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <Table className="min-w-[1180px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[470px]">
                  <SortHeader controller={c} field="title" label="Story" />
                </TableHead>
                <TableHead className="w-[130px]">
                  <SortHeader controller={c} field="licenseStatus" label="License" />
                </TableHead>
                <TableHead className="w-[140px]">
                  <SortHeader
                    controller={c}
                    field="publicationStatus"
                    label="Publication"
                  />
                </TableHead>
                <TableHead className="w-[140px]">
                  <SortHeader
                    controller={c}
                    field="enforcementStatus"
                    label="Enforcement"
                  />
                </TableHead>
                <TableHead className="w-[110px] text-center">
                  <SortHeader
                    controller={c}
                    field="chaptersCount"
                    label="Chapters"
                    className="w-full justify-center"
                  />
                </TableHead>
                <TableHead className="w-[130px]">
                  <SortHeader controller={c} field="updatedAt" label="Updated" />
                </TableHead>
                <TableHead className="w-[190px] text-center">Workspace</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {c.loadingList ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-slate-500">
                    <div className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading manga management data...
                    </div>
                  </TableCell>
                </TableRow>
              ) : c.mangaList.length > 0 ? (
                c.mangaList.map((manga) => (
                  <MangaQueueRow key={manga.id} controller={c} manga={manga} />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-slate-500">
                    No manga found matching your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Showing {c.mangaList.length} stories, page {c.page} of {c.totalPages}
          </p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={c.page <= 1 || c.loadingList}
              onClick={() => c.setPage((prev) => Math.max(1, prev - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              disabled={c.page >= c.totalPages || c.loadingList}
              onClick={() => c.setPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MangaQueueRow({
  controller: c,
  manga,
}: {
  controller: AdminMangaController;
  manga: AdminMangaController["mangaList"][number];
}) {
  const secondaryAction = getSecondaryMangaAction(manga);
  const SecondaryIcon = secondaryAction?.icon;

  return (
    <TableRow
      className={`align-top ${c.selectedMangaId === manga.id ? "bg-blue-50/40" : "bg-white"}`}
    >
      <TableCell className="max-w-[470px]">
        <div className="flex items-start gap-4">
          <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
            {manga.coverImage ? (
              <Image
                src={resolveMangaAssetUrl(c.apiUrl, manga.coverImage)}
                alt={manga.title}
                fill
                unoptimized
                sizes="56px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[10px] font-medium text-slate-400">
                N/A
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate text-sm font-semibold text-slate-900" title={manga.title}>
                {manga.title}
              </p>
              <Badge
                variant="outline"
                className={`rounded-full px-2.5 py-0.5 text-[11px] capitalize ${getStoryStatusColor(manga.status)}`}
              >
                {manga.status}
              </Badge>
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${getReviewLaneColor(manga)}`}
              >
                {getReviewLaneLabel(manga)}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <User2 className="h-3.5 w-3.5" />
                <span className="truncate" title={manga.author}>
                  {manga.author}
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5" />
                {manga.views.toLocaleString()} views
              </span>
            </div>

            <p className="text-xs leading-5 text-slate-600">
              {getMangaListSignal(manga)}
            </p>
          </div>
        </div>
      </TableCell>
      <StatusCell className={getLicenseStatusColor(manga.licenseStatus)} value={manga.licenseStatus} />
      <StatusCell className={getPublicationStatusColor(manga.publicationStatus)} value={manga.publicationStatus} />
      <StatusCell className={getEnforcementStatusColor(manga.enforcementStatus)} value={manga.enforcementStatus} />
      <TableCell className="text-center text-sm font-semibold text-slate-700">
        {manga.chaptersCount}
      </TableCell>
      <TableCell className="text-sm text-slate-500">
        {formatMangaDate(manga.updatedAt)}
      </TableCell>
      <TableCell>
        <div className="flex flex-col items-center gap-2">
          <Button
            size="sm"
            className="min-w-[156px] rounded-xl bg-blue-600 text-white shadow-sm hover:bg-blue-700"
            onClick={() => c.openDetail(manga.id, "overview")}
          >
            <Eye className="mr-2 h-4 w-4" />
            Open workspace
          </Button>
          {secondaryAction && SecondaryIcon ? (
            <Button
              variant="outline"
              size="sm"
              className={`min-w-[156px] rounded-xl ${secondaryAction.className}`}
              onClick={() => c.openDetail(manga.id, secondaryAction.tab)}
            >
              <SecondaryIcon className="mr-2 h-4 w-4" />
              {secondaryAction.label}
            </Button>
          ) : null}
        </div>
      </TableCell>
    </TableRow>
  );
}

function StatusCell({ className, value }: { className: string; value: string }) {
  return (
    <TableCell>
      <Badge variant="outline" className={`rounded-full capitalize ${className}`}>
        {value}
      </Badge>
    </TableCell>
  );
}

function SortHeader({
  className,
  controller: c,
  field,
  label,
}: {
  className?: string;
  controller: AdminMangaController;
  field: SortField;
  label: string;
}) {
  const Icon =
    c.sortBy !== field ? ArrowUpDown : c.sortOrder === "asc" ? ArrowUp : ArrowDown;

  return (
    <button
      type="button"
      onClick={() => c.handleSortChange(field)}
      className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 hover:text-slate-900 ${className || ""}`}
    >
      {label}
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}
