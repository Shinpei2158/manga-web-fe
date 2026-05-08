"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { surfaceCardClass } from "@/lib/admin-dashboard/constants";

const actions = [
  { label: "Policy library", href: "/admin/policies" },
  { label: "Audit logs", href: "/admin/audit-logs" },
  { label: "Notifications center", href: "/admin/notifications" },
  { label: "User operations", href: "/admin/user" },
];

export function QuickActionsSection() {
  return (
    <section className={cn(surfaceCardClass, "p-5 sm:p-6")}>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
            Quick Actions
          </p>
          <h3 className="text-lg font-semibold tracking-tight text-slate-950 dark:text-slate-50">
            Jump into the admin workspaces you use most
          </h3>
          <p className="max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            These shortcuts keep user operations, policy upkeep, audit review,
            and notification follow-up one click away from the main admin dashboard.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {actions.map((action) => (
            <Button
              key={action.href}
              asChild
              variant="outline"
              className="h-11 rounded-xl px-4"
            >
              <Link href={action.href}>
                {action.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
