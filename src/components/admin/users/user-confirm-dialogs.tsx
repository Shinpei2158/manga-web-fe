"use client";

import { Loader2 } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ConfirmActionType } from "@/components/admin/users/user-management.types";
import type {
  BulkActionType,
  BulkConfirmCopy,
  ConfirmCopy,
} from "@/lib/admin-users/types";

export function UserConfirmDialog({
  confirmAction,
  confirmCopy,
  isSubmitting,
  onConfirm,
  onOpenChange,
}: {
  confirmAction: ConfirmActionType | null;
  confirmCopy: ConfirmCopy;
  isSubmitting: boolean;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <AlertDialog open={!!confirmAction} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{confirmCopy.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {confirmCopy.description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isSubmitting}
            onClick={(event) => {
              event.preventDefault();
              onConfirm();
            }}
            className={
              confirmCopy.destructive
                ? "bg-red-600 text-white hover:bg-red-700"
                : ""
            }
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              confirmCopy.actionLabel
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function BulkConfirmDialog({
  bulkConfirmAction,
  bulkConfirmCopy,
  bulkReason,
  isSubmitting,
  onConfirm,
  onOpenChange,
  onReasonChange,
}: {
  bulkConfirmAction: BulkActionType | null;
  bulkConfirmCopy: BulkConfirmCopy;
  bulkReason: string;
  isSubmitting: boolean;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  onReasonChange: (value: string) => void;
}) {
  return (
    <AlertDialog open={!!bulkConfirmAction} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{bulkConfirmCopy.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {bulkConfirmCopy.description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-2">
          <Label htmlFor="bulk-reason">
            {bulkConfirmCopy.reasonLabel}
            {bulkConfirmCopy.requiresReason ? " *" : " (optional)"}
          </Label>
          <Textarea
            id="bulk-reason"
            value={bulkReason}
            onChange={(event) => onReasonChange(event.target.value)}
            placeholder={bulkConfirmCopy.reasonPlaceholder}
            disabled={isSubmitting}
            rows={4}
          />
          <p className="text-xs text-slate-500">
            {bulkConfirmCopy.requiresReason
              ? "This note is required and will be recorded in moderation history."
              : "This note is optional and will be recorded in moderation history when provided."}
          </p>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isSubmitting}
            onClick={(event) => {
              event.preventDefault();
              onConfirm();
            }}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              bulkConfirmCopy.actionLabel
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
