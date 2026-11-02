import crypto from "node:crypto";
import { branchNames, courseNames } from "@/lib/data";
import { readLeads } from "@/lib/leads-log";

// Tashqi CRM uchun faqat O'QISH API'si: saytdagi forma orqali tushgan arizalar.
// Kalit .env dagi CRM_API_KEY, "X-API-Key" sarlavhasida yuboriladi. Kalit bo'lmasa, API o'chiq turadi.
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };
const DEFAULT_LIMIT = 100;
const MAX_LIMIT = 500;

function isAuthorized(request) {
  const expected = process.env.CRM_API_KEY;
  const given = Buffer.from(request.headers.get("x-api-key") ?? "");
  const wanted = Buffer.from(expected ?? "");
  return given.length === wanted.length && crypto.timingSafeEqual(given, wanted);
}

function typeOf(lead) {
  if (lead.applicationType === "vacancy" || lead.applicationType === "teacher-vacancy") return "vacancy";
  if (lead.course) return "course";
  return "general";
}

function toCrmLead(lead) {
  const updatedAt = lead.statusAt && lead.statusAt > lead.at ? lead.statusAt : lead.at;

  return {
    id: lead.id,
    createdAt: lead.at,
    // Holat o'zgargan yoki yangi ariza kelgan oxirgi vaqt: keyingi so'rovda "since" sifatida ishlatiladi.
    updatedAt,
    name: lead.name,
    phone: `+${lead.phone}`,
    // course: yangi kurs arizasi; vacancy: ish arizasi; general: umumiy ariza
    type: typeOf(lead),
    course: lead.course ?? null,
    courseName: lead.course ? (courseNames[lead.course] ?? lead.course) : null,
    vacancyTitle: lead.vacancyTitle || null,
    branch: lead.otherCity ? null : (lead.branch ?? null),
    branchName: lead.otherCity ? null : lead.branch ? (branchNames[lead.branch] ?? lead.branch) : null,
    // true bo'lsa, mijoz Namangandan tashqarida va markazga borib o'qiy oladi
    otherCity: Boolean(lead.otherCity),
    // Mijoz saytning qaysi tilida ariza qoldirdi: uz | ru | en
    language: lead.lang ?? "uz",
    // Reklama manbasi (utm_source, utm_medium, utm_campaign, utm_content, utm_term, fbclid ...)
    source: lead.source ?? {},
    // Operator Telegramda belgilagan holat: keladi | javob | kelmaydi | keldi, belgilanmagan bo'lsa null
    status: lead.status ?? null,
    statusAt: lead.statusAt ?? null,
    statusBy: lead.statusBy ?? null,
  };
}

// GET /api/crm/leads?since=2026-11-01T00:00:00Z&limit=100
export async function GET(request) {
  if (!process.env.CRM_API_KEY) {
    return Response.json({ error: "not_configured" }, { status: 503, headers: NO_STORE });
  }
  if (!isAuthorized(request)) {
    return Response.json({ error: "unauthorized" }, { status: 401, headers: NO_STORE });
  }

  const { searchParams } = new URL(request.url);
  const sinceParam = searchParams.get("since");
  const since = sinceParam ? Date.parse(sinceParam) : 0;
  if (sinceParam && Number.isNaN(since)) {
    return Response.json({ error: "invalid_since" }, { status: 400, headers: NO_STORE });
  }
  const limit = Math.min(Math.max(Number.parseInt(searchParams.get("limit") ?? "", 10) || DEFAULT_LIMIT, 1), MAX_LIMIT);

  const leads = (await readLeads())
    .map(toCrmLead)
    .filter((lead) => Date.parse(lead.updatedAt) > since)
    .sort((a, b) => Date.parse(a.updatedAt) - Date.parse(b.updatedAt))
    .slice(0, limit);

  return Response.json(
    { leads, next: leads.at(-1)?.updatedAt ?? sinceParam ?? null },
    { headers: NO_STORE }
  );
}
