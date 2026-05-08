"use client"

import AdminLayout from "../../adminLayout/page"
import { PolicyCreateView } from "@/components/admin/policies/policy-create-view"
import { usePolicyCreateController } from "@/hooks/admin/policies/use-policy-create-controller"

export default function AdminPolicyCreatePage() {
  const controller = usePolicyCreateController()

  return (
    <AdminLayout>
      <PolicyCreateView controller={controller} />
    </AdminLayout>
  )
}
