"use client";

import { CommentFilters } from "@/components/comment/comment-filters";
import { CommentModal } from "@/components/comment/comment-modal";
import { CommentTable } from "@/components/comment/comment-table";
import type { AdminCommentsController } from "@/hooks/admin/comments/use-admin-comments-controller";
import { AdminCommentsHeader } from "./admin-comments-header";
import { AdminCommentsQuickFilters } from "./admin-comments-quick-filters";
import { AdminCommentsStats } from "./admin-comments-stats";
import { AdminCommentsErrorState, AdminCommentsLoadingState } from "./admin-comments-states";

export function AdminCommentsView({
  controller: c,
}: {
  controller: AdminCommentsController;
}) {
  if (c.loading) return <AdminCommentsLoadingState />;
  if (c.error) return <AdminCommentsErrorState error={c.error} />;

  return (
    <div className="space-y-6">
      <AdminCommentsHeader me={c.me} roleNormalized={c.roleNormalized} />
      <AdminCommentsStats
        hiddenCount={c.hiddenCount}
        totalCount={c.totalItems}
        visibleCount={c.visibleCount}
      />
      <AdminCommentsQuickFilters controller={c} />
      <CommentFilters
        filters={c.filters}
        onChange={c.handleFiltersChange}
        onReset={c.handleResetFilters}
        mangas={c.mangas}
        chapters={c.chapters}
        mangaOptionsLoading={c.mangaOptionsLoading}
        mangaSearch={c.mangaSearch}
        onMangaSearchChange={c.setMangaSearch}
      />
      <CommentTable
        comments={c.paginatedComments}
        onViewDetails={c.handleViewDetails}
        onToggleVisibility={c.handleToggleVisibility}
        currentPage={c.currentPage}
        totalPages={c.totalPages}
        totalItems={c.totalItems}
        onPageChange={c.setCurrentPage}
        actionLoading={c.actionLoading}
        sortColumn={c.sortColumn}
        sortDirection={c.sortDirection}
        onSort={c.handleSort}
        selectedCommentId={c.selectedComment?.id || null}
      />
      <CommentModal
        open={c.panelOpen}
        comment={c.selectedComment}
        onClose={c.closePanel}
        onToggleVisibility={c.handleToggleVisibility}
        actionLoadingId={c.actionLoading}
        onPrevious={
          c.selectedCommentIndex > 0
            ? () => c.setSelectedComment(c.sortedComments[c.selectedCommentIndex - 1])
            : undefined
        }
        onNext={
          c.selectedCommentIndex >= 0 &&
          c.selectedCommentIndex < c.sortedComments.length - 1
            ? () => c.setSelectedComment(c.sortedComments[c.selectedCommentIndex + 1])
            : undefined
        }
        hasPrevious={c.selectedCommentIndex > 0}
        hasNext={
          c.selectedCommentIndex >= 0 &&
          c.selectedCommentIndex < c.sortedComments.length - 1
        }
      />
    </div>
  );
}

