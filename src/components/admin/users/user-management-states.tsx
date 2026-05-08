"use client";

import { FilterX, RefreshCw, Search, TriangleAlert, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function UserLoadErrorCard({
  loadError,
  onReset,
  onRetry,
}: {
  loadError: string;
  onReset: () => void;
  onRetry: () => void;
}) {
  return (
    <Card className="border-red-200 bg-red-50/60">
      <CardContent className="flex flex-col gap-4 p-6">
        <div className="flex items-center gap-2 text-red-700">
          <TriangleAlert className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Unable to load data</h2>
        </div>

        <p className="text-sm text-red-700/90">{loadError}</p>

        <div className="flex flex-wrap gap-3">
          <Button onClick={onRetry}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>

          <Button variant="outline" onClick={onReset}>
            Reset error state
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function EmptyUsersCard() {
  return (
    <Card>
      <CardContent className="flex min-h-[280px] flex-col items-center justify-center text-center">
        <Users className="mb-4 h-10 w-10 text-slate-400" />
        <h3 className="text-lg font-semibold text-slate-900">No users yet</h3>
        <p className="mt-2 max-w-md text-sm text-slate-600">
          When the system receives user data, the list will appear here.
        </p>
      </CardContent>
    </Card>
  );
}

export function NoMatchingUsersCard({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <Card>
      <CardContent className="flex min-h-[280px] flex-col items-center justify-center rounded-md border border-dashed text-center">
        <Search className="mb-4 h-10 w-10 text-slate-400" />
        <h3 className="text-lg font-semibold text-slate-900">
          No matching users
        </h3>
        <p className="mt-2 max-w-md text-sm text-slate-600">
          Try changing your search keyword or clearing the current filters.
        </p>

        <Button className="mt-4" variant="outline" onClick={onClearFilters}>
          <FilterX className="mr-2 h-4 w-4" />
          Clear filters
        </Button>
      </CardContent>
    </Card>
  );
}
