"use client"

import { use } from "react"
import AdminLayout from "../../adminLayout/page"
import { PolicyEditView } from "@/components/admin/policies/policy-edit-view"
import { usePolicyEditController } from "@/hooks/admin/policies/use-policy-edit-controller"

export default function AdminPolicyEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const controller = usePolicyEditController(id)

  return (
    <AdminLayout>
      <PolicyEditView controller={controller} />
    </AdminLayout>
  )
}
