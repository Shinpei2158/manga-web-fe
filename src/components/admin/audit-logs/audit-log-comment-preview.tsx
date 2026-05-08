"use client";

import { MessageSquareText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AuditLogDetailsController } from "@/hooks/admin/audit-logs/use-audit-log-details";
import { auditDetailSurfaceClass } from "@/lib/admin-audit-logs/constants";

export function AuditLogCommentPreview({
  controller: c,
}: {
  controller: AuditLogDetailsController;
}) {
  const log = c.log!;

  return (
    <Card className={`${auditDetailSurfaceClass} bg-gradient-to-br from-white via-white to-amber-50/50`}>
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-950">
              <MessageSquareText className="h-4 w-4 text-amber-600" />
              {c.targetType === "reply" ? "Reply preview" : "Comment preview"}
            </CardTitle>
            <p className="text-sm leading-6 text-slate-500">
              Captured content from this audit entry, shown separately so the
              change log stays easier to scan.
            </p>
          </div>

          <Badge
            variant="outline"
            className="w-fit max-w-full whitespace-normal border-amber-200 bg-amber-50 text-left leading-5 text-amber-700"
          >
            {c.targetIdentity.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="rounded-[24px] border border-amber-200/70 bg-white/95 p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
          {c.renderedCommentHtml ? (
            <div
              className="space-y-3 whitespace-pre-wrap break-words text-sm leading-7 text-slate-700 [&_a]:text-sky-700 [&_a]:underline [&_blockquote]:rounded-2xl [&_blockquote]:border [&_blockquote]:border-slate-200 [&_blockquote]:bg-slate-50 [&_blockquote]:px-4 [&_blockquote]:py-3 [&_div]:min-h-[1.5rem] [&_img]:inline-block [&_img]:max-h-24 [&_img]:w-auto [&_img]:align-middle [&_img]:rounded-md [&_p]:mb-3 [&_p:last-child]:mb-0]"
              dangerouslySetInnerHTML={{ __html: c.renderedCommentHtml }}
            />
          ) : (
            <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-700">
              {c.commentPlainText || c.commentFallbackText}
            </p>
          )}
        </div>

        {log?.note || c.targetIdentity.meta !== "--" ? (
          <div className="flex flex-col gap-3 md:flex-row">
            {c.targetIdentity.meta !== "--" ? (
              <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 px-4 py-3 text-sm text-slate-600">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Linked record
                </span>
                <p className="mt-1 break-all text-slate-700">
                  {c.targetIdentity.meta}
                </p>
              </div>
            ) : null}

            {log?.note ? (
              <div className="flex-1 rounded-xl border border-slate-200/80 bg-slate-50/80 px-4 py-3 text-sm text-slate-600">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Moderator note
                </span>
                <p className="mt-1 whitespace-pre-wrap break-words text-slate-700">
                  {String(log.note)}
                </p>
              </div>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

