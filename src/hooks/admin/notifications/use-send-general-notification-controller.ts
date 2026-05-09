"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { sendAdminNotification } from "@/lib/admin-notifications/api";
import { buildGeneralNotificationTemplate } from "@/lib/admin-notifications/utils";

const API = process.env.NEXT_PUBLIC_API_URL!;

export function useSendGeneralNotificationController() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const template = useMemo(() => buildGeneralNotificationTemplate(), []);
  const [receiverId, setReceiverId] = useState("");
  const [receiverEmail, setReceiverEmail] = useState("");
  const [title, setTitle] = useState(template.title);
  const [body, setBody] = useState(template.body);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const qpReceiverId = searchParams.get("receiverId")?.trim() ?? "";
    const qpReceiverEmail = searchParams.get("receiverEmail")?.trim() ?? "";
    const qpTitle = searchParams.get("title")?.trim() ?? "";
    const qpBody = searchParams.get("body") ?? "";

    setReceiverId(qpReceiverId);
    setReceiverEmail(qpReceiverEmail);
    setTitle(qpTitle || template.title);
    setBody(qpBody || template.body);
  }, [searchParams, template.title, template.body]);

  const copyText = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copied.`);
    } catch {
      toast.error(`Copy ${label.toLowerCase()} failed.`);
    }
  };

  const resetTemplate = () => {
    setTitle(template.title);
    setBody(template.body);
  };

  const handleSend = async () => {
    const normalizedEmail = receiverEmail.trim().toLowerCase();

    if (!receiverId && !normalizedEmail) {
      toast.error("Receiver is required.");
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
        receiverEmail: normalizedEmail || undefined,
        receiverId: receiverId || undefined,
        title,
      });

      toast.success("Notification sent successfully.");
      router.push("/admin/notifications");
    } catch (error) {
      console.error("[Send General Noti] send failed:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to send notification.",
      );
    } finally {
      setSending(false);
    }
  };

  return {
    body,
    copyText,
    handleSend,
    receiverEmail,
    resetTemplate,
    sending,
    setBody,
    setReceiverEmail,
    setTitle,
    title,
  };
}

export type SendGeneralNotificationController = ReturnType<
  typeof useSendGeneralNotificationController
>;
