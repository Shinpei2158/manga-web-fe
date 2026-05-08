import axios from "axios"
import type {
  Policy,
  PolicyApiResponse,
  PolicyFormValues,
  PolicyListResponse,
  SortField,
  SortOrder,
  StatusFilter,
  VisibilityFilter,
} from "./types"

function resolvePoliciesBaseUrl() {
  const rawBaseUrl = (process.env.NEXT_PUBLIC_API_URL || "").trim()
  return `${rawBaseUrl.replace(/\/+$/, "")}/api/policies`
}

const policiesApi = axios.create({
  baseURL: resolvePoliciesBaseUrl(),
  withCredentials: true,
})

export async function fetchAdminPolicies(params: {
  currentPage: number
  filterStatus: StatusFilter
  itemsPerPage: number
  searchQuery: string
  sortField: SortField
  sortOrder: SortOrder
  visibilityFilter: VisibilityFilter
}): Promise<PolicyListResponse> {
  const res = await policiesApi.get("", {
    params: {
      limit: params.itemsPerPage,
      page: params.currentPage,
      search: params.searchQuery.trim() || undefined,
      sortField: params.sortField,
      sortOrder: params.sortOrder,
      status:
        params.filterStatus !== "all" ? params.filterStatus : undefined,
      visibility:
        params.visibilityFilter === "all"
          ? undefined
          : params.visibilityFilter === "public"
            ? "public"
            : "internal",
    },
  })

  if (Array.isArray(res.data)) {
    return {
      items: res.data,
      serverPaginated: false,
      total: res.data.length,
    }
  }

  const payload = res.data as {
    data?: Policy[]
    items?: Policy[]
    total?: number
    totalItems?: number
  }
  const items = Array.isArray(payload?.items)
    ? payload.items
    : Array.isArray(payload?.data)
      ? payload.data
      : []

  return {
    items,
    serverPaginated: true,
    total: Number(payload?.total ?? payload?.totalItems ?? items.length),
  }
}

export async function fetchAdminPolicy(id: string) {
  const res = await policiesApi.get<PolicyApiResponse>(`/${id}`)
  return res.data
}

export async function createAdminPolicy(values: PolicyFormValues, status: "Active" | "Draft") {
  const res = await policiesApi.post("", {
    content: values.content,
    description: values.description.trim(),
    isPublic: values.isPublic,
    mainType: values.mainType,
    status,
    subCategory: values.subCategory,
    title: values.title.trim(),
  })
  return res
}

export async function updateAdminPolicy(id: string, values: PolicyFormValues) {
  const res = await policiesApi.put(`/${id}`, {
    content: values.content,
    description: values.description.trim(),
    effective_from: values.effective_from || null,
    effective_to: values.effective_to || null,
    isPublic: values.isPublic,
    mainType: values.mainType,
    slug: values.slug.trim(),
    status: values.status,
    subCategory: values.subCategory,
    title: values.title.trim(),
  })
  return res
}
