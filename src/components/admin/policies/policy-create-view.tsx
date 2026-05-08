"use client"

import type { PolicyCreateController } from "@/hooks/admin-policies/use-policy-create-controller"
import PolicyForm from "@/components/policies/policy-form"

export function PolicyCreateView({
  controller: c,
}: {
  controller: PolicyCreateController
}) {
  return (
    <PolicyForm
      mode="create"
      initialValues={c.initialValues}
      loading={c.loading}
      onSubmit={c.handleSubmit}
    />
  )
}
