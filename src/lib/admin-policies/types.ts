import type {
  PolicyFormAction,
  PolicyFormValues,
  PolicyMainType,
  PolicyStatus,
  PolicySubCategory,
} from "@/components/policies/policy-form"

export type {
  PolicyFormAction,
  PolicyFormValues,
  PolicyMainType,
  PolicyStatus,
  PolicySubCategory,
}

export interface Policy {
  _id: string
  title: string
  slug: string
  mainType: PolicyMainType
  subCategory: PolicySubCategory
  description?: string
  content: string
  status: PolicyStatus
  isPublic: boolean
  updatedAt: string
  createdAt: string
  effective_from?: string | null
  effective_to?: string | null
}

export interface PolicyApiResponse {
  _id: string
  title?: string
  slug?: string
  mainType?: PolicyMainType
  subCategory?: PolicySubCategory
  status?: PolicyStatus
  isPublic?: boolean
  description?: string
  content?: string
  updatedAt?: string
  createdAt?: string
  effective_from?: string | null
  effective_to?: string | null
}

export type StatusFilter = "all" | PolicyStatus
export type VisibilityFilter = "all" | "public" | "internal"
export type SortField =
  | "title"
  | "mainType"
  | "subCategory"
  | "status"
  | "isPublic"
  | "updatedAt"

export type SortOrder = "asc" | "desc"

export interface PolicyListResponse {
  items: Policy[]
  total: number
  totalPages: number
}
