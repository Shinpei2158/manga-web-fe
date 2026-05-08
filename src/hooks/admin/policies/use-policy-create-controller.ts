"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createAdminPolicy } from "@/lib/admin-policies/api"
import { getPolicyErrorMessage } from "@/lib/admin-policies/utils"
import {
  buildPolicyFormValues,
  type PolicyFormAction,
  type PolicyFormValues,
} from "@/components/policies/policy-form"

export function usePolicyCreateController() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (
    values: PolicyFormValues,
    action: PolicyFormAction,
  ) => {
    try {
      setLoading(true)
      const res = await createAdminPolicy(
        values,
        action === "publish" ? "Active" : "Draft",
      )

      if (res.status === 201 || res.status === 200) {
        router.push("/admin/policies")
        return
      }

      console.warn("Unexpected response:", res)
    } catch (error) {
      console.error("Error creating policy:", error)
      alert(getPolicyErrorMessage(error, "Failed to create policy."))
    } finally {
      setLoading(false)
    }
  }

  return {
    initialValues: buildPolicyFormValues(),
    loading,
    handleSubmit,
  }
}

export type PolicyCreateController = ReturnType<
  typeof usePolicyCreateController
>
