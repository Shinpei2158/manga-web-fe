"use client"

import Link from "next/link"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { PolicyListController } from "@/hooks/admin/policies/use-policy-list-controller"
import type {
  StatusFilter,
  VisibilityFilter,
} from "@/lib/admin-policies/types"
import { PolicyFilterChip } from "./policy-filter-chip"
import { PolicyListSummaryCard } from "./policy-list-summary-card"
import { PolicyListTable } from "./policy-list-table"

export function PolicyListView({
  controller: c,
}: {
  controller: PolicyListController
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-sm text-gray-500">Admin / Policies</p>
          <h1 className="text-3xl font-bold text-gray-900">
            Policies & Terms Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage policy lifecycle, visibility, and latest updates.
          </p>
        </div>

        <Link href="/admin/policies/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            New Policy
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <PolicyListSummaryCard
          title="Total Policies"
          value={c.counts.total}
          active={c.filterStatus === "all"}
          onClick={() => c.setFilterStatus("all")}
        />
        <PolicyListSummaryCard
          title="Active"
          value={c.counts.active}
          active={c.filterStatus === "Active"}
          tone="green"
          onClick={() => c.setFilterStatus("Active")}
        />
        <PolicyListSummaryCard
          title="Draft"
          value={c.counts.draft}
          active={c.filterStatus === "Draft"}
          tone="gray"
          onClick={() => c.setFilterStatus("Draft")}
        />
        <PolicyListSummaryCard
          title="Archived"
          value={c.counts.archived}
          active={c.filterStatus === "Archived"}
          tone="red"
          onClick={() => c.setFilterStatus("Archived")}
        />
      </div>

      <Card>
        <CardContent className="space-y-4 p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col gap-3 md:flex-row">
              <div className="relative md:max-w-sm md:flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search by title, slug, or description..."
                  value={c.searchQuery}
                  onChange={(event) => c.setSearchQuery(event.target.value)}
                  className="pl-10"
                />
              </div>

              <Select
                value={c.filterStatus}
                onValueChange={(value: StatusFilter) =>
                  c.setFilterStatus(value)
                }
              >
                <SelectTrigger className="w-full md:w-44">
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={c.visibilityFilter}
                onValueChange={(value: VisibilityFilter) =>
                  c.setVisibilityFilter(value)
                }
              >
                <SelectTrigger className="w-full md:w-44">
                  <SelectValue placeholder="Filter visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All visibility</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="internal">Internal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-gray-500">
                {c.filteredPolicies.length} result
                {c.filteredPolicies.length !== 1 ? "s" : ""}
              </p>

              <Button variant="outline" onClick={c.clearFilters}>
                Reset
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 border-t pt-4">
            <PolicyFilterChip
              label={`All (${c.counts.total})`}
              active={
                c.filterStatus === "all" && c.visibilityFilter === "all"
              }
              onClick={() => {
                c.setFilterStatus("all")
                c.setVisibilityFilter("all")
              }}
            />
            <PolicyFilterChip
              label={`Active (${c.counts.active})`}
              active={c.filterStatus === "Active"}
              onClick={() => c.setFilterStatus("Active")}
            />
            <PolicyFilterChip
              label={`Draft (${c.counts.draft})`}
              active={c.filterStatus === "Draft"}
              onClick={() => c.setFilterStatus("Draft")}
            />
            <PolicyFilterChip
              label={`Archived (${c.counts.archived})`}
              active={c.filterStatus === "Archived"}
              onClick={() => c.setFilterStatus("Archived")}
            />
            <PolicyFilterChip
              label={`Public (${c.counts.public})`}
              active={c.visibilityFilter === "public"}
              onClick={() => c.setVisibilityFilter("public")}
            />
            <PolicyFilterChip
              label={`Internal (${c.counts.internal})`}
              active={c.visibilityFilter === "internal"}
              onClick={() => c.setVisibilityFilter("internal")}
            />
          </div>
        </CardContent>
      </Card>

      <PolicyListTable controller={c} />
    </div>
  )
}
