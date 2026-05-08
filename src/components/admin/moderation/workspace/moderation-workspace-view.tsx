"use client";

import { Card } from "@/components/ui/card";
import type { ModerationWorkspaceController } from "@/hooks/admin/moderation/use-moderation-workspace-controller";
import { ChapterSummary } from "./chapter-summary";
import { ContentViewer } from "./content-viewer";
import { FindingsPanel } from "./findings-panel";

export function ModerationWorkspaceView({
  controller: c,
}: {
  controller: ModerationWorkspaceController;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Admin</span>
        <span>/</span>
        <span>Moderation</span>
        <span>/</span>
        <span className="text-foreground">Workspace</span>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Moderation Workspace</h1>
        <p className="text-sm text-muted-foreground">
          Review AI findings, inspect flagged content, and decide whether this
          chapter should be marked safe or rejected.
        </p>
      </div>

      {!c.chapterId && (
        <Card className="border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          Select a chapter from the moderation queue to open the workspace.
        </Card>
      )}

      {c.err && (
        <Card className="border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {c.err}
        </Card>
      )}

      {c.notice && (
        <Card
          className={`p-4 text-sm ${
            c.notice.tone === "error"
              ? "border-red-200 bg-red-50 text-red-700"
              : c.notice.tone === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-blue-200 bg-blue-50 text-blue-700"
          }`}
        >
          {c.notice.message}
        </Card>
      )}

      {c.loading && <Card className="p-4 text-sm">Loading workspace...</Card>}

      {!!c.record && !c.loading && (
        <>
          <ChapterSummary
            record={c.record}
            onDecision={c.onDecision}
            onRecheck={c.onRecheck}
            loading={c.actLoading}
          />

          <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.95fr)]">
            <ContentViewer
              html={c.record.contentHtml ?? "<p><i>(No content available)</i></p>"}
              activeFinding={c.activeFinding}
            />

            <FindingsPanel
              findings={c.findings}
              activeFindingId={c.activeFindingId}
              onSelectFinding={c.setActiveFindingId}
            />
          </div>
        </>
      )}
    </div>
  );
}
