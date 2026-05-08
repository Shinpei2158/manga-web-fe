"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  fetchAdminPolicy,
  updateAdminPolicy,
} from "@/lib/admin-policies/api"
import { getPolicyErrorMessage } from "@/lib/admin-policies/utils"
import {
  buildPolicyFormValues,
  type PolicyFormAction,
  type PolicyFormValues,
} from "@/components/policies/policy-form"

export function usePolicyEditController(id: string) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [initialValues, setInitialValues] = useState<PolicyFormValues | null>(
    null,
  )

  useEffect(() => {
    const loadPolicy = async () => {
      if (!id) return

      try {
        setLoading(true)
        const data = await fetchAdminPolicy(id)

        setInitialValues(
          buildPolicyFormValues({
            content: data.content ?? "",
            description: data.description ?? "",
            effective_from: data.effective_from
              ? String(data.effective_from).slice(0, 10)
              : "",
            effective_to: data.effective_to
              ? String(data.effective_to).slice(0, 10)
              : "",
            isPublic: data.isPublic ?? false,
            mainType: data.mainType ?? "TERM",
            slug: data.slug ?? "",
            status: data.status ?? "Draft",
            subCategory: data.subCategory ?? "general",
            title: data.title ?? "",
          }),
        )
      } catch (error) {
        console.error("Failed to load policy:", error)
        alert(getPolicyErrorMessage(error, "Cannot load policy details."))
      } finally {
        setLoading(false)
      }
    }

    void loadPolicy()
  }, [id])

  const handleSubmit = async (
    values: PolicyFormValues,
    _action: PolicyFormAction,
  ) => {
    try {
      setLoading(true)
      const res = await updateAdminPolicy(id, values)

      if (res.status === 200) {
        router.push("/admin/policies")
        return
      }

      console.warn("Unexpected response:", res)
    } catch (error) {
      console.error("Error updating policy:", error)
      alert(getPolicyErrorMessage(error, "Failed to update policy."))
    } finally {
      setLoading(false)
    }
  }

  return {
    handleSubmit,
    initialValues,
    loading,
  }
}

export type PolicyEditController = ReturnType<typeof usePolicyEditController>
