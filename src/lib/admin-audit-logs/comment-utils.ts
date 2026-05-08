export function firstNonEmpty(...values: Array<unknown>) {
  for (const value of values) {
    const text = String(value ?? "").trim();
    if (text) return text;
  }
  return "";
}

export function decodeHtmlEntities(value: string) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
}

export function extractCommentPlainText(content: string) {
  return decodeHtmlEntities(String(content || ""))
    .replace(/<div><br\s*\/?><\/div>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(div|p|li|blockquote|section|article|ul|ol)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function escapePlainText(content: string) {
  return content
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br />");
}

function normalizeCommentHtml(content: string, apiUrl?: string) {
  const decodedContent = decodeHtmlEntities(content);
  const normalizedApi = (apiUrl || "").replace(/\/+$/, "");
  const hasHtml = /<\/?[a-z][\s\S]*>/i.test(decodedContent);

  let html = hasHtml ? decodedContent : escapePlainText(decodedContent);
  html = html.replace(/<div><br\s*\/?><\/div>/gi, "<br />");

  if (normalizedApi) {
    html = html.replace(/https?:\/\/localhost:\d+/gi, normalizedApi);
    html = html.replace(
      /src=(['"])\/(assets\/emoji\/[^'"]+)\1/gi,
      `src=$1${normalizedApi}/$2$1`,
    );
    html = html.replace(
      /src=(['"])(assets\/emoji\/[^'"]+)\1/gi,
      `src=$1${normalizedApi}/$2$1`,
    );
  }

  return html;
}

function normalizeContentAssetUrl(value: string, apiUrl?: string) {
  const raw = String(value || "").trim();
  const normalizedApi = (apiUrl || "").replace(/\/+$/, "");

  if (!raw) return "";

  const localhostNormalized = normalizedApi
    ? raw.replace(/https?:\/\/localhost:\d+/gi, normalizedApi)
    : raw;

  if (/^data:image\//i.test(localhostNormalized)) return localhostNormalized;
  if (/^https?:\/\//i.test(localhostNormalized)) return localhostNormalized;

  if (localhostNormalized.startsWith("/") && normalizedApi) {
    return `${normalizedApi}${localhostNormalized}`;
  }

  if (normalizedApi && /^assets\//i.test(localhostNormalized)) {
    return `${normalizedApi}/${localhostNormalized.replace(/^\/+/, "")}`;
  }

  return localhostNormalized;
}

export function sanitizeAuditCommentHtml(content: string, apiUrl?: string) {
  if (typeof window === "undefined") return "";

  const allowedTags = new Set([
    "a",
    "b",
    "blockquote",
    "br",
    "div",
    "em",
    "i",
    "img",
    "li",
    "ol",
    "p",
    "span",
    "strong",
    "u",
    "ul",
  ]);
  const blockedTags = new Set([
    "iframe",
    "object",
    "embed",
    "script",
    "style",
    "link",
    "meta",
  ]);
  const parser = new window.DOMParser();
  const doc = parser.parseFromString(
    `<div>${normalizeCommentHtml(content, apiUrl)}</div>`,
    "text/html",
  );
  const root = doc.body.firstElementChild;

  if (!root) return "";

  const sanitizeNode = (node: Node, ownerDocument: Document): Node | null => {
    if (node.nodeType === window.Node.TEXT_NODE) {
      return ownerDocument.createTextNode(node.textContent || "");
    }

    if (node.nodeType !== window.Node.ELEMENT_NODE) return null;

    const element = node as HTMLElement;
    const tag = element.tagName.toLowerCase();

    if (blockedTags.has(tag)) return null;

    if (!allowedTags.has(tag)) {
      const fragment = ownerDocument.createDocumentFragment();
      Array.from(element.childNodes).forEach((child) => {
        const safeChild = sanitizeNode(child, ownerDocument);
        if (safeChild) fragment.appendChild(safeChild);
      });
      return fragment;
    }

    const cleanElement = ownerDocument.createElement(tag);

    if (tag === "img") {
      const normalizedSrc = normalizeContentAssetUrl(
        element.getAttribute("src") || "",
        apiUrl,
      );
      if (!normalizedSrc) return null;
      cleanElement.setAttribute("src", normalizedSrc);
      cleanElement.setAttribute(
        "alt",
        element.getAttribute("alt") || "comment-media",
      );
      cleanElement.setAttribute("loading", "lazy");
      cleanElement.setAttribute("referrerpolicy", "no-referrer");
    }

    if (tag === "a") {
      const normalizedHref = normalizeContentAssetUrl(
        element.getAttribute("href") || "",
        apiUrl,
      );
      if (normalizedHref) {
        cleanElement.setAttribute("href", normalizedHref);
        cleanElement.setAttribute("target", "_blank");
        cleanElement.setAttribute("rel", "noreferrer noopener");
      }
    }

    Array.from(element.childNodes).forEach((child) => {
      const safeChild = sanitizeNode(child, ownerDocument);
      if (safeChild) cleanElement.appendChild(safeChild);
    });

    return cleanElement;
  };

  const safeRoot = document.createElement("div");
  Array.from(root.childNodes).forEach((child) => {
    const safeChild = sanitizeNode(child, document);
    if (safeChild) safeRoot.appendChild(safeChild);
  });

  return safeRoot.innerHTML;
}

export function getAuditCommentHtml(log: any) {
  return firstNonEmpty(log?.after?.content_html, log?.before?.content_html);
}

export function getAuditCommentPreviewSource(log: any) {
  return firstNonEmpty(
    log?.after?.content_html,
    log?.before?.content_html,
    log?.after?.content_preview,
    log?.before?.content_preview,
  );
}

