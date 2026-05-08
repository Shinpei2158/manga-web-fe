"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import type { AdminMangaController } from "@/hooks/admin/manga/use-admin-manga-controller";
import { MangaDetailHeader } from "./manga-detail-header";
import { MangaDetailEmptyState, MangaDetailLoading } from "./manga-detail-states";
import { MangaEnforcementPanel } from "./manga-enforcement-panel";
import { MangaOverviewPanel } from "./manga-overview-panel";

export function MangaDetailSheet({
  controller: c,
}: {
  controller: AdminMangaController;
}) {
  return (
    <Sheet open={c.detailsOpen} onOpenChange={(open) => (open ? null : c.closeDetail())}>
      <SheetContent className="w-screen max-w-none overflow-y-auto border-l border-slate-200 bg-slate-50 p-0 sm:max-w-[88vw] sm:rounded-l-[30px] lg:max-w-[78vw] xl:max-w-[68vw] 2xl:max-w-[60vw]">
        <SheetHeader className="sr-only">
          <SheetTitle>{c.selectedManga?.title || "Manga detail workspace"}</SheetTitle>
          <SheetDescription>
            Review manga overview, rights status, publication, and enforcement.
          </SheetDescription>
        </SheetHeader>

        {c.loadingDetail ? (
          <MangaDetailLoading />
        ) : c.selectedManga ? (
          <div className="min-h-full bg-slate-50">
            <div className="min-h-full p-4 xl:p-5">
              <Tabs
                value={c.detailTab}
                onValueChange={(value) =>
                  c.setDetailTab(value as "overview" | "enforcement")
                }
                className="min-h-full space-y-4"
              >
                <MangaDetailHeader controller={c} manga={c.selectedManga} />
                <div className="space-y-4">
                  <TabsContent value="overview" className="mt-0">
                    <MangaOverviewPanel controller={c} manga={c.selectedManga} />
                  </TabsContent>
                  <TabsContent value="enforcement" className="mt-0">
                    <MangaEnforcementPanel controller={c} manga={c.selectedManga} />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
        ) : (
          <MangaDetailEmptyState />
        )}
      </SheetContent>
    </Sheet>
  );
}
