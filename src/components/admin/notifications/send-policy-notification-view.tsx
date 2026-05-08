"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { SendPolicyNotificationController } from "@/hooks/admin-notifications/use-send-policy-notification-controller";
import { getPolicyStatusLabel } from "@/lib/admin-notifications/utils";
import { SendNotificationComposeCard } from "./send-notification-compose-card";
import { SendNotificationQuickActions } from "./send-notification-quick-actions";

export function SendPolicyNotificationView({
  controller: c,
}: {
  controller: SendPolicyNotificationController;
}) {
  const backHref = c.chapterId
    ? `/admin/moderation/workspace?chapterId=${c.chapterId}`
    : "/admin/notifications";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Admin</span>
        <span>/</span>
        <span>Notifications</span>
        <span>/</span>
        <span className="text-foreground">Policy Send Noti</span>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Send Chapter Policy Notification
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Send an in-app notification to the author for a chapter flagged by
            moderation.
          </p>
        </div>

        <Link href={backHref}>
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
      </div>

      {c.loading ? <Card className="p-4 text-sm">Loading...</Card> : null}

      {c.record && !c.loading ? (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-1">
            <PolicyContextCard record={c.record} />
            <SendNotificationQuickActions
              body={c.body}
              title={c.title}
              copyText={c.copyText}
              resetTemplate={c.resetTemplate}
            />
          </div>

          <div className="xl:col-span-2">
            <SendNotificationComposeCard
              body={c.body}
              description="This notification is intended for authors whose chapters were flagged during moderation review."
              receiverEmail={c.receiverEmail}
              sending={c.sending}
              title={c.title}
              titleLabel="Compose Policy Notification"
              onBodyChange={c.setBody}
              onReceiverEmailChange={c.setReceiverEmail}
              onSend={c.handleSend}
              onTitleChange={c.setTitle}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function PolicyContextCard({
  record,
}: {
  record: SendPolicyNotificationController["record"];
}) {
  if (!record) return null;

  return (
    <Card className="space-y-4 p-6">
      <h3 className="font-semibold">Chapter Moderation Info</h3>
      <InfoLine label="Manga" value={record.mangaTitle || "-"} />
      <InfoLine label="Chapter" value={record.chapterTitle || "-"} />
      <InfoLine label="Author" value={record.authorName || "-"} />
      <InfoLine label="Receiver Email" value={record.authorEmail || "(empty)"} />
      <InfoLine label="Risk Score" value={`${record.risk_score}/100`} />

      <div>
        <p className="mb-2 text-sm text-muted-foreground">AI Status</p>
        <Badge variant="outline">{getPolicyStatusLabel(record.ai_status)}</Badge>
      </div>

      <div>
        <p className="mb-2 text-sm text-muted-foreground">Labels</p>
        <div className="flex flex-wrap gap-2">
          {record.labels.length > 0 ? (
            record.labels.map((label) => (
              <Badge key={label} variant="secondary">
                {label}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-muted-foreground">No labels</span>
          )}
        </div>
      </div>
    </Card>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="break-all font-medium">{value}</p>
    </div>
  );
}
