"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { AuditLogsController } from "@/hooks/admin-audit-logs/use-audit-logs-controller";
import {
  auditActionOptions,
  auditInsetSurfaceClass,
  auditSurfaceClass,
} from "@/lib/admin-audit-logs/constants";

export function AuditLogFiltersPanel({
  controller: c,
}: {
  controller: AuditLogsController;
}) {
  return (
    <Card className={auditSurfaceClass}>
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold text-slate-950">
          Refine results
        </CardTitle>
        <p className="text-sm leading-6 text-slate-500">
          Filters run server-side and also drive the CSV export so the table and
          download stay aligned.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="flex-1">
            <Input
              placeholder="Search by actor, email, or message..."
              value={c.filters.search}
              onChange={(event) => c.updateFilter("search", event.target.value)}
              className="w-full border-slate-200 bg-white/80 text-slate-900 placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-5">
          <AuditSelect
            value={c.filters.roleFilter}
            onValueChange={(value) => c.updateFilter("roleFilter", value)}
            placeholder="Role"
            options={[
              ["all", "All Roles"],
              ["admin", "Admin"],
              ["content_moderator", "Content Moderator"],
              ["community_manager", "Community Manager"],
              ["system", "System"],
            ]}
          />

          <AuditSelect
            value={c.filters.actionFilter}
            onValueChange={(value) => c.updateFilter("actionFilter", value)}
            placeholder="Action"
            options={[
              ["all", "All Actions"],
              ...auditActionOptions.map((item) => [item.value, item.label] as const),
            ]}
          />

          <AuditSelect
            value={c.filters.statusFilter}
            onValueChange={(value) => c.updateFilter("statusFilter", value)}
            placeholder="Status"
            options={[
              ["all", "All Status"],
              ["unseen", "Unseen"],
              ["seen", "Seen"],
              ["pending", "Pending"],
              ["approved", "Approved"],
            ]}
          />

          <AuditSelect
            value={c.filters.dateFilter}
            onValueChange={(value) => c.updateFilter("dateFilter", value)}
            placeholder="Date Range"
            options={[
              ["all", "All Time"],
              ["today", "Today"],
              ["7days", "Last 7 Days"],
              ["30days", "Last 30 Days"],
              ["custom", "Custom Range"],
            ]}
          />

          <div className={`flex items-center space-x-2 px-3 py-2 ${auditInsetSurfaceClass}`}>
            <Switch
              checked={c.filters.highRiskOnly}
              onCheckedChange={(value) => c.updateFilter("highRiskOnly", value)}
            />
            <span className="text-sm text-slate-700">High Risk Only</span>
          </div>
        </div>

        {c.hasCustomRange ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <DateField
              label="From"
              value={c.filters.customFrom}
              onChange={(value) => c.updateFilter("customFrom", value)}
            />
            <DateField
              label="To"
              value={c.filters.customTo}
              onChange={(value) => c.updateFilter("customTo", value)}
            />
          </div>
        ) : null}

        {c.hasCustomRange && c.isCustomRangeInvalid ? (
          <p className="text-xs text-rose-700">
            Start date must be on or before end date.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}

function AuditSelect({
  onValueChange,
  options,
  placeholder,
  value,
}: {
  onValueChange: (value: string) => void;
  options: readonly (readonly [string, string])[];
  placeholder: string;
  value: string;
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="border-slate-200 bg-white/80 text-slate-700">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map(([optionValue, label]) => (
          <SelectItem key={optionValue} value={optionValue}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function DateField({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </label>
      <Input
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="border-slate-200 bg-white/80 text-slate-700"
      />
    </div>
  );
}

