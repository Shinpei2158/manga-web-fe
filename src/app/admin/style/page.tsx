"use client";

import AdminLayout from "../adminLayout/page";
import { TaxonomyManagementPage } from "@/components/admin/taxonomy-management/taxonomy-management-page";

export default function StyleManagement() {
  return (
    <AdminLayout>
      <TaxonomyManagementPage
        config={{
          apiPath: "/api/styles",
          emptyDescription: "Try adjusting filters or create a new style.",
          itemLabel: "Style",
          listDescription: "Manage all story styles in the system.",
          listTitle: "Styles",
          pageDescription: "Manage story presentation styles",
          pageTitle: "Style Management",
          updateMethod: "put",
        }}
      />
    </AdminLayout>
  );
}
