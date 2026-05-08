import Link from "next/link";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function SendNotificationComposeCard({
  body,
  description,
  receiverEmail,
  sending,
  title,
  titleLabel,
  onBodyChange,
  onReceiverEmailChange,
  onSend,
  onTitleChange,
}: {
  body: string;
  description: string;
  receiverEmail: string;
  sending: boolean;
  title: string;
  titleLabel: string;
  onBodyChange: (value: string) => void;
  onReceiverEmailChange: (value: string) => void;
  onSend: () => void;
  onTitleChange: (value: string) => void;
}) {
  return (
    <Card className="space-y-4 p-6">
      <h3 className="font-semibold">{titleLabel}</h3>

      <div className="space-y-2">
        <label className="text-sm font-medium">Receiver Email</label>
        <Input
          value={receiverEmail}
          onChange={(event) => onReceiverEmailChange(event.target.value)}
          placeholder="author@example.com"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Notification Title</label>
        <Input
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder="Notification title"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Notification Body</label>
        <Textarea
          value={body}
          onChange={(event) => onBodyChange(event.target.value)}
          placeholder="Write notification body..."
          className="min-h-[420px]"
        />
      </div>

      <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
        {description}
      </div>

      <div className="flex justify-end gap-2">
        <Link href="/admin/notifications">
          <Button variant="outline">Cancel</Button>
        </Link>
        <Button onClick={onSend} disabled={sending}>
          <Send className="mr-2 h-4 w-4" />
          {sending ? "Sending..." : "Send Notification"}
        </Button>
      </div>
    </Card>
  );
}
