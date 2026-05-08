import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { NotificationVM } from "@/types/notification";

export function DeleteNotificationDialog({
  busyId,
  deleteTarget,
  onConfirm,
  onOpenChange,
}: {
  busyId: string | null;
  deleteTarget: NotificationVM | null;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={Boolean(deleteTarget)} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl border-slate-200">
        <DialogHeader>
          <DialogTitle className="text-slate-900">
            Delete notification?
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            This action will permanently remove the selected notification from
            the admin list. You cannot undo this action.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p className="font-medium">{deleteTarget?.title}</p>
          <p className="mt-1 line-clamp-2 text-red-600">
            {deleteTarget?.body}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            className="rounded-xl border-slate-200"
            onClick={() => onOpenChange(false)}
            disabled={busyId === deleteTarget?._id}
          >
            Cancel
          </Button>
          <Button
            className="rounded-xl bg-red-600 text-white hover:bg-red-700"
            onClick={onConfirm}
            disabled={busyId === deleteTarget?._id}
          >
            {busyId === deleteTarget?._id
              ? "Deleting..."
              : "Delete notification"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
