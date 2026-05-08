import { ShieldAlert, ShieldCheck, Zap } from "lucide-react";
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
import type { AdminMangaController } from "@/hooks/admin/manga/use-admin-manga-controller";
import type { MangaDetail } from "@/lib/admin-manga/types";
import {
  formatMangaDate,
  getEnforcementStatusColor,
} from "@/lib/admin-manga/utils";

export function MangaEnforcementPanel({
  controller: c,
  manga,
}: {
  controller: AdminMangaController;
  manga: MangaDetail;
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
      <CurrentEnforcementCard manga={manga} />
      <Card className="rounded-2xl border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <ShieldAlert className="h-5 w-5 text-slate-500" />
            Moderation Actions
          </CardTitle>
          <CardDescription className="text-sm">
            Apply temporary or permanent moderation actions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 p-5 pt-0">
          {manga.enforcementStatus === "normal" ? (
            <>
              <RestrictionAction
                buttonText="Suspend Manga"
                description="Suspend the story when access should be limited while the issue is being reviewed."
                icon={<Zap className="mr-2 h-4 w-4" />}
                tone="orange"
                title="Temporary restriction"
                onClick={() => c.setActionDialog("suspend")}
              />
              <RestrictionAction
                buttonText="Ban Manga"
                description="Ban the story when it must be fully blocked from the platform."
                icon={<ShieldAlert className="mr-2 h-4 w-4" />}
                tone="red"
                title="Permanent restriction"
                onClick={() => c.setActionDialog("ban")}
              />
            </>
          ) : (
            <RestrictionAction
              buttonText="Remove Restriction"
              description="Remove the active restriction and return this story to normal status."
              title="Restore normal access"
              onClick={() => c.setActionDialog("clear-enforcement")}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function CurrentEnforcementCard({ manga }: { manga: MangaDetail }) {
  return (
    <Card className="rounded-2xl border-slate-200 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <ShieldCheck className="h-5 w-5 text-slate-500" />
          Current Enforcement Status
        </CardTitle>
        <CardDescription className="text-sm">
          Current moderation outcome for this story.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-6 pt-0">
        <InfoBox label="Status">
          <Badge
            variant="outline"
            className={`mt-3 capitalize ${getEnforcementStatusColor(manga.enforcementStatus)}`}
          >
            {manga.enforcementStatus}
          </Badge>
        </InfoBox>
        <InfoBox label="Reason" muted>
          {manga.enforcementReason || "No enforcement reason recorded."}
        </InfoBox>
        <div className="grid gap-3 sm:grid-cols-2">
          <InfoBox label="Updated By">
            {manga.enforcementUpdatedBy?.username || "--"}
          </InfoBox>
          <InfoBox label="Updated At">
            {formatMangaDate(manga.enforcementUpdatedAt)}
          </InfoBox>
        </div>
      </CardContent>
    </Card>
  );
}

function RestrictionAction({
  buttonText,
  description,
  icon,
  onClick,
  title,
  tone = "green",
}: {
  buttonText: string;
  description: string;
  icon?: ReactNode;
  onClick: () => void;
  title: string;
  tone?: "green" | "orange" | "red";
}) {
  const toneClass =
    tone === "red"
      ? "border-red-200 bg-red-50 text-red-800"
      : tone === "orange"
        ? "border-orange-200 bg-orange-50 text-orange-800"
        : "border-emerald-200 bg-emerald-50 text-emerald-800";

  return (
    <div className={`rounded-xl border p-4 ${toneClass}`}>
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-1 text-xs leading-5">{description}</p>
      <Button
        variant={tone === "red" ? "destructive" : "outline"}
        className="mt-4 w-full"
        onClick={onClick}
      >
        {icon}
        {buttonText}
      </Button>
    </div>
  );
}

function InfoBox({
  children,
  label,
  muted,
}: {
  children: ReactNode;
  label: string;
  muted?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border border-slate-200 p-4 ${
        muted ? "bg-slate-50" : "bg-white"
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <div className="mt-2 break-words text-sm font-semibold leading-6 text-slate-900">
        {children}
      </div>
    </div>
  );
}
