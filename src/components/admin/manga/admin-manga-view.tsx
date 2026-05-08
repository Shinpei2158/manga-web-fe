"use client";

import type { AdminMangaController } from "@/hooks/admin/manga/use-admin-manga-controller";
import { MangaActionDialog } from "./manga-action-dialog";
import { MangaDetailSheet } from "./manga-detail-sheet";
import { MangaFilterCard } from "./manga-filter-card";
import { MangaQueueTable } from "./manga-queue-table";
import { MangaStatsCards } from "./manga-stats-cards";

export function AdminMangaView({
  controller,
}: {
  controller: AdminMangaController;
}) {
  return (
    <div className="space-y-6">
      <MangaStatsCards stats={controller.stats} />
      <MangaFilterCard controller={controller} />
      <MangaQueueTable controller={controller} />
      <MangaDetailSheet controller={controller} />
      <MangaActionDialog controller={controller} />
    </div>
  );
}
