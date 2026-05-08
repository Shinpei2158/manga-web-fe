"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { AdminMangaController } from "@/hooks/admin-manga/use-admin-manga-controller";

const actionTitles = {
  ban: "Ban Manga",
  "clear-enforcement": "Remove Restriction",
  publish: "Publish Manga",
  suspend: "Suspend Manga",
  unpublish: "Unpublish Manga",
} as const;

export function MangaActionDialog({
  controller: c,
}: {
  controller: AdminMangaController;
}) {
  const actionDialog = c.actionDialog;
  const needsReason = actionDialog === "suspend" || actionDialog === "ban";

  return (
    <Dialog
      open={Boolean(actionDialog)}
      onOpenChange={(open) => !open && c.closeActionDialog()}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{actionDialog ? actionTitles[actionDialog] : ""}</DialogTitle>
          <DialogDescription>
            <ActionDescription
              actionDialog={actionDialog}
              title={c.dialogStoryTitle}
            />
          </DialogDescription>
        </DialogHeader>

        {needsReason ? (
          <div className="space-y-2">
            <Label htmlFor="enforcementReason">
              {actionDialog === "suspend" ? "Suspension reason" : "Ban reason"}
            </Label>
            <Textarea
              id="enforcementReason"
              placeholder="Enter reason..."
              value={c.enforcementReason}
              onChange={(event) => c.setEnforcementReason(event.target.value)}
            />
          </div>
        ) : null}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={c.closeActionDialog}
            disabled={c.actionLoading}
          >
            Cancel
          </Button>
          <Button
            variant={actionDialog === "ban" ? "destructive" : "default"}
            onClick={c.handleConfirmAction}
            disabled={c.actionLoading}
          >
            {c.actionLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <ActionButtonLabel actionDialog={actionDialog} />
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ActionDescription({
  actionDialog,
  title,
}: {
  actionDialog: AdminMangaController["actionDialog"];
  title: string;
}) {
  if (actionDialog === "publish") {
    return <>This will make &quot;{title}&quot; visible to users.</>;
  }
  if (actionDialog === "unpublish") {
    return <>This will hide &quot;{title}&quot; from public view.</>;
  }
  if (actionDialog === "suspend") {
    return (
      <>Suspending &quot;{title}&quot; will remove it from normal access temporarily.</>
    );
  }
  if (actionDialog === "ban") {
    return <>Banning &quot;{title}&quot; will block it from the platform.</>;
  }
  if (actionDialog === "clear-enforcement") {
    return <>Remove the current restriction from &quot;{title}&quot;?</>;
  }
  return null;
}

function ActionButtonLabel({
  actionDialog,
}: {
  actionDialog: AdminMangaController["actionDialog"];
}) {
  if (actionDialog === "publish") return <>Publish</>;
  if (actionDialog === "unpublish") return <>Unpublish</>;
  if (actionDialog === "suspend") return <>Suspend</>;
  if (actionDialog === "ban") return <>Ban</>;
  if (actionDialog === "clear-enforcement") return <>Confirm</>;
  return <>Confirm</>;
}
