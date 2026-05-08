import type {
  BackendNotification,
  NotificationOverview,
  NotificationVM,
} from "@/types/notification";
import { mapToVM } from "@/types/notification";
import { buildUsersMap } from "./utils";

async function safeJson(resp: Response) {
  try {
    return await resp.json();
  } catch {
    return null;
  }
}

export async function logNotificationFetchError(
  tag: string,
  url: string,
  resp: Response,
) {
  const data = await safeJson(resp);

  console.group(`${tag} ERROR FULL`);
  console.log("url:", url);
  console.log("status:", resp.status);
  console.log("statusText:", resp.statusText);
  console.log("data:", data);
  console.log("data (stringify):", JSON.stringify(data, null, 2));
  console.groupEnd();

  return data;
}

export async function fetchAdminNotificationOverview(apiUrl: string) {
  const statsUrl = `${apiUrl}/api/admin/notifications/stats`;
  const sentUrl = `${apiUrl}/api/admin/notifications/sent`;
  const [statsResp, sentResp] = await Promise.all([
    fetch(statsUrl, { credentials: "include" }),
    fetch(sentUrl, { credentials: "include" }),
  ]);

  let overview: NotificationOverview = {
    read: 0,
    saved: 0,
    total: 0,
    unread: 0,
  };

  if (statsResp.ok) {
    const statsData = await statsResp.json();
    overview = {
      ...overview,
      read: Number(statsData?.read ?? 0),
      total: Number(statsData?.total ?? 0),
      unread: Number(statsData?.unread ?? 0),
    };
  } else {
    await logNotificationFetchError(
      "[Admin Noti Overview Stats]",
      statsUrl,
      statsResp,
    );
  }

  if (sentResp.ok) {
    const sentPayload = await sentResp.json();
    const sentData: BackendNotification[] = Array.isArray(sentPayload)
      ? sentPayload
      : Array.isArray(sentPayload?.items)
        ? sentPayload.items
        : [];
    overview.saved = (sentData ?? []).filter((item) => item.is_save).length;

    if (!statsResp.ok) {
      overview.total = sentData.length;
      overview.unread = sentData.filter((item) => !item.is_read).length;
      overview.read = overview.total - overview.unread;
    }
  } else {
    await logNotificationFetchError(
      "[Admin Noti Overview Saved]",
      sentUrl,
      sentResp,
    );
  }

  return overview;
}

export async function fetchAdminUsersMap(apiUrl: string) {
  const resp = await fetch(`${apiUrl}/api/user/all`, {
    credentials: "include",
  });

  if (!resp.ok) return {};
  return buildUsersMap(await resp.json());
}

export async function fetchAdminNotifications({
  apiUrl,
  search,
  status,
  saved,
  sort,
  page,
  limit,
}: {
  apiUrl: string;
  search: string;
  status: string;
  saved: string;
  sort: string;
  page: number;
  limit: number;
}): Promise<{
  items: NotificationVM[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  const url = new URL(`${apiUrl}/api/admin/notifications/sent`);

  if (status !== "All") url.searchParams.set("status", status);
  if (saved !== "All") url.searchParams.set("saved", saved);
  if (sort !== "Newest") url.searchParams.set("sort", sort);
  if (search) url.searchParams.set("q", search);
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(limit));

  const resp = await fetch(url.toString(), { credentials: "include" });

  if (!resp.ok) {
    const data = await logNotificationFetchError(
      "[Admin Fetch Notifications]",
      url.toString(),
      resp,
    );
    throw new Error(data?.message ?? "Failed to load notifications.");
  }

  const data = await resp.json();
  const rows: BackendNotification[] = Array.isArray(data)
    ? data
    : Array.isArray(data?.items)
      ? data.items
      : [];

  const total = Number(data?.total ?? rows.length);
  const currentPage = Number(data?.page ?? page);
  const currentLimit = Number(data?.limit ?? limit);
  const totalPages = Number(
    data?.totalPages ?? Math.max(1, Math.ceil(total / Math.max(currentLimit, 1))),
  );

  return {
    items: rows.map(mapToVM),
    total,
    page: currentPage,
    limit: currentLimit,
    totalPages,
  };
}

export async function sendAdminNotification({
  apiUrl,
  body,
  receiverId,
  title,
}: {
  apiUrl: string;
  body: string;
  receiverId: string;
  title: string;
}) {
  const resp = await fetch(`${apiUrl}/api/admin/notifications/send`, {
    body: JSON.stringify({
      body: body.trim(),
      receiver_id: receiverId,
      title: title.trim(),
    }),
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });

  if (!resp.ok) {
    const data = await resp.json().catch(() => null);
    throw new Error(data?.message ?? "Failed to send notification.");
  }
}
