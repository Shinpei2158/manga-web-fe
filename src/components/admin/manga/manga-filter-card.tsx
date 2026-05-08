"use client";

import { RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AdminMangaController } from "@/hooks/admin/manga/use-admin-manga-controller";

export function MangaFilterCard({
  controller: c,
}: {
  controller: AdminMangaController;
}) {
  return (
    <Card className="rounded-3xl border-slate-200/80 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg text-slate-900">
              Review lanes
            </CardTitle>
            <CardDescription className="max-w-2xl text-sm leading-6">
              Jump into the stories that need attention first, then narrow the
              queue with filters below.
            </CardDescription>
          </div>

          <div className="flex flex-wrap gap-2">
            {c.quickFilterButtons.map((filter) => {
              const Icon = filter.icon;
              const active = c.activeQuickFilter === filter.key;

              return (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => c.applyQuickFilter(filter.key)}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition ${
                    active
                      ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{filter.label}</span>
                  {typeof filter.count === "number" ? (
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        active
                          ? "bg-white/15 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {filter.count}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by title or author..."
              value={c.searchQuery}
              onChange={(event) => {
                c.setSearchQuery(event.target.value);
                c.setPage(1);
              }}
              className="h-11 rounded-2xl border-slate-200 pl-10"
            />
          </div>

          <Button
            variant="outline"
            className="h-11 rounded-2xl"
            onClick={c.resetFilters}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset all
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
          <FilterSelect
            value={c.licenseFilter}
            placeholder="License Status"
            onValueChange={(value) => {
              c.setLicenseFilter(value);
              c.setPage(1);
            }}
            options={[
              ["all", "All License"],
              ["none", "None"],
              ["pending", "Pending"],
              ["approved", "Approved"],
              ["rejected", "Rejected"],
            ]}
          />
          <FilterSelect
            value={c.publicationFilter}
            placeholder="Publication Status"
            onValueChange={(value) => {
              c.setPublicationFilter(value);
              c.setPage(1);
            }}
            options={[
              ["all", "All Publication"],
              ["draft", "Draft"],
              ["published", "Published"],
              ["unpublished", "Unpublished"],
            ]}
          />
          <FilterSelect
            value={c.enforcementFilter}
            placeholder="Enforcement Status"
            onValueChange={(value) => {
              c.setEnforcementFilter(value);
              c.setPage(1);
            }}
            options={[
              ["all", "All Enforcement"],
              ["normal", "Normal"],
              ["suspended", "Suspended"],
              ["banned", "Banned"],
            ]}
          />
          <FilterSelect
            value={c.authorFilter}
            placeholder="Author"
            onValueChange={(value) => {
              c.setAuthorFilter(value);
              c.setPage(1);
            }}
            options={[
              ["all", "All Authors"],
              ...c.authorOptions.map((author) => [author.id, author.name] as const),
            ]}
          />
          <FilterSelect
            value={c.limit}
            placeholder="Rows per page"
            onValueChange={(value) => {
              c.setLimit(value);
              c.setPage(1);
            }}
            options={[
              ["5", "5 / page"],
              ["10", "10 / page"],
              ["20", "20 / page"],
              ["50", "50 / page"],
            ]}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function FilterSelect({
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
      <SelectTrigger className="rounded-2xl">
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
