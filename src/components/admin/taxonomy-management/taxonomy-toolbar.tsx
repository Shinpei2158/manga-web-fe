"use client";

import { RefreshCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TaxonomySortKey, TaxonomyStatus } from "./types";

export function TaxonomyToolbar({
  filterStatus,
  limit,
  listTitle,
  loading,
  onFilterStatusChange,
  onLimitChange,
  onRefresh,
  onSearchChange,
  onSortChange,
  search,
  sort,
}: {
  filterStatus: "all" | TaxonomyStatus;
  limit: number;
  listTitle: string;
  loading: boolean;
  onFilterStatusChange: (value: "all" | TaxonomyStatus) => void;
  onLimitChange: (value: number) => void;
  onRefresh: () => void;
  onSearchChange: (value: string) => void;
  onSortChange: (value: TaxonomySortKey) => void;
  search: string;
  sort: TaxonomySortKey;
}) {
  return (
    <CardHeader className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <CardTitle className="text-lg">{listTitle}</CardTitle>
        <Button
          variant="outline"
          size="icon"
          onClick={onRefresh}
          title="Refresh"
          disabled={loading}
        >
          <RefreshCcw className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
        </Button>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-[320px]">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              className="pl-10"
              placeholder="Search name/description..."
            />
          </div>

          <Select
            value={filterStatus}
            onValueChange={(value) =>
              onFilterStatusChange(value as "all" | TaxonomyStatus)
            }
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="hide">Hidden</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sort}
            onValueChange={(value) => onSortChange(value as TaxonomySortKey)}
          >
            <SelectTrigger className="w-full sm:w-[220px]">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updatedAt.desc">Updated: newest</SelectItem>
              <SelectItem value="name.asc">Name: A to Z</SelectItem>
              <SelectItem value="name.desc">Name: Z to A</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows</span>
          <Select
            value={String(limit)}
            onValueChange={(value) => onLimitChange(Number(value))}
          >
            <SelectTrigger className="w-[110px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 50].map((rows) => (
                <SelectItem key={rows} value={String(rows)}>
                  {rows}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </CardHeader>
  );
}
