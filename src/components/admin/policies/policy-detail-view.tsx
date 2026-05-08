"use client"

import Link from "next/link"
import { ArrowLeft, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import PolicyReader from "@/components/policies/policy-reader"
import type { PolicyDetailController } from "@/hooks/admin-policies/use-policy-detail-controller"
import { PolicyDetailLoadingState } from "./policy-table-states"

function NotFoundState() {
  return (
    <Card>
      <CardContent className="space-y-4 p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Policy not found
        </h2>
        <p className="text-sm text-gray-500">
          Cannot load this policy, or the policy no longer exists.
        </p>
        <div>
          <Link href="/admin/policies">
            <Button variant="outline">Back to policies</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export function PolicyDetailView({
  controller: c,
  id,
}: {
  controller: PolicyDetailController
  id?: string
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-1 text-sm text-gray-500">
            Admin / Policies / Detail
          </p>
          <h1 className="text-3xl font-bold text-gray-900">Policy Detail</h1>
        </div>

        <div className="flex gap-3">
          <Link href="/admin/policies">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>

          {id ? (
            <Link href={`/admin/policies/${id}`}>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Pencil className="mr-2 h-4 w-4" />
                Edit Policy
              </Button>
            </Link>
          ) : null}
        </div>
      </div>

      {c.loading ? (
        <PolicyDetailLoadingState />
      ) : !c.policy ? (
        <NotFoundState />
      ) : (
        <PolicyReader
          title={c.policy.title || "Untitled policy"}
          description={c.policy.description}
          content={c.policy.content || ""}
          mainType={c.policy.mainType}
          subCategory={c.policy.subCategory}
          status={c.policy.status}
          isPublic={c.policy.isPublic}
          effectiveFrom={
            c.policy.effective_from
              ? String(c.policy.effective_from).slice(0, 10)
              : ""
          }
          effectiveTo={
            c.policy.effective_to
              ? String(c.policy.effective_to).slice(0, 10)
              : ""
          }
          updatedAt={c.policy.updatedAt}
        />
      )}
    </div>
  )
}
