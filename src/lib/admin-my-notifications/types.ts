export type StaffNotificationItem = {
  _id: string;
  sender_id: string;
  receiver_id: string;
  title: string;
  body: string;
  is_read: boolean;
  is_save: boolean;
  createdAt: string;
  updatedAt: string;
};

export type StaffNotificationMe = {
  user_id?: string;
  username?: string;
  role?: string;
};

export type StaffInboxFilter = "all" | "unread" | "saved";

export type StaffNotificationOverview = {
  total: number;
  unread: number;
  saved: number;
  read: number;
};
