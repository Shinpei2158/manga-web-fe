"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  auditSurfaceClass,
  buildAuditSummaryCards,
} from "@/lib/admin-audit-logs/constants";
import type { AuditSummary } from "@/lib/admin-audit-logs/types";

export function AuditSummaryCards({ summary }: { summary: AuditSummary }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {buildAuditSummaryCards(summary).map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.title} className={auditSurfaceClass}>
            <CardContent className="flex items-start justify-between gap-4 p-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {item.title}
                </p>
                <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                  {item.value}
                </p>
                <p className="mt-1 text-sm text-slate-500">{item.helper}</p>
              </div>

              <span
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.iconClass}`}
              >
                <Icon className="h-5 w-5" />
              </span>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

