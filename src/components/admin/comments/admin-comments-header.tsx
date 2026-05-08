"use client";

import { formatRoleLabel } from "@/components/admin/users/user-management.utils";
import type { CommentMe } from "@/lib/admin-comments/types";

export function AdminCommentsHeader({
  me,
  roleNormalized,
}: {
  me: CommentMe | null;
  roleNormalized: string;
}) {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Comment Management
        </h1>
        <p className="mt-1 text-slate-600">
          Review discussion activity, inspect context faster, and moderate
          comment visibility without leaving the workspace.
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Quick presets, preview cards, context links, and a side review panel
          are now tuned for moderation flow instead of plain CRUD.
        </p>
      </div>

      <div className="rounded-lg border bg-white px-3 py-2 text-sm text-slate-600">
        Signed in as:{" "}
        <span className="font-semibold text-slate-900">
          {me?.role ? formatRoleLabel(roleNormalized) : "Unknown"}
        </span>
      </div>
    </div>
  );
}

