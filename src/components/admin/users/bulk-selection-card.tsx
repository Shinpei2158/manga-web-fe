"use client";

import { RotateCcw, UserX, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { BulkActionMeta } from "@/lib/admin-users/types";

export function BulkSelectionCard({
  actionMeta,
  actorRole,
  isSubmitting,
  onClearSelection,
  onRequestBan,
  onRequestMute,
  onRequestReset,
  selectedCount,
}: {
  actionMeta: BulkActionMeta;
  actorRole: string;
  isSubmitting: boolean;
  onClearSelection: () => void;
  onRequestBan: () => void;
  onRequestMute: () => void;
  onRequestReset: () => void;
  selectedCount: number;
}) {
  return (
    <Card className="border-slate-200 bg-slate-50/80">
      <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-900">
            {selectedCount} account{selectedCount === 1 ? "" : "s"} selected on
            this page
          </p>
          <p className="text-sm text-slate-600">
            Selection applies to the current page only.
          </p>
          <p className="text-xs text-slate-500">{actionMeta.helper}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {actorRole === "admin" ? (
            <BulkActionButton
              disabled={isSubmitting || actionMeta.actionableCount === 0}
              icon="reset"
              label={actionMeta.label}
              onClick={onRequestReset}
            />
          ) : null}

          {actorRole === "content_moderator" ? (
            <BulkActionButton
              disabled={isSubmitting || actionMeta.actionableCount === 0}
              icon="ban"
              label={actionMeta.label}
              onClick={onRequestBan}
            />
          ) : null}

          {actorRole === "community_manager" ? (
            <BulkActionButton
              disabled={isSubmitting || actionMeta.actionableCount === 0}
              icon="mute"
              label={actionMeta.label}
              onClick={onRequestMute}
            />
          ) : null}

          <Button
            variant="outline"
            onClick={onClearSelection}
            disabled={isSubmitting}
          >
            Clear selection
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function BulkActionButton({
  disabled,
  icon,
  label,
  onClick,
}: {
  disabled: boolean;
  icon: "ban" | "mute" | "reset";
  label: string;
  onClick: () => void;
}) {
  const Icon = icon === "reset" ? RotateCcw : icon === "ban" ? UserX : VolumeX;

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className="bg-red-600 text-white hover:bg-red-700"
    >
      <Icon className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}
