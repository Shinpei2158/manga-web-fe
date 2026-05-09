import type { TaxonomyItem, TaxonomyStatus } from "./types";

export const DEFAULT_TAXONOMY_LIMIT = 10;

export function formatTaxonomyDate(value?: string) {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";

  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function getTaxonomyStatusBadgeClass(status: TaxonomyStatus) {
  if (status === "normal" || status === "active") {
    return "bg-green-100 text-green-800";
  }

  return "bg-red-100 text-red-800";
}

export function getTaxonomyStatusLabel(status: TaxonomyStatus) {
  if (status === "normal") return "Normal";
  if (status === "hide") return "Hidden";
  return status;
}

export function normalizeTaxonomyItems(payload: unknown): TaxonomyItem[] {
  if (Array.isArray(payload)) return payload as TaxonomyItem[];
  if (
    payload &&
    typeof payload === "object" &&
    Array.isArray((payload as { items?: unknown }).items)
  ) {
    return (payload as { items: TaxonomyItem[] }).items;
  }
  return [];
}

export function isValidTaxonomyForm(value: {
  name: string;
  description: string;
}) {
  return value.name.trim().length > 0 && value.description.trim().length >= 10;
}
