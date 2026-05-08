"use client";

import { NotificationFilters } from "@/components/notifications/notification-filters";
import { NotificationModal } from "@/components/notifications/notification-modal";
import { NotificationTable } from "@/components/notifications/notification-table";
import type { AdminNotificationsController } from "@/hooks/admin/notifications/use-admin-notifications-controller";
import { ADMIN_NOTIFICATIONS_PAGE_SIZE } from "@/lib/admin-notifications/constants";
import { AdminNotificationsHeader } from "./admin-notifications-header";
import { AdminNotificationsLoading } from "./admin-notifications-loading";
import { AdminNotificationsStats } from "./admin-notifications-stats";
import { DeleteNotificationDialog } from "./delete-notification-dialog";

export function AdminNotificationsView({
  controller: c,
}: {
  controller: AdminNotificationsController;
}) {
  return (
    <div className="space-y-6">
      <AdminNotificationsHeader />
      <AdminNotificationsStats overview={c.overview} />

      <NotificationFilters
        resultCount={c.totalItems}
        searchValue={c.searchInput}
        statusValue={c.filters.status}
        savedValue={c.filters.saved}
        sortValue={c.filters.sort}
        onSearchChange={c.setSearchInput}
        onStatusChange={(status) =>
          c.setFilters((prev) => ({ ...prev, status }))
        }
        onSavedChange={(saved) => c.setFilters((prev) => ({ ...prev, saved }))}
        onSortChange={(sort) => c.setFilters((prev) => ({ ...prev, sort }))}
        onReset={c.handleResetFilters}
      />

      {c.loading ? (
        <AdminNotificationsLoading />
      ) : (
        <NotificationTable
          notifications={c.paginatedNotifications}
          currentPage={c.currentPage}
          pageSize={ADMIN_NOTIFICATIONS_PAGE_SIZE}
          totalItems={c.totalItems}
          totalPages={c.totalPages}
          onPageChange={c.setCurrentPage}
          onViewDetail={c.handleViewDetail}
          onMarkAsRead={c.handleMarkAsRead}
          onDeleteRequest={c.setDeleteTarget}
          onToggleSave={c.handleToggleSave}
          onResend={c.handleResend}
          usersMap={c.usersMap}
          busyId={c.busyId}
        />
      )}

      <NotificationModal
        notification={c.selectedNotification}
        isOpen={c.isModalOpen}
        onClose={() => c.setIsModalOpen(false)}
        onMarkAsRead={c.handleMarkAsRead}
        onResend={c.handleResend}
        onToggleSave={c.handleToggleSave}
        onDeleteRequest={c.setDeleteTarget}
        usersMap={c.usersMap}
        busyId={c.busyId}
      />

      <DeleteNotificationDialog
        busyId={c.busyId}
        deleteTarget={c.deleteTarget}
        onConfirm={c.confirmDelete}
        onOpenChange={(open) => {
          if (!open) c.setDeleteTarget(null);
        }}
      />
    </div>
  );
}
