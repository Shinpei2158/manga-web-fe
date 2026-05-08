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
  const [usesServerPagination, setUsesServerPagination] = useState(false)
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

        setUsesServerPagination(response.serverPaginated)
        setPolicies(response.items)
        setTotalPolicies(response.total)
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

  const counts = useMemo(() => {
    return {
      active: policies.filter((policy) => policy.status === "Active").length,
      archived: policies.filter((policy) => policy.status === "Archived").length,
      draft: policies.filter((policy) => policy.status === "Draft").length,
      internal: policies.filter((policy) => !policy.isPublic).length,
      public: policies.filter((policy) => policy.isPublic).length,
      total: usesServerPagination ? totalPolicies : policies.length,
    }
  }, [policies, totalPolicies, usesServerPagination])

  const filteredPolicies = useMemo(() => {
    if (usesServerPagination) {
      return policies
    }

    const normalizedSearch = searchQuery.trim().toLowerCase()

    const filtered = policies.filter((policy) => {
      const matchesSearch =
        !normalizedSearch ||
        policy.title.toLowerCase().includes(normalizedSearch) ||
        policy.slug?.toLowerCase().includes(normalizedSearch) ||
        policy.description?.toLowerCase().includes(normalizedSearch)
      const matchesStatus =
        filterStatus === "all" || policy.status === filterStatus
      const matchesVisibility =
        visibilityFilter === "all" ||
        (visibilityFilter === "public" && policy.isPublic) ||
        (visibilityFilter === "internal" && !policy.isPublic)

      return matchesSearch && matchesStatus && matchesVisibility
    })

    return filtered.sort((a, b) => {
      if (sortField === "updatedAt") {
        const timeA = new Date(a.updatedAt).getTime()
        const timeB = new Date(b.updatedAt).getTime()
        return sortOrder === "asc" ? timeA - timeB : timeB - timeA
      }

      if (sortField === "isPublic") {
        return sortOrder === "asc"
          ? Number(a.isPublic) - Number(b.isPublic)
          : Number(b.isPublic) - Number(a.isPublic)
      }

      const valueA = String(a[sortField] ?? "")
      const valueB = String(b[sortField] ?? "")

      return sortOrder === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA)
    })
  }, [
    filterStatus,
    policies,
    searchQuery,
    sortField,
    sortOrder,
    usesServerPagination,
    visibilityFilter,
  ])

  const totalPages = Math.max(
    1,
    Math.ceil(
      (usesServerPagination ? totalPolicies : filteredPolicies.length) /
        ITEMS_PER_PAGE,
    ),
  )
  const paginatedPolicies = usesServerPagination
    ? filteredPolicies
    : filteredPolicies.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
      )

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
    filteredPolicies,
    handleSort,
    loading,
    paginatedPolicies,
    searchQuery,
    setCurrentPage,
    setFilterStatus,
    setSearchQuery,
    setVisibilityFilter,
    sortField,
    sortOrder,
    totalPages,
    visibilityFilter,
  }
}

export type PolicyListController = ReturnType<typeof usePolicyListController>
