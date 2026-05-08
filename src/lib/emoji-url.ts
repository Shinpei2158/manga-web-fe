export function resolveEmojiSrc(src?: string | null, apiBase?: string): string {
  if (!src) return "";

  const normalized = src.trim();
  if (!normalized) return "";

  if (/^https?:\/\//i.test(normalized)) {
    return normalized;
  }

  const base = (apiBase || process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
  if (!base) {
    return normalized.startsWith("/") ? normalized : `/${normalized}`;
  }

  const path = normalized.startsWith("/") ? normalized : `/${normalized}`;
  return `${base}${path}`;
}
