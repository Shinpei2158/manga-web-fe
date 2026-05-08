"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  decideModeration,
  fetchModerationRecord,
  recheckModeration,
} from "@/lib/moderation";
import { deriveFindings } from "@/lib/moderation-findings";
import type { Decision, ModerationRecord } from "@/lib/typesLogs";

export type WorkspaceNotice = {
  tone: "info" | "error" | "success";
  message: string;
} | null;

export function useModerationWorkspaceController() {
  const searchParams = useSearchParams();
  const chapterId = searchParams.get("chapterId") ?? "";

  const [record, setRecord] = useState<ModerationRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [actLoading, setActLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [notice, setNotice] = useState<WorkspaceNotice>(null);
  const [activeFindingId, setActiveFindingId] = useState<string | null>(null);

  const findings = useMemo(
    () => deriveFindings(record?.ai_findings || []),
    [record?.ai_findings],
  );

  const activeFinding =
    findings.find((item) => item.highlightId === activeFindingId) || null;

  const load = useCallback(async () => {
    if (!chapterId) {
      setRecord(null);
      return;
    }

    setLoading(true);
    setErr(null);

    try {
      setRecord(await fetchModerationRecord(chapterId));
    } catch (e: any) {
      setErr(e?.message || "Load record failed");
    } finally {
      setLoading(false);
    }
  }, [chapterId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!findings.length) {
      setActiveFindingId(null);
      return;
    }

    setActiveFindingId((previous) => {
      if (
        previous &&
        findings.some((item) => item.highlightId === previous)
      ) {
        return previous;
      }

      const preferred =
        findings.find((item) => item.verdict !== "pass") || findings[0];
      return preferred.highlightId;
    });
  }, [findings]);

  const onDecision = useCallback(
    async (action: Decision, note?: string) => {
      if (!record) return;

      setActLoading(true);
      setNotice(null);

      try {
        await decideModeration(record.chapterId, action, note);
        setNotice({
          message:
            action === "approve"
              ? "Chapter marked safe successfully."
              : "Chapter rejected successfully.",
          tone: "success",
        });
        await load();
      } catch (e: any) {
        setNotice({
          message: e?.message || "Action failed",
          tone: "error",
        });
      } finally {
        setActLoading(false);
      }
    },
    [load, record],
  );

  const onRecheck = useCallback(async () => {
    if (!record) return;

    setActLoading(true);
    setNotice(null);

    try {
      await recheckModeration(record.chapterId);
      await load();
      setNotice({
        message:
          "AI recheck started. The record may show Pending first while the latest analysis is being generated.",
        tone: "info",
      });
    } catch (e: any) {
      setNotice({
        message: e?.message || "Recheck failed",
        tone: "error",
      });
    } finally {
      setActLoading(false);
    }
  }, [load, record]);

  return {
    activeFinding,
    activeFindingId,
    actLoading,
    chapterId,
    err,
    findings,
    loading,
    notice,
    onDecision,
    onRecheck,
    record,
    setActiveFindingId,
  };
}

export type ModerationWorkspaceController = ReturnType<
  typeof useModerationWorkspaceController
>;
