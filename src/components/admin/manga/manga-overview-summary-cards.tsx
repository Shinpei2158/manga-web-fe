import {
  BadgeCheck,
  BookOpen,
  CalendarDays,
  Eye,
  FileText,
  MessageSquareText,
  Star,
  Tags,
} from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { MangaDetail } from "@/lib/admin-manga/types";
import {
  formatMangaDate,
  getLicenseStatusColor,
  getStoryStatusColor,
} from "@/lib/admin-manga/utils";

export function MangaOverviewStats({ manga }: { manga: MangaDetail }) {
  const stats = [
    { badge: true, icon: BookOpen, label: "Story", value: manga.status },
    {
      icon: Star,
      label: "Rating",
      value: `${manga.ratingSummary?.avgRating?.toFixed?.(1) || "0.0"} (${manga.ratingSummary?.count || 0})`,
    },
    { icon: Eye, label: "Views", value: manga.views.toLocaleString() },
    { icon: FileText, label: "Chapters", value: manga.chaptersCount },
    { icon: CalendarDays, label: "Created", value: formatMangaDate(manga.createdAt) },
    { icon: CalendarDays, label: "Updated", value: formatMangaDate(manga.updatedAt) },
  ];

  return (
    <Card className="overflow-hidden rounded-[24px] border-slate-200 shadow-sm">
      <CardContent className="grid gap-px bg-slate-200 p-0 md:grid-cols-3 xl:grid-cols-6">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="bg-white p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-slate-100 p-2 text-slate-600">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {item.label}
                  </p>
                  {item.badge ? (
                    <Badge variant="outline" className={`mt-2 capitalize ${getStoryStatusColor(manga.status)}`}>
                      {item.value}
                    </Badge>
                  ) : (
                    <p className="mt-2 text-base font-semibold text-slate-900">
                      {item.value}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export function RightsSubmissionCard({ manga }: { manga: MangaDetail }) {
  return (
    <Card className="rounded-[24px] border-slate-200 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BadgeCheck className="h-5 w-5 text-slate-500" />
          Rights Submission
        </CardTitle>
        <CardDescription className="text-sm">
          Review state, audit trail, and author note for the current rights
          submission.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-5 pt-0">
        <InfoBox label="Review Status">
          <Badge variant="outline" className={`mt-3 capitalize ${getLicenseStatusColor(manga.licenseStatus)}`}>
            {manga.licenseStatus}
          </Badge>
        </InfoBox>
        <div className="grid gap-3 sm:grid-cols-2">
          <InfoBox label="Submitted At">{formatMangaDate(manga.licenseSubmittedAt)}</InfoBox>
          <InfoBox label="Reviewed At">{formatMangaDate(manga.licenseReviewedAt)}</InfoBox>
        </div>
        <InfoBox label="Reviewed By">{manga.licenseReviewedBy?.username || "--"}</InfoBox>
        <InfoBox label="Supporting Note" muted>
          {manga.licenseNote || "No note provided."}
        </InfoBox>
      </CardContent>
    </Card>
  );
}

export function StorySummaryCard({ manga }: { manga: MangaDetail }) {
  return (
    <Card className="rounded-2xl border-slate-200 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <MessageSquareText className="h-5 w-5 text-slate-500" />
          Story Summary
        </CardTitle>
        <CardDescription className="text-sm">
          Main description shown for internal review.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-5 pt-0">
        <p className="break-words text-sm leading-6 text-slate-700">
          {manga.summary || "No summary provided."}
        </p>
      </CardContent>
    </Card>
  );
}

export function ClassificationCard({ manga }: { manga: MangaDetail }) {
  return (
    <Card className="rounded-[24px] border-slate-200 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Tags className="h-5 w-5 text-slate-500" />
          Classification
        </CardTitle>
        <CardDescription className="text-sm">
          Genres and styles associated with this story.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5 p-5 pt-0 sm:grid-cols-2">
        <TagGroup label="Genres" empty="No genres assigned" items={manga.genres} />
        <TagGroup label="Styles" empty="No styles assigned" items={manga.styles} />
      </CardContent>
    </Card>
  );
}

function InfoBox({ children, label, muted }: { children: ReactNode; label: string; muted?: boolean }) {
  return (
    <div className={`rounded-xl border border-slate-200 p-4 ${muted ? "bg-slate-50" : "bg-white"}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <div className="mt-2 break-words text-sm font-semibold leading-6 text-slate-900">
        {children}
      </div>
    </div>
  );
}

function TagGroup({
  empty,
  items,
  label,
}: {
  empty: string;
  items: { _id: string; name: string }[];
  label: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.length ? (
          items.map((item) => (
            <Badge key={item._id} variant="secondary" className="rounded-full px-3 py-1">
              {item.name}
            </Badge>
          ))
        ) : (
          <span className="text-sm text-slate-500">{empty}</span>
        )}
      </div>
    </div>
  );
}
