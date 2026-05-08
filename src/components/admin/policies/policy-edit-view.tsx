"use client"

import { Card, CardContent } from "@/components/ui/card"
import PolicyForm from "@/components/policies/policy-form"
import type { PolicyEditController } from "@/hooks/admin-policies/use-policy-edit-controller"

export function PolicyEditView({
  controller: c,
}: {
  controller: PolicyEditController
}) {
  if (!c.initialValues) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-gray-500">
          Loading policy details...
        </CardContent>
      </Card>
    )
  }

  return (
    <PolicyForm
      mode="edit"
      initialValues={c.initialValues}
      loading={c.loading}
      onSubmit={c.handleSubmit}
    />
  )
}
