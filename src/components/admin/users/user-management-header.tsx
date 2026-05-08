"use client";

import { formatRoleLabel } from "@/components/admin/users/user-management.utils";

export function UserManagementHeader({
  actorRole,
  description,
  focus,
}: {
  actorRole: string;
  description: string;
  focus: string;
}) {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          User Management
        </h1>
        <p className="mt-1 text-slate-600">{description}</p>
        <p className="mt-2 text-sm text-slate-500">{focus}</p>
      </div>

      <div className="rounded-lg border bg-white px-3 py-2 text-sm text-slate-600">
        Signed in as:{" "}
        <span className="font-semibold text-slate-900">
          {actorRole ? formatRoleLabel(actorRole) : "Unknown"}
        </span>
      </div>
    </div>
  );
}
