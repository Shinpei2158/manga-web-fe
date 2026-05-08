"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AuditLogDetailsController } from "@/hooks/admin/audit-logs/use-audit-log-details";
import {
  auditDetailInsetSurfaceClass,
  auditDetailSurfaceClass,
} from "@/lib/admin-audit-logs/constants";
import { AuditDiffObjectView } from "./audit-diff-view";

export function AuditLogChangeDetails({
  controller: c,
}: {
  controller: AuditLogDetailsController;
}) {
  return (
    <Card className={`${auditDetailSurfaceClass} bg-gradient-to-br from-white via-white to-emerald-50/30`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold text-slate-950">
          Change details
        </CardTitle>
      </CardHeader>

      <CardContent>
        {c.hasEvidence ? (
          <Tabs defaultValue="diff" className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-xl bg-slate-100 p-1">
              <TabsTrigger value="diff" className="rounded-lg">
                Before / After
              </TabsTrigger>
              <TabsTrigger value="evidence" className="rounded-lg">
                Evidence
              </TabsTrigger>
            </TabsList>
            <TabsContent value="diff" className="mt-4">
              <DiffContent controller={c} />
            </TabsContent>
            <TabsContent value="evidence" className="mt-4">
              <EvidenceGrid images={c.evidenceImages} />
            </TabsContent>
          </Tabs>
        ) : (
          <DiffContent controller={c} />
        )}
      </CardContent>
    </Card>
  );
}

function DiffContent({ controller: c }: { controller: AuditLogDetailsController }) {
  if (!c.hasDiff) {
    return (
      <div className={`${auditDetailInsetSurfaceClass} p-4 text-sm text-slate-500`}>
        No before/after snapshot was recorded for this entry.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <div className="rounded-xl border border-rose-200/80 bg-rose-50/60 p-4">
        <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-rose-700">
          Before
        </div>
        <AuditDiffObjectView obj={c.beforeObj} />
      </div>

      <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/60 p-4">
        <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
          After
        </div>
        <AuditDiffObjectView obj={c.afterObj} />
      </div>
    </div>
  );
}

function EvidenceGrid({ images }: { images: string[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {images.map((src, index) => (
        <div
          key={`${src}-${index}`}
          className="overflow-hidden rounded-xl border border-slate-200/80 bg-slate-50/60"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={`evidence-${index}`}
            className="h-40 w-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}

