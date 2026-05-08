"use client";

import AdminLayout from "../adminLayout/page";
import { AdminCommentsView } from "@/components/admin/comments/admin-comments-view";
import { useAdminCommentsController } from "@/hooks/admin/comments/use-admin-comments-controller";

export default function CommentsPage() {
  const controller = useAdminCommentsController();

  return (
    <AdminLayout>
      <AdminCommentsView controller={controller} />
    </AdminLayout>
  );
}
