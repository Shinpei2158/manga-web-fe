"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { PolicyListController } from "@/hooks/admin/policies/use-policy-list-controller"
import type { SortField } from "@/lib/admin-policies/types"
import {
  formatPolicyDate,
  getPolicyStatusColor,
  getPolicyVisibilityColor,
} from "@/lib/admin-policies/utils"
import {
  PolicyEmptyState,
  PolicyTableLoadingSkeleton,
} from "./policy-table-states"

function SortIcon({
  field,
  sortField,
  sortOrder,
}: {
  field: SortField
  sortField: SortField
  sortOrder: "asc" | "desc"
}) {
  if (sortField !== field) return null
  return sortOrder === "asc" ? (
    <ArrowUp className="ml-1 inline h-3 w-3 text-blue-600" />
  ) : (
    <ArrowDown className="ml-1 inline h-3 w-3 text-blue-600" />
  )
}

export function PolicyListTable({
  controller: c,
}: {
  controller: PolicyListController
}) {
  const router = useRouter()

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {c.loading ? (
          <PolicyTableLoadingSkeleton />
        ) : c.filteredPolicies.length === 0 ? (
          <PolicyEmptyState onReset={c.clearFilters} />
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table className="min-w-[1040px] table-fixed">
                <colgroup>
                  <col className="w-[32%]" />
                  <col className="w-[13%]" />
                  <col className="w-[13%]" />
                  <col className="w-[11%]" />
                  <col className="w-[11%]" />
                  <col className="w-[12%]" />
                  <col className="w-[120px]" />
                </colgroup>
                <TableHeader>
                  <TableRow>
                    {[
                      ["title", "Title"],
                      ["mainType", "Main Type"],
                      ["subCategory", "Category"],
                      ["status", "Status"],
                      ["isPublic", "Visibility"],
                      ["updatedAt", "Updated"],
                    ].map(([field, label]) => (
                      <TableHead
                        key={field}
                        onClick={() => c.handleSort(field as SortField)}
                        className={`cursor-pointer select-none ${
                          field === "status" || field === "isPublic"
                            ? "text-center"
                            : field === "updatedAt"
                              ? "whitespace-nowrap"
                              : ""
                        }`}
                      >
                        {label}{" "}
                        <SortIcon
                          field={field as SortField}
                          sortField={c.sortField}
                          sortOrder={c.sortOrder}
                        />
                      </TableHead>
                    ))}

                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {c.paginatedPolicies.map((policy) => (
                    <TableRow
                      key={policy._id}
                      onClick={() =>
                        router.push(`/admin/policies/${policy._id}/detail`)
                      }
                      className="cursor-pointer transition hover:bg-blue-50/50"
                    >
                      <TableCell>
                        <div className="font-medium text-gray-900">
                          {policy.title}
                        </div>
                        <div className="mt-1 truncate text-xs text-gray-500">
                          {policy.description || policy.slug || "No description"}
                        </div>
                      </TableCell>

                      <TableCell className="truncate">{policy.mainType}</TableCell>
                      <TableCell className="truncate capitalize">
                        {policy.subCategory}
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs ${getPolicyStatusColor(
                            policy.status,
                          )}`}
                        >
                          {policy.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs ${getPolicyVisibilityColor(
                            policy.isPublic,
                          )}`}
                        >
                          {policy.isPublic ? "Public" : "Internal"}
                        </span>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm text-gray-600">
                        {formatPolicyDate(policy.updatedAt)}
                      </TableCell>
                      <TableCell className="text-center">
                        <div
                          className="flex justify-center gap-2"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <Link href={`/admin/policies/${policy._id}/detail`}>
                            <Button variant="ghost" size="sm" title="Open detail">
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">Open detail</span>
                            </Button>
                          </Link>

                          <Link href={`/admin/policies/${policy._id}`}>
                            <Button variant="ghost" size="sm" title="Edit policy">
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between border-t bg-gray-50 px-4 py-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  c.setCurrentPage((previous) => Math.max(previous - 1, 1))
                }
                disabled={c.currentPage === 1}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <p className="text-sm text-gray-600">
                Page <span className="font-semibold">{c.currentPage}</span> of{" "}
                <span className="font-semibold">{c.totalPages}</span>
              </p>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  c.setCurrentPage((previous) =>
                    Math.min(previous + 1, c.totalPages),
                  )
                }
                disabled={c.currentPage === c.totalPages}
                className="flex items-center gap-1"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
