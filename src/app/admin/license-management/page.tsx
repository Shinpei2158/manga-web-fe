"use client";

import AdminLayout from "../adminLayout/page";
import { LicenseManagementView } from "@/components/admin/license-management/license-management-view";
import { useLicenseManagementController } from "@/hooks/admin-license-management/use-license-management-controller";

export default function AdminStoryRightsModerationPage() {
  const controller = useLicenseManagementController();

  return (
    <AdminLayout>
      <LicenseManagementView controller={controller} />
    </AdminLayout>
  );
}
