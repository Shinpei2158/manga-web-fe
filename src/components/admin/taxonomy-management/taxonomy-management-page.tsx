"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { TaxonomyConfig } from "./types";
import { TaxonomyAddDialog, TaxonomyEditDialog } from "./taxonomy-dialogs";
import { TaxonomyPagination } from "./taxonomy-pagination";
import { TaxonomyTable } from "./taxonomy-table";
import { TaxonomyToolbar } from "./taxonomy-toolbar";
import { useTaxonomyManagement } from "./use-taxonomy-management";

export function TaxonomyManagementPage({ config }: { config: TaxonomyConfig }) {
  const state = useTaxonomyManagement(config);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {config.pageTitle}
          </h1>
          <p className="mt-1 text-muted-foreground">{config.pageDescription}</p>
        </div>

        <TaxonomyAddDialog
          config={config}
          canAdd={state.canAdd}
          isOpen={state.isAddDialogOpen}
          saving={state.savingAdd}
          value={state.newItem}
          onOpenChange={state.setIsAddDialogOpen}
          onSave={state.handleAddItem}
          onValueChange={state.setNewItem}
        />
      </div>

      <Card>
        <TaxonomyToolbar
          filterStatus={state.filterStatus}
          limit={state.limit}
          listTitle={config.listTitle}
          loading={state.loading}
          onFilterStatusChange={state.setFilterStatus}
          onLimitChange={state.setLimit}
          onRefresh={state.fetchItems}
          onSearchChange={state.setSearch}
          onSortChange={state.setSort}
          search={state.search}
          sort={state.sort}
        />

        <CardContent className="space-y-4">
          {state.error ? (
            <TaxonomyError error={state.error} onRetry={state.fetchItems} />
          ) : null}

          {!state.error ? (
            <>
              <TaxonomyTable
                config={config}
                items={state.items}
                loading={state.loading}
                onAdd={() => state.setIsAddDialogOpen(true)}
                onEdit={state.openEditDialog}
              />
              <TaxonomyPagination
                loading={state.loading}
                onPageChange={state.setPage}
                page={state.page}
                pageCount={state.pageCount}
                total={state.total}
              />
            </>
          ) : null}
        </CardContent>
      </Card>

      <TaxonomyEditDialog
        canEdit={state.canEdit}
        config={config}
        item={state.editItem}
        isOpen={state.isEditDialogOpen}
        onItemChange={state.setEditItem}
        onOpenChange={state.setIsEditDialogOpen}
        onSave={state.handleUpdateItem}
        saving={state.savingEdit}
      />
    </div>
  );
}

function TaxonomyError({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-4">
      <div>
        <div className="font-medium text-destructive">Failed to load data</div>
        <div className="text-sm text-destructive/90">{error}</div>
      </div>
      <button className="rounded-md border px-3 py-2 text-sm" onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}
