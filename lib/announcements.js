// DM platforma (backend) bir daqiqada ko'pi bilan 1 marta so'raladi: u har IP'dan 15 daqiqada
// 300 ta so'rovga ruxsat beradi, saytning har bir tashrifi uni so'rasa, karusel tez o'chib qolardi.
const REVALIDATE_SECONDS = 60;
const FEED_TIMEOUT_MS = 8000;

// Oxirgi muvaffaqiyatli nusxa: DM platforma vaqtincha ishlamasa ham karusel yo'qolmaydi.
let lastGood = [];

// Faqat http(s) manzillar yoki saytning o'z yo'llari ("/ru/ariza"). "javascript:", "data:" kabilar tashlanadi.
function safeUrl(value) {
  const url = String(value ?? "").trim();
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("/") && !url.startsWith("//")) return url;
  return "";
}

function normalizeAnnouncement(item, index) {
  const source = item ?? {};
  const type = ["news", "course", "vacancy"].includes(source.type) ? source.type : "news";
  const title = String(source.title || "Taraqqiyot e'lon").trim();
  const preview = String(source.preview || source.description || "").trim();
  const image = safeUrl(source.image || source.src);
  const mobileImage = safeUrl(source.mobileImage);
  const active = source.active !== false;
  const branch = String(source.branch || "").trim();
  const course = String(source.course || "").trim();
  const applicationType = String(source.applicationType || "").trim();
  const targetUrl = safeUrl(source.targetUrl);
  const isExternal = /^https?:\/\//i.test(targetUrl);

  return {
    id: String(source.id || `announcement-${index + 1}`),
    type,
    title: title || "Taraqqiyot e'lon",
    preview,
    description: String(source.description || preview || "").trim(),
    image,
    mobileImage,
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

  try {
    const response = await fetch(feedUrl, {
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(FEED_TIMEOUT_MS),
    });
    if (!response.ok) {
      throw new Error(`Announcements feed request failed with status ${response.status}`);
    }
    const payload = await response.json();

    const items = Array.isArray(payload?.items)
      ? payload.items
      : Array.isArray(payload)
        ? payload
        : [];

    lastGood = items
      .map((item, index) => normalizeAnnouncement(item, index))
      .filter((item) => item.active && item.image)
      .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));

    return lastGood;
  } catch (error) {
    console.error("Announcements feed xatosi:", error.message);

    // Hech qachon muvaffaqiyatli olinmagan bo'lsa, xatoni yuqoriga beramiz; aks holda oxirgi nusxani ko'rsatamiz.
    if (!lastGood.length) throw error;
    return lastGood;
  }
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
