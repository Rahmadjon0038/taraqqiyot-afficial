import crypto from "node:crypto";
import { buildLeadText } from "@/lib/lead-message";
import { logEvent, readLeads, serializeLeadSubmissions } from "@/lib/leads-log";
import { STATUSES, STATUS_PREFIX, keyboard, tashkentTime, tg } from "@/lib/telegram";

// CRM operator ariza holatini belgilaydi ("keldi", "kelmaydi"...). Natija Telegramdagi tugmalar
// bilan bir xil: jurnalga yoziladi (/hisobot shuni sanaydi) va guruhdagi xabar yangilanadi.
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };

function isAuthorized(request) {
  const given = Buffer.from(request.headers.get("x-api-key") ?? "");
  const wanted = Buffer.from(process.env.CRM_API_KEY ?? "");
  return given.length === wanted.length && crypto.timingSafeEqual(given, wanted);
}

function reply(body, status = 200) {
  return Response.json(body, { status, headers: NO_STORE });
}

// POST /api/crm/leads/status   { "id": "-100123:45", "status": "keldi", "by": "Operator Ali" }
export async function POST(request) {
  if (!process.env.CRM_API_KEY) return reply({ error: "not_configured" }, 503);
  if (!isAuthorized(request)) return reply({ error: "unauthorized" }, 401);

  let body;
  try {
    body = await request.json();
  } catch {
    return reply({ error: "invalid_json" }, 400);
  }

  const id = typeof body?.id === "string" ? body.id : "";
  const status = typeof body?.status === "string" ? body.status : "";
  const by = typeof body?.by === "string" && body.by.trim() ? body.by.trim().slice(0, 60) : "CRM";

  if (!Object.hasOwn(STATUSES, status)) {
    return reply({ error: "invalid_status", allowed: Object.keys(STATUSES) }, 400);
  }

  // Telegram tugmalari va CRM bir vaqtda bosilsa, jurnalga yozish tartibli bo'lsin.
  return serializeLeadSubmissions(async () => {
    const lead = (await readLeads()).find((item) => item.id === id);
    if (!lead) return reply({ error: "not_found" }, 404);

    if (lead.status === status) {
      return reply({ ok: true, id, status, changed: false });
    }

    await logEvent({ type: "status", id, status, by });

    // Telegramdagi xabarni ham yangilaymiz. Bu muvaffaqiyatsiz bo'lsa ham holat jurnalda saqlangan.
    const separator = id.lastIndexOf(":");
    const edited = await tg("editMessageText", {
      chat_id: id.slice(0, separator),
      message_id: Number(id.slice(separator + 1)),
      text: `${buildLeadText(lead)}\n\n${STATUS_PREFIX} ${STATUSES[status].label} — ${by} (${tashkentTime()})`,
      reply_markup: keyboard(status),
    });
    if (!edited.ok && !edited.description?.includes("not modified")) {
      console.error("CRM: Telegram xabarini yangilab bo'lmadi:", edited.description);
    }

    return reply({ ok: true, id, status, changed: true, telegramUpdated: Boolean(edited.ok) });
  });
}
