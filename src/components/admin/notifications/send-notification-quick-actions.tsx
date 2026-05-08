import { Copy, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function SendNotificationQuickActions({
  body,
  copyText,
  resetTemplate,
  title,
}: {
  body: string;
  copyText: (value: string, label: string) => void;
  resetTemplate: () => void;
  title: string;
}) {
  return (
    <Card className="space-y-3 p-6">
      <h3 className="font-semibold">Quick Actions</h3>

      <Button
        variant="outline"
        className="w-full justify-start"
        onClick={() => copyText(title, "Title")}
      >
        <Copy className="mr-2 h-4 w-4" />
        Copy Title
      </Button>

      <Button
        variant="outline"
        className="w-full justify-start"
        onClick={() => copyText(body, "Body")}
      >
        <Copy className="mr-2 h-4 w-4" />
        Copy Body
      </Button>

      <Button
        variant="outline"
        className="w-full justify-start"
        onClick={resetTemplate}
      >
        <RefreshCcw className="mr-2 h-4 w-4" />
        Reset to Template
      </Button>
    </Card>
  );
}
