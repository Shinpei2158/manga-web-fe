"use client"

import Link from "next/link"
import { FileSearch } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PolicyTableLoadingSkeleton() {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="grid animate-pulse grid-cols-7 gap-3 rounded-xl border p-4"
        >
          <div className="col-span-2 h-4 rounded bg-gray-200" />
          <div className="h-4 rounded bg-gray-200" />
          <div className="h-4 rounded bg-gray-200" />
          <div className="h-4 rounded bg-gray-200" />
          <div className="h-4 rounded bg-gray-200" />
          <div className="h-4 rounded bg-gray-200" />
        </div>
      ))}
    </div>
  )
}

export function PolicyEmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <div className="mb-4 rounded-full bg-gray-100 p-4">
        <FileSearch className="h-6 w-6 text-gray-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">
        No matching policies
      </h3>
      <p className="mt-2 max-w-md text-sm text-gray-500">
        No policy matches the current filters. Reset filters or create a new
        policy.
      </p>
      <div className="mt-5 flex gap-3">
        <Button variant="outline" onClick={onReset}>
          Reset filters
        </Button>
        <Link href="/admin/policies/new">
          <Button>Create Policy</Button>
        </Link>
      </div>
    </div>
  )
}

export function PolicyDetailLoadingState() {
  return (
    <div className="space-y-4">
      <div className="animate-pulse rounded-2xl border bg-white p-6">
        <div className="h-4 w-28 rounded bg-gray-200" />
        <div className="mt-4 h-8 w-72 rounded bg-gray-200" />
        <div className="mt-4 h-4 w-full rounded bg-gray-200" />
        <div className="mt-2 h-4 w-5/6 rounded bg-gray-200" />
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <div className="h-24 rounded-xl bg-gray-100" />
          <div className="h-24 rounded-xl bg-gray-100" />
          <div className="h-24 rounded-xl bg-gray-100" />
        </div>
      </div>

      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-2xl border bg-white p-6"
        >
          <div className="h-5 w-48 rounded bg-gray-200" />
          <div className="mt-4 h-4 w-full rounded bg-gray-200" />
          <div className="mt-2 h-4 w-full rounded bg-gray-200" />
          <div className="mt-2 h-4 w-4/5 rounded bg-gray-200" />
        </div>
      ))}
    </div>
  )
}
