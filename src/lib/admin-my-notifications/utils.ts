import type {
  StaffInboxFilter,
  StaffNotificationItem,
} from "./types";

export function formatStaffNotificationDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsed);
}

export function sortStaffNotifications(items: StaffNotificationItem[]) {
  return [...items].sort(
    (first, second) =>
      new Date(second.createdAt).getTime() -
      new Date(first.createdAt).getTime(),
  );
}

export function buildStaffNotificationOverview(
  notifications: StaffNotificationItem[],
) {
  const total = notifications.length;
  const unread = notifications.filter((item) => !item.is_read).length;
  const saved = notifications.filter((item) => item.is_save).length;
  const read = total - unread;

  return { total, unread, saved, read };
}

export function filterStaffNotifications({
  activeFilter,
  notifications,
  search,
}: {
  activeFilter: StaffInboxFilter;
  notifications: StaffNotificationItem[];
  search: string;
}) {
  const normalizedSearch = search.trim().toLowerCase();

  return notifications.filter((item) => {
    const matchesSearch =
      !normalizedSearch ||
      item.title.toLowerCase().includes(normalizedSearch) ||
      item.body.toLowerCase().includes(normalizedSearch);

    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "unread" && !item.is_read) ||
      (activeFilter === "saved" && item.is_save);

    return matchesSearch && matchesFilter;
  });
}
