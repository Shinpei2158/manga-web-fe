"use client";

import AdminLayout from "../adminLayout/page";
import { AdminMangaView } from "@/components/admin/manga/admin-manga-view";
import { useAdminMangaController } from "@/hooks/admin-manga/use-admin-manga-controller";

export default function MangaManagementPage() {
  const controller = useAdminMangaController();

  return (
    <AdminLayout>
      <AdminMangaView controller={controller} />
    </AdminLayout>
  );
}
