import { promises as fs } from "node:fs";
import path from "node:path";

const fallbackPath = path.join(process.cwd(), "public", "announcements.json");

function normalizeAnnouncement(item, index) {
  const source = item ?? {};
  const type = ["news", "course", "vacancy"].includes(source.type) ? source.type : "news";
  const title = String(source.title || "Taraqqiyot e'lon").trim();
  const preview = String(source.preview || source.description || "").trim();
  const image = String(source.image || source.src || "/ads/banner-01.png").trim();
  const active = source.active !== false;
  const branch = String(source.branch || "").trim();
  const course = String(source.course || "").trim();
  const applicationType = String(source.applicationType || "").trim();
  const targetUrl = String(source.targetUrl || "").trim();
  const isExternal = /^https?:\/\//i.test(targetUrl);

  return {
    id: String(source.id || `announcement-${index + 1}`),
    type,
    title: title || "Taraqqiyot e'lon",
    preview,
    description: String(source.description || preview || "").trim(),
    image,
    active,
    branch,
    course,
    applicationType,
    targetUrl,
    isExternal,
    sort: Number.isFinite(source.sort) ? Number(source.sort) : index + 1,
    publishedAt: source.publishedAt || new Date().toISOString(),
  };
}

export async function getAnnouncements() {
  let payload = null;

  if (process.env.ANNOUNCEMENTS_JSON_URL) {
    try {
      const response = await fetch(process.env.ANNOUNCEMENTS_JSON_URL, { cache: "no-store" });
      if (response.ok) {
        payload = await response.json();
      }
    } catch {
      payload = null;
    }
  }

  if (!payload) {
    try {
      const raw = await fs.readFile(fallbackPath, "utf8");
      payload = JSON.parse(raw);
    } catch {
      payload = { items: [] };
    }
  }

  const items = Array.isArray(payload?.items)
    ? payload.items
    : Array.isArray(payload)
      ? payload
      : [];

  return items
    .map((item, index) => normalizeAnnouncement(item, index))
    .filter((item) => item.active)
    .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));
}

export function buildAnnouncementLink(item, lang = "uz") {
  const branch = item?.branch ? `&branch=${encodeURIComponent(item.branch)}` : "";

  if (item?.type === "course" && item?.course) {
    return `/${lang}/ariza?course=${encodeURIComponent(item.course)}${branch}`;
  }

  if (item?.type === "vacancy" && item?.applicationType) {
    return `/${lang}/ariza?application=${encodeURIComponent(item.applicationType)}&vacancy_title=${encodeURIComponent(item.title)}${branch}`;
  }

  if (item?.targetUrl) {
    return item.targetUrl;
  }

  return `/${lang}/ariza`;
}
