"use client";

import AdminLayout from "../adminLayout/page";
import { TaxonomyManagementPage } from "@/components/admin/taxonomy-management/taxonomy-management-page";

export default function GenreManagement() {
  return (
    <AdminLayout>
      <TaxonomyManagementPage
        config={{
          apiPath: "/api/genre",
          createStatus: "active",
          emptyDescription: "Try adjusting filters or create a new genre.",
          itemLabel: "Genre",
          listDescription: "Manage all story genres in the system.",
          listTitle: "Genres",
          pageDescription: "Managing story genres",
          pageTitle: "Genre Management",
          showStoriesCount: true,
        }}
      />
    </AdminLayout>
  );
}
