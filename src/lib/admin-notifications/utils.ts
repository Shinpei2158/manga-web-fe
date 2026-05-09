import type {
  PolicyNotificationRecord,
  SendNotificationTemplate,
} from "./types";

export function buildGeneralNotificationTemplate(): SendNotificationTemplate {
  return {
    body: `Hello,

This is a general notification from the administration team.

[Please write your message here]

Best regards,
Manga Platform Team`,
    title: "[System Notification] Update from Manga Platform",
  };
}

export function getPolicyStatusLabel(status?: string) {
  switch (status) {
    case "AI_BLOCK":
      return "Blocked";
    case "AI_WARN":
      return "Warning";
    case "AI_PASSED":
      return "Passed";
    default:
      return "Pending";
  }
}

export function buildPolicyNotificationTemplate(
  record: PolicyNotificationRecord,
): SendNotificationTemplate {
  const manga = record.mangaTitle || "Untitled Manga";
  const chapter = record.chapterTitle || "Untitled Chapter";
  const author = record.authorName || "Author";
  const risk = Number(record.risk_score ?? 0);
  const status = getPolicyStatusLabel(record.ai_status);
  const labels = record.labels?.length ? record.labels.join(", ") : "N/A";
  let reminderText =
    "Please review this chapter carefully and revise any content that may conflict with our platform posting policies.";

  if (record.ai_status === "AI_BLOCK") {
    reminderText =
      "This chapter has been flagged at a high-risk level. Please revise the content as soon as possible before resubmission.";
  } else if (record.ai_status === "AI_WARN") {
    reminderText =
      "This chapter contains content that may require revision. Please review and adjust it carefully before the next moderation check.";
  }

  return {
    body: `Hello ${author},

Your chapter has been flagged during our moderation review.

Manga: ${manga}
Chapter: ${chapter}
Risk Score: ${risk}/100
AI Status: ${status}
Detected Labels: ${labels}

Reminder:
${reminderText}

After editing the content, you may resubmit the chapter for review.

Best regards,
Content Moderation Team`,
    title: `[Policy Review] ${manga} - ${chapter}`,
  };
}
