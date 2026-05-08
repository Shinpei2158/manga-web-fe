import type { TaxonomyItem, TaxonomySortKey, TaxonomyStatus } from "./types";

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

export function filterAndSortTaxonomyItems({
  items,
  search,
  status,
  sort,
}: {
  items: TaxonomyItem[];
  search: string;
  status: "all" | TaxonomyStatus;
  sort: TaxonomySortKey;
}) {
  const keyword = search.trim().toLowerCase();

  return items
    .filter((item) => {
      const matchesSearch =
        !keyword ||
        item.name.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword);
      const matchesStatus = status === "all" || item.status === status;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => compareTaxonomyItems(a, b, sort));
}

function compareTaxonomyItems(
  a: TaxonomyItem,
  b: TaxonomyItem,
  sort: TaxonomySortKey,
) {
  switch (sort) {
    case "name.asc":
      return a.name.localeCompare(b.name);
    case "name.desc":
      return b.name.localeCompare(a.name);
    case "updatedAt.desc":
    default: {
      const left = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const right = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return right - left;
    }
  }
}

export function isValidTaxonomyForm(value: {
  name: string;
  description: string;
}) {
  return value.name.trim().length > 0 && value.description.trim().length >= 10;
}
