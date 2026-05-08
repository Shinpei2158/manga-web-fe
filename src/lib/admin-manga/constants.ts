import {
  BookOpen,
  Eye,
  FileCheck,
  ShieldAlert,
  Zap,
} from "lucide-react";
import type { MangaStats, QuickFilterButton } from "./types";

export const DEFAULT_MANGA_STATS: MangaStats = {
  enforcementIssues: 0,
  pendingLicense: 0,
  published: 0,
  total: 0,
};

export function buildQuickFilterButtons(stats: MangaStats): QuickFilterButton[] {
  return [
    { key: "all", label: "All stories", icon: BookOpen, count: stats.total },
    {
      key: "pendingLicense",
      label: "Pending license",
      icon: FileCheck,
      count: stats.pendingLicense,
    },
    {
      key: "published",
      label: "Published",
      icon: Eye,
      count: stats.published,
    },
    { key: "suspended", label: "Suspended", icon: Zap },
    { key: "banned", label: "Banned", icon: ShieldAlert },
  ];
}
