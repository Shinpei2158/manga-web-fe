"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  getActionSuccessCopy,
  updateMangaEnforcement,
  updateMangaPublication,
} from "@/lib/admin-manga/api";
import type { ActionDialogType, MangaDetail } from "@/lib/admin-manga/types";
import { getMangaErrorMessage } from "@/lib/admin-manga/utils";

export function useAdminMangaActions({
  apiUrl,
  refreshAfterMutation,
  selectedManga,
}: {
  apiUrl: string;
  refreshAfterMutation: (mangaId: string) => Promise<void>;
  selectedManga: MangaDetail | null;
}) {
  const { toast } = useToast();
  const [actionLoading, setActionLoading] = useState(false);
  const [actionDialog, setActionDialog] = useState<ActionDialogType>(null);
  const [enforcementReason, setEnforcementReason] = useState("");

  const closeActionDialog = () => {
    if (actionLoading) return;
    setActionDialog(null);
    setEnforcementReason("");
  };

  const handleConfirmAction = async () => {
    if (!selectedManga) return;

    try {
      setActionLoading(true);
      await runSelectedAction(selectedManga);
      await refreshAfterMutation(selectedManga.id);
      closeActionDialog();
    } catch (error) {
      toast({
        description: getMangaErrorMessage(
          error,
          "The action could not be completed.",
        ),
        title: "Action failed",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const runSelectedAction = async (manga: MangaDetail) => {
    if (actionDialog === "publish" || actionDialog === "unpublish") {
      await updateMangaPublication({
        apiUrl,
        isPublish: actionDialog === "publish",
        mangaId: manga.id,
      });
      toast(getActionSuccessCopy(actionDialog));
      return;
    }

    if (actionDialog === "suspend" || actionDialog === "ban") {
      if (!enforcementReason.trim()) {
        toast({
          description: `Please enter a ${actionDialog} reason.`,
          title: "Missing reason",
          variant: "destructive",
        });
        throw new Error("Missing enforcement reason.");
      }

      await updateMangaEnforcement({
        apiUrl,
        mangaId: manga.id,
        reason: enforcementReason.trim(),
        status: actionDialog === "ban" ? "banned" : "suspended",
      });
      toast(getActionSuccessCopy(actionDialog));
      return;
    }

    if (actionDialog === "clear-enforcement") {
      await updateMangaEnforcement({
        apiUrl,
        mangaId: manga.id,
        status: "normal",
      });
      toast(getActionSuccessCopy(actionDialog));
    }
  };

  return {
    actionDialog,
    actionLoading,
    closeActionDialog,
    enforcementReason,
    handleConfirmAction,
    setActionDialog,
    setEnforcementReason,
  };
}
