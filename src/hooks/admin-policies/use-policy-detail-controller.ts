"use client"

import { useEffect, useState } from "react"
import { fetchAdminPolicy } from "@/lib/admin-policies/api"
import type { PolicyApiResponse } from "@/lib/admin-policies/types"

export function usePolicyDetailController(id?: string) {
  const [loading, setLoading] = useState(true)
  const [policy, setPolicy] = useState<PolicyApiResponse | null>(null)

  useEffect(() => {
    const loadPolicy = async () => {
      if (!id) {
        setLoading(false)
        setPolicy(null)
        return
      }

      try {
        setLoading(true)
        setPolicy(await fetchAdminPolicy(id))
      } catch (error) {
        console.error("Failed to load policy detail:", error)
        setPolicy(null)
      } finally {
        setLoading(false)
      }
    }

    void loadPolicy()
  }, [id])

  return {
    loading,
    policy,
  }
}

export type PolicyDetailController = ReturnType<
  typeof usePolicyDetailController
>
