function normalizeAnnouncement(item, index) {
  const source = item ?? {};
  const type = ["news", "course", "vacancy"].includes(source.type) ? source.type : "news";
  const title = String(source.title || "Taraqqiyot e'lon").trim();
  const preview = String(source.preview || source.description || "").trim();
  const image = String(source.image || source.src || "").trim();
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
  const feedUrl = process.env.ANNOUNCEMENTS_JSON_URL;
  if (!feedUrl) return [];

  const response = await fetch(feedUrl, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Announcements feed request failed with status ${response.status}`);
  }
  const payload = await response.json();

  const items = Array.isArray(payload?.items)
    ? payload.items
    : Array.isArray(payload)
      ? payload
      : [];

  return items
    .map((item, index) => normalizeAnnouncement(item, index))
    .filter((item) => item.active && item.image)
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
