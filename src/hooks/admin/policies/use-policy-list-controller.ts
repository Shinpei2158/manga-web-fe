"use client"

import { useEffect, useMemo, useState } from "react"
import { fetchAdminPolicies } from "@/lib/admin-policies/api"
import type {
  Policy,
  SortField,
  SortOrder,
  StatusFilter,
  VisibilityFilter,
} from "@/lib/admin-policies/types"

const ITEMS_PER_PAGE = 10

export function usePolicyListController() {
  const [policies, setPolicies] = useState<Policy[]>([])
  const [totalPolicies, setTotalPolicies] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<StatusFilter>("all")
  const [visibilityFilter, setVisibilityFilter] =
    useState<VisibilityFilter>("all")
  const [loading, setLoading] = useState(false)
  const [sortField, setSortField] = useState<SortField>("updatedAt")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        setLoading(true)
        const response = await fetchAdminPolicies({
          currentPage,
          filterStatus,
          itemsPerPage: ITEMS_PER_PAGE,
          searchQuery,
          sortField,
          sortOrder,
          visibilityFilter,
        })

        setPolicies(response.items)
        setTotalPolicies(response.total)
        setTotalPages(response.totalPages)
      } catch (error) {
        console.error("Failed to fetch policies:", error)
        setPolicies([])
        setTotalPolicies(0)
      } finally {
        setLoading(false)
      }
    }

    void fetchPolicies()
  }, [
    currentPage,
    filterStatus,
    searchQuery,
    sortField,
    sortOrder,
    visibilityFilter,
  ])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, filterStatus, visibilityFilter, sortField, sortOrder])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const counts = useMemo(() => {
    return {
      active: policies.filter((policy) => policy.status === "Active").length,
      archived: policies.filter((policy) => policy.status === "Archived").length,
      draft: policies.filter((policy) => policy.status === "Draft").length,
      internal: policies.filter((policy) => !policy.isPublic).length,
      public: policies.filter((policy) => policy.isPublic).length,
      total: totalPolicies,
    }
  }, [policies, totalPolicies])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((previous) => (previous === "asc" ? "desc" : "asc"))
      return
    }

    setSortField(field)
    setSortOrder(field === "updatedAt" ? "desc" : "asc")
  }

  const clearFilters = () => {
    setSearchQuery("")
    setFilterStatus("all")
    setVisibilityFilter("all")
    setSortField("updatedAt")
    setSortOrder("desc")
  }

  return {
    clearFilters,
    counts,
    currentPage,
    filterStatus,
    handleSort,
    loading,
    policies,
    searchQuery,
    setCurrentPage,
    setFilterStatus,
    setSearchQuery,
    setVisibilityFilter,
    sortField,
    sortOrder,
    totalPages,
    totalPolicies,
    visibilityFilter,
  }
}

export type PolicyListController = ReturnType<typeof usePolicyListController>
