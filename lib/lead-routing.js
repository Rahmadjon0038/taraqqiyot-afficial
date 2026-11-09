// DM platformasidagi "Lidlar qaysi filialga tushsin?" sozlamasi: tanlangan bo'lsa, barcha arizalar shu filialga ketadi.
// Manzil: LEAD_ROUTING_URL yoki ANNOUNCEMENTS_JSON_URL + "/lead-routing". Olib bo'lmasa mijoz tanlagan filial ishlatiladi.
const CACHE_MS = 15_000;
const TIMEOUT_MS = 3_000;
let cached = { branch: null, at: 0 };

function routingUrl() {
  if (process.env.LEAD_ROUTING_URL) return process.env.LEAD_ROUTING_URL;
  const feed = process.env.ANNOUNCEMENTS_JSON_URL;
  return feed ? `${feed.replace(/\/+$/, "")}/lead-routing` : "";
}

export async function getForcedBranch(allowed) {
  if (Date.now() - cached.at < CACHE_MS) return cached.branch;
  const url = routingUrl();
  if (!url) return null;

  try {
    const response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (!response.ok) throw new Error(`status ${response.status}`);
    const { forcedBranch } = await response.json();
    cached = { branch: allowed.includes(forcedBranch) ? forcedBranch : null, at: Date.now() };
  } catch (error) {
    console.error("Lid filiali sozlamasini o'qib bo'lmadi:", error.message);
    // Xatoda oxirgi ma'lum qiymat qoladi, qayta urinish keyingi so'rovda
  }
  return cached.branch;
}
