"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { prettyFieldLabel, prettyFieldValue } from "@/lib/audit-ui";

export function AuditDiffObjectView({ obj }: { obj: Record<string, any> }) {
  const keys = Object.keys(obj || {});
  if (!keys.length) {
    return <p className="text-sm text-slate-500">No changes available.</p>;
  }

  return (
    <div className="space-y-3">
      {keys.map((key) => (
        <div key={key} className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            {prettyFieldLabel(key)}
          </p>
          <AuditValueView value={prettyFieldValue(key, obj[key])} />
        </div>
      ))}
    </div>
  );
}

function AuditValueView({ value }: { value: any }) {
  if (value === null || value === undefined) {
    return <p className="text-xs text-slate-500">--</p>;
  }

  if (typeof value === "string") {
    return (
      <Textarea
        value={value}
        readOnly
        className="min-h-[120px] resize-none rounded-xl border-slate-200 bg-white/80 text-xs text-slate-700"
      />
    );
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return <p className="text-sm text-slate-700">{String(value)}</p>;
  }

  return (
    <ScrollArea className="h-44 rounded-xl border border-slate-200/70 bg-white/80">
      <pre className="whitespace-pre-wrap break-words p-3 text-xs text-slate-700">
        {JSON.stringify(value, null, 2)}
      </pre>
    </ScrollArea>
  );
}

