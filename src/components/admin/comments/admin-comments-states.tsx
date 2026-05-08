"use client";

import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function AdminCommentsLoadingState() {
  return (
    <div className="p-6">
      <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <CardContent className="flex min-h-[280px] items-center justify-center text-slate-500">
          Loading comments...
        </CardContent>
      </Card>
    </div>
  );
}

export function AdminCommentsErrorState({ error }: { error: string }) {
  return (
    <div className="p-6">
      <Card className="rounded-2xl border-red-200 bg-red-50/60">
        <CardContent className="flex min-h-[220px] flex-col items-center justify-center gap-3 text-center">
          <AlertCircle className="h-8 w-8 text-red-600" />
          <h2 className="text-lg font-semibold text-red-700">
            Unable to load comments
          </h2>
          <p className="max-w-xl text-sm text-red-700/90">{error}</p>
        </CardContent>
      </Card>
    </div>
  );
}

