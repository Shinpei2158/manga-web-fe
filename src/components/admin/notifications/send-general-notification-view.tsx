"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { SendGeneralNotificationController } from "@/hooks/admin-notifications/use-send-general-notification-controller";
import { SendNotificationComposeCard } from "./send-notification-compose-card";
import { SendNotificationQuickActions } from "./send-notification-quick-actions";

export function SendGeneralNotificationView({
  controller: c,
}: {
  controller: SendGeneralNotificationController;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Admin</span>
        <span>/</span>
        <span>Notifications</span>
        <span>/</span>
        <span className="text-foreground">Send Noti</span>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Send General Notification</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create and send a normal platform notification to a specific user.
          </p>
        </div>

        <Link href="/admin/notifications">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to List Sent Noti
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-1">
          <Card className="space-y-4 p-6">
            <h3 className="font-semibold">Notification Context</h3>

            <div>
              <p className="mb-2 text-sm text-muted-foreground">Type</p>
              <Badge variant="outline">General Notification</Badge>
            </div>

            <InfoLine
              label="Use cases"
              value="Announcements, reminders, chapter updates, account notices, or operational messages."
            />
            <InfoLine label="Target" value="One user by email" />
            <InfoLine
              label="Platform logic"
              value="Suitable for a manga reading platform to notify authors or readers directly in system."
            />
          </Card>

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
            description="This page sends an in-app notification to the selected user."
            receiverEmail={c.receiverEmail}
            sending={c.sending}
            title={c.title}
            titleLabel="Compose Notification"
            onBodyChange={c.setBody}
            onReceiverEmailChange={c.setReceiverEmail}
            onSend={c.handleSend}
            onTitleChange={c.setTitle}
          />
        </div>
      </div>
    </div>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
