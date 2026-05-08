"use client";

import { Loader2 } from "lucide-react";
import CommunityReportModal from "@/components/ui/community-report-modal";
import ReportModal from "@/components/ui/report-modal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { ReportWorkspaceController } from "@/hooks/admin/report/use-report-workspace-controller";

export function ReportWorkspaceDialogs({
  controller: c,
}: {
  controller: ReportWorkspaceController;
}) {
  return (
    <>
      <ReportModal
        open={c.views.content.isModalOpen}
        group={c.contentSelectedGroup}
        busyKey={c.busyKey}
        focusReportId={c.views.content.focusReportId}
        onClose={() =>
          c.patchView("content", { focusReportId: null, isModalOpen: false })
        }
        onSubmitItemAction={(item, action) =>
          c.handleSubmitItemAction("content", item, action)
        }
      />

      <CommunityReportModal
        open={c.views.community.isModalOpen}
        group={c.communitySelectedGroup}
        busyKey={c.busyKey}
        focusReportId={c.views.community.focusReportId}
        onClose={() =>
          c.patchView("community", { focusReportId: null, isModalOpen: false })
        }
        onSubmitItemAction={(item, action) =>
          c.handleSubmitItemAction("community", item, action)
        }
      />

      <AlertDialog
        open={Boolean(c.activeConfirmGroup)}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) c.patchView(c.activeTab, { confirmGroupKey: null });
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark all current cases done?</AlertDialogTitle>
            <AlertDialogDescription>
              {c.activeConfirmGroup ? (
                <>
                  This will resolve every unresolved{" "}
                  {c.activeTab === "content" ? "manga and chapter" : "comment and reply"}{" "}
                  report currently grouped under{" "}
                  <span className="font-semibold text-slate-900">
                    {c.activeConfirmGroup.meta.name}
                  </span>
                  . Existing done cases stay unchanged.
                </>
              ) : (
                "This will resolve every unresolved grouped case in the selected row."
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={Boolean(c.busyKey)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={!c.activeConfirmGroup || Boolean(c.busyKey)}
              className="bg-emerald-600 text-white hover:bg-emerald-700"
              onClick={(event) => {
                event.preventDefault();
                if (!c.activeConfirmGroup) return;
                c.handleResolveGroup(c.activeTab, c.activeConfirmGroup);
              }}
            >
              {c.busyKey && c.activeConfirmGroup ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
