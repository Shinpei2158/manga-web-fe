"use client"

import AdminLayout from "../adminLayout/page"
import { PolicyListView } from "@/components/admin/policies/policy-list-view"
import { usePolicyListController } from "@/hooks/admin/policies/use-policy-list-controller"

export default function AdminPoliciesPage() {
  const controller = usePolicyListController()

  return (
    <AdminLayout>
      <PolicyListView controller={controller} />
    </AdminLayout>
  )
}
