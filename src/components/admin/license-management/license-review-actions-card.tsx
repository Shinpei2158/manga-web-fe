import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type {
  ActionFeedback,
  ActionState,
} from "@/lib/admin-license-management/license-management.types";

type LicenseReviewActionsCardProps = {
  actionFeedback: ActionFeedback | null;
  actionState: ActionState;
  isActionBusy: boolean;
  isReviewBusy: boolean;
  rejectionReason: string;
  onApprove: () => void;
  onReject: () => void;
  onRejectionReasonChange: (value: string) => void;
};

export function LicenseReviewActionsCard({
  actionFeedback,
  actionState,
  isActionBusy,
  isReviewBusy,
  rejectionReason,
  onApprove,
  onReject,
  onRejectionReasonChange,
}: LicenseReviewActionsCardProps) {
  return (
    <div className="space-y-4 xl:sticky xl:top-6 xl:self-start">
      {actionFeedback ? (
        <Alert
          variant={actionFeedback.tone === "error" ? "destructive" : "default"}
        >
          {actionFeedback.tone === "error" ? (
            <AlertTriangle className="h-4 w-4" />
          ) : (
            <CheckCircle2 className="h-4 w-4" />
          )}
          <AlertTitle>{actionFeedback.title}</AlertTitle>
          <AlertDescription>{actionFeedback.message}</AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Review Actions</CardTitle>
          <CardDescription>
            Approve or reject this submission after reviewing the proof files
            above.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Reject reason</label>
            <Textarea
              value={rejectionReason}
              onChange={(event) =>
                onRejectionReasonChange(event.target.value)
              }
              rows={5}
              placeholder="Explain what is missing, unreadable, or still unclear in the proof files..."
              className="rounded-xl"
            />
          </div>

          <div className="grid gap-3">
            <Button
              onClick={onApprove}
              className="bg-green-600 hover:bg-green-700"
              disabled={isActionBusy}
            >
              {actionState === "approve" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="mr-2 h-4 w-4" />
              )}
              Approve Submission
            </Button>

            <Button
              variant="destructive"
              onClick={onReject}
              disabled={isActionBusy}
            >
              {actionState === "reject" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Reject Submission
            </Button>
          </div>

          {isReviewBusy ? (
            <p className="text-xs text-gray-500">
              Saving moderation result...
            </p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
