import type {
  SavedFilter,
  SortFilter,
  StatusFilter,
} from "@/types/notification";
import type { ReactNode } from "react";
import type { ModerationRecord } from "@/lib/typesLogs";

export type AdminNotificationFilters = {
  status: StatusFilter;
  saved: SavedFilter;
  search: string;
  sort: SortFilter;
};

export type SendNotificationTemplate = {
  title: string;
  body: string;
};

export type NotificationContextItem = {
  label: string;
  value: ReactNode;
};

export type SendNotificationVariant = "general" | "policy";

export type PolicyNotificationRecord = ModerationRecord;
