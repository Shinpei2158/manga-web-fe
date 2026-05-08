"use client";

import { Edit, Eye, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TaxonomyConfig, TaxonomyItem } from "./types";
import {
  formatTaxonomyDate,
  getTaxonomyStatusBadgeClass,
  getTaxonomyStatusLabel,
} from "./utils";

export function TaxonomyTable({
  config,
  items,
  loading,
  onAdd,
  onEdit,
}: {
  config: TaxonomyConfig;
  items: TaxonomyItem[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (item: TaxonomyItem) => void;
}) {
  if (!loading && items.length === 0) {
    return (
      <div className="space-y-2 rounded-lg border p-10 text-center">
        <div className="text-lg font-medium">No {config.itemLabel.toLowerCase()}s found</div>
        <div className="text-sm text-muted-foreground">
          {config.emptyDescription}
        </div>
        <Button className="mt-2" onClick={onAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add {config.itemLabel}
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="w-full overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/30">
            <tr className="border-b">
              <th className="p-3 text-left font-medium">Name</th>
              <th className="p-3 text-left font-medium">Description</th>
              <th className="p-3 text-left font-medium">Status</th>
              {config.showStoriesCount ? (
                <th className="p-3 text-left font-medium">Stories</th>
              ) : null}
              <th className="p-3 text-left font-medium">Updated</th>
              <th className="p-3 text-left font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <SkeletonRow key={index} columns={config.showStoriesCount ? 6 : 5} />
                ))
              : items.map((item) => (
                  <TaxonomyRow
                    key={item._id}
                    config={config}
                    item={item}
                    onEdit={onEdit}
                  />
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TaxonomyRow({
  config,
  item,
  onEdit,
}: {
  config: TaxonomyConfig;
  item: TaxonomyItem;
  onEdit: (item: TaxonomyItem) => void;
}) {
  return (
    <tr className="border-b last:border-b-0 hover:bg-muted/10">
      <td className="p-3 align-middle">
        <div className="min-w-[220px] font-medium">{item.name}</div>
      </td>
      <td className="p-3 align-middle text-muted-foreground">
        <div className="min-w-[280px] line-clamp-2">{item.description}</div>
      </td>
      <td className="p-3 align-middle">
        <Badge className={getTaxonomyStatusBadgeClass(item.status)}>
          {getTaxonomyStatusLabel(item.status)}
        </Badge>
      </td>
      {config.showStoriesCount ? (
        <td className="p-3 align-middle">
          <div className="flex items-center">
            <Eye className="mr-1 h-4 w-4 text-blue-500" />
            {item.storiesCount ?? 0}
          </div>
        </td>
      ) : null}
      <td className="p-3 align-middle text-muted-foreground">
        {formatTaxonomyDate(item.updatedAt)}
      </td>
      <td className="p-3 align-middle">
        <Button variant="outline" size="sm" onClick={() => onEdit(item)}>
          <Edit className="h-4 w-4" />
        </Button>
      </td>
    </tr>
  );
}

function SkeletonRow({ columns }: { columns: number }) {
  return (
    <tr className="border-b last:border-b-0">
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index} className="p-3">
          <div className="h-4 w-full animate-pulse rounded bg-muted/40" />
        </td>
      ))}
    </tr>
  );
}
