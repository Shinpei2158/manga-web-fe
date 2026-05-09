"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { fetchModerationRecord } from "@/lib/moderation";
import { sendAdminNotification } from "@/lib/admin-notifications/api";
import { buildPolicyNotificationTemplate } from "@/lib/admin-notifications/utils";
import type { PolicyNotificationRecord } from "@/lib/admin-notifications/types";

const API = process.env.NEXT_PUBLIC_API_URL!;

export function useSendPolicyNotificationController() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chapterId = searchParams.get("chapterId") ?? "";
  const [record, setRecord] = useState<PolicyNotificationRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [receiverEmail, setReceiverEmail] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const generated = useMemo(
    () => (record ? buildPolicyNotificationTemplate(record) : { body: "", title: "" }),
    [record],
  );

  useEffect(() => {
    if (!chapterId) return;

    (async () => {
      setLoading(true);
      try {
        setRecord(await fetchModerationRecord(chapterId));
      } catch (error) {
        console.error("[Send Policy Noti] load moderation record failed:", error);
        toast.error("Failed to load moderation data.");
      } finally {
        setLoading(false);
      }
    })();
  }, [chapterId]);

  useEffect(() => {
    if (!record) return;
    setReceiverEmail(record.authorEmail || "");
    setTitle(generated.title);
    setBody(generated.body);
  }, [record, generated.title, generated.body]);

  const copyText = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copied.`);
    } catch {
      toast.error(`Copy ${label.toLowerCase()} failed.`);
    }
  };

  const resetTemplate = () => {
    setTitle(generated.title);
    setBody(generated.body);
  };

  const handleSend = async () => {
    const normalizedEmail = receiverEmail.trim().toLowerCase();
    if (!normalizedEmail) {
      toast.error("Receiver email is required.");
      return;
    }

    if (!title.trim()) {
      toast.error("Notification title is required.");
      return;
    }

    if (!body.trim()) {
      toast.error("Notification body is required.");
      return;
    }

    try {
      setSending(true);
      await sendAdminNotification({
        apiUrl: API,
        body,
        receiverEmail: normalizedEmail,
        title,
      });
      toast.success("Policy notification sent successfully.");
      router.push("/admin/notifications");
    } catch (error) {
      console.error("[Send Policy Noti] send failed:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to send notification.",
      );
    } finally {
      setSending(false);
    }
  };

  return {
    body,
    chapterId,
    copyText,
    handleSend,
    loading,
    receiverEmail,
    record,
    resetTemplate,
    sending,
    setBody,
    setReceiverEmail,
    setTitle,
    title,
  };
}

export type SendPolicyNotificationController = ReturnType<
  typeof useSendPolicyNotificationController
>;
