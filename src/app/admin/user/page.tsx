"use client";

import AdminLayout from "../adminLayout/page";
import { UserManagementView } from "@/components/admin/users/user-management-view";
import { useUserManagementController } from "@/hooks/admin/users/use-user-management-controller";

export default function UserManagementPage() {
  const controller = useUserManagementController();

  return (
    <AdminLayout>
      <UserManagementView controller={controller} />
    </AdminLayout>
  );
}
