"use client";

import { EditUserDialog } from "@/components/admin/users/edit-user-dialog";
import { UserManagementFilters } from "@/components/admin/users/user-management-filters";
import { UserManagementPagination } from "@/components/admin/users/user-management-pagination";
import { UserManagementStats } from "@/components/admin/users/user-management-stats";
import { UserManagementTable } from "@/components/admin/users/user-management-table";
import type { UserManagementController } from "@/hooks/admin-users/use-user-management-controller";
import { BulkSelectionCard } from "./bulk-selection-card";
import { BulkConfirmDialog, UserConfirmDialog } from "./user-confirm-dialogs";
import { UserManagementHeader } from "./user-management-header";
import {
  EmptyUsersCard,
  NoMatchingUsersCard,
  UserLoadErrorCard,
} from "./user-management-states";

export function UserManagementView({
  controller,
}: {
  controller: UserManagementController;
}) {
  const c = controller;

  return (
    <div className="space-y-6">
      <UserManagementHeader
        actorRole={c.actorRole}
        description={c.workspaceCopy.description}
        focus={c.workspaceCopy.focus}
      />

      {c.loadError && !c.isLoading ? (
        <UserLoadErrorCard
          loadError={c.loadError}
          onReset={c.resetErrorState}
          onRetry={c.loadUsers}
        />
      ) : (
        <UserManagementBody controller={c} />
      )}

      <EditUserDialog
        open={c.isEditDialogOpen}
        onOpenChange={c.handleDialogOpenChange}
        selectedUser={c.selectedUser}
        actorRole={c.actorRole}
        draftRole={c.draftRole}
        draftStaffStatus={c.draftStaffStatus}
        resetReason={c.resetReason}
        banReason={c.banReason}
        muteReason={c.muteReason}
        isSubmitting={c.isSubmittingAction}
        activeConfirmAction={c.confirmAction}
        onDraftRoleChange={c.setDraftRole}
        onDraftStaffStatusChange={c.setDraftStaffStatus}
        onResetReasonChange={c.setResetReason}
        onBanReasonChange={c.setBanReason}
        onMuteReasonChange={c.setMuteReason}
        onRequestRoleUpdate={c.requestRoleUpdate}
        onRequestStaffStatusUpdate={c.requestStaffStatusUpdate}
        onRequestResetToNormal={c.requestResetToNormal}
        onRequestBan={c.requestBanUser}
        onRequestMute={c.requestMuteUser}
      />

      <UserConfirmDialog
        confirmAction={c.confirmAction}
        confirmCopy={c.confirmCopy}
        isSubmitting={c.isSubmittingAction}
        onConfirm={c.executeConfirmedAction}
        onOpenChange={(open) => {
          if (!c.isSubmittingAction) {
            c.setConfirmAction(open ? c.confirmAction : null);
          }
        }}
      />

      <BulkConfirmDialog
        bulkConfirmAction={c.bulkConfirmAction}
        bulkConfirmCopy={c.bulkConfirmCopy}
        bulkReason={c.bulkReason}
        isSubmitting={c.isSubmittingBulkAction}
        onConfirm={() => void c.executeBulkAction()}
        onOpenChange={(open) => {
          if (c.isSubmittingBulkAction) return;
          if (!open) {
            c.setBulkConfirmAction(null);
            c.setBulkReason("");
          }
        }}
        onReasonChange={c.setBulkReason}
      />
    </div>
  );
}

function UserManagementBody({
  controller: c,
}: {
  controller: UserManagementController;
}) {
  return (
    <>
      <UserManagementStats
        summary={c.summary}
        filterRole={c.filterRole}
        filterStatus={c.filterStatus}
        filterPreset={c.filterPreset}
        isLoading={c.isLoading}
        onApplyPreset={c.setFilterPreset}
        onSetRoleFilter={c.setFilterRole}
        onSetStatusFilter={c.handleFilterStatusChange}
        onResetFilters={c.clearFilters}
      />

      <UserManagementFilters
        searchTerm={c.searchTerm}
        filterRole={c.filterRole}
        filterStatus={c.filterStatus}
        filterPreset={c.filterPreset}
        isLoading={c.isLoading}
        isDirty={c.isFilterDirty}
        totalCount={c.summary.totalUsers}
        filteredCount={c.totalItems}
        activeFilterChips={c.activeFilterChips}
        onSearchChange={c.setSearchTerm}
        onRoleChange={c.setFilterRole}
        onStatusChange={c.handleFilterStatusChange}
        onPresetChange={c.setFilterPreset}
        onClearFilters={c.clearFilters}
        onReload={c.loadUsers}
      />

      {!c.isLoading && c.summary.totalUsers === 0 ? (
        <EmptyUsersCard />
      ) : !c.isLoading && c.totalItems === 0 ? (
        <NoMatchingUsersCard onClearFilters={c.clearFilters} />
      ) : (
        <UserManagementTableSection controller={c} />
      )}
    </>
  );
}

function UserManagementTableSection({
  controller: c,
}: {
  controller: UserManagementController;
}) {
  return (
    <>
      {c.selectedUsers.length > 0 && c.bulkActionMeta ? (
        <BulkSelectionCard
          actionMeta={c.bulkActionMeta}
          actorRole={c.actorRole}
          isSubmitting={c.isSubmittingBulkAction}
          onClearSelection={c.clearSelection}
          onRequestBan={c.requestBulkBan}
          onRequestMute={c.requestBulkMute}
          onRequestReset={c.requestBulkReset}
          selectedCount={c.selectedUsers.length}
        />
      ) : null}

      <UserManagementTable
        users={c.users}
        isLoading={c.isLoading}
        highlightId={c.highlightId}
        sorting={c.sorting}
        selectedIds={c.selectedIds}
        selectableIds={c.selectableIds}
        allVisibleSelected={c.allVisibleSelected}
        someVisibleSelected={c.someVisibleSelected}
        onSortingChange={c.setSorting}
        onToggleSelect={c.toggleSelect}
        onToggleSelectAll={c.toggleSelectAllVisible}
        onOpenUser={c.handleOpenUser}
        onEditUser={c.handleOpenEdit}
        onOpenNotifications={c.handleOpenNotifications}
      />

      {!c.isLoading && c.totalItems > 0 ? (
        <UserManagementPagination
          page={c.page}
          totalPages={c.totalPages}
          pageSize={c.pageSize}
          totalItems={c.totalItems}
          visibleCount={c.users.length}
          onPageChange={c.setPage}
          onPageSizeChange={c.setPageSize}
        />
      ) : null}
    </>
  );
}
