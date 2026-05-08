import type { PolicyStatus } from "./types"

export function getPolicyStatusColor(status: PolicyStatus) {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800 border-green-200"
    case "Draft":
      return "bg-gray-100 text-gray-800 border-gray-200"
    case "Archived":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export function getPolicyVisibilityColor(isPublic: boolean) {
  return isPublic
    ? "bg-green-100 text-green-800 border-green-200"
    : "bg-amber-100 text-amber-800 border-amber-200"
}

export function formatPolicyDate(value?: string | null) {
  if (!value) return "-"
  return new Date(value).toLocaleDateString("vi-VN")
}

export function getPolicyErrorMessage(error: unknown, fallback: string) {
  const err = error as {
    response?: { data?: { error?: unknown; message?: unknown } }
    message?: string
  }
  const backendMessage =
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    fallback

  return Array.isArray(backendMessage)
    ? backendMessage.join("\n")
    : String(backendMessage)
}
