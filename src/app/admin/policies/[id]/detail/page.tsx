"use client"

import { use } from "react"
import AdminLayout from "../../../adminLayout/page"
import { PolicyDetailView } from "@/components/admin/policies/policy-detail-view"
import { usePolicyDetailController } from "@/hooks/admin/policies/use-policy-detail-controller"

export default function AdminPolicyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const controller = usePolicyDetailController(id)

  return (
    <AdminLayout>
      <PolicyDetailView controller={controller} id={id} />
    </AdminLayout>
  )
}
